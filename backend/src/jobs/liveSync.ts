import { Worker } from "bullmq";
import { connection, queues } from "./queue";
import { db } from "../db/client";
import { matches, matchEvents } from "../db/schema";
import { eq } from "drizzle-orm";
import { getLiveFixtures } from "../api/football/fixtures";
import { redis } from "../cache/upstash";
import { CACHE_KEYS, TTL } from "../cache/keys";
import { broadcast } from "../ws/rooms";

type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";

function statusFromShort(short: string): MatchStatus {
  if (["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"].includes(short)) return "LIVE";
  if (["FT", "AET", "PEN"].includes(short)) return "FINISHED";
  if (["PST"].includes(short)) return "POSTPONED";
  if (["CANC", "ABD", "AWD", "WO"].includes(short)) return "CANCELLED";
  return "SCHEDULED";
}

interface SnapshotEntry {
  homeScore: number;
  awayScore: number;
  status: string;
  minute: number;
}

export const liveSyncWorker = new Worker(
  "live-sync",
  async () => {
    try {
      const fixtures = await getLiveFixtures();
      const prevSnapshot =
        (await redis.get<Record<number, SnapshotEntry>>(CACHE_KEYS.liveSnapshot)) ?? {};

      const matchSummaries: unknown[] = [];
      const newSnapshot: Record<number, SnapshotEntry> = { ...prevSnapshot };

      for (const fixture of fixtures) {
        const fixtureId = fixture.fixture.id;
        const homeScore = fixture.goals.home ?? 0;
        const awayScore = fixture.goals.away ?? 0;
        const status = statusFromShort(fixture.fixture.status.short);
        const minute = fixture.fixture.status.elapsed ?? 0;
        const prev = prevSnapshot[fixtureId];

        // Trigger lineup fetch on LIVE transition
        if (status === "LIVE" && prev?.status !== "LIVE") {
          await queues.lineupFetch.add("fetch-lineup", { fixtureId }, { attempts: 3 });
        }

        // Only update DB/broadcast if something changed
        const changed =
          !prev ||
          prev.homeScore !== homeScore ||
          prev.awayScore !== awayScore ||
          prev.status !== status;

        if (changed) {
          await db
            .update(matches)
            .set({ homeScore, awayScore, status, minute, updatedAt: new Date() })
            .where(eq(matches.apiFootballId, fixtureId));

          if (prev) {
            if (prev.homeScore !== homeScore || prev.awayScore !== awayScore) {
              broadcast(`match:${fixtureId}`, {
                type: "score_update",
                matchId: fixtureId,
                homeScore,
                awayScore,
                minute,
              });
            }
            if (prev.status !== status) {
              broadcast(`match:${fixtureId}`, {
                type: "status_change",
                matchId: fixtureId,
                status,
              });
            }
          }
        }

        newSnapshot[fixtureId] = { homeScore, awayScore, status, minute };
        matchSummaries.push({ fixtureId, homeScore, awayScore, status, minute });
      }

      await redis.set(CACHE_KEYS.liveSnapshot, newSnapshot, { ex: TTL.liveSnapshot });
      broadcast("global:live", { type: "live_update", matches: matchSummaries });
    } catch (err) {
      console.error("liveSync error:", err);
    }
  },
  { connection }
);

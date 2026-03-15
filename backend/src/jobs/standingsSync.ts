import { Worker } from "bullmq";
import { connection } from "./queue";
import { db } from "../db/client";
import { standings, leagues, clubs } from "../db/schema";
import { eq } from "drizzle-orm";
import { getStandings } from "../api/football/standings";
import { redis } from "../cache/upstash";
import { CACHE_KEYS, TTL } from "../cache/keys";

const TOP_5_LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 78, name: "Bundesliga" },
  { id: 135, name: "Serie A" },
  { id: 61, name: "Ligue 1" },
];

const CURRENT_SEASON = 2024;

export const standingsSyncWorker = new Worker(
  "standings-sync",
  async () => {
    for (const league of TOP_5_LEAGUES) {
      try {
        const data = await getStandings(league.id, CURRENT_SEASON);
        if (!data || data.length === 0) continue;

        const standingsData = data;

        const leagueRecord = await db.query.leagues.findFirst({
          where: eq(leagues.apiFootballId, league.id),
        });
        if (!leagueRecord) continue;

        for (const standing of standingsData) {
          const club = await db.query.clubs.findFirst({
            where: eq(clubs.apiFootballId, standing.team.id),
          });
          if (!club) continue;

          await db
            .insert(standings)
            .values({
              leagueId: leagueRecord.id,
              clubId: club.id,
              season: CURRENT_SEASON,
              rank: standing.rank,
              points: standing.points,
              played: standing.all.played,
              won: standing.all.win,
              drawn: standing.all.draw,
              lost: standing.all.lose,
              goalsFor: standing.all.goals.for,
              goalsAgainst: standing.all.goals.against,
              goalDiff: standing.goalsDiff,
              form: standing.form,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: [standings.leagueId, standings.clubId, standings.season],
              set: {
                rank: standing.rank,
                points: standing.points,
                played: standing.all.played,
                won: standing.all.win,
                drawn: standing.all.draw,
                lost: standing.all.lose,
                goalsFor: standing.all.goals.for,
                goalsAgainst: standing.all.goals.against,
                goalDiff: standing.goalsDiff,
                form: standing.form,
                updatedAt: new Date(),
              },
            });
        }

        await redis.set(CACHE_KEYS.standings(league.id, CURRENT_SEASON), standingsData, {
          ex: TTL.standings,
        });

        console.log(`Standings synced for ${league.name}`);
      } catch (err) {
        console.error(`Failed to sync standings for ${league.name}:`, err);
      }
    }
  },
  { connection }
);

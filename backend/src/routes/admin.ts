import { Hono } from "hono";
import { checkQuota } from "../api/football/quota";
import { db } from "../db/client";
import { standings, leagues, clubs } from "../db/schema";
import { eq } from "drizzle-orm";
import { getStandings } from "../api/football/standings";
import { redis } from "../cache/upstash";
import { CACHE_KEYS, TTL } from "../cache/keys";

const app = new Hono();

const TOP_5_LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 78, name: "Bundesliga" },
  { id: 135, name: "Serie A" },
  { id: 61, name: "Ligue 1" },
];

const CURRENT_SEASON = 2024;

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString(), service: "football-tactics-api" })
);

app.get("/quota", async (c) => {
  const quota = await checkQuota();
  return c.json(quota);
});

// Manual one-shot standings sync for all 5 leagues
app.post("/sync/standings", async (c) => {
  const results: { league: string; status: string; rows?: number; error?: string }[] = [];

  for (const league of TOP_5_LEAGUES) {
    try {
      const data = await getStandings(league.id, CURRENT_SEASON);
      if (!data || data.length === 0) {
        results.push({ league: league.name, status: "empty" });
        continue;
      }

      const standingsData = data[0];
      const leagueRecord = await db.query.leagues.findFirst({
        where: eq(leagues.apiFootballId, league.id),
      });
      if (!leagueRecord) {
        results.push({ league: league.name, status: "no_league_record" });
        continue;
      }

      let upserted = 0;
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
        upserted++;
      }

      await redis.set(CACHE_KEYS.standings(league.id, CURRENT_SEASON), standingsData, {
        ex: TTL.standings,
      });

      results.push({ league: league.name, status: "ok", rows: upserted });
    } catch (err) {
      results.push({ league: league.name, status: "error", error: String(err) });
    }
  }

  const quota = await checkQuota();
  return c.json({ synced: results, quota });
});

// Manual live fixture poll
app.post("/sync/live", async (c) => {
  try {
    const { getLiveFixtures } = await import("../api/football/fixtures");
    const fixtures = await getLiveFixtures();
    const quota = await checkQuota();
    return c.json({ count: fixtures.length, fixtures, quota });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

export default app;

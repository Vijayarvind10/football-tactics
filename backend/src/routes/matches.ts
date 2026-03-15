import { Hono } from "hono";
import { db } from "../db/client";
import { matches, matchEvents, matchLineups, clubs } from "../db/schema";
import { eq, or, desc, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redis } from "../cache/upstash";
import { CACHE_KEYS, TTL } from "../cache/keys";

const app = new Hono();

function matchSelectShape() {
  const homeClub = alias(clubs, "home_club");
  const awayClub = alias(clubs, "away_club");
  return {
    homeClub,
    awayClub,
    select: {
      id: matches.id,
      kickoff: matches.kickoff,
      status: matches.status,
      minute: matches.minute,
      homeScore: matches.homeScore,
      awayScore: matches.awayScore,
      homeFormation: matches.homeFormation,
      awayFormation: matches.awayFormation,
      homeClub: { id: homeClub.id, name: homeClub.name },
      awayClub: { id: awayClub.id, name: awayClub.name },
    },
  };
}

app.get("/live", async (c) => {
  const { homeClub, awayClub, select } = matchSelectShape();

  const live = await db
    .select(select)
    .from(matches)
    .innerJoin(homeClub, eq(matches.homeClubId, homeClub.id))
    .innerJoin(awayClub, eq(matches.awayClubId, awayClub.id))
    .where(eq(matches.status, "LIVE"));

  return c.json(live);
});

app.get("/head-to-head", async (c) => {
  const idA = Number(c.req.query("a"));
  const idB = Number(c.req.query("b"));
  if (!idA || !idB) return c.json({ error: "Query params a and b required" }, 400);

  const { homeClub, awayClub, select } = matchSelectShape();

  const h2h = await db
    .select(select)
    .from(matches)
    .innerJoin(homeClub, eq(matches.homeClubId, homeClub.id))
    .innerJoin(awayClub, eq(matches.awayClubId, awayClub.id))
    .where(
      or(
        and(eq(matches.homeClubId, idA), eq(matches.awayClubId, idB)),
        and(eq(matches.homeClubId, idB), eq(matches.awayClubId, idA))
      )
    )
    .orderBy(desc(matches.kickoff))
    .limit(20);

  return c.json(h2h);
});

app.get("/:matchId", async (c) => {
  const matchId = Number(c.req.param("matchId"));
  const { homeClub, awayClub, select } = matchSelectShape();

  const result = await db
    .select(select)
    .from(matches)
    .innerJoin(homeClub, eq(matches.homeClubId, homeClub.id))
    .innerJoin(awayClub, eq(matches.awayClubId, awayClub.id))
    .where(eq(matches.id, matchId))
    .limit(1);

  if (!result[0]) return c.json({ error: "Match not found" }, 404);
  return c.json(result[0]);
});

app.get("/:matchId/events", async (c) => {
  const matchId = Number(c.req.param("matchId"));
  const events = await db
    .select()
    .from(matchEvents)
    .where(eq(matchEvents.matchId, matchId))
    .orderBy(matchEvents.minute);
  return c.json(events);
});

app.get("/:matchId/lineup", async (c) => {
  const matchId = Number(c.req.param("matchId"));
  const cacheKey = CACHE_KEYS.lineup(matchId);
  const cached = await redis.get(cacheKey);
  if (cached) return c.json(cached);

  const lineups = await db
    .select()
    .from(matchLineups)
    .where(eq(matchLineups.matchId, matchId));

  await redis.set(cacheKey, lineups, { ex: TTL.lineup });
  return c.json(lineups);
});

export default app;

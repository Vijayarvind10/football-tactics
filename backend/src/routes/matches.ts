import { Hono } from "hono";
import { db } from "../db/client";
import { matches, matchEvents, matchLineups } from "../db/schema";
import { eq, or, desc, and } from "drizzle-orm";
import { redis } from "../cache/upstash";
import { CACHE_KEYS, TTL } from "../cache/keys";

const app = new Hono();

app.get("/live", async (c) => {
  const cached = await redis.get(CACHE_KEYS.liveSnapshot);
  if (cached) return c.json(cached);

  const live = await db.select().from(matches).where(eq(matches.status, "LIVE"));
  return c.json(live);
});

app.get("/head-to-head", async (c) => {
  const idA = Number(c.req.query("a"));
  const idB = Number(c.req.query("b"));
  if (!idA || !idB) return c.json({ error: "Query params a and b required" }, 400);

  const cacheKey = CACHE_KEYS.h2h(idA, idB);
  const cached = await redis.get(cacheKey);
  if (cached) return c.json(cached);

  const h2h = await db
    .select()
    .from(matches)
    .where(
      or(
        and(eq(matches.homeClubId, idA), eq(matches.awayClubId, idB)),
        and(eq(matches.homeClubId, idB), eq(matches.awayClubId, idA))
      )
    )
    .orderBy(desc(matches.kickoff))
    .limit(20);

  await redis.set(cacheKey, h2h, { ex: TTL.h2h });
  return c.json(h2h);
});

app.get("/:matchId", async (c) => {
  const matchId = Number(c.req.param("matchId"));
  const match = await db.query.matches.findFirst({ where: eq(matches.id, matchId) });
  if (!match) return c.json({ error: "Match not found" }, 404);
  return c.json(match);
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

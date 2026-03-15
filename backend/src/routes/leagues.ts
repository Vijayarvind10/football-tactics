import { Hono } from "hono";
import { db } from "../db/client";
import { leagues, standings, clubs, matches } from "../db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { redis } from "../cache/upstash";
import { CACHE_KEYS } from "../cache/keys";

const app = new Hono();

app.get("/", async (c) => {
  const all = await db.select().from(leagues);
  return c.json(all);
});

app.get("/:leagueId/standings", async (c) => {
  const leagueId = Number(c.req.param("leagueId"));
  const season = Number(c.req.query("season") ?? 2024);

  const cached = await redis.get(CACHE_KEYS.standings(leagueId, season));
  if (cached) return c.json(cached);

  const result = await db
    .select({
      standing: standings,
      club: clubs,
    })
    .from(standings)
    .innerJoin(clubs, eq(standings.clubId, clubs.id))
    .where(and(eq(standings.leagueId, leagueId), eq(standings.season, season)))
    .orderBy(asc(standings.rank));

  return c.json(result);
});

app.get("/:leagueId/matches", async (c) => {
  const leagueId = Number(c.req.param("leagueId"));
  const limit = Number(c.req.query("limit") ?? 20);

  const result = await db
    .select()
    .from(matches)
    .where(eq(matches.leagueId, leagueId))
    .orderBy(desc(matches.kickoff))
    .limit(limit);

  return c.json(result);
});

export default app;

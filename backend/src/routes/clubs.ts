import { Hono } from "hono";
import { db } from "../db/client";
import { clubs, formations, matches, leagues } from "../db/schema";
import { eq, and, desc, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const app = new Hono();

app.get("/compare", async (c) => {
  const idA = Number(c.req.query("a"));
  const idB = Number(c.req.query("b"));

  if (!idA || !idB) return c.json({ error: "Query params a and b required" }, 400);

  const [clubA, clubB] = await Promise.all([
    db.query.clubs.findFirst({ where: eq(clubs.id, idA) }),
    db.query.clubs.findFirst({ where: eq(clubs.id, idB) }),
  ]);

  return c.json({ clubA, clubB });
});

app.get("/:clubId", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const result = await db
    .select({
      id: clubs.id,
      name: clubs.name,
      shortName: clubs.shortName,
      crestUrl: clubs.crestUrl,
      country: clubs.country,
      apiFootballId: clubs.apiFootballId,
      league: { id: leagues.id, name: leagues.name },
    })
    .from(clubs)
    .leftJoin(leagues, eq(clubs.leagueId, leagues.id))
    .where(eq(clubs.id, clubId))
    .limit(1);

  if (!result[0]) return c.json({ error: "Club not found" }, 404);
  return c.json(result[0]);
});

app.get("/:clubId/formations", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const season = Number(c.req.query("season") ?? 2024);

  const result = await db
    .select({
      formation: formations.formation,
      season: formations.season,
      usedCount: sql<number>`count(*)::int`,
      wins: sql<number>`sum(case when ${formations.won} then 1 else 0 end)::int`,
      draws: sql<number>`sum(case when ${formations.drew} then 1 else 0 end)::int`,
      losses: sql<number>`sum(case when not ${formations.won} and not ${formations.drew} then 1 else 0 end)::int`,
    })
    .from(formations)
    .where(and(eq(formations.clubId, clubId), eq(formations.season, season)))
    .groupBy(formations.formation, formations.season)
    .orderBy(desc(sql`count(*)`));

  return c.json(result);
});

app.get("/:clubId/matches", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const limit = Number(c.req.query("limit") ?? 10);

  const homeClub = alias(clubs, "home_club");
  const awayClub = alias(clubs, "away_club");

  const result = await db
    .select({
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
    })
    .from(matches)
    .innerJoin(homeClub, eq(matches.homeClubId, homeClub.id))
    .innerJoin(awayClub, eq(matches.awayClubId, awayClub.id))
    .where(or(eq(matches.homeClubId, clubId), eq(matches.awayClubId, clubId)))
    .orderBy(desc(matches.kickoff))
    .limit(limit);

  return c.json(result);
});

export default app;

import { Hono } from "hono";
import { db } from "../db/client";
import { leagues, standings, clubs, matches } from "../db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const app = new Hono();

app.get("/", async (c) => {
  const all = await db.select().from(leagues);
  return c.json(all);
});

app.get("/:leagueId/standings", async (c) => {
  const leagueId = Number(c.req.param("leagueId"));
  const season = Number(c.req.query("season") ?? 2024);

  const result = await db
    .select({
      rank: standings.rank,
      points: standings.points,
      played: standings.played,
      won: standings.won,
      drawn: standings.drawn,
      lost: standings.lost,
      goalsFor: standings.goalsFor,
      goalsAgainst: standings.goalsAgainst,
      goalDiff: standings.goalDiff,
      form: standings.form,
      club: {
        id: clubs.id,
        name: clubs.name,
        crestUrl: clubs.crestUrl,
      },
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
    .where(eq(matches.leagueId, leagueId))
    .orderBy(desc(matches.kickoff))
    .limit(limit);

  return c.json(result);
});

export default app;

import { Hono } from "hono";
import { db } from "../db/client";
import { clubs, formations, matches } from "../db/schema";
import { eq, and, desc, or } from "drizzle-orm";

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
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  if (!club) return c.json({ error: "Club not found" }, 404);
  return c.json(club);
});

app.get("/:clubId/formations", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const season = Number(c.req.query("season") ?? 2024);

  const result = await db
    .select()
    .from(formations)
    .where(and(eq(formations.clubId, clubId), eq(formations.season, season)))
    .orderBy(desc(formations.usedAt));

  return c.json(result);
});

app.get("/:clubId/matches", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const limit = Number(c.req.query("limit") ?? 10);

  const result = await db
    .select()
    .from(matches)
    .where(or(eq(matches.homeClubId, clubId), eq(matches.awayClubId, clubId)))
    .orderBy(desc(matches.kickoff))
    .limit(limit);

  return c.json(result);
});

export default app;

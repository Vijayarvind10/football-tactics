import { Hono } from "hono";
import { db } from "../db/client";
import { formations, matchLineups } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

const app = new Hono();

app.get("/history/:clubId", async (c) => {
  const clubId = Number(c.req.param("clubId"));
  const season = Number(c.req.query("season") ?? 2024);

  const history = await db
    .select()
    .from(formations)
    .where(and(eq(formations.clubId, clubId), eq(formations.season, season)))
    .orderBy(desc(formations.usedAt));

  return c.json(history);
});

app.get("/:matchId/:clubApiId", async (c) => {
  const matchId = Number(c.req.param("matchId"));
  const clubApiId = Number(c.req.param("clubApiId"));

  const lineup = await db.query.matchLineups.findFirst({
    where: and(eq(matchLineups.matchId, matchId), eq(matchLineups.clubApiId, clubApiId)),
  });

  if (!lineup) return c.json({ error: "Formation not found" }, 404);
  return c.json(lineup);
});

export default app;

import { Hono } from "hono";
import { db } from "../db/client";
import { players } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/:playerId", async (c) => {
  const playerId = Number(c.req.param("playerId"));
  const player = await db.query.players.findFirst({ where: eq(players.id, playerId) });
  if (!player) return c.json({ error: "Player not found" }, 404);
  return c.json(player);
});

app.get("/:playerId/stats", async (c) => {
  const playerId = Number(c.req.param("playerId"));
  const player = await db.query.players.findFirst({ where: eq(players.id, playerId) });
  return c.json({ player, stats: {} });
});

app.get("/:playerId/heatmap", async (c) => {
  const playerId = Number(c.req.param("playerId"));
  const player = await db.query.players.findFirst({ where: eq(players.id, playerId) });

  const positionCenters: Record<string, { x: number; y: number }> = {
    G: { x: 0.5, y: 0.95 },
    D: { x: 0.5, y: 0.75 },
    M: { x: 0.5, y: 0.5 },
    F: { x: 0.5, y: 0.2 },
  };

  const pos = player?.position?.[0] ?? "M";
  const center = positionCenters[pos] ?? { x: 0.5, y: 0.5 };

  const points = Array.from({ length: 25 }, () => ({
    x: Math.max(0.05, Math.min(0.95, center.x + (Math.random() - 0.5) * 0.3)),
    y: Math.max(0.05, Math.min(0.95, center.y + (Math.random() - 0.5) * 0.25)),
    weight: Math.random() * 0.8 + 0.2,
  }));

  return c.json({ playerId, position: player?.position, center, heatmap: points });
});

export default app;

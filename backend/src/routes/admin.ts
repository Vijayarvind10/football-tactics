import { Hono } from "hono";
import { checkQuota } from "../api/football/quota";

const app = new Hono();

app.get("/quota", async (c) => {
  const quota = await checkQuota();
  return c.json(quota);
});

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString(), service: "football-tactics-api" })
);

export default app;

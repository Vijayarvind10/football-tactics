import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./lib/env";
import { errorHandler } from "./middleware/errorHandler";
import { httpLogger } from "./middleware/logger";
import leaguesRouter from "./routes/leagues";
import clubsRouter from "./routes/clubs";
import matchesRouter from "./routes/matches";
import playersRouter from "./routes/players";
import formationsRouter from "./routes/formations";
import adminRouter from "./routes/admin";
import { setupWebSocket, websocket } from "./ws/handler";
import { queues } from "./jobs/queue";
import "./jobs/liveSync";
import "./jobs/standingsSync";

const app = new Hono();

app.use("*", httpLogger);
app.use("*", errorHandler);
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      if (
        origin === "http://localhost:3000" ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".railway.app")
      ) {
        return origin;
      }
      return undefined;
    },
    credentials: true,
  })
);

app.route("/api/leagues", leaguesRouter);
app.route("/api/clubs", clubsRouter);
app.route("/api/matches", matchesRouter);
app.route("/api/players", playersRouter);
app.route("/api/formations", formationsRouter);
app.route("/api/admin", adminRouter);

app.get("/", (c) =>
  c.json({ name: "Football Tactics API", version: "1.0.0", status: "running" })
);

setupWebSocket(app);

async function scheduleJobs() {
  await queues.liveSync.add(
    "live-poll",
    {},
    { repeat: { every: 60_000 }, removeOnComplete: 100, removeOnFail: 50 }
  );
  await queues.standingsSync.add(
    "daily-standings",
    {},
    { repeat: { pattern: "0 2 * * *" }, removeOnComplete: 10 }
  );
  console.log("⚡ Background jobs scheduled");
}

scheduleJobs().catch(console.error);

console.log(`⚡ Football Tactics API running on http://localhost:${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};

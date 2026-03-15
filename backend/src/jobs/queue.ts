import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

// BullMQ requires IORedis TCP connection (not REST).
// REDIS_URL format: rediss://default:TOKEN@hostname:6379
const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

export const queues = {
  liveSync: new Queue("live-sync", { connection }),
  standingsSync: new Queue("standings-sync", { connection }),
  fixtureSync: new Queue("fixture-sync", { connection }),
  formationSync: new Queue("formation-sync", { connection }),
  lineupFetch: new Queue("lineup-fetch", { connection }),
};

export { connection };

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

// BullMQ requires ioredis. We use Upstash Redis's ioredis-compatible endpoint.
const connection = new IORedis(process.env.UPSTASH_REDIS_REST_URL!, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  tls: {},
  maxRetriesPerRequest: null,
});

export const queues = {
  liveSync: new Queue("live-sync", { connection }),
  standingsSync: new Queue("standings-sync", { connection }),
  fixtureSync: new Queue("fixture-sync", { connection }),
  formationSync: new Queue("formation-sync", { connection }),
  lineupFetch: new Queue("lineup-fetch", { connection }),
};

export { connection };

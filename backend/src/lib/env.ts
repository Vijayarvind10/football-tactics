import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    API_FOOTBALL_KEY: z.string().min(1),
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
});

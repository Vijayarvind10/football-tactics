import { describe, it, expect, mock } from "bun:test";

// Set env vars BEFORE any module imports that trigger env validation
process.env.DATABASE_URL = "postgresql://test:test@localhost/test";
process.env.UPSTASH_REDIS_REST_URL = "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
process.env.API_FOOTBALL_KEY = "test-key";

// Also mock quota to avoid Redis connection attempts
mock.module("../api/football/quota", () => ({
  checkQuota: async () => ({ allowed: true, used: 5, remaining: 95 }),
  incrementQuota: async () => 6,
  withQuota: async (fn: () => Promise<unknown>) => fn(),
}));

import { Hono } from "hono";
import adminRouter from "./admin";

const app = new Hono();
app.route("/admin", adminRouter);

describe("GET /admin/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await app.request("/admin/health");
    expect(res.status).toBe(200);
    const json = await res.json() as { status: string };
    expect(json.status).toBe("ok");
  });

  it("includes timestamp", async () => {
    const res = await app.request("/admin/health");
    const json = await res.json() as { timestamp: string };
    expect(json.timestamp).toBeDefined();
    expect(new Date(json.timestamp).getTime()).not.toBeNaN();
  });
});

describe("GET /admin/quota", () => {
  it("returns quota data", async () => {
    const res = await app.request("/admin/quota");
    expect(res.status).toBe(200);
    const json = await res.json() as { allowed: boolean; used: number; remaining: number };
    expect(json.allowed).toBeDefined();
    expect(typeof json.used).toBe("number");
    expect(typeof json.remaining).toBe("number");
  });
});

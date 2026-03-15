import { redis } from "../../cache/upstash";
import { CACHE_KEYS } from "../../cache/keys";

const DAILY_LIMIT = 100;
const SOFT_LIMIT = 90;

export async function checkQuota(): Promise<{ allowed: boolean; remaining: number; used: number }> {
  const key = CACHE_KEYS.quotaDaily();
  const used = await redis.get<number>(key) ?? 0;
  const remaining = DAILY_LIMIT - used;
  return { allowed: used < SOFT_LIMIT, remaining, used };
}

export async function incrementQuota(): Promise<number> {
  const key = CACHE_KEYS.quotaDaily();
  const count = await redis.incr(key);
  // Set TTL to expire at midnight UTC
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);
  if (count === 1) {
    await redis.expire(key, ttl);
  }
  return count;
}

export async function withQuota<T>(fn: () => Promise<T>): Promise<T> {
  const { allowed } = await checkQuota();
  if (!allowed) {
    throw new Error("API-Football daily quota exhausted (90 call soft limit reached)");
  }
  await incrementQuota();
  return fn();
}

import { describe, it, expect } from "bun:test";
import { CACHE_KEYS } from "./keys";

describe("CACHE_KEYS", () => {
  it("generates standings key", () => {
    expect(CACHE_KEYS.standings(39, 2024)).toBe("standings:39:2024");
  });

  it("generates h2h key consistently regardless of argument order", () => {
    expect(CACHE_KEYS.h2h(1, 2)).toBe(CACHE_KEYS.h2h(2, 1));
  });

  it("generates quota key with today's date", () => {
    const key = CACHE_KEYS.quotaDaily();
    const today = new Date().toISOString().split("T")[0];
    expect(key).toBe(`quota:daily:${today}`);
  });

  it("generates lineup key", () => {
    expect(CACHE_KEYS.lineup(42)).toBe("lineup:42");
  });

  it("generates fixture key", () => {
    expect(CACHE_KEYS.fixtures(39, 2024, "2024-W01")).toBe("fixtures:39:2024:2024-W01");
  });

  it("generates player stats key", () => {
    expect(CACHE_KEYS.playerStats(100, 2024)).toBe("player:100:2024");
  });
});

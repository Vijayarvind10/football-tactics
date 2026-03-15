export const CACHE_KEYS = {
  liveSnapshot: "live:snapshot",
  standings: (leagueId: number, season: number) => `standings:${leagueId}:${season}`,
  fixtures: (leagueId: number, season: number, week: string) => `fixtures:${leagueId}:${season}:${week}`,
  lineup: (matchId: number) => `lineup:${matchId}`,
  h2h: (clubIdA: number, clubIdB: number) => `h2h:${Math.min(clubIdA, clubIdB)}:${Math.max(clubIdA, clubIdB)}`,
  playerStats: (playerId: number, season: number) => `player:${playerId}:${season}`,
  predictions: (matchId: number) => `predictions:${matchId}`,
  matchStats: (matchId: number) => `match:stats:${matchId}`,
  quotaDaily: () => `quota:daily:${new Date().toISOString().split("T")[0]}`,
} as const;

export const TTL = {
  liveSnapshot: 55,
  standings: 86400,
  fixtures: 604800,
  lineup: 86400,
  h2h: 604800,
  playerStats: 86400,
  predictions: 86400,
  matchStats: 240,
} as const;

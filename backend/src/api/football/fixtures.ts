import { footballApi } from "./client";

export interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  league: { id: number; season: number };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
  score: { halftime: { home: number | null; away: number | null } };
}

export async function getLiveFixtures(): Promise<ApiFixture[]> {
  return footballApi<ApiFixture[]>("/fixtures", { live: "all" });
}

export async function getFixturesByLeague(
  leagueId: number,
  season: number,
  from: string,
  to: string
): Promise<ApiFixture[]> {
  return footballApi<ApiFixture[]>("/fixtures", { league: leagueId, season, from, to });
}

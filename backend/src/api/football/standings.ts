import { footballApi } from "./client";

export interface ApiStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export async function getStandings(leagueId: number, season: number): Promise<ApiStanding[][]> {
  return footballApi<ApiStanding[][]>("/standings", { league: leagueId, season });
}

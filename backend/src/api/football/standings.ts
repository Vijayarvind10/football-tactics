import { footballApi } from "./client";

export interface ApiStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

interface ApiStandingsResponse {
  league: {
    id: number;
    name: string;
    standings: ApiStanding[][];
  };
}

export async function getStandings(leagueId: number, season: number): Promise<ApiStanding[]> {
  const response = await footballApi<ApiStandingsResponse[]>("/standings", { league: leagueId, season });
  return response?.[0]?.league?.standings?.[0] ?? [];
}

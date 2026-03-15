import { footballApi } from "./client";

export interface ApiLineup {
  team: { id: number; name: string };
  formation: string;
  startXI: Array<{
    player: { id: number; name: string; number: number; pos: string; grid: string };
  }>;
  substitutes: Array<{
    player: { id: number; name: string; number: number; pos: string; grid: string | null };
  }>;
}

export async function getFixtureLineups(fixtureId: number): Promise<ApiLineup[]> {
  return footballApi<ApiLineup[]>("/fixtures/lineups", { fixture: fixtureId });
}

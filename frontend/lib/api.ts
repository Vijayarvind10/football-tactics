const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export interface League {
  id: number;
  name: string;
  country: string;
  season: number;
  apiFootballId: number;
}

export interface Standing {
  rank: number;
  points: number;
  form: string;
  club: { id: number; name: string };
}

export interface Match {
  id: number;
  kickoff: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
  homeScore: number | null;
  awayScore: number | null;
  homeFormation: string | null;
  awayFormation: string | null;
  homeClub: { id: number; name: string };
  awayClub: { id: number; name: string };
  minute?: number;
}

export interface Club {
  id: number;
  name: string;
  country: string;
  apiFootballId: number;
  league: { id: number; name: string };
}

export interface Formation {
  formation: string;
  usedCount: number;
  wins: number;
  draws: number;
  losses: number;
  season: number;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  jerseyNumber?: number;
  gridPosition?: string;
}

export interface Lineup {
  matchId: number;
  clubApiId: number;
  formation: string;
  players: Player[];
}

export const api = {
  leagues: {
    list: () => get<League[]>("/api/leagues"),
    standings: (leagueId: number) => get<Standing[]>(`/api/leagues/${leagueId}/standings`),
    matches: (leagueId: number) => get<Match[]>(`/api/leagues/${leagueId}/matches`),
  },
  matches: {
    live: () => get<Match[]>("/api/matches/live"),
    get: (matchId: number) => get<Match>(`/api/matches/${matchId}`),
    lineup: (matchId: number) => get<{ home: Lineup; away: Lineup }>(`/api/matches/${matchId}/lineup`),
    events: (matchId: number) => get<unknown[]>(`/api/matches/${matchId}/events`),
    headToHead: (a: number, b: number) => get<Match[]>(`/api/matches/head-to-head?a=${a}&b=${b}`),
  },
  clubs: {
    get: (clubId: number) => get<Club>(`/api/clubs/${clubId}`),
    formations: (clubId: number, season?: number) =>
      get<Formation[]>(`/api/clubs/${clubId}/formations${season ? `?season=${season}` : ""}`),
    matches: (clubId: number) => get<Match[]>(`/api/clubs/${clubId}/matches`),
    compare: (a: number, b: number) => get<unknown>(`/api/clubs/compare?a=${a}&b=${b}`),
  },
};

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
export type EventType = "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "VAR" | "PENALTY_MISSED";

export interface MatchEvent {
  id: number;
  minute: number;
  type: EventType;
  playerName: string;
  teamId?: number;
}

export interface MatchSummary {
  id: number;
  kickoff: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  homeClub: { id: number; name: string };
  awayClub: { id: number; name: string };
  minute?: number;
}

export type WsMessage =
  | { type: "score_update"; matchId: number; homeScore: number; awayScore: number; minute: number }
  | { type: "match_event"; matchId: number; eventType: EventType; minute: number; playerName: string; teamId: number }
  | { type: "status_change"; matchId: number; status: MatchStatus }
  | { type: "live_update"; matches: MatchSummary[] };

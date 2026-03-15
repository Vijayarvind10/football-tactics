import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const getRecentMatchesSchema = z.object({
  clubId: z.number().describe("The internal club ID"),
  limit: z.number().optional().default(5).describe("Number of recent matches to return (default: 5)"),
});

interface MatchRow {
  id: number;
  kickoff: string;
  status: string;
  home_club_id: number;
  away_club_id: number;
  home_club_name: string;
  away_club_name: string;
  home_score: number;
  away_score: number;
  home_formation: string | null;
  away_formation: string | null;
}

function deriveOutcome(match: MatchRow, clubId: number): "win" | "draw" | "loss" | "pending" {
  if (match.status !== "FINISHED") return "pending";
  const isHome = match.home_club_id === clubId;
  const clubGoals = isHome ? match.home_score : match.away_score;
  const opponentGoals = isHome ? match.away_score : match.home_score;
  if (clubGoals > opponentGoals) return "win";
  if (clubGoals === opponentGoals) return "draw";
  return "loss";
}

export async function getRecentMatches(input: z.infer<typeof getRecentMatchesSchema>) {
  const { clubId, limit } = input;

  const rows = await db.execute(sql`
    SELECT m.id, m.kickoff, m.status,
      m.home_club_id, m.away_club_id,
      hc.name as home_club_name,
      ac.name as away_club_name,
      m.home_score, m.away_score,
      m.home_formation, m.away_formation
    FROM matches m
    JOIN clubs hc ON m.home_club_id = hc.id
    JOIN clubs ac ON m.away_club_id = ac.id
    WHERE m.home_club_id = ${clubId} OR m.away_club_id = ${clubId}
    ORDER BY m.kickoff DESC
    LIMIT ${limit}
  `);

  const matches = (rows.rows as MatchRow[]).map((m) => {
    const isHome = m.home_club_id === clubId;
    return {
      id: m.id,
      kickoff: m.kickoff,
      status: m.status,
      isHome,
      opponent: isHome ? m.away_club_name : m.home_club_name,
      homeClub: m.home_club_name,
      awayClub: m.away_club_name,
      score: `${m.home_score}-${m.away_score}`,
      clubGoals: isHome ? m.home_score : m.away_score,
      opponentGoals: isHome ? m.away_score : m.home_score,
      formation: isHome ? m.home_formation : m.away_formation,
      outcome: deriveOutcome(m, clubId),
    };
  });

  return {
    clubId,
    limit,
    matches,
  };
}

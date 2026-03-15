import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const getHeadToHeadSchema = z.object({
  clubIdA: z.number().describe("First club's internal ID"),
  clubIdB: z.number().describe("Second club's internal ID"),
});

export async function getHeadToHead(input: z.infer<typeof getHeadToHeadSchema>) {
  const { clubIdA, clubIdB } = input;

  const rows = await db.execute(
    sql`SELECT m.id, m.kickoff, m.status, m.home_score, m.away_score,
        m.home_formation, m.away_formation,
        hc.name as home_club_name, ac.name as away_club_name,
        m.home_club_id, m.away_club_id
        FROM matches m
        JOIN clubs hc ON m.home_club_id = hc.id
        JOIN clubs ac ON m.away_club_id = ac.id
        WHERE (m.home_club_id = ${clubIdA} AND m.away_club_id = ${clubIdB})
           OR (m.home_club_id = ${clubIdB} AND m.away_club_id = ${clubIdA})
        ORDER BY m.kickoff DESC
        LIMIT 20`
  );

  const h2hMatches = rows.rows as Array<{
    home_club_id: number; away_club_id: number; home_score: number; away_score: number;
  }>;

  const stats = {
    clubAWins: 0,
    clubBWins: 0,
    draws: 0,
    totalGoalsA: 0,
    totalGoalsB: 0,
  };

  for (const m of h2hMatches) {
    const aIsHome = m.home_club_id === clubIdA;
    const aGoals = aIsHome ? m.home_score : m.away_score;
    const bGoals = aIsHome ? m.away_score : m.home_score;
    stats.totalGoalsA += aGoals;
    stats.totalGoalsB += bGoals;
    if (aGoals > bGoals) stats.clubAWins++;
    else if (bGoals > aGoals) stats.clubBWins++;
    else stats.draws++;
  }

  return { matches: h2hMatches, stats };
}

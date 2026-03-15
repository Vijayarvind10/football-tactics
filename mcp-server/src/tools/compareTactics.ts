import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const compareTacticsSchema = z.object({
  clubIdA: z.number().describe("First club's internal ID"),
  clubIdB: z.number().describe("Second club's internal ID"),
  season: z.number().optional().default(2024),
});

export async function compareTactics(input: z.infer<typeof compareTacticsSchema>) {
  const { clubIdA, clubIdB, season } = input;

  const [clubA, clubB] = await Promise.all([
    db.execute(sql`
      SELECT c.name, c.crest_url,
        s.rank, s.points, s.played, s.won, s.drawn, s.lost,
        s.goals_for, s.goals_against, s.goal_diff, s.form,
        (SELECT formation FROM formations WHERE club_id = ${clubIdA} AND season = ${season}
         GROUP BY formation ORDER BY COUNT(*) DESC LIMIT 1) as most_used_formation
      FROM clubs c
      LEFT JOIN standings s ON s.club_id = c.id AND s.season = ${season}
      WHERE c.id = ${clubIdA}
    `),
    db.execute(sql`
      SELECT c.name, c.crest_url,
        s.rank, s.points, s.played, s.won, s.drawn, s.lost,
        s.goals_for, s.goals_against, s.goal_diff, s.form,
        (SELECT formation FROM formations WHERE club_id = ${clubIdB} AND season = ${season}
         GROUP BY formation ORDER BY COUNT(*) DESC LIMIT 1) as most_used_formation
      FROM clubs c
      LEFT JOIN standings s ON s.club_id = c.id AND s.season = ${season}
      WHERE c.id = ${clubIdB}
    `),
  ]);

  return {
    clubA: clubA.rows[0],
    clubB: clubB.rows[0],
    season,
  };
}

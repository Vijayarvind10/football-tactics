import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const getStandingsSchema = z.object({
  leagueId: z.number().describe("The internal league ID"),
  season: z.number().optional().default(2024).describe("Season year (default: 2024)"),
});

export async function getStandings(input: z.infer<typeof getStandingsSchema>) {
  const { leagueId, season } = input;

  const [leagueRows, standingsRows] = await Promise.all([
    db.execute(sql`
      SELECT id, name, country, api_football_id
      FROM leagues
      WHERE id = ${leagueId}
      LIMIT 1
    `),
    db.execute(sql`
      SELECT s.rank, s.points, s.played, s.won, s.drawn, s.lost,
        s.goals_for, s.goals_against, s.goal_diff, s.form,
        c.id as club_id, c.name as club_name, c.crest_url, c.short_name
      FROM standings s
      JOIN clubs c ON s.club_id = c.id
      WHERE s.league_id = ${leagueId} AND s.season = ${season}
      ORDER BY s.rank ASC
    `),
  ]);

  return {
    league: leagueRows.rows[0] ?? null,
    season,
    table: standingsRows.rows,
  };
}

import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const getPlayerStatsSchema = z.object({
  playerId: z.number().describe("The internal player ID"),
  season: z.number().optional().default(2024).describe("Season year (default: 2024)"),
});

export async function getPlayerStats(input: z.infer<typeof getPlayerStatsSchema>) {
  const { playerId, season } = input;

  const [playerRows, appearanceRows, eventRows] = await Promise.all([
    db.execute(sql`
      SELECT p.id, p.name, p.position, p.nationality, p.date_of_birth, p.photo_url,
        c.id as club_id, c.name as club_name, c.crest_url
      FROM players p
      LEFT JOIN clubs c ON p.club_id = c.id
      WHERE p.id = ${playerId}
      LIMIT 1
    `),
    db.execute(sql`
      SELECT COUNT(DISTINCT mlp.lineup_id) as appearances,
        SUM(CASE WHEN mlp.is_sub = true THEN 1 ELSE 0 END) as sub_appearances,
        SUM(CASE WHEN mlp.is_sub = false THEN 1 ELSE 0 END) as starts
      FROM match_lineup_players mlp
      JOIN match_lineups ml ON mlp.lineup_id = ml.id
      JOIN matches m ON ml.match_id = m.id
      WHERE mlp.player_id = ${playerId}
        AND EXTRACT(YEAR FROM m.kickoff) = ${season}
    `),
    db.execute(sql`
      SELECT
        SUM(CASE WHEN me.type = 'GOAL' THEN 1 ELSE 0 END) as goals,
        SUM(CASE WHEN me.type = 'YELLOW_CARD' THEN 1 ELSE 0 END) as yellow_cards,
        SUM(CASE WHEN me.type = 'RED_CARD' THEN 1 ELSE 0 END) as red_cards,
        SUM(CASE WHEN me.type = 'SUBSTITUTION' THEN 1 ELSE 0 END) as substitutions
      FROM match_events me
      JOIN matches m ON me.match_id = m.id
      WHERE me.player_name = (
        SELECT name FROM players WHERE id = ${playerId} LIMIT 1
      )
      AND EXTRACT(YEAR FROM m.kickoff) = ${season}
    `),
  ]);

  const player = playerRows.rows[0] ?? null;
  const appearances = appearanceRows.rows[0] ?? {};
  const events = eventRows.rows[0] ?? {};

  return {
    player,
    season,
    stats: {
      appearances: Number(appearances.appearances ?? 0),
      starts: Number(appearances.starts ?? 0),
      subAppearances: Number(appearances.sub_appearances ?? 0),
      goals: Number(events.goals ?? 0),
      yellowCards: Number(events.yellow_cards ?? 0),
      redCards: Number(events.red_cards ?? 0),
      substitutions: Number(events.substitutions ?? 0),
    },
  };
}

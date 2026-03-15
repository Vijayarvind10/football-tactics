import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const getClubFormationsSchema = z.object({
  clubId: z.number().describe("The internal club ID"),
  season: z.number().optional().default(2024).describe("Season year (default: 2024)"),
});

export async function getClubFormations(input: z.infer<typeof getClubFormationsSchema>) {
  const { clubId, season } = input;

  const rows = await db.execute(
    sql`SELECT formation, COUNT(*) as used_count,
        SUM(CASE WHEN won = true THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN drew = true THEN 1 ELSE 0 END) as draws,
        SUM(CASE WHEN won = false AND drew = false THEN 1 ELSE 0 END) as losses,
        MIN(used_at) as first_used,
        MAX(used_at) as last_used
        FROM formations
        WHERE club_id = ${clubId} AND season = ${season}
        GROUP BY formation
        ORDER BY used_count DESC`
  );

  return {
    clubId,
    season,
    formations: rows.rows,
  };
}

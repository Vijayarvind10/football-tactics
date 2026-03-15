import { z } from "zod";
import { db } from "../db/client";
import { sql } from "drizzle-orm";

export const suggestTacticsSchema = z.object({
  attackingClubId: z.number().describe("The internal ID of the club that will be attacking / trying to win"),
  defendingClubId: z.number().describe("The internal ID of the opposing club to beat"),
});

interface FormationRow {
  formation: string;
  used_count: number;
  wins: number;
  draws: number;
  losses: number;
  win_rate: number;
}

const COUNTER_MAP: Record<string, string[]> = {
  "4-3-3": ["4-5-1", "5-3-2", "4-1-4-1"],
  "4-2-3-1": ["4-3-3", "3-4-3", "4-4-2"],
  "4-4-2": ["4-3-3", "4-2-3-1", "3-5-2"],
  "3-5-2": ["4-3-3", "4-4-2", "5-4-1"],
  "5-3-2": ["4-3-3", "3-4-3", "4-2-3-1"],
  "4-1-4-1": ["4-3-3", "4-2-3-1", "3-5-2"],
  "3-4-3": ["4-5-1", "5-3-2", "4-4-2"],
  "5-4-1": ["4-3-3", "4-2-3-1", "3-5-2"],
};

function getCounterFormations(opponentFormation: string): string[] {
  return COUNTER_MAP[opponentFormation] ?? ["4-3-3", "4-2-3-1"];
}

function buildReasoning(
  attackerBestFormation: string,
  defenderBestFormation: string,
  counterOptions: string[],
  attackerWinRate: number,
  defenderWinRate: number
): string {
  const lines: string[] = [];

  lines.push(
    `The attacking club most commonly deploys ${attackerBestFormation} (win rate ${(attackerWinRate * 100).toFixed(0)}%).`
  );
  lines.push(
    `The defending club favours ${defenderBestFormation} (win rate ${(defenderWinRate * 100).toFixed(0)}%).`
  );

  const recommended = counterOptions[0];
  lines.push(
    `To exploit weaknesses in ${defenderBestFormation}, a ${recommended} shape is recommended.`
  );

  if (counterOptions.length > 1) {
    lines.push(
      `Alternative options include ${counterOptions.slice(1).join(" or ")} depending on available personnel.`
    );
  }

  return lines.join(" ");
}

export async function suggestTactics(input: z.infer<typeof suggestTacticsSchema>) {
  const { attackingClubId, defendingClubId } = input;

  const [attackerRows, defenderRows] = await Promise.all([
    db.execute(sql`
      SELECT formation,
        COUNT(*) as used_count,
        SUM(CASE WHEN won = true THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN drew = true THEN 1 ELSE 0 END) as draws,
        SUM(CASE WHEN won = false AND drew = false THEN 1 ELSE 0 END) as losses,
        ROUND(
          SUM(CASE WHEN won = true THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0), 3
        ) as win_rate
      FROM formations
      WHERE club_id = ${attackingClubId}
      GROUP BY formation
      ORDER BY win_rate DESC, used_count DESC
      LIMIT 5
    `),
    db.execute(sql`
      SELECT formation,
        COUNT(*) as used_count,
        SUM(CASE WHEN won = true THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN drew = true THEN 1 ELSE 0 END) as draws,
        SUM(CASE WHEN won = false AND drew = false THEN 1 ELSE 0 END) as losses,
        ROUND(
          SUM(CASE WHEN won = true THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0), 3
        ) as win_rate
      FROM formations
      WHERE club_id = ${defendingClubId}
      GROUP BY formation
      ORDER BY used_count DESC, win_rate DESC
      LIMIT 5
    `),
  ]);

  const attackerFormations = attackerRows.rows as FormationRow[];
  const defenderFormations = defenderRows.rows as FormationRow[];

  const attackerBest = attackerFormations[0] ?? { formation: "4-3-3", win_rate: 0 };
  const defenderMostUsed = defenderFormations[0] ?? { formation: "4-4-2", win_rate: 0 };

  const counterOptions = getCounterFormations(defenderMostUsed.formation);
  const recommendedFormation = counterOptions[0];

  const reasoning = buildReasoning(
    attackerBest.formation,
    defenderMostUsed.formation,
    counterOptions,
    Number(attackerBest.win_rate),
    Number(defenderMostUsed.win_rate)
  );

  return {
    attackingClubId,
    defendingClubId,
    recommendedFormation,
    keyMatchupConsiderations: [
      `Opponent primarily uses ${defenderMostUsed.formation} — exploit its known weaknesses`,
      `Your best win rate comes from ${attackerBest.formation} — consider blending strengths`,
      `Counter shape ${recommendedFormation} creates overloads in areas where ${defenderMostUsed.formation} is thin`,
    ],
    reasoning,
    attackerFormationHistory: attackerFormations,
    defenderFormationHistory: defenderFormations,
  };
}

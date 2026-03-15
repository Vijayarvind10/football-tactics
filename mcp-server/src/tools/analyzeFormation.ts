import { z } from "zod";

export const analyzeFormationSchema = z.object({
  formation: z.string().describe("Formation string e.g. '4-3-3', '4-2-3-1', '3-5-2'"),
});

interface FormationAnalysis {
  formation: string;
  lines: number[];
  strengths: string[];
  weaknesses: string[];
  bestCounterFormations: string[];
  style: string;
}

const FORMATION_DATA: Record<string, Omit<FormationAnalysis, "formation" | "lines">> = {
  "4-3-3": {
    strengths: ["Wide attacking threat", "High press capability", "Numerical advantage in midfield", "Fluid attacking transitions"],
    weaknesses: ["Can leave gaps in midfield against 5", "Requires high-energy full-backs", "Exposed if wingers don't track back"],
    bestCounterFormations: ["4-5-1", "5-3-2", "4-1-4-1"],
    style: "Attacking, high-press",
  },
  "4-2-3-1": {
    strengths: ["Double pivot provides stability", "Creative no.10 space", "Compact defensive shape", "Versatile transitions"],
    weaknesses: ["Can be overloaded in wide areas", "Depends heavily on the no.10", "Single striker can be isolated"],
    bestCounterFormations: ["4-3-3", "3-4-3", "4-4-2"],
    style: "Balanced, possession-based",
  },
  "4-4-2": {
    strengths: ["Classic balanced shape", "Two strikers provide cover and combination", "Compact midfield block", "Easy to understand"],
    weaknesses: ["Outnumbered in midfield vs 3-man midfields", "Wide midfielders need high work rate", "Can lack creativity in center"],
    bestCounterFormations: ["4-3-3", "4-2-3-1", "3-5-2"],
    style: "Traditional, direct",
  },
  "3-5-2": {
    strengths: ["Wing-backs provide width and coverage", "Midfield overload", "Two strikers", "Solid defensive base"],
    weaknesses: ["Exposed if wing-backs are caught high", "Requires disciplined wing-backs", "Can be countered by fast wide forwards"],
    bestCounterFormations: ["4-3-3", "4-4-2", "5-4-1"],
    style: "Wing-back driven, dynamic",
  },
  "5-3-2": {
    strengths: ["Defensive solidity", "Counter-attack potential", "Difficult to break down", "Three center-backs"],
    weaknesses: ["Limited attacking threat", "Requires excellent wing-backs", "Can invite pressure"],
    bestCounterFormations: ["4-3-3", "3-4-3", "4-2-3-1"],
    style: "Defensive, counter-attacking",
  },
};

export function analyzeFormation(input: z.infer<typeof analyzeFormationSchema>): FormationAnalysis {
  const { formation } = input;
  const lines = formation.split("-").map(Number);
  const data = FORMATION_DATA[formation];

  if (!data) {
    return {
      formation,
      lines,
      strengths: ["Formation data not available — analysis based on shape"],
      weaknesses: ["Insufficient data for detailed analysis"],
      bestCounterFormations: ["4-3-3", "4-2-3-1"],
      style: "Unknown",
    };
  }

  return { formation, lines, ...data };
}

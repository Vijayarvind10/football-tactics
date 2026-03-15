import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinute(minute: number): string {
  return `${minute}'`;
}

export function formatScore(home: number | null, away: number | null): string {
  if (home === null || away === null) return "- : -";
  return `${home} : ${away}`;
}

export function getOutcomeColor(outcome: "W" | "D" | "L"): string {
  if (outcome === "W") return "var(--live)";
  if (outcome === "D") return "var(--warning)";
  return "var(--danger)";
}

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const LEAGUE_META: Record<number, { flag: string; accent: string }> = {
  39:  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󁿢", accent: "#3b82f6" },
  140: { flag: "🇪🇸", accent: "#ef4444" },
  78:  { flag: "🇩🇪", accent: "#f59e0b" },
  135: { flag: "🇮🇹", accent: "#3b82f6" },
  61:  { flag: "🇫🇷", accent: "#3b82f6" },
};

export default function LeaguesPage() {
  const { data: leagues, isLoading } = useQuery({
    queryKey: ["leagues"],
    queryFn: api.leagues.list,
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="stat-label" style={{ marginBottom: "8px" }}>Europe</p>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Top 5 Leagues
        </h1>
        <p style={{ color: "var(--text-tertiary)", fontSize: "14px", marginTop: "6px" }}>
          Select a league to view standings and fixtures
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} height={76} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {leagues?.map((league) => {
            const meta = LEAGUE_META[league.apiFootballId ?? 0] ?? {
              flag: "🌍",
              accent: "var(--accent)",
            };
            return (
              <Link
                key={league.id}
                href={`/leagues/${league.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card-interactive"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 20px",
                  }}
                >
                  {/* Flag */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    {meta.flag}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "15px",
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {league.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                      {league.country} · Season {league.season}
                    </div>
                  </div>

                  {/* Accent bar */}
                  <div
                    style={{
                      width: "3px",
                      height: "32px",
                      borderRadius: "2px",
                      background: meta.accent,
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  />

                  {/* Arrow */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

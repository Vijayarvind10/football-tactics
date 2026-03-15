"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function LeaguePage() {
  const { leagueId } = useParams();
  const id = Number(leagueId);

  const { data: standings, isLoading } = useQuery({
    queryKey: ["standings", id],
    queryFn: () => api.leagues.standings(id),
  });

  const leagueName = standings?.[0] ? null : null;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <Link
          href="/leagues"
          style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
        >
          Leagues
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4 2l4 4-4 4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Standings</span>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Standings
          </h1>
          {standings && (
            <p style={{ color: "var(--text-tertiary)", fontSize: "13px", marginTop: "4px" }}>
              {standings.length} clubs · 2024/25 season
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={20} height={46} />
      ) : standings && standings.length > 0 ? (
        <StandingsTable standings={standings} />
      ) : (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.4 }}>📊</div>
          <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-tertiary)" }}>
            No standings data yet
          </div>
          <div style={{ fontSize: "13px", marginTop: "6px" }}>
            Sync standings from the{" "}
            <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>
              Admin page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

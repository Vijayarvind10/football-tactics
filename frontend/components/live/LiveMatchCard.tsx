"use client";
import Link from "next/link";
import type { Match } from "@/lib/api";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { formatScore } from "@/lib/utils";

interface LiveMatchCardProps {
  match: Match;
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  const isLive = match.status === "LIVE";

  return (
    <Link
      href={`/matches/${match.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="card"
        style={{
          border: isLive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border)",
          cursor: "pointer",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          {isLive ? <LiveBadge /> : (
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {match.status}
            </span>
          )}
          {isLive && match.minute && (
            <span className="font-mono-data" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {match.minute}&apos;
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px" }}>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)" }}>
            {match.homeClub.name}
          </div>
          <div className="font-mono-data" style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", minWidth: "80px" }}>
            {formatScore(match.homeScore, match.awayScore)}
          </div>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)", textAlign: "right" }}>
            {match.awayClub.name}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{match.homeFormation ?? "—"}</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{match.awayFormation ?? "—"}</span>
        </div>
      </div>
    </Link>
  );
}

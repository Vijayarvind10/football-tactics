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
    <Link href={`/matches/${match.id}`} style={{ textDecoration: "none" }}>
      <div className={isLive ? "card-live" : "card-interactive"}>
        {/* Top row: status + minute */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          {isLive ? (
            <LiveBadge />
          ) : (
            <span
              className="tag"
              style={{
                background: "var(--surface-3)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--border)",
              }}
            >
              {match.status === "FINISHED" ? "FT" : match.status}
            </span>
          )}
          {isLive && match.minute != null && (
            <span
              className="font-mono-data"
              style={{
                fontSize: "12px",
                color: "var(--live)",
                fontWeight: 600,
              }}
            >
              {match.minute}&apos;
            </span>
          )}
        </div>

        {/* Score row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 72px 1fr",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            {match.homeClub.name}
          </div>

          <div
            className="font-mono-data"
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: isLive ? "var(--live)" : "var(--text-primary)",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            {formatScore(match.homeScore, match.awayScore)}
          </div>

          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--text-primary)",
              textAlign: "right",
              lineHeight: 1.3,
            }}
          >
            {match.awayClub.name}
          </div>
        </div>

        {/* Formation row */}
        {(match.homeFormation || match.awayFormation) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--border)",
              paddingTop: "10px",
            }}
          >
            <span
              className="font-mono-data"
              style={{ fontSize: "11px", color: "var(--text-muted)" }}
            >
              {match.homeFormation ?? "—"}
            </span>
            <span
              style={{ fontSize: "10px", color: "var(--text-muted)" }}
              className="stat-label"
            >
              Formation
            </span>
            <span
              className="font-mono-data"
              style={{ fontSize: "11px", color: "var(--text-muted)" }}
            >
              {match.awayFormation ?? "—"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

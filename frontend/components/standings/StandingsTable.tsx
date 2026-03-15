"use client";
import type { Standing } from "@/lib/api";

interface StandingsTableProps {
  standings: Standing[];
}

function positionZone(rank: number, total: number): { color: string; label: string } | null {
  if (rank <= 4) return { color: "var(--ucl)", label: "UCL" };
  if (rank === 5) return { color: "var(--uel)", label: "UEL" };
  if (rank === 6) return { color: "#22d3ee", label: "UECL" };
  if (rank >= total - 2) return { color: "var(--relegation)", label: "REL" };
  return null;
}

function FormBadge({ result }: { result: string }) {
  const color =
    result === "W"
      ? "var(--live)"
      : result === "D"
        ? "var(--warning)"
        : "var(--danger)";
  const bg =
    result === "W"
      ? "var(--live-dim)"
      : result === "D"
        ? "var(--warning-dim)"
        : "var(--danger-dim)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: "4px",
        background: bg,
        color,
        fontSize: "10px",
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {result}
    </span>
  );
}

export function StandingsTable({ standings }: StandingsTableProps) {
  const total = standings.length;

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 36px 36px 36px 36px 48px 88px",
          gap: 0,
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-2)",
        }}
      >
        {["#", "Club", "W", "D", "L", "GD", "Pts", "Form"].map((h) => (
          <div
            key={h}
            className="stat-label"
            style={{ textAlign: h === "Club" ? "left" : "center" }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {standings.map((row, i) => {
        const zone = positionZone(row.rank ?? i + 1, total);
        return (
          <div
            key={row.club.id}
            className="table-row-hover"
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 36px 36px 36px 36px 48px 88px",
              gap: 0,
              padding: "0 16px",
              height: "46px",
              alignItems: "center",
              borderBottom:
                i < standings.length - 1 ? "1px solid var(--border)" : "none",
              position: "relative",
            }}
          >
            {/* Zone indicator */}
            {zone && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "8px",
                  bottom: "8px",
                  width: "2px",
                  borderRadius: "0 2px 2px 0",
                  background: zone.color,
                  opacity: 0.8,
                }}
              />
            )}

            {/* Rank */}
            <div
              className="font-mono-data"
              style={{
                fontSize: "13px",
                color: zone ? zone.color : "var(--text-muted)",
                fontWeight: zone ? 700 : 400,
                textAlign: "center",
              }}
            >
              {row.rank ?? i + 1}
            </div>

            {/* Club */}
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.club.name}
            </div>

            {/* W */}
            <div
              className="font-mono-data"
              style={{ fontSize: "13px", color: "var(--live)", textAlign: "center" }}
            >
              {row.won ?? "—"}
            </div>

            {/* D */}
            <div
              className="font-mono-data"
              style={{ fontSize: "13px", color: "var(--text-tertiary)", textAlign: "center" }}
            >
              {row.drawn ?? "—"}
            </div>

            {/* L */}
            <div
              className="font-mono-data"
              style={{ fontSize: "13px", color: "var(--danger)", textAlign: "center" }}
            >
              {row.lost ?? "—"}
            </div>

            {/* GD */}
            <div
              className="font-mono-data"
              style={{
                fontSize: "13px",
                textAlign: "center",
                color:
                  (row.goalDiff ?? 0) > 0
                    ? "var(--live)"
                    : (row.goalDiff ?? 0) < 0
                      ? "var(--danger)"
                      : "var(--text-tertiary)",
              }}
            >
              {(row.goalDiff ?? 0) > 0 ? `+${row.goalDiff}` : row.goalDiff ?? "—"}
            </div>

            {/* Points */}
            <div
              className="font-mono-data"
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
              }}
            >
              {row.points ?? "—"}
            </div>

            {/* Form */}
            <div style={{ display: "flex", gap: "3px", justifyContent: "flex-end" }}>
              {(row.form ?? "").split("").slice(-5).map((r, j) => (
                <FormBadge key={j} result={r} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid var(--border)",
          background: "var(--surface-2)",
          display: "flex",
          gap: "16px",
        }}
      >
        {[
          { color: "var(--ucl)", label: "Champions League" },
          { color: "var(--uel)", label: "Europa League" },
          { color: "#22d3ee", label: "Conference League" },
          { color: "var(--relegation)", label: "Relegation" },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "2px",
                height: "12px",
                borderRadius: "1px",
                background: item.color,
              }}
            />
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

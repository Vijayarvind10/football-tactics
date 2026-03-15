"use client";
import type { Standing } from "@/lib/api";

interface StandingsTableProps {
  standings: Standing[];
}

function FormBadge({ result }: { result: string }) {
  const color =
    result === "W" ? "var(--live)" :
    result === "D" ? "var(--warning)" :
    "var(--danger)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 20, height: 20, borderRadius: "4px",
      background: `${color}22`, color, fontSize: "11px", fontWeight: 700,
    }}>
      {result}
    </span>
  );
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["#", "Club", "Pts", "Form"].map((h) => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr
              key={row.club.id}
              style={{ borderBottom: i < standings.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <td className="font-mono-data" style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px", width: "40px" }}>
                {row.rank}
              </td>
              <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px", color: "var(--text-primary)" }}>
                {row.club.name}
              </td>
              <td className="font-mono-data" style={{ padding: "12px 16px", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
                {row.points}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  {(row.form ?? "").split("").slice(-5).map((r, j) => (
                    <FormBadge key={j} result={r} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

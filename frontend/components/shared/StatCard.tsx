interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
        {label}
      </div>
      <div
        className="font-mono-data"
        style={{ fontSize: "32px", fontWeight: 700, color: accent ? "var(--accent)" : "var(--text-primary)", lineHeight: 1 }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

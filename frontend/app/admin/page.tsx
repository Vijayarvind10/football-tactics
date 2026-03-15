"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface QuotaData {
  allowed: boolean;
  used: number;
  remaining: number;
}

interface SyncResult {
  league: string;
  status: string;
  rows?: number;
  error?: string;
}

interface SyncResponse {
  synced: SyncResult[];
  quota: QuotaData;
}

interface LiveResponse {
  count: number;
  quota: QuotaData;
}

function SyncButton({
  label,
  description,
  endpoint,
  color = "var(--accent)",
}: {
  label: string;
  description: string;
  endpoint: string;
  color?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResponse | LiveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API}${endpoint}`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)" }}>{label}</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{description}</div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          style={{
            background: loading ? "var(--surface-3)" : color,
            border: "none",
            borderRadius: "8px",
            padding: "8px 18px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "13px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            whiteSpace: "nowrap",
            minWidth: "100px",
          }}
        >
          {loading ? "Running…" : "Run Now"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {result && "synced" in result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {result.synced.map((r) => (
            <div key={r.league} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 10px", background: "var(--surface-3)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>{r.league}</span>
              <span style={{
                color: r.status === "ok" ? "var(--live)" : r.status === "error" ? "var(--danger)" : "var(--warning)",
                fontWeight: 600,
              }}>
                {r.status === "ok" ? `✓ ${r.rows} rows` : r.status === "error" ? `✗ ${r.error}` : r.status}
              </span>
            </div>
          ))}
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            API calls used today: {result.quota.used} / {result.quota.used + result.quota.remaining}
          </div>
        </div>
      )}

      {result && "count" in result && (
        <div style={{ fontSize: "13px", color: "var(--live)", fontWeight: 600 }}>
          ✓ {result.count} live fixtures fetched · {result.quota.used} API calls used today
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { data: health } = useQuery({
    queryKey: ["admin", "health"],
    queryFn: () => fetch(`${API}/api/admin/health`).then((r) => r.json()) as Promise<{ status: string; timestamp: string }>,
    refetchInterval: 10_000,
  });

  const { data: quota, refetch: refetchQuota } = useQuery({
    queryKey: ["admin", "quota"],
    queryFn: () => fetch(`${API}/api/admin/quota`).then((r) => r.json()) as Promise<QuotaData>,
    refetchInterval: 30_000,
  });

  const usedPct = quota ? Math.round((quota.used / (quota.used + quota.remaining)) * 100) : 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "6px" }}>
        Admin
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px" }}>
        Manual data sync and system status
      </p>

      {/* Status row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "32px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>API Status</div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: health?.status === "ok" ? "var(--live)" : "var(--danger)" }}>
            {health?.status === "ok" ? "● Online" : "○ Offline"}
          </div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>API Calls Today</div>
          <div className="font-mono-data" style={{ fontSize: "28px", fontWeight: 700, color: (quota?.used ?? 0) > 80 ? "var(--danger)" : "var(--text-primary)" }}>
            {quota?.used ?? "—"}<span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>/100</span>
          </div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Quota Used</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }} className="font-mono-data">
            {usedPct}%
          </div>
          <div style={{ marginTop: "8px", height: "4px", borderRadius: "2px", background: "var(--surface-3)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${usedPct}%`, background: usedPct > 80 ? "var(--danger)" : "var(--accent)", borderRadius: "2px", transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>

      {/* Sync actions */}
      <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "16px", letterSpacing: "0.02em" }}>
        MANUAL SYNC
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <SyncButton
          label="Sync Standings"
          description="Fetch current standings for all 5 leagues from API-Football and write to database. Uses 5 API calls."
          endpoint="/api/admin/sync/standings"
          color="var(--accent)"
        />
        <SyncButton
          label="Poll Live Fixtures"
          description="Fetch all currently live matches from API-Football. Uses 1 API call."
          endpoint="/api/admin/sync/live"
          color="var(--live)"
        />
      </div>

      {health && (
        <div style={{ marginTop: "32px", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
          Last checked: {new Date(health.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatCard } from "@/components/shared/StatCard";

// Approximate heatmap zones by position type
const POSITION_HEATMAP: Record<string, Array<{ x: number; y: number; weight: number }>> = {
  GK: [
    { x: 0.5, y: 0.08, weight: 1.0 }, { x: 0.35, y: 0.12, weight: 0.5 }, { x: 0.65, y: 0.12, weight: 0.5 },
  ],
  CB: [
    { x: 0.5, y: 0.22, weight: 0.9 }, { x: 0.3, y: 0.25, weight: 0.7 }, { x: 0.7, y: 0.25, weight: 0.7 },
    { x: 0.5, y: 0.35, weight: 0.4 },
  ],
  LB: [
    { x: 0.1, y: 0.28, weight: 0.9 }, { x: 0.1, y: 0.45, weight: 0.8 }, { x: 0.15, y: 0.6, weight: 0.5 },
    { x: 0.2, y: 0.35, weight: 0.6 },
  ],
  RB: [
    { x: 0.9, y: 0.28, weight: 0.9 }, { x: 0.9, y: 0.45, weight: 0.8 }, { x: 0.85, y: 0.6, weight: 0.5 },
    { x: 0.8, y: 0.35, weight: 0.6 },
  ],
  CM: [
    { x: 0.5, y: 0.5, weight: 1.0 }, { x: 0.35, y: 0.45, weight: 0.7 }, { x: 0.65, y: 0.45, weight: 0.7 },
    { x: 0.5, y: 0.6, weight: 0.5 }, { x: 0.4, y: 0.55, weight: 0.6 },
  ],
  DM: [
    { x: 0.5, y: 0.4, weight: 1.0 }, { x: 0.35, y: 0.38, weight: 0.6 }, { x: 0.65, y: 0.38, weight: 0.6 },
    { x: 0.5, y: 0.5, weight: 0.5 },
  ],
  AM: [
    { x: 0.5, y: 0.62, weight: 1.0 }, { x: 0.35, y: 0.58, weight: 0.6 }, { x: 0.65, y: 0.58, weight: 0.6 },
    { x: 0.5, y: 0.72, weight: 0.5 },
  ],
  LW: [
    { x: 0.1, y: 0.65, weight: 0.9 }, { x: 0.15, y: 0.75, weight: 0.8 }, { x: 0.25, y: 0.68, weight: 0.6 },
    { x: 0.2, y: 0.55, weight: 0.5 },
  ],
  RW: [
    { x: 0.9, y: 0.65, weight: 0.9 }, { x: 0.85, y: 0.75, weight: 0.8 }, { x: 0.75, y: 0.68, weight: 0.6 },
    { x: 0.8, y: 0.55, weight: 0.5 },
  ],
  ST: [
    { x: 0.5, y: 0.8, weight: 1.0 }, { x: 0.4, y: 0.75, weight: 0.7 }, { x: 0.6, y: 0.75, weight: 0.7 },
    { x: 0.5, y: 0.7, weight: 0.5 }, { x: 0.35, y: 0.82, weight: 0.4 }, { x: 0.65, y: 0.82, weight: 0.4 },
  ],
};

function getHeatmapZones(position: string) {
  // Map common position strings to heatmap keys
  const map: Record<string, string> = {
    Goalkeeper: "GK", "Centre-Back": "CB", "Left-Back": "LB", "Right-Back": "RB",
    Midfielder: "CM", "Central Midfield": "CM", "Defensive Midfield": "DM",
    "Attacking Midfield": "AM", "Left Winger": "LW", "Right Winger": "RW",
    "Left Wing": "LW", "Right Wing": "RW", Attacker: "ST", "Centre-Forward": "ST",
    Forward: "ST",
  };
  return POSITION_HEATMAP[map[position] ?? "CM"] ?? POSITION_HEATMAP.CM;
}

function HeatmapCanvas({ position }: { position: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zones = getHeatmapZones(position);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Draw 2D Gaussian blobs for each zone
    for (const zone of zones) {
      const cx = zone.x * W;
      const cy = zone.y * H;
      const radius = Math.min(W, H) * 0.18 * zone.weight;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(239, 68, 68, ${0.65 * zone.weight})`);
      gradient.addColorStop(0.4, `rgba(251, 191, 36, ${0.4 * zone.weight})`);
      gradient.addColorStop(0.7, `rgba(16, 185, 129, ${0.2 * zone.weight})`);
      gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [zones]);

  return (
    <canvas
      ref={canvasRef}
      width={380}
      height={570}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        mixBlendMode: "screen",
      }}
    />
  );
}

export default function PlayerPage() {
  const { playerId } = useParams();
  const id = Number(playerId);

  const { data: player, isLoading } = useQuery({
    queryKey: ["player", id],
    queryFn: () => api.clubs.get(id), // placeholder — will use player endpoint when available
  });

  // Mock player data for visual demo (real data comes from API)
  const mockPlayer = {
    name: `Player #${id}`,
    position: "Central Midfield",
    club: "—",
    appearances: 28,
    goals: 7,
    assists: 12,
    rating: 7.4,
  };

  if (isLoading) return (
    <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 24px" }}>
      <LoadingSkeleton rows={4} height={80} />
    </div>
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          {mockPlayer.name}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          {mockPlayer.position} · {mockPlayer.club}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
        {/* Heatmap */}
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Touch Map (Approx.)
          </div>
          <div style={{ position: "relative", maxWidth: "380px" }}>
            {/* Pitch background */}
            <svg viewBox="0 0 700 1050" style={{ width: "100%", background: "var(--pitch)", borderRadius: "8px", display: "block" }}>
              <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none">
                <rect x="20" y="20" width="660" height="1010" />
                <line x1="20" y1="525" x2="680" y2="525" />
                <circle cx="350" cy="525" r="91.5" />
                <circle cx="350" cy="525" r="4" fill="rgba(255,255,255,0.3)" />
                <rect x="139" y="20" width="422" height="154" />
                <rect x="245" y="20" width="210" height="55" />
                <rect x="139" y="876" width="422" height="154" />
                <rect x="245" y="975" width="210" height="55" />
              </g>
            </svg>
            <HeatmapCanvas position={mockPlayer.position} />
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "12px", alignItems: "center", fontSize: "11px", color: "var(--text-muted)" }}>
            <span>Low</span>
            <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "linear-gradient(to right, rgba(16,185,129,0.5), rgba(251,191,36,0.7), rgba(239,68,68,0.9))" }} />
            <span>High</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <StatCard label="Appearances" value={mockPlayer.appearances} />
            <StatCard label="Goals" value={mockPlayer.goals} accent />
            <StatCard label="Assists" value={mockPlayer.assists} />
            <StatCard label="Avg Rating" value={mockPlayer.rating.toFixed(1)} />
          </div>

          <div className="card">
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              Season Overview
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.7" }}>
              <p>Touch map shows approximate positional influence based on typical {mockPlayer.position} movement patterns.</p>
              <p style={{ marginTop: "8px" }}>Detailed tracking data requires API-Football Pro tier.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

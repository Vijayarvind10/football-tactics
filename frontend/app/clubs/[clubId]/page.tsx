"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ClubPage() {
  const { clubId } = useParams();
  const id = Number(clubId);

  const { data: club, isLoading: clubLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: () => api.clubs.get(id),
  });

  const { data: formations } = useQuery({
    queryKey: ["club-formations", id],
    queryFn: () => api.clubs.formations(id),
  });

  if (clubLoading) return (
    <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 24px" }}>
      <LoadingSkeleton rows={4} height={80} />
    </div>
  );

  if (!club) return <div style={{ padding: "40px", color: "var(--text-muted)" }}>Club not found.</div>;

  const chartData = formations?.map((f) => ({
    name: f.formation,
    winRate: f.usedCount > 0 ? Math.round((f.wins / f.usedCount) * 100) : 0,
    used: f.usedCount,
  }));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{club.name}</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>{club.league.name} · {club.country}</p>
      </div>

      {chartData && chartData.length > 0 && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--text-secondary)" }}>
            Formation Win Rate (2024)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)" }}
                formatter={(val) => [`${val ?? 0}%`, "Win rate"]}
              />
              <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--accent)" opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

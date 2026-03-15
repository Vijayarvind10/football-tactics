"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FormationVisualizer } from "@/components/formation/FormationVisualizer";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const KNOWN_CLUBS = [
  { id: 1, name: "Manchester United" }, { id: 2, name: "Liverpool" },
  { id: 3, name: "Arsenal" }, { id: 4, name: "Chelsea" },
  { id: 5, name: "Manchester City" }, { id: 6, name: "Tottenham" },
  { id: 7, name: "Barcelona" }, { id: 8, name: "Real Madrid" },
];

export default function ComparePage() {
  const [clubA, setClubA] = useState<number | null>(null);
  const [clubB, setClubB] = useState<number | null>(null);

  const { data: formationsA } = useQuery({
    queryKey: ["formations", clubA],
    queryFn: () => api.clubs.formations(clubA!),
    enabled: !!clubA,
  });

  const { data: formationsB } = useQuery({
    queryKey: ["formations", clubB],
    queryFn: () => api.clubs.formations(clubB!),
    enabled: !!clubB,
  });

  const topFormationA = formationsA?.[0]?.formation ?? "4-3-3";
  const topFormationB = formationsB?.[0]?.formation ?? "4-4-2";

  const selectStyle = {
    background: "var(--surface-2)", border: "1px solid var(--border-strong)",
    borderRadius: "8px", padding: "10px 14px", color: "var(--text-primary)",
    fontSize: "14px", width: "100%", cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Compare Tactics
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Club A</label>
          <select style={selectStyle} onChange={(e) => setClubA(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Select a club...</option>
            {KNOWN_CLUBS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Club B</label>
          <select style={selectStyle} onChange={(e) => setClubB(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Select a club...</option>
            {KNOWN_CLUBS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {(clubA || clubB) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div>
            {clubA ? (
              formationsA ? <FormationVisualizer formation={topFormationA} label="Most used formation" /> : <LoadingSkeleton rows={1} height={400} />
            ) : (
              <div className="card" style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Select Club A</div>
            )}
          </div>
          <div>
            {clubB ? (
              formationsB ? <FormationVisualizer formation={topFormationB} flip label="Most used formation" /> : <LoadingSkeleton rows={1} height={400} />
            ) : (
              <div className="card" style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Select Club B</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

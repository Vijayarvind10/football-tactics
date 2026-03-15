"use client";
import { useState, useMemo } from "react";
import { FormationVisualizer } from "./FormationVisualizer";

interface SubEvent {
  minute: number;
  playerOutName: string;
  playerInName: string;
  playerOutNumber?: number;
  playerInNumber?: number;
}

interface PlayerData {
  id: number;
  name: string;
  number?: number;
  position?: string;
}

interface FormationTimelineProps {
  formation: string;
  startingXI: PlayerData[];      // 11 players at kickoff
  substitutions: SubEvent[];     // sub events in order
  maxMinute?: number;            // default 90
  label?: string;
}

export function FormationTimeline({
  formation,
  startingXI,
  substitutions,
  maxMinute = 90,
  label,
}: FormationTimelineProps) {
  const [minute, setMinute] = useState(0);

  // Replay lineup state at given minute
  const currentXI = useMemo(() => {
    let lineup = [...startingXI];
    for (const sub of substitutions) {
      if (sub.minute > minute) break;
      lineup = lineup.map((p) =>
        p.name === sub.playerOutName
          ? { ...p, name: sub.playerInName, number: sub.playerInNumber ?? p.number }
          : p
      );
    }
    return lineup;
  }, [minute, startingXI, substitutions]);

  const subMarkers = substitutions.filter((s) => s.minute <= maxMinute);

  return (
    <div>
      {label && (
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500 }}>
          {label}
        </div>
      )}

      <FormationVisualizer formation={formation} players={currentXI} />

      {/* Timeline scrubber */}
      <div style={{ marginTop: "20px", padding: "0 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>0&apos;</span>
          <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>{minute}&apos;</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{maxMinute}&apos;</span>
        </div>

        {/* Track with sub markers */}
        <div style={{ position: "relative" }}>
          <input
            type="range"
            min={0}
            max={maxMinute}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--accent)",
              cursor: "pointer",
              height: "4px",
            }}
          />
          {/* Sub markers */}
          {subMarkers.map((sub, i) => (
            <div
              key={i}
              title={`${sub.minute}' — ${sub.playerOutName} → ${sub.playerInName}`}
              style={{
                position: "absolute",
                left: `${(sub.minute / maxMinute) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--live)",
                border: "2px solid var(--bg)",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>

        {/* Sub events list */}
        {subMarkers.length > 0 && (
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {subMarkers.map((sub, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: sub.minute <= minute ? "var(--text-secondary)" : "var(--text-muted)",
                  opacity: sub.minute <= minute ? 1 : 0.4,
                }}
              >
                <span style={{ color: "var(--text-muted)", minWidth: "28px" }}>{sub.minute}&apos;</span>
                <span style={{ color: "var(--danger)" }}>↓</span>
                <span>{sub.playerOutName}</span>
                <span style={{ color: "var(--live)" }}>↑</span>
                <span>{sub.playerInName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

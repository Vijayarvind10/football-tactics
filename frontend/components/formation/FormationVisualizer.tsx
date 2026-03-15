"use client";
import { PitchSVG } from "./PitchSVG";
import { PlayerMarker } from "./PlayerMarker";
import { getFormationLayout } from "@/lib/formationLayouts";

interface PlayerData {
  id: number;
  name: string;
  number?: number;
  position?: string;
}

interface FormationVisualizerProps {
  formation: string;
  players?: PlayerData[];
  flip?: boolean;
  label?: string;
}

export function FormationVisualizer({ formation, players = [], flip, label }: FormationVisualizerProps) {
  const layout = getFormationLayout(formation);

  return (
    <div style={{ textAlign: "center" }}>
      {label && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>
          {label}
        </div>
      )}
      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px", letterSpacing: "-0.01em" }}>
        {formation}
      </div>
      <PitchSVG flip={flip}>
        {layout.map((pos, i) => {
          const player = players[i];
          return (
            <PlayerMarker
              key={i}
              x={pos.x}
              y={pos.y}
              name={player?.name ?? `Player ${i + 1}`}
              number={player?.number ?? i + 1}
              flip={flip}
            />
          );
        })}
      </PitchSVG>
    </div>
  );
}

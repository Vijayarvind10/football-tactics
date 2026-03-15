interface PlayerMarkerProps {
  x: number;      // 0–1 normalized
  y: number;      // 0–1 normalized
  name: string;
  number?: number;
  highlight?: boolean;
  flip?: boolean;
}

const PITCH_W = 700;
const PITCH_H = 1050;
const PADDING = 40;

// Color by vertical position: GK → DEF → MID → FWD
function positionColor(y: number): { fill: string; stroke: string; text: string } {
  if (y < 0.18) return { fill: "#f59e0b", stroke: "#92400e", text: "#1c1917" }; // GK — amber
  if (y < 0.45) return { fill: "#3b82f6", stroke: "#1d4ed8", text: "#fff" };     // DEF — blue
  if (y < 0.65) return { fill: "#f0f0f0", stroke: "rgba(0,0,0,0.25)", text: "#111" }; // MID — white
  return { fill: "#ef4444", stroke: "#991b1b", text: "#fff" };                    // FWD — red
}

export function PlayerMarker({ x, y, name, number, highlight, flip }: PlayerMarkerProps) {
  const cx = PADDING + x * (PITCH_W - 2 * PADDING);
  const cy = flip
    ? PITCH_H - PADDING - y * (PITCH_H - 2 * PADDING)
    : PADDING + y * (PITCH_H - 2 * PADDING);

  const colors = highlight
    ? { fill: "var(--accent)", stroke: "#1d4ed8", text: "#fff" }
    : positionColor(y);

  const shortName = name.split(" ").pop() ?? name;

  return (
    <g style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
      {/* Outer glow ring for GK */}
      {y < 0.18 && !flip && (
        <circle cx={cx} cy={cy} r={27} fill="rgba(245,158,11,0.15)" />
      )}

      <circle
        cx={cx}
        cy={cy}
        r={21}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
      />

      {number !== undefined && (
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={700}
          fill={colors.text}
          fontFamily="'JetBrains Mono', monospace"
        >
          {number}
        </text>
      )}

      <text
        x={cx}
        y={cy + 32}
        textAnchor="middle"
        fontSize={10}
        fill="rgba(255,255,255,0.9)"
        fontFamily="Inter, sans-serif"
        fontWeight={600}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {shortName.length > 10 ? shortName.slice(0, 9) + "…" : shortName}
      </text>
    </g>
  );
}

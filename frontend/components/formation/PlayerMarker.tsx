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

export function PlayerMarker({ x, y, name, number, highlight, flip }: PlayerMarkerProps) {
  const cx = PADDING + x * (PITCH_W - 2 * PADDING);
  // If flipped (away team rendered normally), invert y to show from bottom
  const cy = flip
    ? PITCH_H - PADDING - y * (PITCH_H - 2 * PADDING)
    : PADDING + y * (PITCH_H - 2 * PADDING);

  const shortName = name.split(" ").pop() ?? name;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={22}
        fill={highlight ? "var(--accent)" : "rgba(255,255,255,0.92)"}
        stroke={highlight ? "#1d4ed8" : "rgba(0,0,0,0.3)"}
        strokeWidth={2}
      />
      {number !== undefined && (
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
          fontWeight={700}
          fill={highlight ? "#fff" : "#111"}
          fontFamily="'JetBrains Mono', monospace"
        >
          {number}
        </text>
      )}
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fontSize={11}
        fill="rgba(255,255,255,0.85)"
        fontFamily="Inter, sans-serif"
        fontWeight={500}
      >
        {shortName.length > 10 ? shortName.slice(0, 9) + "…" : shortName}
      </text>
    </g>
  );
}

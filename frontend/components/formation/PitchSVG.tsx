interface PitchSVGProps {
  children?: React.ReactNode;
  flip?: boolean;
}

// Generate grass stripe rects (alternating subtle bands)
const STRIPE_HEIGHT = 70;
const PITCH_TOP = 20;
const PITCH_BOTTOM = 1030;
const PITCH_LEFT = 20;
const PITCH_RIGHT = 680;

function GrassStripes() {
  const stripes = [];
  let y = PITCH_TOP;
  let dark = false;
  while (y < PITCH_BOTTOM) {
    if (dark) {
      stripes.push(
        <rect
          key={y}
          x={PITCH_LEFT}
          y={y}
          width={PITCH_RIGHT - PITCH_LEFT}
          height={Math.min(STRIPE_HEIGHT, PITCH_BOTTOM - y)}
          fill="rgba(0,0,0,0.1)"
        />
      );
    }
    y += STRIPE_HEIGHT;
    dark = !dark;
  }
  return <>{stripes}</>;
}

export function PitchSVG({ children, flip }: PitchSVGProps) {
  return (
    <svg
      viewBox="0 0 700 1050"
      style={{
        width: "100%",
        maxWidth: "380px",
        transform: flip ? "scaleY(-1)" : undefined,
        background: "var(--pitch)",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "block",
      }}
    >
      {/* Grass texture */}
      <GrassStripes />

      {/* Pitch markings */}
      <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none">
        {/* Outer boundary */}
        <rect x="20" y="20" width="660" height="1010" rx="2" />
        {/* Centre line */}
        <line x1="20" y1="525" x2="680" y2="525" />
        {/* Centre circle */}
        <circle cx="350" cy="525" r="91.5" />
        {/* Centre spot */}
        <circle cx="350" cy="525" r="3" fill="rgba(255,255,255,0.25)" />
        {/* Top penalty box */}
        <rect x="139" y="20" width="422" height="154" />
        {/* Top 6-yard box */}
        <rect x="245" y="20" width="210" height="55" />
        {/* Top penalty spot */}
        <circle cx="350" cy="131" r="3" fill="rgba(255,255,255,0.25)" />
        {/* Top penalty arc */}
        <path d="M 254 174 A 91.5 91.5 0 0 1 446 174" />
        {/* Bottom penalty box */}
        <rect x="139" y="876" width="422" height="154" />
        {/* Bottom 6-yard box */}
        <rect x="245" y="975" width="210" height="55" />
        {/* Bottom penalty spot */}
        <circle cx="350" cy="919" r="3" fill="rgba(255,255,255,0.25)" />
        {/* Bottom penalty arc */}
        <path d="M 254 876 A 91.5 91.5 0 0 0 446 876" />
        {/* Corner arcs */}
        <path d="M 20 38 A 18 18 0 0 1 38 20" />
        <path d="M 662 20 A 18 18 0 0 1 680 38" />
        <path d="M 680 1012 A 18 18 0 0 1 662 1030" />
        <path d="M 38 1030 A 18 18 0 0 1 20 1012" />
      </g>
      {children}
    </svg>
  );
}

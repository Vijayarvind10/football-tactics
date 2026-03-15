interface PitchSVGProps {
  children?: React.ReactNode;
  flip?: boolean;
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
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      {/* Pitch markings */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none">
        {/* Outer boundary */}
        <rect x="20" y="20" width="660" height="1010" />
        {/* Centre line */}
        <line x1="20" y1="525" x2="680" y2="525" />
        {/* Centre circle */}
        <circle cx="350" cy="525" r="91.5" />
        {/* Centre spot */}
        <circle cx="350" cy="525" r="4" fill="rgba(255,255,255,0.3)" />
        {/* Top penalty box */}
        <rect x="139" y="20" width="422" height="154" />
        {/* Top 6-yard box */}
        <rect x="245" y="20" width="210" height="55" />
        {/* Top penalty spot */}
        <circle cx="350" cy="131" r="4" fill="rgba(255,255,255,0.3)" />
        {/* Top penalty arc */}
        <path d="M 254 174 A 91.5 91.5 0 0 1 446 174" />
        {/* Bottom penalty box */}
        <rect x="139" y="876" width="422" height="154" />
        {/* Bottom 6-yard box */}
        <rect x="245" y="975" width="210" height="55" />
        {/* Bottom penalty spot */}
        <circle cx="350" cy="919" r="4" fill="rgba(255,255,255,0.3)" />
        {/* Bottom penalty arc */}
        <path d="M 254 876 A 91.5 91.5 0 0 0 446 876" />
      </g>
      {children}
    </svg>
  );
}

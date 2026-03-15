export function LiveBadge() {
  return (
    <span
      className="tag"
      style={{
        background: "var(--live-dim)",
        color: "var(--live)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--live)",
          animation: "live-pulse 1.6s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      Live
    </span>
  );
}

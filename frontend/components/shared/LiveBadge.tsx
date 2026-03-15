export function LiveBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "rgba(16, 185, 129, 0.15)",
        color: "var(--live)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        borderRadius: "9999px",
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--live)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      Live
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </span>
  );
}

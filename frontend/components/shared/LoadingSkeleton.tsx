interface LoadingSkeletonProps {
  rows?: number;
  height?: number;
}

export function LoadingSkeleton({ rows = 3, height = 80 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            borderRadius: "12px",
            background: "var(--surface-2)",
            animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          from { opacity: 0.4; }
          to { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

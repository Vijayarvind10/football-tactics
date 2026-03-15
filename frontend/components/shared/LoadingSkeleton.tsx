interface LoadingSkeletonProps {
  rows?: number;
  height?: number;
}

export function LoadingSkeleton({ rows = 3, height = 80 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="shimmer"
          style={{
            height,
            borderRadius: "10px",
            animationDelay: `${i * 0.12}s`,
            opacity: 1 - i * 0.06,
          }}
        />
      ))}
    </div>
  );
}

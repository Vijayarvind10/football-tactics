import { Suspense } from "react";
import { LiveFeed } from "@/components/live/LiveFeed";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <p className="stat-label" style={{ marginBottom: "8px" }}>
          Today · Real-time
        </p>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Live Matches
        </h1>
        <p
          style={{
            color: "var(--text-tertiary)",
            fontSize: "14px",
            marginTop: "6px",
          }}
        >
          Scores, formations, and events updated every 30 seconds
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton rows={4} height={130} />}>
        <LiveFeed />
      </Suspense>
    </div>
  );
}

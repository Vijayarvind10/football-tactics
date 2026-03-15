import { Suspense } from "react";
import { LiveFeed } from "@/components/live/LiveFeed";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
          Live Now
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "6px" }}>
          Real-time scores and formations from today&apos;s matches
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton rows={4} height={120} />}>
        <LiveFeed />
      </Suspense>
    </div>
  );
}

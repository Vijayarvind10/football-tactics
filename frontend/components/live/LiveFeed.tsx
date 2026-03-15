"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LiveMatchCard } from "./LiveMatchCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export function LiveFeed() {
  const {
    data: matches,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["matches", "live"],
    queryFn: api.matches.live,
    refetchInterval: 30_000,
  });

  if (isLoading) return <LoadingSkeleton rows={4} height={130} />;

  if (error)
    return (
      <div
        className="card"
        style={{ textAlign: "center", padding: "56px 24px" }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}>
          ⚠️
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "var(--text-tertiary)",
            fontWeight: 500,
          }}
        >
          Could not connect to live feed
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
          Check backend status on the Admin page
        </div>
      </div>
    );

  if (!matches?.length)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: "12px",
        }}
      >
        {/* Mini pitch icon */}
        <svg
          width="64"
          height="48"
          viewBox="0 0 64 48"
          fill="none"
          style={{ opacity: 0.15 }}
        >
          <rect x="1" y="1" width="62" height="46" rx="3" stroke="white" strokeWidth="1.5" />
          <line x1="1" y1="24" x2="63" y2="24" stroke="white" strokeWidth="1.5" />
          <circle cx="32" cy="24" r="8" stroke="white" strokeWidth="1.5" />
          <rect x="1" y="16" width="10" height="16" stroke="white" strokeWidth="1.5" />
          <rect x="53" y="16" width="10" height="16" stroke="white" strokeWidth="1.5" />
        </svg>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-tertiary)",
          }}
        >
          No live matches right now
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", maxWidth: "280px" }}>
          Matches update automatically on match days. Check back during kick-off times.
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "14px",
      }}
    >
      {matches.map((match) => (
        <LiveMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

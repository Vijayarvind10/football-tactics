"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LiveMatchCard } from "./LiveMatchCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export function LiveFeed() {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches", "live"],
    queryFn: api.matches.live,
    refetchInterval: 30_000,
  });

  if (isLoading) return <LoadingSkeleton rows={4} height={120} />;
  if (error) return (
    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
      Could not load live matches.
    </div>
  );
  if (!matches?.length) return (
    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚽</div>
      <div style={{ fontSize: "16px" }}>No live matches right now.</div>
      <div style={{ fontSize: "13px", marginTop: "6px" }}>Check back on match days.</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
      {matches.map((match) => (
        <LiveMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

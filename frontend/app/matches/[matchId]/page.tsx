"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { FormationVisualizer } from "@/components/formation/FormationVisualizer";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatScore } from "@/lib/utils";

export default function MatchPage() {
  const { matchId } = useParams();
  const id = Number(matchId);

  const { data: match, isLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: () => api.matches.get(id),
    refetchInterval: (query) => query.state.data?.status === "LIVE" ? 30_000 : false,
  });

  const { data: lineup } = useQuery({
    queryKey: ["lineup", id],
    queryFn: () => api.matches.lineup(id),
    enabled: !!match,
  });

  if (isLoading) return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 24px" }}>
      <LoadingSkeleton rows={3} height={100} />
    </div>
  );

  if (!match) return <div style={{ padding: "40px", color: "var(--text-muted)" }}>Match not found.</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Score header */}
      <div className="card" style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ marginBottom: "12px" }}>
          {match.status === "LIVE" ? <LiveBadge /> : (
            <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>{match.status}</span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "24px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, textAlign: "right" }}>{match.homeClub.name}</div>
          <div className="font-mono-data" style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {formatScore(match.homeScore, match.awayScore)}
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, textAlign: "left" }}>{match.awayClub.name}</div>
        </div>
        {match.status === "LIVE" && match.minute && (
          <div style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "14px" }}>{match.minute}&apos;</div>
        )}
      </div>

      {/* Formations */}
      {(match.homeFormation || match.awayFormation) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <FormationVisualizer
            formation={match.homeFormation ?? "4-4-2"}
            players={lineup?.home?.players ?? []}
            label={match.homeClub.name}
          />
          <FormationVisualizer
            formation={match.awayFormation ?? "4-4-2"}
            players={lineup?.away?.players ?? []}
            flip
            label={match.awayClub.name}
          />
        </div>
      )}
    </div>
  );
}

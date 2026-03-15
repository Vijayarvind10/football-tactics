"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function LeaguePage() {
  const { leagueId } = useParams();
  const id = Number(leagueId);

  const { data: standings, isLoading } = useQuery({
    queryKey: ["standings", id],
    queryFn: () => api.leagues.standings(id),
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Standings
      </h1>
      {isLoading ? <LoadingSkeleton rows={10} height={52} /> : (
        standings ? <StandingsTable standings={standings} /> : (
          <div style={{ color: "var(--text-muted)" }}>No standings data available.</div>
        )
      )}
    </div>
  );
}

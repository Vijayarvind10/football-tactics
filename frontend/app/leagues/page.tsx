"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function LeaguesPage() {
  const { data: leagues, isLoading } = useQuery({
    queryKey: ["leagues"],
    queryFn: api.leagues.list,
  });

  if (isLoading) return (
    <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 24px" }}>
      <LoadingSkeleton rows={5} height={72} />
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Leagues
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {leagues?.map((league) => (
          <Link key={league.id} href={`/leagues/${league.id}`} style={{ textDecoration: "none" }}>
            <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", color: "var(--text-primary)" }}>{league.name}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{league.country}</div>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "20px" }}>→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

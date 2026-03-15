import { db } from "./client";
import { leagues, clubs } from "./schema";

const LEAGUES = [
  { apiFootballId: 39, name: "Premier League", country: "England", season: 2024 },
  { apiFootballId: 140, name: "La Liga", country: "Spain", season: 2024 },
  { apiFootballId: 78, name: "Bundesliga", country: "Germany", season: 2024 },
  { apiFootballId: 135, name: "Serie A", country: "Italy", season: 2024 },
  { apiFootballId: 61, name: "Ligue 1", country: "France", season: 2024 },
];

const CLUBS = [
  { apiFootballId: 33, name: "Manchester United", country: "England", leagueApiId: 39 },
  { apiFootballId: 40, name: "Liverpool", country: "England", leagueApiId: 39 },
  { apiFootballId: 42, name: "Arsenal", country: "England", leagueApiId: 39 },
  { apiFootballId: 49, name: "Chelsea", country: "England", leagueApiId: 39 },
  { apiFootballId: 50, name: "Manchester City", country: "England", leagueApiId: 39 },
  { apiFootballId: 47, name: "Tottenham", country: "England", leagueApiId: 39 },
  { apiFootballId: 529, name: "Barcelona", country: "Spain", leagueApiId: 140 },
  { apiFootballId: 541, name: "Real Madrid", country: "Spain", leagueApiId: 140 },
  { apiFootballId: 530, name: "Atletico Madrid", country: "Spain", leagueApiId: 140 },
  { apiFootballId: 543, name: "Real Sociedad", country: "Spain", leagueApiId: 140 },
  { apiFootballId: 157, name: "Bayern Munich", country: "Germany", leagueApiId: 78 },
  { apiFootballId: 165, name: "Borussia Dortmund", country: "Germany", leagueApiId: 78 },
  { apiFootballId: 173, name: "RB Leipzig", country: "Germany", leagueApiId: 78 },
  { apiFootballId: 489, name: "AC Milan", country: "Italy", leagueApiId: 135 },
  { apiFootballId: 496, name: "Juventus", country: "Italy", leagueApiId: 135 },
  { apiFootballId: 505, name: "Inter Milan", country: "Italy", leagueApiId: 135 },
  { apiFootballId: 492, name: "Napoli", country: "Italy", leagueApiId: 135 },
  { apiFootballId: 81, name: "Paris Saint-Germain", country: "France", leagueApiId: 61 },
  { apiFootballId: 80, name: "Lyon", country: "France", leagueApiId: 61 },
  { apiFootballId: 91, name: "Monaco", country: "France", leagueApiId: 61 },
];

async function seed() {
  console.log("🌱 Seeding leagues...");
  await db.insert(leagues).values(LEAGUES).onConflictDoNothing();

  const allLeagues = await db.select().from(leagues);
  const leagueMap = new Map(allLeagues.map((l) => [l.apiFootballId, l.id]));

  console.log("🌱 Seeding clubs...");
  await db
    .insert(clubs)
    .values(
      CLUBS.map((c) => ({
        apiFootballId: c.apiFootballId,
        name: c.name,
        country: c.country,
        leagueId: leagueMap.get(c.leagueApiId) ?? 1,
      }))
    )
    .onConflictDoNothing();

  const allClubs = await db.select().from(clubs);
  console.log(`✅ Seeded ${allLeagues.length} leagues, ${allClubs.length} clubs`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

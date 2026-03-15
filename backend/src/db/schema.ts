import {
  pgEnum,
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const matchStatusEnum = pgEnum("match_status", [
  "SCHEDULED",
  "LIVE",
  "FINISHED",
  "POSTPONED",
  "CANCELLED",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "GOAL",
  "YELLOW_CARD",
  "RED_CARD",
  "SUBSTITUTION",
  "VAR",
  "PENALTY_MISSED",
]);

// Tables
export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  apiFootballId: integer("api_football_id").unique(),
  name: text("name"),
  country: text("country"),
  season: integer("season"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at"),
});

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  apiFootballId: integer("api_football_id").unique(),
  name: text("name"),
  shortName: text("short_name"),
  crestUrl: text("crest_url"),
  country: text("country"),
  leagueId: integer("league_id").references(() => leagues.id),
  createdAt: timestamp("created_at"),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  apiFootballId: integer("api_football_id").unique(),
  name: text("name"),
  position: text("position"),
  nationality: text("nationality"),
  dateOfBirth: date("date_of_birth"),
  photoUrl: text("photo_url"),
  clubId: integer("club_id").references(() => clubs.id),
  createdAt: timestamp("created_at"),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  apiFootballId: integer("api_football_id").unique(),
  leagueId: integer("league_id").references(() => leagues.id),
  homeClubId: integer("home_club_id").references(() => clubs.id),
  awayClubId: integer("away_club_id").references(() => clubs.id),
  kickoff: timestamp("kickoff"),
  status: matchStatusEnum("status"),
  minute: integer("minute"),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  homeFormation: text("home_formation"),
  awayFormation: text("away_formation"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const matchEvents = pgTable("match_events", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id),
  minute: integer("minute"),
  type: eventTypeEnum("type"),
  detail: text("detail"),
  playerName: text("player_name"),
  assistName: text("assist_name"),
  teamApiId: integer("team_api_id"),
  createdAt: timestamp("created_at"),
});

export const matchLineups = pgTable(
  "match_lineups",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id").references(() => matches.id),
    clubApiId: integer("club_api_id"),
    formation: text("formation"),
    createdAt: timestamp("created_at"),
  },
  (t) => ({
    uniqueMatchClub: unique().on(t.matchId, t.clubApiId),
  })
);

export const matchLineupPlayers = pgTable("match_lineup_players", {
  id: serial("id").primaryKey(),
  lineupId: integer("lineup_id").references(() => matchLineups.id),
  playerId: integer("player_id").references(() => players.id),
  gridPosition: text("grid_position"),
  number: integer("number"),
  pos: text("pos"),
  isSub: boolean("is_sub").default(false),
});

export const formations = pgTable("formations", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  formation: text("formation"),
  matchId: integer("match_id"),
  usedAt: timestamp("used_at"),
  season: integer("season"),
  won: boolean("won"),
  drew: boolean("drew"),
  createdAt: timestamp("created_at"),
});

export const standings = pgTable(
  "standings",
  {
    id: serial("id").primaryKey(),
    leagueId: integer("league_id").references(() => leagues.id),
    clubId: integer("club_id").references(() => clubs.id),
    season: integer("season"),
    rank: integer("rank"),
    points: integer("points"),
    played: integer("played"),
    won: integer("won"),
    drawn: integer("drawn"),
    lost: integer("lost"),
    goalsFor: integer("goals_for"),
    goalsAgainst: integer("goals_against"),
    goalDiff: integer("goal_diff"),
    form: text("form"),
    updatedAt: timestamp("updated_at"),
  },
  (t) => ({
    uniqueLeagueClubSeason: unique().on(t.leagueId, t.clubId, t.season),
  })
);

// Relations
export const leaguesRelations = relations(leagues, ({ many }) => ({
  clubs: many(clubs),
  matches: many(matches),
  standings: many(standings),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  league: one(leagues, { fields: [clubs.leagueId], references: [leagues.id] }),
  players: many(players),
  homeMatches: many(matches, { relationName: "homeClub" }),
  awayMatches: many(matches, { relationName: "awayClub" }),
  formations: many(formations),
  standings: many(standings),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  club: one(clubs, { fields: [players.clubId], references: [clubs.id] }),
  lineupPlayers: many(matchLineupPlayers),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  league: one(leagues, { fields: [matches.leagueId], references: [leagues.id] }),
  homeClub: one(clubs, { fields: [matches.homeClubId], references: [clubs.id], relationName: "homeClub" }),
  awayClub: one(clubs, { fields: [matches.awayClubId], references: [clubs.id], relationName: "awayClub" }),
  events: many(matchEvents),
  lineups: many(matchLineups),
}));

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matches, { fields: [matchEvents.matchId], references: [matches.id] }),
}));

export const matchLineupsRelations = relations(matchLineups, ({ one, many }) => ({
  match: one(matches, { fields: [matchLineups.matchId], references: [matches.id] }),
  players: many(matchLineupPlayers),
}));

export const matchLineupPlayersRelations = relations(matchLineupPlayers, ({ one }) => ({
  lineup: one(matchLineups, { fields: [matchLineupPlayers.lineupId], references: [matchLineups.id] }),
  player: one(players, { fields: [matchLineupPlayers.playerId], references: [players.id] }),
}));

export const formationsRelations = relations(formations, ({ one }) => ({
  club: one(clubs, { fields: [formations.clubId], references: [clubs.id] }),
}));

export const standingsRelations = relations(standings, ({ one }) => ({
  league: one(leagues, { fields: [standings.leagueId], references: [leagues.id] }),
  club: one(clubs, { fields: [standings.clubId], references: [clubs.id] }),
}));

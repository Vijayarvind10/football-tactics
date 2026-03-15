CREATE TYPE "public"."event_type" AS ENUM('GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'VAR', 'PENALTY_MISSED');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_football_id" integer,
	"name" text,
	"short_name" text,
	"crest_url" text,
	"country" text,
	"league_id" integer,
	"created_at" timestamp,
	CONSTRAINT "clubs_api_football_id_unique" UNIQUE("api_football_id")
);
--> statement-breakpoint
CREATE TABLE "formations" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer,
	"formation" text,
	"match_id" integer,
	"used_at" timestamp,
	"season" integer,
	"won" boolean,
	"drew" boolean,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_football_id" integer,
	"name" text,
	"country" text,
	"season" integer,
	"logo_url" text,
	"created_at" timestamp,
	CONSTRAINT "leagues_api_football_id_unique" UNIQUE("api_football_id")
);
--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"minute" integer,
	"type" "event_type",
	"detail" text,
	"player_name" text,
	"assist_name" text,
	"team_api_id" integer,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "match_lineup_players" (
	"id" serial PRIMARY KEY NOT NULL,
	"lineup_id" integer,
	"player_id" integer,
	"grid_position" text,
	"number" integer,
	"pos" text,
	"is_sub" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "match_lineups" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"club_api_id" integer,
	"formation" text,
	"created_at" timestamp,
	CONSTRAINT "match_lineups_match_id_club_api_id_unique" UNIQUE("match_id","club_api_id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_football_id" integer,
	"league_id" integer,
	"home_club_id" integer,
	"away_club_id" integer,
	"kickoff" timestamp,
	"status" "match_status",
	"minute" integer,
	"home_score" integer DEFAULT 0,
	"away_score" integer DEFAULT 0,
	"home_formation" text,
	"away_formation" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "matches_api_football_id_unique" UNIQUE("api_football_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_football_id" integer,
	"name" text,
	"position" text,
	"nationality" text,
	"date_of_birth" date,
	"photo_url" text,
	"club_id" integer,
	"created_at" timestamp,
	CONSTRAINT "players_api_football_id_unique" UNIQUE("api_football_id")
);
--> statement-breakpoint
CREATE TABLE "standings" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"club_id" integer,
	"season" integer,
	"rank" integer,
	"points" integer,
	"played" integer,
	"won" integer,
	"drawn" integer,
	"lost" integer,
	"goals_for" integer,
	"goals_against" integer,
	"goal_diff" integer,
	"form" text,
	"updated_at" timestamp,
	CONSTRAINT "standings_league_id_club_id_season_unique" UNIQUE("league_id","club_id","season")
);
--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formations" ADD CONSTRAINT "formations_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineup_players" ADD CONSTRAINT "match_lineup_players_lineup_id_match_lineups_id_fk" FOREIGN KEY ("lineup_id") REFERENCES "public"."match_lineups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineup_players" ADD CONSTRAINT "match_lineup_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineups" ADD CONSTRAINT "match_lineups_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_club_id_clubs_id_fk" FOREIGN KEY ("home_club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_club_id_clubs_id_fk" FOREIGN KEY ("away_club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;
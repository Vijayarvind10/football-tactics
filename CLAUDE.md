# Football Tactics — Project Guide

Full-stack football tactics analysis tool. Tracks real-time match data, formations, and provides AI-powered tactical recommendations for the Top 5 European leagues.

---

## Stack (March 2026)

| Layer | Tool |
|---|---|
| Runtime | **Bun** — use `bun` not `node`, `bunx` not `npx` |
| Backend | **Hono** on Bun — port 3001 |
| ORM | **Drizzle ORM** — schema in `backend/src/db/schema.ts` |
| Database | **Neon** (serverless Postgres) — HTTP driver |
| Cache / Jobs | **Upstash Redis** + **BullMQ** |
| Frontend | **Next.js 15** (App Router) — port 3000 |
| State | TanStack Query v5 + Zustand |
| Charts | Recharts |
| Real-time | Hono native WebSockets (no Socket.io) |
| AI | Claude API + TypeScript MCP SDK — port 3002 |
| Formatter | **Biome** — run `bunx biome format --write .` |
| Deployment | Railway |
| Data | API-Football (api-sports.io) — 100 calls/day limit |

---

## Services

```
football-tactics/
├── backend/      ← Hono + Drizzle + BullMQ   (port 3001)
├── frontend/     ← Next.js 15                  (port 3000)
└── mcp-server/   ← TypeScript MCP SDK          (port 3002)
```

### Start dev
```bash
cd backend && bun run dev
cd frontend && bun run dev
cd mcp-server && bun run dev
```

---

## Critical Rules

1. **Never use `npm` or `node`** — always `bun` / `bunx`
2. **Never edit `.env` files directly** — use Railway dashboard or `.env.example`
3. **Never edit migration files** — run `bunx drizzle-kit generate` to create new migrations
4. **Format with Biome** — `bunx biome format --write <file>` after every write
5. **API-Football quota** — 100 calls/day. Check `/api/admin/quota` before adding new on-demand calls
6. **Drizzle schema** — all models in `backend/src/db/schema.ts`. After changes: `bunx drizzle-kit generate && bunx drizzle-kit migrate`

---

## Database

```bash
# Generate migration after schema change
cd backend && bunx drizzle-kit generate

# Apply migrations
cd backend && bunx drizzle-kit migrate

# Seed
cd backend && bun run src/db/seed.ts
```

---

## API-Football Budget

| Job | Calls/day |
|---|---|
| liveSync (every 60s on match days) | ~90 |
| standingsSync (daily) | 5 |
| fixtureSync (weekly) | ~1 |
| On-demand (players, H2H, predictions) | 1–4 |

Quota guard blocks demand-driven calls at 90/day. Monitor at `GET /api/admin/quota`.

---

## WebSocket Protocol

Backend emits to rooms `match:{id}` and `global:live`.

Message types (see `backend/src/ws/rooms.ts`):
```ts
{ type: "score_update", matchId, homeScore, awayScore, minute }
{ type: "match_event", matchId, eventType, minute, playerName, teamId }
{ type: "status_change", matchId, status }
{ type: "live_update", matches: MatchSummary[] }
```

---

## MCP Tools (Tactical AI)

Server at port 3002. Tools:
- `get_club_formations` — formation history with outcomes
- `get_head_to_head` — H2H record between clubs
- `compare_tactics` — side-by-side tactical metrics
- `analyze_formation` — strengths/weaknesses of a formation
- `suggest_tactics` — recommended formation to beat opponent
- `get_recent_matches` — last N matches for a club
- `get_standings` — current league table
- `get_player_stats` — player stats by season

---

## Design System

Direction: **Boldness & Clarity** (dark, high-contrast)
System: `frontend/.interface-design/system.md`

Key tokens:
```css
--bg: #0A0A0A
--surface-1: #111111
--surface-2: #161616
--accent: #3B82F6
--live: #10B981
--warning: #F59E0B
--danger: #EF4444
--pitch: #166534
```

---

## Testing

```bash
cd backend && bun test
cd frontend && bun test
cd mcp-server && bun test
```

---

## Hooks (`.claude/settings.json`)

Active hooks:
- **guard-destructive**: blocks `rm -rf`, `DROP TABLE`, force operations in Bash
- **protect-env**: blocks direct edits to `.env` files
- **protect-migrations**: warns when editing migration SQL directly
- **biome-format**: auto-formats `.ts`, `.tsx`, `.json` after every Write/Edit
- **schema-reminder**: reminds to run `drizzle-kit generate` after `schema.ts` changes
- **compact-context**: re-injects project conventions after context compaction

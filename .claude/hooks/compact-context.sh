#!/bin/bash
# SessionStart: Re-inject key conventions after context compaction

cat <<'EOF'
=== Football Tactics Project — Key Conventions ===

Stack:
- Runtime: Bun (use `bun`, not `node`; `bunx`, not `npx`)
- Backend: Hono on Bun (port 3001)
- ORM: Drizzle ORM (schema at backend/src/db/schema.ts)
- Database: Neon serverless Postgres
- Cache/Jobs: Upstash Redis + BullMQ
- Frontend: Next.js 15 App Router (port 3000)
- MCP: TypeScript MCP SDK (port 3002)
- Formatter: Biome (NOT Prettier/ESLint)
- Deployment: Railway

Rules:
- NEVER use npm, always bun
- NEVER edit .env files directly
- NEVER edit migration files manually (use drizzle-kit generate)
- Format with Biome after every file write
- API-Football quota: 100 calls/day max (check /api/admin/quota)
- After schema.ts changes: bunx drizzle-kit generate && bunx drizzle-kit migrate

Start services:
  cd backend && bun run dev
  cd frontend && bun run dev
  cd mcp-server && bun run dev
EOF

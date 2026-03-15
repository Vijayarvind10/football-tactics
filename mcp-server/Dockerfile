FROM oven/bun:1.3.10-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 3002

CMD ["bun", "run", "src/http.ts"]

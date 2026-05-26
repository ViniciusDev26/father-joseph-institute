FROM oven/bun:1 AS dev

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

ENV HOSTNAME=0.0.0.0

CMD ["bun", "run", "dev"]

FROM oven/bun:1 AS base

FROM base AS deps

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM oven/bun:1-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["bun", "server.js"]

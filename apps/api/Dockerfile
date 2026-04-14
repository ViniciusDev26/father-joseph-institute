FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY tsconfig.json ./

RUN bun run build

FROM debian:bookworm-slim AS runtime

RUN addgroup --system app && adduser --system --ingroup app app

COPY --from=build /app/dist/server /usr/local/bin/server

USER app

ENV PORT=3001
EXPOSE 3001

CMD ["server"]

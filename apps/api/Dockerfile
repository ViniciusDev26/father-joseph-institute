FROM oven/bun:1 AS dev

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

CMD ["bun", "run", "dev"]

FROM oven/bun:1 AS runtime

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY tsconfig.json ./

USER bun

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["bun", "src/server.ts"]

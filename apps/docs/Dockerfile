# Stage 1: Dev
FROM oven/bun:1.2-alpine AS dev

WORKDIR /app

# Copy app package.json
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose VitePress default port
EXPOSE 5173

CMD ["bun", "run", "dev", "--host"]

# Stage 2: Build
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Copy monorepo config
COPY package.json bun.lock turbo.json biome.json ./
# Copy app package.json
COPY apps/docs/package.json ./apps/docs/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/docs ./apps/docs

# Build the documentation
RUN bunx turbo run build --filter=docs

# Stage 3: Serve (Production)
FROM nginx:alpine

# Copy the custom nginx config for cleanUrls
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder /app/apps/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

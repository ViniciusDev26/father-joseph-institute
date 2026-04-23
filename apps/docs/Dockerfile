# Stage 1: Dev
FROM oven/bun:1.2-alpine AS dev

WORKDIR /app

# Em contexto de apps/docs, o package.json local é o ./package.json
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

# Para build monorepo-aware, precisaríamos do contexto na raiz.
# Como o docker-compose usa apps/docs como contexto, vamos simplificar o build
# para ser local ao app, o que é mais rápido e consistente com os outros serviços.

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Build local sem depender do turbo se estivermos dentro da pasta
RUN bun run build

# Stage 3: Serve (Production)
FROM nginx:alpine

# Copy the custom nginx config for cleanUrls
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
# O VitePress gera em .vitepress/dist relativo à raiz do app docs
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

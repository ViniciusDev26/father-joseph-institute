# Instituto Padre José

Monorepo do projeto Instituto Padre José — organização que ajuda moradores de rua, dá visibilidade ao trabalho de artesãs e comercializa os produtos produzidos por elas.

## Estrutura

```
apps/
├── site/    # Site institucional (Next.js 16 + Tailwind CSS 4)
├── api/     # API REST (Fastify 5 + Bun)
├── docs/    # Site de documentação (VitePress)
└── admin/   # Painel administrativo (a definir)
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime / Package Manager | Bun |
| Monorepo | Turborepo |
| Site | Next.js, Tailwind CSS, TypeScript |
| API | Fastify, TypeScript, Zod |
| Docs | VitePress |
| Linter / Formatter | Biome |

## Pré-requisitos

- [Bun](https://bun.sh) >= 1.2

## Setup

```bash
bun install
```

## Desenvolvimento

Rodar todos os projetos:

```bash
bun run dev
```

Rodar um projeto específico:

```bash
bunx turbo run dev --filter=site
bunx turbo run dev --filter=api
bunx turbo run dev --filter=docs
```

## Build

```bash
bun run build
```

## Lint

```bash
bun run lint
```

## Docker

```bash
# API
docker build -t father-joseph-api apps/api
docker run -p 3001:3001 father-joseph-api

# Site
docker build -t father-joseph-site apps/site
docker run -p 3000:3000 -e API_URL=http://host.docker.internal:3001 father-joseph-site

# Docs
bunx turbo run build --filter=docs
bunx turbo run dev --filter=docs
```

## Documentação

- [Ideia do projeto](apps/docs/IDEA.md)
- [ADRs globais](apps/docs/adr/)
- [ADRs do site](apps/docs/adr/site/)
- [ADRs da API](apps/docs/adr/api/)
- [Site da documentação](apps/docs/)

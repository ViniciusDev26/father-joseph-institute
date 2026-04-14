# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Instituto Padre José — a Brazilian nonprofit monorepo. The organization helps homeless people, gives visibility to artisan women's work, and commercializes their handmade products. Portuguese (pt-BR) for UI text, English for code/filenames.

## Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (single app)
bunx turbo run dev --filter=site
bunx turbo run dev --filter=api

# Build all
bun run build

# Lint all
bun run lint

# Lint single app
biome check .                  # from within apps/site or apps/api
biome check --write .          # auto-fix

# Docker
docker build -t father-joseph-api apps/api
docker build -t father-joseph-site apps/site
```

## Architecture

Turborepo monorepo with Bun as sole runtime/package manager. Two active apps:

**`apps/site`** — Next.js 16 + App Router + Tailwind CSS 4. Server components fetch content from the API with 60s ISR revalidation (`src/lib/api.ts`). Design system uses custom earthy color palette and Fraunces/Albert Sans fonts defined in `globals.css` via `@theme inline`. Output mode is `standalone` for Docker.

**`apps/api`** — Fastify 5 on Bun. Uses `fastify-type-provider-zod` so Zod schemas drive validation, TypeScript types (`z.infer<>`), and OpenAPI spec generation simultaneously. Scalar serves interactive docs at `/docs`. Builds to standalone binary via `bun build --compile`.

**`docs/adr/`** — Architecture Decision Records organized per project (`api/`, `site/`, `admin/`), each with independent numbering starting at 001.

## Key Conventions

- **Environment variables**: Always validated with Zod in `env.ts` — import `env` object, never use `process.env` directly.
- **Routes (site)**: Centralized in `src/lib/routes.ts` — import from there, never hardcode paths.
- **API schemas**: Define Zod schemas in `src/schemas/`, infer types with `z.infer<>` in `src/types/`. The same schema feeds route validation, TypeScript types, and OpenAPI docs.
- **Biome**: Root config sets the baseline. Each app extends with `"extends": "//"`. Site adds `next` and `react` domains plus `tailwindDirectives`.
- **Formatting**: Single quotes, semicolons always, trailing commas all, 2-space indent, 100 char line width, arrow parens as needed.
- **Docker**: Always use `oven/bun` base images. Prefer `package.json` scripts over raw commands in Dockerfiles.
- **Language**: Code, filenames, routes, and git messages in English. Only UI-facing text in Portuguese.

## Stack Reference

| Layer | Technology |
|-------|-----------|
| Runtime / Package Manager | Bun >= 1.2 |
| Monorepo | Turborepo |
| Site | Next.js 16, Tailwind CSS 4, TypeScript |
| API | Fastify 5, TypeScript, Zod 4 |
| API Docs | @fastify/swagger + @scalar/fastify-api-reference |
| Type Provider | fastify-type-provider-zod |
| ORM (planned) | Drizzle |
| Linter / Formatter | Biome v2 |

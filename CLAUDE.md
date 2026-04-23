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

**`apps/docs/adr/`** — Architecture Decision Records organized per project (`api/`, `site/`, `admin/`), each with independent numbering starting at 001.

## Spec-Driven Development

This project follows a **spec-driven** approach. Specs live in `apps/docs/specs/` and are the single source of truth for what the application should do. See `apps/docs/specs/README.md` for full details.

Backend and frontend are independent — they communicate exclusively through API specs. Never reference one side from the other directly.

### Rules for the AI

1. **Spec first, code second.** Before implementing anything, check if a spec exists in `apps/docs/specs/`. If not, write the spec and get user approval before writing code.
2. **Implement only what is specified.** If the user asks for a list endpoint, create only the list endpoint — not the full CRUD. If a spec defines three fields, implement three fields — not five. Never add endpoints, fields, features, or behaviors beyond what was explicitly requested or specified.
3. **Follow the templates.** Use the `_template.md` in the corresponding directory:
   - Entities: `apps/docs/specs/backend/entities/_template.md`
   - Backend features: `apps/docs/specs/backend/features/_template.md`
   - API contracts: `apps/docs/specs/api/_template.md`
   - Pages: `apps/docs/specs/frontend/pages/_template.md`
   - Components: `apps/docs/specs/frontend/components/_template.md`
   - Frontend features: `apps/docs/specs/frontend/features/_template.md`
4. **Specs override assumptions.** If a spec says something, follow the spec — even if a "common" pattern would do it differently.
5. **Flag conflicts.** If a user request contradicts an existing spec, flag the conflict and ask for clarification before proceeding.
6. **Reference ADRs for the _how_.** Specs define _what_ to build. ADRs in `apps/docs/adr/` define _how_ (patterns, conventions, tech choices). Don't duplicate ADR content in specs.
7. **Read all ADRs before implementing.** Before writing any code for a feature spec, read all ADRs in the corresponding project directory (e.g., `apps/docs/adr/api/` for API features) to ensure the implementation follows every established convention.

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
| ORM | Drizzle |
| Linter / Formatter | Biome v2 |

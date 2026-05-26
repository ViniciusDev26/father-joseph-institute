# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Instituto Padre José — a Brazilian nonprofit. The organization helps homeless people, gives visibility to artisan women's work, and commercializes their handmade products. Portuguese (pt-BR) for UI text, English for code/filenames.

## Commands

```bash
# Install dependencies
bun install

# Development
bun run dev

# Build
bun run build

# Lint
bun run lint
biome check --write .          # auto-fix

# Database
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:seed

# Docker
docker build -t father-joseph .
```

## Architecture

Single Next.js 16 fullstack project at the repo root. `apps/docs/` keeps the spec-driven documentation tree.

- **Next.js App Router** drives both the public site and the admin panel.
- **Route Handlers under `src/app/api/*`** replace the previous Fastify service. They share business logic with server components through `src/lib/data/*`.
- **Drizzle ORM** against Postgres (Supabase pooler in production, local Postgres via `docker-compose` in dev).
- **Cloudflare R2** for image storage via presigned URLs (`src/lib/storage.ts`).
- **Admin** lives under `/admin/*`, protected by Next middleware that checks the `admin_session` httpOnly cookie. Route handlers also call `requireAdmin()` for defense in depth.

## Spec-Driven Development

This project follows a **spec-driven** approach. Specs live in `apps/docs/specs/` and are the single source of truth for what the application should do. See `apps/docs/specs/README.md` for full details.

The backend/frontend split in the specs remains conceptually useful even though they now share a process — the API contracts define what `src/app/api/*` exposes, frontend specs define what the pages render.

### Rules for the AI

1. **Spec first, code second.** Before implementing anything, check if a spec exists in `apps/docs/specs/`. If not, write the spec and get user approval before writing code.
2. **Implement only what is specified.** If the user asks for a list endpoint, create only the list endpoint — not the full CRUD. If a spec defines three fields, implement three fields — not five. Never add endpoints, fields, features, or behaviors beyond what was explicitly requested or specified.
3. **Follow the templates** in `apps/docs/specs/*/_template.md`.
4. **Specs override assumptions.** If a spec says something, follow the spec — even if a "common" pattern would do it differently.
5. **Flag conflicts.** If a user request contradicts an existing spec, flag the conflict and ask for clarification before proceeding.
6. **Reference ADRs for the _how_.** Specs define _what_ to build. ADRs in `apps/docs/adr/` define _how_ (patterns, conventions, tech choices). Don't duplicate ADR content in specs.

## Key Conventions

- **Environment variables**: Always validated with Zod in `src/lib/env.ts` — import `env` object, never use `process.env` directly. Never use `.default()` — every env must be explicitly provided.
- **Routes (site)**: Centralized in `src/lib/routes.ts` — import from there, never hardcode paths.
- **Data layer**: `src/lib/data/*` is the single surface for DB access. Server components and route handlers both call into it; never query Drizzle directly from a page or handler.
- **API schemas**: Zod schemas in `src/schemas/` validate the public API surface (request bodies, params). Types are inferred with `z.infer<>` in `src/types/api/`. Form-only schemas (admin) live in `src/admin-schemas/`.
- **Route handlers**: thin. Use `requireAdmin()` from `src/lib/auth.ts` to guard, `parseJsonBody`/`parseParams` from `src/lib/api-handler.ts` to validate, then delegate to a data fn and map its discriminated-union result to `NextResponse`.
- **Admin auth**: Basic Auth credentials via `ADMIN_BASIC_AUTH_TOKEN`. Login at `/api/auth/login` sets the `admin_session` httpOnly cookie. Middleware redirects unauthenticated `/admin/*` to `/admin/login`.
- **Formatting**: Single quotes, semicolons always, trailing commas all, 2-space indent, 100 char line width, arrow parens as needed.
- **Docker**: Always use `oven/bun` base images. Prefer `package.json` scripts over raw commands in Dockerfiles.
- **Language**: Code, filenames, routes, and git messages in English. Only UI-facing text in Portuguese.

## Stack Reference

| Layer | Technology |
|-------|-----------|
| Runtime / Package Manager | Bun >= 1.2 |
| Framework | Next.js 16 (App Router), Tailwind CSS 4, TypeScript |
| API | Next Route Handlers + Zod 4 |
| ORM | Drizzle |
| Storage | Cloudflare R2 |
| Linter / Formatter | Biome v2 |
| Forms (admin) | react-hook-form + @hookform/resolvers + shadcn/ui |

# Development Guide

How to set up, understand, and contribute to this project.

## Prerequisites

- [Bun](https://bun.sh) >= 1.2
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A code editor with TypeScript and Biome support

## Getting started

```bash
# 1. Clone and install
git clone <repo-url>
cd father-joseph-institute
bun install

# 2. Start infrastructure (PostgreSQL)
docker compose up postgres -d

# 3. Set up environment variables
cp apps/api/.env.example apps/api/.env    # fill in your values
cp apps/site/.env.example apps/site/.env  # fill in your values

# 4. Run development servers
bun run dev                               # all apps
bunx turbo run dev --filter=api           # api only
bunx turbo run dev --filter=site          # site only
bunx turbo run dev --filter=docs          # docs only
```

Alternatively, run everything in Docker:

```bash
docker compose up
```

### Ports

| Service | URL |
|---------|-----|
| Site | http://localhost:3000 |
| API | http://localhost:3001 |
| API Docs (Scalar) | http://localhost:3001/docs |
| Project Docs (VitePress) | http://localhost:5173 |
| PostgreSQL | localhost:5432 |

## Project structure

```
father-joseph-institute/
├── apps/
│   ├── api/                  # Fastify 5 REST API
│   │   ├── src/
│   │   │   ├── database/     # Drizzle schema, connection, migrations
│   │   │   ├── routes/       # Fastify route plugins
│   │   │   ├── schemas/      # Zod validation schemas
│   │   │   ├── types/        # TypeScript types (inferred from Zod)
│   │   │   ├── lib/          # Shared utilities (storage, etc.)
│   │   │   ├── env.ts        # Validated environment variables
│   │   │   └── server.ts     # Server entry point
│   │   └── drizzle.config.ts
│   ├── docs/                 # VitePress app for the published docs site
│   │   ├── .vitepress/       # VitePress config
│   │   ├── adr/              # Architecture Decision Records
│   │   └── specs/            # Feature and entity specifications
│   └── site/                 # Next.js 16 frontend
│       └── src/
│           ├── app/          # App Router pages
│           ├── components/   # React components
│           └── lib/          # Utilities, routes, env
├── CLAUDE.md                 # AI assistant instructions
├── DEVELOPMENT.md            # This file
└── docker-compose.yml
```

## Development workflow

This project uses **spec-driven development**. Specs are the single source of truth for what the application should do. Code follows specs, not the other way around.

### The flow

```
1. Define spec  →  2. Review  →  3. Implement  →  4. Verify against spec
```

1. **Define the spec.** Before writing any code, create or update the relevant spec in `apps/docs/specs/`. Use the `_template.md` in each directory as a starting point.
2. **Review.** Specs are reviewed like code. Make sure the spec is complete and accurate before implementing.
3. **Implement.** Write only what the spec defines. No more, no less.
4. **Verify.** After implementation, the code should match the spec exactly.

### Spec structure

```
apps/docs/specs/
├── api/                  # API contracts — the bridge between back and front
├── backend/
│   ├── entities/         # Database entities (one file per table)
│   └── features/         # Backend features
└── frontend/
    ├── pages/            # Site pages
    ├── components/       # Reusable UI components
    └── features/         # Frontend features
```

Backend and frontend are **independent**. They communicate exclusively through **API specs**. A backend feature references entity specs + API specs it implements. A frontend feature references API specs + page/component specs it uses. They never reference each other directly.

### When using AI assistants

This project is designed for AI-driven development. The `CLAUDE.md` file contains instructions that AI assistants follow. Key rules:

- The AI reads specs before implementing anything.
- The AI implements **only** what is specified — no extrapolation.
- If a spec doesn't exist, the AI writes it first and asks for approval.

This means specs must be precise. Ambiguous specs lead to ambiguous implementations.

## ADRs vs Specs

This project has two types of documentation that drive development. They serve different purposes and should not be mixed.

| | ADRs (`apps/docs/adr/`) | Specs (`apps/docs/specs/`) |
|---|---|---|
| **Answer** | _How_ to build | _What_ to build |
| **Scope** | Technical decisions | Product/feature decisions |
| **Examples** | "Use Drizzle as ORM", "All tables have soft delete", "Use Bun as runtime" | "Event has name, date, description", "GET /events returns paginated list", "Home page shows 3 latest events" |
| **Lifespan** | Long-lived — rarely change once accepted | Evolve as the product grows |
| **Audience** | Developers making technical choices | Developers implementing features |

**Specs reference ADRs, never the other way around.** For example, the event entity spec defines its specific fields (name, date, description). It does not repeat that every table has `created_at`, `updated_at`, and `deleted_at` — that's an ADR ([ADR-007](apps/docs/adr/api/007-paranoid-soft-delete.md)) that applies to all entities.

When in doubt: if the decision is about _which tool, pattern, or convention_ to use, it's an ADR. If it's about _what the user sees or what data exists_, it's a spec.

### ADR organization

ADRs are organized by scope:

| Directory | Scope |
|-----------|-------|
| `apps/docs/adr/` | Global (monorepo-wide) |
| `apps/docs/adr/api/` | API-specific |
| `apps/docs/adr/site/` | Site-specific |

All significant technical decisions must be documented as ADRs. Before proposing a new library, pattern, or convention, check existing ADRs. If your proposal changes or contradicts an ADR, update the ADR as part of the change.

## Code conventions

### Language

- Code, filenames, routes, git messages: **English**
- UI-facing text (labels, descriptions, page content): **Portuguese (pt-BR)**

### Formatting (Biome)

Single quotes, semicolons always, trailing commas, 2-space indent, 100 char line width. Run `biome check --write .` from within an app to auto-fix.

### Environment variables

Always validated with Zod in `env.ts`. Import the `env` object — never use `process.env` directly. Never add `.default()` to env schemas; all values must be explicitly provided.

### API conventions

- **Zod schemas** in `src/schemas/` drive validation, TypeScript types, and OpenAPI docs simultaneously.
- **Types** in `src/types/` are inferred from Zod via `z.infer<>` — never write interfaces manually.
- **Routes** are Fastify plugins registered in `server.ts`.
- **Database** uses Drizzle ORM. One file per entity in `src/database/schema/`, barrel export in `index.ts`.
- **Soft delete** on all entities via `deleted_at` column (see [ADR-007](apps/docs/adr/api/007-paranoid-soft-delete.md)).

### Site conventions

- **Routes** centralized in `src/lib/routes.ts` — never hardcode paths.
- **Server components** fetch data from the API.

### Database commands

Run from `apps/api/`:

```bash
bun run db:generate    # Generate SQL migration from schema changes
bun run db:migrate     # Apply pending migrations
bun run db:push        # Sync schema directly (dev only)
bun run db:studio      # Open Drizzle Studio
```

Migrations run automatically on API startup — no need to run `db:migrate` manually in most cases.

## Docker

Always use `oven/bun` base images. Prefer `package.json` scripts over raw commands in Dockerfiles.

```bash
# Build individual images
docker build -t father-joseph-api apps/api
docker build -t father-joseph-site apps/site

# Build docs
bunx turbo run build --filter=docs

# Run full stack
docker compose up

# Run with file watching (development)
docker compose watch
```

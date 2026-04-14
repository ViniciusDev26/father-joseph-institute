# ADR-004: Drizzle as ORM

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The API currently serves hardcoded content (see ADR-003). The next step is introducing a database so that content can be managed at runtime via CRUD endpoints and an admin panel. We need an ORM that is lightweight, type-safe, and works well with Bun and TypeScript.

## Decision

Use **Drizzle ORM** as the data access layer for the API.

- **Schema definition:** Drizzle schemas defined in TypeScript, co-located in `src/db/schema/`.
- **Migrations:** Managed with `drizzle-kit` — generate SQL migrations from schema changes.
- **Query style:** Prefer the relational query API for reads and the insert/update/delete builders for writes.
- **Driver:** Use the appropriate Drizzle driver for the chosen database (e.g., `drizzle-orm/postgres-js` for PostgreSQL).

## Consequences

- Full type safety from schema to query results — no manual type casting or raw SQL for standard operations.
- Drizzle is one of the lightest ORMs available, with no heavy runtime or code generation step, which aligns with the project's preference for fast builds and minimal dependencies.
- Migrations are plain SQL files, making them easy to review, version, and run in CI/CD.
- The team must learn Drizzle's API, but its SQL-like syntax has a low learning curve compared to heavier ORMs.
- Raw SQL remains available via `drizzle.execute()` for complex queries that don't map well to the query builder.

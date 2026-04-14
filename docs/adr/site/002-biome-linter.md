# ADR-002: Biome as Linter and Formatter

**Status:** Accepted  
**Date:** 2026-04-14

## Context

We needed a linter and formatter for the codebase. ESLint combined with Prettier is the traditional choice, but it requires maintaining two separate tools with overlapping concerns and can be slow on larger codebases. We wanted a single, fast tool that handles both linting and formatting.

## Decision

We chose **Biome** as the unified linter and formatter, replacing ESLint and Prettier entirely.

- Each project in the monorepo has its own `biome.json` that extends the root configuration via `"extends": "//"`.
- The site-specific `biome.json` adds the **Next.js** and **React** domains to enable framework-specific lint rules.
- The site config also includes support for **Tailwind CSS directives** (e.g., `@tailwind`, `@apply`) so Biome does not flag them as errors.

## Consequences

- A single tool handles both linting and formatting, reducing configuration overhead and eliminating conflicts between separate tools.
- Biome is significantly faster than ESLint, making the feedback loop shorter during development and in CI.
- The `"extends": "//"` pattern keeps shared rules centralized in the root config while allowing per-project overrides.
- Contributors must use Biome instead of ESLint/Prettier; editor extensions and CI scripts need to be configured accordingly.
- If Biome lacks a specific rule that ESLint provides, we may need to add a custom check or accept the gap.

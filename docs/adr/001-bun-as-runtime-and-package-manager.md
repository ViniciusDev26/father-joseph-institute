# ADR-001: Bun as runtime and package manager

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The monorepo needs a consistent runtime and package manager across all projects (site, api, admin). Using different tools (npm, yarn, pnpm) across projects creates friction, inconsistent lockfiles, and slower CI pipelines.

## Decision

Use Bun as the sole runtime and package manager for the entire monorepo:

- **Package management:** `bun install`, `bun add`, `bun remove` — no npm, yarn, or pnpm
- **Script execution:** `bun run <script>` for all package.json scripts
- **TypeScript execution:** `bun --watch` for dev servers (API)
- **Build:** `bun build --compile` for standalone binaries (API)
- **Docker images:** `oven/bun` as base image in all Dockerfiles
- **Lockfile:** `bun.lock` is the single lockfile, committed to the repository

## Consequences

- All developers must have Bun installed locally
- CI/CD pipelines use `oven/bun` Docker images or install Bun explicitly
- No `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` in the repository
- Faster installs and script execution compared to Node-based alternatives
- The `packageManager` field in root `package.json` is set to `bun`

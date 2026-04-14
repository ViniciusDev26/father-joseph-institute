# ADR-002: Standalone Binary Build

**Status:** Accepted  
**Date:** 2026-04-14

## Context

We needed a simple, self-contained deployment artifact for the API server. Requiring Bun or Node.js to be installed on the production server adds operational complexity and increases the attack surface. The goal was a single binary that can be copied to a minimal container image and executed directly.

## Decision

The build step compiles the application into a standalone binary using `bun build --compile`.

- The build script produces a self-contained executable at `dist/server`.
- The **Dockerfile** uses a multi-stage build:
  - **Build stage:** `oven/bun:1` — installs dependencies and compiles the binary.
  - **Runtime stage:** `debian:bookworm-slim` — copies only the binary into a minimal Debian image and runs it as a non-root user.
- No runtime dependencies (Bun, Node.js, or `node_modules`) are required in the final image.

## Consequences

- The resulting binary is approximately **59 MB**, which is acceptable for a server-side deployment artifact.
- Deployment is simplified: the container image contains only the OS base layer and the single binary.
- Running as a non-root user in the runtime stage follows container security best practices.
- Debugging production issues may be harder since source maps and the original TypeScript source are not present in the runtime image. If needed, a debug image variant can be introduced later.
- Any native Bun or Node add-ons would need to be statically linked or bundled at compile time.

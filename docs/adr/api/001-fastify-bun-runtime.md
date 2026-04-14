# ADR-001: Fastify 5 on Bun Runtime

**Status:** Accepted  
**Date:** 2026-04-14

## Context

We needed a fast, lightweight API server with first-class TypeScript support. The project requires a runtime that can execute TypeScript natively without a separate compilation step and offers fast startup times for both development and production. On the framework side, we needed schema-based request/response validation, a mature plugin ecosystem, and high throughput.

## Decision

We chose **Fastify 5** as the HTTP framework running on the **Bun** runtime.

- **Bun** provides native TypeScript execution, fast startup, and a built-in test runner, eliminating the need for `ts-node` or a separate build-and-run workflow during development.
- **Fastify 5** was selected over alternatives (Express, Hono, Elysia) for its performance characteristics, first-class JSON Schema validation, well-defined plugin system, and comprehensive lifecycle hooks.
- CORS is enabled via the official **@fastify/cors** plugin, keeping cross-origin configuration consistent and declarative.

## Consequences

- The team must be familiar with both Bun APIs and Fastify's plugin/hook model.
- Bun compatibility must be verified when adding new Fastify plugins, as some Node-specific plugins may not work out of the box.
- Schema-based validation is enforced at the framework level, reducing the need for manual input checks in route handlers.
- Fast cold-start and low overhead make this stack suitable for containerized and serverless-adjacent deployments.

# ADR-003: Static Content Endpoint

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The first version of the API does not have a database. However, the frontend needs a well-defined content endpoint to render the about page. We wanted to establish the response shape early so that the frontend can be built against a stable contract, even before persistence is in place.

## Decision

A **GET /content** endpoint returns hardcoded content data.

- Content is defined as a typed constant in `src/routes/content.ts` using the `SiteContent` interface.
- The response shape covers all about page sections: **hero**, **mission**, **story**, **values**, **impact**, and **cta**.
- The data is returned directly from memory with no I/O, making the endpoint effectively zero-latency.

## Consequences

- The frontend can develop against the real API contract immediately, without mocks or stubs.
- The `SiteContent` interface serves as the single source of truth for the content schema, shared between the route and any future persistence layer.
- Future work will introduce a database, seed the hardcoded data into it, and add CRUD endpoints. The response shape is already defined and **will not need to change** when that migration happens.
- Until a database is added, content cannot be updated at runtime — any changes require a code change and redeployment.

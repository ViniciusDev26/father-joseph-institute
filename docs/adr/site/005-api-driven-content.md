# ADR-005: API-Driven Content

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The institute plans to build an admin panel that allows staff to customize the site's text, images, and other content without developer intervention. To support this, the site cannot rely on hardcoded content baked into the codebase — it needs to fetch content dynamically so that admin changes are reflected without redeploying.

## Decision

All site content will be fetched from the **API** via a `GET /content` endpoint.

- Page components request their content from the API at render time (server-side).
- For now, the about page (and other pages as they are built) includes **static placeholder data** that mirrors the expected API response shape.
- These placeholders serve as fallbacks during development when the API is not running.

## Consequences

- The site is decoupled from its content: editorial changes made through the future admin panel will appear on the site without a code deploy.
- The site requires the API to be running to display real, up-to-date content.
- During local development, placeholder/fallback data allows frontend work to proceed independently of the API.
- The placeholder data structures act as a de facto contract for the API response shape, helping keep frontend and backend in sync.
- If the API is slow or unavailable in production, the site must handle errors gracefully (e.g., show cached content or a friendly error state).

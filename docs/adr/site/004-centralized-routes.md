# ADR-004: Centralized Route Definitions

**Status:** Accepted  
**Date:** 2026-04-14

## Context

Route paths were duplicated across multiple components — the header navigation, the footer links, and individual page components all had their own hardcoded strings for paths like `/about`, `/donate`, etc. This duplication made it easy to introduce inconsistencies and required updating multiple files whenever a route changed.

## Decision

All route paths are defined in a single file: **`src/lib/routes.ts`**.

- A `routes` object maps logical route names to their path strings.
- A `navLinks` array provides the ordered list of navigation links (label + path) used by the header and footer.
- All components import from this single module instead of hardcoding paths.

## Consequences

- Changing a route path only requires updating **one file**, eliminating the risk of mismatched paths across components.
- Navigation components (header, footer) consume the same `navLinks` array, guaranteeing they stay in sync.
- New pages must remember to register their route in `routes.ts`; this is a lightweight convention that is easy to follow.
- If the routing structure grows significantly (e.g., localized routes, dynamic segments), this module may need to evolve, but the single-source-of-truth principle will still hold.

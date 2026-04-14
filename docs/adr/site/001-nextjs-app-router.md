# ADR-001: Next.js 16 with App Router

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The Father Joseph Institute site is institutional and needs strong search engine indexing for discoverability. We needed a React framework with built-in server-side rendering (SSR) support to ensure good SEO out of the box, without requiring a separate SSR setup or static-site workarounds.

## Decision

We chose **Next.js 16 with the App Router** as the frontend framework. Styling is handled by **Tailwind CSS 4**, and the entire codebase uses **TypeScript** for type safety.

- **Next.js 16 App Router** provides server components by default, streaming, and nested layouts, giving us fine-grained control over what renders on the server vs. the client.
- **Tailwind CSS 4** offers utility-first styling with near-zero runtime cost and a simplified configuration model.
- **TypeScript** catches errors at build time and improves the developer experience with autocompletion and type-checked props.

## Consequences

- All pages are server-rendered by default, which benefits SEO and initial load performance.
- Interactive components must be explicitly marked with `"use client"`, keeping the client bundle small.
- The team must be familiar with the App Router conventions (file-based routing, `layout.tsx`, `page.tsx`, `loading.tsx`, etc.).
- Tailwind CSS 4 requires a PostCSS pipeline, but this is handled automatically by Next.js.
- TypeScript adds a compilation step, but the type safety tradeoff is worthwhile for long-term maintainability.

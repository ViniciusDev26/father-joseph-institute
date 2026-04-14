# ADR-003: Warm, Editorial Design System

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The Father Joseph Institute serves homeless people and showcases the work of artisan women. The visual identity needs to convey warmth, trust, and dignity rather than cold corporate aesthetics. We needed a design system that feels editorial and human while remaining accessible and performant.

## Decision

We defined a **warm, editorial design system** with the following pillars:

### Typography

Fonts are loaded via `next/font/google` for automatic self-hosting and zero layout shift:

- **Fraunces** — display serif used for headings and hero text. Its organic, slightly quirky letterforms add personality.
- **Albert Sans** — clean body sans-serif for paragraphs and UI elements. Highly legible at small sizes.

### Color Palette

An earthy, grounded palette that evokes warmth and natural materials:

| Token      | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Cream      | `#fbf7f1` | Page backgrounds               |
| Terracotta | `#b84a30` | Primary accent, CTAs           |
| Sage       | `#4a6741` | Secondary accent, success      |
| Bark       | `#2d2418` | Body text, dark backgrounds    |
| Gold       | `#c99a2e` | Highlights, decorative accents |

### Texture and Motion

- A **subtle grain texture overlay** is applied to backgrounds to add tactile warmth and break up flat color fields.
- **Scroll reveal animations** are implemented via an `IntersectionObserver`-based `FadeIn` component that gently animates elements into view as the user scrolls.

## Consequences

- The site has a distinctive, human feel that aligns with the institute's mission and differentiates it from generic templates.
- Using `next/font/google` means fonts are self-hosted automatically, improving performance and avoiding external network requests to Google Fonts.
- The earthy color palette must be checked for WCAG contrast compliance, especially light text on cream backgrounds.
- The grain texture overlay adds a small amount of rendering overhead; it should be applied sparingly and tested on lower-end devices.
- The `FadeIn` component must respect `prefers-reduced-motion` to ensure accessibility for users who are sensitive to animations.

# ADR-006: Mobile First no Site Público

**Status:** Accepted  
**Date:** 2026-04-23

## Context

O site público precisa funcionar bem em dispositivos móveis. Doadores, voluntários e visitantes acessam o instituto principalmente pelo smartphone. A ausência de responsividade impede engajamento e prejudica a missão da organização.

## Decision

Adotar **mobile-first** como estratégia de layout: o CSS base atende ao mobile e breakpoints progressivos (`sm:`, `md:`, `lg:`) adicionam o layout desktop.

### Princípios aplicados

| Elemento | Mobile | Desktop (`md+`) |
|----------|--------|-----------------|
| Navegação | Hamburger menu com overlay | Links horizontais + botões CTA |
| Grids | `grid-cols-1` | `md:grid-cols-2` / `md:grid-cols-3` / `lg:grid-cols-4` |
| Tipografia hero | `text-4xl` | `sm:text-5xl md:text-7xl` |
| Espaçamento seções | `py-16` | `md:py-28` |
| Botões CTA | `flex-col` empilhados | `sm:flex-row` lado a lado |

### Viewport

O `layout.tsx` exporta `viewport` explicitamente com `width: device-width, initialScale: 1` para garantir que o browser mobile não aplique zoom automático e use a largura real do dispositivo.

### Tailwind

Todos os breakpoints seguem a convenção mobile-first do Tailwind: classes sem prefixo valem para qualquer tamanho, prefixos (`sm:`, `md:`, `lg:`) são `min-width` progressivos.

## Consequences

- **Prós:** Experiência adequada para o público-alvo (doadores e voluntários em mobile); sem bibliotecas extras; compatível com a stack Next.js + Tailwind existente.
- **Contras:** Sem impactos negativos relevantes — a estrutura existente já seguia parcialmente o padrão.

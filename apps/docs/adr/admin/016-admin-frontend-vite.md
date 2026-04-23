# ADR-016: Arquitetura do Painel Administrativo

**Status:** Accepted  
**Date:** 2026-04-23

## Context
O projeto necessita de um painel administrativo para controle das entidades (artesãs, produtos, eventos, voluntários). Decidiu-se pela criação de uma aplicação separada (`apps/admin`).

## Decision
Utilizar **Vite + React (TypeScript)** como base para o Painel Administrativo, em substituição ao Next.js utilizado no site institucional.

### Justificativas:
1. **Simplicidade:** O painel administrativo é uma aplicação SPA (Single Page Application) interna. O Next.js traz overhead (SSR, App Router, etc.) desnecessário para uma aplicação puramente de gestão que reside atrás de uma camada de autenticação.
2. **Performance:** O Vite proporciona um ambiente de desenvolvimento muito mais rápido e builds mais leves para uma aplicação de nicho.
3. **Gerenciamento de Estado:** Utilizar **Zustand** para o estado global (incluindo autenticação) para evitar o "Provider Hell" da Context API e simplificar a persistência do token.
4. **Produtividade:** **shadcn/ui + Tailwind CSS** para padronização visual e **React Hook Form + Zod** para garantir validações robustas com código limpo.

## Implementação:
- **Autenticação:** O token Basic Auth será persistido via Zustand (usando middleware de persistência).
- **Consumo de API:** Seguindo o **ADR-002**, o consumo de API será realizado exclusivamente via **Axios**, garantindo padronização na interceptação de erros e configuração de headers de autenticação.

## Consequences
- **Prós:** Aplicação leve, rápida, fácil de manter e alinhada com as convenções de HTTP client do monorepo.
- **Contras:** Diferente da stack do site, exigindo que o desenvolvedor tenha familiaridade com o ecossistema React/Vite puro.

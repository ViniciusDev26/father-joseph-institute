# ADR-004: PostgreSQL as database

**Status:** Accepted  
**Date:** 2026-04-14

## Context

A API precisa de um banco de dados relacional para persistir conteúdo do site, cadastros de artesãs, produtos, eventos e pedidos da loja. O modelo de dados é relacional por natureza (artesãs têm produtos, eventos têm inscrições, etc.), descartando bancos NoSQL para o caso principal.

## Decision

Use **PostgreSQL** como banco de dados do projeto.

- **Versão:** PostgreSQL 17 (Alpine) no ambiente de desenvolvimento via Docker Compose.
- **Driver:** `postgres-js` via Drizzle ORM (ADR API-004).
- **Ambiente local:** Container gerenciado pelo Compose com volume persistente.

## Consequences

- PostgreSQL é o banco relacional open source mais maduro e com maior ecossistema de ferramentas, extensões e hosting.
- Suporte nativo a JSONB permite flexibilidade para dados semi-estruturados sem precisar de um banco NoSQL separado.
- Ampla disponibilidade de hosting gerenciado (Supabase, Neon, Railway, AWS RDS) facilita o deploy em produção.
- O time precisa conhecer SQL e as particularidades do PostgreSQL, mas isso é amplamente documentado.

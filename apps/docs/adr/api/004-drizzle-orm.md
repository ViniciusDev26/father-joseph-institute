# ADR-004: Drizzle as ORM

**Status:** Accepted  
**Date:** 2026-04-14

## Context

A API precisa de um ORM leve, type-safe e compatível com Bun e TypeScript para interagir com o PostgreSQL (ADR Global-004).

## Decision

Use **Drizzle ORM** como data access layer da API.

- **Driver:** `postgres-js` via `drizzle-orm/postgres-js`.
- **Connection:** Instância configurada em `src/database/connection.ts`, exportando `db`.
- **Schema:** Um arquivo por entidade em `src/database/schema/`, com barrel export em `index.ts`.
- **Migrations:** Gerenciadas pelo `drizzle-kit`, output em `src/database/migrations/`.
- **Config:** `drizzle.config.ts` na raiz do projeto da API, usando `env.ts` para credenciais.
- **Query style:** Relational query API para leituras, query builders para escrita.

### Estrutura

```
src/database/
├── connection.ts          # Client postgres-js + instância drizzle
├── schema/
│   ├── index.ts           # Barrel export de todas as entidades
│   └── <entidade>.ts      # Uma entidade por arquivo (pgTable)
└── migrations/            # SQL gerado pelo drizzle-kit
```

### Scripts

| Script | Comando |
|--------|---------|
| `bun run db:generate` | Gera migration SQL a partir das mudanças no schema |
| `bun run db:migrate` | Aplica migrations pendentes no banco |
| `bun run db:push` | Sincroniza schema direto no banco (dev) |
| `bun run db:studio` | Abre o Drizzle Studio para visualizar dados |

## Consequences

- Type safety completa do schema até o resultado da query — sem type casting manual.
- Drizzle é um dos ORMs mais leves, sem runtime pesado ou code generation.
- Migrations são SQL puro, fáceis de revisar e versionar.
- Cada entidade em arquivo separado mantém o schema organizado e facilita code review.
- Raw SQL disponível via `db.execute()` para queries complexas.

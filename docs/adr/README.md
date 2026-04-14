# Architecture Decision Records (ADRs)

Registro das decisões arquiteturais do projeto. Cada ADR documenta o contexto, a decisão tomada e suas consequências.

## Estrutura

```
docs/adr/
├── NNN-slug.md      # Decisões globais (afetam todo o monorepo)
├── api/
│   └── NNN-slug.md  # Decisões específicas da API
├── site/
│   └── NNN-slug.md  # Decisões específicas do site
└── admin/
    └── NNN-slug.md  # Decisões específicas do admin
```

- **Raiz (`docs/adr/`)** — decisões que afetam o monorepo como um todo
- **Subdiretórios (`api/`, `site/`, `admin/`)** — decisões específicas de cada projeto

## Formato

Cada ADR segue este template:

```markdown
# ADR-NNN: Título da decisão

**Status:** Accepted | Deprecated | Superseded by ADR-XXX  
**Date:** YYYY-MM-DD

## Context
Por que essa decisão precisou ser tomada.

## Decision
O que foi decidido.

## Consequences
O que resulta dessa decisão — trade-offs, impactos, dependências.
```

## Numeração

- Cada escopo (raiz, api, site, admin) tem numeração independente começando em `001`
- O slug deve ser em inglês, separado por hífens: `001-nome-da-decisao.md`

## Quando criar uma ADR

- Escolha de tecnologia, framework ou biblioteca
- Definição de padrão arquitetural ou convenção
- Decisão que impacta a estrutura do projeto ou fluxo de deploy
- Trade-off consciente que precisa ficar documentado para o futuro

## Índice

### Global

| ADR | Decisão |
|-----|---------|
| [001](001-bun-as-runtime-and-package-manager.md) | Bun como runtime e package manager |
| [002](002-axios-http-client.md) | Axios como HTTP client padrão |

### API

| ADR | Decisão |
|-----|---------|
| [001](api/001-fastify-bun-runtime.md) | Fastify 5 + Bun como runtime |
| [002](api/002-standalone-binary-build.md) | Build para binário standalone |
| [003](api/003-static-content-endpoint.md) | Endpoint de conteúdo estático (v1) |
| [004](api/004-drizzle-orm.md) | Drizzle como ORM |
| [005](api/005-api-docs-scalar.md) | Documentação da API com Scalar |
| [006](api/006-zod-type-provider.md) | Zod como type provider do Fastify |

### Site

| ADR | Decisão |
|-----|---------|
| [001](site/001-nextjs-app-router.md) | Next.js 16 com App Router |
| [002](site/002-biome-linter.md) | Biome como linter/formatter |
| [003](site/003-design-system.md) | Design system editorial |
| [004](site/004-centralized-routes.md) | Rotas centralizadas |
| [005](site/005-api-driven-content.md) | Conteúdo consumido da API |

### Admin

Nenhuma decisão registrada ainda.

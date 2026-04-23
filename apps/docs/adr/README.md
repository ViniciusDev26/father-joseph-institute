# Architecture Decision Records (ADRs)

Registro das decisões arquiteturais do projeto. Cada ADR documenta o contexto, a decisão tomada e suas consequências.

## Estrutura

```
apps/docs/adr/
├── NNN-slug.md      # Decisões globais (afetam todo o monorepo)
├── api/
│   └── NNN-slug.md  # Decisões específicas da API
├── site/
│   └── NNN-slug.md  # Decisões específicas do site
└── admin/
    └── NNN-slug.md  # Decisões específicas do admin
```

- **Raiz (`apps/docs/adr/`)** — decisões que afetam o monorepo como um todo
- **Subdiretórios (`api/`, `site/`, `admin/`)** — decisões específicas de cada projeto

## Índice

### Global

| ADR | Decisão |
|-----|---------|
| [001](001-bun-as-runtime-and-package-manager.md) | Bun como runtime e package manager |
| [002](002-axios-http-client.md) | Axios como HTTP client padrão |
| [003](003-docker-compose-dev-environment.md) | Docker Compose como ambiente de desenvolvimento |
| [004](004-postgresql-database.md) | PostgreSQL como banco de dados |
| [005](005-zod-env-validation.md) | Zod para validação de variáveis de ambiente |
| [006](006-turborepo.md) | Turborepo como orquestrador do monorepo |
| [007](007-typescript.md) | TypeScript 6 como linguagem padrão |

### API

| ADR | Decisão |
|-----|---------|
| [001](api/001-fastify-bun-runtime.md) | Fastify 5 + Bun como runtime |
| [002](api/002-standalone-binary-build.md) | Build para binário standalone |
| [003](api/003-static-content-endpoint.md) | Endpoint de conteúdo estático (v1) |
| [004](api/004-drizzle-orm.md) | Drizzle como ORM |
| [005](api/005-api-docs-scalar.md) | Documentação da API com Scalar |
| [006](api/006-zod-type-provider.md) | Zod como type provider do Fastify |
| [007](api/007-paranoid-soft-delete.md) | Colunas padrão e Soft Delete |
| [008](api/008-postgres-enums.md) | Enums do PostgreSQL |
| [009](api/009-mandatory-route-schema.md) | Schema obrigatório em todas as rotas |
| [010](api/010-route-handler-separation.md) | Separação entre rota e handler |
| [011](api/011-route-schema-constant.md) | Schema extraído em constante |
| [012](api/012-route-registration-order.md) | Ordem de registro por método HTTP |
| [013](api/013-production-seed-strategy.md) | Estratégia de seed de produção |

### Site

| ADR | Decisão |
|-----|---------|
| [001](site/001-nextjs-app-router.md) | Next.js 16 com App Router |
| [002](site/002-biome-linter.md) | Biome como linter/formatter |
| [003](site/003-design-system.md) | Design system editorial |
| [004](site/004-centralized-routes.md) | Rotas centralizadas |
| [005](site/005-api-driven-content.md) | Conteúdo consumido da API |

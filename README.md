# Instituto Padre José

Projeto Instituto Padre José — organização que ajuda moradores de rua, dá visibilidade ao trabalho de artesãs e comercializa os produtos produzidos por elas.

## Estrutura

```
.
├── src/                # Aplicação Next.js (site público + API + admin)
│   ├── app/
│   │   ├── api/        # Route handlers
│   │   └── admin/      # Painel administrativo (/admin/*)
│   ├── db/             # Drizzle schema + migrations
│   ├── lib/data/       # Camada de acesso compartilhada
│   └── schemas/        # Zod schemas que validam a API pública
├── apps/docs/          # Documentação (VitePress) e specs/ADRs
└── docker-compose.yml  # Postgres local + watch da app
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime / Package Manager | Bun |
| Framework | Next.js 16, Tailwind CSS 4, TypeScript |
| API | Next Route Handlers + Zod 4 |
| ORM | Drizzle |
| Storage | Cloudflare R2 |
| Docs | VitePress |
| Linter / Formatter | Biome |

## Pré-requisitos

- [Bun](https://bun.sh) >= 1.2
- Postgres acessível (via `docker-compose up postgres` ou Supabase)

## Setup

```bash
bun install
cp .env.example .env  # preencher as variáveis abaixo
bun run db:migrate
bun run db:seed
```

Variáveis obrigatórias:

- `DATABASE_URL` — connection string do Postgres (usar pooler do Supabase em produção)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` — credenciais do Cloudflare R2
- `ADMIN_BASIC_AUTH_TOKEN` — credenciais Basic Auth do admin no formato `user:senha`

## Desenvolvimento

```bash
bun run dev          # site + api + admin no mesmo processo (porta 3000)
```

## Build

```bash
bun run build
```

## Lint

```bash
bun run lint
bun run lint:fix
```

## Docker

```bash
docker compose up         # postgres + app com watch
docker build -t father-joseph .  # build de produção
```

## Documentação

- [Specs](apps/docs/specs/)
- [ADRs](apps/docs/adr/)
- [Site da documentação](apps/docs/)

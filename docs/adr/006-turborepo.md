# ADR-006: Turborepo as monorepo orchestrator

**Status:** Accepted  
**Date:** 2026-04-14

## Context

O monorepo contém múltiplos projetos (site, API, admin) que compartilham tooling mas têm pipelines de build independentes. É necessário um orquestrador que execute tasks (build, lint, dev) de forma eficiente, respeitando dependências entre projetos.

## Decision

Use **Turborepo** como orquestrador de tasks do monorepo.

- **Task caching:** Turborepo cacheia outputs de build e lint, evitando re-execução quando os inputs não mudaram.
- **Task graph:** Dependências entre tasks (`dependsOn: ["^build"]`) garantem ordem correta de execução.
- **Paralelização:** Tasks independentes rodam em paralelo automaticamente.
- **Scripts raiz:** `bun run build`, `bun run dev` e `bun run lint` delegam para o Turborepo.
- **Filter:** `bunx turbo run dev --filter=site` permite rodar tasks para um projeto específico.

## Consequences

- O cache local acelera significativamente builds e lints incrementais — se nada mudou, o resultado é instantâneo.
- Remote caching (Vercel) pode ser habilitado no futuro para compartilhar cache entre CI e desenvolvedores.
- O `turbo.json` é o ponto central de configuração de tasks — novos projetos herdam o pipeline automaticamente.
- Turborepo é leve e não impõe estrutura de código — funciona com Bun workspaces nativos sem configuração adicional.

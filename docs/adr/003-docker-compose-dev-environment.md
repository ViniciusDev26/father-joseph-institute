# ADR-003: Docker Compose as development environment

**Status:** Accepted  
**Date:** 2026-04-14

## Context

O monorepo possui múltiplos serviços (site, API, banco de dados) que precisam rodar simultaneamente durante o desenvolvimento. Configurar cada serviço manualmente gera fricção, especialmente para novos contribuidores que precisam instalar e configurar PostgreSQL localmente.

## Decision

Use **Docker Compose** como ambiente de desenvolvimento padrão, com o modo **watch** para hot reload.

- **Compose file:** `docker-compose.yml` na raiz do monorepo, orquestrando todos os serviços.
- **Dockerfile multi-stage:** Cada app tem um stage `dev` no topo do Dockerfile, usado pelo Compose. Os stages de produção permanecem intactos.
- **Watch mode:** `docker compose up --watch` sincroniza mudanças em `src/` para dentro dos containers. Next.js HMR e `bun --watch` detectam as alterações automaticamente.
- **Rebuild trigger:** Mudanças em `package.json` disparam rebuild da imagem para instalar novas dependências.
- **PostgreSQL:** Container `postgres:17-alpine` com volume persistente, credenciais fixas para dev.
- **Networking:** Os serviços se comunicam pelo DNS interno do Compose (e.g., `http://api:3001`, `postgres:5432`).

## Consequences

- Um único comando (`docker compose up --watch`) sobe todo o ambiente de desenvolvimento com hot reload.
- Desenvolvedores não precisam instalar PostgreSQL localmente.
- O stage `dev` nos Dockerfiles é independente dos stages de produção — mudanças em um não afetam o outro.
- O volume `pgdata` persiste dados do banco entre reinicializações do Compose.
- Credenciais de dev são fixas no Compose file (não são segredos — apenas para ambiente local).

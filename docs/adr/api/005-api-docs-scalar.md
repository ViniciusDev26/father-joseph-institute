# ADR-005: API documentation with Scalar

**Status:** Accepted  
**Date:** 2026-04-14

## Context

The API needs documentation acessível para desenvolvedores e futuros contribuidores. A documentação deve ser gerada automaticamente a partir das definições das rotas, evitando que fique desatualizada. Inicialmente consideramos o Redoc, mas o Scalar oferece melhor integração com Fastify e uma experiência mais moderna.

## Decision

Use **@fastify/swagger** para gerar o spec OpenAPI 3.1 e **@scalar/fastify-api-reference** para servir a documentação interativa.

- **Spec generation:** `@fastify/swagger` registrado no Fastify, gerando o spec a partir dos JSON Schemas das rotas.
- **Documentation UI:** Scalar servido em `/docs` com tema customizado.
- **Spec endpoint:** JSON spec disponível em `/docs/json` para consumo externo (code generation, testes, etc.).
- **Route schemas:** Cada rota define `schema.response` (e `schema.body`, `schema.params`, `schema.querystring` quando aplicável) para alimentar o spec automaticamente.

## Consequences

- A documentação é always in sync com o código — schemas das rotas são a single source of truth.
- Scalar oferece um playground interativo onde é possível testar as rotas diretamente no browser.
- Novos endpoints precisam definir schemas para aparecer corretamente na documentação.
- O spec OpenAPI gerado pode ser usado para gerar clients (TypeScript, etc.) no futuro.
- Scalar é mais leve e moderno que Swagger UI e Redoc, com melhor suporte a OpenAPI 3.1.

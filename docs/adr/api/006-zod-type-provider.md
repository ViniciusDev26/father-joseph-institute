# ADR-006: Zod as Fastify type provider

**Status:** Accepted  
**Date:** 2026-04-14

## Context

Cada rota do Fastify precisa de um JSON Schema para alimentar a documentação OpenAPI (ADR-005) e para validação de request/response. Escrever JSON Schema manualmente é verboso, propenso a erros e duplica as definições de tipo que já existem em TypeScript. O projeto já usa Zod para validação de variáveis de ambiente (env.ts) e irá usá-lo com Drizzle (ADR-004).

## Decision

Use **fastify-type-provider-zod** como type provider do Fastify.

- **Schema definition:** Rotas definem `schema.body`, `schema.response`, `schema.params` e `schema.querystring` usando Zod schemas.
- **JSON Schema generation:** O type provider converte Zod schemas para JSON Schema automaticamente, alimentando o `@fastify/swagger` (ADR-005).
- **Type inference:** Os tipos de request e response são inferidos diretamente dos Zod schemas — sem interfaces manuais duplicadas.
- **Shared schemas:** Schemas reutilizáveis ficam em `src/schemas/`, importados pelas rotas.

## Consequences

- Um único Zod schema serve para validação, tipagem TypeScript e documentação OpenAPI — single source of truth.
- Elimina a necessidade de escrever JSON Schema manualmente para cada rota.
- Os tipos em `src/types/` podem ser substituídos por inferência via `z.infer<>` dos schemas Zod.
- Toda rota que precisa aparecer na documentação deve definir seus schemas em Zod.
- Adiciona `fastify-type-provider-zod` como dependência da API.

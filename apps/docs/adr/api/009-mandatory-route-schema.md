# ADR-009: Schema obrigatório em todas as rotas

**Status:** Accepted  
**Date:** 2026-04-15

## Context

A API utiliza Scalar ([ADR-005](005-api-docs-scalar.md)) para documentação interativa e `fastify-type-provider-zod` ([ADR-006](006-zod-type-provider.md)) para gerar o spec OpenAPI a partir de Zod schemas. Rotas sem schema não aparecem na documentação, ficam sem validação automática e sem type safety — criando inconsistência entre o que existe na API e o que é visível para consumidores.

## Decision

**Toda rota registrada na API deve definir o objeto `schema`** com, no mínimo:

1. **`description`** — descrição do que o endpoint faz.
2. **`tags`** — array com pelo menos uma tag para agrupamento no Scalar.
3. **`response`** — Zod schema para cada status code retornado, incluindo respostas de erro.

Além disso, quando aplicável:

- **`body`** — Zod schema para o corpo da requisição (POST, PUT, PATCH).
- **`params`** — Zod schema para path parameters.
- **`querystring`** — Zod schema para query parameters.

### Respostas de erro

O objeto `response` deve documentar tanto os status de sucesso quanto os de erro previstos pela rota. Um schema de erro padrão (`errorResponseSchema`) deve ser definido em `src/schemas/shared.ts` e reutilizado em todas as rotas:

```typescript
// src/schemas/shared.ts
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
});
```

### Exemplo

```typescript
app.withTypeProvider<ZodTypeProvider>().post(
  '/events',
  {
    schema: {
      description: 'Create a new event with one or more photos',
      tags: ['Events'],
      body: createEventBodySchema,
      response: {
        201: createEventResponseSchema,
        400: errorResponseSchema,
      },
    },
  },
  async (request, reply) => {
    // handler
  },
);
```

## Consequences

- Todas as rotas aparecem na documentação Scalar automaticamente.
- Consumidores da API sempre têm acesso a contratos atualizados via `/docs`.
- Validação de request/response é garantida em toda rota, prevenindo dados inesperados.
- Rotas sem schema devem ser tratadas como erro de code review.

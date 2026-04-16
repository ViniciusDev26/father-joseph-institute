# ADR-011: Schema da rota extraído em constante

**Status:** Accepted  
**Date:** 2026-04-15

## Context

Quando o objeto `schema` (com `description`, `tags`, `body`, `response`) é definido inline na chamada de registro da rota, a configuração compete visualmente com o path e o handler. Em rotas com muitos status codes documentados (sucesso + erros), o objeto inline cresce e prejudica a legibilidade.

## Decision

O objeto `schema` de cada rota deve ser extraído em uma **constante nomeada** no início da closure function que define o grupo de rotas.

### Estrutura

```typescript
export async function eventRoutes(app: FastifyInstance) {
  const createEventSchema = {
    description: 'Create a new event with one or more photos',
    tags: ['Events'],
    body: createEventBodySchema,
    response: {
      201: createEventResponseSchema,
      400: errorResponseSchema,
    },
  };

  app.withTypeProvider<ZodTypeProvider>().post('/events', { schema: createEventSchema }, createEvent);
}
```

### Regras

1. A constante deve ser nomeada seguindo o padrão `{handlerName}Schema` (ex: `createEventSchema`, `listEventsSchema`).
2. A constante deve ser declarada dentro da closure function, antes do registro das rotas.
3. A chamada de registro referencia a constante via `{ schema: createEventSchema }`.

## Consequences

- O registro da rota fica em uma única linha legível: path, schema e handler.
- O schema é facilmente localizável no topo da closure, junto com os outros schemas do grupo.
- Combinado com [ADR-010](010-route-handler-separation.md), cada arquivo de rota segue uma estrutura clara: **constantes de schema → registro de rotas → handlers**.

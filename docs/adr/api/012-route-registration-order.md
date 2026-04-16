# ADR-012: Ordem de registro das rotas por método HTTP

**Status:** Accepted  
**Date:** 2026-04-15

## Context

À medida que um arquivo de rotas cresce com múltiplos endpoints, a falta de uma convenção sobre a ordem de registro dificulta a localização de rotas e torna o code review inconsistente — cada desenvolvedor escolhe uma ordem diferente.

## Decision

As rotas de um mesmo grupo devem ser registradas na seguinte ordem de método HTTP:

1. **GET**
2. **POST**
3. **PATCH**
4. **PUT**
5. **DELETE**

### Exemplo

```typescript
export async function eventRoutes(app: FastifyInstance) {
  // schemas ...

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events', { schema: listEventsSchema }, listEvents)
    .post('/events', { schema: createEventSchema }, createEvent)
    .patch('/events/:id', { schema: updateEventSchema }, updateEvent)
    .delete('/events/:id', { schema: deleteEventSchema }, deleteEvent);
}
```

### Regras

1. A ordem se aplica tanto ao registro da rota (chamada encadeada) quanto à declaração dos handlers e das constantes de schema no mesmo arquivo.
2. Quando há múltiplas rotas com o mesmo método (ex: `GET /events` e `GET /events/:id`), a rota de coleção vem antes da rota de recurso individual.

## Consequences

- Localizar um endpoint específico é previsível — basta procurar na posição esperada pelo método.
- Code reviews ficam mais fáceis, pois a estrutura do arquivo é consistente entre todos os grupos de rotas.
- Combinado com [ADR-010](010-route-handler-separation.md) e [ADR-011](011-route-schema-constant.md), o arquivo segue uma ordem clara: **schemas → registro de rotas → handlers**, todos na mesma sequência de métodos.

# ADR-010: Separação entre definição de rota e handler

**Status:** Accepted  
**Date:** 2026-04-15

## Context

Quando o handler é definido inline na chamada de registro da rota, o arquivo fica difícil de ler — a lógica de negócio se mistura com a configuração da rota (path, método, schema). Isso dificulta testes unitários do handler e torna o code review mais lento à medida que a complexidade cresce.

## Decision

O **handler** deve ser definido como uma função nomeada separada, **nunca inline** na chamada de registro da rota.

### Estrutura

```typescript
export async function eventRoutes(app: FastifyInstance) {
  // schema e registro da rota
  app.withTypeProvider<ZodTypeProvider>().post('/events', { schema }, createEvent);
}

// handler separado
async function createEvent(
  request: FastifyRequest<{ Body: CreateEventBody }>,
  reply: FastifyReply,
) {
  // lógica de negócio
}
```

### Regras

1. Handlers são funções nomeadas declaradas no mesmo arquivo da rota.
2. O nome do handler deve refletir a ação (ex: `createEvent`, `listEvents`, `deleteEvent`).
3. A chamada de registro da rota passa o handler por referência, sem arrow function wrapper.

## Consequences

- A definição da rota fica concisa: path, schema e handler em uma única linha.
- O handler pode ser lido e compreendido isoladamente.
- Facilita testes unitários do handler no futuro.
- Cada arquivo de rota segue uma estrutura previsível: schemas no topo, registro no meio, handlers embaixo.

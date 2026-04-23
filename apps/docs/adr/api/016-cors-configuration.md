# ADR-016: Configuração de CORS

**Status:** Accepted  
**Date:** 2026-04-23

## Context

O painel administrativo (`apps/admin`) consome a API diretamente do navegador via Axios com header `Authorization: Basic <token>`. O header `Authorization` é considerado "non-simple" pelo CORS e dispara uma requisição de preflight (`OPTIONS`) antes de cada chamada autenticada. A configuração anterior (`origin: true`) não declarava `allowedHeaders` explicitamente, o que fazia o navegador rejeitar as requisições do painel.

## Decision

Configurar o `@fastify/cors` com:

```typescript
await app.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
```

### Justificativas:

1. **`origin: '*'`** — A API serve dados públicos (catálogo, eventos, artesãs) e o painel admin, ambos de origens distintas. Não há dados sensíveis expostos sem autenticação, portanto o wildcard é seguro e elimina a necessidade de manutenção de lista de origens.
2. **`allowedHeaders`** — Declarar `Authorization` explicitamente é obrigatório para que o preflight CORS responda corretamente e o navegador permita o envio do header nas requisições subsequentes.
3. **Sem `credentials: true`** — O Basic Auth é enviado como header explícito pelo JavaScript, não como cookie/session. Não há conflito entre `origin: '*'` e o mecanismo de autenticação utilizado.

## Consequences

- **Prós:** Qualquer cliente (admin, site, futuras integrações) pode consumir a API sem configuração adicional de CORS.
- **Contras:** Em produção, substituir `'*'` por origens específicas é recomendado para evitar uso não autorizado da API por terceiros.

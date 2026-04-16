# ADR-007: TypeScript 6 como linguagem padrão

**Status:** Accepted  
**Date:** 2026-04-15

## Context

O projeto utiliza TypeScript em todas as aplicações (API e Site). A versão 6 do TypeScript introduz melhorias significativas em inferência de tipos, performance do compilador e suporte a novos padrões do ECMAScript. Definir a versão mínima garante consistência entre todas as apps do monorepo.

## Decision

Usar **TypeScript >= 6** como linguagem padrão em todo o monorepo.

### Regras

1. Todas as apps (`apps/api`, `apps/site`) devem usar TypeScript 6 como dependência.
2. Código deve ser escrito em TypeScript — arquivos `.js` não são permitidos no source code.
3. Strict mode habilitado (`"strict": true` no `tsconfig.json`).
4. Inferência de tipos deve ser preferida sobre anotações explícitas quando possível.
5. Tipos devem ser inferidos a partir de schemas Zod via `z.infer<>`, nunca escritos manualmente (ver [ADR-006 API](api/006-zod-type-provider.md)).

## Consequences

- Todas as apps compartilham a mesma versão do TypeScript, evitando incompatibilidades.
- Strict mode previne categorias inteiras de bugs em tempo de compilação.
- Atualizações do TypeScript devem ser feitas no monorepo inteiro, nunca em apps isoladas.

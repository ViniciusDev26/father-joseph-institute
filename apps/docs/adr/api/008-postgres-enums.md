# ADR-008: PostgreSQL enums over generic string columns

**Status:** Accepted  
**Date:** 2026-04-15

## Context

Campos que representam um conjunto finito e conhecido de valores (ex: status, tipo, categoria) podem ser modelados como `varchar`/`text` ou como `enum` nativo do PostgreSQL. Usar strings genéricas delega a validação inteiramente para a aplicação, permitindo que dados inválidos sejam inseridos diretamente no banco e dificultando a compreensão do domínio ao olhar o schema.

## Decision

Sempre que um campo possuir um conjunto finito e conhecido de valores, utilizar **enum nativo do PostgreSQL** em vez de `varchar` ou `text`.

### Implementação com Drizzle

```typescript
import { pgEnum, pgTable, serial } from 'drizzle-orm/pg-core';

export const mimeTypeEnum = pgEnum('mime_type', ['image/png', 'image/jpeg']);

export const eventPhotos = pgTable('event_photo', {
  id: serial('id').primaryKey(),
  mimeType: mimeTypeEnum('mime_type').notNull(),
  // ...
});
```

### Quando usar

- Status (`active`, `inactive`, `pending`)
- Tipos/categorias com valores pré-definidos
- Mime types com conjunto restrito (`image/png`, `image/jpeg`)

### Quando **não** usar

- Valores dinâmicos que podem ser criados pelo usuário (ex: tags)
- Conjuntos que mudam com frequência — alterar um enum requer migration

## Consequences

- O banco garante integridade dos valores independentemente da camada de aplicação.
- O schema documenta explicitamente os valores permitidos.
- Adicionar ou remover valores do enum exige uma migration (`ALTER TYPE ... ADD VALUE` / recriação do tipo).
- Drizzle gera o `CREATE TYPE` automaticamente a partir do `pgEnum`.

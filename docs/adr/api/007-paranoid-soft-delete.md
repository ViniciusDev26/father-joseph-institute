# ADR-007: Standard timestamp columns and paranoid pattern (soft delete)

**Status:** Accepted  
**Date:** 2026-04-14

## Context

Excluir registros permanentemente do banco de dados é irreversível e pode causar problemas de integridade referencial, perda de histórico para auditoria e dificuldade de recuperação em caso de exclusão acidental. Em uma aplicação que gerencia dados de artesãs, produtos e eventos de uma instituição social, a preservação de dados é especialmente importante.

Além disso, rastrear quando um registro foi criado e atualizado é essencial para auditoria, debugging e ordenação temporal.

## Decision

### 1. Colunas de timestamp padrão

**Toda tabela** do banco de dados deve incluir as seguintes colunas:

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `created_at` | `timestamp with time zone` | `NOT NULL` | `now()` | Momento de criação do registro |
| `updated_at` | `timestamp with time zone` | `NOT NULL` | `now()` | Momento da última atualização |
| `deleted_at` | `timestamp with time zone` | `NULL` | `null` | Momento da exclusão lógica |

### 2. Paranoid pattern (soft delete)

1. **Exclusão** nunca executa `DELETE` — em vez disso, faz `UPDATE` setando `deleted_at = now()`.
2. **Queries de leitura** devem sempre filtrar `WHERE deleted_at IS NULL`, a não ser que o contexto exija explicitamente listar registros excluídos (ex: tela de lixeira/auditoria).
3. **Restauração** é feita setando `deleted_at = null`.
4. **Exclusão definitiva** (hard delete) só deve ocorrer em processos explícitos de expurgo ou por exigência legal (ex: LGPD).

### Implementação com Drizzle

```typescript
// Colunas padrão — presentes em toda entidade
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  // ... colunas específicas da entidade
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
```

```typescript
// Soft delete
await db.update(events)
  .set({ deletedAt: new Date() })
  .where(eq(events.id, id));

// Query padrão (exclui deletados)
await db.query.events.findMany({
  where: isNull(events.deletedAt),
});

// Restaurar
await db.update(events)
  .set({ deletedAt: null })
  .where(eq(events.id, id));
```

## Consequences

- Toda tabela tem rastreabilidade temporal completa (criação, atualização, exclusão).
- Registros nunca são perdidos acidentalmente — sempre é possível auditar ou restaurar.
- Toda query de leitura precisa incluir o filtro `deleted_at IS NULL`, exigindo disciplina do time.
- O banco acumula registros ao longo do tempo, mas isso é gerenciável com índices parciais (`WHERE deleted_at IS NULL`) e processos de expurgo periódico.
- Foreign keys com `ON DELETE CASCADE` não são acionadas pelo soft delete, preservando a integridade dos registros relacionados.
- Compatível com requisitos da LGPD: o hard delete fica reservado para quando o usuário solicita exclusão definitiva dos seus dados.

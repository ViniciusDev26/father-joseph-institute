# ADR-013: Estratégia de seed de dados de produção

**Status:** Accepted  
**Date:** 2026-04-21

## Context

Algumas entidades precisam existir no banco desde o primeiro deploy — em especial a `institution`, que é um singleton com dados reais da organização. Não há pipeline de CI/CD automatizado, portanto soluções que dependem de etapas extras de deploy não são viáveis de forma consistente.

As alternativas consideradas foram:

1. **Seed embutido em migration** — `INSERT` dentro da migration SQL, roda junto com `db:migrate`.
2. **Script de seed idempotente** — script separado executado manualmente via `bun run db:seed`.
3. **Seed automático no startup** — a aplicação verifica e insere ao iniciar.

## Decision

Usar um **script de seed idempotente** em `src/database/seed.ts`, executado via `bun run db:seed`.

- O script usa `INSERT ... ON CONFLICT DO NOTHING` para garantir idempotência — pode ser executado múltiplas vezes sem efeito colateral.
- O conflito é resolvido pela coluna `slug` (única por entidade).
- Os dados de seed ficam em um array `seeds` no próprio arquivo, próximos ao código que os insere.
- O script encerra o processo com `process.exit(0)` após concluir, compatível com execução avulsa pelo Bun.

### Quando executar

Rodar `bun run db:seed` manualmente logo após `bun run db:migrate` em qualquer ambiente (produção, staging, local novo).

### Estrutura

```
src/database/
├── seed.ts          # Runner principal — importa e executa todos os seeders em ordem
└── seeds/
    └── <entidade>.ts  # Um arquivo por entidade, exportando uma função async seedX()
```

### Adicionando novos seeds

Criar `src/database/seeds/<entidade>.ts` exportando uma função `async seedX()`, depois registrá-la no array `seeders` em `seed.ts`. A ordem do array determina a ordem de execução.

## Consequences

- Seed pode ser re-executado sem risco de duplicação.
- Sem acoplamento entre dados de produção e histórico de migrations — migrations continuam descrevendo apenas schema.
- Requer disciplina: ao criar um novo ambiente, é necessário lembrar de rodar `db:seed` após `db:migrate`.
- Não há rollback automático do seed — se um dado precisar ser alterado, deve-se atualizar diretamente o banco ou criar uma migration de dados.

# ADR-018: Padronização de Formulários com React Hook Form e Zod

**Status:** Accepted  
**Date:** 2026-04-23

## Context
O painel administrativo será intensivo em formulários (criação/edição de entidades). É necessário uma solução performática que suporte validação complexa e não re-renderize o componente pai a cada tecla digitada.

## Decision
Utilizar **React Hook Form** em conjunto com **Zod** para validação de esquemas (schema-based validation).

### Justificativas:
1. **Performance:** O React Hook Form utiliza refs para gerenciar inputs, evitando re-renderizações desnecessárias em comparação com o gerenciamento via `useState`.
2. **Consistência:** O projeto já utiliza Zod na API (conforme [ADR-006](../../api/006-zod-type-provider.md)). Compartilhar os mesmos esquemas de validação entre Front e Back garante que as regras de negócio sejam idênticas.
3. **DX (Developer Experience):** A integração com TypeScript é fluida e reduz o tempo de desenvolvimento de formulários complexos.

## Consequences
- **Prós:** Alta performance, integração perfeita com o Zod, redução de código *boilerplate*.
- **Contras:** Curva de aprendizado inicial para quem não está familiarizado com a biblioteca.

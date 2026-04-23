# ADR-005: Zod for environment variable validation

**Status:** Accepted  
**Date:** 2026-04-14

## Context

Variáveis de ambiente são a principal fonte de configuração em runtime (portas, URLs, credenciais). Acessar `process.env` diretamente é inseguro: valores podem estar ausentes, com tipo errado, ou sem formato esperado — e os erros só aparecem em runtime, muitas vezes longe do ponto de uso.

## Decision

Use **Zod** para validar todas as variáveis de ambiente em cada projeto do monorepo.

- **Arquivo:** Cada projeto tem um `env.ts` (ou `src/env.ts`) que define o schema e exporta um objeto `env` validado.
- **Uso:** Importar `env` ao invés de acessar `process.env` diretamente — em nenhum outro lugar do código deve existir `process.env`.
- **Defaults:** Valores padrão definidos no schema para ambiente de desenvolvimento (e.g., `PORT: z.coerce.number().default(3001)`).
- **Fail fast:** A aplicação falha imediatamente no boot se uma variável obrigatória estiver ausente ou inválida.

## Consequences

- Zod é a biblioteca de validação mais type-safe disponível — o tipo do objeto `env` é inferido automaticamente do schema, sem interfaces manuais.
- Erros de configuração são detectados no momento do boot, não em runtime durante uma request.
- Um único ponto de verdade para todas as variáveis de ambiente de cada projeto.
- Novos projetos devem seguir o mesmo padrão: criar `env.ts`, definir schema com Zod, exportar `env`.
- Zod já é dependência de todos os projetos (API: type provider, validação; Site: env), então não adiciona peso extra.

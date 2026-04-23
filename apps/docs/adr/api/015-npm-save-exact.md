# ADR-015: Uso de Versões Exatas em Dependências (Bun Config)

**Status:** Accepted  
**Date:** 2026-04-23

## Context
O projeto utiliza o **Bun** como gerenciador de pacotes. Por padrão, muitos gerenciadores de pacotes preferem prefixos de intervalo (`^` ou `~`) em dependências para facilitar atualizações. No entanto, buscamos determinismo total em builds e ambientes de deploy para evitar regressões causadas por mudanças inesperadas em versões menores de dependências.

## Decision
Configurar o Bun para utilizar o comportamento `save-exact=true`. Isso garantirá que, ao adicionar uma nova dependência, a versão instalada seja fixada exatamente (sem prefixos) no `package.json`.

### Implementação:
1. Utilizar o arquivo de configuração nativo do Bun: `bunfig.toml` na raiz do monorepo.
2. Adicionar a diretiva `save-exact = true` na seção `[install]`.

## Consequences
- **Prós:** 
  - Builds determinísticos: A versão instalada no desenvolvimento será exatamente a mesma em produção.
  - Previsibilidade: Evita que atualizações automáticas de versões menores introduzam bugs silenciosos.
- **Contras:** 
  - Exige manutenção proativa: As atualizações de dependências precisarão ser feitas manualmente e de forma consciente pelo time.

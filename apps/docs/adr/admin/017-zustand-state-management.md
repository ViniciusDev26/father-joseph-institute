# ADR-017: Gerenciamento de Estado Global com Zustand

**Status:** Accepted  
**Date:** 2026-04-23

## Context
O painel administrativo exige o armazenamento do token de autenticação e preferências globais. A Context API padrão do React pode levar a um excesso de "Providers" (Provider Hell) e renderizações desnecessárias em aplicações de grande porte.

## Decision
Utilizar **Zustand** como biblioteca principal de gerenciamento de estado global.

### Justificativas:
1. **Simplicidade:** API minimalista e sem a necessidade de envolver toda a árvore de componentes em um Context Provider.
2. **Performance:** O Zustand permite selecionar fatias específicas do estado, evitando re-renderizações desnecessárias.
3. **Persistência:** Suporte nativo e simples ao middleware de persistência (`persist`), ideal para manter o `authToken` entre sessões do navegador.

## Consequences
- **Prós:** Código mais limpo, fácil de testar, sem wrapper hell e com persistência de estado simplificada.
- **Contras:** Adiciona uma dependência externa ao projeto.

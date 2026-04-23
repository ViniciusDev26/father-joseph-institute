# ADR-002: Axios as standard HTTP client

**Status:** Accepted  
**Date:** 2026-04-14

## Context

Os projetos do monorepo precisam fazer requisições HTTP para serviços internos (site → API) e futuramente para serviços externos (pagamentos, WhatsApp, etc.). É necessário padronizar a biblioteca HTTP para manter consistência, facilitar interceptors compartilhados e evitar fragmentação entre fetch nativo, got, node-fetch, etc.

## Decision

Use **Axios** como biblioteca HTTP padrão em todos os projetos do monorepo.

- **Instalação:** Cada projeto que faz requisições HTTP adiciona `axios` como dependência direta.
- **Instâncias:** Criar instâncias configuradas (`axios.create()`) por serviço/domínio ao invés de usar a instância global.
- **Interceptors:** Usar interceptors para concerns transversais (logging, retry, error formatting).

## Consequences

- Uma única API de HTTP client em todo o monorepo — reduz carga cognitiva entre projetos.
- Interceptors permitem tratamento centralizado de erros, headers de autenticação e logging.
- Axios adiciona uma dependência ao bundle, mas o trade-off vale pela DX e funcionalidades built-in (timeout, cancelamento, transformação de request/response).
- O site continuará usando `fetch` nativo do Next.js para chamadas que dependem de ISR/cache (`next: { revalidate }`) — Axios é o padrão para chamadas que não precisam de cache do Next.js.

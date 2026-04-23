# ADR-014: Estratégia de Autenticação Basic (Single Token)

**Status:** Accepted  
**Date:** 2026-04-23

## Context
O projeto necessita de uma camada de proteção para endpoints administrativos (cadastro de artesãs, produtos, eventos, etc.). Dado que o projeto é simples e o acesso será restrito a poucas pessoas (Irmã Gisele e equipe técnica), uma solução robusta de JWT ou OAuth2 agregaria complexidade desnecessária neste momento.

## Decision
Utilizar **HTTP Basic Authentication** com um token único configurado via variáveis de ambiente.

### Detalhes Técnicos:
1. **Token Único:** A API validará as credenciais contra a variável de ambiente `ADMIN_BASIC_AUTH_TOKEN` (formato `user:password`).
2. **Header:** Os clientes devem enviar o header `Authorization: Basic <base64(user:password)>`.
3. **Escopo:** Inicialmente, todos os endpoints de escrita (POST, PUT, DELETE) e listagens internas do painel administrativo exigirão este header. Endpoints públicos do site (GET produtos/eventos) permanecem abertos.
4. **Middleware:** Será implementado um `preHandler` no Fastify para validar o token em rotas protegidas.

## Consequences
- **Prós:** Implementação extremamente simples e rápida; sem necessidade de tabelas de usuários ou gerenciamento de sessões no banco de dados.
- **Contras:** Menor segurança em comparação a sistemas multi-usuário; se o token for comprometido, deve ser alterado via ENV e o serviço reiniciado; não há rastreabilidade de "quem" fez a alteração (log genérico de admin).

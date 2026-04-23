# Backend Feature: ValidateAuth

> Implementação da lógica de validação do token único de administração.

**Status:** Specified  
**Date:** 2026-04-23

## User story
Como administrador do sistema, desejo que a API valide minhas credenciais Basic para que eu possa acessar áreas restritas do painel.

## Dependencies
- **API specs:** [POST /auth/validate](../../api/auth.md)

## Acceptance criteria
- [ ] O sistema deve extrair o token do header `Authorization`.
- [ ] O sistema deve comparar o token recebido com a variável `ADMIN_BASIC_AUTH_TOKEN`.
- [ ] Se o token for válido, retornar status 200.
- [ ] Se o token for inválido ou ausente, retornar status 401.

## Implementation Notes
- Utilizar a biblioteca nativa do Node/Bun para decodificar Base64 ou utilitários do Fastify se disponíveis.
- A variável de ambiente deve ser carregada e validada no `env.ts` (conforme [ADR-005](../../adr/005-zod-env-validation.md)).

# ADR-020: Estratégia de Build e Deploy do Admin

**Status:** Accepted  
**Date:** 2026-04-23

## Context

O painel administrativo (`apps/admin`) é uma SPA Vite + React. Precisamos de uma estratégia de containerização consistente com os demais serviços do monorepo, que suporte tanto desenvolvimento com hot reload via `docker compose watch` quanto build de produção otimizado.

## Decision

Utilizar um **Dockerfile multi-stage** com três estágios e **nginx** para servir o build de produção.

### Estágios:

| Stage     | Base          | Finalidade                                              |
|-----------|---------------|---------------------------------------------------------|
| `dev`     | `oven/bun:1`  | Servidor Vite com hot reload via `docker compose watch` |
| `build`   | `oven/bun:1`  | Compilação dos assets estáticos                         |
| `runtime` | `nginx:alpine`| Serving dos arquivos estáticos em produção              |

### Configuração do Vite para Docker (`vite.config.ts`):

```typescript
server: {
  host: true,       // bind em 0.0.0.0 para acessar fora do container
  port: 5174,
  watch: {
    usePolling: true, // obrigatório para docker compose watch funcionar
  },
},
```

**Por que `usePolling: true`?** O `docker compose watch` sincroniza arquivos via bind mount. O sistema de arquivos do container não recebe eventos de inotify do host, então o Vite precisa de polling para detectar mudanças.

### nginx (`nginx.conf`):

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

O `try_files` é obrigatório para SPAs com client-side routing — sem ele, qualquer refresh em rotas como `/artisans` retorna 404.

### docker-compose (`develop.watch`):

```yaml
develop:
  watch:
    - action: sync
      path: ./apps/admin/src
      target: /app/src
    - action: rebuild
      path: ./apps/admin/package.json
```

- `sync` — copia arquivos alterados em `src/` para o container sem rebuild da imagem
- `rebuild` — reconstrói a imagem quando dependências mudam

### `.dockerignore`:

Obrigatório excluir `node_modules` do contexto de build para evitar conflito entre os módulos do host e os instalados dentro do container pelo `RUN bun install`.

## Consequences

- **Prós:** Paridade com os demais serviços do monorepo; hot reload funcional em dev; imagem de produção leve (~50MB com nginx alpine).
- **Contras:** O polling de arquivos tem overhead de CPU comparado a inotify; aceitável em desenvolvimento.

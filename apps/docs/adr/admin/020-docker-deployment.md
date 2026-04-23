# ADR-020: Estratégia de Build e Deploy do Admin

**Status:** Accepted  
**Date:** 2026-04-23

## Context

O painel administrativo (`apps/admin`) é uma SPA Vite + React. Precisamos de uma estratégia de containerização consistente com os demais serviços do monorepo, que suporte tanto desenvolvimento com hot reload quanto build de produção otimizado.

## Decision

Utilizar um **Dockerfile multi-stage** com três estágios e **nginx** para servir o build de produção.

### Estágios:

| Stage     | Base          | Finalidade                                    |
|-----------|---------------|-----------------------------------------------|
| `dev`     | `oven/bun:1`  | Servidor Vite com hot reload via bind mount   |
| `build`   | `oven/bun:1`  | Compilação dos assets estáticos               |
| `runtime` | `nginx:alpine`| Serving dos arquivos estáticos em produção    |

### Estratégia de hot reload em desenvolvimento:

O `src/` é montado via **bind mount** no container, em vez de sincronizado pelo `docker compose watch`:

```yaml
volumes:
  - ./apps/admin/src:/app/src
develop:
  watch:
    - action: rebuild
      path: ./apps/admin/package.json
```

**Por quê bind mount e não `action: sync`?** O `action: sync` copia arquivos para o filesystem interno do container, que não propaga eventos de inotify — o Vite não detecta as mudanças sem polling. Com bind mount, o container enxerga o filesystem do host diretamente, recebe inotify normalmente e o HMR funciona sem overhead de CPU.

O `develop.watch` fica responsável apenas pelo `rebuild` quando `package.json` muda (nova dependência) — que exige rebuild da imagem de qualquer forma.

### Configuração do Vite para Docker (`vite.config.ts`):

```typescript
server: {
  host: true,   // bind em 0.0.0.0 para ser acessível fora do container
  port: 5174,
},
```

### nginx (`nginx.conf`):

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

O `try_files` é obrigatório para SPAs com client-side routing — sem ele, qualquer refresh em rotas como `/artisans` retorna 404.

### `.dockerignore`:

Obrigatório excluir `node_modules` do contexto de build para evitar conflito entre os módulos do host e os instalados dentro do container pelo `RUN bun install`.

## Consequences

- **Prós:** Hot reload via inotify nativo sem polling; paridade com demais serviços; imagem de produção leve (~50MB com nginx alpine).
- **Contras:** O bind mount expõe o filesystem do host ao container; sem impacto prático em desenvolvimento local.

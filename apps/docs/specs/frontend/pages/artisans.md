# Page: Artesãs

> Lista todas as artesãs cadastradas no instituto, com foto, nome, descrição e informações de contato.

## Route

`/artisans`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Lista de artesãs | `GET /artisans` | 60s ISR | Nome, foto, descrição, telefone, e-mail |

## Sections

1. **Hero** — Título da seção com tag itálica em terracotta, título grande e subtítulo descritivo. Fundo gradiente cream-dark → cream com formas decorativas.
2. **Grid de artesãs** — Cards em grid responsivo (1 coluna → 2 → 3). Cada card exibe foto quadrada (object-cover, hover scale), nome, descrição (limitada a 3 linhas), links de WhatsApp e e-mail quando disponíveis.

## States

- **Empty:** Exibe mensagem centralizada de "em breve" quando não há artesãs cadastradas.
- **Error:** A função `fetchArtisans` retorna array vazio em caso de erro; mesma exibição do estado vazio.

## Notes

- Revalidação ISR a cada 60 segundos.
- Imagens via `next/image` com `fill` e `object-cover`. Domínios do R2 configurados em `next.config.ts`.
- Links de WhatsApp usam formato `https://wa.me/55{phone}` (telefone sem o prefixo).
- Links de e-mail usam formato `mailto:{email}`.
- Textos estáticos (hero, mensagens de estado) vêm de `content.json`.

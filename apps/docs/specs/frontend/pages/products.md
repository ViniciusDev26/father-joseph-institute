# Page: Produtos

> Vitrine dos produtos artesanais do instituto. Exibe catálogo completo com foto, nome, preço e artesã responsável.

## Route

`/products`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Lista de produtos | `GET /products` | 60s ISR | Nome, descrição, preço, fotos, artesãs |

## Sections

1. **Hero** — Tag itálica, título, subtítulo e CTA "Ir para a Loja" (link para `/shop`).
2. **Grid de produtos** — Cards em grid responsivo (1 → 2 → 3 → 4 colunas). Cada card exibe: foto quadrada, nome, crédito de artesã(s), descrição (limitada a 2 linhas), preço formatado em BRL e botão "Comprar" que leva para `/shop`.

## States

- **Empty:** Mensagem centralizada quando não há produtos cadastrados.
- **Error:** `fetchProducts` retorna array vazio em caso de erro; mesma exibição do estado vazio.

## Notes

- Revalidação ISR a cada 60 segundos.
- Preços formatados com `Intl.NumberFormat` em pt-BR (R$ 1.234,56).
- Esta página é vitrine apenas — sem carrinho. O botão "Comprar" redireciona para `/shop`.
- Textos estáticos vêm de `content.json`.

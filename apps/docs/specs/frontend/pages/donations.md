# Page: Caixinha Solidária

> Página de doações com chave PIX e lista de impacto das doações.

## Route

`/donations`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Dados do instituto | `GET /institution` | 3600s ISR | Chave PIX |

## Sections

1. **Hero** — Tag itálica, título e subtítulo motivacional sobre fundo gradiente.
2. **Layout de duas colunas** (1 coluna em mobile, 2 em md+):
   - **Card PIX** — Título, instrução, e o componente `PixCopy` com a chave e botão de cópia.
   - **Card de impacto** — Fundo terracotta, lista numerada de como as doações são usadas.

## PIX component (`PixCopy`)

Client component que exibe a chave PIX em um campo legível com botão "Copiar". Ao clicar:
1. Copia a chave para o clipboard via `navigator.clipboard.writeText`.
2. Muda o texto do botão para "Copiado!" por 2 segundos.

## States

- **No PIX:** Se `institution.pixKey` for null, exibe mensagem de "não disponível" dentro do card PIX.
- **Not found:** Se a API retornar null, mesmo comportamento.

## Notes

- Revalidação ISR a cada 3600 segundos (1 hora).
- `PixCopy` é um client component separado (`pix-copy.tsx`) para não tornar a page inteira client-side.
- A lista de impacto é estática em `content.json`.
- Textos estáticos vêm de `content.json`.

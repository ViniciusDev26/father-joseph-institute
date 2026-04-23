# Page: Eventos

> Lista todos os eventos do instituto em ordem cronológica decrescente, com fotos, data e descrição.

## Route

`/events`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Lista de eventos | `GET /events` | 60s ISR | Nome, descrição, data, fotos |

## Sections

1. **Hero** — Tag itálica, título e subtítulo sobre fundo gradiente. Mesma estrutura visual das demais páginas.
2. **Lista de eventos** — Cards horizontais (grid 1 coluna em mobile, 2 colunas em md+). Cada card exibe: foto principal (aspect-video no mobile, min-h-64 no desktop), data formatada em pt-BR, título, descrição, e thumbnails das demais fotos em uma faixa horizontal scrollável.

## States

- **Empty:** Mensagem centralizada quando não há eventos cadastrados.
- **Error:** `fetchEvents` retorna array vazio em caso de erro; mesma exibição do estado vazio.

## Notes

- Revalidação ISR a cada 60 segundos.
- Datas formatadas com `Intl.DateTimeFormat` em pt-BR (dia, mês por extenso, ano).
- O elemento `<time dateTime={event.date}>` garante semântica correta para screen readers.
- Quando o evento não tem foto, exibe um placeholder `[Sem foto]`.
- Thumbnails adicionais são exibidas a partir da segunda foto (índice 1+).
- Textos estáticos vêm de `content.json`.

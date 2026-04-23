# Page: Contato

> Exibe as informações de contato do instituto — WhatsApp, Instagram e endereço.

## Route

`/contact`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Dados do instituto | `GET /institution` | 3600s ISR | WhatsApp, Instagram |

## Sections

1. **Hero** — Tag itálica, título e subtítulo sobre fundo gradiente.
2. **Cards de contato** — Grid de cards (1 coluna → 2 → 3). Cada canal disponível gera um card: WhatsApp (link `wa.me`), Instagram (link `instagram.com`), endereço (estático, de `content.json`).

## States

- **Not found:** Se a API retornar null (instituição não cadastrada), exibe mensagem de "não disponível" centralizada.
- Campos de `whatsapp` e `instagram` são opcionais — seus cards só aparecem quando preenchidos.

## Notes

- Revalidação ISR a cada 3600 segundos (1 hora).
- WhatsApp link: `https://wa.me/55{whatsapp}`.
- Instagram link: `https://instagram.com/{handle}` (sem `@`).
- O endereço é estático em `content.json` — não vem da API.
- Textos estáticos vêm de `content.json`.

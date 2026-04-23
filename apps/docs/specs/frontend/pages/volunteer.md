# Page: Seja Voluntário

> Formulário de cadastro de voluntário. Após o envio, redireciona para WhatsApp com mensagem pré-preenchida.

## Route

`/volunteer`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Registro de voluntário | `POST /volunteers` | — | Recebe dados e retorna `whatsappUrl` |

## Sections

1. **Hero** — Tag itálica, título e subtítulo motivacional sobre fundo gradiente.
2. **Formulário** (client component) — Campos: nome completo, profissão, dias disponíveis (botões de seleção múltipla), horário de início e término (inputs `type="time"`).
3. **Tela de sucesso** — Após envio bem-sucedido, exibe card verde com ícone de check, mensagem de agradecimento e link para continuar no WhatsApp.

## Form fields

| Campo | Tipo | Validação |
|-------|------|-----------|
| `name` | text | required |
| `profession` | text | required |
| `availability.days` | multi-select (buttons) | mínimo 1 dia |
| `availability.startTime` | time | required |
| `availability.endTime` | time | required |

## Days mapping

Os dias são selecionados em português e enviados para a API em inglês:
`Segunda-feira` → `monday`, `Terça-feira` → `tuesday`, etc.

## States

- **Submitting:** Botão desabilitado com texto "Enviando...".
- **Error:** Mensagem de erro vermelha acima do botão com o texto retornado pela API.
- **Success:** Substitui o formulário pelo card de sucesso com link para WhatsApp.

## Notes

- O botão de envio fica desabilitado enquanto nenhum dia estiver selecionado.
- A chamada à API acontece via Server Action `registerVolunteer(payload)`.
- O link de WhatsApp abre em nova aba com `target="_blank"`.
- Textos estáticos (labels, dias, mensagens) vêm de `content.json`.

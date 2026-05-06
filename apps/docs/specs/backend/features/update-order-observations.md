# Feature Backend: Atualizar Observações do Pedido

## História

Como administrador, quero registrar observações livres em um pedido para anotar qualquer informação relevante sobre ele.

## Dependências

- **Entidades:** [Order](../entities/order.md)
- **Specs de API:** [PATCH /orders/:id/observations](../../api/orders.md)

## Critérios de aceitação

- [ ] Atualiza o campo `observations` do pedido com o `id` informado.
- [ ] Aceita string com até 2000 caracteres ou `null` para remover.
- [ ] Retorna 404 se o pedido não existir ou estiver soft-deleted.
- [ ] O endpoint exige autenticação de admin.

## Casos de borda

- Valor maior que 2000 caracteres: retorna 400 (validação Zod).
- Pedido não encontrado: retorna 404.

# Feature Backend: Atualizar Status do Pedido

## História

Como administrador, quero atualizar o status de um pedido para refletir a evolução do pagamento e da entrega.

## Dependências

- **Entidades:** [Order](../entities/order.md)
- **Specs de API:** [PATCH /orders/:id/status](../../api/orders.md)

## Critérios de aceitação

- [ ] Atualiza o campo `status` do pedido com o `id` informado.
- [ ] Valores aceitos: `pending`, `paid`, `delivered`.
- [ ] Retorna 404 se o pedido não existir ou estiver soft-deleted.
- [ ] O endpoint exige autenticação de admin.

## Casos de borda

- Status inválido: retorna 400 (validação Zod).
- Pedido não encontrado: retorna 404.

## Notas

- Não há regras de transição obrigatórias — o admin pode mover livremente entre os status.

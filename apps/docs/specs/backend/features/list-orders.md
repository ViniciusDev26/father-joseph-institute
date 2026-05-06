# Feature Backend: Listar Pedidos

## História

Como administrador, quero listar todos os pedidos para acompanhar o status e realizar a entrega.

## Dependências

- **Entidades:** [Order](../entities/order.md), [OrderItem](../entities/order-item.md)
- **Specs de API:** [GET /orders](../../api/orders.md)

## Critérios de aceitação

- [ ] Retorna todos os pedidos não excluídos, ordenados por `created_at` decrescente.
- [ ] Cada pedido inclui `id`, `status`, `total`, `createdAt`, `sessionId` e seus `items` (id, productName, unitPrice, quantity).
- [ ] O endpoint exige autenticação de admin.

## Casos de borda

- Sem pedidos: retorna lista vazia.

## Notas

- O snapshot dos itens vem de `order_item`, sem join com a tabela `product` viva.

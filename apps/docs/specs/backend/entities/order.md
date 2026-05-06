# Entidade: Order

> Representa um pedido feito por um cliente no momento do checkout. Acompanha a evolução do status desde a criação até o pagamento e a entrega.

## Campos

| Campo      | Tipo                                          | Nulo? | Padrão      | Descrição                                                |
|------------|-----------------------------------------------|-------|-------------|----------------------------------------------------------|
| id         | serial                                        | não   | auto        | Chave primária                                           |
| cart_id    | integer                                       | sim   | —           | FK para `cart.id` — carrinho de origem                   |
| session_id | varchar(36)                                   | não   | —           | UUID da sessão do navegador que gerou o pedido           |
| status     | enum(`pending`, `paid`, `delivered`)          | não   | `pending`   | Status de fulfillment                                    |
| total      | numeric(10,2)                                 | não   | —           | Valor total em BRL no momento do checkout                |
| observations | text                                        | sim   | null        | Observações livres registradas pelo admin                |

> Colunas padrão (`created_at`, `updated_at`, `deleted_at`) são herdadas conforme [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) e não devem ser listadas aqui.

## Relações

| Relação | Tipo        | Entidade alvo                | FK                    | On delete |
|---------|-------------|------------------------------|-----------------------|-----------|
| cart    | many-to-one | [Cart](cart.md)              | `order.cart_id`       | set null  |
| items   | one-to-many | [OrderItem](order-item.md)   | `order_item.order_id` | cascade   |

## Regras de negócio

- O pedido é criado no checkout a partir dos itens do carrinho aberto.
- `total` é a soma de `quantity * unit_price` dos itens.
- O status começa em `pending`. O admin pode evoluí-lo para `paid` e depois para `delivered`.
- O pedido permanece mesmo que o carrinho de origem ou seus produtos sejam removidos depois.

## Notas

- Pedidos são imutáveis exceto pelos campos `status` e `observations`.
- Os detalhes dos itens (nome do produto, preço unitário) são gravados como snapshot em `order_item`, garantindo que o pedido continue íntegro mesmo após alterações no produto.

# Entidade: OrderItem

> Snapshot de uma linha de produto dentro de um pedido, capturada no momento do checkout.

## Campos

| Campo         | Tipo           | Nulo? | Padrão | Descrição                                          |
|---------------|----------------|-------|--------|----------------------------------------------------|
| id            | serial         | não   | auto   | Chave primária                                     |
| order_id      | integer        | não   | —      | FK para `order.id`                                 |
| product_id    | integer        | sim   | —      | FK para `product.id` (mantida apenas como referência) |
| product_name  | varchar(255)   | não   | —      | Snapshot do nome do produto no checkout            |
| unit_price    | numeric(10,2)  | não   | —      | Snapshot do preço do produto no checkout           |
| quantity      | integer        | não   | —      | Quantidade de unidades (mínimo 1)                  |

> Colunas padrão (`created_at`, `updated_at`, `deleted_at`) são herdadas conforme [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) e não devem ser listadas aqui.

## Relações

| Relação | Tipo        | Entidade alvo         | FK                       | On delete |
|---------|-------------|-----------------------|--------------------------|-----------|
| order   | many-to-one | [Order](order.md)     | `order_item.order_id`    | cascade   |
| product | many-to-one | [Product](product.md) | `order_item.product_id`  | set null  |

## Regras de negócio

- `product_name` e `unit_price` são snapshots imutáveis — não mudam após a criação do pedido.
- Um mesmo produto pode aparecer no máximo uma vez por pedido (mesma regra do cart-item).

# Entity: CartItem

> Represents a product entry in a cart with its quantity.

## Fields

| Field      | Type    | Nullable | Default | Description                      |
|------------|---------|----------|---------|----------------------------------|
| id         | serial  | no       | auto    | Primary key                      |
| cart_id    | integer | no       | —       | FK to `cart.id`                  |
| product_id | integer | no       | —       | FK to `product.id`               |
| quantity   | integer | no       | —       | Number of units (min 1)          |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type        | Target entity          | FK                    | On delete |
|----------|-------------|------------------------|-----------------------|-----------|
| cart     | many-to-one | [Cart](cart.md)        | `cart_item.cart_id`   | cascade   |
| product  | many-to-one | [Product](product.md)  | `cart_item.product_id`| restrict  |

## Business rules

- `quantity` must be at least 1.
- A product can appear only once per cart. Adding the same product again updates the quantity by summing the values.

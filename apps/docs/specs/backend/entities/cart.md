# Entity: Cart

> Represents a visitor's shopping cart, identified by a client-generated UUID session ID. No authentication required.

## Fields

| Field      | Type                     | Nullable | Default | Description                                 |
|------------|--------------------------|----------|---------|---------------------------------------------|
| id         | serial                   | no       | auto    | Primary key                                 |
| session_id | varchar(36)              | no       | —       | Client-generated UUID identifying the browser session |
| status     | enum(`open`, `closed`)   | no       | `open`  | Cart status — closed after checkout         |
| closed_at  | timestamp with time zone | yes      | null    | Moment the cart was checked out             |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type        | Target entity              | FK                  | On delete |
|----------|-------------|----------------------------|---------------------|-----------|
| items    | one-to-many | [CartItem](cart-item.md)   | `cart_item.cart_id` | cascade   |

## Business rules

- Each `session_id` can have at most one cart with status `open` at a time.
- A new cart is created automatically when the first item is added for a given `session_id`.
- Checkout transitions the cart status from `open` to `closed` and sets `closed_at` to the current timestamp.

## Notes

- The `session_id` is a UUID generated and persisted by the client (e.g. in localStorage). The API never generates it.
- Closed carts are kept for history; they are never deleted.

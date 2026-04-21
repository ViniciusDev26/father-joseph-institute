# Entity: Product

> Represents a handmade product available in the institute's catalog.

## Fields

| Field       | Type          | Nullable | Default | Description                        |
|-------------|---------------|----------|---------|------------------------------------|
| id          | serial        | no       | auto    | Primary key                        |
| name        | varchar(255)  | no       | —       | Product name                       |
| description | text          | yes      | null    | Optional product description       |
| price       | numeric(10,2) | no       | —       | Price in BRL                       |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation  | Type         | Target entity                       | FK                        | On delete |
|-----------|--------------|-------------------------------------|---------------------------|-----------|
| photos    | one-to-many  | [ProductPhoto](product-photo.md)    | `product_photo.product_id` | cascade  |
| artisans  | many-to-many | [Artisan](artisan.md)               | via `product_artisan`     | cascade   |

## Business rules

- A product must have at least one photo.
- A product must have at least one artisan.
- `price` must be greater than zero.

## Notes

- Photos are stored in Cloudflare R2; the database only keeps the object key.
- The many-to-many relation with artisans is managed via the `product_artisan` join table.

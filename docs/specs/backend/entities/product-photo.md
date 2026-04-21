# Entity: ProductPhoto

> A photo associated with a product. Each product can have multiple photos, stored in Cloudflare R2.

## Fields

| Field      | Type                            | Nullable | Default | Description                          |
|------------|---------------------------------|----------|---------|--------------------------------------|
| id         | serial                          | no       | auto    | Primary key                          |
| product_id | integer                         | no       | —       | FK to `product.id`                   |
| object_key | varchar(512)                    | no       | —       | R2 object key (path in the bucket)   |
| mime_type  | enum(`image/png`, `image/jpeg`) | no       | —       | File MIME type per ADR-008           |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type         | Target entity          | FK                          | On delete |
|----------|--------------|------------------------|-----------------------------|-----------|
| product  | many-to-one  | [Product](product.md)  | `product_photo.product_id`  | cascade   |

## Business rules

- The `object_key` follows the pattern `products/{product_id}/{uuid}.{ext}`.
- The full public URL is derived at read time by prepending `R2_PUBLIC_URL` to the `object_key`.

## Notes

- Storing only the `object_key` (not the full URL) keeps data portable if the R2 bucket or public URL changes.

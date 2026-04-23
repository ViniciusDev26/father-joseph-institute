# Backend Feature: ListProducts

## User story

As a visitor, I want to browse all available products in the catalog, so that I can discover and purchase handmade products from the institute's artisans.

## Dependencies

- **Entities:** [Product](../entities/product.md), [ProductPhoto](../entities/product-photo.md), [Artisan](../entities/artisan.md)
- **API specs:** [GET /products](../../api/products.md)

## Acceptance criteria

- [ ] Returns all non-deleted products.
- [ ] Each product includes `id`, `name`, `description`, `price`, `photos`, and `artisans`.
- [ ] `photos` contains `id` and full public URL for each non-deleted photo.
- [ ] `artisans` contains `id` and `name` for each associated artisan.
- [ ] Returns 200 with `{ products: [...] }`.
- [ ] Returns an empty array when no products exist.

## Edge cases

- No products in the database: returns `{ products: [] }`.

## Notes

No pagination, filtering, or sorting requirements for now.

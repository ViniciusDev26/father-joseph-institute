# Backend Feature: UpdateProduct

## User story

As an admin, I want to update a product's name, description, price, or list of artisans, so the catalog stays accurate.

## Dependencies

- **Entities:** [Product](../entities/product.md)
- **API specs:** [PATCH /products/:id](../../api/products.md)

## Acceptance criteria

- [ ] Updates any subset of `name`, `description`, `price`, `artisanIds` on an existing product.
- [ ] Body must contain at least one of those fields; returns 400 otherwise.
- [ ] `name`, when provided, must be 1–255 characters.
- [ ] `description` accepts a string or `null` (to clear it).
- [ ] `price`, when provided, must be greater than zero.
- [ ] `artisanIds`, when provided, must contain at least one ID; all IDs must exist and not be soft-deleted (otherwise 422). Replaces the full product–artisan association set.
- [ ] Refreshes `updated_at` on every successful update.
- [ ] Returns 200 with `{ id, name, description, price, photos: [{ id, url }], artisans: [{ id, name }] }`.
- [ ] Returns 404 if the product does not exist or is soft-deleted.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Empty body `{}`: returns 400.
- Empty `name`: returns 400.
- `price` of zero or negative: returns 400.
- `artisanIds` with non-existent IDs: returns 422.
- Soft-deleted product: returns 404 without modifying the row.
- Photos are not modified by this endpoint — they remain unchanged.

## Notes

Photo management (add/remove) is out of scope for this feature; only product metadata and artisan associations are editable here.

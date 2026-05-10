# Backend Feature: DeleteProduct

## User story

As an admin, I want to remove a product from the catalog, so items that are no longer available stop appearing on the site.

## Dependencies

- **Entities:** [Product](../entities/product.md)
- **API specs:** [DELETE /products/:id](../../api/products.md)

## Acceptance criteria

- [ ] Soft-deletes the product by setting `deleted_at` to the current timestamp.
- [ ] Returns 204 with no body.
- [ ] Returns 404 if the product does not exist or is already soft-deleted.
- [ ] Endpoint is protected by Basic auth.
- [ ] Subsequent `GET /products` no longer exposes the product.

## Edge cases

- Already soft-deleted record: returns 404 and does not refresh `deleted_at`.
- Photos and artisan associations remain in the database but are not exposed.

## Notes

Soft delete only — the row, photos, and associations remain. Hard deletion is out of scope.

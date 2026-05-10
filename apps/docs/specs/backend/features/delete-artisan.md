# Backend Feature: DeleteArtisan

## User story

As an admin, I want to remove an artisan from the public catalog, so profiles that are no longer active stop appearing on the site.

## Dependencies

- **Entities:** [Artisan](../entities/artisan.md)
- **API specs:** [DELETE /artisans/:id](../../api/artisans.md)

## Acceptance criteria

- [ ] Soft-deletes the artisan by setting `deleted_at` to the current timestamp.
- [ ] Returns 204 with no body.
- [ ] Returns 404 if the artisan does not exist or is already soft-deleted.
- [ ] Endpoint is protected by Basic auth.
- [ ] Subsequent `GET /artisans` and `GET /products` no longer expose the artisan.

## Edge cases

- Already soft-deleted record: returns 404 and does not refresh `deleted_at`.
- Existing product associations are preserved in the database, but the artisan no longer appears in product `artisans[]` lists.

## Notes

Soft delete only — the row and its photo object remain in storage. Hard deletion is out of scope.

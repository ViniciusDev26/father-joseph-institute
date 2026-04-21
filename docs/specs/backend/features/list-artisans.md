# Backend Feature: ListArtisans

## User story

As a visitor, I want to see all artisans supported by the institute, so that I can learn about the women behind the handmade products.

## Dependencies

- **Entities:** [Artisan](../entities/artisan.md)
- **API specs:** [GET /artisans](../../api/artisans.md)

## Acceptance criteria

- [ ] Returns all non-deleted artisans.
- [ ] Each artisan includes `id`, `name`, `photoUrl`, `phone`, `email`, and `description`.
- [ ] `photoUrl` is the full public URL (`R2_PUBLIC_URL` + `photo_object_key`).
- [ ] Returns 200 with `{ artisans: [...] }`.
- [ ] Returns an empty array when no artisans exist.

## Edge cases

- No artisans in the database: returns `{ artisans: [] }`.

## Notes

No pagination, filtering, or sorting requirements for now.

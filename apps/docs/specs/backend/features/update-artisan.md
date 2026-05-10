# Backend Feature: UpdateArtisan

## User story

As an admin, I want to update an artisan's name, contact info, or description, so the public profile stays accurate.

## Dependencies

- **Entities:** [Artisan](../entities/artisan.md)
- **API specs:** [PATCH /artisans/:id](../../api/artisans.md)

## Acceptance criteria

- [ ] Updates any subset of `name`, `phone`, `email`, `description` on an existing artisan.
- [ ] Body must contain at least one of `name`, `phone`, `email`, or `description`; returns 400 otherwise.
- [ ] `name`, when provided, must be 1–255 characters.
- [ ] `phone`, when provided, must contain exactly 11 digits, or `null` to clear.
- [ ] `email`, when provided, must be a valid email, or `null` to clear.
- [ ] `description` accepts a string or `null` (to clear it).
- [ ] After the update, at least one of `phone` or `email` must remain set; returns 400 otherwise.
- [ ] Refreshes `updated_at` on every successful update.
- [ ] Returns 200 with `{ id, name, photoUrl, phone, email, description }`.
- [ ] Returns 404 if the artisan does not exist or is soft-deleted.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Empty body `{}`: returns 400.
- Empty `name`: returns 400.
- Clearing both phone and email: returns 400.
- Soft-deleted artisan: returns 404 without modifying the row.
- Photo is not modified by this endpoint — it remains unchanged.

## Notes

Photo management (replace) is out of scope for this feature; only metadata is editable here.

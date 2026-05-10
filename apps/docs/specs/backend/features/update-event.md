# Backend Feature: UpdateEvent

## User story

As an admin, I want to update an event's name, description, or date, so the published information stays accurate.

## Dependencies

- **Entities:** [Event](../entities/event.md)
- **API specs:** [PATCH /events/:id](../../api/events.md)

## Acceptance criteria

- [ ] Updates any subset of `name`, `description`, `date` on an existing event.
- [ ] Body must contain at least one of `name`, `description`, or `date`; returns 400 otherwise.
- [ ] `name`, when provided, must be 1–255 characters.
- [ ] `description` accepts a string or `null` (to clear it).
- [ ] `date`, when provided, must be a valid ISO 8601 datetime with timezone.
- [ ] Refreshes `updated_at` on every successful update.
- [ ] Returns 200 with `{ id, name, description, date, photos: [{ id, url }] }`.
- [ ] Returns 404 if the event does not exist or is soft-deleted.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Empty body `{}`: returns 400.
- Empty `name`: returns 400.
- Soft-deleted event: returns 404 without modifying the row.
- Photos are not modified by this endpoint — they remain unchanged.

## Notes

Photo management (add/remove) is intentionally out of scope for this feature; only event metadata is editable here. Unlike `create-event`, `date` is not validated against the current time on update — admins may need to correct historical dates.

# Backend Feature: GetEvent

## User story

As an admin, I want to fetch a single event by ID, so I can review and edit its information.

## Dependencies

- **Entities:** [Event](../entities/event.md), [EventPhoto](../entities/event-photo.md)
- **API specs:** [GET /events/:id](../../api/events.md)

## Acceptance criteria

- [ ] Returns 200 with `{ id, name, description, date, photos: [{ id, url }] }` when found.
- [ ] Returns 404 if the event does not exist.
- [ ] Returns 404 if the event has `deleted_at` set.
- [ ] `date` is returned as an ISO 8601 string.
- [ ] `photos[].url` is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Non-numeric `id`: validation rejects with 400.
- Soft-deleted event: returns 404, not the deleted data.
- Event with no photos (legacy data): returns the event with `photos: []`.

## Notes

None.

# Backend Feature: ListEvents

## User story

As a visitor, I want to see all events from the institute, so that I can know about their past and upcoming activities.

## Dependencies

- **Entities:** [Event](../entities/event.md), [EventPhoto](../entities/event-photo.md)
- **API specs:** [GET /events](../../api/events.md)

## Acceptance criteria

- [ ] Returns all non-deleted events.
- [ ] Events are sorted by `date` descending (most recent first).
- [ ] Each event includes all its associated non-deleted photos.
- [ ] Each photo includes `id` and the full public URL (`R2_PUBLIC_URL` + `object_key`).
- [ ] Returns 200 with `{ events: [...] }`.
- [ ] Returns an empty array when no events exist.

## Edge cases

- No events in the database: returns `{ events: [] }`.
- Event exists but all its photos are soft-deleted: event still has at least one non-deleted photo per business rule, so this scenario should not occur.

## Notes

No pagination, filtering, or query parameters for now.

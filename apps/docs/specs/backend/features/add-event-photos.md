# Backend Feature: AddEventPhotos

## User story

As an admin, I want to add new photos to an existing event, so I can publish additional images after the event was created.

## Dependencies

- **Entities:** [Event](../entities/event.md), [EventPhoto](../entities/event-photo.md)
- **API specs:** [POST /events/:id/photos](../../api/events.md)

## Acceptance criteria

- [ ] Accepts an array of photos (min 1) for an existing event.
- [ ] Each photo has `{ name: string, mimeType: 'image/png' | 'image/jpeg' }`.
- [ ] Generates a unique R2 object key for each new photo.
- [ ] Generates a presigned PUT URL for each new photo.
- [ ] Persists each new photo as an `event_photo` row linked to the event.
- [ ] Returns 201 with `{ photos: [{ id, url, presignedUrl }] }`.
- [ ] Returns 404 if the event does not exist or is soft-deleted.
- [ ] Returns 400 if no photos are provided or any mimeType is invalid.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Soft-deleted event: returns 404, no rows inserted.
- Mixed valid and invalid mimeTypes: validation rejects with 400, no rows inserted.

## Notes

The client uploads each file directly to R2 using the returned presigned URL. No file data passes through the API. This mirrors the upload flow used in `create-event`.

# Backend Feature: DeleteEventPhoto

## User story

As an admin, I want to remove a specific photo from an event, so I can replace outdated images or fix mistakes without recreating the event.

## Dependencies

- **Entities:** [Event](../entities/event.md), [EventPhoto](../entities/event-photo.md)
- **API specs:** [DELETE /events/:id/photos/:photoId](../../api/events.md)

## Acceptance criteria

- [ ] Deletes the `event_photo` row matching `:photoId` and belonging to event `:id`.
- [ ] Deletes the corresponding object from Cloudflare R2.
- [ ] Refuses to delete the last remaining photo of an event (returns 400) — an event must always keep at least one photo.
- [ ] Returns 204 with no body on success.
- [ ] Returns 404 if the event does not exist, is soft-deleted, or the photo does not belong to it.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Photo belongs to a different event: returns 404.
- Photo is the only one of the event: returns 400 with a clear message; nothing is deleted.
- Soft-deleted event: returns 404 without modifying anything.
- R2 delete fails after DB delete: surface a 500; manual cleanup may be required.

## Notes

This endpoint complements `add-event-photos`. Together they enable full photo management on the edit screen: the admin removes specific photos and uploads new ones in the same flow.

# Backend Feature: CreateEvent

## User story

As an admin, I want to create a new event with photos, so that visitors can see upcoming activities from the institute.

## Dependencies

- **Entities:** [Event](../entities/event.md), [EventPhoto](../entities/event-photo.md)
- **API specs:** [POST /events](../../api/events.md)

## Acceptance criteria

- [ ] Persists a new event with name, optional description, and date.
- [ ] Date must not be in the past; returns 400 if it is.
- [ ] At least one photo is required; returns 400 if none provided.
- [ ] Only `image/png` and `image/jpeg` mimeTypes are accepted; returns 400 otherwise.
- [ ] Generates a unique R2 object key for each photo.
- [ ] Generates a presigned PUT URL for each photo and returns it in the response.
- [ ] Returns the full public URL (`R2_PUBLIC_URL` + `object_key`) for each photo.
- [ ] Returns 201 with the created event and its photos.

## Edge cases

- All photos have invalid mimeType: returns 400, event is not created.
- Date is exactly now (current timestamp): should be accepted.
- Name exceeds 255 characters: returns 400.

## Notes

The client is responsible for uploading files to R2 using the presigned URLs after receiving the response. No file data passes through the API.

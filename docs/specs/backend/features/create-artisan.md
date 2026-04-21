# Backend Feature: CreateArtisan

## User story

As an admin, I want to register a new artisan with her photo and contact info, so that she gains visibility on the institute's website.

## Dependencies

- **Entities:** [Artisan](../entities/artisan.md)
- **API specs:** [POST /artisans](../../api/artisans.md)

## Acceptance criteria

- [ ] Persists a new artisan with name, photo, and optional phone, email, description.
- [ ] `phone` is rejected if it contains non-digit characters or is not exactly 11 digits.
- [ ] `email` is rejected if it is not a valid email address.
- [ ] At least one of `phone` or `email` must be provided; returns 400 if neither is given.
- [ ] `photo.mimeType` must be `image/png` or `image/jpeg`; returns 400 otherwise.
- [ ] Generates a unique R2 object key for the photo (`artisans/{artisan_id}.{ext}`).
- [ ] Generates a presigned PUT URL for the photo and returns it in the response.
- [ ] Returns the full public URL (`R2_PUBLIC_URL` + `object_key`) as `photoUrl`.
- [ ] Returns 201 with the created artisan data.

## Edge cases

- Neither `phone` nor `email` provided: returns 400.
- `phone` with 10 or 12 digits: returns 400.
- `phone` with dashes, spaces, or parentheses: returns 400.
- Invalid `mimeType`: returns 400, artisan is not created.
- Name exceeds 255 characters: returns 400.

## Notes

- The client is responsible for uploading the photo to R2 using the presigned URL after receiving the response.
- No file data passes through the API.
- The R2 object key follows the pattern `artisans/{artisan_id}.{ext}` — the artisan record is inserted first to obtain the ID.

# Backend Feature: UpdateInstitution

## User story

As an admin, I want to update the institution's contact information, so that the website always shows up-to-date data.

## Dependencies

- **Entities:** [Institution](../entities/institution.md)
- **API specs:** [Institution API](../../api/institution.md)

## Acceptance criteria

- [ ] `PATCH /institution` updates only the fields provided in the request body.
- [ ] `whatsapp` is rejected if it contains any non-digit character.
- [ ] Returns 404 if no institution record exists.
- [ ] Returns the updated institution record on success.
- [ ] At least one field must be present in the body; empty body is rejected with 400.

## Edge cases

- Request with no fields: return 400.
- `whatsapp` with spaces, dashes, or parentheses: return 400.
- Institution record not yet seeded: return 404.

## Notes

- The institution is a singleton — the route has no ID parameter; it always targets the first (and only) non-deleted record.
- `name` and `slug` are not updatable through this endpoint.

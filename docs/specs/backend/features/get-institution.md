# Backend Feature: GetInstitution

## User story

As a visitor, I want to fetch the institution's profile data, so that the website can display its name, contact information, and social links.

## Dependencies

- **Entities:** [Institution](../entities/institution.md)
- **API specs:** [Institution API](../../api/institution.md)

## Acceptance criteria

- [ ] `GET /institution` returns the institution's data with status 200.
- [ ] Returns 404 if no institution record exists.
- [ ] Soft-deleted institution is treated as not found.

## Edge cases

- Institution record not yet seeded: return 404.

## Notes

- No authentication required — this is public data.
- The institution is a singleton; the route has no ID parameter.

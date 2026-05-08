# Backend Feature: UpdateAssistedPerson

## User story

As an admin, I want to update an assisted person's name or notes, so the records stay accurate as the situation changes.

## Dependencies

- **Entities:** [AssistedPerson](../entities/assisted-person.md)
- **API specs:** [PATCH /assisted-people/:id](../../api/assisted-people.md)

## Acceptance criteria

- [ ] Updates `name` and/or `description` of an existing record.
- [ ] Body must contain at least one of `name` or `description`; returns 400 otherwise.
- [ ] `name`, when provided, must be 1–255 characters.
- [ ] `description` accepts a string or `null` (to clear it).
- [ ] Refreshes `updated_at` on every successful update.
- [ ] Returns 200 with `{ id, name, description }`.
- [ ] Returns 404 if the record does not exist or is soft-deleted.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Empty body `{}`: returns 400.
- Empty `name`: returns 400.
- Soft-deleted record: returns 404 without modifying the row.

## Notes

None.

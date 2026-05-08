# Backend Feature: GetAssistedPerson

## User story

As an admin, I want to fetch a single assisted person by ID, so I can review and edit their information.

## Dependencies

- **Entities:** [AssistedPerson](../entities/assisted-person.md)
- **API specs:** [GET /assisted-people/:id](../../api/assisted-people.md)

## Acceptance criteria

- [ ] Returns 200 with `{ id, name, description }` when found.
- [ ] Returns 404 if the record does not exist.
- [ ] Returns 404 if the record has `deleted_at` set.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Non-numeric `id`: validation rejects with 400.
- Soft-deleted record: returns 404, not the deleted data.

## Notes

None.

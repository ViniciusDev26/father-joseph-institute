# Backend Feature: ListAssistedPeople

## User story

As an admin, I want to list every assisted person currently registered, so I can see how many people the institute is helping and review their notes.

## Dependencies

- **Entities:** [AssistedPerson](../entities/assisted-person.md)
- **API specs:** [GET /assisted-people](../../api/assisted-people.md)

## Acceptance criteria

- [ ] Returns all rows where `deleted_at IS NULL`.
- [ ] Each item includes `id`, `name`, and `description`.
- [ ] Returns 200 with `{ assistedPeople: [...] }`.
- [ ] Returns an empty array when no records exist.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- No records in the database: returns `{ assistedPeople: [] }`.

## Notes

No pagination, filtering, or sorting requirements for now.

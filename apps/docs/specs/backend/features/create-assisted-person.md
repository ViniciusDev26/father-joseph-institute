# Backend Feature: CreateAssistedPerson

## User story

As an admin, I want to register a new assisted person, so the institute can keep an up-to-date count of the people it is currently helping.

## Dependencies

- **Entities:** [AssistedPerson](../entities/assisted-person.md)
- **API specs:** [POST /assisted-people](../../api/assisted-people.md)

## Acceptance criteria

- [ ] Persists a new assisted person with `name` and optional `description`.
- [ ] `name` is required and rejected if empty or longer than 255 characters.
- [ ] When `description` is omitted, persists `null` and returns `null` in the response.
- [ ] Returns 201 with `{ id, name, description }`.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Empty `name`: returns 400.
- `name` longer than 255 characters: returns 400.

## Notes

None.

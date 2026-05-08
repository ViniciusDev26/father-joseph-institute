# Backend Feature: DeleteAssistedPerson

## User story

As an admin, I want to remove an assisted person from the active list, so the count reflects only the people the institute is currently helping.

## Dependencies

- **Entities:** [AssistedPerson](../entities/assisted-person.md)
- **API specs:** [DELETE /assisted-people/:id](../../api/assisted-people.md)

## Acceptance criteria

- [ ] Soft-deletes the record by setting `deleted_at = now()` per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md).
- [ ] Never performs a physical `DELETE`.
- [ ] Returns 204 with empty body on success.
- [ ] Returns 404 if the record does not exist or is already deleted.
- [ ] Endpoint is protected by Basic auth.

## Edge cases

- Already-deleted record: returns 404 without changing `deleted_at`.

## Notes

Restoration of soft-deleted records is out of scope for this iteration.

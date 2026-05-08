# Entity: AssistedPerson

> Represents a homeless person assisted by the institute. Used internally by the admin to keep track of how many people the institute is currently helping. Not exposed publicly on the site.

## Fields

| Field       | Type         | Nullable | Default | Description                                  |
|-------------|--------------|----------|---------|----------------------------------------------|
| id          | serial       | no       | auto    | Primary key                                  |
| name        | varchar(255) | no       | —       | Assisted person's name                       |
| description | text         | yes      | null    | Free-form notes about the assisted person    |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

None.

## Business rules

- `name` is required and must not be empty.
- `name` is limited to 255 characters.
- Soft delete via `deleted_at` per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md).

## Notes

- This entity is admin-only — there are no public endpoints that expose it.
- The total count of currently assisted people is the count of rows where `deleted_at IS NULL`.

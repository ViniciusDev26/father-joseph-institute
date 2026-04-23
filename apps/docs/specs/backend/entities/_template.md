# Entity: {EntityName}

> Brief description of what this entity represents in the domain.

## Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | serial | no | auto | Primary key |
| ... | ... | ... | ... | ... |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type | Target entity | FK | On delete |
|----------|------|---------------|-----|-----------|
| ... | one-to-many / many-to-one | ... | ... | cascade / set null / restrict |

## Business rules

- Rule 1
- Rule 2

## Notes

Any additional context, constraints, or future considerations.

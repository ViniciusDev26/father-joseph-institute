# Entity: EventPhoto

> A photo associated with an event. Each event can have multiple photos, stored in Cloudflare R2.

## Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | serial | no | auto | Primary key |
| event_id | integer | no | — | FK to `event.id` |
| object_key | varchar(512) | no | — | R2 object key (path in the bucket) |
| mime_type | enum(`image/png`, `image/jpeg`) | no | — | File MIME type per [ADR-008](../../../adr/api/008-postgres-enums.md) |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type | Target entity | FK | On delete |
|----------|------|---------------|-----|-----------|
| event | many-to-one | [Event](event.md) | `event_photo.event_id` | cascade |

## Business rules

- The `object_key` is the path within the R2 bucket (e.g., `events/42/photo-1.jpg`).
- The full public URL is derived at read time by prepending `R2_PUBLIC_URL` to the `object_key`.
- When an event is deleted (soft or hard), its photos follow the same deletion path via cascade.

## Notes

Storing only the `object_key` (not the full URL) keeps the data portable if the R2 bucket or public URL changes.

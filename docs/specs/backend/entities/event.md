# Entity: Event

> Represents an event organized by Instituto Padre Jose. Events are displayed on the site to inform visitors about past and upcoming activities.

## Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | serial | no | auto | Primary key |
| name | varchar(255) | no | — | Event name |
| description | text | yes | null | Optional event description |
| date | timestamp with time zone | no | — | Date and time of the event |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

| Relation | Type | Target entity | FK | On delete |
|----------|------|---------------|-----|-----------|
| photos | one-to-many | [EventPhoto](event-photo.md) | `event_photo.event_id` | cascade |

## Business rules

- An event must have at least one photo.
- The `date` field stores the full date and time with timezone.
- The `date` must not be in the past (validated at creation time).

## Notes

Photos are stored as separate records in `event_photo` to support multiple images per event. The actual files are stored in Cloudflare R2; the database only keeps the object key.

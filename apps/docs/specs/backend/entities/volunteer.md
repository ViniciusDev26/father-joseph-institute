# Entity: Volunteer

> Represents a person who registered interest in volunteering at the institute.

## Fields

| Field        | Type    | Nullable | Default | Description                                              |
|--------------|---------|----------|---------|----------------------------------------------------------|
| id           | serial  | no       | auto    | Primary key                                              |
| name         | varchar(255) | no  | —       | Volunteer's full name                                    |
| profession   | varchar(255) | no  | —       | Volunteer's profession or area of expertise              |
| availability | jsonb   | no       | —       | Availability window: `{ days: string[], startTime: string, endTime: string }` |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

None.

## Business rules

- `availability.days` must contain at least one day.
- `availability.days` values must be valid English weekday names: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.
- `availability.startTime` and `availability.endTime` must be valid times in `HH:MM` format.
- `availability.endTime` must be after `availability.startTime`.

## Notes

- The volunteer record is persisted for history and future reporting.
- After registration, the client receives a `whatsappUrl` to redirect the volunteer to a pre-filled WhatsApp conversation with the institution.

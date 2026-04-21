# Entity: Artisan

> Represents an artisan woman supported by the institute. Artisans are displayed on the site to give visibility to their work.

## Fields

| Field            | Type                           | Nullable | Default | Description                                      |
|------------------|--------------------------------|----------|---------|--------------------------------------------------|
| id               | serial                         | no       | auto    | Primary key                                      |
| name             | varchar(255)                   | no       | —       | Artisan's full name                              |
| photo_object_key | varchar(512)                   | no       | —       | R2 object key for the artisan's photo            |
| photo_mime_type  | enum(`image/png`, `image/jpeg`)| no       | —       | Photo MIME type per ADR-008                      |
| phone            | varchar(11)                    | yes      | null    | Phone number — digits only, exactly 11 digits    |
| email            | varchar(255)                   | yes      | null    | Contact email address                            |
| description      | text                           | yes      | null    | Short bio or description of the artisan's work   |

> Standard columns (`created_at`, `updated_at`, `deleted_at`) are inherited per [ADR-007](../../../adr/api/007-paranoid-soft-delete.md) and should not be listed here.

## Relations

None. Each artisan has exactly one photo, stored inline as `photo_object_key` and `photo_mime_type`.

## Business rules

- `phone` must contain only digits and be exactly 11 characters long.
- `email` must be a valid email address format.
- `phone` and `email` are both optional, but at least one must be provided.
- Exactly one photo per artisan — stored as an R2 object key directly on the entity.

## Notes

- The full public photo URL is derived at read time by prepending `R2_PUBLIC_URL` to `photo_object_key`.
- Storing only the `object_key` (not the full URL) keeps data portable if the R2 bucket or public URL changes.

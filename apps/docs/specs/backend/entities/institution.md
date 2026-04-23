# Entity: Institution

> Represents the nonprofit institution's profile data, used to display contact and identity information.

## Fields

| Field     | Type    | Nullable | Default | Description                                     |
|-----------|---------|----------|---------|--------------------------------------------------|
| id        | serial  | no       | auto    | Primary key                                      |
| name      | varchar | no       | —       | Institution name                                 |
| slug      | varchar | no       | —       | URL-friendly version of the name, unique         |
| instagram | varchar | yes      | null    | Instagram handle (without @)                     |
| whatsapp  | varchar | yes      | null    | WhatsApp number, digits only in DB               |
| pix_key              | varchar    | yes      | null    | PIX key (any format: CPF, email, phone, random)  |
| address_street       | varchar    | yes      | null    | Street name and number (e.g. "Rua X, 123")       |
| address_complement   | varchar    | yes      | null    | Complement (e.g. "Sala 2", "Apto 4B")            |
| address_neighborhood | varchar    | yes      | null    | Neighborhood (bairro)                            |
| address_city         | varchar    | yes      | null    | City                                             |
| address_state        | varchar(2) | yes      | null    | State abbreviation (UF, e.g. "SP")               |
| address_zip          | varchar    | yes      | null    | CEP, digits only (8 chars)                       |

## Relations

None.

## Business rules

- Only one institution record exists at a time (singleton).
- `whatsapp` must contain only digits when received via API request.
- All fields except `id`, `name`, and `slug` are optional.
- `slug` is derived from `name` at write time (lowercased, accents removed, spaces replaced with hyphens).
- `slug` must be unique.

## Notes

- `whatsapp` is stored as `varchar` in the DB to preserve formatting flexibility, but the API validates it as digits-only.

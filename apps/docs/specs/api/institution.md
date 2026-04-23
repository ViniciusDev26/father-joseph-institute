# API: Institution

> Endpoints for managing the institution's profile data.

## Base path

`/institution`

## Endpoints

### `GET /institution`

> Return the institution's profile data.

**Request:**

No parameters.

**Response:**

| Status | Description           | Body                                                  |
|--------|-----------------------|-------------------------------------------------------|
| 200    | Institution data      | `{ id, name, slug, instagram, whatsapp, pixKey, addressStreet, addressComplement, addressNeighborhood, addressCity, addressState, addressZip }` |
| 404    | Institution not found | `{ message: string }`                                 |

**Business rules:**

- Always targets the single institution record (no ID in the path).
- Soft-deleted institution is treated as not found.

---

### `PATCH /institution`

> Update the institution's contact and identity fields. All fields are optional — only provided fields are updated.

**Request:**

| Location | Field     | Type   | Required | Description                                      |
|----------|-----------|--------|----------|--------------------------------------------------|
| body     | instagram           | string | no       | Instagram handle (without @, max 255 chars)       |
| body     | whatsapp            | string | no       | WhatsApp number — digits only (max 50 chars)      |
| body     | pixKey              | string | no       | PIX key in any format (max 255 chars)             |
| body     | addressStreet       | string | no       | Street name and number (max 255 chars)            |
| body     | addressComplement   | string | no       | Complement — sala, apto, etc. (max 255 chars)     |
| body     | addressNeighborhood | string | no       | Neighborhood/bairro (max 255 chars)               |
| body     | addressCity         | string | no       | City (max 255 chars)                              |
| body     | addressState        | string | no       | State abbreviation — UF, exactly 2 chars          |
| body     | addressZip          | string | no       | CEP — exactly 8 digits                            |

**Response:**

| Status | Description      | Body                                                        |
|--------|------------------|-------------------------------------------------------------|
| 200    | Institution updated | `{ id, name, slug, instagram, whatsapp, pixKey, addressStreet, addressComplement, addressNeighborhood, addressCity, addressState, addressZip }` |
| 400    | Validation error | `{ message: string }`                                       |
| 404    | Institution not found | `{ message: string }`                                  |

**Business rules:**

- At least one field must be provided in the request body.
- `whatsapp` must contain only digits.
- The request always targets the single institution record (no ID in the path).

# API: AssistedPeople

> Admin endpoints for managing assisted homeless people. All endpoints require Basic auth per [ADR-014](../../adr/api/014-basic-authentication.md).

## Base path

`/assisted-people`

## Endpoints

### `GET /assisted-people`

> List all non-deleted assisted people.

**Request:**

No parameters.

**Response:**

| Status | Description           | Body                            |
|--------|-----------------------|---------------------------------|
| 200    | Assisted people list  | `{ assistedPeople: [...] }`     |
| 401    | Unauthorized          | `{ message: string }`           |

**Response body — `assistedPeople[]`:**

| Field       | Type           | Description           |
|-------------|----------------|-----------------------|
| id          | number         | Assisted person ID    |
| name        | string         | Name                  |
| description | string \| null | Notes                 |

**Business rules:**

- Returns all rows where `deleted_at IS NULL`.
- Returns an empty array when no records exist.

---

### `GET /assisted-people/:id`

> Fetch a single assisted person by ID.

**Request:**

| Location | Field | Type   | Required | Description           |
|----------|-------|--------|----------|-----------------------|
| params   | id    | number | yes      | Assisted person ID    |

**Response:**

| Status | Description    | Body                                     |
|--------|----------------|------------------------------------------|
| 200    | Found          | `{ id, name, description }`              |
| 401    | Unauthorized   | `{ message: string }`                    |
| 404    | Not found      | `{ message: string }`                    |

**Business rules:**

- Returns 404 if the record does not exist or has `deleted_at` set.

---

### `POST /assisted-people`

> Register a new assisted person.

**Request:**

| Location | Field       | Type   | Required | Description                          |
|----------|-------------|--------|----------|--------------------------------------|
| body     | name        | string | yes      | Name (1–255 characters)              |
| body     | description | string | no       | Free-form notes                      |

**Response:**

| Status | Description       | Body                                  |
|--------|-------------------|---------------------------------------|
| 201    | Created           | `{ id, name, description }`           |
| 400    | Validation error  | `{ message: string }`                 |
| 401    | Unauthorized      | `{ message: string }`                 |

**Business rules:**

- `name` must be 1–255 characters.
- `description` is optional; when omitted the response returns `null`.

---

### `PATCH /assisted-people/:id`

> Update an existing assisted person. Both fields are optional; at least one must be provided.

**Request:**

| Location | Field       | Type   | Required | Description                |
|----------|-------------|--------|----------|----------------------------|
| params   | id          | number | yes      | Assisted person ID         |
| body     | name        | string | no       | New name (1–255 chars)     |
| body     | description | string \| null | no | New description; pass `null` to clear |

**Response:**

| Status | Description       | Body                                  |
|--------|-------------------|---------------------------------------|
| 200    | Updated           | `{ id, name, description }`           |
| 400    | Validation error  | `{ message: string }`                 |
| 401    | Unauthorized      | `{ message: string }`                 |
| 404    | Not found         | `{ message: string }`                 |

**Business rules:**

- Returns 404 if the record does not exist or has `deleted_at` set.
- Body must contain at least one of `name` or `description`.
- `updated_at` is refreshed on every update.

---

### `DELETE /assisted-people/:id`

> Soft delete an assisted person per [ADR-007](../../adr/api/007-paranoid-soft-delete.md).

**Request:**

| Location | Field | Type   | Required | Description           |
|----------|-------|--------|----------|-----------------------|
| params   | id    | number | yes      | Assisted person ID    |

**Response:**

| Status | Description    | Body                  |
|--------|----------------|-----------------------|
| 204    | Deleted        | (empty)               |
| 401    | Unauthorized   | `{ message: string }` |
| 404    | Not found      | `{ message: string }` |

**Business rules:**

- Sets `deleted_at = now()`. Does not physically remove the row.
- Returns 404 if the record does not exist or is already deleted.

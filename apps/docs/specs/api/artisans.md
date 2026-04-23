# API: Artisans

> Endpoints for managing artisan profiles.

## Base path

`/artisans`

## Endpoints

### `GET /artisans`

> List all artisans.

**Request:**

No parameters.

**Response:**

| Status | Description  | Body                        |
|--------|--------------|-----------------------------|
| 200    | Artisan list | `{ artisans: [...] }`       |

**Response body — `artisans[]`:**

| Field       | Type           | Description                        |
|-------------|----------------|------------------------------------|
| id          | number         | Artisan ID                         |
| name        | string         | Artisan's full name                |
| photoUrl    | string         | Full public URL of the photo       |
| phone       | string \| null | Phone number (digits only)         |
| email       | string \| null | Contact email                      |
| description | string \| null | Bio or description                 |

**Business rules:**

- Returns all non-deleted artisans.
- Returns an empty array when no artisans exist.

---

### `POST /artisans`

> Register a new artisan. The backend generates an R2 object key and a presigned URL for the photo. The client uploads the file directly to R2 using the returned presigned URL.

**Request:**

| Location | Field            | Type   | Required | Description                                        |
|----------|------------------|--------|----------|----------------------------------------------------|
| body     | name             | string | yes      | Artisan's full name (max 255 chars)                |
| body     | photo.mimeType   | string | yes      | Photo MIME type — `image/png` or `image/jpeg`      |
| body     | phone            | string | no       | Phone number — digits only, exactly 11 digits      |
| body     | email            | string | no       | Valid email address                                |
| body     | description      | string | no       | Bio or description of the artisan's work           |

**Response:**

| Status | Description      | Body                                                                          |
|--------|------------------|-------------------------------------------------------------------------------|
| 201    | Artisan created  | `{ id, name, photoUrl, presignedUrl, phone, email, description }`             |
| 400    | Validation error | `{ message: string }`                                                         |

**Business rules:**

- `photo.mimeType` must be one of: `image/png`, `image/jpeg`.
- `phone` must contain only digits and be exactly 11 characters.
- `email` must be a valid email address.
- At least one of `phone` or `email` must be provided.
- `photoUrl` in the response is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- `presignedUrl` is a temporary presigned PUT URL for the client to upload the photo directly to R2.

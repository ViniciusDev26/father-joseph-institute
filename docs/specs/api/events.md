# API: Events

> Endpoints for managing events.

## Base path

`/events`

## Endpoints

### `POST /events`

> Create a new event with one or more photos. The backend generates R2 object keys and presigned URLs for each photo. The client uploads files directly to R2 using the returned presigned URLs after receiving the response.

**Request:**

| Location | Field | Type | Required | Description |
|----------|-------|------|----------|-------------|
| body | name | string | yes | Event name (max 255 chars) |
| body | description | string | no | Optional event description |
| body | date | string (ISO 8601) | yes | Event date and time with timezone |
| body | photos | object[] | yes | Array of photo objects (min 1). Each: `{ name: string, mimeType: string }`. Allowed mimeTypes: `image/png`, `image/jpeg` |

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| 201 | Event created | `{ id, name, description, date, photos: [{ id, url, presignedUrl }] }` |
| 400 | Validation error | `{ message: string }` |

**Business rules:**

- `date` must not be in the past.
- At least one photo is required.
- `mimeType` must be one of: `image/png`, `image/jpeg`.
- `photos[].url` in the response is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- `photos[].presignedUrl` is a temporary presigned URL for the client to upload the file directly to R2 via PUT.

---

### `GET /events`

> List all events with their photos, ordered by date descending (most recent first).

**Request:**

| Location | Field | Type | Required | Description |
|----------|-------|------|----------|-------------|
| — | — | — | — | No parameters |

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| 200 | Event list | `{ events: [{ id, name, description, date, photos: [{ id, url }] }] }` |

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| events[].id | number | Event ID |
| events[].name | string | Event name |
| events[].description | string \| null | Optional event description |
| events[].date | string (ISO 8601) | Event date and time with timezone |
| events[].photos[].id | number | Photo ID |
| events[].photos[].url | string | Full public URL (`R2_PUBLIC_URL` + `object_key`) |

**Business rules:**

- Returns all non-deleted events (soft-deleted events are excluded).
- Events are sorted by `date` descending.
- Each event includes all its associated photos.
- `photos[].url` is the full public URL, same as in the create response (no `presignedUrl` here).

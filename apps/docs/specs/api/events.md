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

### `GET /events/:id`

> Get a single event by ID, including its photos. Used to prefill the admin edit form.

**Request:**

| Location | Field | Type | Required | Description |
|----------|-------|------|----------|-------------|
| params | id | number | yes | Event ID |

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| 200 | Event found | `{ id, name, description, date, photos: [{ id, url }] }` |
| 401 | Missing/invalid Basic auth | `{ message: string }` |
| 404 | Event not found or soft-deleted | `{ message: string }` |

**Business rules:**

- Soft-deleted events return 404.
- `photos[].url` is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- Endpoint is protected by Basic auth.

---

### `PATCH /events/:id`

> Update an event's metadata (name, description, date). Photos are not modified.

**Request:**

| Location | Field | Type | Required | Description |
|----------|-------|------|----------|-------------|
| params | id | number | yes | Event ID |
| body | name | string | no | New event name (1–255 chars) |
| body | description | string \| null | no | New description, or `null` to clear |
| body | date | string (ISO 8601) | no | New event date and time with timezone |

At least one of `name`, `description`, or `date` must be provided.

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| 200 | Event updated | `{ id, name, description, date, photos: [{ id, url }] }` |
| 400 | Validation error or empty body | `{ message: string }` |
| 401 | Missing/invalid Basic auth | `{ message: string }` |
| 404 | Event not found or soft-deleted | `{ message: string }` |

**Business rules:**

- Only the provided fields are updated; omitted fields are left unchanged.
- `updated_at` is refreshed on every successful update.
- Soft-deleted events return 404 and are not modified.
- `date` is **not** validated against the current time (unlike create) — admins may correct historical events.
- Photos are returned in the response for convenience but are not editable via this endpoint.
- Endpoint is protected by Basic auth.

---

### `POST /events/:id/photos`

> Add new photos to an existing event. Mirrors the upload flow used by `POST /events`: backend generates R2 object keys and presigned URLs; the client uploads files directly to R2 via PUT.

**Request:**

| Location | Field | Type | Required | Description |
|----------|-------|------|----------|-------------|
| params | id | number | yes | Event ID |
| body | photos | object[] | yes | Array of photos (min 1). Each: `{ name: string, mimeType: 'image/png' \| 'image/jpeg' }` |

**Response:**

| Status | Description | Body |
|--------|-------------|------|
| 201 | Photos created | `{ photos: [{ id, url, presignedUrl }] }` |
| 400 | Validation error | `{ message: string }` |
| 401 | Missing/invalid Basic auth | `{ message: string }` |
| 404 | Event not found or soft-deleted | `{ message: string }` |

**Business rules:**

- At least one photo is required.
- `mimeType` must be one of: `image/png`, `image/jpeg`.
- `photos[].url` is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- `photos[].presignedUrl` is a temporary presigned URL for the client to upload the file directly to R2 via PUT.
- Endpoint is protected by Basic auth.

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

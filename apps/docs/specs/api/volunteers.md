# API: Volunteers

> Endpoints for volunteer management.

## Base path

`/volunteers`

## Endpoints

### `GET /volunteers`

> List all registered volunteers. Requires authentication.

**Request:**

No parameters.

**Response:**

| Status | Description     | Body                      |
|--------|-----------------|---------------------------|
| 200    | Volunteer list  | `{ volunteers: [...] }`   |
| 401    | Unauthorized    | `{ message: string }`     |

**Response body — `volunteers[]`:**

| Field                     | Type     | Description              |
|---------------------------|----------|--------------------------|
| id                        | number   | Volunteer ID             |
| name                      | string   | Full name                |
| profession                | string   | Profession               |
| availability.days         | string[] | Registered weekdays      |
| availability.startTime    | string   | Start time in `HH:MM`   |
| availability.endTime      | string   | End time in `HH:MM`     |

**Business rules:**

- Requires valid Basic Auth credentials.
- Returns all non-deleted volunteers.
- Returns an empty array when no volunteers exist.

---

### `POST /volunteers`

> Register a new volunteer. Persists the volunteer's data and returns a pre-filled WhatsApp URL to redirect the volunteer to a conversation with the institution.

**Request:**

| Location | Field                      | Type     | Required | Description                                                              |
|----------|----------------------------|----------|----------|--------------------------------------------------------------------------|
| body     | name                       | string   | yes      | Volunteer's full name (max 255 chars)                                    |
| body     | profession                 | string   | yes      | Volunteer's profession (max 255 chars)                                   |
| body     | availability.days          | string[] | yes      | Weekdays in English (min 1). Allowed: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday` |
| body     | availability.startTime     | string   | yes      | Start time in `HH:MM` format (e.g. `16:00`)                             |
| body     | availability.endTime       | string   | yes      | End time in `HH:MM` format (e.g. `19:30`). Must be after `startTime`   |

**Response:**

| Status | Description       | Body                                                     |
|--------|-------------------|----------------------------------------------------------|
| 201    | Volunteer created | `{ id, name, profession, availability, whatsappUrl }`   |
| 400    | Validation error  | `{ message: string }`                                    |
| 422    | Institution has no WhatsApp number registered | `{ message: string }`    |

**Response body fields:**

| Field               | Type     | Description                                                              |
|---------------------|----------|--------------------------------------------------------------------------|
| id                  | number   | Volunteer ID                                                             |
| name                | string   | Volunteer's full name                                                    |
| profession          | string   | Volunteer's profession                                                   |
| availability.days   | string[] | Registered weekdays                                                      |
| availability.startTime | string | Start time in `HH:MM`                                                  |
| availability.endTime   | string | End time in `HH:MM`                                                    |
| whatsappUrl         | string   | Pre-filled WhatsApp URL (`https://wa.me/{number}?text={encoded_message}`) |

**Business rules:**

- `availability.days` must contain at least one valid weekday.
- `availability.endTime` must be after `availability.startTime`.
- After persisting the volunteer, the backend fetches the institution's WhatsApp number to build the `whatsappUrl`.
- If the institution has no WhatsApp number, returns 422.
- The pre-filled message follows the template: _"Olá! Me chamo {name}, sou {profession} e gostaria de me voluntariar no Instituto Padre José. Tenho disponibilidade às {days} das {startTime} às {endTime}."_
- The WhatsApp number is prefixed with the Brazil country code `55`: `https://wa.me/55{whatsapp}?text=...`

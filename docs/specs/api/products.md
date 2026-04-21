# API: Products

> Endpoints for the product catalog.

## Base path

`/products`

## Endpoints

### `GET /products`

> List all products in the catalog with their photos and artisans.

**Request:**

No parameters.

**Response:**

| Status | Description   | Body                      |
|--------|---------------|---------------------------|
| 200    | Product list  | `{ products: [...] }`     |

**Response body — `products[]`:**

| Field              | Type           | Description                              |
|--------------------|----------------|------------------------------------------|
| id                 | number         | Product ID                               |
| name               | string         | Product name                             |
| description        | string \| null | Optional description                     |
| price              | number         | Price in BRL (e.g. `29.90`)              |
| photos             | object[]       | List of photos: `[{ id, url }]`          |
| artisans           | object[]       | List of artisans: `[{ id, name }]`       |

**Business rules:**

- Returns all non-deleted products.
- Each product includes all its non-deleted photos and associated artisans.
- Returns an empty array when no products exist.

---

### `POST /products`

> Register a new product in the catalog. The backend generates R2 object keys and presigned URLs for each photo. The client uploads files directly to R2 using the returned presigned URLs.

**Request:**

| Location | Field               | Type     | Required | Description                                           |
|----------|---------------------|----------|----------|-------------------------------------------------------|
| body     | name                | string   | yes      | Product name (max 255 chars)                          |
| body     | description         | string   | no       | Optional product description                          |
| body     | price               | number   | yes      | Price in BRL, greater than zero                       |
| body     | artisanIds          | number[] | yes      | IDs of the artisans who make this product (min 1)     |
| body     | photos              | object[] | yes      | Array of photo objects (min 1): `[{ mimeType }]`      |
| body     | photos[].mimeType   | string   | yes      | `image/png` or `image/jpeg`                           |

**Response:**

| Status | Description      | Body                                                                                   |
|--------|------------------|----------------------------------------------------------------------------------------|
| 201    | Product created  | `{ id, name, description, price, artisans: [{ id, name }], photos: [{ id, url, presignedUrl }] }` |
| 400    | Validation error | `{ message: string }`                                                                  |
| 422    | One or more artisanIds not found | `{ message: string }`                                                  |

**Business rules:**

- `price` must be greater than zero.
- At least one photo is required.
- At least one artisan ID is required.
- All provided `artisanIds` must exist and not be soft-deleted; returns 422 if any are invalid.
- `photos[].url` is the full public URL (`R2_PUBLIC_URL` + `object_key`).
- `photos[].presignedUrl` is a temporary presigned PUT URL for direct R2 upload.
- Photo object keys follow the pattern `products/{product_id}/{uuid}.{ext}`.

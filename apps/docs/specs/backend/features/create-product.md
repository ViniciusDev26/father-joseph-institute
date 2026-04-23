# Backend Feature: CreateProduct

## User story

As an admin, I want to register a new product in the catalog with its photos and responsible artisans, so that visitors can browse and discover handmade products.

## Dependencies

- **Entities:** [Product](../entities/product.md), [ProductPhoto](../entities/product-photo.md), [Artisan](../entities/artisan.md)
- **API specs:** [POST /products](../../api/products.md)

## Acceptance criteria

- [ ] Persists a new product with name, optional description, and price.
- [ ] `price` must be greater than zero; returns 400 otherwise.
- [ ] At least one photo is required; returns 400 if none provided.
- [ ] At least one artisan ID is required; returns 400 if none provided.
- [ ] All `artisanIds` must exist and not be soft-deleted; returns 422 if any are invalid.
- [ ] `photos[].mimeType` must be `image/png` or `image/jpeg`; returns 400 otherwise.
- [ ] Generates a unique R2 object key per photo following `products/{product_id}/{uuid}.{ext}`.
- [ ] Generates a presigned PUT URL for each photo and returns it in the response.
- [ ] Returns the full public URL (`R2_PUBLIC_URL` + `object_key`) for each photo.
- [ ] Returns 201 with the created product, its artisans, and photo URLs.

## Edge cases

- `artisanIds` contains an ID that doesn't exist or is soft-deleted: returns 422.
- `artisanIds` contains duplicate IDs: duplicates are ignored, each artisan linked once.
- All photos have invalid mimeType: returns 400, product is not created.
- `price` is zero or negative: returns 400.
- Name exceeds 255 characters: returns 400.

## Notes

- The product is inserted first to obtain the ID for the photo object keys.
- Artisan associations are inserted into `product_artisan` after the product is created.
- The client uploads photos directly to R2 using the presigned URLs — no file data passes through the API.

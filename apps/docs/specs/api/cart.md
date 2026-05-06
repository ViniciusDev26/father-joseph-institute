# API: Cart

> Endpoints for managing the visitor's shopping cart and checkout.

## Base path

`/cart`

## Endpoints

### `GET /cart/:sessionId`

> Return the open cart and its items for a given session, with product details.

**Request:**

| Location | Field     | Type   | Required | Description                                            |
|----------|-----------|--------|----------|--------------------------------------------------------|
| params   | sessionId | string | yes      | Client-generated UUID identifying the browser session  |

**Response:**

| Status | Description       | Body                                                                                          |
|--------|-------------------|-----------------------------------------------------------------------------------------------|
| 200    | Cart found        | `{ cartId, sessionId, items: [{ id, quantity, product: { id, name, price, photoUrl } }] }`   |
| 404    | No open cart found | `{ message: string }`                                                                        |

**Business rules:**

- Returns the open cart for the session; returns 404 if none exists.
- Each item includes basic product details: `id`, `name`, `price`, and the first non-deleted photo URL.
- `photoUrl` is null if the product has no photos.

---

### `POST /cart/items`

> Add a product to the cart. If the cart for the given session does not exist, it is created automatically. If the product is already in the cart, its quantity is incremented by the provided amount.

**Request:**

| Location | Field      | Type   | Required | Description                                              |
|----------|------------|--------|----------|----------------------------------------------------------|
| body     | sessionId  | string | yes      | Client-generated UUID identifying the browser session    |
| body     | productId  | number | yes      | ID of the product to add                                 |
| body     | quantity   | number | yes      | Number of units to add (integer, min 1)                  |

**Response:**

| Status | Description         | Body                                                              |
|--------|---------------------|-------------------------------------------------------------------|
| 200    | Item added to cart  | `{ cartId, sessionId, items: [{ id, productId, quantity }] }`    |
| 400    | Validation error    | `{ message: string }`                                             |
| 422    | Product not found   | `{ message: string }`                                             |

**Business rules:**

- If no open cart exists for `sessionId`, one is created.
- If the product is already in the cart, the quantities are summed.
- The product must exist and not be soft-deleted; returns 422 otherwise.

---

### `POST /cart/checkout`

> Checkout the cart. Generates a pre-filled WhatsApp message with the cart contents and closes the cart.

**Request:**

| Location | Field     | Type   | Required | Description                                            |
|----------|-----------|--------|----------|--------------------------------------------------------|
| body     | sessionId | string | yes      | Client-generated UUID identifying the browser session  |

**Response:**

| Status | Description             | Body                              |
|--------|-------------------------|-----------------------------------|
| 200    | Checkout completed      | `{ orderId, whatsappUrl }`        |
| 400    | Validation error        | `{ message: string }`       |
| 404    | No open cart found      | `{ message: string }`       |
| 422    | Cart is empty           | `{ message: string }`       |
| 422    | Institution has no WhatsApp registered | `{ message: string }` |

**Business rules:**

- The cart must exist and have status `open`; returns 404 otherwise.
- The cart must have at least one item; returns 422 if empty.
- An `Order` is created with status `pending` and a snapshot of all items (product name, unit price, quantity).
- Cart status is set to `closed` after checkout.
- The WhatsApp message lists each product with its quantity and unit price, and includes the total.
- The WhatsApp number is fetched from the institution record and prefixed with `55`.
- Returns 422 if the institution has no WhatsApp number registered.

**WhatsApp message template:**

```
Olá! Gostaria de fazer um pedido:

- {quantity}x {product_name} — R$ {unit_price} cada
...

Total: R$ {total}
```

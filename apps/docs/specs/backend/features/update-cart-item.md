# Backend Feature: UpdateCartItem

## User story

As a visitor, I want to increment, decrement, or remove items in my cart so that I can adjust the quantities before placing an order.

## Dependencies

- **Entities:** [Cart](../entities/cart.md), [CartItem](../entities/cart-item.md), [Product](../entities/product.md)
- **API specs:** [PATCH /cart/items/:itemId](../../api/cart.md)

## Acceptance criteria

- [ ] Updates the quantity of a cart item to the given value.
- [ ] If the new quantity is 0, the cart item is removed.
- [ ] `quantity` must be an integer >= 0; returns 400 otherwise.
- [ ] The cart must exist for the `sessionId` with status `open`; returns 404 otherwise.
- [ ] The item must belong to the cart; returns 404 otherwise.
- [ ] Returns 200 with the updated cart contents (same shape as `GET /cart/:sessionId`).

## Edge cases

- Quantity decremented to 0: item is removed; the cart is returned (possibly empty).
- Item belongs to a different session/cart: returns 404.
- Cart is closed: returns 404 (no open cart for the session).

## Notes

- The frontend computes the next quantity (`current ± 1`) and sends the absolute value, not a delta.

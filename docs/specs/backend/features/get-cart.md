# Backend Feature: GetCart

## User story

As a visitor, I want to see the contents of my cart so that I can review my items before checking out.

## Dependencies

- **Entities:** [Cart](../entities/cart.md), [CartItem](../entities/cart-item.md), [Product](../entities/product.md)
- **API specs:** [GET /cart/:sessionId](../../api/cart.md)

## Acceptance criteria

- [ ] Returns the open cart for the given `sessionId`; returns 404 if none exists.
- [ ] Each item includes `id`, `quantity`, and product details (`id`, `name`, `price`, `photoUrl`).
- [ ] `photoUrl` is the full public URL of the first non-deleted product photo, or null if none.

## Edge cases

- No open cart for `sessionId`: returns 404.
- Product in cart has no photos: `photoUrl` is null.

## Notes

- Only the open cart is returned — closed carts are not exposed by this endpoint.

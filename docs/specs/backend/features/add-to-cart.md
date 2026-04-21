# Backend Feature: AddToCart

## User story

As a visitor, I want to add products to my cart so that I can select items before placing an order.

## Dependencies

- **Entities:** [Cart](../entities/cart.md), [CartItem](../entities/cart-item.md), [Product](../entities/product.md)
- **API specs:** [POST /cart/items](../../api/cart.md)

## Acceptance criteria

- [ ] Creates a new open cart for the `sessionId` if one does not exist.
- [ ] Adds the product to the cart with the given quantity.
- [ ] If the product is already in the cart, sums the quantities.
- [ ] `quantity` must be at least 1; returns 400 otherwise.
- [ ] Product must exist and not be soft-deleted; returns 422 otherwise.
- [ ] Returns 200 with the updated cart contents.

## Edge cases

- First item added: cart is created and item inserted.
- Same product added again: existing cart item quantity is incremented.
- Invalid productId: returns 422.
- `quantity` is 0 or negative: returns 400.

## Notes

- The `sessionId` is always provided by the client — the API never generates it.

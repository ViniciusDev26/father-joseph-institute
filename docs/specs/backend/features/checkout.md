# Backend Feature: Checkout

## User story

As a visitor, I want to checkout my cart so that I can send my order to the institute via WhatsApp.

## Dependencies

- **Entities:** [Cart](../entities/cart.md), [CartItem](../entities/cart-item.md), [Product](../entities/product.md), [Institution](../entities/institution.md)
- **API specs:** [POST /cart/checkout](../../api/cart.md)

## Acceptance criteria

- [ ] Finds the open cart for the given `sessionId`; returns 404 if none exists.
- [ ] Returns 422 if the cart has no items.
- [ ] Fetches institution WhatsApp; returns 422 if not set.
- [ ] Sets cart status to `closed`.
- [ ] Builds and returns a `whatsappUrl` with a pre-filled message listing products, quantities, unit prices, and total.

## Edge cases

- No open cart for `sessionId`: returns 404.
- Open cart exists but has no items: returns 422.
- Institution has no WhatsApp: returns 422.

## Notes

- Cart is closed even if the WhatsApp URL cannot be built? No — close the cart only after confirming the institution has a WhatsApp, to avoid losing the cart without a usable URL.
- Total is calculated as the sum of `quantity * price` for each item.
- Prices are formatted with two decimal places in the message (e.g. `R$ 29,90`).

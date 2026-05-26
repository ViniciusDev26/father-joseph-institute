import type { z } from 'zod/v4';
import type {
  addToCartBodySchema,
  checkoutBodySchema,
  getCartParamsSchema,
  updateCartItemBodySchema,
  updateCartItemParamsSchema,
} from '../../schemas/cart';

export type AddToCartBody = z.infer<typeof addToCartBodySchema>;
export type CheckoutBody = z.infer<typeof checkoutBodySchema>;
export type GetCartParams = z.infer<typeof getCartParamsSchema>;
export type UpdateCartItemParams = z.infer<typeof updateCartItemParamsSchema>;
export type UpdateCartItemBody = z.infer<typeof updateCartItemBodySchema>;

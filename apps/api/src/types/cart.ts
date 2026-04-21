import type { z } from 'zod/v4';
import type { addToCartBodySchema, checkoutBodySchema } from '../schemas/cart';

export type AddToCartBody = z.infer<typeof addToCartBodySchema>;
export type CheckoutBody = z.infer<typeof checkoutBodySchema>;

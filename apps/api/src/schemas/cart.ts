import { z } from 'zod/v4';

export const addToCartBodySchema = z.object({
  sessionId: z.string().uuid(),
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

const cartItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  quantity: z.number(),
});

export const addToCartResponseSchema = z.object({
  cartId: z.number(),
  sessionId: z.string(),
  items: z.array(cartItemSchema),
});

export const checkoutBodySchema = z.object({
  sessionId: z.string().uuid(),
});

export const checkoutResponseSchema = z.object({
  whatsappUrl: z.string(),
});

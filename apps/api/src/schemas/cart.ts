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

const getCartItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  product: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    photoUrl: z.string().nullable(),
  }),
});

export const getCartResponseSchema = z.object({
  cartId: z.number(),
  sessionId: z.string(),
  items: z.array(getCartItemSchema),
});

export const getCartParamsSchema = z.object({
  sessionId: z.string().uuid(),
});

export const checkoutBodySchema = z.object({
  sessionId: z.string().uuid(),
});

export const checkoutResponseSchema = z.object({
  whatsappUrl: z.string(),
});

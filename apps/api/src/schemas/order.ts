import { z } from 'zod/v4';

export const orderStatusSchema = z.enum(['pending', 'paid', 'delivered']);

const orderItemSchema = z.object({
  id: z.number(),
  productName: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
});

const orderSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  total: z.number(),
  observations: z.string().nullable(),
  sessionId: z.string(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
});

export const listOrdersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

export const updateOrderStatusParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateOrderStatusBodySchema = z.object({
  status: orderStatusSchema,
});

export const updateOrderStatusResponseSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
});

export const updateOrderObservationsParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateOrderObservationsBodySchema = z.object({
  observations: z.string().max(2000).nullable(),
});

export const updateOrderObservationsResponseSchema = z.object({
  id: z.number(),
  observations: z.string().nullable(),
});

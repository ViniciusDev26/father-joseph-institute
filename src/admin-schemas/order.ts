import { z } from 'zod';

export const orderStatusSchema = z.enum(['pending', 'paid', 'delivered']);

export const orderItemSchema = z.object({
  id: z.number(),
  productName: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
});

export const orderSchema = z.object({
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

export const updateOrderStatusResponseSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
});

export const updateOrderObservationsResponseSchema = z.object({
  id: z.number(),
  observations: z.string().nullable(),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type Order = z.infer<typeof orderSchema>;

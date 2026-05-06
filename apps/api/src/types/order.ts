import type { z } from 'zod/v4';
import type {
  updateOrderObservationsBodySchema,
  updateOrderObservationsParamsSchema,
  updateOrderStatusBodySchema,
  updateOrderStatusParamsSchema,
} from '../schemas/order';

export type UpdateOrderStatusParams = z.infer<typeof updateOrderStatusParamsSchema>;
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBodySchema>;
export type UpdateOrderObservationsParams = z.infer<typeof updateOrderObservationsParamsSchema>;
export type UpdateOrderObservationsBody = z.infer<typeof updateOrderObservationsBodySchema>;

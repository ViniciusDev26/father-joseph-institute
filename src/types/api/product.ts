import type { z } from 'zod/v4';
import type {
  createProductBodySchema,
  productParamsSchema,
  updateProductBodySchema,
} from '../../schemas/product';

export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;

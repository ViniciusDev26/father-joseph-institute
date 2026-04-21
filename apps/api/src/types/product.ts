import type { z } from 'zod/v4';
import type { createProductBodySchema } from '../schemas/product';

export type CreateProductBody = z.infer<typeof createProductBodySchema>;

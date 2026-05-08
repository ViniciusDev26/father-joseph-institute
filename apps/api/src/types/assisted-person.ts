import type { z } from 'zod/v4';
import type {
  assistedPersonParamsSchema,
  createAssistedPersonBodySchema,
  updateAssistedPersonBodySchema,
} from '../schemas/assisted-person';

export type AssistedPersonParams = z.infer<typeof assistedPersonParamsSchema>;
export type CreateAssistedPersonBody = z.infer<typeof createAssistedPersonBodySchema>;
export type UpdateAssistedPersonBody = z.infer<typeof updateAssistedPersonBodySchema>;

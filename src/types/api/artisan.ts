import type { z } from 'zod/v4';
import type {
  artisanParamsSchema,
  createArtisanBodySchema,
  updateArtisanBodySchema,
} from '../../schemas/artisan';

export type CreateArtisanBody = z.infer<typeof createArtisanBodySchema>;
export type UpdateArtisanBody = z.infer<typeof updateArtisanBodySchema>;
export type ArtisanParams = z.infer<typeof artisanParamsSchema>;

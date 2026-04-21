import type { z } from 'zod/v4';
import type { createArtisanBodySchema } from '../schemas/artisan';

export type CreateArtisanBody = z.infer<typeof createArtisanBodySchema>;

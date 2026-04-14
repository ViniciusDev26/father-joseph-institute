import type { z } from 'zod/v4';
import type { aboutContentSchema, siteContentSchema } from '../schemas/content';

export type AboutContent = z.infer<typeof aboutContentSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;

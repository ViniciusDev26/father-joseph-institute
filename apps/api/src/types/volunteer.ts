import type { z } from 'zod/v4';
import type { registerVolunteerBodySchema } from '../schemas/volunteer';

export type RegisterVolunteerBody = z.infer<typeof registerVolunteerBodySchema>;

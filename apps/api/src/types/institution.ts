import type { z } from 'zod/v4';
import type { updateInstitutionBodySchema } from '../schemas/institution';

export type UpdateInstitutionBody = z.infer<typeof updateInstitutionBodySchema>;

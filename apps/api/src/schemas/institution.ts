import { z } from 'zod/v4';

export const updateInstitutionBodySchema = z
  .object({
    instagram: z.string().max(255).optional(),
    whatsapp: z
      .string()
      .max(50)
      .regex(/^\d+$/, 'whatsapp must contain only digits')
      .optional(),
    pixKey: z.string().max(255).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export const institutionResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  instagram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  pixKey: z.string().nullable(),
});

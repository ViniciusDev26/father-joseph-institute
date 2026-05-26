import { z } from 'zod/v4';

export const updateInstitutionBodySchema = z
  .object({
    instagram: z.string().max(255).optional(),
    whatsapp: z.string().max(50).regex(/^\d+$/, 'whatsapp must contain only digits').optional(),
    pixKey: z.string().max(255).optional(),
    addressStreet: z.string().max(255).optional(),
    addressComplement: z.string().max(255).optional(),
    addressNeighborhood: z.string().max(255).optional(),
    addressCity: z.string().max(255).optional(),
    addressState: z.string().length(2).optional(),
    addressZip: z
      .string()
      .regex(/^\d{8}$/, 'addressZip must contain exactly 8 digits')
      .optional(),
  })
  .refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'At least one field must be provided',
  });

export const institutionResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  instagram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  pixKey: z.string().nullable(),
  addressStreet: z.string().nullable(),
  addressComplement: z.string().nullable(),
  addressNeighborhood: z.string().nullable(),
  addressCity: z.string().nullable(),
  addressState: z.string().nullable(),
  addressZip: z.string().nullable(),
});

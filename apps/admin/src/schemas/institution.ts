import { z } from 'zod';

export const institutionSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  instagram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  pixKey: z.string().nullable(),
});

export const updateInstitutionSchema = z.object({
  instagram: z.string().max(255).optional(),
  whatsapp: z
    .string()
    .regex(/^\d*$/, 'WhatsApp deve conter apenas dígitos')
    .max(50)
    .optional(),
  pixKey: z.string().max(255).optional(),
});

export type Institution = z.infer<typeof institutionSchema>;
export type UpdateInstitutionForm = z.infer<typeof updateInstitutionSchema>;

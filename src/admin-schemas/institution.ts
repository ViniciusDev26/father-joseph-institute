import { z } from 'zod';

export const institutionSchema = z.object({
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

export const updateInstitutionSchema = z.object({
  instagram: z.string().max(255).optional(),
  whatsapp: z.string().regex(/^\d*$/, 'WhatsApp deve conter apenas dígitos').max(50).optional(),
  pixKey: z.string().max(255).optional(),
  addressStreet: z.string().max(255).optional(),
  addressComplement: z.string().max(255).optional(),
  addressNeighborhood: z.string().max(255).optional(),
  addressCity: z.string().max(255).optional(),
  addressState: z
    .string()
    .length(2, 'Use a sigla do estado com 2 letras (ex: SP)')
    .optional()
    .or(z.literal('')),
  addressZip: z
    .string()
    .regex(/^\d{0,8}$/, 'CEP deve conter apenas dígitos')
    .optional(),
});

export type Institution = z.infer<typeof institutionSchema>;
export type UpdateInstitutionForm = z.infer<typeof updateInstitutionSchema>;

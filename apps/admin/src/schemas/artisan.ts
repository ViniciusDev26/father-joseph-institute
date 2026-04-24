import { z } from 'zod';

export const artisanSchema = z.object({
  id: z.number(),
  name: z.string(),
  photoUrl: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  description: z.string().nullable(),
});

export const listArtisansResponseSchema = z.object({
  artisans: z.array(artisanSchema),
});

export const createArtisanSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').max(255),
    phone: z
      .string()
      .regex(/^\d{11}$/, 'Telefone deve ter 11 dígitos')
      .or(z.literal(''))
      .optional(),
    email: z.string().email('E-mail inválido').or(z.literal('')).optional(),
    description: z.string().optional(),
  })
  .refine(data => (data.phone && data.phone.length > 0) || (data.email && data.email.length > 0), {
    message: 'Informe ao menos telefone ou e-mail',
    path: ['phone'],
  });

export type Artisan = z.infer<typeof artisanSchema>;
export type CreateArtisanForm = z.infer<typeof createArtisanSchema>;

import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

export const createArtisanBodySchema = z
  .object({
    name: z.string().max(255),
    photo: z.object({
      mimeType: mimeTypeSchema,
    }),
    phone: z
      .string()
      .regex(/^\d{11}$/, 'phone must contain exactly 11 digits')
      .optional(),
    email: z.email().optional(),
    description: z.string().optional(),
  })
  .refine(data => data.phone !== undefined || data.email !== undefined, {
    message: 'At least one of phone or email must be provided',
  });

export const createArtisanResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  photoUrl: z.string(),
  presignedUrl: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  description: z.string().nullable(),
});

const listArtisanItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  photoUrl: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  description: z.string().nullable(),
});

export const listArtisansResponseSchema = z.object({
  artisans: z.array(listArtisanItemSchema),
});

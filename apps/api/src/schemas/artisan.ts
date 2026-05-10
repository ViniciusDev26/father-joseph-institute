import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

export const artisanParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

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

const artisanItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  photoUrl: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  description: z.string().nullable(),
});

export const listArtisansResponseSchema = z.object({
  artisans: z.array(artisanItemSchema),
});

export const getArtisanResponseSchema = artisanItemSchema;

export const updateArtisanBodySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    phone: z
      .string()
      .regex(/^\d{11}$/, 'phone must contain exactly 11 digits')
      .nullable()
      .optional(),
    email: z.email().nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .refine(
    data =>
      data.name !== undefined ||
      data.phone !== undefined ||
      data.email !== undefined ||
      data.description !== undefined,
    { message: 'At least one of name, phone, email or description must be provided' },
  );

export const updateArtisanResponseSchema = artisanItemSchema;

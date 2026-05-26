import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

const photoInputSchema = z.object({
  mimeType: mimeTypeSchema,
});

export const productParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createProductBodySchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  artisanIds: z.array(z.number().int().positive()).min(1),
  photos: z.array(photoInputSchema).min(1),
});

export const updateProductBodySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    price: z.number().positive().optional(),
    artisanIds: z.array(z.number().int().positive()).min(1).optional(),
  })
  .refine(
    data =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.price !== undefined ||
      data.artisanIds !== undefined,
    { message: 'At least one of name, description, price or artisanIds must be provided' },
  );

const productPhotoResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  presignedUrl: z.string(),
});

const productArtisanSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createProductResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  photos: z.array(productPhotoResponseSchema),
  artisans: z.array(productArtisanSchema),
});

const listProductPhotoSchema = z.object({
  id: z.number(),
  url: z.string(),
});

const productItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  photos: z.array(listProductPhotoSchema),
  artisans: z.array(productArtisanSchema),
});

export const listProductsResponseSchema = z.object({
  products: z.array(productItemSchema),
});

export const getProductResponseSchema = productItemSchema;

export const updateProductResponseSchema = productItemSchema;

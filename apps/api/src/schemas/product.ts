import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

const photoInputSchema = z.object({
  mimeType: mimeTypeSchema,
});

export const createProductBodySchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  artisanIds: z.array(z.number().int().positive()).min(1),
  photos: z.array(photoInputSchema).min(1),
});

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

const listProductItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  photos: z.array(listProductPhotoSchema),
  artisans: z.array(productArtisanSchema),
});

export const listProductsResponseSchema = z.object({
  products: z.array(listProductItemSchema),
});

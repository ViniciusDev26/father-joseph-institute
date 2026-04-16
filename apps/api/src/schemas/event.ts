import { z } from 'zod/v4';

const photoInputSchema = z.object({
  name: z.string(),
  mimeType: z.enum(['image/png', 'image/jpeg']),
});

export const createEventBodySchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  date: z.iso
    .datetime({ local: false })
    .check(z.refine(val => new Date(val) >= new Date(), 'Date must not be in the past')),
  photos: z.array(photoInputSchema).min(1),
});

const photoResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  presignedUrl: z.string(),
});

export const createEventResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  date: z.string(),
  photos: z.array(photoResponseSchema),
});

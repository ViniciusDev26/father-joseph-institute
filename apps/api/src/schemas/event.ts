import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

const photoInputSchema = z.object({
  name: z.string(),
  mimeType: mimeTypeSchema,
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

const listEventPhotoSchema = z.object({
  id: z.number(),
  url: z.string(),
});

const listEventItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  date: z.string(),
  photos: z.array(listEventPhotoSchema),
});

export const listEventsResponseSchema = z.object({
  events: z.array(listEventItemSchema),
});

import { z } from 'zod/v4';
import { mimeTypeSchema } from './shared';

const photoInputSchema = z.object({
  name: z.string(),
  mimeType: mimeTypeSchema,
});

export const eventParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createEventBodySchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  date: z.iso
    .datetime({ local: false })
    .check(z.refine(val => new Date(val) >= new Date(), 'Date must not be in the past')),
  photos: z.array(photoInputSchema).min(1),
});

export const updateEventBodySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    date: z.iso.datetime({ local: false }).optional(),
  })
  .refine(
    data => data.name !== undefined || data.description !== undefined || data.date !== undefined,
    { message: 'At least one of name, description or date must be provided' },
  );

export const addEventPhotosBodySchema = z.object({
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

const eventPhotoSchema = z.object({
  id: z.number(),
  url: z.string(),
});

const eventItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  date: z.string(),
  photos: z.array(eventPhotoSchema),
});

export const listEventsResponseSchema = z.object({
  events: z.array(eventItemSchema),
});

export const getEventResponseSchema = eventItemSchema;

export const updateEventResponseSchema = eventItemSchema;

export const addEventPhotosResponseSchema = z.object({
  photos: z.array(photoResponseSchema),
});

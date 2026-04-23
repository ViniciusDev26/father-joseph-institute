import { z } from 'zod';

export const eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  date: z.string(),
  photos: z.array(z.object({ id: z.number(), url: z.string() })),
});

export const listEventsResponseSchema = z.object({
  events: z.array(eventSchema),
});

export const createEventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
});

export type Event = z.infer<typeof eventSchema>;
export type CreateEventForm = z.infer<typeof createEventSchema>;

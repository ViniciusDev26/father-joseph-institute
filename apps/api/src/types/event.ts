import type { z } from 'zod/v4';
import type {
  createEventBodySchema,
  createEventResponseSchema,
  listEventsResponseSchema,
} from '../schemas/event';

export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type CreateEventResponse = z.infer<typeof createEventResponseSchema>;
export type ListEventsResponse = z.infer<typeof listEventsResponseSchema>;

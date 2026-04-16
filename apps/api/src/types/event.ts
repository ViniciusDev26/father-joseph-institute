import type { z } from 'zod/v4';
import type { createEventBodySchema, createEventResponseSchema } from '../schemas/event';

export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type CreateEventResponse = z.infer<typeof createEventResponseSchema>;

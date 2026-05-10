import type { z } from 'zod/v4';
import type {
  addEventPhotosBodySchema,
  addEventPhotosResponseSchema,
  createEventBodySchema,
  createEventResponseSchema,
  eventParamsSchema,
  getEventResponseSchema,
  listEventsResponseSchema,
  updateEventBodySchema,
  updateEventResponseSchema,
} from '../schemas/event';

export type EventParams = z.infer<typeof eventParamsSchema>;
export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type CreateEventResponse = z.infer<typeof createEventResponseSchema>;
export type ListEventsResponse = z.infer<typeof listEventsResponseSchema>;
export type GetEventResponse = z.infer<typeof getEventResponseSchema>;
export type UpdateEventBody = z.infer<typeof updateEventBodySchema>;
export type UpdateEventResponse = z.infer<typeof updateEventResponseSchema>;
export type AddEventPhotosBody = z.infer<typeof addEventPhotosBodySchema>;
export type AddEventPhotosResponse = z.infer<typeof addEventPhotosResponseSchema>;

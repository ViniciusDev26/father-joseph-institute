import { z } from 'zod/v4';

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const timeRegex = /^\d{2}:\d{2}$/;

const availabilitySchema = z
  .object({
    days: z.enum(weekdays).array().min(1),
    startTime: z.string().regex(timeRegex, 'startTime must be in HH:MM format'),
    endTime: z.string().regex(timeRegex, 'endTime must be in HH:MM format'),
  })
  .refine(data => data.endTime > data.startTime, {
    message: 'endTime must be after startTime',
  });

export const listVolunteersResponseSchema = z.object({
  volunteers: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      profession: z.string(),
      availability: z.object({
        days: z.array(z.string()),
        startTime: z.string(),
        endTime: z.string(),
      }),
    }),
  ),
});

export const registerVolunteerBodySchema = z.object({
  name: z.string().max(255),
  profession: z.string().max(255),
  availability: availabilitySchema,
});

export const registerVolunteerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  profession: z.string(),
  availability: z.object({
    days: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
  }),
  whatsappUrl: z.string(),
});

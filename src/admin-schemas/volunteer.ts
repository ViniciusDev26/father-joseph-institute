import { z } from 'zod';

export const volunteerSchema = z.object({
  id: z.number(),
  name: z.string(),
  profession: z.string(),
  availability: z.object({
    days: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

export const listVolunteersResponseSchema = z.object({
  volunteers: z.array(volunteerSchema),
});

export type Volunteer = z.infer<typeof volunteerSchema>;

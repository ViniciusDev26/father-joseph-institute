import { z } from 'zod';

export const assistedPersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

export const listAssistedPeopleResponseSchema = z.object({
  assistedPeople: z.array(assistedPersonSchema),
});

export const assistedPersonFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo de 255 caracteres'),
  description: z.string().optional(),
});

export type AssistedPerson = z.infer<typeof assistedPersonSchema>;
export type AssistedPersonForm = z.infer<typeof assistedPersonFormSchema>;

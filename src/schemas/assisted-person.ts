import { z } from 'zod/v4';

export const assistedPersonParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const assistedPersonItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

export const listAssistedPeopleResponseSchema = z.object({
  assistedPeople: z.array(assistedPersonItemSchema),
});

export const getAssistedPersonResponseSchema = assistedPersonItemSchema;

export const createAssistedPersonBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const createAssistedPersonResponseSchema = assistedPersonItemSchema;

export const updateAssistedPersonBodySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
  })
  .refine(data => data.name !== undefined || data.description !== undefined, {
    message: 'At least one of name or description must be provided',
  });

export const updateAssistedPersonResponseSchema = assistedPersonItemSchema;

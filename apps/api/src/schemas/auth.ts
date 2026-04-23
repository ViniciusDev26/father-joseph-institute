import { z } from 'zod/v4';

export const validateAuthResponseSchema = z.object({
  valid: z.boolean(),
});

export const unauthorizedResponseSchema = z.object({
  message: z.string(),
});

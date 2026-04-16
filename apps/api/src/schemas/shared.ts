import { z } from 'zod/v4';

export const mimeTypeSchema = z.enum(['image/png', 'image/jpeg']);

export const errorResponseSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
});

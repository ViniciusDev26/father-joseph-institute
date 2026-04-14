import { z } from 'zod/v4';

const envSchema = z.object({
  API_URL: z.url().default('http://localhost:3001'),
});

export const env = envSchema.parse(process.env);

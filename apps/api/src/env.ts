import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.url(),
});

export const env = envSchema.parse(process.env);

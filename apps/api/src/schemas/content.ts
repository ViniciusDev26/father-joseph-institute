import { z } from 'zod/v4';

export const aboutContentSchema = z.object({
  hero: z.object({
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  mission: z.object({
    quote: z.string(),
  }),
  story: z.object({
    tag: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()),
    image: z.string(),
  }),
  values: z.object({
    tag: z.string(),
    title: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  impact: z.object({
    tag: z.string(),
    title: z.string(),
    stats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
  }),
  cta: z.object({
    tag: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

export const siteContentSchema = z.object({
  about: aboutContentSchema,
});

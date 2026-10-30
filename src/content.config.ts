import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        series: z.string().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        duration: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  }),
};

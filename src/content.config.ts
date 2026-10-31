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
        // 目录页 / 路线页的配置直接写在 MDX frontmatter 里
        route: z
          .object({
            tiers: z.array(z.any()),
            options: z.any().optional(),
            sidebar: z.any().optional(),
          })
          .optional(),
      }),
    }),
  }),
};

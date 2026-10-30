// 「全部技术路线」目录：4 个分组，只放路线顺序与分组，不含每条路线的分节数据。
// 各条路线的分节数据已经写在对应页面里（src/content/docs/tech-stack/<slug>.mdx）。
import type { RouteTier } from '@/data/model/route-model';

export const techCatalog: RouteTier[] = [
  {
    name: '编程语言',
    items: [
      'java',
      'python',
      'go',
      'rust',
      'javascript-typescript',
      'frontend',
      'c-cpp',
      'c-sharp',
      'kotlin-swift-dart',
    ].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '数据库',
    items: ['sql-database', 'mysql', 'postgresql', 'redis', 'mongodb', 'elasticsearch'].map(
      (slug) => ({ slug, kind: 'tech' as const }),
    ),
  },
  {
    name: '中间件',
    items: ['kafka', 'nginx'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '运维与云',
    items: ['docker', 'kubernetes'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
];

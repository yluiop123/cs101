// 路线相关的共享配置：
// - 各条路线自己的分节数据写在对应页面里（content/docs/tech-stack/<slug>.mdx / domain/<slug>.mdx）
// - 这里只剩「全部技术路线」目录（分组与顺序），供总览页和左侧栏使用

import { tierSlugs } from '@/data/model/route-model';
import { techCatalog } from '@/data/routes/tech-catalog';

/** 全部技术路线的 slug，按左侧栏顺序摊平（顺序取自 techCatalog 的分组） */
export const techRouteOrder: string[] = techCatalog.flatMap((tier) => tierSlugs(tier));

export { techCatalog };

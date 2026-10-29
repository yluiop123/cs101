// 路线数据汇总入口：把纯数据文件拼在一起，页面只从这里取数据。
// 类型与纯函数在 src/data/route-model.ts，单个数据文件在 src/data/routes/*.ts。

import { tierSlugs, type RouteTier } from '@/data/route-model';
import { domainRoutes } from '@/data/routes/domain';
import { techCatalog, techRoutes } from '@/data/routes/tech';

/** 全部路线：技术路线 + 领域路线（键 → 分节） */
export const routePlan: Record<string, RouteTier[]> = { ...techRoutes, ...domainRoutes };

/** 全部技术路线的 slug，按左侧栏顺序摊平（顺序取自 techCatalog 的分组） */
export const techRouteOrder: string[] = techCatalog.flatMap((tier) => tierSlugs(tier));

export { domainRoutes, techCatalog, techRoutes };
export { seriesMeta } from '@/data/routes/series-meta';

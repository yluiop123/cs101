// 路线类条目的构造器：kind 只有三种（tutorial / route / external），
// 入口统一由 href 明确给出，不再用 kind 区分 /tech-stack、/domain、/business-systems 等不同 URL。

import type { RouteItem } from '@/data/model/route-model';

/** 一条路线（技术路线 / 领域路线 / 专题页）：卡片标记「路线」 */
export const routeItem = (id: string, href: string, title?: string): RouteItem => ({
  id,
  kind: 'route',
  href,
  ...(title ? { title } : {}),
});

/** 技术路线：/tech-stack/<id>/ */
export const techRoute = (id: string, title?: string): RouteItem =>
  routeItem(id, `/tech-stack/${id}/`, title);

/** 领域路线：id 用 domain- 前缀做目录 key，入口是 /domain/<名字>/ */
export const domainRoute = (id: string, title?: string): RouteItem =>
  routeItem(`domain-${id}`, `/domain/${id}/`, title);

/** 专题页：/<id>/ */
export const pageRoute = (id: string, title?: string): RouteItem => routeItem(id, `/${id}/`, title);

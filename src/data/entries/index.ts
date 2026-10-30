// 入口页配置：首页 / 应用领域 / 业务系统。
//
// 三个页面都是「入口」，共用统一的路线模型（RouteTier[]）：
//   首页      → 12 个分类分节（homeCatalog）
//   应用领域  → 8 个分类分节（domainCatalog）
//   业务系统  → 14 个分类分节（businessSystems）
// 页面只从这里取数据，不直接 import 具体文件；具体目录内容在 entries/*.ts 维护。

export { homeCatalog } from '@/data/entries/home';
export { domainCatalog } from '@/data/entries/domains';
export { businessSystems } from '@/data/entries/business-systems';

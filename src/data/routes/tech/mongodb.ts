// 技术路线：mongodb

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 文档模型与 CRUD', items: ['mongodb', 'linux', 'docker'] },
    { name: '进阶 · 索引与聚合', items: ['sql', 'redis', 'dsa'] },
    { name: '精通 · 分布式与原理', items: ['os', 'network'] },
    { name: '实战与生态 · 应用与运维', items: ['node-backend', 'elasticsearch', 'kubernetes'] },
];

export default route;

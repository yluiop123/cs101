// 应用领域路线：domain-gis

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 前端与数据基础', items: ['javascript', 'html', 'css'] },
    { name: '进阶 · 空间数据与数据库', items: ['sql', 'postgresql', 'mongodb'] },
    { name: '精通 · 算法与系统', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['docker', 'nginx', 'node-backend'] },
];

export default route;

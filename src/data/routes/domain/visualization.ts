// 应用领域路线：domain-visualization

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 前端与数据', items: ['html', 'css', 'javascript'] },
    { name: '进阶 · 数据处理', items: ['data-science', 'sql', 'typescript'] },
    { name: '精通 · 算法与性能', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['node-backend', 'docker', 'nginx'] },
];

export default route;

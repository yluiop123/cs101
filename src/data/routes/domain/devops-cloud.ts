// 应用领域路线：domain-devops-cloud

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 系统与网络', items: ['linux', 'network'] },
    { name: '进阶 · 容器与编排', items: ['docker', 'kubernetes', 'nginx'] },
    { name: '精通 · 原理与语言', items: ['os', 'go', 'python'] },
    { name: '实战与生态 · 平台工程', items: ['security', 'prometheus', 'big-data'] },
];

export default route;

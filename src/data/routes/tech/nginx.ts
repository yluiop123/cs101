// 技术路线：nginx

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 安装与配置', items: ['nginx', 'linux', 'network'] },
    { name: '进阶 · 代理与负载均衡', items: ['docker', 'node-backend', 'nginx'] },
    { name: '精通 · 性能与安全', items: ['os', 'security'] },
    { name: '实战与生态 · 可观测与编排', items: ['prometheus', 'kubernetes', 'docker'] },
];

export default route;

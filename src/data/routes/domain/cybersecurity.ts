// 应用领域路线：domain-cybersecurity

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 基础与工具', items: ['linux', 'network', 'python'] },
    { name: '进阶 · 攻防技术', items: ['security', 'os', 'c'] },
    { name: '精通 · 逆向与底层', items: ['dsa', 'design-patterns'] },
    { name: '实战与生态 · 云与运维', items: ['docker', 'kubernetes', 'nginx', 'sql'] },
];

export default route;

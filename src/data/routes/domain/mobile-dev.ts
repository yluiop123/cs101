// 应用领域路线：domain-mobile-dev

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 语言与工具', items: ['javascript'] },
    { name: '进阶 · 跨端框架', items: ['flutter', 'react-native', 'typescript'] },
    { name: '精通 · 网络与架构', items: ['network', 'design-patterns', 'sql'] },
    { name: '实战与生态 · 质量与发布', items: ['testing', 'docker', 'nginx'] },
];

export default route;

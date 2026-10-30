// 应用领域路线：domain-data-engineering

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · SQL 与数据建模', items: ['sql', 'data-modeling', 'python'] },
    { name: '进阶 · 采集与传输', items: ['etl', 'kafka', 'flink'] },
    { name: '精通 · 数仓与计算引擎', items: ['data-warehouse', 'spark', 'big-data'] },
    { name: '实战与生态 · 平台与优化', items: ['docker', 'kubernetes', 'query-optimization'] },
];

export default route;

// 应用领域路线：domain-database-systems

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 关系型与 SQL', items: ['sql', 'mysql', 'postgresql'] },
    { name: '进阶 · 查询与建模', items: ['data-modeling', 'indexing', 'query-optimization', 'transactions'] },
    { name: '精通 · 内核与分布式', items: ['database-internals', 'replication', 'sharding', 'os'] },
    { name: '实战 · 多模存储与运维', items: ['redis', 'mongodb', 'elasticsearch', 'clickhouse', 'backup-recovery'] },
];

export default route;

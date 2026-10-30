// 应用领域路线：domain-big-data

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 基础与语言', items: ['sql', 'python', 'linux'] },
    { name: '进阶 · 存储与消息', items: ['mysql', 'redis', 'kafka', 'mongodb'] },
    { name: '精通 · 计算引擎与数仓', items: ['spark', 'flink', 'etl', 'data-warehouse'] },
    { name: '实战与生态 · 平台、分析与运维', items: ['docker', 'kubernetes', 'elasticsearch', 'bi', 'big-data'] },
];

export default route;

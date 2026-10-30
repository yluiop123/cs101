// 技术路线：go

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 语言与工具', items: ['go', 'go-modules'] },
    { name: '进阶 · 并发与泛型', items: ['go-concurrency', 'go-generics', 'go-testing'] },
    { name: '精通 · 网络与原理', items: ['go-network'] },
    { name: '实战与生态 · 服务与部署', items: ['grpc', 'go-microservices', 'go-deploy'] },
];

export default route;

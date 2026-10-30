// 技术路线：c-cpp

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · C 语言与编译基础', items: ['c', 'c-pointers', 'cmake'] },
    { name: '进阶 · C++ 核心与标准库', items: ['cpp', 'modern-cpp', 'stl', 'cpp-templates'] },
    { name: '精通 · 内存与底层', items: ['raii', 'cpp-debugging', 'systems-programming'] },
    { name: '实战与生态 · 跨平台', items: ['cross-platform'] },
];

export default route;

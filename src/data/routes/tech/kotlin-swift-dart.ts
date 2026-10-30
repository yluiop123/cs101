// 技术路线：kotlin-swift-dart

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 语言与平台', items: ['kotlin', 'swift', 'android-sdk'] },
    { name: '进阶 · 原生 UI 框架', items: ['jetpack-compose', 'swiftui'] },
    { name: '精通 · 架构与跨端', items: ['mobile-arch', 'flutter', 'react-native'] },
    { name: '实战 · 测试与发布', items: ['mobile-testing', 'mobile-release'] },
];

export default route;

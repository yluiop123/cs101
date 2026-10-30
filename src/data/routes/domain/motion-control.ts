// 应用领域路线：domain-motion-control

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 运动控制基础', items: ['servo-motion', 'plc-programming', 'ladder-logic'] },
    { name: '进阶 · 现场总线与协议', items: ['modbus', 'opc-ua', 'industrial-comms'] },
    { name: '精通 · 轨迹规划与算法', items: ['motion-planning', 'sensor-fusion', 'cpp'] },
    { name: '实战与生态 · 上位机与调试', items: ['csharp', 'realtime-chart', 'qt'] },
];

export default route;

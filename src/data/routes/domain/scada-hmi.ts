// 应用领域路线：domain-scada-hmi

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 组态与监控基础', items: ['hmi-design', 'scada', 'realtime-chart'] },
    { name: '进阶 · 数据与报警', items: ['report-export', 'opc-ua', 'modbus'] },
    { name: '精通 · 上位机开发', items: ['csharp', 'wpf', 'qt'] },
    { name: '实战与生态 · 系统集成', items: ['industrial-comms', 'plc-programming', 'docker'] },
];

export default route;

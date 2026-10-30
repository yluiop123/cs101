// 应用领域路线：domain-industrial-hmi

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 语言与界面基础', items: ['csharp', 'wpf', 'qt', 'python'] },
    { name: '进阶 · 工业通信协议', items: ['serial-port', 'tcp-udp', 'modbus', 'opc-ua', 'mqtt'] },
    { name: '精通 · PLC、组态与运动控制', items: ['plc-programming', 'ladder-logic', 'scada', 'hmi-design', 'servo-motion'] },
    { name: '实战与生态 · 采集、报表与部署', items: ['industrial-comms', 'realtime-chart', 'report-export', 'packaging', 'auto-update'] },
];

export default route;

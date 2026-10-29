// 应用领域目录：参照《编程教程网站技术分类体系》的「领域方向」8 大分类。
//
// 统一模型：和首页、技术路线一样是一个 RouteTier[]——一个分类 = 一个分节，一张卡片 = 一条领域路线
// （kind: 'domain'，slug 用 routePlan 里的 domain-<名字> 键）。
// 有 routePlan['domain-<slug>'] 的领域点进去是路线页；还没做的显示为虚线占位卡。

import type { RouteTier } from '@/data/route-plan';

const domain = (slug: string, title: string) =>
  ({ slug: `domain-${slug}`, kind: 'domain' as const, title });

export const domainCatalog: RouteTier[] = [
  {
    id: 'cat-client',
    name: '客户端与交互',
    items: [
      domain('web-saas', 'Web 开发 / SaaS 应用'),
      domain('mobile-dev', '移动应用开发'),
      domain('desktop-app', '桌面软件开发'),
      domain('mini-app', '小程序 / 快应用'),
      domain('rich-frontend', '富交互与游戏化前端'),
    ],
  },
  {
    id: 'cat-systems',
    name: '系统与底层',
    items: [
      domain('os-system', '操作系统与系统软件'),
      domain('embedded-iot', '嵌入式与 IoT'),
      domain('edge-computing', '边缘计算'),
      domain('drivers-firmware', '驱动与固件'),
      domain('realtime-systems', '实时系统'),
    ],
  },
  {
    id: 'cat-industrial',
    name: '工业控制与上位机',
    items: [
      domain('industrial-hmi', '上位机与 PLC'),
      domain('industrial-comms', '工业通信协议'),
      domain('scada-hmi', 'SCADA 与 HMI 组态'),
      domain('motion-control', '运动控制与伺服'),
      domain('cnc', 'CNC 与数控'),
      domain('industrial-vision', '工业视觉'),
      domain('instrument-control', '仪器控制与测试测量'),
      domain('industrial-lowcode', '工业组态与低代码工控平台'),
    ],
  },
  {
    id: 'cat-robotics',
    name: '机器人与物理系统',
    items: [
      domain('robotics', '机器人开发'),
      domain('robot-teaching', '机器人控制与示教'),
      domain('autonomous-driving', '自动驾驶'),
      domain('uav', '无人机'),
      domain('industrial-automation', '工业自动化'),
    ],
  },
  {
    id: 'cat-data-ai',
    name: '数据与智能',
    items: [
      domain('ai-ml', '人工智能与大模型应用'),
      domain('big-data', '数据分析与数据工程'),
      domain('data-engineering', '数据工程与数据管道'),
      domain('data-science', '数据科学'),
      domain('machine-learning', '机器学习与深度学习'),
      domain('cv-nlp-speech', 'CV / NLP / 语音'),
      domain('embodied-ai', '具身智能'),
    ],
  },
  {
    id: 'cat-graphics',
    name: '图形、多媒体与空间',
    items: [
      domain('visualization', '数据可视化与大屏'),
      domain('gis', 'GIS 与空间软件'),
      domain('media-streaming', '音视频与流媒体'),
      domain('game-vr-ar', '游戏开发与实时图形'),
      domain('graphics-rendering', '图形渲染'),
      domain('digital-twin', '数字孪生'),
    ],
  },
  {
    id: 'cat-platform',
    name: '基础设施与平台',
    items: [
      domain('devops-cloud', '云计算、云原生与 DevOps'),
      domain('cybersecurity', '网络安全与应用安全'),
      domain('blockchain-web3', '区块链与 Web3'),
      domain('database-systems', '数据库与存储系统'),
      domain('hpc', '高性能计算'),
    ],
  },
  {
    id: 'cat-other',
    name: '其他工程方向',
    items: [
      domain('scientific-computing', '科学计算与工程软件'),
      domain('software-engineering', '软件工程与质量工程'),
      domain('fintech', '金融科技与量化交易'),
      domain('lowcode', '低代码 / 无代码'),
      domain('xinchuang', '信创与国产化替代'),
      domain('xr-metaverse', 'XR / 元宇宙'),
    ],
  },
];

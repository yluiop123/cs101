// 应用领域目录：参照《编程教程网站技术分类体系》的「领域方向」8 大分类。
// 一张卡片 = 一个方向；有路线（routePlan['domain-<slug>']）的领域点进去是该方向的路线页，
// 还没做的领域不配路线，在 /domain/ 总览里显示为虚线占位卡。

export interface DomainCategory {
  id: string;
  name: string;
}

export interface DomainEntry {
  slug: string;
  name: string;
  category: string;
}

export const domainCategories: DomainCategory[] = [
  { id: 'client', name: '客户端与交互' },
  { id: 'systems', name: '系统与底层' },
  { id: 'industrial', name: '工业控制与上位机' },
  { id: 'robotics', name: '机器人与物理系统' },
  { id: 'data-ai', name: '数据与智能' },
  { id: 'graphics', name: '图形、多媒体与空间' },
  { id: 'platform', name: '基础设施与平台' },
  { id: 'other', name: '其他工程方向' },
];

export const domains: DomainEntry[] = [
  // 客户端与交互
  { slug: 'web-saas', name: 'Web 开发 / SaaS 应用', category: 'client' },
  { slug: 'mobile-dev', name: '移动应用开发', category: 'client' },
  { slug: 'desktop-app', name: '桌面软件开发', category: 'client' },
  { slug: 'mini-app', name: '小程序 / 快应用', category: 'client' },
  { slug: 'rich-frontend', name: '富交互与游戏化前端', category: 'client' },

  // 系统与底层
  { slug: 'os-system', name: '操作系统与系统软件', category: 'systems' },
  { slug: 'embedded-iot', name: '嵌入式与 IoT', category: 'systems' },
  { slug: 'edge-computing', name: '边缘计算', category: 'systems' },
  { slug: 'drivers-firmware', name: '驱动与固件', category: 'systems' },
  { slug: 'realtime-systems', name: '实时系统', category: 'systems' },

  // 工业控制与上位机
  { slug: 'industrial-hmi', name: '上位机与 PLC', category: 'industrial' },
  { slug: 'industrial-comms', name: '工业通信协议', category: 'industrial' },
  { slug: 'scada-hmi', name: 'SCADA 与 HMI 组态', category: 'industrial' },
  { slug: 'motion-control', name: '运动控制与伺服', category: 'industrial' },
  { slug: 'cnc', name: 'CNC 与数控', category: 'industrial' },
  { slug: 'industrial-vision', name: '工业视觉', category: 'industrial' },
  { slug: 'instrument-control', name: '仪器控制与测试测量', category: 'industrial' },
  { slug: 'industrial-lowcode', name: '工业组态与低代码工控平台', category: 'industrial' },

  // 机器人与物理系统
  { slug: 'robotics', name: '机器人开发', category: 'robotics' },
  { slug: 'robot-teaching', name: '机器人控制与示教', category: 'robotics' },
  { slug: 'autonomous-driving', name: '自动驾驶', category: 'robotics' },
  { slug: 'uav', name: '无人机', category: 'robotics' },
  { slug: 'industrial-automation', name: '工业自动化', category: 'robotics' },

  // 数据与智能
  { slug: 'ai-ml', name: '人工智能与大模型应用', category: 'data-ai' },
  { slug: 'big-data', name: '数据分析与数据工程', category: 'data-ai' },
  { slug: 'data-engineering', name: '数据工程与数据管道', category: 'data-ai' },
  { slug: 'data-science', name: '数据科学', category: 'data-ai' },
  { slug: 'machine-learning', name: '机器学习与深度学习', category: 'data-ai' },
  { slug: 'cv-nlp-speech', name: 'CV / NLP / 语音', category: 'data-ai' },
  { slug: 'embodied-ai', name: '具身智能', category: 'data-ai' },

  // 图形、多媒体与空间
  { slug: 'visualization', name: '数据可视化与大屏', category: 'graphics' },
  { slug: 'gis', name: 'GIS 与空间软件', category: 'graphics' },
  { slug: 'media-streaming', name: '音视频与流媒体', category: 'graphics' },
  { slug: 'game-vr-ar', name: '游戏开发与实时图形', category: 'graphics' },
  { slug: 'graphics-rendering', name: '图形渲染', category: 'graphics' },
  { slug: 'digital-twin', name: '数字孪生', category: 'graphics' },

  // 基础设施与平台
  { slug: 'devops-cloud', name: '云计算、云原生与 DevOps', category: 'platform' },
  { slug: 'cybersecurity', name: '网络安全与应用安全', category: 'platform' },
  { slug: 'blockchain-web3', name: '区块链与 Web3', category: 'platform' },
  { slug: 'database-systems', name: '数据库与存储系统', category: 'platform' },
  { slug: 'hpc', name: '高性能计算', category: 'platform' },

  // 其他工程方向
  { slug: 'scientific-computing', name: '科学计算与工程软件', category: 'other' },
  { slug: 'software-engineering', name: '软件工程与质量工程', category: 'other' },
  { slug: 'fintech', name: '金融科技与量化交易', category: 'other' },
  { slug: 'lowcode', name: '低代码 / 无代码', category: 'other' },
  { slug: 'xinchuang', name: '信创与国产化替代', category: 'other' },
  { slug: 'xr-metaverse', name: 'XR / 元宇宙', category: 'other' },
];

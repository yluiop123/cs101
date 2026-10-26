// 应用领域目录：参照《软件技术内容分类规划》的「软件技术领域」，按方向分类。
// 卡片指向 /domain/<slug>/ 路线页；顺序即领域页与左侧栏顺序。

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
  { id: 'product', name: '产品与应用开发' },
  { id: 'data-ai', name: 'AI、数据与空间软件' },
  { id: 'platform', name: '平台、基础设施与质量工程' },
  { id: 'industry', name: '行业与专题' },
];

export const domains: DomainEntry[] = [
  // 产品与应用开发
  { slug: 'web-saas', name: 'Web 开发 / SaaS 应用', category: 'product' },
  { slug: 'desktop-app', name: '桌面软件开发', category: 'product' },
  { slug: 'mobile-dev', name: '移动应用开发', category: 'product' },

  // AI、数据与空间软件
  { slug: 'ai-ml', name: '人工智能与大模型应用', category: 'data-ai' },
  { slug: 'big-data', name: '数据分析与数据工程', category: 'data-ai' },
  { slug: 'database-systems', name: '数据库与存储系统', category: 'data-ai' },
  { slug: 'gis', name: 'GIS 与空间软件', category: 'data-ai' },
  { slug: 'scientific-computing', name: '科学计算与工程软件', category: 'data-ai' },

  // 平台、基础设施与质量工程
  { slug: 'devops-cloud', name: '云计算、云原生与 DevOps', category: 'platform' },
  { slug: 'cybersecurity', name: '网络安全与应用安全', category: 'platform' },
  { slug: 'os-system', name: '操作系统与系统软件', category: 'platform' },
  { slug: 'software-engineering', name: '软件工程与质量工程', category: 'platform' },
  { slug: 'embedded-iot', name: '嵌入式软件与机器人软件', category: 'platform' },

  // 行业与专题
  { slug: 'fintech', name: '金融科技与量化交易', category: 'industry' },
  { slug: 'blockchain-web3', name: '区块链与 Web3', category: 'industry' },
  { slug: 'visualization', name: '数据可视化与大屏', category: 'industry' },
  { slug: 'game-vr-ar', name: '游戏开发与实时图形', category: 'industry' },
  { slug: 'media-streaming', name: '音视频与流媒体', category: 'industry' },
  { slug: 'industrial-hmi', name: '上位机与 PLC', category: 'industry' },
];

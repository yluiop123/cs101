// 应用领域目录：按方向分类，卡片指向 /domain/<slug>/ 路线页。
// 顺序即首页/领域页展示顺序，左侧栏同步使用。

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
  { id: 'client', name: '前端与客户端' },
  { id: 'data-ai', name: '数据与人工智能' },
  { id: 'infra', name: '基础设施与安全' },
  { id: 'industry', name: '行业与业务系统' },
];

export const domains: DomainEntry[] = [
  { slug: 'web-saas', name: 'Web 开发 / SaaS 应用', category: 'client' },
  { slug: 'mobile-dev', name: '移动开发', category: 'client' },
  { slug: 'visualization', name: '可视化技术路线', category: 'client' },
  { slug: 'game-vr-ar', name: '游戏开发 / VR / AR', category: 'client' },
  { slug: 'ai-ml', name: '人工智能 / 机器学习', category: 'data-ai' },
  { slug: 'big-data', name: '大数据 / 数据工程', category: 'data-ai' },
  { slug: 'gis', name: 'GIS 技术路线', category: 'data-ai' },
  { slug: 'devops-cloud', name: 'DevOps / 云计算 / 运维', category: 'infra' },
  { slug: 'cybersecurity', name: '网络安全', category: 'infra' },
  { slug: 'embedded-iot', name: '嵌入式 / IoT', category: 'infra' },
  { slug: 'software-testing', name: '软件测试 / QA', category: 'infra' },
  { slug: 'fintech', name: '金融科技 / 风控系统', category: 'industry' },
  { slug: 'enterprise-erp', name: '企业系统（ERP / CRM / OA）', category: 'industry' },
  { slug: 'blockchain-web3', name: '区块链 / Web3', category: 'industry' },
];

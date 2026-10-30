// 首页技术知识库：按《软件技术知识库·最终分类方案》的 12 个分类组织。
//
// 统一模型：首页 = 一条路线（RouteTier[]），一个分类 = 一个分节，一张卡片 = 一条路线（RouteItem）。
// 「点进去」的目标由 kind 决定：tutorial → /tutorials/<slug>/、tech → /tech-stack/<slug>/、
// domain → /domain/<slug>/、business → /business-systems/<slug>/、page → /<slug>/。
// 还没做的方向写 planned: true，渲染成虚线占位卡。

import type { RouteTier } from '@/data/model/route-model';

export const homeCatalog: RouteTier[] = [
  {
    id: 'basics',
    name: '计算机基础与通用技术',
    items: [
      { slug: 'computer-science', kind: 'page', title: '计算机科学基础' },
      { slug: 'dsa', title: '数据结构与算法' },
      { slug: 'network', title: '计算机网络' },
      { slug: 'os', title: '操作系统' },
      { slug: 'computing-organization', title: '计算机组成原理', planned: true },
      { slug: 'compiler-basics', title: '编译原理基础', planned: true },
      { slug: 'encoding-representation', title: '编码与数据表示', planned: true },
      { slug: 'regex', title: '正则表达式' },
    ],
  },
  {
    id: 'tools',
    name: '常用工具',
    items: [
      { slug: 'markdown', title: 'Markdown' },
      { slug: 'vscode', title: 'VS Code' },
      { slug: 'git', title: 'Git 与版本控制' },
      { slug: 'cli-terminal', title: '命令行与终端', planned: true },
      { slug: 'browser-devtools', title: '浏览器开发者工具', planned: true },
      { slug: 'api-debugging', title: 'API 调试工具', planned: true },
    ],
  },
  {
    id: 'infra-tools',
    name: '工程工具与基础设施',
    items: [
      { slug: 'linux', title: 'Linux 与开发环境' },
      { slug: 'shell-automation', title: 'Shell 与脚本自动化', planned: true },
      { slug: 'env-config', title: '环境变量与配置管理', planned: true },
      { slug: 'ssh-remote', title: 'SSH 与远程开发环境', planned: true },
      { slug: 'build-tooling', title: '编译、构建与打包工具', planned: true },
      { slug: 'package-management', title: '依赖管理与包管理基础', planned: true },
      { slug: 'ci-cd', title: 'CI/CD 与自动化发布', planned: true },
      { slug: 'infrastructure-as-code', title: '基础设施即代码', planned: true },
    ],
  },
  {
    id: 'ai',
    name: 'AI 工程与智能应用',
    items: [
      { slug: 'ml-dl-frameworks', title: '机器学习与深度学习框架', planned: true },
      { slug: 'llm-basics', title: '大语言模型基础与应用', planned: true },
      { slug: 'llm-app-dev', title: '大模型应用开发', planned: true },
      { slug: 'rag-knowledge-base', title: 'RAG 与知识库', planned: true },
      { slug: 'agent-workflow', title: 'Agent、工具调用与工作流', planned: true },
      { slug: 'llm-inference-deploy', title: '大模型推理与本地部署', planned: true },
      { slug: 'model-serving-optimization', title: '模型服务与推理优化', planned: true },
      { slug: 'ai-evaluation', title: 'AI 应用评估', planned: true },
      { slug: 'mlops', title: 'MLOps 与模型生命周期管理', planned: true },
    ],
  },
  {
    id: 'frontend',
    name: '大前端',
    items: [
      { slug: 'frontend', kind: 'tech', title: 'Web 前端' },
      { slug: 'kotlin-swift-dart', kind: 'tech', title: '移动端与跨端开发' },
      { slug: 'domain-desktop-app', kind: 'domain', title: '桌面端开发' },
      { slug: 'domain-visualization', kind: 'domain', title: '图形与数据可视化' },
      { slug: 'domain-gis', kind: 'domain', title: 'GIS 与地图开发' },
      { slug: 'frontend-engineering', title: '前端工程化', planned: true },
      { slug: 'content-platform', title: '内容平台与文档站点', planned: true },
    ],
  },
  {
    id: 'backend',
    name: '后端开发',
    items: [
      { slug: 'java', kind: 'tech', title: 'Java' },
      { slug: 'python', kind: 'tech', title: 'Python' },
      { slug: 'nodejs', title: 'Node.js' },
      { slug: 'go', kind: 'tech', title: 'Go' },
      { slug: 'rust', kind: 'tech', title: 'Rust' },
      { slug: 'c-cpp', kind: 'tech', title: 'C / C++' },
      { slug: 'c-sharp', kind: 'tech', title: 'C# 与 .NET' },
    ],
  },
  {
    id: 'architecture',
    name: '软件架构与设计',
    items: [
      { slug: 'design-patterns', title: '经典设计模式' },
      { slug: 'architecture-principles', title: '架构思想与设计原则', planned: true },
      { slug: 'architecture-styles', title: '系统架构风格', planned: true },
      { slug: 'ddd', title: '领域驱动设计（DDD）', planned: true },
      { slug: 'modular-layered', title: '模块化与分层架构', planned: true },
      { slug: 'distributed-design', title: '分布式系统设计', planned: true },
    ],
  },
  {
    id: 'middleware',
    name: '网络通信与微服务中间件',
    items: [
      { slug: 'network-api-design', title: '网络通信与 API 设计', planned: true },
      { slug: 'nginx', kind: 'tech', title: '流量网关与反向代理' },
      { slug: 'rpc-communication', title: 'RPC 与服务间通信', planned: true },
      { slug: 'service-discovery', title: '服务发现与配置中心', planned: true },
      { slug: 'kafka', kind: 'tech', title: '消息队列与事件总线' },
      { slug: 'fault-tolerance', title: '服务容错、限流与熔断', planned: true },
      { slug: 'distributed-transactions', title: '分布式事务与服务治理', planned: true },
    ],
  },
  {
    id: 'data',
    name: '数据存储与数据工程',
    items: [
      { slug: 'sql-database', kind: 'tech', title: '关系型与 NoSQL 数据库' },
      { slug: 'elasticsearch', kind: 'tech', title: '搜索与向量数据库' },
      { slug: 'redis', kind: 'tech', title: '缓存与内存存储' },
      { slug: 'domain-big-data', kind: 'domain', title: '大数据与分布式计算' },
      { slug: 'data-warehouse-lake', title: '数据仓库与数据湖', planned: true },
      { slug: 'domain-data-engineering', kind: 'domain', title: '数据管道、集成与编排' },
    ],
  },
  {
    id: 'cloud',
    name: '云计算、虚拟化与云原生',
    items: [
      { slug: 'cloud-platform-basics', title: '云计算基础与云平台', planned: true },
      { slug: 'virtualization', title: '虚拟化与私有云', planned: true },
      { slug: 'kubernetes', kind: 'tech', title: '容器技术与集群编排' },
      { slug: 'cloud-network-storage', title: '云网络与云存储', planned: true },
      { slug: 'domain-devops-cloud', kind: 'domain', title: '云原生应用部署' },
      { slug: 'observability', title: '可观测性与运维监控', planned: true },
    ],
  },
  {
    id: 'quality',
    name: '软件测试与质量工程',
    items: [
      { slug: 'unit-integration-testing', title: '单元与集成测试', planned: true },
      { slug: 'api-testing', title: 'API 测试', planned: true },
      { slug: 'automation-e2e', title: '自动化与端到端测试', planned: true },
      { slug: 'performance-testing', title: '性能与压力测试', planned: true },
      { slug: 'coverage-strategy', title: '测试覆盖率与测试策略', planned: true },
      { slug: 'code-quality-static', title: '代码质量与静态分析', planned: true },
      { slug: 'quality-metrics', title: '质量度量与质量门禁', planned: true },
    ],
  },
  {
    id: 'security',
    name: '软件安全',
    items: [
      { slug: 'web-app-security', title: 'Web 应用安全', planned: true },
      { slug: 'authn-authz', title: '身份认证与授权', planned: true },
      { slug: 'oauth-oidc', title: 'OAuth 2.0 与 OpenID Connect', planned: true },
      { slug: 'security-vulnerabilities', title: '常见安全漏洞与防护', planned: true },
      { slug: 'secure-coding', title: '安全编码', planned: true },
      { slug: 'secrets-management', title: '密钥与敏感信息管理', planned: true },
      { slug: 'supply-chain-security', title: '依赖漏洞与软件供应链安全', planned: true },
      { slug: 'security-scanning', title: '安全检测与扫描', planned: true },
    ],
  },
];

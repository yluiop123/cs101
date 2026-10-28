// 首页技术知识库：按《软件技术知识库·最终分类方案》的 12 个分类组织。
// 一个分类 = 首页一个分节（左侧栏按分类锚点跳转）；一张卡片 = 该分类下可直接进入的技术路线或专题页面。
// 不把一条技术路线内部的章节拆到首页；还没做的路线/专题不写 href，显示为虚线占位卡。

export interface HomeItem {
  title: string;
  /** 有 href = 可点击（学习路线页 / 教程页 / 领域路线页）；没有 = 规划中（虚线卡片） */
  href?: string;
}

export interface HomeCategory {
  /** 页内锚点，首页左侧栏也用它 */
  id: string;
  name: string;
  items: HomeItem[];
}

export const homeCategories: HomeCategory[] = [
  {
    id: 'basics',
    name: '计算机基础与通用技术',
    items: [
      { title: '计算机科学基础', href: '/computer-science/' },
      { title: '数据结构与算法', href: '/tutorials/dsa/' },
      { title: '计算机网络', href: '/tutorials/network/' },
      { title: '操作系统', href: '/tutorials/os/' },
      { title: '计算机组成原理' },
      { title: '编译原理基础' },
      { title: '编码与数据表示' },
      { title: '正则表达式', href: '/tutorials/regex/' },
    ],
  },
  {
    id: 'tools',
    name: '常用工具',
    items: [
      { title: 'Markdown', href: '/tutorials/markdown/' },
      { title: 'VS Code', href: '/tutorials/vscode/' },
      { title: 'Git 与版本控制', href: '/tutorials/git/' },
      { title: '命令行与终端' },
      { title: '浏览器开发者工具' },
      { title: 'API 调试工具' },
    ],
  },
  {
    id: 'infra-tools',
    name: '工程工具与基础设施',
    items: [
      { title: 'Linux 与开发环境', href: '/tutorials/linux/' },
      { title: 'Shell 与脚本自动化' },
      { title: '环境变量与配置管理' },
      { title: 'SSH 与远程开发环境' },
      { title: '编译、构建与打包工具' },
      { title: '依赖管理与包管理基础' },
      { title: 'CI/CD 与自动化发布' },
      { title: '基础设施即代码' },
    ],
  },
  {
    id: 'ai',
    name: 'AI 工程与智能应用',
    items: [
      { title: '机器学习与深度学习框架' },
      { title: '大语言模型基础与应用' },
      { title: '大模型应用开发' },
      { title: 'RAG 与知识库' },
      { title: 'Agent、工具调用与工作流' },
      { title: '大模型推理与本地部署' },
      { title: '模型服务与推理优化' },
      { title: 'AI 应用评估' },
      { title: 'MLOps 与模型生命周期管理' },
    ],
  },
  {
    id: 'frontend',
    name: '大前端',
    items: [
      { title: 'Web 前端', href: '/tech-stack/frontend/' },
      { title: '移动端与跨端开发', href: '/tech-stack/kotlin-swift-dart/' },
      { title: '桌面端开发', href: '/domain/desktop-app/' },
      { title: '图形与数据可视化', href: '/domain/visualization/' },
      { title: 'GIS 与地图开发', href: '/domain/gis/' },
      { title: '前端工程化' },
      { title: '内容平台与文档站点' },
    ],
  },
  {
    id: 'backend',
    name: '后端开发',
    items: [
      { title: 'Java', href: '/tech-stack/java/' },
      { title: 'Python', href: '/tech-stack/python/' },
      { title: 'Node.js', href: '/tutorials/nodejs/' },
      { title: 'Go', href: '/tech-stack/go/' },
      { title: 'Rust', href: '/tech-stack/rust/' },
      { title: 'C / C++', href: '/tech-stack/c-cpp/' },
      { title: 'C# 与 .NET', href: '/tech-stack/c-sharp/' },
    ],
  },
  {
    id: 'architecture',
    name: '软件架构与设计',
    items: [
      { title: '经典设计模式', href: '/tutorials/design-patterns/' },
      { title: '架构思想与设计原则' },
      { title: '系统架构风格' },
      { title: '领域驱动设计（DDD）' },
      { title: '模块化与分层架构' },
      { title: '分布式系统设计' },
    ],
  },
  {
    id: 'middleware',
    name: '网络通信与微服务中间件',
    items: [
      { title: '网络通信与 API 设计' },
      { title: '流量网关与反向代理', href: '/tech-stack/nginx/' },
      { title: 'RPC 与服务间通信' },
      { title: '服务发现与配置中心' },
      { title: '消息队列与事件总线', href: '/tech-stack/kafka/' },
      { title: '服务容错、限流与熔断' },
      { title: '分布式事务与服务治理' },
    ],
  },
  {
    id: 'data',
    name: '数据存储与数据工程',
    items: [
      { title: '关系型与 NoSQL 数据库', href: '/tech-stack/sql-database/' },
      { title: '搜索与向量数据库', href: '/tech-stack/elasticsearch/' },
      { title: '缓存与内存存储', href: '/tech-stack/redis/' },
      { title: '大数据与分布式计算', href: '/domain/big-data/' },
      { title: '数据仓库与数据湖' },
      { title: '数据管道、集成与编排', href: '/domain/data-engineering/' },
    ],
  },
  {
    id: 'cloud',
    name: '云计算、虚拟化与云原生',
    items: [
      { title: '云计算基础与云平台' },
      { title: '虚拟化与私有云' },
      { title: '容器技术与集群编排', href: '/tech-stack/kubernetes/' },
      { title: '云网络与云存储' },
      { title: '云原生应用部署', href: '/domain/devops-cloud/' },
      { title: '可观测性与运维监控' },
    ],
  },
  {
    id: 'quality',
    name: '软件测试与质量工程',
    items: [
      { title: '单元与集成测试' },
      { title: 'API 测试' },
      { title: '自动化与端到端测试' },
      { title: '性能与压力测试' },
      { title: '测试覆盖率与测试策略' },
      { title: '代码质量与静态分析' },
      { title: '质量度量与质量门禁' },
    ],
  },
  {
    id: 'security',
    name: '软件安全',
    items: [
      { title: 'Web 应用安全' },
      { title: '身份认证与授权' },
      { title: 'OAuth 2.0 与 OpenID Connect' },
      { title: '常见安全漏洞与防护' },
      { title: '安全编码' },
      { title: '密钥与敏感信息管理' },
      { title: '依赖漏洞与软件供应链安全' },
      { title: '安全检测与扫描' },
    ],
  },
];

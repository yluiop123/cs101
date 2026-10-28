// 首页分类目录：按《编程教程网站技术分类体系》的 9 大分类组织。
// 一个分类 = 首页一个分节（左侧栏按分类锚点跳转）；一张卡片 = 该分类下的方向/技术。
// 卡片点进去就是该方向的教程或学习路线；还没做的方向不写 href，显示为虚线占位卡。

export interface HomeItem {
  title: string;
  /** 有 href = 可点击（学习路线页 / 教程页）；没有 = 规划中（虚线卡片） */
  href?: string;
  /** 标题后的浅色说明，如「自动化测试 · 性能优化 · 图形与可视化」 */
  note?: string;
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
    name: '计算机基础与通用工具',
    items: [
      { title: '计算机科学基础', href: '/computer-science/' },
      { title: '数据结构与算法', href: '/tutorials/dsa/' },
      { title: '计算机网络', href: '/tutorials/network/' },
      { title: '操作系统', href: '/tutorials/os/' },
      { title: 'Markdown', href: '/tutorials/markdown/' },
      { title: '正则表达式', href: '/tutorials/regex/' },
      { title: 'VS Code', href: '/tutorials/vscode/' },
      { title: 'Git 与版本控制', href: '/tutorials/git/' },
      { title: '命令行与终端' },
    ],
  },
  {
    id: 'languages',
    name: '编程语言与运行时',
    items: [
      { title: 'Java', href: '/tech-stack/java/' },
      { title: 'Python', href: '/tech-stack/python/' },
      { title: 'Go', href: '/tech-stack/go/' },
      { title: 'Rust', href: '/tech-stack/rust/' },
      { title: 'JavaScript / TypeScript', href: '/tech-stack/javascript-typescript/' },
      { title: 'C# 与 .NET', href: '/tech-stack/c-sharp/' },
      { title: 'C / C++', href: '/tech-stack/c-cpp/' },
    ],
  },
  {
    id: 'frontend',
    name: '大前端',
    items: [
      { title: '前端', href: '/tech-stack/frontend/' },
      { title: '移动端与跨端', href: '/tech-stack/kotlin-swift-dart/' },
      { title: '桌面端', href: '/domain/desktop-app/' },
      { title: '内容平台' },
      { title: '进阶', note: '自动化测试 · 性能优化 · 图形与可视化' },
    ],
  },
  {
    id: 'architecture',
    name: '软件架构与设计',
    items: [
      { title: '经典设计模式', href: '/tutorials/design-patterns/' },
      { title: '架构思想与原则' },
      { title: '系统架构风格' },
    ],
  },
  {
    id: 'middleware',
    name: '网络通信与微服务中间件',
    items: [
      { title: '网络协议与接口风格' },
      { title: '流量网关与反向代理', href: '/tech-stack/nginx/' },
      { title: '服务发现与配置中心' },
      { title: '服务容错、限流与分布式事务' },
      { title: '消息队列与事件总线', href: '/tech-stack/kafka/' },
    ],
  },
  {
    id: 'cloud',
    name: '云计算、虚拟化与云原生',
    items: [
      { title: '云计算基础理论' },
      { title: '底层虚拟化与私有云' },
      { title: '分布式存储与网络' },
      { title: '容器技术与集群编排', href: '/tech-stack/kubernetes/' },
      { title: '基础设施即代码与 CI/CD', href: '/tech-stack/docker/' },
      { title: '可观测性与运维监控' },
    ],
  },
  {
    id: 'data',
    name: '数据存储与数据工程',
    items: [
      { title: '关系型与 NoSQL 数据库', href: '/tech-stack/sql-database/' },
      { title: '搜索与向量数据库', href: '/tech-stack/elasticsearch/' },
      { title: '大数据与数据工程' },
    ],
  },
  {
    id: 'ai',
    name: 'AI 工程与智能应用',
    items: [
      { title: '大模型全生命周期开发' },
      { title: '机器学习与深度学习框架' },
      { title: '大模型推理与本地部署' },
      { title: 'AI 工具、开发框架与工作流' },
      { title: 'MLOps' },
    ],
  },
  {
    id: 'quality',
    name: '软件测试与质量工程',
    items: [
      { title: '单元与集成测试' },
      { title: '自动化与 E2E 测试' },
      { title: '性能与压测' },
      { title: '代码质量与安全扫描' },
    ],
  },
];

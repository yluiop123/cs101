export type TutorialStatus = 'ready' | 'building' | 'planned'

export interface TutorialMeta {
  slug: string
  title: string
  description: string
  chapters: number
  status: TutorialStatus
}

export interface SeriesMeta {
  id: string
  title: string
  icon: string
  color: string
  description: string
  tutorials: TutorialMeta[]
}

export const tutorialSeries: SeriesMeta[] = [
  {
    id: 'prerequisites',
    title: '前置工具',
    icon: 'mdi-tools',
    color: '#d97706',
    description: '任何方向的起点：编辑器、版本控制与通用写作技能',
    tutorials: [
      { slug: 'vscode', title: 'VS Code 教程', description: '最流行的免费代码编辑器，从安装配置到效率技巧', chapters: 5, status: 'ready' },
      { slug: 'git', title: 'Git 教程', description: '分布式版本控制：三区模型、分支、远程协作与进阶技巧', chapters: 7, status: 'ready' },
      { slug: 'markdown', title: 'Markdown 教程', description: '轻量级标记语言，技术写作必备', chapters: 4, status: 'ready' },
      { slug: 'regex', title: '正则表达式教程', description: '文本匹配利器：元字符、分组与常见场景实战', chapters: 5, status: 'ready' },
    ],
  },
  {
    id: 'frontend',
    title: '前端',
    icon: 'mdi-language-html5',
    color: '#e44d26',
    description: '零基础到上手框架的完整主线：HTML → CSS → JS → Node → 框架',
    tutorials: [
      { slug: 'html', title: 'HTML 教程', description: '网页骨架：标签、表单、语义化与 HTML5', chapters: 10, status: 'ready' },
      { slug: 'css', title: 'CSS 教程', description: '页面样式：选择器、盒子模型、Flex/Grid 与响应式', chapters: 12, status: 'ready' },
      { slug: 'javascript', title: 'JavaScript 教程', description: '网页交互：语法核心、DOM、事件与异步编程', chapters: 14, status: 'ready' },
      { slug: 'nodejs', title: 'Node.js 与包管理教程', description: 'JavaScript 运行时 + npm/pnpm 依赖管理 + Express 服务端入门', chapters: 12, status: 'ready' },
      { slug: 'typescript', title: 'TypeScript 教程', description: '静态类型系统：接口、泛型与工程化配置', chapters: 10, status: 'ready' },
      { slug: 'tailwind', title: 'Tailwind CSS 教程', description: '原子化 CSS 框架：工具类体系、响应式与主题定制', chapters: 8, status: 'ready' },
      { slug: 'vite', title: 'Vite 教程', description: '下一代前端构建工具：DevServer、插件与构建优化', chapters: 6, status: 'ready' },
      { slug: 'vue', title: 'Vue 3 教程', description: '渐进式框架：组合式 API、组件化、路由与 Pinia', chapters: 12, status: 'ready' },
      { slug: 'react', title: 'React 教程', description: '声明式 UI：Hooks、组件通信、路由与状态管理', chapters: 12, status: 'ready' },
      { slug: 'angular', title: 'Angular 教程', description: '企业级框架：依赖注入、RxJS、路由与表单', chapters: 12, status: 'ready' },
    ],
  },
  {
    id: 'backend',
    title: '后端',
    icon: 'mdi-server',
    color: '#2563eb',
    description: '主流服务端语言与企业级框架',
    tutorials: [
      { slug: 'java', title: 'Java 教程', description: '面向对象、集合泛型、多线程与 JVM 入门', chapters: 15, status: 'planned' },
      { slug: 'python', title: 'Python 教程', description: '语法、面向对象、标准库与虚拟环境', chapters: 12, status: 'planned' },
      { slug: 'go', title: 'Go 教程', description: '语法、接口与 goroutine 并发编程', chapters: 10, status: 'planned' },
      { slug: 'spring-boot', title: 'Spring Boot 教程', description: 'IoC/AOP、数据访问、鉴权与企业级实战', chapters: 15, status: 'planned' },
      { slug: 'django', title: 'Django 教程', description: 'MTV 架构、ORM、Admin 与 DRF', chapters: 10, status: 'planned' },
    ],
  },
  {
    id: 'database',
    title: '数据库',
    icon: 'mdi-database',
    color: '#336791',
    description: '关系型与非关系型数据库从入门到进阶',
    tutorials: [
      { slug: 'sql', title: 'SQL 基础教程', description: '查询语言基础：增删改查、聚合与多表连接', chapters: 8, status: 'planned' },
      { slug: 'mysql', title: 'MySQL 教程', description: '最流行的开源数据库：SQL、索引与事务', chapters: 10, status: 'planned' },
      { slug: 'redis', title: 'Redis 教程', description: '内存缓存：五大数据类型与持久化', chapters: 8, status: 'planned' },
      { slug: 'mongodb', title: 'MongoDB 教程', description: '文档型 NoSQL 数据库入门', chapters: 6, status: 'planned' },
    ],
  },
  {
    id: 'ops',
    title: '运维与云',
    icon: 'mdi-kubernetes',
    color: '#0ea5e9',
    description: '服务器管理与容器化部署',
    tutorials: [
      { slug: 'linux', title: 'Linux 教程', description: '常用命令、文件系统、Shell 与服务管理', chapters: 10, status: 'planned' },
      { slug: 'docker', title: 'Docker 教程', description: '容器化：镜像、容器、网络与编排', chapters: 8, status: 'planned' },
    ],
  },
  {
    id: 'cs',
    title: '计算机基础',
    icon: 'mdi-monitor',
    color: '#4b5563',
    description: '程序员的内功心法',
    tutorials: [
      { slug: 'network', title: '计算机网络教程', description: 'TCP/IP、HTTP/HTTPS、DNS 与抓包实战', chapters: 10, status: 'planned' },
      { slug: 'dsa', title: '数据结构与算法教程', description: '数组链表、树图、排序搜索与复杂度分析', chapters: 12, status: 'planned' },
      { slug: 'design-patterns', title: '设计模式教程', description: '23 种 GoF 设计模式与实战应用', chapters: 8, status: 'planned' },
      { slug: 'os', title: '操作系统教程', description: '进程线程、内存管理、IO 与并发', chapters: 10, status: 'planned' },
    ],
  },
  {
    id: 'ai',
    title: 'AI 与数据科学',
    icon: 'mdi-brain',
    color: '#9333ea',
    description: '从数据处理到机器学习',
    tutorials: [
      { slug: 'data-science', title: 'Python 数据科学教程', description: 'NumPy、Pandas 与 Matplotlib 数据分析', chapters: 10, status: 'planned' },
      { slug: 'machine-learning', title: '机器学习入门教程', description: '监督学习、模型评估与 scikit-learn 实战', chapters: 10, status: 'planned' },
      { slug: 'deep-learning', title: '深度学习教程', description: '神经网络、PyTorch 与视觉/NLP 入门', chapters: 10, status: 'planned' },
    ],
  },
  {
    id: 'mobile',
    title: '移动开发',
    icon: 'mdi-cellphone',
    color: '#16a34a',
    description: '跨平台移动应用开发',
    tutorials: [
      { slug: 'flutter', title: 'Flutter 教程', description: 'Dart 语言、Widget 体系与跨端实战', chapters: 10, status: 'planned' },
      { slug: 'react-native', title: 'React Native 教程', description: '用 React 构建原生移动应用', chapters: 8, status: 'planned' },
    ],
  },
]

export const statusLabel: Record<TutorialStatus, string> = {
  ready: '可学习',
  building: '编写中',
  planned: '规划中',
}

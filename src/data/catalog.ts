// 首页教程目录：工具与基础、大前端、各编程语言、数据库 / 中间件 / 运维与云 同级成组。
// slug 对应 src/content/docs/tutorials/<slug>；有内容自动点亮，没有内容显示「敬请期待」。
// 数组顺序即首页分组顺序，左侧栏同步使用。

export interface CatalogTutorial {
  /** 教程系列 slug（尚未写成也先占位，写好即自动点亮） */
  slug: string;
  title: string;
}

export interface CatalogGroup {
  /** 页内锚点 id（首页分组 → #<id>） */
  id: string;
  name: string;
  /** 该分组对应的学习路线页（/tech-stack/<slug>/），显示在分组标题右侧 */
  roadmap?: string;
  tutorials: CatalogTutorial[];
}

export const homeSections: CatalogGroup[] = [
  {
    id: 'basics',
    name: '工具与基础',
    tutorials: [
      { slug: 'vscode', title: 'VS Code 教程' },
      { slug: 'git', title: 'Git 教程' },
      { slug: 'markdown', title: 'Markdown 教程' },
      { slug: 'regex', title: '正则表达式教程' },
      { slug: 'design-patterns', title: '设计模式教程' },
      { slug: 'dsa', title: '数据结构与算法教程' },
      { slug: 'network', title: '计算机网络教程' },
      { slug: 'os', title: '操作系统教程' },
    ],
  },
  {
    id: 'frontend',
    name: '大前端',
    roadmap: '/tech-stack/frontend/',
    tutorials: [
      { slug: 'html', title: 'HTML 教程' },
      { slug: 'css', title: 'CSS 教程' },
      { slug: 'javascript', title: 'JavaScript 教程' },
      { slug: 'typescript', title: 'TypeScript 教程' },
      { slug: 'tailwind', title: 'Tailwind CSS 教程' },
      { slug: 'vue', title: 'Vue 3 教程' },
      { slug: 'react', title: 'React 教程' },
      { slug: 'angular', title: 'Angular 教程' },
      { slug: 'vite', title: 'Vite 教程' },
      { slug: 'nodejs', title: 'Node.js 与包管理教程' },
      { slug: 'node-backend', title: 'Node.js 后端教程' },
      { slug: 'flutter', title: 'Flutter 教程' },
      { slug: 'react-native', title: 'React Native 教程' },
    ],
  },
  {
    id: 'java',
    name: 'Java',
    roadmap: '/tech-stack/java/',
    tutorials: [
      { slug: 'java', title: 'Java 教程' },
      { slug: 'spring-boot', title: 'Spring Boot 教程' },
      { slug: 'spring-data', title: 'Spring Data 教程' },
      { slug: 'mybatis', title: 'MyBatis 教程' },
      { slug: 'maven', title: 'Maven 教程' },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    roadmap: '/tech-stack/python/',
    tutorials: [
      { slug: 'python', title: 'Python 教程' },
      { slug: 'django', title: 'Django 教程' },
      { slug: 'fastapi', title: 'FastAPI 教程' },
      { slug: 'data-science', title: 'Python 数据科学教程' },
      { slug: 'machine-learning', title: '机器学习教程' },
    ],
  },
  {
    id: 'go',
    name: 'Go',
    roadmap: '/tech-stack/go/',
    tutorials: [
      { slug: 'go', title: 'Go 教程' },
      { slug: 'grpc', title: 'gRPC 教程' },
    ],
  },
  {
    id: 'rust',
    name: 'Rust',
    roadmap: '/tech-stack/rust/',
    tutorials: [
      { slug: 'rust', title: 'Rust 教程' },
      { slug: 'webassembly', title: 'WebAssembly 教程' },
    ],
  },
  {
    id: 'c-cpp',
    name: 'C / C++',
    roadmap: '/tech-stack/c-cpp/',
    tutorials: [
      { slug: 'c', title: 'C 语言教程' },
      { slug: 'cpp', title: 'C++ 教程' },
    ],
  },
  {
    id: 'c-sharp',
    name: 'C#',
    roadmap: '/tech-stack/c-sharp/',
    tutorials: [
      { slug: 'csharp', title: 'C# 教程' },
      { slug: 'aspnet', title: 'ASP.NET Core 教程' },
    ],
  },
  {
    id: 'database',
    name: '数据库',
    roadmap: '/tech-stack/sql-database/',
    tutorials: [
      { slug: 'sql', title: 'SQL 基础教程' },
      { slug: 'mysql', title: 'MySQL 教程' },
      { slug: 'postgresql', title: 'PostgreSQL 教程' },
      { slug: 'redis', title: 'Redis 教程' },
      { slug: 'mongodb', title: 'MongoDB 教程' },
      { slug: 'elasticsearch', title: 'Elasticsearch 教程' },
    ],
  },
  {
    id: 'middleware',
    name: '中间件',
    roadmap: '/tech-stack/kafka/',
    tutorials: [
      { slug: 'kafka', title: 'Kafka 与消息队列教程' },
      { slug: 'nginx', title: 'Nginx 教程' },
    ],
  },
  {
    id: 'ops',
    name: 'DevOps',
    roadmap: '/tech-stack/docker/',
    tutorials: [
      { slug: 'linux', title: 'Linux 教程' },
      { slug: 'docker', title: 'Docker 教程' },
      { slug: 'kubernetes', title: 'Kubernetes 教程' },
    ],
  },
];

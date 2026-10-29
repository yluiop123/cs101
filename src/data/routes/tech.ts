// 19 条技术路线的板块（RouteTier[]）+「全部技术路线」目录。
// 纯数据文件：只放配置，类型与逻辑在 src/data/route-model.ts。

import type { RouteTier } from '@/data/route-model';

export const techRoutes: Record<string, RouteTier[]> = {
  'java': [
    { name: '入门 · 语言与工具', items: ['java', 'maven', 'gradle'] },
    { name: '进阶 · 核心机制', items: ['collections', 'concurrency', 'rest-api', 'junit'] },
    { name: '精通 · 虚拟机与原理', items: ['jvm', 'logging'] },
    { name: '实战与生态 · 框架与架构', items: ['spring-boot', 'spring-data', 'mybatis', 'spring-cloud', 'microservices'] },
  ],
  'python': [
    { name: '入门 · 语言与工具', items: ['python', 'python-typing', 'packaging'] },
    { name: '进阶 · 数据处理', items: ['numpy', 'pandas', 'data-science'] },
    { name: '精通 · 工程化与性能', items: ['automation', 'cli', 'scraping', 'pytest', 'profiling'] },
    { name: '实战与生态 · Web 与 AI', items: ['django', 'fastapi', 'flask', 'machine-learning'] },
  ],
  'go': [
    { name: '入门 · 语言与工具', items: ['go', 'go-modules'] },
    { name: '进阶 · 并发与泛型', items: ['go-concurrency', 'go-generics', 'go-testing'] },
    { name: '精通 · 网络与原理', items: ['go-network'] },
    { name: '实战与生态 · 服务与部署', items: ['grpc', 'go-microservices', 'go-deploy'] },
  ],
  'rust': [
    { name: '入门 · 语言与工具', items: ['rust', 'rust-cli'] },
    { name: '进阶 · 所有权与测试', items: ['rust-ownership', 'rust-testing'] },
    { name: '精通 · 异步与底层', items: ['rust-async', 'rust-macros', 'rust-ffi', 'rust-network'] },
    { name: '实战与生态 · 拓展', items: ['webassembly'] },
  ],
  'c-cpp': [
    { name: '入门 · C 语言与编译基础', items: ['c', 'c-pointers', 'cmake'] },
    { name: '进阶 · C++ 核心与标准库', items: ['cpp', 'modern-cpp', 'stl', 'cpp-templates'] },
    { name: '精通 · 内存与底层', items: ['raii', 'cpp-debugging', 'systems-programming'] },
    { name: '实战与生态 · 跨平台', items: ['cross-platform'] },
  ],
  'c-sharp': [
    { name: '入门 · 语言与工具', items: ['csharp', 'dotnet'] },
    { name: '进阶 · 类型系统与数据', items: ['linq', 'csharp-async', 'di'] },
    { name: '精通 · 框架与架构', items: ['ef-core'] },
    { name: '实战与生态 · .NET 与上位机', items: ['aspnet', 'wpf', 'maui', 'industrial-comms'] },
  ],
  'kotlin-swift-dart': [
    { name: '入门 · 语言与平台', items: ['kotlin', 'swift', 'android-sdk'] },
    { name: '进阶 · 原生 UI 框架', items: ['jetpack-compose', 'swiftui'] },
    { name: '精通 · 架构与跨端', items: ['mobile-arch', 'flutter', 'react-native'] },
    { name: '实战 · 测试与发布', items: ['mobile-testing', 'mobile-release'] },
  ],
  'javascript-typescript': [
    { name: '入门 · 语言与工具', items: ['javascript', 'typescript', 'markdown', 'regex'] },
    { name: '进阶 · 现代前端', items: ['dom', 'state-management', 'vue-router', 'component-library', 'html', 'css'] },
    { name: '精通 · 运行时与性能', items: ['nodejs', 'nextjs', 'nuxt', 'astro', 'perf-web', 'a11y'] },
    { name: '实战与生态 · 框架与测试', items: ['vue', 'react', 'angular', 'svelte', 'vite', 'vitest', 'playwright', 'docker'] },
  ],
  'frontend': [
    { name: 'Web 公共基础', required: true, items: ['html', 'css', 'javascript', 'typescript', 'dom', 'tailwind'] },
    {
      name: '框架选型',
      kind: 'choice',
      note: '五个框架任选其一即可，每个框架下是一系列配套教程；学完再继续下面的公共模块。React 生态与岗位需求最大，Vue / Angular 同样常用，Svelte / Solid 生态较小、适合按兴趣尝试或团队已有积累时选择。',
      items: [],
      options: [
        { name: 'React', role: 'recommended', items: ['react', 'react-router', 'react-state', 'ant-design', 'nextjs'] },
        { name: 'Vue', role: 'popular', items: ['vue', 'vue-router', 'pinia', 'element-plus', 'nuxt'] },
        { name: 'Angular', role: 'popular', items: ['angular', 'rxjs', 'ngrx', 'angular-material'] },
        { name: 'Svelte', role: 'niche', items: ['svelte'] },
        { name: 'Solid', role: 'niche', items: ['solid'] },
      ],
    },
    { name: '前端工程化与质量', required: true, items: ['frontend-bundler', 'eslint', 'vitest', 'playwright', 'a11y', 'i18n', 'perf-web'] },
    { name: '全栈与服务端', items: ['nodejs', 'rest-api', 'express', 'nestjs', 'bun', 'deno'] },
    { name: '桌面端开发', items: ['electron', 'tauri'] },
    { name: '跨端与小程序', items: ['flutter', 'react-native', 'uniapp'] },
    { name: '原生移动开发', items: ['kotlin', 'android-sdk', 'jetpack-compose', 'swift', 'swiftui'] },
    { name: '文档站点与静态站点生成', items: ['vitepress', 'docusaurus', 'starlight', 'astro'] },
  ],
  'sql-database': [
    { name: '入门 · SQL 与环境', items: ['sql', 'mysql', 'postgresql'] },
    { name: '进阶 · 查询与建模', items: ['transactions', 'indexing', 'query-optimization', 'data-modeling'] },
    { name: '精通 · 多模与调优', items: ['sql-server', 'sqlite', 'oracle', 'redis', 'mongodb', 'elasticsearch'] },
    { name: '实战 · 分析与多模存储', items: ['clickhouse', 'tsdb', 'neo4j', 'vector-db'] },
  ],
  mysql: [
    { name: '入门 · 关系型与 SQL', items: ['sql', 'mysql', 'linux'] },
    { name: '进阶 · 索引与事务', items: ['postgresql', 'redis', 'dsa'] },
    { name: '精通 · 存储引擎与优化', items: ['os', 'network'] },
    { name: '实战与生态 · 高可用与生态', items: ['mongodb', 'elasticsearch', 'kafka', 'docker', 'big-data'] },
  ],
  postgresql: [
    { name: '入门 · 关系型与 SQL', items: ['sql', 'postgresql', 'linux'] },
    { name: '进阶 · 索引与事务', items: ['mysql', 'redis', 'dsa'] },
    { name: '精通 · 内核与性能', items: ['os', 'network'] },
    { name: '实战与生态 · 部署与分析', items: ['docker', 'elasticsearch', 'big-data'] },
  ],
  redis: [
    { name: '入门 · 数据类型与使用', items: ['redis', 'linux', 'docker'] },
    { name: '进阶 · 缓存与数据结构', items: ['dsa', 'sql', 'mysql'] },
    { name: '精通 · 持久化与高可用', items: ['os', 'network'] },
    { name: '实战与生态 · 场景与运维', items: ['kafka', 'mongodb', 'kubernetes'] },
  ],
  mongodb: [
    { name: '入门 · 文档模型与 CRUD', items: ['mongodb', 'linux', 'docker'] },
    { name: '进阶 · 索引与聚合', items: ['sql', 'redis', 'dsa'] },
    { name: '精通 · 分布式与原理', items: ['os', 'network'] },
    { name: '实战与生态 · 应用与运维', items: ['node-backend', 'elasticsearch', 'kubernetes'] },
  ],
  elasticsearch: [
    { name: '入门 · 核心概念与查询', items: ['elasticsearch', 'linux', 'docker'] },
    { name: '进阶 · 索引与文本', items: ['dsa', 'mongodb', 'redis'] },
    { name: '精通 · 分布式与性能', items: ['os', 'network'] },
    { name: '实战与生态 · 集群与生态', items: ['kafka', 'big-data', 'kubernetes'] },
  ],
  'kafka': [
    { name: '入门 · 消息队列基础', items: ['kafka', 'rabbitmq', 'rocketmq'] },
    { name: '进阶 · 网关与服务发现', items: ['nginx', 'api-gateway', 'nacos'] },
    { name: '精通 · 协调与一致性', items: ['zookeeper'] },
  ],
  nginx: [
    { name: '入门 · 安装与配置', items: ['nginx', 'linux', 'network'] },
    { name: '进阶 · 代理与负载均衡', items: ['docker', 'node-backend', 'nginx'] },
    { name: '精通 · 性能与安全', items: ['os', 'security'] },
    { name: '实战与生态 · 可观测与编排', items: ['prometheus', 'kubernetes', 'docker'] },
  ],
  'docker': [
    { name: '入门 · 工程工具与环境', items: ['linux', 'shell', 'build-tools', 'code-quality', 'test-tools'] },
    { name: '进阶 · 容器化', items: ['docker-compose', 'kubernetes'] },
    { name: '精通 · 持续交付与基础设施即代码', items: ['ci-cd', 'jenkins', 'gitlab-ci', 'github-actions', 'terraform', 'ansible', 'argocd'] },
    { name: '实战 · 可观测与云服务', items: ['prometheus', 'grafana', 'cloud-basics', 'security'] },
  ],
  kubernetes: [
    { name: '入门 · 架构与基本对象', items: ['kubernetes', 'docker', 'linux'] },
    { name: '进阶 · 网络与存储', items: ['network', 'nginx', 'redis'] },
    { name: '精通 · 调度与扩展', items: ['os', 'design-patterns'] },
    { name: '实战与生态 · 可观测与治理', items: ['prometheus', 'security', 'big-data'] },
  ],
};

export const techCatalog: RouteTier[] = [
  {
    name: '编程语言',
    items: [
      'java',
      'python',
      'go',
      'rust',
      'javascript-typescript',
      'frontend',
      'c-cpp',
      'c-sharp',
      'kotlin-swift-dart',
    ].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '数据库',
    items: ['sql-database', 'mysql', 'postgresql', 'redis', 'mongodb', 'elasticsearch'].map(
      (slug) => ({ slug, kind: 'tech' as const }),
    ),
  },
  {
    name: '中间件',
    items: ['kafka', 'nginx'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '运维与云',
    items: ['docker', 'kubernetes'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
];

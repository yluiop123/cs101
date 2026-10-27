// 路线规划表：每条路线由哪些教程系列组成，一张卡 = 一个系列。
// 系列已有站内教程 → 卡片可点进 /tutorials/<slug>/；尚未写成 → 置灰。
// tutorial-index.ts 由 scripts/gen-tutorial-index.mjs 从 docs/tutorials/** 生成，写完即自动点亮。

export const seriesMeta: Record<string, string> = {
  java: 'Java 教程', python: 'Python 教程', go: 'Go 教程', rust: 'Rust 教程',
  c: 'C 语言教程', cpp: 'C++ 教程', csharp: 'C# 教程',
  javascript: 'JavaScript 教程', typescript: 'TypeScript 教程',
  html: 'HTML 教程', css: 'CSS 教程', tailwind: 'Tailwind CSS 教程', vite: 'Vite 教程',
  vue: 'Vue 3 教程', react: 'React 教程', angular: 'Angular 教程',
  nodejs: 'Node.js 与包管理教程', 'node-backend': 'Node.js 后端教程',
  vscode: 'VS Code 教程', git: 'Git 教程', markdown: 'Markdown 教程', regex: '正则表达式教程',
  sql: 'SQL 基础教程', mysql: 'MySQL 教程', postgresql: 'PostgreSQL 教程',
  redis: 'Redis 教程', mongodb: 'MongoDB 教程', elasticsearch: 'Elasticsearch 教程',
  'spring-boot': 'Spring Boot 教程', mybatis: 'MyBatis 教程', jvm: 'JVM 原理与调优教程',
  maven: 'Maven 教程',
  'spring-cloud': 'Spring Cloud 微服务教程', django: 'Django 教程', fastapi: 'FastAPI 教程',
  aspnet: 'ASP.NET Core 教程',
  linux: 'Linux 教程', docker: 'Docker 教程', kubernetes: 'Kubernetes 教程',
  nginx: 'Nginx 教程', kafka: 'Kafka 与消息队列教程',
  network: '计算机网络教程', dsa: '数据结构与算法教程', os: '操作系统教程',
  'design-patterns': '设计模式教程',
  'data-science': 'Python 数据科学教程', 'machine-learning': '机器学习教程',
  'deep-learning': '深度学习教程',
  flutter: 'Flutter 教程', 'react-native': 'React Native 教程',
  security: '网络安全教程', 'big-data': '大数据教程', embedded: '嵌入式开发教程',
  'game-dev': '游戏开发教程', testing: '软件测试教程', blockchain: '区块链开发教程',
  quant: '量化金融教程',
  prometheus: 'Prometheus 与可观测性教程', grpc: 'gRPC 教程', webassembly: 'WebAssembly 教程',
  // 工程工具与基础
  github: 'GitHub / GitLab 协作教程', jetbrains: 'JetBrains IDE 教程', shell: 'Shell 脚本教程',
  terminal: '终端与环境配置', 'build-tools': '构建工具（Make / CMake）', 'code-quality': '代码质量与静态分析',
  'test-tools': '测试工具与框架', 'ci-cd': 'CI/CD 与自动化',
  // 大前端
  'api-testing': 'API 测试', 'perf-testing': '性能测试',
  express: 'Express 教程', nestjs: 'NestJS 教程',
  'frontend-bundler': '构建工具（Vite / Webpack）',
  vitepress: 'VitePress 文档站', docusaurus: 'Docusaurus 文档站', starlight: 'Starlight 文档站',
  'mini-program': '微信小程序开发', uniapp: 'uni-app 跨端开发',
  'react-router': 'React Router 路由', 'react-state': 'React 状态管理',
  'react-testing': 'React 组件测试', 'ant-design': 'Ant Design 组件库',
  pinia: 'Pinia 状态管理', 'element-plus': 'Element Plus 组件库',
  rxjs: 'RxJS 响应式编程', ngrx: 'NgRx 状态管理', 'angular-material': 'Angular Material',
  'media-basics': '音视频基础', ffmpeg: 'FFmpeg 音视频处理', 'h264-codec': 'H.264 编解码',
  'rtmp-rtsp': 'RTMP / RTSP 协议', 'hls-dash': 'HLS / DASH 流媒体协议', webrtc: 'WebRTC 实时通信',
  'media-server': '流媒体服务器', transcoding: '转码与打包', 'cdn-delivery': 'CDN 分发',
  'live-streaming': '直播系统', 'video-conference': '视频会议',
  dom: 'DOM 与浏览器 API', 'component-library': '组件库与设计系统', 'vue-router': 'Vue Router 路由',
  'state-management': '状态管理教程', svelte: 'Svelte 教程', solid: 'Solid 教程', webpack: 'Webpack 教程', nextjs: 'Next.js 教程',
  nuxt: 'Nuxt 教程', astro: 'Astro 教程', pnpm: 'pnpm 与包管理进阶', bun: 'Bun 教程', deno: 'Deno 教程',
  eslint: 'ESLint 与代码规范', vitest: 'Vitest 单元测试', playwright: 'Playwright 端到端测试',
  'perf-web': '前端性能优化', a11y: 'Web 可访问性', i18n: 'Web 国际化',
  // Java
  collections: 'Java 集合与泛型', concurrency: 'Java 并发编程', gradle: 'Gradle 教程',
  'spring-data': 'Spring Data 教程', 'rest-api': 'REST API 设计', junit: 'JUnit 与测试',
  logging: '日志与可观测性', microservices: '微服务架构',
  // Python
  'python-typing': '类型标注与工程化', packaging: '打包与发布', flask: 'Flask 教程',
  automation: '自动化脚本', cli: '命令行程序', scraping: '爬虫与数据采集', numpy: 'NumPy 教程',
  pandas: 'Pandas 教程', pytest: 'pytest 与调试', profiling: '性能分析与优化',
  // Go
  'go-concurrency': 'Goroutine 与 Channel', 'go-generics': 'Go 泛型', 'go-network': 'Go 网络编程',
  'go-modules': 'Go Modules 与工程化', 'go-testing': 'Go 测试与基准', 'go-microservices': 'Go 微服务',
  'go-deploy': '部署与可观测',
  // Rust
  'rust-ownership': '所有权与借用', 'rust-async': 'Rust 异步编程', 'rust-macros': '宏与元编程',
  'rust-ffi': 'FFI 与 C 互操作', 'rust-cli': 'Rust 命令行工具', 'rust-network': 'Rust 网络服务',
  'rust-testing': 'Rust 测试与文档',
  // C / C++
  'c-pointers': '指针与内存布局', 'modern-cpp': '现代 C++', stl: 'STL 标准库',
  'cpp-templates': '模板与泛型', raii: 'RAII 与智能指针', cmake: 'CMake 与编译链接',
  'cpp-debugging': '调试与性能分析', 'cross-platform': '跨平台开发', 'systems-programming': '系统编程',
  // C# / .NET
  dotnet: '.NET 平台教程', linq: 'LINQ 数据查询', 'csharp-async': '异步与并发编程',
  di: '依赖注入与配置', 'ef-core': 'Entity Framework Core', wpf: 'WPF 桌面开发',
  maui: '.NET MAUI 跨平台', 'industrial-comms': '上位机与设备通信',
  // 移动端
  kotlin: 'Kotlin 教程', 'android-sdk': 'Android SDK 教程', 'jetpack-compose': 'Jetpack Compose',
  swift: 'Swift 教程', swiftui: 'SwiftUI 教程', 'mobile-arch': '移动架构与状态管理',
  'mobile-network': '移动网络与本地存储', 'push-location': '推送、定位与传感器',
  'mobile-testing': '移动端测试', 'mobile-release': '签名打包与发布',
  // 数据库
  transactions: '事务与锁', indexing: '索引原理', 'query-optimization': '查询优化与执行计划',
  'data-modeling': '数据建模与范式', 'sql-server': 'SQL Server 教程', sqlite: 'SQLite 教程',
  oracle: 'Oracle 教程', clickhouse: 'ClickHouse 教程', tsdb: '时序数据库', neo4j: '图数据库',
  'vector-db': '向量数据库', 'database-internals': '数据库内核原理', replication: '主从复制',
  sharding: '分库分表', 'backup-recovery': '备份与恢复',
  // 中间件
  rabbitmq: 'RabbitMQ 教程', rocketmq: 'RocketMQ 教程', 'api-gateway': 'API 网关',
  nacos: 'Nacos 与服务发现', zookeeper: 'ZooKeeper 教程',
  // DevOps
  'docker-compose': 'Docker Compose', jenkins: 'Jenkins 教程', 'gitlab-ci': 'GitLab CI 教程',
  'github-actions': 'GitHub Actions 教程', terraform: 'Terraform 教程', ansible: 'Ansible 教程',
  argocd: 'Argo CD 教程', grafana: 'Grafana 可视化', 'cloud-basics': '云服务基础',
  // 桌面软件
  qt: 'Qt 教程', electron: 'Electron 教程', tauri: 'Tauri 教程', winui: 'WinUI 教程',
  'auto-update': '自动更新',
  // 上位机与 PLC
  'serial-port': '串口通信教程', 'tcp-udp': 'TCP / UDP 通信', modbus: 'Modbus 协议',
  'opc-ua': 'OPC UA 协议', 'realtime-chart': '实时曲线与图表', 'report-export': '报表与导出',
  'plc-programming': 'PLC 编程（梯形图与 ST）', 'ladder-logic': '梯形图与顺序控制',
  scada: 'SCADA 组态与监控', 'servo-motion': '运动控制与伺服', 'hmi-design': 'HMI 触摸屏组态',
  // 科学计算与工程软件
  scipy: 'SciPy 教程', matlab: 'MATLAB 教程', 'numerical-methods': '数值计算方法', simulation: '建模仿真',
  fem: '有限元分析', mesh: '网格处理', opengl: 'OpenGL 图形编程', vtk: 'VTK 可视化',
  geometry: '几何建模', 'cad-dev': 'CAD 软件二次开发', cae: 'CAE 前后处理', bim: 'BIM 数据与开发',
  'plugin-dev': '专业软件插件开发',
  // 网络与分布式
  http: 'HTTP 协议', dns: 'DNS 与解析', rpc: 'RPC 与服务调用', websocket: 'WebSocket 实时通信',
  mqtt: 'MQTT 协议', consistency: '分布式一致性', raft: 'Raft 与共识算法',
  'load-balancing': '负载均衡', 'service-mesh': '服务网格', streaming: '流处理与实时计算',
  'realtime-media': '流媒体与实时音视频',
  // 操作系统与系统软件
  kernel: 'Linux 内核基础', drivers: '驱动与内核模块', syscall: '系统调用', 'memory-management': '内存管理',
  compiler: '编译原理', interpreter: '解释器', vm: '虚拟机与运行时', linker: '链接与加载',
  'perf-analysis': '性能分析', debugging: '调试技术', tracing: '追踪与诊断', ebpf: 'eBPF 观测',
  // 软件工程
  architecture: '软件架构与模式', refactoring: '重构', uml: 'UML 与建模', 'unit-testing': '单元测试',
  'integration-testing': '集成测试', 'e2e-testing': '端到端测试', 'static-analysis': '静态分析',
  'code-review': '代码评审', agile: '敏捷与项目管理', 'tech-writing': '技术文档写作', 'ai-coding': 'AI 辅助编程',
  // 嵌入式与机器人
  'embedded-linux': '嵌入式 Linux', rtos: 'RTOS 实时系统', ros2: 'ROS 2 机器人开发',
  'motion-planning': '运动规划', 'sensor-fusion': '传感器融合', 'iot-gateway': 'IoT 网关开发',
  // AI 与大模型
  nlp: '自然语言处理', 'llm-app': '大模型应用开发', 'prompt-engineering': 'Prompt 工程',
  rag: 'RAG 与向量检索', agent: 'Agent 与工具调用', 'model-deploy': '模型部署与推理', eval: '模型评测与监控',
  // 数据工程
  spark: 'Spark 大数据处理', flink: 'Flink 流处理', etl: 'ETL 与数据管道', 'data-warehouse': '数据仓库',
  bi: 'BI 与数据可视化',
}

/** 路线条目的学习要求：必学 / 推荐 / 可选 */
export type RouteItemRole = 'required' | 'recommended' | 'optional';

/** 路线里的一项：默认是教程；kind: 'route' 表示跳到另一条学习路线 */
export interface RouteItem {
  slug: string;
  kind?: 'tutorial' | 'route';
  role?: RouteItemRole;
}

/** 选型组里的一个选项：一个框架/方向，下面是一系列教程 */
export interface RouteChoiceOption {
  /** 选项名，如 React */
  name: string;
  role?: RouteItemRole;
  items: (string | RouteItem)[];
}

export interface RouteTier {
  name: string;
  /** sequence = 顺序学习（默认）；choice = 多选一 */
  kind?: 'sequence' | 'choice';
  /** 必学模块：标题旁显示「必学」 */
  required?: boolean;
  /** 选型组的说明文字 */
  note?: string;
  items: (string | RouteItem)[];
  /** choice 组专用：每个选项代表一个可选的框架/方向，各含一系列教程 */
  options?: RouteChoiceOption[];
}

export const normalizeItem = (item: string | RouteItem): RouteItem =>
  typeof item === 'string' ? { slug: item } : item;

/** 把一组教程（含选型组各选项）摊平成 slug 列表 */
export const tierSlugs = (tier: RouteTier): string[] =>
  tier.options?.length
    ? tier.options.flatMap((option) => option.items.map((item) => normalizeItem(item).slug))
    : tier.items.map((item) => normalizeItem(item).slug);

export const routePlan: Record<string, RouteTier[]> = {
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
      note: '五个框架任选其一即可，每个框架下是一系列配套教程；学完再继续下面的公共模块。推荐项适合大多数人，可选项按目标或团队技术栈选择。',
      items: [],
      options: [
        { name: 'React', role: 'recommended', items: ['react', 'react-router', 'react-state', 'ant-design', 'nextjs'] },
        { name: 'Vue', role: 'optional', items: ['vue', 'vue-router', 'pinia', 'element-plus', 'nuxt'] },
        { name: 'Angular', role: 'optional', items: ['angular', 'rxjs', 'ngrx', 'angular-material'] },
        { name: 'Svelte', role: 'optional', items: ['svelte'] },
        { name: 'Solid', role: 'optional', items: ['solid'] },
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
  'domain-ai-ml': [
    { name: '入门 · 数学与编程基础', items: ['python', 'data-science', 'dsa'] },
    { name: '进阶 · 机器学习与深度学习', items: ['machine-learning', 'deep-learning', 'nlp'] },
    { name: '精通 · 大模型应用', items: ['llm-app', 'prompt-engineering', 'rag', 'agent'] },
    { name: '实战与生态 · 部署、评测与运维', items: ['model-deploy', 'eval', 'fastapi', 'docker', 'kubernetes'] },
  ],
  'domain-big-data': [
    { name: '入门 · 基础与语言', items: ['sql', 'python', 'linux'] },
    { name: '进阶 · 存储与消息', items: ['mysql', 'redis', 'kafka', 'mongodb'] },
    { name: '精通 · 计算引擎与数仓', items: ['spark', 'flink', 'etl', 'data-warehouse'] },
    { name: '实战与生态 · 平台、分析与运维', items: ['docker', 'kubernetes', 'elasticsearch', 'bi', 'big-data'] },
  ],
  'domain-blockchain-web3': [
    { name: '入门 · 基础与密码学', items: ['network', 'c', 'python'] },
    { name: '进阶 · 链上开发', items: ['blockchain', 'rust', 'node-backend'] },
    { name: '精通 · 系统与性能', items: ['os', 'dsa', 'security'] },
    { name: '实战与生态 · 部署与运维', items: ['docker', 'kubernetes', 'linux'] },
  ],
  'domain-cybersecurity': [
    { name: '入门 · 基础与工具', items: ['linux', 'network', 'python'] },
    { name: '进阶 · 攻防技术', items: ['security', 'os', 'c'] },
    { name: '精通 · 逆向与底层', items: ['dsa', 'design-patterns'] },
    { name: '实战与生态 · 云与运维', items: ['docker', 'kubernetes', 'nginx', 'sql'] },
  ],
  'domain-devops-cloud': [
    { name: '入门 · 系统与网络', items: ['linux', 'network'] },
    { name: '进阶 · 容器与编排', items: ['docker', 'kubernetes', 'nginx'] },
    { name: '精通 · 原理与语言', items: ['os', 'go', 'python'] },
    { name: '实战与生态 · 平台工程', items: ['security', 'prometheus', 'big-data'] },
  ],
  'domain-embedded-iot': [
    { name: '入门 · C 与硬件基础', items: ['c', 'c-pointers', 'linux', 'network'] },
    { name: '进阶 · 系统与外设', items: ['embedded', 'rtos', 'embedded-linux', 'cpp'] },
    { name: '精通 · 机器人与算法', items: ['ros2', 'motion-planning', 'sensor-fusion', 'rust'] },
    { name: '实战与生态 · 联网、云与安全', items: ['iot-gateway', 'mqtt', 'docker', 'security'] },
  ],
  'domain-fintech': [
    { name: '入门 · 语言与数据', items: ['python', 'sql', 'mysql'] },
    { name: '进阶 · 系统与网络', items: ['c', 'network', 'os'] },
    { name: '精通 · 量化与算法', items: ['dsa', 'quant', 'machine-learning'] },
    { name: '实战与生态 · 风控与运维', items: ['redis', 'kafka', 'docker', 'security'] },
  ],
  'domain-game-vr-ar': [
    { name: '入门 · 语言与数学', items: ['c', 'cpp', 'dsa'] },
    { name: '进阶 · 引擎与图形', items: ['game-dev', 'csharp', 'design-patterns'] },
    { name: '精通 · 性能与底层', items: ['os', 'network'] },
    { name: '实战与生态 · 上线与运维', items: ['docker', 'nginx', 'embedded'] },
  ],
  'domain-gis': [
    { name: '入门 · 前端与数据基础', items: ['javascript', 'html', 'css'] },
    { name: '进阶 · 空间数据与数据库', items: ['sql', 'postgresql', 'mongodb'] },
    { name: '精通 · 算法与系统', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['docker', 'nginx', 'node-backend'] },
  ],
  'domain-mobile-dev': [
    { name: '入门 · 语言与工具', items: ['javascript'] },
    { name: '进阶 · 跨端框架', items: ['flutter', 'react-native', 'typescript'] },
    { name: '精通 · 网络与架构', items: ['network', 'design-patterns', 'sql'] },
    { name: '实战与生态 · 质量与发布', items: ['testing', 'docker', 'nginx'] },
  ],
  'domain-visualization': [
    { name: '入门 · 前端与数据', items: ['html', 'css', 'javascript'] },
    { name: '进阶 · 数据处理', items: ['data-science', 'sql', 'typescript'] },
    { name: '精通 · 算法与性能', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['node-backend', 'docker', 'nginx'] },
  ],
  'domain-web-saas': [
    { name: '入门 · 前端与语言', items: ['html', 'css', 'javascript', 'typescript'] },
    { name: '进阶 · 服务端与数据', items: ['nodejs', 'node-backend', 'sql', 'mysql', 'redis'] },
    { name: '精通 · 原理与安全', items: ['network', 'os', 'security', 'design-patterns'] },
    { name: '实战与生态 · 交付与运维', items: ['vite', 'vue', 'react', 'docker', 'kubernetes', 'nginx'] },
  ],
  'domain-desktop-app': [
    { name: '入门 · 语言与桌面 GUI', items: ['csharp', 'cpp', 'wpf', 'qt'] },
    { name: '进阶 · 跨平台桌面框架', items: ['electron', 'tauri', 'maui', 'winui'] },
    { name: '精通 · 架构与系统集成', items: ['design-patterns', 'sql', 'network', 'security'] },
    { name: '实战与生态 · 打包、更新与质量', items: ['packaging', 'auto-update', 'testing'] },
  ],
  'domain-industrial-hmi': [
    { name: '入门 · 语言与界面基础', items: ['csharp', 'wpf', 'qt', 'python'] },
    { name: '进阶 · 工业通信协议', items: ['serial-port', 'tcp-udp', 'modbus', 'opc-ua', 'mqtt'] },
    { name: '精通 · PLC、组态与运动控制', items: ['plc-programming', 'ladder-logic', 'scada', 'hmi-design', 'servo-motion'] },
    { name: '实战与生态 · 采集、报表与部署', items: ['industrial-comms', 'realtime-chart', 'report-export', 'packaging', 'auto-update'] },
  ],
  'domain-database-systems': [
    { name: '入门 · 关系型与 SQL', items: ['sql', 'mysql', 'postgresql'] },
    { name: '进阶 · 查询与建模', items: ['data-modeling', 'indexing', 'query-optimization', 'transactions'] },
    { name: '精通 · 内核与分布式', items: ['database-internals', 'replication', 'sharding', 'os'] },
    { name: '实战 · 多模存储与运维', items: ['redis', 'mongodb', 'elasticsearch', 'clickhouse', 'backup-recovery'] },
  ],
  'domain-scientific-computing': [
    { name: '基础 · 数学与编程', items: ['python', 'numpy', 'scipy', 'matlab'] },
    { name: '进阶 · 数值与建模', items: ['numerical-methods', 'simulation', 'mesh', 'fem'] },
    { name: '精通 · 图形与可视化', items: ['opengl', 'vtk', 'geometry'] },
    { name: '实战 · 工程软件与集成', items: ['cad-dev', 'cae', 'bim', 'plugin-dev'] },
  ],
  'domain-os-system': [
    { name: '入门 · 系统原理', items: ['os', 'linux', 'shell'] },
    { name: '进阶 · 内核与驱动', items: ['kernel', 'drivers', 'syscall', 'memory-management'] },
    { name: '精通 · 编译与运行时', items: ['compiler', 'interpreter', 'vm', 'linker'] },
    { name: '实战 · 性能与调试', items: ['perf-analysis', 'debugging', 'tracing', 'ebpf'] },
  ],
  'domain-media-streaming': [
    { name: '入门 · 音视频基础', items: ['media-basics', 'ffmpeg', 'h264-codec'] },
    { name: '进阶 · 协议与传输', items: ['rtmp-rtsp', 'hls-dash', 'webrtc'] },
    { name: '精通 · 流媒体服务', items: ['media-server', 'transcoding', 'cdn-delivery'] },
    { name: '实战 · 实时音视频应用', items: ['live-streaming', 'video-conference', 'realtime-media'] },
  ],
  'domain-software-engineering': [
    { name: '入门 · 工程基础', items: ['code-quality', 'unit-testing'] },
    { name: '进阶 · 设计与架构', items: ['design-patterns', 'architecture', 'refactoring', 'uml'] },
    { name: '精通 · 测试与质量', items: ['integration-testing', 'e2e-testing', 'api-testing', 'perf-testing', 'static-analysis', 'code-review'] },
    { name: '实战 · 协作与交付', items: ['ci-cd', 'testing', 'agile', 'tech-writing', 'ai-coding'] },
  ],
}

// 路线页 → 概览卡片用的技术名（与 tech-stack/index.md 的入口保持一致）
// 顺序即「学习路线」左侧栏顺序
export const routeTitles: Record<string, string> = {
  java: 'Java 技术路线', python: 'Python 技术路线', go: 'Go 技术路线', rust: 'Rust 技术路线',
  'c-cpp': 'C / C++ 技术路线', 'c-sharp': 'C# 与 .NET 技术路线', 'kotlin-swift-dart': '移动与跨平台技术路线',
  'javascript-typescript': 'JavaScript / TypeScript 技术路线',
  frontend: '大前端技术路线',
  desktop: '桌面端技术路线', mobile: '移动端技术路线',
  'sql-database': '数据库技术路线', mysql: 'MySQL', postgresql: 'PostgreSQL', redis: 'Redis',
  mongodb: 'MongoDB', elasticsearch: 'Elasticsearch', kafka: '中间件技术路线', nginx: 'Nginx',
  docker: 'DevOps 与工程工具', kubernetes: 'Kubernetes',
}

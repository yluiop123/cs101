<script setup>
import TutorialCards from '../.vitepress/components/TutorialCards.vue'

const sections = [
  {
    id: 'frontend',
    title: '前端开发',
    icon: 'mdi-language-html5',
    color: '#e44d26',
    items: [
      { title: 'HTML 教程', url: 'https://www.runoob.com/html/html-tutorial.html', desc: 'HTML 基础标签与文档结构' },
      { title: 'CSS 教程', url: 'https://www.runoob.com/css/css-tutorial.html', desc: 'CSS 样式与页面布局' },
      { title: 'JavaScript 教程', url: 'https://www.runoob.com/js/js-tutorial.html', desc: 'JavaScript 核心语法与 DOM' },
      { title: 'TypeScript 教程', url: 'https://www.typescriptlang.org/docs/', desc: 'TypeScript 类型系统入门', lang: 'en', type: 'article' },
      { title: 'Vue.js 教程', url: 'https://cn.vuejs.org/guide/introduction.html', desc: '渐进式前端框架', lang: 'zh', type: 'article' },
      { title: 'React 教程', url: 'https://react.dev/learn', desc: '声明式 UI 框架', lang: 'en', type: 'article' },
      { title: 'Node.js 教程', url: 'https://www.runoob.com/nodejs/nodejs-tutorial.html', desc: '在服务端运行 JavaScript' },
    ]
  },
  {
    id: 'backend',
    title: '后端开发',
    icon: 'mdi-server',
    color: '#2563eb',
    items: [
      { title: 'Java 教程', url: 'https://www.runoob.com/java/java-tutorial.html', desc: 'Java 基础到企业级开发' },
      { title: 'Python 教程', url: 'https://www.runoob.com/python3/python3-tutorial.html', desc: 'Python 基础与进阶' },
      { title: 'Spring Boot 教程', url: 'https://springdoc.cn/', desc: 'Spring Boot 企业级框架' },
      { title: 'Django 教程', url: 'https://www.runoob.com/django/django-tutorial.html', desc: 'Python Web 框架' },
      { title: 'Go 语言教程', url: 'https://www.runoob.com/go/go-tutorial.html', desc: 'Go 语言基础到并发编程' },
      { title: 'Rust 教程', url: 'https://www.runoob.com/rust/rust-tutorial.html', desc: 'Rust 系统编程语言' },
      { title: 'C# 教程', url: 'https://www.runoob.com/csharp/csharp-tutorial.html', desc: 'C# 与 .NET 开发' },
    ]
  },
  {
    id: 'database',
    title: '数据库',
    icon: 'mdi-database',
    color: '#336791',
    items: [
      { title: 'SQL 教程', url: 'https://www.runoob.com/sql/sql-tutorial.html', desc: 'SQL 查询语言基础' },
      { title: 'MySQL 教程', url: 'https://www.runoob.com/mysql/mysql-tutorial.html', desc: '最流行的开源数据库' },
      { title: 'PostgreSQL 教程', url: 'https://www.postgresqltutorial.com/', desc: '高级开源关系型数据库' },
      { title: 'Redis 教程', url: 'https://www.runoob.com/redis/redis-tutorial.html', desc: '内存缓存与键值存储' },
      { title: 'MongoDB 教程', url: 'https://www.runoob.com/mongodb/mongodb-tutorial.html', desc: '文档型 NoSQL 数据库' },
    ]
  },
  {
    id: 'mobile',
    title: '移动开发',
    icon: 'mdi-cellphone',
    color: '#16a34a',
    items: [
      { title: 'Android 教程', url: 'https://www.runoob.com/android/android-tutorial.html', desc: 'Android 应用开发入门' },
      { title: 'Kotlin 教程', url: 'https://www.runoob.com/kotlin/kotlin-tutorial.html', desc: '现代 Android 开发语言' },
      { title: 'Swift 教程', url: 'https://www.runoob.com/swift/swift-tutorial.html', desc: 'iOS 与 macOS 开发' },
      { title: 'Flutter 教程', url: 'https://www.runoob.com/flutter/flutter-tutorial.html', desc: '跨平台移动 UI 框架' },
      { title: 'React Native 教程', url: 'https://www.runoob.com/react-native/react-native-tutorial.html', desc: '用 React 开发移动应用' },
    ]
  },
  {
    id: 'devops',
    title: '运维与 DevOps',
    icon: 'mdi-kubernetes',
    color: '#2563eb',
    items: [
      { title: 'Linux 教程', url: 'https://www.runoob.com/linux/linux-tutorial.html', desc: 'Linux 系统管理与命令' },
      { title: 'Docker 教程', url: 'https://www.runoob.com/docker/docker-tutorial.html', desc: '容器化技术入门' },
      { title: 'Kubernetes 教程', url: 'https://kubernetes.io/zh-cn/docs/tutorials/', desc: '容器编排与集群管理' },
      { title: 'Git 教程', url: 'https://www.runoob.com/git/git-tutorial.html', desc: '分布式版本控制' },
    ]
  },
  {
    id: 'ai',
    title: 'AI 与数据科学',
    icon: 'mdi-brain',
    color: '#9333ea',
    items: [
      { title: 'Python 数据科学', url: 'https://www.runoob.com/python3/python3-data-science.html', desc: 'NumPy/Pandas/Matplotlib' },
      { title: '机器学习入门', url: 'https://www.runoob.com/ai/ai-machine-learning.html', desc: 'ML 基础概念与算法' },
      { title: '深度学习教程', url: 'https://www.runoob.com/ai/ai-deep-learning.html', desc: 'TensorFlow/PyTorch 入门' },
      { title: 'PyTorch 教程', url: 'https://pytorch.org/tutorials/', desc: '动态神经网络框架' },
      { title: 'HuggingFace 教程', url: 'https://huggingface.co/learn/nlp-course', desc: 'NLP 与 Transformer 模型' },
    ]
  },
  {
    id: 'fundamentals',
    title: '计算机基础',
    icon: 'mdi-monitor',
    color: '#4b5563',
    items: [
      { title: '数据结构', url: 'https://www.runoob.com/data-structures/data-structures-tutorial.html', desc: '常用数据结构与实现' },
      { title: '算法教程', url: 'https://www.runoob.com/algorithm/algorithm-tutorial.html', desc: '排序/搜索/图算法' },
      { title: '计算机网络', url: 'https://www.runoob.com/computer-networking/computer-networking-tutorial.html', desc: 'TCP/IP、HTTP 协议' },
      { title: '操作系统', url: 'https://www.runoob.com/operating-system/operating-system-tutorial.html', desc: '进程管理、内存管理' },
      { title: '设计模式', url: 'https://www.runoob.com/design-pattern/design-pattern-tutorial.html', desc: '23 种 GoF 设计模式' },
    ]
  },
  {
    id: 'dev-tools',
    title: '开发工具',
    icon: 'mdi-tools',
    color: '#d97706',
    items: [
      { title: 'VS Code 教程', url: 'https://code.visualstudio.com/docs', desc: '轻量级代码编辑器' },
      { title: 'IntelliJ IDEA 教程', url: 'https://www.jetbrains.com/help/idea/', desc: 'Java IDE 使用指南' },
      { title: 'Postman 教程', url: 'https://learning.postman.com/', desc: 'API 调试与测试工具' },
      { title: '正则表达式教程', url: 'https://www.runoob.com/regexp/regexp-tutorial.html', desc: '文本匹配与处理' },
      { title: 'Markdown 教程', url: 'https://www.runoob.com/markdown/md-tutorial.html', desc: '轻量级标记语言' },
    ]
  },
]
</script>

# 全部教程

按分类浏览精选技术教程，涵盖前端、后端、数据库、移动开发、运维、AI 等主要领域。

<TutorialCards
  v-for="(sec, i) in sections" :key="i"
  :id="sec.id"
  :title="sec.title"
  :icon="sec.icon"
  :color="sec.color"
  :items="sec.items"
/>

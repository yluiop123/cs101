<script setup>
import TutorialCards from '../.vitepress/components/TutorialCards.vue'

const sections = [
  {
    id: 'frontend',
    title: '前端开发',
    icon: 'mdi-language-html5',
    color: '#e44d26',
    items: [
      { 
        title: 'HTML 教程', description: 'HTML 基础标签与文档结构', 
        resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马程序员 HTML 教程", url: "https://www.bilibili.com/video/BV1p84y1p7Z9", icon: "mdi-play-circle-outline",lang:'zh',type:'video' },
                { title: "HTML Full Course", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN HTML 教程", url: "https://developer.mozilla.org/zh-CN/docs/Web/HTML", icon: "mdi-file-document-outline" },
                { title: "W3Schools HTML", url: "https://www.w3schools.com/html/", icon: "mdi-file-document-outline" }
              ],
            }
          ] },
      { title: 'CSS 教程', description: 'CSS 样式与页面布局', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 CSS 教程', url: 'https://www.bilibili.com/video/BV1p84y1p7Z9', icon: 'mdi-play-circle-outline' },
          { title: 'CSS Full Course', url: 'https://www.youtube.com/watch?v/ieTHC78giGQ', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'MDN CSS 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS', icon: 'mdi-file-document-outline' },
          { title: 'W3Schools CSS', url: 'https://www.w3schools.com/css/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'JavaScript 教程', description: 'JavaScript 核心语法与 DOM', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 JavaScript 教程', url: 'https://www.bilibili.com/video/BV1YW411T7GX', icon: 'mdi-play-circle-outline' },
          { title: 'JavaScript Full Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'MDN JavaScript 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', icon: 'mdi-file-document-outline' },
          { title: 'W3Schools JavaScript', url: 'https://www.w3schools.com/js/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'TypeScript 教程', description: 'TypeScript 类型系统入门', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 TypeScript 教程', url: 'https://www.bilibili.com/video/BV1Xy4y1v7S2', icon: 'mdi-play-circle-outline' },
          { title: 'TypeScript Full Course', url: 'https://www.youtube.com/watch?v=gp5H0Vw39yw', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/docs/', icon: 'mdi-file-document-outline', lang: 'en', type: 'article' },
          { title: 'W3Schools TypeScript', url: 'https://www.w3schools.com/typescript/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Vue.js 教程', description: '渐进式前端框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Vue 教程', url: 'https://www.bilibili.com/video/BV1nV4y1s7i6', icon: 'mdi-play-circle-outline' },
          { title: 'Vue.js Full Course', url: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Vue.js 官方文档', url: 'https://cn.vuejs.org/guide/introduction.html', icon: 'mdi-file-document-outline', lang: 'zh', type: 'article' },
          { title: 'Vue 3 组合式 API', url: 'https://cn.vuejs.org/api/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'React 教程', description: '声明式 UI 框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 React 教程', url: 'https://www.bilibili.com/video/BV1Z44y1K7Fj', icon: 'mdi-play-circle-outline' },
          { title: 'React Full Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'React 官方文档', url: 'https://react.dev/learn', icon: 'mdi-file-document-outline', lang: 'en', type: 'article' },
          { title: 'React 中文文档', url: 'https://zh-hans.react.dev/learn', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Node.js 教程', description: '在服务端运行 JavaScript', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Node.js 教程', url: 'https://www.bilibili.com/video/BV1gM4y1v7Xv', icon: 'mdi-play-circle-outline' },
          { title: 'Node.js Full Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Node.js 官方文档', url: 'https://nodejs.org/docs/latest/api/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Node.js', url: 'https://www.runoob.com/nodejs/nodejs-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'backend',
    title: '后端开发',
    icon: 'mdi-server',
    color: '#2563eb',
    items: [
      { title: 'Java 教程', description: 'Java 基础到企业级开发', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Java 教程', url: 'https://www.bilibili.com/video/BV1YA411T76k', icon: 'mdi-play-circle-outline' },
          { title: 'Java Full Course', url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Java 官方教程', url: 'https://docs.oracle.com/javase/tutorial/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Java', url: 'https://www.runoob.com/java/java-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Python 教程', description: 'Python 基础与进阶', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马程序员 Python 教程', url: 'https://www.bilibili.com/video/BV1ex4y1R7tQ', icon: 'mdi-play-circle-outline' },
          { title: 'Python Full Course', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZfc', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Python 官方文档', url: 'https://docs.python.org/3/tutorial/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Python', url: 'https://www.runoob.com/python3/python3-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Spring Boot 教程', description: 'Spring Boot 企业级框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Spring Boot 教程', url: 'https://www.bilibili.com/video/BV15b4y1a7yG', icon: 'mdi-play-circle-outline' },
          { title: 'Spring Boot Full Course', url: 'https://www.youtube.com/watch?v=vtPkZShrvXQ', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Spring 官方文档', url: 'https://springdoc.cn/', icon: 'mdi-file-document-outline' },
          { title: 'Spring Boot 参考指南', url: 'https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Django 教程', description: 'Python Web 框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Django 教程 B站', url: 'https://www.bilibili.com/video/BV1NL41157ph', icon: 'mdi-play-circle-outline' },
          { title: 'Django Full Course', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Django 官方文档', url: 'https://docs.djangoproject.com/zh-hans/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Django', url: 'https://www.runoob.com/django/django-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Go 语言教程', description: 'Go 语言基础到并发编程', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Go 教程', url: 'https://www.bilibili.com/video/BV1ME411Y7oF', icon: 'mdi-play-circle-outline' },
          { title: 'Go Full Course', url: 'https://www.youtube.com/watch?v=YS4e4q9oBaU', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Go 官方文档', url: 'https://go.dev/doc/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Go', url: 'https://www.runoob.com/go/go-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Rust 教程', description: 'Rust 系统编程语言', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Rust 编程入门教程', url: 'https://www.bilibili.com/video/BV1Z44y1K7Fj', icon: 'mdi-play-circle-outline' },
          { title: 'Rust Full Course', url: 'https://www.youtube.com/watch?v=BpPEoZW5IiY', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Rust 官方文档', url: 'https://doc.rust-lang.org/book/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Rust', url: 'https://www.runoob.com/rust/rust-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'C# 教程', description: 'C# 与 .NET 开发', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 C# 教程', url: 'https://www.bilibili.com/video/BV1tv4y1c7Ko', icon: 'mdi-play-circle-outline' },
          { title: 'C# Full Course', url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Microsoft C# 文档', url: 'https://docs.microsoft.com/zh-cn/dotnet/csharp/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 C#', url: 'https://www.runoob.com/csharp/csharp-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'database',
    title: '数据库',
    icon: 'mdi-database',
    color: '#336791',
    items: [
      { title: 'SQL 教程', description: 'SQL 查询语言基础', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 SQL 教程', url: 'https://www.bilibili.com/video/BV1ns41117dq', icon: 'mdi-play-circle-outline' },
          { title: 'SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 SQL', url: 'https://www.runoob.com/sql/sql-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'MySQL 教程', description: '最流行的开源数据库', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 MySQL 教程', url: 'https://www.bilibili.com/video/BV1iq4y1u7vj', icon: 'mdi-play-circle-outline' },
          { title: 'MySQL Full Course', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'MySQL 官方文档', url: 'https://dev.mysql.com/doc/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 MySQL', url: 'https://www.runoob.com/mysql/mysql-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'PostgreSQL 教程', description: '高级开源关系型数据库', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'PostgreSQL 教程 B站', url: 'https://www.bilibili.com/video/BV1d54y1p7YX', icon: 'mdi-play-circle-outline' },
          { title: 'PostgreSQL Full Course', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/', icon: 'mdi-file-document-outline' },
          { title: 'PostgreSQL 教程', url: 'https://www.postgresqltutorial.com/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Redis 教程', description: '内存缓存与键值存储', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Redis 教程', url: 'https://www.bilibili.com/video/BV1Rv41177Af', icon: 'mdi-play-circle-outline' },
          { title: 'Redis Full Course', url: 'https://www.youtube.com/watch?v=XCsS_NVAa1g', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Redis 官方文档', url: 'https://redis.io/docs/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Redis', url: 'https://www.runoob.com/redis/redis-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'MongoDB 教程', description: '文档型 NoSQL 数据库', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 MongoDB 教程', url: 'https://www.bilibili.com/video/BV1bJ4m1L7jB', icon: 'mdi-play-circle-outline' },
          { title: 'MongoDB Full Course', url: 'https://www.youtube.com/watch?v=QPfljU1e2ek', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'MongoDB 官方文档', url: 'https://www.mongodb.com/docs/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 MongoDB', url: 'https://www.runoob.com/mongodb/mongodb-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'mobile',
    title: '移动开发',
    icon: 'mdi-cellphone',
    color: '#16a34a',
    items: [
      { title: 'Android 教程', description: 'Android 应用开发入门', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Android 教程 B站', url: 'https://www.bilibili.com/video/BV1tv4y1c7Ko', icon: 'mdi-play-circle-outline' },
          { title: 'Android Full Course', url: 'https://www.youtube.com/watch?v=fis26HvvDII', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Android 官方文档', url: 'https://developer.android.com/docs', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Android', url: 'https://www.runoob.com/android/android-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Kotlin 教程', description: '现代 Android 开发语言', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Kotlin 教程 B站', url: 'https://www.bilibili.com/video/BV1w4411A7Tk', icon: 'mdi-play-circle-outline' },
          { title: 'Kotlin Full Course', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Kotlin 官方文档', url: 'https://kotlinlang.org/docs/home.html', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Kotlin', url: 'https://www.runoob.com/kotlin/kotlin-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Swift 教程', description: 'iOS 与 macOS 开发', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Swift 教程 B站', url: 'https://www.bilibili.com/video/BV1oE411B7jD', icon: 'mdi-play-circle-outline' },
          { title: 'Swift Full Course', url: 'https://www.youtube.com/watch?v=Ulp1Kimblg0', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Apple Swift 文档', url: 'https://docs.swift.org/swift-book/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Swift', url: 'https://www.runoob.com/swift/swift-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Flutter 教程', description: '跨平台移动 UI 框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Flutter 教程 B站', url: 'https://www.bilibili.com/video/BV1S4411E7LY', icon: 'mdi-play-circle-outline' },
          { title: 'Flutter Full Course', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Flutter 官方文档', url: 'https://docs.flutter.dev/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Flutter', url: 'https://www.runoob.com/flutter/flutter-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'React Native 教程', description: '用 React 开发移动应用', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'React Native 教程 B站', url: 'https://www.bilibili.com/video/BV1Xv4y1c7Ko', icon: 'mdi-play-circle-outline' },
          { title: 'React Native Full Course', url: 'https://www.youtube.com/watch?v=ZBCUegTZF7M', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'React Native 官方文档', url: 'https://reactnative.dev/docs/getting-started', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 React Native', url: 'https://www.runoob.com/react-native/react-native-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'devops',
    title: '运维与 DevOps',
    icon: 'mdi-kubernetes',
    color: '#2563eb',
    items: [
      { title: 'Linux 教程', description: 'Linux 系统管理与命令', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Linux 教程', url: 'https://www.bilibili.com/video/BV1nY4y1o7Cb', icon: 'mdi-play-circle-outline' },
          { title: 'Linux Full Course', url: 'https://www.youtube.com/watch?v=wBp0Rb-ZJak', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Linux 命令大全', url: 'https://www.runoob.com/linux/linux-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'Linux 手册', url: 'https://linux.die.net/man/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Docker 教程', description: '容器化技术入门', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Docker 教程', url: 'https://www.bilibili.com/video/BV1gr4y1F71s', icon: 'mdi-play-circle-outline' },
          { title: 'Docker Full Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Docker 官方文档', url: 'https://docs.docker.com/', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Docker', url: 'https://www.runoob.com/docker/docker-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Kubernetes 教程', description: '容器编排与集群管理', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'K8s 教程 B站', url: 'https://www.bilibili.com/video/BV1w4411y7Go', icon: 'mdi-play-circle-outline' },
          { title: 'Kubernetes Full Course', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Kubernetes 官方文档', url: 'https://kubernetes.io/zh-cn/docs/tutorials/', icon: 'mdi-file-document-outline' },
          { title: 'Kubernetes 中文指南', url: 'https://jimmysong.io/kubernetes-handbook/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Git 教程', description: '分布式版本控制', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 Git 教程', url: 'https://www.bilibili.com/video/BV1wm4y1z7Dg', icon: 'mdi-play-circle-outline' },
          { title: 'Git Full Course', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Git 官方文档', url: 'https://git-scm.com/doc', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 Git', url: 'https://www.runoob.com/git/git-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'ai',
    title: 'AI 与数据科学',
    icon: 'mdi-brain',
    color: '#9333ea',
    items: [
      { title: 'Python 数据科学', description: 'NumPy/Pandas/Matplotlib', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马程序员 数据科学教程', url: 'https://www.bilibili.com/video/BV1hG411V7Jb', icon: 'mdi-play-circle-outline' },
          { title: 'Data Science Full Course', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 数据科学', url: 'https://www.runoob.com/python3/python3-data-science.html', icon: 'mdi-file-document-outline' },
          { title: 'NumPy 官方文档', url: 'https://numpy.org/doc/stable/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '机器学习入门', description: 'ML 基础概念与算法', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '吴恩达 机器学习教程', url: 'https://www.bilibili.com/video/BV1Bq421A7G6', icon: 'mdi-play-circle-outline' },
          { title: 'Machine Learning Full Course', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: 'Machine Learning 教程', url: 'https://www.runoob.com/ai/ai-machine-learning.html', icon: 'mdi-file-document-outline' },
          { title: 'Scikit-learn 文档', url: 'https://scikit-learn.org/stable/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '深度学习教程', description: 'TensorFlow/PyTorch 入门', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '吴恩达 深度学习教程', url: 'https://www.bilibili.com/video/BV1FT4y1E7Vj', icon: 'mdi-play-circle-outline' },
          { title: 'Deep Learning Full Course', url: 'https://www.youtube.com/watch?v=GvQwE2OhL8I', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 深度学习', url: 'https://www.runoob.com/ai/ai-deep-learning.html', icon: 'mdi-file-document-outline' },
          { title: 'TensorFlow 官方文档', url: 'https://www.tensorflow.org/tutorials', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'PyTorch 教程', description: '动态神经网络框架', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'PyTorch 深度学习实战', url: 'https://www.bilibili.com/video/BV1Rv4y1U7jK', icon: 'mdi-play-circle-outline' },
          { title: 'PyTorch Full Course', url: 'https://www.youtube.com/watch?v=LGg0CZcrH0o', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', icon: 'mdi-file-document-outline' },
          { title: 'PyTorch 中文文档', url: 'https://pytorch.apachecn.org/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'HuggingFace 教程', description: 'NLP 与 Transformer 模型', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'HuggingFace 入门教程', url: 'https://www.bilibili.com/video/BV1m44y1a7oP', icon: 'mdi-play-circle-outline' },
          { title: 'HuggingFace Course', url: 'https://www.youtube.com/watch?v=QEaBAZQCtwE', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'HuggingFace NLP Course', url: 'https://huggingface.co/learn/nlp-course', icon: 'mdi-file-document-outline' },
          { title: 'HuggingFace 文档', url: 'https://huggingface.co/docs', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'fundamentals',
    title: '计算机基础',
    icon: 'mdi-monitor',
    color: '#4b5563',
    items: [
      { title: '数据结构', description: '常用数据结构与实现', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 数据结构教程', url: 'https://www.bilibili.com/video/BV1LJ411W7dP', icon: 'mdi-play-circle-outline' },
          { title: 'Data Structures Full Course', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 数据结构', url: 'https://www.runoob.com/data-structures/data-structures-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: '算法与数据结构', url: 'https://visualgo.net/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '算法教程', description: '排序/搜索/图算法', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 算法教程', url: 'https://www.bilibili.com/video/BV1LJ411W7dP', icon: 'mdi-play-circle-outline' },
          { title: 'Algorithms Full Course', url: 'https://www.youtube.com/watch?v=8hly31xKli0', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 算法', url: 'https://www.runoob.com/algorithm/algorithm-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'LeetCode 刷题', url: 'https://leetcode.cn/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '计算机网络', description: 'TCP/IP、HTTP 协议', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '计算机网络 微学堂', url: 'https://www.bilibili.com/video/BV1c4411d7jb', icon: 'mdi-play-circle-outline' },
          { title: 'Computer Networking Course', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 计算机网络', url: 'https://www.runoob.com/computer-networking/computer-networking-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'HTTP 协议详解', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '操作系统', description: '进程管理、内存管理', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '操作系统 微学堂', url: 'https://www.bilibili.com/video/BV1YE411D7nH', icon: 'mdi-play-circle-outline' },
          { title: 'Operating Systems Course', url: 'https://www.youtube.com/watch?v=vBURTt97EkA', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 操作系统', url: 'https://www.runoob.com/operating-system/operating-system-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'OS Dev Wiki', url: 'https://wiki.osdev.org/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '设计模式', description: '23 种 GoF 设计模式', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 设计模式教程', url: 'https://www.bilibili.com/video/BV1G4411c7N4', icon: 'mdi-play-circle-outline' },
          { title: 'Design Patterns Full Course', url: 'https://www.youtube.com/watch?v=tv-_1er1mWI', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 设计模式', url: 'https://www.runoob.com/design-pattern/design-pattern-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'Refactoring Guru', url: 'https://refactoringguru.cn/design-patterns', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ]
  },
  {
    id: 'dev-tools',
    title: '开发工具',
    icon: 'mdi-tools',
    color: '#d97706',
    items: [
      { title: 'VS Code 教程', description: '轻量级代码编辑器', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'VS Code 入门教程', url: 'https://www.bilibili.com/video/BV1iX4y1Y7aP', icon: 'mdi-play-circle-outline' },
          { title: 'VS Code Full Course', url: 'https://www.youtube.com/watch?v=WPqXP_kLzpo', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'VS Code 官方文档', url: 'https://code.visualstudio.com/docs', icon: 'mdi-file-document-outline' },
          { title: 'VS Code 快捷键指南', url: 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'IntelliJ IDEA 教程', description: 'Java IDE 使用指南', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'IntelliJ IDEA 教程 B站', url: 'https://www.bilibili.com/video/BV1iJ1aYbE3k', icon: 'mdi-play-circle-outline' },
          { title: 'IntelliJ IDEA Full Course', url: 'https://www.youtube.com/watch?v=yefmc1l9Qe4', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'IntelliJ IDEA 官方文档', url: 'https://www.jetbrains.com/help/idea/', icon: 'mdi-file-document-outline' },
          { title: 'IntelliJ 快捷键指南', url: 'https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Postman 教程', description: 'API 调试与测试工具', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Postman 教程 B站', url: 'https://www.bilibili.com/video/BV1T4411X7Kp', icon: 'mdi-play-circle-outline' },
          { title: 'Postman Full Course', url: 'https://www.youtube.com/watch?v=VywxIQ2ZXk4', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '官方文档', icon: 'mdi-file-document-outline', items: [
          { title: 'Postman 官方文档', url: 'https://learning.postman.com/', icon: 'mdi-file-document-outline' },
          { title: 'Postman 使用指南', url: 'https://www.runoob.com/postman/postman-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '正则表达式教程', description: '文本匹配与处理', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '正则表达式教程 B站', url: 'https://www.bilibili.com/video/BV1mt4y1i7RQ', icon: 'mdi-play-circle-outline' },
          { title: 'Regex Full Course', url: 'https://www.youtube.com/watch?v=rhzKDrUiJVk', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 正则表达式', url: 'https://www.runoob.com/regexp/regexp-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'Regex 101 在线测试', url: 'https://regex101.com/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: 'Markdown 教程', description: '轻量级标记语言', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: 'Markdown 教程 B站', url: 'https://www.bilibili.com/video/BV1JA411r7W7', icon: 'mdi-play-circle-outline' },
          { title: 'Markdown Full Course', url: 'https://www.youtube.com/watch?v=HUBNt18RFbo', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '菜鸟教程 Markdown', url: 'https://www.runoob.com/markdown/md-tutorial.html', icon: 'mdi-file-document-outline' },
          { title: 'Markdown 指南', url: 'https://www.markdownguide.org/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
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

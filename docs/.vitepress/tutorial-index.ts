// 自动生成，请勿手改：由 scripts/gen-tutorial-index.mjs 从 docs/tutorials/** 生成
export interface TutorialChapter { num: number; title: string; path: string }
export interface TutorialSeries { slug: string; title: string; chapters: TutorialChapter[] }

export const tutorialIndex: Record<string, TutorialSeries> = {
  "angular": {
    "slug": "angular",
    "title": "Angular 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Angular",
        "path": "/tutorials/angular/01-intro"
      },
      {
        "num": 2,
        "title": "组件与模板",
        "path": "/tutorials/angular/02-components-templates"
      },
      {
        "num": 3,
        "title": "指令与管道",
        "path": "/tutorials/angular/03-directives-pipes"
      },
      {
        "num": 4,
        "title": "依赖注入",
        "path": "/tutorials/angular/04-dependency-injection"
      },
      {
        "num": 5,
        "title": "服务与 RxJS 入门",
        "path": "/tutorials/angular/05-services-rxjs"
      },
      {
        "num": 6,
        "title": "路由",
        "path": "/tutorials/angular/06-router"
      },
      {
        "num": 7,
        "title": "表单",
        "path": "/tutorials/angular/07-forms"
      },
      {
        "num": 8,
        "title": "HTTP 与服务端交互",
        "path": "/tutorials/angular/08-http"
      },
      {
        "num": 9,
        "title": "生命周期与变更检测",
        "path": "/tutorials/angular/09-lifecycle-cd"
      },
      {
        "num": 10,
        "title": "Angular Material",
        "path": "/tutorials/angular/10-material"
      },
      {
        "num": 11,
        "title": "测试",
        "path": "/tutorials/angular/11-testing"
      },
      {
        "num": 12,
        "title": "工程化综合实战",
        "path": "/tutorials/angular/12-project"
      }
    ]
  },
  "css": {
    "slug": "css",
    "title": "CSS 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 CSS",
        "path": "/tutorials/css/01-overview"
      },
      {
        "num": 2,
        "title": "选择器与优先级",
        "path": "/tutorials/css/02-selectors"
      },
      {
        "num": 3,
        "title": "颜色与文本样式",
        "path": "/tutorials/css/03-color-text"
      },
      {
        "num": 4,
        "title": "盒子模型",
        "path": "/tutorials/css/04-box-model"
      },
      {
        "num": 5,
        "title": "背景边框与阴影",
        "path": "/tutorials/css/05-bg-border-shadow"
      },
      {
        "num": 6,
        "title": "显示模式与文档流",
        "path": "/tutorials/css/06-display-flow"
      },
      {
        "num": 7,
        "title": "浮动与清除",
        "path": "/tutorials/css/07-float"
      },
      {
        "num": 8,
        "title": "定位与层级",
        "path": "/tutorials/css/08-position"
      },
      {
        "num": 9,
        "title": "Flexbox 布局（上）",
        "path": "/tutorials/css/09-flexbox-1"
      },
      {
        "num": 10,
        "title": "Flexbox 布局（下）",
        "path": "/tutorials/css/10-flexbox-2"
      },
      {
        "num": 11,
        "title": "Grid 布局",
        "path": "/tutorials/css/11-grid"
      },
      {
        "num": 12,
        "title": "响应式与动画实战",
        "path": "/tutorials/css/12-responsive-animation"
      }
    ]
  },
  "docker": {
    "slug": "docker",
    "title": "Docker 教程",
    "chapters": [
      {
        "num": 1,
        "title": "容器概念与安装",
        "path": "/tutorials/docker/01-concepts-install"
      },
      {
        "num": 2,
        "title": "镜像与容器基本操作",
        "path": "/tutorials/docker/02-images-containers"
      },
      {
        "num": 3,
        "title": "编写 Dockerfile",
        "path": "/tutorials/docker/03-dockerfile"
      },
      {
        "num": 4,
        "title": "数据卷与网络",
        "path": "/tutorials/docker/04-volumes-networks"
      },
      {
        "num": 5,
        "title": "多阶段构建与镜像优化",
        "path": "/tutorials/docker/05-multi-stage"
      },
      {
        "num": 6,
        "title": "Docker Compose 编排",
        "path": "/tutorials/docker/06-compose"
      },
      {
        "num": 7,
        "title": "镜像仓库与 CI 发布",
        "path": "/tutorials/docker/07-registry-ci"
      },
      {
        "num": 8,
        "title": "综合实战：整套应用容器化",
        "path": "/tutorials/docker/08-project"
      }
    ]
  },
  "git": {
    "slug": "git",
    "title": "Git 教程",
    "chapters": [
      {
        "num": 1,
        "title": "版本控制与 Git 入门",
        "path": "/tutorials/git/01-introduction"
      },
      {
        "num": 2,
        "title": "基础操作",
        "path": "/tutorials/git/02-basic"
      },
      {
        "num": 3,
        "title": "分支管理",
        "path": "/tutorials/git/03-branch"
      },
      {
        "num": 4,
        "title": "远程仓库与 GitHub",
        "path": "/tutorials/git/04-remote"
      },
      {
        "num": 5,
        "title": "团队协作流程",
        "path": "/tutorials/git/05-collaboration"
      },
      {
        "num": 6,
        "title": "进阶技巧",
        "path": "/tutorials/git/06-advanced"
      },
      {
        "num": 7,
        "title": "实战场景与最佳实践",
        "path": "/tutorials/git/07-best-practices"
      }
    ]
  },
  "go": {
    "slug": "go",
    "title": "Go 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Go",
        "path": "/tutorials/go/01-intro"
      },
      {
        "num": 2,
        "title": "基础语法与流程控制",
        "path": "/tutorials/go/02-basic-syntax"
      },
      {
        "num": 3,
        "title": "复合类型：数组、切片、map",
        "path": "/tutorials/go/03-slices-maps"
      },
      {
        "num": 4,
        "title": "函数与错误处理",
        "path": "/tutorials/go/04-functions-errors"
      },
      {
        "num": 5,
        "title": "结构体与方法",
        "path": "/tutorials/go/05-structs-methods"
      },
      {
        "num": 6,
        "title": "接口与组合",
        "path": "/tutorials/go/06-interfaces"
      },
      {
        "num": 7,
        "title": "goroutine 与 channel",
        "path": "/tutorials/go/07-goroutines-channels"
      },
      {
        "num": 8,
        "title": "并发模式与 sync 包",
        "path": "/tutorials/go/08-concurrency-patterns"
      },
      {
        "num": 9,
        "title": "标准库精选与测试",
        "path": "/tutorials/go/09-stdlib-testing"
      },
      {
        "num": 10,
        "title": "综合实战：CLI 工具",
        "path": "/tutorials/go/10-cli-project"
      },
      {
        "num": 11,
        "title": "net/http 与 Web 基础",
        "path": "/tutorials/go/11-net-http"
      },
      {
        "num": 12,
        "title": "Gin 路由与中间件",
        "path": "/tutorials/go/12-gin"
      },
      {
        "num": 13,
        "title": "GORM 数据库与 REST 实战",
        "path": "/tutorials/go/13-gorm-rest"
      },
      {
        "num": 14,
        "title": "鉴权与部署",
        "path": "/tutorials/go/14-auth-deploy"
      }
    ]
  },
  "html": {
    "slug": "html",
    "title": "HTML 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 HTML",
        "path": "/tutorials/html/01-overview"
      },
      {
        "num": 2,
        "title": "基础语法与文档结构",
        "path": "/tutorials/html/02-syntax"
      },
      {
        "num": 3,
        "title": "文本标签",
        "path": "/tutorials/html/03-text"
      },
      {
        "num": 4,
        "title": "列表与表格",
        "path": "/tutorials/html/04-list-table"
      },
      {
        "num": 5,
        "title": "链接与图片",
        "path": "/tutorials/html/05-link-image"
      },
      {
        "num": 6,
        "title": "多媒体与 iframe",
        "path": "/tutorials/html/06-media"
      },
      {
        "num": 7,
        "title": "表单（上）：基础控件",
        "path": "/tutorials/html/07-form-basic"
      },
      {
        "num": 8,
        "title": "表单（下）：校验与进阶",
        "path": "/tutorials/html/08-form-advanced"
      },
      {
        "num": 9,
        "title": "语义化与页面结构",
        "path": "/tutorials/html/09-semantic"
      },
      {
        "num": 10,
        "title": "HTML5 进阶与综合实战",
        "path": "/tutorials/html/10-advanced"
      }
    ]
  },
  "java": {
    "slug": "java",
    "title": "Java 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Java",
        "path": "/tutorials/java/01-intro"
      },
      {
        "num": 2,
        "title": "基础语法与流程控制",
        "path": "/tutorials/java/02-basic-syntax"
      },
      {
        "num": 3,
        "title": "数组与字符串",
        "path": "/tutorials/java/03-arrays-strings"
      },
      {
        "num": 4,
        "title": "面向对象：类与对象",
        "path": "/tutorials/java/04-oop-classes"
      },
      {
        "num": 5,
        "title": "继承、多态与抽象类",
        "path": "/tutorials/java/05-inheritance-polymorphism"
      },
      {
        "num": 6,
        "title": "接口与内部类",
        "path": "/tutorials/java/06-interfaces"
      },
      {
        "num": 7,
        "title": "异常处理",
        "path": "/tutorials/java/07-exceptions"
      },
      {
        "num": 8,
        "title": "常用 API 与工具类",
        "path": "/tutorials/java/08-common-api"
      },
      {
        "num": 9,
        "title": "集合框架",
        "path": "/tutorials/java/09-collections"
      },
      {
        "num": 10,
        "title": "泛型深入",
        "path": "/tutorials/java/10-generics"
      },
      {
        "num": 11,
        "title": "IO 与文件",
        "path": "/tutorials/java/11-io-files"
      },
      {
        "num": 12,
        "title": "多线程基础",
        "path": "/tutorials/java/12-threads"
      },
      {
        "num": 13,
        "title": "线程池与并发工具",
        "path": "/tutorials/java/13-concurrency"
      },
      {
        "num": 14,
        "title": "反射与注解",
        "path": "/tutorials/java/14-reflection-annotations"
      },
      {
        "num": 15,
        "title": "Maven、JVM 入门与综合实战",
        "path": "/tutorials/java/15-maven-jvm-project"
      }
    ]
  },
  "javascript": {
    "slug": "javascript",
    "title": "JavaScript 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 JavaScript",
        "path": "/tutorials/javascript/01-overview"
      },
      {
        "num": 2,
        "title": "变量与数据类型",
        "path": "/tutorials/javascript/02-variables"
      },
      {
        "num": 3,
        "title": "运算符与流程控制",
        "path": "/tutorials/javascript/03-operators-control"
      },
      {
        "num": 4,
        "title": "函数基础",
        "path": "/tutorials/javascript/04-functions"
      },
      {
        "num": 5,
        "title": "对象入门",
        "path": "/tutorials/javascript/05-objects"
      },
      {
        "num": 6,
        "title": "数组",
        "path": "/tutorials/javascript/06-arrays"
      },
      {
        "num": 7,
        "title": "字符串与内置对象",
        "path": "/tutorials/javascript/07-strings-builtin"
      },
      {
        "num": 8,
        "title": "深入函数：闭包与递归",
        "path": "/tutorials/javascript/08-closures-recursion"
      },
      {
        "num": 9,
        "title": "面向对象与原型",
        "path": "/tutorials/javascript/09-prototype-class"
      },
      {
        "num": 10,
        "title": "DOM（上）：查找与操作",
        "path": "/tutorials/javascript/10-dom-1"
      },
      {
        "num": 11,
        "title": "DOM（下）：事件处理",
        "path": "/tutorials/javascript/11-dom-2"
      },
      {
        "num": 12,
        "title": "BOM 与浏览器存储",
        "path": "/tutorials/javascript/12-bom-storage"
      },
      {
        "num": 13,
        "title": "异步编程",
        "path": "/tutorials/javascript/13-async"
      },
      {
        "num": 14,
        "title": "模块化与综合实战",
        "path": "/tutorials/javascript/14-modules-project"
      }
    ]
  },
  "linux": {
    "slug": "linux",
    "title": "Linux 教程",
    "chapters": [
      {
        "num": 1,
        "title": "发行版、终端与 shell 基础",
        "path": "/tutorials/linux/01-shell-basics"
      },
      {
        "num": 2,
        "title": "文件系统与路径",
        "path": "/tutorials/linux/02-files-path"
      },
      {
        "num": 3,
        "title": "文件查看与文本处理",
        "path": "/tutorials/linux/03-text-tools"
      },
      {
        "num": 4,
        "title": "权限、用户与组",
        "path": "/tutorials/linux/04-permission-user"
      },
      {
        "num": 5,
        "title": "进程与服务管理",
        "path": "/tutorials/linux/05-process-systemd"
      },
      {
        "num": 6,
        "title": "软件安装与包管理",
        "path": "/tutorials/linux/06-packages"
      },
      {
        "num": 7,
        "title": "网络与排查",
        "path": "/tutorials/linux/07-network"
      },
      {
        "num": 8,
        "title": "磁盘、内存与性能观测",
        "path": "/tutorials/linux/08-performance"
      },
      {
        "num": 9,
        "title": "Shell 脚本编程",
        "path": "/tutorials/linux/09-shell-script"
      },
      {
        "num": 10,
        "title": "综合实战：把一台裸机变成可上线的服务器",
        "path": "/tutorials/linux/10-deploy-project"
      }
    ]
  },
  "markdown": {
    "slug": "markdown",
    "title": "Markdown 教程",
    "chapters": [
      {
        "num": 1,
        "title": "Markdown 基础语法",
        "path": "/tutorials/markdown/01-basic-syntax"
      },
      {
        "num": 2,
        "title": "表格、代码块与链接图片",
        "path": "/tutorials/markdown/02-tables-code"
      },
      {
        "num": 3,
        "title": "GFM 扩展语法",
        "path": "/tutorials/markdown/03-gfm"
      },
      {
        "num": 4,
        "title": "工具链与写作工作流",
        "path": "/tutorials/markdown/04-toolchain"
      }
    ]
  },
  "mysql": {
    "slug": "mysql",
    "title": "MySQL 教程",
    "chapters": [
      {
        "num": 1,
        "title": "安装与体系结构",
        "path": "/tutorials/mysql/01-architecture"
      },
      {
        "num": 2,
        "title": "数据类型与表设计",
        "path": "/tutorials/mysql/02-data-types-schema"
      },
      {
        "num": 3,
        "title": "索引与 B+ 树",
        "path": "/tutorials/mysql/03-index"
      },
      {
        "num": 4,
        "title": "执行计划与查询优化",
        "path": "/tutorials/mysql/04-explain-optimization"
      },
      {
        "num": 5,
        "title": "事务与 ACID",
        "path": "/tutorials/mysql/05-transactions"
      },
      {
        "num": 6,
        "title": "隔离级别与 MVCC",
        "path": "/tutorials/mysql/06-isolation-mvcc"
      },
      {
        "num": 7,
        "title": "锁与死锁",
        "path": "/tutorials/mysql/07-locks-deadlock"
      },
      {
        "num": 8,
        "title": "主从复制与读写分离",
        "path": "/tutorials/mysql/08-replication"
      },
      {
        "num": 9,
        "title": "高可用与备份恢复",
        "path": "/tutorials/mysql/09-high-availability"
      },
      {
        "num": 10,
        "title": "综合实战：一个订单库的优化全过程",
        "path": "/tutorials/mysql/10-project"
      }
    ]
  },
  "nodejs": {
    "slug": "nodejs",
    "title": "Node.js 与包管理教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Node.js 与安装",
        "path": "/tutorials/nodejs/01-overview"
      },
      {
        "num": 2,
        "title": "npm 基础：package.json 与依赖安装",
        "path": "/tutorials/nodejs/02-npm-basic"
      },
      {
        "num": 3,
        "title": "pnpm 与现代包管理",
        "path": "/tutorials/nodejs/03-pnpm"
      },
      {
        "num": 4,
        "title": "模块系统：CommonJS 与 ESM",
        "path": "/tutorials/nodejs/04-modules"
      },
      {
        "num": 5,
        "title": "核心模块：path / fs / http",
        "path": "/tutorials/nodejs/05-core-modules"
      },
      {
        "num": 6,
        "title": "Node 中的异步与事件循环",
        "path": "/tutorials/nodejs/06-async-loop"
      },
      {
        "num": 7,
        "title": "npm 进阶：脚本、发布与依赖治理",
        "path": "/tutorials/nodejs/07-npm-advanced"
      },
      {
        "num": 8,
        "title": "workspace 与 monorepo",
        "path": "/tutorials/nodejs/08-workspace-monorepo"
      },
      {
        "num": 9,
        "title": "Express 入门",
        "path": "/tutorials/nodejs/09-express"
      },
      {
        "num": 10,
        "title": "REST API 实战",
        "path": "/tutorials/nodejs/10-rest-api"
      },
      {
        "num": 11,
        "title": "环境变量与调试",
        "path": "/tutorials/nodejs/11-env-debug"
      },
      {
        "num": 12,
        "title": "部署与 PM2",
        "path": "/tutorials/nodejs/12-deploy-pm2"
      }
    ]
  },
  "python": {
    "slug": "python",
    "title": "Python 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Python",
        "path": "/tutorials/python/01-intro"
      },
      {
        "num": 2,
        "title": "基础语法与流程控制",
        "path": "/tutorials/python/02-basic-syntax"
      },
      {
        "num": 3,
        "title": "核心数据结构：list / tuple / dict / set",
        "path": "/tutorials/python/03-data-structures"
      },
      {
        "num": 4,
        "title": "函数与作用域",
        "path": "/tutorials/python/04-functions"
      },
      {
        "num": 5,
        "title": "面向对象：类与继承",
        "path": "/tutorials/python/05-oop"
      },
      {
        "num": 6,
        "title": "魔术方法与迭代器生成器",
        "path": "/tutorials/python/06-magic-methods"
      },
      {
        "num": 7,
        "title": "模块与包",
        "path": "/tutorials/python/07-modules-packages"
      },
      {
        "num": 8,
        "title": "标准库精选",
        "path": "/tutorials/python/08-stdlib"
      },
      {
        "num": 9,
        "title": "文件与异常",
        "path": "/tutorials/python/09-files-exceptions"
      },
      {
        "num": 10,
        "title": "装饰器与函数式特性",
        "path": "/tutorials/python/10-decorators-functional"
      },
      {
        "num": 11,
        "title": "并发初见：线程与异步",
        "path": "/tutorials/python/11-concurrency"
      },
      {
        "num": 12,
        "title": "工程化与综合实战",
        "path": "/tutorials/python/12-project"
      }
    ]
  },
  "react": {
    "slug": "react",
    "title": "React 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 React",
        "path": "/tutorials/react/01-intro"
      },
      {
        "num": 2,
        "title": "JSX 与组件",
        "path": "/tutorials/react/02-jsx-components"
      },
      {
        "num": 3,
        "title": "状态与事件",
        "path": "/tutorials/react/03-state-events"
      },
      {
        "num": 4,
        "title": "列表与条件渲染",
        "path": "/tutorials/react/04-lists-conditional"
      },
      {
        "num": 5,
        "title": "Hooks 入门：useState 与 useEffect",
        "path": "/tutorials/react/05-hooks-basics"
      },
      {
        "num": 6,
        "title": "组件通信",
        "path": "/tutorials/react/06-component-communication"
      },
      {
        "num": 7,
        "title": "React Router 路由",
        "path": "/tutorials/react/07-router"
      },
      {
        "num": 8,
        "title": "状态管理：Zustand",
        "path": "/tutorials/react/08-zustand"
      },
      {
        "num": 9,
        "title": "样式方案",
        "path": "/tutorials/react/09-styling"
      },
      {
        "num": 10,
        "title": "表单与数据请求",
        "path": "/tutorials/react/10-forms-fetching"
      },
      {
        "num": 11,
        "title": "性能优化",
        "path": "/tutorials/react/11-performance"
      },
      {
        "num": 12,
        "title": "综合实战",
        "path": "/tutorials/react/12-project"
      }
    ]
  },
  "redis": {
    "slug": "redis",
    "title": "Redis 教程",
    "chapters": [
      {
        "num": 1,
        "title": "为什么用 Redis 与安装",
        "path": "/tutorials/redis/01-intro"
      },
      {
        "num": 2,
        "title": "五大数据类型实战",
        "path": "/tutorials/redis/02-data-types"
      },
      {
        "num": 3,
        "title": "key 设计与过期淘汰",
        "path": "/tutorials/redis/03-keys-expiry"
      },
      {
        "num": 4,
        "title": "持久化：RDB 与 AOF",
        "path": "/tutorials/redis/04-persistence"
      },
      {
        "num": 5,
        "title": "事务与 Lua 脚本",
        "path": "/tutorials/redis/05-tx-lua"
      },
      {
        "num": 6,
        "title": "发布订阅与 Stream",
        "path": "/tutorials/redis/06-pubsub-stream"
      },
      {
        "num": 7,
        "title": "主从、哨兵与集群",
        "path": "/tutorials/redis/07-cluster"
      },
      {
        "num": 8,
        "title": "综合实战：缓存三兄弟与一个商品详情缓存",
        "path": "/tutorials/redis/08-cache-project"
      }
    ]
  },
  "regex": {
    "slug": "regex",
    "title": "正则表达式教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识正则表达式",
        "path": "/tutorials/regex/01-introduction"
      },
      {
        "num": 2,
        "title": "元字符与字符类",
        "path": "/tutorials/regex/02-characters"
      },
      {
        "num": 3,
        "title": "量词、分组与引用",
        "path": "/tutorials/regex/03-quantifiers-groups"
      },
      {
        "num": 4,
        "title": "常用场景实战",
        "path": "/tutorials/regex/04-practice"
      },
      {
        "num": 5,
        "title": "各语言中的正则",
        "path": "/tutorials/regex/05-languages"
      }
    ]
  },
  "rust": {
    "slug": "rust",
    "title": "Rust 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Rust",
        "path": "/tutorials/rust/01-intro"
      },
      {
        "num": 2,
        "title": "变量、类型与流程控制",
        "path": "/tutorials/rust/02-basic-syntax"
      },
      {
        "num": 3,
        "title": "所有权",
        "path": "/tutorials/rust/03-ownership"
      },
      {
        "num": 4,
        "title": "借用与引用",
        "path": "/tutorials/rust/04-borrowing"
      },
      {
        "num": 5,
        "title": "结构体与枚举",
        "path": "/tutorials/rust/05-structs-enums"
      },
      {
        "num": 6,
        "title": "模式匹配",
        "path": "/tutorials/rust/06-pattern-matching"
      },
      {
        "num": 7,
        "title": "错误处理",
        "path": "/tutorials/rust/07-error-handling"
      },
      {
        "num": 8,
        "title": "泛型与 trait",
        "path": "/tutorials/rust/08-generics-traits"
      },
      {
        "num": 9,
        "title": "生命周期",
        "path": "/tutorials/rust/09-lifetimes"
      },
      {
        "num": 10,
        "title": "集合、闭包与迭代器",
        "path": "/tutorials/rust/10-collections-closures-iterators"
      },
      {
        "num": 11,
        "title": "智能指针与内部可变性",
        "path": "/tutorials/rust/11-smart-pointers"
      },
      {
        "num": 12,
        "title": "模块系统与测试",
        "path": "/tutorials/rust/12-modules-testing"
      },
      {
        "num": 13,
        "title": "并发编程",
        "path": "/tutorials/rust/13-concurrency"
      },
      {
        "num": 14,
        "title": "综合实战：CLI 工具",
        "path": "/tutorials/rust/14-cli-project"
      },
      {
        "num": 15,
        "title": "Axum 初见：Web 服务",
        "path": "/tutorials/rust/15-axum-web"
      }
    ]
  },
  "sql": {
    "slug": "sql",
    "title": "SQL 基础教程",
    "chapters": [
      {
        "num": 1,
        "title": "关系模型与 SQL 方言",
        "path": "/tutorials/sql/01-relational-model"
      },
      {
        "num": 2,
        "title": "环境与客户端",
        "path": "/tutorials/sql/02-environment"
      },
      {
        "num": 3,
        "title": "查询基础",
        "path": "/tutorials/sql/03-select-basics"
      },
      {
        "num": 4,
        "title": "过滤、排序与分页",
        "path": "/tutorials/sql/04-filter-sort-page"
      },
      {
        "num": 5,
        "title": "聚合与分组",
        "path": "/tutorials/sql/05-aggregate-group"
      },
      {
        "num": 6,
        "title": "多表连接",
        "path": "/tutorials/sql/06-joins"
      },
      {
        "num": 7,
        "title": "子查询与 CTE",
        "path": "/tutorials/sql/07-subquery-cte"
      },
      {
        "num": 8,
        "title": "数据修改与约束",
        "path": "/tutorials/sql/08-dml-ddl"
      }
    ]
  },
  "tailwind": {
    "slug": "tailwind",
    "title": "Tailwind CSS 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Tailwind CSS",
        "path": "/tutorials/tailwind/01-intro"
      },
      {
        "num": 2,
        "title": "安装与配置",
        "path": "/tutorials/tailwind/02-setup"
      },
      {
        "num": 3,
        "title": "布局与盒模型工具类",
        "path": "/tutorials/tailwind/03-box-model"
      },
      {
        "num": 4,
        "title": "排版与颜色",
        "path": "/tutorials/tailwind/04-typography-color"
      },
      {
        "num": 5,
        "title": "Flex 与 Grid 工具类",
        "path": "/tutorials/tailwind/05-flex-grid"
      },
      {
        "num": 6,
        "title": "响应式与状态变体",
        "path": "/tutorials/tailwind/06-responsive-variants"
      },
      {
        "num": 7,
        "title": "主题定制与暗色模式",
        "path": "/tutorials/tailwind/07-theming-dark"
      },
      {
        "num": 8,
        "title": "综合实战",
        "path": "/tutorials/tailwind/08-project"
      }
    ]
  },
  "typescript": {
    "slug": "typescript",
    "title": "TypeScript 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 TypeScript",
        "path": "/tutorials/typescript/01-overview"
      },
      {
        "num": 2,
        "title": "基础类型",
        "path": "/tutorials/typescript/02-basic-types"
      },
      {
        "num": 3,
        "title": "接口与类型别名",
        "path": "/tutorials/typescript/03-interface-type"
      },
      {
        "num": 4,
        "title": "函数与类型",
        "path": "/tutorials/typescript/04-functions"
      },
      {
        "num": 5,
        "title": "联合类型与类型收窄",
        "path": "/tutorials/typescript/05-unions-narrowing"
      },
      {
        "num": 6,
        "title": "泛型",
        "path": "/tutorials/typescript/06-generics"
      },
      {
        "num": 7,
        "title": "枚举与类型编程入门",
        "path": "/tutorials/typescript/07-enum-mapped"
      },
      {
        "num": 8,
        "title": "类与面向对象",
        "path": "/tutorials/typescript/08-class"
      },
      {
        "num": 9,
        "title": "工程化配置",
        "path": "/tutorials/typescript/09-tsconfig"
      },
      {
        "num": 10,
        "title": "综合实战",
        "path": "/tutorials/typescript/10-project"
      }
    ]
  },
  "vite": {
    "slug": "vite",
    "title": "Vite 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Vite",
        "path": "/tutorials/vite/01-intro"
      },
      {
        "num": 2,
        "title": "项目结构与配置文件",
        "path": "/tutorials/vite/02-config"
      },
      {
        "num": 3,
        "title": "开发服务器与插件",
        "path": "/tutorials/vite/03-devserver-plugins"
      },
      {
        "num": 4,
        "title": "静态资源处理",
        "path": "/tutorials/vite/04-assets"
      },
      {
        "num": 5,
        "title": "构建与优化",
        "path": "/tutorials/vite/05-build"
      },
      {
        "num": 6,
        "title": "原理浅析与常见问题",
        "path": "/tutorials/vite/06-internals-faq"
      }
    ]
  },
  "vscode": {
    "slug": "vscode",
    "title": "VS Code 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 VS Code",
        "path": "/tutorials/vscode/01-overview"
      },
      {
        "num": 2,
        "title": "安装与基础配置",
        "path": "/tutorials/vscode/02-setup"
      },
      {
        "num": 3,
        "title": "必备插件推荐",
        "path": "/tutorials/vscode/03-extensions"
      },
      {
        "num": 4,
        "title": "核心功能详解",
        "path": "/tutorials/vscode/04-features"
      },
      {
        "num": 5,
        "title": "效率进阶",
        "path": "/tutorials/vscode/05-productivity"
      }
    ]
  },
  "vue": {
    "slug": "vue",
    "title": "Vue 3 教程",
    "chapters": [
      {
        "num": 1,
        "title": "初识 Vue 3",
        "path": "/tutorials/vue/01-intro"
      },
      {
        "num": 2,
        "title": "模板语法",
        "path": "/tutorials/vue/02-template-syntax"
      },
      {
        "num": 3,
        "title": "响应式基础",
        "path": "/tutorials/vue/03-reactivity"
      },
      {
        "num": 4,
        "title": "侦听与生命周期",
        "path": "/tutorials/vue/04-watch-lifecycle"
      },
      {
        "num": 5,
        "title": "组件基础",
        "path": "/tutorials/vue/05-components-basics"
      },
      {
        "num": 6,
        "title": "组件进阶",
        "path": "/tutorials/vue/06-components-advanced"
      },
      {
        "num": 7,
        "title": "条件与列表渲染",
        "path": "/tutorials/vue/07-condition-list"
      },
      {
        "num": 8,
        "title": "表单处理",
        "path": "/tutorials/vue/08-forms"
      },
      {
        "num": 9,
        "title": "组合式函数",
        "path": "/tutorials/vue/09-composables"
      },
      {
        "num": 10,
        "title": "路由 Vue Router",
        "path": "/tutorials/vue/10-router"
      },
      {
        "num": 11,
        "title": "状态管理 Pinia",
        "path": "/tutorials/vue/11-pinia"
      },
      {
        "num": 12,
        "title": "工程化与综合实战",
        "path": "/tutorials/vue/12-project"
      }
    ]
  }
}

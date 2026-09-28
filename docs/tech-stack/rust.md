<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Rust 技术路线',
  description: 'Rust 是一门系统级编程语言，以内存安全、零成本抽象和卓越性能著称，在系统编程、WebAssembly 和区块链领域增长迅速。',

  items: [
    {
      name: '入门 · 环境与语法基础', subtitle: '必修',
      children: [
        { title: '本站原创教程：Rust（15 章）', description: '站内原创系列教程：从零开始，前置只需基础编程经验（无需系统编程背景），覆盖所有权与借用、结构体与模式匹配、错误处理、泛型与 trait、生命周期、集合闭包与迭代器、智能指针、模块与测试、并发，以及 CLI 与 Axum 两场实战，共 15 章。', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '教程封面 · Rust', url: '/tutorials/rust/' }, { title: '初识 Rust', url: '/tutorials/rust/01-intro' }, { title: '变量、类型与流程控制', url: '/tutorials/rust/02-basic-syntax' }, { title: '所有权', url: '/tutorials/rust/03-ownership' }, { title: '借用与引用', url: '/tutorials/rust/04-borrowing' }, { title: '结构体与枚举', url: '/tutorials/rust/05-structs-enums' }, { title: '模式匹配', url: '/tutorials/rust/06-pattern-matching' }, { title: '错误处理', url: '/tutorials/rust/07-error-handling' }, { title: '泛型与 trait', url: '/tutorials/rust/08-generics-traits' }, { title: '生命周期', url: '/tutorials/rust/09-lifetimes' }, { title: '集合、闭包与迭代器', url: '/tutorials/rust/10-collections-closures-iterators' }, { title: '智能指针与内部可变性', url: '/tutorials/rust/11-smart-pointers' }, { title: '模块系统与测试', url: '/tutorials/rust/12-modules-testing' }, { title: '并发编程', url: '/tutorials/rust/13-concurrency' }, { title: '综合实战：CLI 工具', url: '/tutorials/rust/14-cli-project' }, { title: 'Axum 初见：Web 服务', url: '/tutorials/rust/15-axum-web' }] }] },
        { title: 'rustup 与 Cargo 工具链 · 环境搭建', description: '用 rustup 安装工具链、管理 stable/beta/nightly 与多平台 target，熟悉 rustc/cargo/rustfmt/clippy 组件' },
        { title: '第一个程序与编译运行流程', description: 'hello world、rustc 直接编译与 cargo new/build/run/check 的区别、debug 与 release 构建' },
        { title: 'Rust 语法入门', description: '变量与可变性、数据类型、函数、控制流', resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust 语言入门', url: 'https://www.bilibili.com/video/BV1hp4y1k7SV', icon: 'mdi-play-circle-outline' }, { title: 'Rust Crash Course', url: 'https://www.youtube.com/watch?v=zF34dRivLOw', icon: 'mdi-play-circle-outline' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust 程序设计语言', url: 'https://kaisery.github.io/trpl-zh-cn/', icon: 'mdi-file-document-outline' }, { title: 'The Rust Book', url: 'https://doc.rust-lang.org/book/', icon: 'mdi-file-document-outline' }] }, { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '初识 Rust', url: '/tutorials/rust/01-intro' }] }] },
        { title: '变量、类型与流程控制', description: '标量与复合类型、类型推导与显式标注、if/loop/while/for、表达式语义', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '变量、类型与流程控制', url: '/tutorials/rust/02-basic-syntax' }] }] },
      ]
    },
    {
      name: '进阶 · 核心机制与标准库', subtitle: '必修',
      children: [
        { title: '所有权与借用', description: '所有权规则、引用与借用、生命周期标注', resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust 所有权详解', url: 'https://www.bilibili.com/video/BV1tZ4y1a7uC', icon: 'mdi-play-circle-outline' }, { title: 'Rust 所有权视频讲解', url: 'https://www.youtube.com/watch?v=y7PrSyR1gX0', icon: 'mdi-play-circle-outline' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust 所有权', url: 'https://kaisery.github.io/trpl-zh-cn/ch04-00-understanding-ownership.html', icon: 'mdi-file-document-outline' }, { title: 'Understanding Ownership', url: 'https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html', icon: 'mdi-file-document-outline' }] }, { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '所有权', url: '/tutorials/rust/03-ownership' }, { title: '借用与引用', url: '/tutorials/rust/04-borrowing' }] }] },
        { title: '结构体与枚举', description: 'struct、enum、Option、Result、模式匹配', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '结构体与枚举', url: '/tutorials/rust/05-structs-enums' }] }] },
        { title: '模式匹配', description: 'match 表达式、match 臂与守卫、ref/mut 绑定、其他位置的模式（if let/while let/let/参数）', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '模式匹配', url: '/tutorials/rust/06-pattern-matching' }] }] },
        { title: '泛型与 trait', description: '泛型函数/结构体、trait 定义与实现、trait 约束', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '泛型与 trait', url: '/tutorials/rust/08-generics-traits' }] }] },
        { title: '错误处理', description: 'panic!、Result<T, E>、? 运算符、自定义错误类型', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '错误处理', url: '/tutorials/rust/07-error-handling' }] }] },
        { title: '集合类型', description: 'Vec、HashMap、String、HashSet 与性能特性', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '集合、闭包与迭代器', url: '/tutorials/rust/10-collections-closures-iterators' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust 集合', url: 'https://kaisery.github.io/trpl-zh-cn/ch08-00-common-collections.html', icon: 'mdi-file-document-outline' }, { title: 'Rust Collections', url: 'https://doc.rust-lang.org/book/ch08-00-common-collections.html', icon: 'mdi-file-document-outline' }] }] },
        { title: '闭包与迭代器', description: '闭包捕获环境、Iterator trait、消费器与适配器', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '集合、闭包与迭代器', url: '/tutorials/rust/10-collections-closures-iterators' }] }] },
        { title: '智能指针', description: 'Box、Rc、Arc、RefCell、内部可变性模式', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '智能指针与内部可变性', url: '/tutorials/rust/11-smart-pointers' }] }] },
        { title: '生命周期深入', description: '生命周期省略规则、结构体生命周期、静态生命周期', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '生命周期', url: '/tutorials/rust/09-lifetimes' }] }, { name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust Lifetimes', url: 'https://www.youtube.com/watch?v=1QoT9fmPYr8', icon: 'mdi-play-circle-outline' }, { title: 'Rust 生命周期视频讲解', url: 'https://www.youtube.com/watch?v=4EsS18U5nKI', icon: 'mdi-play-circle-outline' }] }] },
        { title: '模块化与测试', description: '模块系统、Cargo 工作空间、单元测试与集成测试', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '模块系统与测试', url: '/tutorials/rust/12-modules-testing' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Cargo 官方文档', url: 'https://doc.rust-lang.org/cargo/', icon: 'mdi-file-document-outline' }] }] },
      ]
    },
    {
      name: '精通 · 并发、内存与性能', subtitle: '必修',
      children: [
        { title: '并发编程', description: '线程创建、消息传递（mpsc）、互斥锁（Mutex）、Send/Sync trait', resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发编程', url: '/tutorials/rust/13-concurrency' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust 并发', url: 'https://kaisery.github.io/trpl-zh-cn/ch16-00-concurrency.html', icon: 'mdi-file-document-outline' }, { title: 'Rust Concurrency', url: 'https://doc.rust-lang.org/book/ch16-00-concurrency.html', icon: 'mdi-file-document-outline' }] }] },
        { title: 'Send 与 Sync · 并发安全边界', description: 'Send/Sync marker trait 的定义与自动推导、跨线程移动与共享引用的编译期保证、Rc/RefCell 为何非 Send/Sync' },
        { title: '异步编程', description: 'async/await、Future trait、Tokio 运行时、异步 I/O', resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust Async', url: 'https://www.youtube.com/watch?v=Thgv3Bkqbbg', icon: 'mdi-play-circle-outline' }, { title: 'Tokio 教程', url: 'https://tokio.rs/tokio/tutorial', icon: 'mdi-play-circle-outline' }] }] },
        { title: '异步运行时与 Future 底层', description: '状态机变换、Waker 与轮询模型、任务调度、select 与取消语义、spawn_local 与 !Send Future' },
        { title: 'unsafe Rust 与裸指针', description: 'unsafe 的四种能力、裸指针与 slice 裸指针、UB 边界、std 内 unsafe 抽象的封装方式' },
        { title: '宏：声明宏与过程宏', description: 'macro_rules! 声明宏、matchers 与片段说明符、derive/attr/macro 三类过程宏、syn 与 quote' },
        { title: '内存布局与性能剖析优化', description: '栈与堆、对齐与 size_of、缓存友好设计、perf/flamegraph 剖析、迭代器零成本抽象验证' },
        { title: 'FFI 与外部接口', description: '调用 C 函数、Rust 导出给 C 使用、bindgen' },
        { title: 'Cargo workspace 与发布工程化', description: '多 crate 工作空间、feature 管理与裁剪、版本语义、docs.rs 与 crates.io 发布流程' },
      ]
    },
    {
      name: '实战与生态 · 框架、工程化与部署', subtitle: '选修',
      children: [
        { title: 'Cargo 包管理', description: '依赖管理、自定义命令、发布到 crates.io', resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Cargo 中文指南', url: 'https://cargo.budshome.com/', icon: 'mdi-file-document-outline' }, { title: 'Cargo Book', url: 'https://doc.rust-lang.org/cargo/', icon: 'mdi-file-document-outline' }] }] },
        { title: '常用库', description: 'serde（序列化）、reqwest（HTTP）、tokio（异步运行时）', resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Tokio 官方指南', url: 'https://tokio.rs/tokio/tutorial', icon: 'mdi-file-document-outline' }, { title: 'Serde 文档', url: 'https://serde.rs/', icon: 'mdi-file-document-outline' }] }] },
        { title: '错误处理与日志生态', description: 'anyhow、thiserror、log、tracing' },
        { title: 'Tokio 异步生态实战', description: 'runtime 多线程调度、tokio-util、异步渠道与优雅关停、tracing 集成' },
        { title: 'Web 开发', description: 'Actix-web / Axum / Rocket 框架、REST API、数据库（sqlx / diesel）', optional: true, resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'Axum 初见：Web 服务', url: '/tutorials/rust/15-axum-web' }] }, { name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust Web 开发', url: 'https://www.bilibili.com/video/BV1FJ411U7a6', icon: 'mdi-play-circle-outline' }, { title: 'Axum 教程', url: 'https://www.youtube.com/watch?v=XZtlD_mP4pQ', icon: 'mdi-play-circle-outline' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Actix-web 文档', url: 'https://actix.rs/docs/', icon: 'mdi-file-document-outline' }, { title: 'Axum 官方文档', url: 'https://docs.rs/axum/', icon: 'mdi-file-document-outline' }] }] },
        { title: 'Axum 实战', description: 'Router 与 handler、Extractor/IntoResponse 模型、State 共享、中间件层 Tower 集成', optional: true, resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Axum 官方文档', url: 'https://docs.rs/axum/', icon: 'mdi-file-document-outline' }] }] },
        { title: 'sqlx 与 diesel 数据库访问', description: 'sqlx 编译期校验查询与连接池、diesel ORM 与 schema 迁移、事务处理', optional: true },
        { title: 'WebAssembly', description: 'wasm-pack 构建、JS 互操作、WebGL 渲染', optional: true, resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Rust WASM 教程', url: 'https://www.bilibili.com/video/BV1eg411g7Jc', icon: 'mdi-play-circle-outline' }, { title: 'Rust WASM', url: 'https://www.youtube.com/watch?v=4fNro7Dz6rY', icon: 'mdi-play-circle-outline' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust WASM 官方指南', url: 'https://rustwasm.github.io/docs/book/', icon: 'mdi-file-document-outline' }] }] },
        { title: 'CLI 与系统工具', description: 'clap 命令行解析、Rust 编写系统工具、替代 C 工具', optional: true, resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '综合实战：CLI 工具', url: '/tutorials/rust/14-cli-project' }] }, { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'clap 文档', url: 'https://docs.rs/clap/', icon: 'mdi-file-document-outline' }, { title: 'Command Line Apps in Rust', url: 'https://rust-cli.github.io/book/', icon: 'mdi-file-document-outline' }] }] },
        { title: '网络编程', description: 'TCP/UDP 套接字、gRPC（tonic）、TLS', optional: true, resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Rust Network Programming', url: 'https://www.cs.brandeis.edu/~cs146a/rust/doc-02-21-2015/book/README.html', icon: 'mdi-file-document-outline' }] }] },
        { title: '区块链开发', description: 'Solana 智能合约、Substrate 框架、Web3.rs', optional: true, resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Solana 开发文档', url: 'https://docs.solana.com/', icon: 'mdi-file-document-outline' }, { title: 'Substrate 教程', url: 'https://docs.substrate.io/tutorials/', icon: 'mdi-file-document-outline' }] }] },
        { title: 'CI 与交叉编译部署', description: 'GitHub Actions 测试/clippy/fmt 门禁、cross 跨平台构建、musl 静态链接与容器化发布', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />

<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Rust 技术路线',
  description: 'Rust 是一门系统级编程语言，以内存安全、零成本抽象和卓越性能著称，在系统编程、WebAssembly 和区块链领域增长迅速。',

  items: [
    {
      name: 'Rust 语言基础', subtitle: '必修',
      children: [
        { title: 'Rust 语法入门', description: '变量与可变性、数据类型、函数、控制流', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust 语言入门", url: "https://www.bilibili.com/video/BV1hp4y1k7SV", icon: "mdi-play-circle-outline" }, { title: "Rust Crash Course", url: "https://www.youtube.com/watch?v=zF34dRivLOw", icon: "mdi-play-circle-outline" }] }], groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust 程序设计语言", url: "https://kaisery.github.io/trpl-zh-cn/", icon: "mdi-file-document-outline" }, { title: "The Rust Book", url: "https://doc.rust-lang.org/book/", icon: "mdi-file-document-outline" }] }] },
        { title: '所有权与借用', description: '所有权规则、引用与借用、生命周期标注', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust 所有权详解", url: "https://www.bilibili.com/video/BV1tZ4y1a7uC", icon: "mdi-play-circle-outline" }, { title: "Let\\", url: "https://www.youtube.com/watch?v=y7PrSyR1gX0", icon: "mdi-play-circle-outline" }] }], groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust 所有权", url: "https://kaisery.github.io/trpl-zh-cn/ch04-00-understanding-ownership.html", icon: "mdi-file-document-outline" }, { title: "Understanding Ownership", url: "https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html", icon: "mdi-file-document-outline" }] }] },
        { title: '结构体与枚举', description: 'struct、enum、Option、Result、模式匹配' },
        { title: '泛型与 trait', description: '泛型函数/结构体、trait 定义与实现、trait 约束' },
        { title: '错误处理', description: 'panic!、Result<T, E>、? 运算符、自定义错误类型' },
      ]
    },
    {
      name: 'Rust 核心进阶', subtitle: '必修',
      children: [
        { title: '集合类型', description: 'Vec、HashMap、String、HashSet 与性能特性', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust 集合", url: "https://kaisery.github.io/trpl-zh-cn/ch08-00-common-collections.html", icon: "mdi-file-document-outline" }, { title: "Rust Collections", url: "https://doc.rust-lang.org/book/ch08-00-common-collections.html", icon: "mdi-file-document-outline" }] }] },
        { title: '闭包与迭代器', description: '闭包捕获环境、Iterator trait、消费器与适配器' },
        { title: '智能指针', description: 'Box、Rc、Arc、RefCell、内部可变性模式' },
        { title: '生命周期深入', description: '生命周期省略规则、结构体生命周期、静态生命周期', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust Lifetimes", url: "https://www.youtube.com/watch?v=1QoT9fmPYr8", icon: "mdi-play-circle-outline" }, { title: "Let\\", url: "https://www.youtube.com/watch?v=4EsS18U5nKI", icon: "mdi-play-circle-outline" }] }] },
        { title: '并发编程', description: '线程创建、消息传递（mpsc）、互斥锁（Mutex）、Send/Sync trait', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust 并发", url: "https://kaisery.github.io/trpl-zh-cn/ch16-00-concurrency.html", icon: "mdi-file-document-outline" }, { title: "Rust Concurrency", url: "https://doc.rust-lang.org/book/ch16-00-concurrency.html", icon: "mdi-file-document-outline" }] }] },
        { title: '模块化与测试', description: '模块系统、Cargo 工作空间、单元测试与集成测试', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Cargo 官方文档", url: "https://doc.rust-lang.org/cargo/", icon: "mdi-file-document-outline" }] }] },
      ]
    },
    {
      name: 'Rust 生态与工具', subtitle: '必修',
      children: [
        { title: 'Cargo 包管理', description: '依赖管理、自定义命令、发布到 crates.io', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Cargo 中文指南", url: "https://cargo.budshome.com/", icon: "mdi-file-document-outline" }, { title: "Cargo Book", url: "https://doc.rust-lang.org/cargo/", icon: "mdi-file-document-outline" }] }] },
        { title: '常用库', description: 'serde（序列化）、reqwest（HTTP）、tokio（异步运行时）', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Tokio 官方指南", url: "https://tokio.rs/tokio/tutorial", icon: "mdi-file-document-outline" }, { title: "Serde 文档", url: "https://serde.rs/", icon: "mdi-file-document-outline" }] }] },
        { title: '异步编程', description: 'async/await、Future trait、Tokio 运行时、异步 I/O', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust Async", url: "https://www.youtube.com/watch?v=Thgv3Bkqbbg", icon: "mdi-play-circle-outline" }, { title: "Tokio 教程", url: "https://tokio.rs/tokio/tutorial", icon: "mdi-play-circle-outline" }] }] },
        { title: '错误处理与日志', description: 'anyhow、thiserror、log、tracing' },
        { title: 'FFI 与外部接口', description: '调用 C 函数、Rust 导出给 C 使用、bindgen' },
      ]
    },
    {
      name: '领域方向', subtitle: '选修',
      children: [
        { title: 'WebAssembly', description: 'wasm-pack 构建、JS 互操作、WebGL 渲染', optional: true, groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust WASM 教程", url: "https://www.bilibili.com/video/BV1eg411g7Jc", icon: "mdi-play-circle-outline" }, { title: "Rust WASM", url: "https://www.youtube.com/watch?v=4fNro7Dz6rY", icon: "mdi-play-circle-outline" }] }], groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust WASM 官方指南", url: "https://rustwasm.github.io/docs/book/", icon: "mdi-file-document-outline" }] }] },
        { title: 'Web 开发', description: 'Actix-web / Axum / Rocket 框架、REST API、数据库（sqlx / diesel）', optional: true, groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Rust Web 开发", url: "https://www.bilibili.com/video/BV1FJ411U7a6", icon: "mdi-play-circle-outline" }, { title: "Axum 教程", url: "https://www.youtube.com/watch?v=XZtlD_mP4pQ", icon: "mdi-play-circle-outline" }] }], groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Actix-web 文档", url: "https://actix.rs/docs/", icon: "mdi-file-document-outline" }, { title: "Axum 官方文档", url: "https://docs.rs/axum/", icon: "mdi-file-document-outline" }] }] },
        { title: '区块链开发', description: 'Solana 智能合约、Substrate 框架、Web3.rs', optional: true, groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Solana 开发文档", url: "https://docs.solana.com/", icon: "mdi-file-document-outline" }, { title: "Substrate 教程", url: "https://docs.substrate.io/tutorials/", icon: "mdi-file-document-outline" }] }] },
        { title: 'CLI 与系统工具', description: 'clap 命令行解析、Rust 编写系统工具、替代 C 工具', optional: true, groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "clap 文档", url: "https://docs.rs/clap/", icon: "mdi-file-document-outline" }, { title: "Command Line Apps in Rust", url: "https://rust-cli.github.io/book/", icon: "mdi-file-document-outline" }] }] },
        { title: '网络编程', description: 'TCP/UDP 套接字、gRPC（tonic）、TLS', optional: true, groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Rust Network Programming", url: "https://www.cs.brandeis.edu/~cs146a/rust/doc-02-21-2015/book/README.html", icon: "mdi-file-document-outline" }] }] },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />

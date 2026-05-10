<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Kotlin / Swift / Dart 技术路线',
  description: '这三门语言分别主导 Android、iOS 和 Flutter 跨平台开发。',

  items: [
    {
      name: '选择方向', subtitle: '必修',
      children: [
        { title: '明确目标', description: '原生 Android（Kotlin）还是原生 iOS（Swift）还是跨平台（Flutter/Dart）' },
        { title: '开发环境搭建', description: 'Android Studio / Xcode / VS Code + Flutter SDK' },
        { title: '模拟器与真机调试', description: '模拟器配置、USB 调试、无线调试' },
        { title: '版本控制', description: 'Git 初始化、.gitignore 配置、分支管理' },
      ]
    },
    {
      name: '语言与 UI 基础', subtitle: '必修',
      children: [
        { title: '[Kotlin] Kotlin 基础语法', description: '变量声明 val/var、空安全、数据类、扩展函数', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "尚硅谷Kotlin教程", url: "https://www.bilibili.com/video/BV1Z44y1p7iU", icon: "mdi-play-circle-outline" }] }] },
        { title: '[Kotlin] Kotlin 函数式特性', description: 'lambda 表达式、高阶函数、集合操作符' },
        { title: '[Kotlin] 协程入门', description: 'launch/async、挂起函数 suspend、Dispatcher 调度器', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Kotlin协程指南", url: "https://kotlinlang.org/docs/coroutines-guide.html", icon: "mdi-file-document-outline" }] }] },
        { title: '[Kotlin] Android 项目结构', description: 'Activity/Fragment、AndroidManifest、资源管理' },
        { title: '[Kotlin] XML 布局', description: 'ConstraintLayout/LinearLayout、RecyclerView、ViewBinding' },
        { title: '[Kotlin] Jetpack Compose', description: 'Composable 函数、状态管理、布局组件', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Jetpack Compose官方文档", url: "https://developer.android.com/jetpack/compose", icon: "mdi-file-document-outline" }] }] },
        { title: '[Kotlin] Intent 与导航', description: '显式/隐式 Intent、Navigation Component、Bundle 传参' },
        { title: '[Kotlin] 协程进阶', description: 'Flow 冷流、Channel 热流、协程异常处理', optional: true },
        { title: '[Swift] Swift 基础语法', description: '可选类型、结构体与类、枚举关联值', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Swift官方教程", url: "https://docs.swift.org/swift-book/", icon: "mdi-file-document-outline" }] }] },
        { title: '[Swift] Swift 高阶特性', description: '协议 Protocol、扩展 Extension、泛型' },
        { title: '[Swift] Swift 并发', description: 'async/await、Actor 模型、Task 任务组' },
        { title: '[Swift] UIKit 核心', description: 'UIView/UIViewController、Auto Layout、UITableView' },
        { title: '[Swift] SwiftUI 声明式 UI', description: 'View 协议、@State/@Binding/@ObservedObject', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Stanford CS193p SwiftUI", url: "https://www.bilibili.com/video/BV1FJ411W7e5", icon: "mdi-play-circle-outline" }] }] },
        { title: '[Swift] Storyboard 与 XIB', description: '界面构建、Segue 跳转、IBOutlets' },
        { title: '[Swift] 导航与控制器', description: 'UINavigationController、UITabBarController' },
        { title: '[Swift] Swift 高级并发', description: 'AsyncSequence、TaskLocal、全局 Actor', optional: true },
        { title: '[Dart] Dart 基础语法', description: '变量类型、集合、函数、级联操作', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Dart官方文档", url: "https://dart.dev/guides", icon: "mdi-file-document-outline" }] }] },
        { title: '[Dart] Dart 面向对象', description: '类与 mixin、构造函数、抽象类、扩展方法' },
        { title: '[Dart] Dart 异步', description: 'Future/Stream、async/await、StreamController' },
        { title: '[Dart] Flutter Widget', description: 'StatelessWidget/StatefulWidget、BuildContext', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Flutter官方文档", url: "https://docs.flutter.dev/", icon: "mdi-file-document-outline" }] }] },
        { title: '[Dart] 布局 Widget', description: 'Container/Row/Column/Stack/ListView/GridView' },
        { title: '[Dart] Material Design', description: 'Scaffold/AppBar/BottomNavigation、主题定制' },
        { title: '[Dart] 导航与路由', description: 'Navigator.push/pop、命名路由、路由传参' },
        { title: '[Dart] Flutter 自定义绘制', description: 'CustomPainter、Canvas 绘图、动画', optional: true },
      ]
    },
    {
      name: '架构设计与数据处理', subtitle: '必修',
      children: [
        { title: '[Kotlin] MVVM 架构', description: 'ViewModel + LiveData/StateFlow、数据绑定' },
        { title: '[Kotlin] Room 数据库', description: 'Entity/Dao/Database 定义、Flow 查询、迁移' },
        { title: '[Kotlin] Retrofit + OkHttp', description: 'REST API 请求、拦截器、序列化' },
        { title: '[Kotlin] Hilt 依赖注入', description: '组件作用域、Module 绑定、Qualifier' },
        { title: '[Kotlin] DataStore 本地存储', description: 'Preferences DataStore / Proto DataStore' },
        { title: '[Kotlin] MVI 模式', description: 'Intent/State/Effect 单向数据流', optional: true },
        { title: '[Kotlin] Paging 3 分页', description: '数据源加载、网络+本地组合分页', optional: true },
        { title: '[Swift] MVVM 架构', description: 'ObservableObject、@Published、ViewModel 层' },
        { title: '[Swift] Core Data', description: '数据模型、NSManagedObject、FetchRequest' },
        { title: '[Swift] URLSession', description: '网络请求、Codable 解析、Combine 响应式编程' },
        { title: '[Swift] Swift Package Manager', description: '包管理、二进制分发' },
        { title: '[Swift] UserDefaults / Keychain', description: '轻量存储与安全存储' },
        { title: '[Swift] Redux / TCA', description: '单向数据流架构、Reducer/Store', optional: true },
        { title: '[Swift] Core Data 进阶', description: '多线程上下文、数据迁移、iCloud 同步', optional: true },
        { title: '[Dart] Provider 状态管理', description: 'ChangeNotifierProvider、多 Provider' },
        { title: '[Dart] BLoC 模式', description: 'Cubit/BLoC、事件驱动、StreamBuilder' },
        { title: '[Dart] HTTP 请求', description: 'http/dio 库、拦截器、错误处理' },
        { title: '[Dart] SQLite (sqflite)', description: '本地数据库、CRUD 操作、迁移' },
        { title: '[Dart] 本地存储', description: 'SharedPreferences、文件存储' },
        { title: '[Dart] 路由管理', description: 'GoRouter / AutoRoute 声明式路由' },
        { title: '[Dart] Riverpod', description: '编译安全的状态管理、Provider 家族', optional: true },
        { title: '[Dart] JSON 序列化', description: 'json_serializable、freezed 不可变数据类', optional: true },
      ]
    },
    {
      name: '工程化与发布', subtitle: '必修',
      children: [
        { title: '打包签名', description: 'APK 签名 / App Store Distribution / Flutter build' },
        { title: '发布流程', description: 'Google Play 控制台 / App Store Connect / Firebase App Distribution' },
        { title: '性能优化', description: '布局层级优化、图片内存、启动时间、包体积' },
        { title: '调试工具', description: 'Android Profiler / Instruments / Flutter DevTools' },
        { title: '持续集成', description: 'GitHub Actions / Codemagic / Fastlane 自动化打包' },
        { title: '多渠道打包', description: '不同环境配置、渠道号、混淆配置' },
      ]
    },
    {
      name: '进阶与生态拓展', subtitle: '选修',
      children: [
        { title: 'NDK / JNI 开发', description: 'C/C++ 原生库集成、性能关键模块', optional: true },
        { title: 'Compose Multiplatform', description: '跨平台 UI（Android + iOS + Desktop）', optional: true },
        { title: 'Jetpack 全家桶', description: 'WorkManager、CameraX、Sensor、Bluetooth', optional: true },
        { title: 'Kotlin Multiplatform (KMP)', description: '共享业务逻辑层', optional: true },
        { title: 'ARKit / RealityKit', description: '增强现实应用开发', optional: true },
        { title: 'Core ML / Create ML', description: '本地机器学习模型集成', optional: true },
        { title: 'Metal', description: '底层图形渲染框架、高性能计算', optional: true },
        { title: 'SwiftUI 动画', description: '动画曲线、转场动画、Layout 协议', optional: true },
        { title: '原生通道 MethodChannel', description: 'Flutter 与原生代码通信', optional: true },
        { title: 'Flutter Web', description: 'CanvasKit / HTML 渲染模式适配', optional: true },
        { title: '自定义渲染', description: 'RenderObject 层自绘、性能优化', optional: true },
        { title: 'Isolate 多线程', description: 'compute 函数、隔离区通信', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />

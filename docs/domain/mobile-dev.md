<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '移动开发',
  description: '移动开发覆盖 Android、iOS 以及跨平台方案，是用户触达最直接的开发领域。',

  items: [
    {
      name: '编程语言基础',
      subtitle: '必修',
      children: [
        {
          title: 'Java 核心（Android 方向）',
          description: '面向对象、集合、IO、多线程、泛型、反射',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Java 教程", url: "https://www.bilibili.com/video/BV1XT4y1M7Fg", icon: "mdi-play-circle-outline" },
                { title: "Java Full Course", url: "https://www.youtube.com/watch?v=grEKMHGYyns", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JavaGuide", url: "https://javaguide.cn/", icon: "mdi-file-document-outline" },
                { title: "Java Tutorial", url: "https://docs.oracle.com/javase/tutorial/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kotlin 核心（Android 方向）',
          description: '协程、扩展函数、数据类、密封类、空安全',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Kotlin 教程", url: "https://www.bilibili.com/video/BV1Hy4y1V7Kj", icon: "mdi-play-circle-outline" },
                { title: "Kotlin Full Course", url: "https://www.youtube.com/watch?v=5flXf8nuq60", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kotlin 官方文档", url: "https://kotlinlang.org/docs/home.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Swift 核心（iOS 方向）',
          description: '结构体与类、枚举、闭包、可选值、协议',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Swift 教程", url: "https://www.bilibili.com/video/BV1iW411Y7dQ", icon: "mdi-play-circle-outline" },
                { title: "Swift Full Course", url: "https://www.youtube.com/watch?v=n5X_V81OYnQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Swift 官方文档", url: "https://www.swift.org/documentation/", icon: "mdi-file-document-outline" },
                { title: "Swift Docs", url: "https://docs.swift.org/swift-book/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Dart 核心（Flutter 方向）',
          description: '异步编程、Stream、Mixin、泛型',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Dart 教程", url: "https://www.bilibili.com/video/BV1Yg4y1v7xh", icon: "mdi-play-circle-outline" },
                { title: "Dart Full Course", url: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Dart 官方文档", url: "https://dart.cn/guides", icon: "mdi-file-document-outline" },
                { title: "Dart Docs", url: "https://dart.dev/guides", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'JavaScript / TypeScript（React Native 方向）',
          description: 'ES6+、TS 类型系统',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JS 教程", url: "https://www.bilibili.com/video/BV1YW411T7GX", icon: "mdi-play-circle-outline" },
                { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=30LWjhZzg50", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React Native 官方文档", url: "https://reactnative.dev/docs/getting-started", icon: "mdi-file-document-outline" },
                { title: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '平台基础开发',
      subtitle: '必修',
      children: [
        {
          title: 'Android Studio 与项目结构',
          description: 'Gradle 构建、Manifest 配置、资源管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android Studio 教程", url: "https://www.youtube.com/watch?v=1sRXkR1B4eA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Android 开发者官方文档", url: "https://developer.android.com/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Activity / Fragment 生命周期',
          description: '页面导航、Bundle 传值、状态保存',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android Activity 教程", url: "https://www.youtube.com/watch?v=CPDZq8hNZO4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Activity 官方文档", url: "https://developer.android.com/guide/components/activities", icon: "mdi-file-document-outline" },
                { title: "Android Lifecycle", url: "https://developer.android.com/guide/components/activities/activity-lifecycle", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '布局与 UI 控件',
          description: 'XML 布局、ConstraintLayout、RecyclerView、ViewPager',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android UI 教程", url: "https://www.youtube.com/watch?v=sGSaYE4iDc0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ConstraintLayout 官方文档", url: "https://developer.android.com/training/constraint-layout", icon: "mdi-file-document-outline" },
                { title: "RecyclerView Guide", url: "https://developer.android.com/guide/topics/ui/layout/recyclerview", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Jetpack Compose',
          description: '声明式 UI、状态管理、Modifier、Composable 函数',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Jetpack Compose 教程", url: "https://www.bilibili.com/video/BV1SM4y1h7dV", icon: "mdi-play-circle-outline" },
                { title: "Jetpack Compose Full Course", url: "https://www.youtube.com/watch?v=6_wK_WdGqHQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Compose 官方文档", url: "https://developer.android.com/jetpack/compose", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '网络请求',
          description: 'Retrofit / OkHttp、协程网络调用、JSON 解析（Gson / Moshi）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Retrofit 教程", url: "https://www.youtube.com/watch?v=4JGvDUHkLSE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Retrofit 官方文档", url: "https://square.github.io/retrofit/", icon: "mdi-file-document-outline" },
                { title: "OkHttp Docs", url: "https://square.github.io/okhttp/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Service / BroadcastReceiver',
          description: '后台任务、系统广播监听',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Service 官方文档", url: "https://developer.android.com/guide/components/services", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Xcode 与项目结构',
          description: 'Storyboard / XIB、Swift Package Manager',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Xcode 教程", url: "https://www.youtube.com/watch?v=WmR1E7k3YVc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apple Developer Documentation", url: "https://developer.apple.com/documentation/", icon: "mdi-file-document-outline" },
                { title: "Xcode Guide", url: "https://developer.apple.com/xcode/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'UIKit 核心',
          description: 'UIView / UIViewController、Auto Layout、UITableView / UICollectionView',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "UIKit 教程", url: "https://www.youtube.com/watch?v=09TeUXjzpKs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "UIKit 官方文档", url: "https://developer.apple.com/documentation/uikit", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SwiftUI',
          description: '声明式 UI、@State / @Binding / @ObservableObject',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SwiftUI 教程", url: "https://www.bilibili.com/video/BV1nk4y1173g", icon: "mdi-play-circle-outline" },
                { title: "SwiftUI Full Course", url: "https://www.youtube.com/watch?v=F1ojDgS4h08", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SwiftUI 官方教程", url: "https://developer.apple.com/tutorials/swiftui", icon: "mdi-file-document-outline" },
                { title: "SwiftUI Docs", url: "https://developer.apple.com/documentation/swiftui", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '网络请求',
          description: 'URLSession、Codable 协议、Combine 框架',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "URLSession 教程", url: "https://www.youtube.com/watch?v=wlCn0HkBc1E", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "URLSession 官方文档", url: "https://developer.apple.com/documentation/foundation/urlsession", icon: "mdi-file-document-outline" },
                { title: "Combine Docs", url: "https://developer.apple.com/documentation/combine", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Core Data / SwiftData',
          description: '本地持久化存储',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Core Data 官方文档", url: "https://developer.apple.com/documentation/coredata", icon: "mdi-file-document-outline" },
                { title: "SwiftData Docs", url: "https://developer.apple.com/documentation/swiftdata", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Flutter 环境与项目结构',
          description: 'Widget 树、Material Design、pubspec 管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Flutter 教程", url: "https://www.bilibili.com/video/BV1Gu4y1c7S4", icon: "mdi-play-circle-outline" },
                { title: "Flutter Full Course", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flutter 官方文档", url: "https://flutter.cn/docs", icon: "mdi-file-document-outline" },
                { title: "Flutter Docs", url: "https://flutter.dev/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Flutter UI',
          description: 'StatelessWidget / StatefulWidget、布局组件、导航',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Flutter UI 教程", url: "https://www.youtube.com/watch?v=H1T3SfjGDlM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flutter Widget 目录", url: "https://flutter.cn/docs/development/ui/widgets", icon: "mdi-file-document-outline" },
                { title: "Flutter Layout", url: "https://flutter.dev/docs/development/ui/layout", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '状态管理',
          description: 'Provider / Riverpod / Bloc 模式',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Flutter 状态管理", url: "https://www.youtube.com/watch?v=zPJ0aN0nPso", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Provider 官方文档", url: "https://pub.dev/packages/provider", icon: "mdi-file-document-outline" },
                { title: "Riverpod Docs", url: "https://riverpod.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '网络与存储',
          description: 'http / dio 请求、JSON 序列化、SharedPreferences / SQLite',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Dio 教程", url: "https://www.youtube.com/watch?v=9X1h0HBKwYY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Dio 官方文档", url: "https://pub.dev/packages/dio", icon: "mdi-file-document-outline" },
                { title: "sqflite Docs", url: "https://pub.dev/packages/sqflite", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Platform Channel',
          description: '原生平台交互调用',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Platform Channel 官方文档", url: "https://flutter.cn/docs/development/platform-integration/platform-channels", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '架构与设计模式',
      subtitle: '必修',
      children: [
        {
          title: 'MVVM 架构',
          description: 'ViewModel + LiveData / StateFlow（Android）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MVVM 教程", url: "https://www.youtube.com/watch?v=5-RSgsA0oKY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Android MVVM 官方文档", url: "https://developer.android.com/topic/libraries/architecture/viewmodel", icon: "mdi-file-document-outline" },
                { title: "MVVM Guide", url: "https://developer.android.com/topic/libraries/architecture/viewmodel", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MVI 架构',
          description: 'Intent → State → Model 单向数据流',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MVI 详解", url: "https://juejin.cn/post/6976217401394520095", icon: "mdi-file-document-outline" },
                { title: "MVI Pattern", url: "https://www.raywenderlich.com/817602-mvi-architecture-for-android-tutorial-getting-started", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Clean Architecture',
          description: '分层抽象（Data / Domain / Presentation）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Clean Architecture 教程", url: "https://www.youtube.com/watch?v=uB5e8P1TubU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Clean Architecture", url: "https://juejin.cn/post/6844903618861252616", icon: "mdi-file-document-outline" },
                { title: "Clean Architecture", url: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '依赖注入',
          description: 'Hilt / Dagger（Android）、Swinject（iOS）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Hilt 教程", url: "https://www.youtube.com/watch?v=MTG5Ene6VqE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hilt 官方文档", url: "https://developer.android.com/training/dependency-injection/hilt-android", icon: "mdi-file-document-outline" },
                { title: "Dagger Docs", url: "https://dagger.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '组件化与模块化',
          description: '多模块拆分、ARouter 路由、SPM / CocoaPods',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Android 组件化", url: "https://juejin.cn/post/6844903487400222727", icon: "mdi-file-document-outline" },
                { title: "CocoaPods Guide", url: "https://guides.cocoapods.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '本地存储与数据库',
      subtitle: '必修',
      children: [
        {
          title: 'Room（Android）',
          description: 'DAO、Entity、Migration、Flow 响应式查询',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Room 教程", url: "https://www.youtube.com/watch?v=SKk6P4JB_2E", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Room 官方文档", url: "https://developer.android.com/training/data-storage/room", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CoreData / SwiftData（iOS）',
          description: '托管对象、持久化容器',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "CoreData 官方文档", url: "https://developer.apple.com/documentation/coredata", icon: "mdi-file-document-outline" },
                { title: "SwiftData Docs", url: "https://developer.apple.com/documentation/swiftdata", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SQLite（Flutter）',
          description: 'sqflite 插件、Drift ORM',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "sqflite 官方文档", url: "https://pub.dev/packages/sqflite", icon: "mdi-file-document-outline" },
                { title: "Drift ORM Docs", url: "https://drift.simonbinder.eu/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SharedPreferences / NSUserDefaults',
          description: '轻量级键值存储',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SharedPreferences 文档", url: "https://developer.android.com/training/data-storage/shared-preferences", icon: "mdi-file-document-outline" },
                { title: "NSUserDefaults", url: "https://developer.apple.com/documentation/foundation/nsuserdefaults", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MMKV',
          description: '腾讯开源高性能 KV 存储组件',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MMKV 官方文档", url: "https://github.com/Tencent/MMKV", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '性能优化',
      subtitle: '必修',
      children: [
        {
          title: '内存优化',
          description: '内存泄漏检测（LeakCanary）、Profiler 分析',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android 性能优化", url: "https://www.youtube.com/watch?v=8BWb3nR7N6w", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Android 性能优化", url: "https://developer.android.com/topic/performance", icon: "mdi-file-document-outline" },
                { title: "LeakCanary Docs", url: "https://square.github.io/leakcanary/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '启动速度优化',
          description: '懒加载、启动任务链路优化、App Startup',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "启动优化", url: "https://developer.android.com/topic/performance/app-startup", icon: "mdi-file-document-outline" },
                { title: "App Startup", url: "https://developer.android.com/topic/performance/app-startup", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '包体积优化',
          description: '资源混淆（AndResGuard）、代码混淆（ProGuard / R8）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "包体积优化", url: "https://developer.android.com/topic/performance/reduce-apk-size", icon: "mdi-file-document-outline" },
                { title: "R8 Optimization", url: "https://developer.android.com/studio/build/shrink-code", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '列表性能',
          description: 'RecyclerView 复用优化、DiffUtil、图片缓存（Glide / Coil）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Glide 教程", url: "https://www.youtube.com/watch?v=kIZV5sQ3QyI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Glide 官方文档", url: "https://bumptech.github.io/glide/", icon: "mdi-file-document-outline" },
                { title: "Coil Docs", url: "https://coil-kt.github.io/coil/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ANR 分析与治理',
          description: '主线程阻塞检测、Systrace 分析',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ANR 分析", url: "https://developer.android.com/topic/performance/anrs", icon: "mdi-file-document-outline" },
                { title: "Systrace Guide", url: "https://developer.android.com/topic/performance/tracing", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '测试与质量保障',
      subtitle: '必修',
      children: [
        {
          title: '单元测试',
          description: 'JUnit / Mockito（Android）、XCTest（iOS）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android 测试教程", url: "https://www.youtube.com/watch?v=Wok2hHjdIxQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JUnit 官方文档", url: "https://junit.org/junit5/", icon: "mdi-file-document-outline" },
                { title: "XCTest Docs", url: "https://developer.apple.com/documentation/xctest", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'UI 测试',
          description: 'Espresso / Compose Test（Android）、XCUITest（iOS）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Espresso 官方文档", url: "https://developer.android.com/training/testing/espresso", icon: "mdi-file-document-outline" },
                { title: "XCUITest", url: "https://developer.apple.com/documentation/xcuitest", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '自动化测试',
          description: 'Appium 跨平台自动化脚本',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Appium 教程", url: "https://www.youtube.com/watch?v=d4k7L3S56-M", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Appium 自动化测试", url: "https://appium.io/docs/en/latest/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CI/CD 移动端',
          description: 'GitHub Actions / GitLab CI 自动打包、Firebase Test Lab',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Firebase Test Lab", url: "https://firebase.google.com/docs/test-lab", icon: "mdi-file-document-outline" },
                { title: "GitHub Actions Docs", url: "https://docs.github.com/actions", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '发布与运营',
      subtitle: '必修',
      children: [
        {
          title: '应用打包签名',
          description: 'APK / AAB 打包、iOS Archive、Provisioning Profile',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Android 签名教程", url: "https://www.youtube.com/watch?v=Q05smY5FL4o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "APK 签名", url: "https://developer.android.com/studio/publish/app-signing", icon: "mdi-file-document-outline" },
                { title: "iOS Signing", url: "https://developer.apple.com/support/code-signing/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '应用商店上架',
          description: 'Google Play Console / App Store Connect 提交流程',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Google Play 上架", url: "https://developer.android.com/distribute", icon: "mdi-file-document-outline" },
                { title: "App Store Guide", url: "https://developer.apple.com/app-store/submitting/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '版本管理与灰度发布',
          description: '应用内更新、Feature Flag',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "应用内更新", url: "https://developer.android.com/guide/playcore/in-app-updates", icon: "mdi-file-document-outline" },
                { title: "Feature Flags", url: "https://launchdarkly.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '崩溃监控',
          description: 'Firebase Crashlytics / Sentry 集成',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Crashlytics 教程", url: "https://www.youtube.com/watch?v=5Ym2YaPIBQc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Firebase Crashlytics 文档", url: "https://firebase.google.com/docs/crashlytics", icon: "mdi-file-document-outline" },
                { title: "Sentry Docs", url: "https://docs.sentry.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '埋点与用户分析',
          description: '事件追踪、漏斗分析、A/B 测试',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "埋点方案", url: "https://zhuanlan.zhihu.com/p/34671881", icon: "mdi-file-document-outline" },
                { title: "Analytics Guide", url: "https://developers.google.com/analytics", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '进阶方向',
      subtitle: '选修',
      children: [
        {
          title: '跨平台深入',
          description: 'Flutter 渲染引擎（Skia / Impeller）、React Native TurboModules',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flutter 渲染引擎", url: "https://flutter.cn/docs/resources/architectural-overview", icon: "mdi-file-document-outline" },
                { title: "React Native Architecture", url: "https://reactnative.dev/architecture/landing-page", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '原生底层开发',
          description: 'NDK / JNI（Android）、Metal / ARKit（iOS）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "NDK 官方文档", url: "https://developer.android.com/ndk", icon: "mdi-file-document-outline" },
                { title: "ARKit Docs", url: "https://developer.apple.com/documentation/arkit", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '移动端安全',
          description: '代码加固（360加固）、反编译防护、HTTPS 证书绑定',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Android 安全", url: "https://developer.android.com/topic/security", icon: "mdi-file-document-outline" },
                { title: "iOS Security Guide", url: "https://developer.apple.com/documentation/security", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '大前端融合',
          description: 'Kotlin Multiplatform（KMP）、WebAssembly 移动应用',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "KMP 教程", url: "https://www.youtube.com/watch?v=HpRt5A4tF2A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kotlin Multiplatform 文档", url: "https://kotlinlang.org/docs/multiplatform.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />

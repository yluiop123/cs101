<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '游戏开发 / VR / AR',
  description: '游戏开发和虚拟现实结合了图形学、物理引擎和交互设计，是技术密集型领域。覆盖 PC/主机游戏、移动游戏、Web 3D、VR/AR 沉浸式体验。',

  items: [
    {
      name: '编程基础与数学基础',
      subtitle: '必修',
      children: [
        {
          title: 'C# 语言（Unity 方向）',
          description: '面向对象、委托、协程、LINQ',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Microsoft C# 教程", url: "https://www.bilibili.com/video/BV1sy4y1q7Qz", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C# 官方文档", url: "https://docs.microsoft.com/zh-cn/dotnet/csharp/", icon: "mdi-file-document-outline" },
                { title: "C# Docs", url: "https://docs.microsoft.com/en-us/dotnet/csharp/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'C++ 语言（Unreal 方向）',
          description: '指针、模板、STL、智能指针',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马 C++", url: "https://www.bilibili.com/video/BV1Tb411j7uM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C++ 官方文档", url: "https://en.cppreference.com/w/", icon: "mdi-file-document-outline" },
                { title: "C++ 中文教程", url: "https://www.runoob.com/cplusplus/cpp-tutorial.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '3D 数学基础',
          description: '向量运算、矩阵变换、四元数、欧拉角',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "3D 数学基础", url: "https://gamemath.com/", icon: "mdi-file-document-outline" },
                { title: "Unity 向量运算文档", url: "https://docs.unity.cn/cn/current/Manual/VectorCookbook.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '坐标系变换',
          description: '模型空间 / 世界空间 / 观察空间 / 裁剪空间',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1K4411Y7jE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "坐标系与变换", url: "https://learnopengl.com/Getting-started/Coordinate-Systems", icon: "mdi-file-document-outline" },
                { title: "JavaScript / TypeScript（Web 3D / Cocos 方向）", url: "https://www.typescriptlang.org/zh/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Unreal Engine',
          description: '蓝图可视化脚本、Actor / Component、物理引擎、材质系统',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Unreal Engine 入门", url: "https://www.bilibili.com/video/BV164411Y7F2", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Unreal 官方文档", url: "https://docs.unrealengine.com/", icon: "mdi-file-document-outline" },
                { title: "Unreal 中文文档", url: "https://docs.unrealengine.com/5.0/zh-CN/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Godot 引擎',
          description: '场景树、GDScript、信号系统（轻量入门选项）',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Godot 官方文档", url: "https://docs.godotengine.org/", icon: "mdi-file-document-outline" },
                { title: "Godot 中文社区", url: "https://godot-china.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Cocos Creator',
          description: 'TypeScript/JavaScript 开发、组件化架构、2D 性能优异、原生打包（iOS/Android/小游戏）、Cocos 3D 支持',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Cocos Creator 教程", url: "https://www.bilibili.com/video/BV1FL41187zQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cocos 官方文档", url: "https://docs.cocos.com/", icon: "mdi-file-document-outline" },
                { title: "Cocos 社区", url: "https://forum.cocos.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '2D 游戏开发',
          description: '精灵动画、碰撞检测、Tilemap，Cocos Creator 2D 工作流（Spine/DragonBones 骨骼动画、物理碰撞）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Unity 2D 游戏开发", url: "https://www.bilibili.com/video/BV1iE411K7kN", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Unity 2D 文档", url: "https://docs.unity.cn/cn/current/Manual/Unity2D.html", icon: "mdi-file-document-outline" },
                { title: "Cocos 2D 文档", url: "https://docs.cocos.com/creator/manual/zh/ui/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '3D 游戏开发',
          description: '模型导入、光照、摄像机控制、NavMesh 导航，Cocos 3D（模型/光照/粒子）',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Unity 3D 文档", url: "https://docs.unity3d.com/Manual/3D-worldspace.html", icon: "mdi-file-document-outline" },
                { title: "Cocos 3D 文档", url: "https://docs.cocos.com/creator/3d/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '图形学与渲染核心',
      subtitle: '必修',
      children: [
        {
          title: '渲染管线',
          description: '固定管线 vs 可编程管线、顶点着色器、片段着色器',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "LearnOpenGL CN", url: "https://learnopengl-cn.github.io/", icon: "mdi-file-document-outline" },
                { title: "LearnOpenGL", url: "https://learnopengl.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '光照模型',
          description: 'Lambert / Phong / Blinn-Phong / PBR',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "光照模型入门", url: "https://learnopengl.com/Lighting/Basic-Lighting", icon: "mdi-file-document-outline" },
                { title: "阴影技术", url: "https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping", icon: "mdi-file-document-outline" },
                { title: "后处理特效", url: "https://docs.unity.cn/cn/current/Manual/PostProcessingOverview.html", icon: "mdi-file-document-outline" },
                { title: "LOD 与性能优化", url: "https://docs.unity.cn/cn/current/Manual/OptimizingGraphicsPerformance.html", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://docs.unity3d.com/Manual/XR.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ARKit（iOS）',
          description: '平面检测、图像追踪、人形遮挡',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ARKit 官方文档", url: "https://developer.apple.com/augmented-reality/", icon: "mdi-file-document-outline" },
                { title: "ARKit 中文教程", url: "https://developer.apple.com/cn/augmented-reality/arkit/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ARCore（Android）',
          description: '环境理解、光照估计、云锚点',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ARCore 官方文档", url: "https://developers.google.com/ar", icon: "mdi-file-document-outline" },
                { title: "ARCore 基础", url: "https://developers.google.com/ar/develop?hl=zh-cn", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'OpenXR 标准',
          description: '跨平台 VR/AR 应用开发',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenXR 官方规范", url: "https://www.khronos.org/openxr/", icon: "mdi-file-document-outline" },
                { title: "性能优化", url: "https://docs.unity3d.com/Manual/VRPerformance.html", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://mirror-networking.gitbook.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '程序化生成',
          description: 'Perlin 噪声、地形生成、关卡自动生成',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "程序化生成教程", url: "https://www.pcgbook.com/", icon: "mdi-file-document-outline" },
                { title: "Web 3D", url: "https://threejs.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '跨平台发布',
          description: 'Steam / iOS App Store / Google Play / WebGL / 微信小游戏，Cocos 原生打包与小游戏平台适配',
          optional: true
        },
        {
          title: 'DCC 工具集成',
          description: 'Blender / Maya / Substance Painter 工作流',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Blender 官方文档", url: "https://docs.blender.org/", icon: "mdi-file-document-outline" },
                { title: "Blender 中文教程", url: "https://www.blendercn.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

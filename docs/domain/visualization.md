<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '可视化技术路线',
  description: '数据可视化将抽象数据转化为直观的图形和交互界面，是数据分析、产品设计、科研展示的核心技能。覆盖可视化理论、Web 可视化、桌面端可视化、数据科学可视化、三维可视化等多个方向。',

  items: [
    {
      name: '可视化理论基础',
      subtitle: '必修',
      children: [
        {
          title: '可视化基本概念',
          description: '数据到图形的映射流程、可视化的目标（探索/分析/展示）、数据类型与图表选择',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "数据可视化入门教程", url: "https://www.bilibili.com/video/BV1FK411k7AB", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Data Visualization: A Practical Introduction", url: "https://socviz.co/", icon: "mdi-file-document-outline" },
                { title: "Visualization Analysis & Design (Tamara Munzner)", url: "https://www.cs.ubc.ca/~tmm/vadbook/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '视觉感知与认知理论',
          description: 'Gestalt 完形原则（接近/相似/闭合/连续）、前注意加工、视觉认知负荷、格式塔理论在图表设计中的应用',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Gestalt 原则与可视化", url: "https://www.interaction-design.org/literature/topics/gestalt-principles", icon: "mdi-file-document-outline" },
                { title: "Visual Perception in Design", url: "https://www.csc2.ncsu.edu/faculty/healey/PP/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '视觉编码与视觉通道',
          description: '位置/长度/角度/面积/颜色/形状等通道的排序与表达力、通道有效性（Mackinlay 准则）、定量 vs 定性的编码',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Visual Encoding 详解", url: "https://observablehq.com/@d3/visual-encoding", icon: "mdi-file-document-outline" },
                { title: "Mackinlay 编码理论", url: "https://graphics.cs.wisc.edu/Vis/Publications/automating-the-design-of-graphical-presentations-of-relational-information/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '图形语法（Grammar of Graphics）',
          description: 'Wilkinson 图形语法理论、数据→几何→标度→坐标系→分面、ggplot2 / Vega-Lite 实现',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "The Grammar of Graphics（Wilkinson）", url: "https://www.springer.com/gp/book/9780387245447", icon: "mdi-file-document-outline" },
                { title: "Vega-Lite 语法", url: "https://vega.github.io/vega-lite/docs/", icon: "mdi-file-document-outline" },
                { title: "ggplot2 文档", url: "https://ggplot2.tidyverse.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '交互与探索理论',
          description: 'Shneiderman  mantra（Overview first → Zoom → Filter → Details-on-demand）、Brushing & Linking、多视图联动',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Shneiderman 信息可视化经典论文", url: "https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '色彩理论与配色',
          description: '颜色空间（RGB / HSL / Lab / HCL）、色盲友好设计（ColorBrewer）、顺序/发散/定性配色方案',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ColorBrewer", url: "https://colorbrewer2.org/", icon: "mdi-file-document-outline" },
                { title: "D3 配色方案", url: "https://d3js.org/d3-scale-chromatic", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '图形学数学基础',
          description: '向量与矩阵运算、齐次坐标、变换矩阵（平移/旋转/缩放/投影）、四元数与旋转插值、坐标系与空间变换',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "3D 图形学数学基础", url: "https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics", icon: "mdi-file-document-outline" },
                { title: "线性代数与图形学", url: "https://github.com/ssloy/tinyrenderer/wiki/Lesson-1:-Bresenham%E2%80%99s-Line-Drawing-Algorithm", icon: "mdi-file-document-outline" },
                { title: "Quaternion 详解", url: "https://eater.net/quaternions", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '渲染管线原理',
          description: '固定管线 vs 可编程管线、顶点处理→光栅化→片元处理→输出合并、GPU 并行架构与 SIMT、渲染流水线优化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GPU 渲染管线入门", url: "https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading", icon: "mdi-file-document-outline" },
                { title: "Learn OpenGL 渲染管线", url: "https://learnopengl.com/Getting-started/Hello-Triangle", icon: "mdi-file-document-outline" },
                { title: "Render Hell 可视化渲染管线", url: "https://renderhell.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '坐标系统与投影变换',
          description: '局部→世界→观察→裁剪→屏幕空间、正交投影 vs 透视投影、视口变换、深度缓冲原理',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "坐标系统详解", url: "https://learnopengl.com/Getting-started/Coordinate-Systems", icon: "mdi-file-document-outline" },
                { title: "投影矩阵推导", url: "http://www.songho.ca/opengl/gl_projectionmatrix.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'Web 可视化开发',
      subtitle: '必修',
      children: [
        {
          title: 'ECharts',
          description: '折线图 / 柱状图 / 散点图 / 饼图 / 雷达图、数据集声明、事件交互、响应式适配',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ECharts 教程", url: "https://www.bilibili.com/video/BV1vy4y1z7Qp", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ECharts 官方文档", url: "https://echarts.apache.org/zh/option.html", icon: "mdi-file-document-outline" },
                { title: "ECharts 示例库", url: "https://echarts.apache.org/examples/zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'AntV 系列',
          description: 'G2 统计图表、G6 图可视化、F2 移动端、L7 地理可视化、LiteInsight 自动洞察',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "AntV 官网", url: "https://antv.vision/", icon: "mdi-file-document-outline" },
                { title: "G2 文档", url: "https://g2.antv.vision/", icon: "mdi-file-document-outline" },
                { title: "G6 图可视化", url: "https://g6.antv.vision/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'D3.js 数据驱动文档',
          description: '选择集、数据绑定（data/enter/exit/update）、比例尺（scale）、力导向图、过渡动画',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "D3 官方文档", url: "https://d3js.org/", icon: "mdi-file-document-outline" },
                { title: "Observable D3 教程", url: "https://observablehq.com/@d3/learn-d3", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Canvas / SVG 高级绘图',
          description: 'Canvas 像素操作与硬件加速、SVG 动画与交互、Web Workers 后台渲染',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN Canvas 教程", url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial", icon: "mdi-file-document-outline" },
                { title: "MDN SVG 教程", url: "https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Vega-Lite / Vega',
          description: '声明式可视化语法、Vega-Lite 高层规范、Vega 低层渲染、交互式多视图',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vega-Lite 官方文档", url: "https://vega.github.io/vega-lite/", icon: "mdi-file-document-outline" },
                { title: "Vega 文档", url: "https://vega.github.io/vega/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '桌面端可视化开发',
      subtitle: '选修',
      children: [
        {
          title: 'Qt Charts / QCustomPlot（C++）',
          description: 'Qt Charts 折线/柱状/饼图/极坐标图、QCustomPlot 高性能实时曲线、OpenGL 加速、Qt Quick 3D 可视化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Qt Charts 文档", url: "https://doc.qt.io/qt-6/qtcharts-index.html", icon: "mdi-file-document-outline" },
                { title: "QCustomPlot 文档", url: "https://www.qcustomplot.com/", icon: "mdi-file-document-outline" },
                { title: "Qt 3D 可视化", url: "https://doc.qt.io/qt-6/qt3d-index.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '.NET WPF 可视化（C#）',
          description: 'LiveCharts2 实时图表、ScottPlot 科学绘图、WPF 数据绑定与 MVVM、OxyPlot 线图与统计图、Visifire/AnyChart',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "LiveCharts2 文档", url: "https://livecharts.dev/", icon: "mdi-file-document-outline" },
                { title: "ScottPlot 文档", url: "https://scottplot.net/", icon: "mdi-file-document-outline" },
                { title: "OxyPlot 文档", url: "https://oxyplot.github.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Java 桌面可视化',
          description: 'JFreeChart 图表库、JavaFX Charts 组件、FXGraphics2D + D3.js 集成、Orson Charts 3D',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JFreeChart 教程", url: "https://www.jfree.org/jfreechart/", icon: "mdi-file-document-outline" },
                { title: "JavaFX Charts 文档", url: "https://openjfx.io/javadoc/21/javafx.controls/javafx/scene/chart/package-summary.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Python 桌面可视化',
          description: 'PyQtGraph 高性能实时绘图、PyQtChart（Qt Charts Python 绑定）、Matplotlib 嵌入 PyQt/PySide、VisPy GPU 加速',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "PyQtGraph 文档", url: "https://www.pyqtgraph.org/", icon: "mdi-file-document-outline" },
                { title: "VisPy 高性能可视化", url: "https://vispy.org/", icon: "mdi-file-document-outline" },
                { title: "Matplotlib + PyQt 嵌入", url: "https://matplotlib.org/stable/gallery/user_interfaces/embedding_in_qt_sgskip.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'VTK 可视化工具包',
          description: 'VTK 管线架构（Source → Filter → Mapper → Actor → Renderer）、体渲染、等值面提取、交互式裁剪、VTK + Qt 集成',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "VTK 官方文档", url: "https://vtk.org/documentation/", icon: "mdi-file-document-outline" },
                { title: "VTK 示例", url: "https://examples.vtk.org/site/", icon: "mdi-file-document-outline" },
                { title: "VTK 书籍", url: "https://vtk.org/vtk-textbook/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ParaView 与科学可视化平台',
          description: 'ParaView 大规模并行可视化、Python 脚本（PVPython）、Cinema 数据库、In-Situ 可视化（Catalyst）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ParaView 文档", url: "https://www.paraview.org/documentation/", icon: "mdi-file-document-outline" },
                { title: "ParaView Python 教程", url: "https://kitware.github.io/paraview-docs/latest/python/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '数据科学可视化',
      subtitle: '必修 / 选修',
      children: [
        {
          title: 'Matplotlib',
          description: 'Figure/Axes 架构、折线图/散点图/柱状图/直方图、子图布局、样式定制、中文支持',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Matplotlib 教程", url: "https://www.bilibili.com/video/BV1Jk4y1y7xR", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Matplotlib 官方文档", url: "https://matplotlib.org/stable/tutorials/index.html", icon: "mdi-file-document-outline" },
                { title: "Matplotlib 示例", url: "https://matplotlib.org/stable/gallery/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Seaborn',
          description: '统计图表：箱线图、小提琴图、热力图、配对图、分类散点图、回归图',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Seaborn 文档", url: "https://seaborn.pydata.org/", icon: "mdi-file-document-outline" },
                { title: "Seaborn 示例", url: "https://seaborn.pydata.org/examples/index.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Plotly Python',
          description: '交互式图表、Dash 仪表盘框架、3D 可视化、金融图表、地理图表',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Plotly Python 文档", url: "https://plotly.com/python/", icon: "mdi-file-document-outline" },
                { title: "Dash 中文教程", url: "https://dash.plotly.com/zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Tableau / Power BI',
          description: '拖拽式仪表盘、数据连接、计算字段、LOD 表达式、故事叙事、参数控制',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Tableau 入门", url: "https://www.tableau.com/learn/tutorials", icon: "mdi-file-document-outline" },
                { title: "Power BI 文档", url: "https://learn.microsoft.com/en-us/power-bi/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ggplot2 / R 可视化',
          description: '图形语法实现、分面（facet）、主题系统、统计变换、与 Python plotnine 对比',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "R for Data Science 可视化", url: "https://r4ds.had.co.nz/data-visualisation.html", icon: "mdi-file-document-outline" },
                { title: "ggplot2 文档", url: "https://ggplot2.tidyverse.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '地理数据可视化',
          description: 'GeoPandas 绘图、Choropleth 分级统计图、散点地图、连接地图、kepler.gl 地理分析',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoPandas 绘图", url: "https://geopandas.org/en/stable/docs/user_guide/mapping.html", icon: "mdi-file-document-outline" },
                { title: "kepler.gl", url: "https://kepler.gl/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Bokeh / Altair',
          description: '声明式可视化、交互式控件、流式数据更新、服务端集成',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Bokeh 文档", url: "https://docs.bokeh.org/", icon: "mdi-file-document-outline" },
                { title: "Altair 文档", url: "https://altair-viz.github.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'OpenGL / WebGL 图形渲染',
      subtitle: '选修',
      children: [
        {
          title: 'OpenGL 基础（桌面端）',
          description: '现代 OpenGL（3.3+）核心模式、VAO/VBO/EBO 缓冲对象、着色器（Shader）与着色器程序、图元装配与光栅化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Learn OpenGL（中文版）", url: "https://learnopengl-cn.github.io/", icon: "mdi-file-document-outline" },
                { title: "OpenGL 官方文档", url: "https://www.opengl.org/documentation/", icon: "mdi-file-document-outline" },
                { title: "OGLdev 教程", url: "https://ogldev.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GLSL 着色器编程',
          description: '顶点着色器（Vertex Shader）、片元着色器（Fragment Shader）、uniform/attribute/varying 传递、GLSL 内置变量与函数',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GLSL 语法指南", url: "https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)", icon: "mdi-file-document-outline" },
                { title: "The Book of Shaders", url: "https://thebookofshaders.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'OpenGL 高级渲染',
          description: '光照模型（Phong/Blinn-Phong/PBR）、帧缓冲与离屏渲染、阴影贴图、HDR 与泛光、立方体贴图与环境映射',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Learn OpenGL 光照", url: "https://learnopengl.com/Lighting/Basic-Lighting", icon: "mdi-file-document-outline" },
                { title: "Learn OpenGL 高级", url: "https://learnopengl.com/Advanced-OpenGL/Framebuffers", icon: "mdi-file-document-outline" },
                { title: "PBR 理论", url: "https://learnopengl.com/PBR/Theory", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'WebGL 与 OpenGL ES',
          description: 'WebGL 基于 OpenGL ES 2.0/3.0、WebGL 上下文创建、JavaScript 与 GLSL 绑定、WebGL 2.0 新特性（实例化/VAO/UBO）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "WebGL 基础教程", url: "https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial", icon: "mdi-file-document-outline" },
                { title: "WebGL2 Fundamentals", url: "https://webgl2fundamentals.org/", icon: "mdi-file-document-outline" },
                { title: "WebGL 与 OpenGL ES 对比", url: "https://www.khronos.org/webgl/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'WebGL 高级技术',
          description: '帧缓冲对象（FBO）离屏渲染、实例化绘制（Instanced Drawing）、Uniform Buffer Object、Transform Feedback 粒子系统、GPU 拾取（Picking）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "WebGL 高级技术", url: "https://webgl2fundamentals.org/webgl/lessons/webgl-instanced-drawing.html", icon: "mdi-file-document-outline" },
                { title: "WebGL 帧缓冲", url: "https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'WebGPU 下一代 Web 渲染',
          description: '计算着色器（Compute Shader）、资源绑定模型（Bind Group）、WGSL 着色器语言、与 WebGL 架构对比',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "WebGPU 入门", url: "https://webgpufundamentals.org/", icon: "mdi-file-document-outline" },
                { title: "WebGPU 规范", url: "https://www.w3.org/TR/webgpu/", icon: "mdi-file-document-outline" },
                { title: "WGSL 着色器语言", url: "https://www.w3.org/TR/WGSL/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GPU 性能优化',
          description: 'Draw Call 合并（Batching）、GPU 实例化、LOD 层级细节、遮挡剔除、纹理压缩与压缩格式（BC/ETC/ASTC）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GPU 性能优化指南", url: "https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows", icon: "mdi-file-document-outline" },
                { title: "WebGL 性能优化", url: "https://webgl2fundamentals.org/webgl/lessons/webgl-performance.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '三维可视化引擎',
      subtitle: '选修',
      children: [
        {
          title: 'Three.js 基础',
          description: '场景（Scene）、相机（Camera）、渲染器（Renderer）、几何体、材质与光照、加载器（GLTF/OBJ）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Three.js 教程", url: "https://www.bilibili.com/video/BV1ti4y1c7RP", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Three.js 官方文档", url: "https://threejs.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Three.js 入门", url: "https://threejs.org/manual/#zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Three.js 进阶',
          description: 'ShaderMaterial 自定义着色器、后期处理（EffectComposer）、粒子系统、Raycaster 交互、CSS2DRenderer',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Three.js 着色器", url: "https://threejs.org/docs/#api/en/materials/ShaderMaterial", icon: "mdi-file-document-outline" },
                { title: "Three.js 示例", url: "https://threejs.org/examples/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Babylon.js',
          description: '游戏级 3D 引擎、物理引擎、XR/AR 支持、场景编辑器、SPS 粒子系统、材质节点编辑器',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Babylon.js 文档", url: "https://doc.babylonjs.com/", icon: "mdi-file-document-outline" },
                { title: "Babylon 示例", url: "https://www.babylonjs.com/community/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Unity 可视化应用',
          description: '实时渲染管线（URP/HDRP）、Shader Graph、粒子系统 VFX Graph、可视化数据仪表盘开发',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Unity 可视化教程", url: "https://unity.com/products/unity-graph-view", icon: "mdi-file-document-outline" },
                { title: "Unity Shader Graph", url: "https://unity.com/shader-graph", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '高级可视化与性能优化',
      subtitle: '选修',
      children: [
        {
          title: '大规模数据可视化',
          description: 'WebGL 实例化渲染、LOD 层级细节、虚拟滚动、数据聚合下采样、Canvas 2D 硬件加速、Deck.gl GPU 大数据渲染',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Deck.gl", url: "https://deck.gl/", icon: "mdi-file-document-outline" },
                { title: "Luma.gl", url: "https://luma.gl/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '体积渲染与科学可视化',
          description: '光线投射（Ray Casting）体积渲染、等值面（Marching Cubes）、流线/迹线可视化、医学影像 DICOM 可视化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Volume Rendering 综述", url: "https://www.khronos.org/opengl/wiki/Volume_Rendering", icon: "mdi-file-document-outline" },
                { title: "ITK 医学影像", url: "https://itk.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '图可视化与网络分析',
          description: '力导向布局、分层布局（Sugiyama）、矩阵视图、社区发现可视化、Gephi / Cytoscape',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Gephi 文档", url: "https://gephi.org/", icon: "mdi-file-document-outline" },
                { title: "D3 Force Layout", url: "https://d3js.org/d3-force", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '高维数据可视化',
          description: '降维可视化（PCA / t-SNE / UMAP）、平行坐标（Parallel Coordinates）、雷达图、散点图矩阵（SPLOM）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "t-SNE 可视化", url: "https://distill.pub/2016/misread-tsne/", icon: "mdi-file-document-outline" },
                { title: "Parallel Coordinates", url: "https://observablehq.com/@d3/parallel-coordinates", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '实时数据可视化',
          description: 'WebSocket 推送、流式图表更新、时间序列可视化、实时仪表盘架构、增量渲染',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ECharts 实时数据", url: "https://echarts.apache.org/zh/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '可视化设计原则与叙事',
          description: 'Tufte 原则（数据-墨水比）、图表垃圾清理、配色可访问性、Scrollytelling 叙事结构、数据新闻',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "The Visual Display of Quantitative Information", url: "https://www.edwardtufte.com/tufte/books_vdqi", icon: "mdi-file-document-outline" },
                { title: "Storytelling with Data", url: "https://www.storytellingwithdata.com/", icon: "mdi-file-document-outline" },
                { title: "Scrollama", url: "https://github.com/russellgoldenberg/scrollama", icon: "mdi-file-document-outline" }
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

<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'VisualVM',
  description: 'Java 可视化监控与性能分析工具，集成 JDK 命令行工具的一站式 GUI。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'VisualVM 简介',
          description: 'VisualVM 是一款免费的 Java 性能监控和故障排查工具，集成了 JConsole、jstat、jstack、jmap、jinfo 等 JDK 内置工具的功能，以图形化界面展示 JVM 的运行状态。它支持堆内存分析、线程分析、CPU 采样、GC 可视化等功能，且可通过插件扩展更多能力，是 Java 开发和运维的标配工具。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'VisualVM 官网', url: 'https://visualvm.github.io/', icon: 'mdi-web' },
                { title: '官方文档', url: 'https://visualvm.github.io/documentation.html', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/oracle/visualvm', icon: 'mdi-github' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'VisualVM 有两种安装方式：单独下载可执行包（解压即用），或作为 IDEA 插件安装。推荐从官网下载最新版以获得最佳兼容性。需要 JDK 8+ 环境。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 VisualVM', url: 'https://visualvm.github.io/download.html', icon: 'mdi-download' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'VisualVM 入门教程', url: 'https://www.bilibili.com/video/BV1iJ411R7pC', icon: 'mdi-play-circle-outline' },
                { title: 'VisualVM 使用指南', url: 'https://www.youtube.com/watch?v=ihINkC4Uq0I', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: '核心功能',
      children: [
        {
          title: '本地与远程监控',
          description: '自动发现本地运行的 Java 进程，支持连接远程 JVM（通过 JMX 或 jstatd），实时查看 CPU 使用率、堆内存、GC 活动、类加载数和线程数，所有指标以曲线图展示。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '连接远程 JVM', url: 'https://visualvm.github.io/applications.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'CPU 与内存采样',
          description: 'CPU 采样器可以统计各方法和线程的 CPU 耗时占比，快速定位热点方法。内存采样器可以监控堆中各对象的分配频率和内存占用，帮助识别内存泄漏源头。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '性能采样', url: 'https://visualvm.github.io/profiler.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '堆 Dump 分析',
          description: '一键生成堆 Dump 文件，内置 OQL（对象查询语言）控制台，支持按类名、引用关系、GC Root 路径等方式分析堆中对象，是排查内存泄漏的核心功能。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '堆 Dump 分析', url: 'https://visualvm.github.io/heapdump.html', icon: 'mdi-play-circle-outline' },
                { title: 'OQL 语法参考', url: 'https://visualvm.github.io/oqlhelp.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '线程 Dump 分析',
          description: '一键生成线程 Dump，自动检测死锁，展示线程堆栈信息。支持对线程状态分类查看（运行/等待/阻塞），定位线程阻塞和死锁问题。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '线程 Dump 分析', url: 'https://visualvm.github.io/threaddump.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: 'GC 可视化',
          description: '以图表形式实时展示堆各代（Eden/Survivor/Old/Metaspace）的内存使用变化，以及 GC 暂停次数和耗时，帮助评估 GC 调优效果。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Monitor 视图', url: 'https://visualvm.github.io/monitor.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: '进阶技巧',
      subtitle: '选修',
      children: [
        {
          title: '插件系统',
          description: 'VisualVM 拥有丰富的插件生态，包括 VisualGC（实时 GC 详细视图）、BTrace 集成（动态追踪）、MBeans 浏览器、JConsole 标签页等，通过 Tools > Plugins 在线安装。',
          optional: true,
          groups: [
            {
              name: '资源',
              icon: 'mdi-puzzle',
              items: [
                { title: 'VisualVM 插件中心', url: 'https://visualvm.github.io/plugins.html', icon: 'mdi-puzzle' },
              ],
            },
          ],
        },
        {
          title: '离线分析与导出',
          description: '所有采样数据、堆 Dump、线程 Dump 均可导出为文件，用于离线分析或团队共享。支持在不同会话间对比堆 Dump，跟踪内存变化趋势。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '保存与导出', url: 'https://visualvm.github.io/savesnapshot.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />

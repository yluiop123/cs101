<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'async-profiler',
  description: '低开销的 Java 采样分析器，支持 CPU、内存分配和锁竞争的火焰图分析。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'async-profiler 简介',
          description: 'async-profiler 是一款基于 Linux perf_events 和 AsyncGetCallTrace 的 Java 性能采样分析器，由 async-profiler 团队（原在阿里巴巴，现独立维护）开发。它以极低的开销（通常 < 2%）对 Java 应用进行采样，支持 CPU 热点、内存分配热点、锁竞争和硬件事件等多种分析模式，并生成可视化火焰图，是 Java 性能分析的顶级工具。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'GitHub 仓库', url: 'https://github.com/async-profiler/async-profiler', icon: 'mdi-github' },
                { title: '官方 Wiki', url: 'https://github.com/async-profiler/async-profiler/wiki', icon: 'mdi-book-open-variant' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: '从 GitHub Releases 下载对应平台（Linux x64/arm64, macOS x64/arm64）的压缩包解压即可。Windows 支持有限，推荐在 Linux 环境使用。IDEA 和 IntelliJ 终极版内置了 async-profiler。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 async-profiler', url: 'https://github.com/async-profiler/async-profiler/releases', icon: 'mdi-download' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'async-profiler 入门', url: 'https://www.youtube.com/watch?v=QbGQY-u8Rw4', icon: 'mdi-play-circle-outline' },
                { title: 'Java 火焰图实战', url: 'https://www.bilibili.com/video/BV1J4411t7N1', icon: 'mdi-play-circle-outline' },
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
          title: 'CPU 采样',
          description: '使用 perf_events 进行 CPU 周期采样，无 Safepoint Bias 问题，能够精确采集 Java 代码和 Native 代码的 CPU 热点。采样间隔可配置（默认 10ms），支持包含/排除特定线程。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'CPU Profiling 指南', url: 'https://github.com/async-profiler/async-profiler/wiki/Profiling-cpu', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '内存分配分析（Allocation Profiling）',
          description: '基于 TLAB（Thread-Local Allocation Buffer）的采样机制，可以分析对象分配热点，定位频繁创建对象的代码位置，是排查 GC 压力和内存泄漏的有力工具。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Allocation Profiling', url: 'https://github.com/async-profiler/async-profiler/wiki/Profiling-allocations', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '火焰图生成',
          description: 'async-profiler 可以直接输出采集数据并自动生成 SVG 火焰图。支持 CPU 火焰图、内存分配火焰图、锁火焰图。火焰图直观展示热点路径，X 轴为样本占比，Y 轴为调用栈深度。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '火焰图生成', url: 'https://github.com/async-profiler/async-profiler/wiki/FlameGraphs', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '锁竞争分析（Lock Profiling）',
          description: '分析 Java 对象锁和 ReentrantLock 的竞争情况，定位高竞争的锁对象和阻塞线程，帮助优化并发性能，减少线程上下文切换开销。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Lock Profiling', url: 'https://github.com/async-profiler/async-profiler/wiki/Profiling-locks', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '将流程下载为 SVG',
          description: '生成可视化的调用链火焰图或从左到右的调用树图，支持交互式查看（点击放大、搜索方法名），便于团队分享和归档。',
          resources: [
            {
              name: '工具',
              icon: 'mdi-image',
              items: [
                { title: '火焰图在线查看器', url: 'https://profiler.firefox.com/', icon: 'mdi-image' },
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
          title: 'IDEA 集成',
          description: 'IntelliJ IDEA 终极版内置 async-profiler 集成（Run > Profiler），无需命令行即可一键启动 CPU 或内存分析，并直接在 IDE 中查看火焰图和调用树。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'IDEA Profiler 文档', url: 'https://www.jetbrains.com/help/idea/cpu-profiler.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '持续分析模式',
          description: 'async-profiler 支持持续采样模式（--loop），可将分析器挂载在应用上长期运行，定期保存快照，适合在生产环境做周期性性能数据采集。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '持续模式', url: 'https://github.com/async-profiler/async-profiler/wiki/Continuous-profiling', icon: 'mdi-file-document-outline' },
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

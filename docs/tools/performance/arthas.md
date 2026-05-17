<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Arthas',
  description: '阿里巴巴开源的 Java 在线诊断工具，无需重启即可动态追踪线上问题。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Arthas 简介',
          description: 'Arthas（阿尔萨斯）是阿里巴巴开源的一款 Java 诊断工具，可以实时查看 Java 应用的类加载、方法调用、参数、异常、线程状态等信息，而无需修改代码或重启应用。它采用命令行交互界面，对生产环境友好，是 Java 后端开发者和运维人员排查线上问题的利器。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Arthas 官网', url: 'https://arthas.aliyun.com/', icon: 'mdi-web' },
                { title: '官方文档', url: 'https://arthas.aliyun.com/doc/', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/alibaba/arthas', icon: 'mdi-github' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'Arthas 提供了多种安装方式：一键安装脚本（curl -O 并 java -jar）、as.sh 脚本、或通过 IDEA 插件直接接入。启动后会自动检测本机 Java 进程并提示选择目标进程。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '安装指南', url: 'https://arthas.aliyun.com/doc/install-detail.html', icon: 'mdi-download' },
                { title: 'GitHub Releases', url: 'https://github.com/alibaba/arthas/releases', icon: 'mdi-github' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Arthas 入门教程', url: 'https://www.bilibili.com/video/BV1qQ4y1M7qN', icon: 'mdi-play-circle-outline' },
                { title: 'Arthas 实战教程', url: 'https://www.youtube.com/watch?v=O1P0O_-kFpM', icon: 'mdi-play-circle-outline' },
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
          title: 'Dashboard 仪表盘',
          description: '输入 dashboard 命令即可查看 Java 进程的实时概览，包括线程信息（堆栈/状态）、内存使用（堆/非堆/GC）、系统信息（CPU/负载）等，类似 top 命令但更全面。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Dashboard 命令', url: 'https://arthas.aliyun.com/doc/dashboard.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '方法调用观测（watch/trace/monitor）',
          description: 'trace 命令可以追踪方法调用链路和执行耗时；watch 命令可以观察方法的入参、返回值、异常信息；monitor 命令统计方法调用频率和耗时。这些命令是定位性能瓶颈和异常问题的核心工具。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'trace 命令', url: 'https://arthas.aliyun.com/doc/trace.html', icon: 'mdi-play-circle-outline' },
                { title: 'watch 命令', url: 'https://arthas.aliyun.com/doc/watch.html', icon: 'mdi-play-circle-outline' },
                { title: 'monitor 命令', url: 'https://arthas.aliyun.com/doc/monitor.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '在线反编译（jad）',
          description: 'jad 命令可以实时反编译已加载的类，即使代码被混淆或没有源码也能查看完整实现。支持指定具体方法，搭配 mc/redefine 可实现热更新。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'jad 命令', url: 'https://arthas.aliyun.com/doc/jad.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '线程排查（thread）',
          description: 'thread 命令可以查看所有线程状态，自动识别死锁线程和 CPU 占用最高的线程（thread -n），直接定位问题代码行号。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'thread 命令', url: 'https://arthas.aliyun.com/doc/thread.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '热更新代码（redefine）',
          description: '配合 sc、jad、mc 命令，可以在不重启应用的情况下替换线上代码。使用 jad 反编译 -> 编辑源码 -> mc 编译 -> redefine 热替换，快速修复紧急问题。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'redefine 命令', url: 'https://arthas.aliyun.com/doc/redefine.html', icon: 'mdi-play-circle-outline' },
                { title: '热更新实战', url: 'https://arthas.aliyun.com/doc/arthas-tutorials.html', icon: 'mdi-play-circle-outline' },
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
          title: 'OGNL 表达式',
          description: 'Arthas 内置 OGNL 表达式支持，可以通过 ognl 命令执行任意表达式，调用 Bean 方法、访问静态字段、修改配置变量，实现线上动态调试。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'ognl 命令', url: 'https://arthas.aliyun.com/doc/ognl.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '火焰图',
          description: 'Arthas 集成了 async-profiler，支持通过 profiler 命令生成 CPU/内存分配火焰图，直观展示热点方法和内存分配热点。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'profiler 命令', url: 'https://arthas.aliyun.com/doc/profiler.html', icon: 'mdi-file-document-outline' },
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

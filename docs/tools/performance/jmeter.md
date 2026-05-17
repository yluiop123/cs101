<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Apache JMeter',
  description: '开源的性能压测工具，支持 HTTP、数据库、消息队列等多种协议的负载测试。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'JMeter 简介',
          description: 'Apache JMeter 是 Apache 基金会旗下的开源性能测试工具，采用纯 Java 开发。它最初专为 Web 应用压测而设计，现已扩展支持数据库（JDBC）、FTP、LDAP、SOAP/WebService、JMS、gRPC 等多种协议。JMeter 提供了可视化界面、丰富的报告生成器和分布式压测能力，是性能和可靠性测试的首选工具。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'JMeter 官网', url: 'https://jmeter.apache.org/', icon: 'mdi-web' },
                { title: '用户手册', url: 'https://jmeter.apache.org/usermanual/index.html', icon: 'mdi-file-document-outline' },
                { title: '组件参考', url: 'https://jmeter.apache.org/usermanual/component_reference.html', icon: 'mdi-book-open-variant' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'JMeter 需要 Java 8+ 环境。从官网下载二进制包直接解压运行（bin/jmeter.bat 或 bin/jmeter.sh），或通过 Homebrew（brew install jmeter）安装。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 JMeter', url: 'https://jmeter.apache.org/download_jmeter.cgi', icon: 'mdi-download' },
                { title: 'GitHub Releases', url: 'https://github.com/apache/jmeter/releases', icon: 'mdi-github' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JMeter 入门教程', url: 'https://www.bilibili.com/video/BV1iJ411m7xK', icon: 'mdi-play-circle-outline' },
                { title: 'JMeter Full Course', url: 'https://www.youtube.com/watch?v=nFYsM8p8a5E', icon: 'mdi-play-circle-outline' },
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
          title: '测试计划与线程组',
          description: '测试计划是 JMeter 的顶层容器，线程组用于模拟并发用户。可以设置线程数、Ramp-Up 时间和循环次数，精确控制施压模型。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '测试计划构建', url: 'https://jmeter.apache.org/usermanual/build-web-test-plan.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '取样器（Samplers）',
          description: 'JMeter 提供 HTTP 请求、JDBC 请求、TCP 请求、SOAP/XML-RPC 等多种取样器，每种取样器可配置协议细节、参数化、超时等属性，是压测请求的执行单元。',
          resources: [
            {
              name: '参考文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '取样器列表', url: 'https://jmeter.apache.org/usermanual/component_reference.html#samplers', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '监听器与报告',
          description: 'JMeter 提供丰富的监听器来收集和分析结果，包括聚合报告、图形结果、响应时间图、TPS 图等。还可以生成 HTML 格式的 Dashboard 报告。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Dashboard 报告', url: 'https://jmeter.apache.org/usermanual/generating-dashboard.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '断言（Assertions）',
          description: '通过响应断言、JSON 断言、Duration 断言等机制验证请求返回结果是否符合预期，确保压测过程中的功能正确性。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '断言参考', url: 'https://jmeter.apache.org/usermanual/component_reference.html#assertions', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '分布式压测',
          description: 'JMeter 支持 Master-Slave 分布式架构，可协调多台机器同时施压，突破单机性能瓶颈，支持大规模并发场景。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '分布式压测指南', url: 'https://jmeter.apache.org/usermanual/jmeter_distributed_testing_step_by_step.html', icon: 'mdi-play-circle-outline' },
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
          title: '参数化与 CSV 数据驱动',
          description: '使用 CSV Data Set Config 从外部文件读取测试数据，实现数据驱动的压测。支持随机读取、顺序读取和共享模式。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'CSV Data Set Config', url: 'https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: 'JMeter 插件生态',
          description: 'JMeter Plugins 社区提供了大量扩展插件，包括 3D 图表、事务控制器、Stepping Thread Group、PerfMon 监控等。推荐安装 Plugins Manager 统一管理。',
          optional: true,
          resources: [
            {
              name: '资源',
              icon: 'mdi-puzzle',
              items: [
                { title: 'JMeter Plugins Manager', url: 'https://jmeter-plugins.org/wiki/PluginsManager/', icon: 'mdi-puzzle' },
                { title: '插件列表', url: 'https://jmeter-plugins.org/', icon: 'mdi-format-list-bulleted' },
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

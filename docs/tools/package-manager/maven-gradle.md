<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Maven / Gradle',
  description: 'Java 生态中最主流的项目构建和依赖管理工具，支持自动化编译、测试和打包。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Maven',
          description: 'Maven 是 Apache 基金会推出的项目管理和构建工具，基于 POM（Project Object Model）概念。它提供约定优于配置的项目结构、声明式依赖管理和标准化构建生命周期。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Maven 官网', url: 'https://maven.apache.org' }, { title: 'Maven 文档', url: 'https://maven.apache.org/guides/index.html' }] }]
        },
        {
          title: 'Gradle',
          description: 'Gradle 使用 Groovy 或 Kotlin DSL 编写构建脚本，相比 Maven 更灵活高效。它基于 DAG（有向无环图）执行任务，支持增量编译和构建缓存，是 Android 官方构建工具。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Gradle 官网', url: 'https://gradle.org' }, { title: 'Gradle 文档', url: 'https://docs.gradle.org' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '依赖管理',
          description: 'Maven 在 pom.xml 中声明依赖，Gradle 在 build.gradle（Groovy）或 build.gradle.kts（Kotlin）中声明。两者都从 Maven Central 仓库下载依赖，支持传递依赖解析。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Maven 依赖机制', url: 'https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html' }, { title: 'Gradle 依赖管理', url: 'https://docs.gradle.org/current/userguide/dependency_management.html' }] }]
        },
        {
          title: '构建生命周期',
          description: 'Maven 的生命周期包括 clean、validate、compile、test、package、verify、install、deploy 等阶段。Gradle 的任务图更灵活，可通过自定义任务任意编排。',
          groups: [{ name: '教程', icon: 'mdi-lifecycle', items: [{ title: 'Maven 构建生命周期', url: 'https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html' }] }]
        },
        {
          title: '多模块项目',
          description: '两者都支持多模块项目。Maven 通过 parent POM 和 module 组织，Gradle 通过 settings.gradle 的 include 声明子项目。适合大型企业级应用。',
          groups: [{ name: '教程', icon: 'mdi-folder-multiple-outline', items: [{ title: 'Maven 多模块', url: 'https://maven.apache.org/guides/mini/guide-multiple-modules.html' }, { title: 'Gradle 多项目构建', url: 'https://docs.gradle.org/current/userguide/multi_project_builds.html' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: 'Gradle 与 Maven 对比',
          description: 'Gradle 构建速度更快（增量编译、构建缓存）、DSL 更灵活；Maven 更稳定规范、IDE 支持更成熟。Gradle 的学习曲线较陡，但大型项目收益明显。',
          optional: true,
          groups: [{ name: '对比', icon: 'mdi-chart-bar', items: [{ title: 'Gradle vs Maven 对比', url: 'https://gradle.org/maven-vs-gradle/' }] }]
        },
        {
          title: '私有仓库与 Nexus',
          description: '企业可通过 Sonatype Nexus 或 JFrog Artifactory 搭建私有 Maven 仓库，管理内部公共库和代理外部依赖，提升构建速度和安全性。',
          optional: true,
          groups: [{ name: '工具', icon: 'mdi-server', items: [{ title: 'Nexus 官网', url: 'https://www.sonatype.com/products/sonatype-nexus-repository' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

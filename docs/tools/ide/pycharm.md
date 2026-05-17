<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'PyCharm',
  description: 'PyCharm 是 JetBrains 出品的 Python IDE，专为 Python 开发设计，提供智能代码分析、调试、测试和 Web 开发等全流程支持。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'PyCharm 提供 Professional（付费）和 Community（免费开源）两个版本。Professional 版支持 Django/Flask/FastAPI Web 开发、数据库工具、远程解释器、SQLAlchemy 集成等高级功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'PyCharm 官网', url: 'https://www.jetbrains.com/pycharm/' }, { title: '文档中心', url: 'https://www.jetbrains.com/help/pycharm/getting-started.html' }] }] },
        { title: '安装方式', description: '推荐使用 JetBrains Toolbox App 安装，方便多版本管理和更新。社区版完全免费，专业版提供 30 天试用，学生和教师可申请免费教育授权。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 PyCharm', url: 'https://www.jetbrains.com/pycharm/download/' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'PyCharm 教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1bK4y1i7or' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'Python 代码智能', description: '智能代码补全、类型检查、PEP 8 代码风格检查、快速修复。支持 Python 类型注解（Type Hints）的深度分析和提示。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'PyCharm 代码辅助', url: 'https://www.jetbrains.com/help/pycharm/code-assistance.html' }] }] },
        { title: 'Python 调试器', description: '支持多线程调试、远程调试、Python 调试控制台（可实时执行代码表达式）。对 Django、FastAPI 等 Web 框架提供了调试配置模板。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '调试 Python 代码', url: 'https://www.jetbrains.com/help/pycharm/debugging.html' }] }] },
        { title: '测试支持', description: '深度集成 pytest、unittest、doctest，支持测试覆盖率报告、参数化测试的可视化展示。一键运行单个测试或整个测试套件。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '测试指南', url: 'https://www.jetbrains.com/help/pycharm/testing.html' }] }] },
        { title: '科学计算支持', description: '集成 Jupyter Notebook 编辑器，支持交互式数据探索。可与 matplotlib、pandas、numpy 等科学计算库配合使用，查看变量和数据图表。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '科学计算模式', url: 'https://www.jetbrains.com/help/pycharm/matplotlib-support.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '远程解释器', description: '支持通过 SSH、Vagrant、Docker 连接远程 Python 解释器，在本地编辑代码但使用远程环境运行和调试，适合 GPU 服务器或特定环境需求。', optional: true },
        { title: '数据库工具（Pro）', description: '专业版内置数据库客户端，支持 PostgreSQL、MySQL、SQLite 等，可直接在 IDE 中查询和管理数据库。', optional: true },
        { title: 'Django 深度集成', description: '专业版对 Django 提供了模型类关系图、模板解析、URL 路由导航、manage.py 命令面板等深度支持。', optional: true },
        { title: '代码分析器', description: '内置代码审查工具，可检测重复代码、未使用的导入、不符合 PEP 8 的命名等问题，帮助维持代码质量。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />

<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'jq + yq',
  description: '命令行 JSON 和 YAML 处理器，用于解析、过滤和转换结构化数据文件。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'jq',
          description: 'jq 是轻量级且灵活的命令行 JSON 处理器，类似于 sed/awk 但专为 JSON 数据设计。它支持强大的过滤、映射、转换和格式化功能，是处理 API 响应和日志文件的神器。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'jq 官网', url: 'https://jqlang.org' }, { title: 'jq 手册', url: 'https://jqlang.org/manual/' }] }]
        },
        {
          title: 'yq',
          description: 'yq 是 YAML 文件处理器，语法类似 jq。它支持 YAML、JSON、XML 等多种格式的互相转换，是处理 Kubernetes 配置文件和 CI/CD 流水线定义的必备工具。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'yq 官网', url: 'https://mikefarah.gitbook.io/yq' }, { title: 'yq GitHub', url: 'https://github.com/mikefarah/yq' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: 'JSON 查询与过滤',
          description: '使用 .key, .[].field, select(.field == "val") 等表达式过滤和提取 JSON 数据。支持管道操作链式组合多个过滤器。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'jq 入门教程', url: 'https://jqlang.org/tutorial/' }] }]
        },
        {
          title: '数据转换与格式化',
          description: 'jq 可以格式化（美化）JSON、转换数据结构、合并文件、计算统计信息。yq 在 YAML 和 JSON 之间互相转换，支持保留注释。',
          resources: [{ name: '教程', icon: 'mdi-swap-horizontal', items: [{ title: 'jq 使用示例', url: 'https://jqlang.org/faq/' }, { title: 'yq 使用指南', url: 'https://mikefarah.gitbook.io/yq/usage/read' }] }]
        },
        {
          title: 'CI/CD 与脚本集成',
          description: 'jq 和 yq 广泛用于 CI/CD 流水线中处理配置文件。例如用 yq 修改 Kubernetes Deployment 的镜像版本，用 jq 解析 API 响应中的字段。',
          resources: [{ name: '教程', icon: 'mdi-pipeline', items: [{ title: 'K8s 配置与 yq', url: 'https://mikefarah.gitbook.io/yq/usage/kubernetes' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: 'jq 高级过滤',
          description: '掌握 jq 的 reduce、foreach、group_by 和自定义函数可实现复杂数据处理。fromjson/tojson 支持嵌套 JSON 字符串解析。',
          optional: true,
          resources: [{ name: '进阶', icon: 'mdi-code-braces', items: [{ title: 'jq 高级用法', url: 'https://jqlang.org/manual/#advanced-features' }] }]
        },
        {
          title: 'yq 多文档处理',
          description: 'yq 支持处理包含多个 YAML 文档的文件（如 K8s 多资源清单），通过 `--split-exp` 分割文件或 `eval-all` 合并文档。',
          optional: true,
          resources: [{ name: '参考', icon: 'mdi-file-multiple-outline', items: [{ title: 'yq 多文档', url: 'https://mikefarah.gitbook.io/yq/usage/multiple-documents' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

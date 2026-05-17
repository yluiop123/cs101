<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'npm / pnpm / yarn',
  description: 'JavaScript 生态中最流行的三款包管理器，用于管理项目依赖、脚本和版本。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'npm',
          description: 'npm（Node Package Manager）是 Node.js 官方包管理器，随 Node.js 自动安装。它是 JS 生态中使用最广泛的包管理器，拥有全球最大的包注册中心。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'npm 官网', url: 'https://www.npmjs.com' }, { title: 'npm 文档', url: 'https://docs.npmjs.com' }] }]
        },
        {
          title: 'pnpm',
          description: 'pnpm 使用硬链接和符号链接来节省磁盘空间，比 npm 和 yarn 更快更高效。支持 monorepo 和严格依赖隔离，近年来越来越受欢迎。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'pnpm 官网', url: 'https://pnpm.io' }, { title: 'pnpm 文档', url: 'https://pnpm.io/motivation' }] }]
        },
        {
          title: 'Yarn',
          description: 'Yarn 由 Facebook 开发，改进了 npm 早期的性能和可靠性问题。Yarn Berry（v2+）引入了 PnP（Plug-n-Play）模式，无需 node_modules。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Yarn 官网', url: 'https://yarnpkg.com' }, { title: 'Yarn Berry 文档', url: 'https://yarnpkg.com/getting-started' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '依赖管理',
          description: '通过 package.json 管理项目依赖，支持 dependencies、devDependencies、peerDependencies 等分类。常见命令包括 install、add、remove、update。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'npm 依赖管理', url: 'https://docs.npmjs.com/cli/v10/commands/npm-install' }, { title: 'pnpm 依赖管理', url: 'https://pnpm.io/cli/add' }] }]
        },
        {
          title: 'Workspace 与 Monorepo',
          description: '三者均支持 workspace 功能，可在单个仓库中管理多个包。pnpm 的 workspace 原生支持 monorepo，yarn 的 workspace 功能成熟，npm 也在持续改进。',
          resources: [{ name: '教程', icon: 'mdi-folder-multiple-outline', items: [{ title: 'pnpm Workspace', url: 'https://pnpm.io/workspaces' }, { title: 'Yarn Workspace', url: 'https://yarnpkg.com/features/workspaces' }] }]
        },
        {
          title: '脚本执行',
          description: '通过 scripts 字段定义和执行项目命令（如 dev、build、test）。npm/pnpm/yarn 都支持 pre/post 钩子和生命周期脚本。',
          resources: [{ name: '教程', icon: 'mdi-script-text-outline', items: [{ title: 'npm scripts 指南', url: 'https://docs.npmjs.com/cli/v10/using-npm/scripts' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '版本锁定与 lock 文件',
          description: 'package-lock.json（npm）、pnpm-lock.yaml（pnpm）、yarn.lock（yarn）用于锁定依赖版本，确保团队和 CI 环境安装一致的依赖版本。理解 lock 文件差异有助于排查依赖问题。',
          optional: true
        },
        {
          title: '性能对比与选型',
          description: 'pnpm 在安装速度和磁盘占用方面最优；npm 兼容性最好、生态最大；Yarn Berry 的 PnP 模式零 node_modules 开箱即用。根据项目规模和团队需求选择合适的工具。',
          optional: true,
          resources: [{ name: '对比', icon: 'mdi-chart-bar', items: [{ title: 'Benchmark 对比', url: 'https://pnpm.io/benchmarks' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

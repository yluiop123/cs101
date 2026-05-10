import { readFileSync } from 'fs'
import vuetify from 'vite-plugin-vuetify'
import { defineConfig } from 'vitepress'

function extractTitles(md_src: string): { pageName: string; titles: string[] } {
  const titles: string[] = []
  const regex = /(?:title|name):\s*'([^']+)'/g
  let match
  while ((match = regex.exec(md_src)) !== null) {
    const text = match[1].replace(/\*\*/g, '').trim()
    if (text && text.length > 1) titles.push(text)
  }
  const nameMatch = md_src.match(/name:\s*'([^']+)'/)
  return { pageName: nameMatch ? nameMatch[1] : '', titles }
}

export default defineConfig({
  title: 'CS101',
  base:'/cs101/',
  description: '全面的技术学习路径汇总 —— 计算机科学 / 技术栈 / 应用领域',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/icon.svg' }],
    ['style', {}, `.VPNavBar .logo { height: 40px; width: auto; }`],
  ],
  vite: {
    plugins: [vuetify({ autoImport: true })],
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  themeConfig: {
    logo: '/icon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '计算机科学', link: '/computer-science/' },
      { text: '技术栈路线', link: '/tech-stack/' },
      { text: '应用领域路线', link: '/domain/' },
    ],
    sidebar: {
      '/tech-stack/': [
        {text: '概览', link: '/tech-stack/' },
        {
          text: '编程语言',
          items: [
            { text: 'Java', link: '/tech-stack/java' },
            { text: 'Python', link: '/tech-stack/python' },
            { text: 'JavaScript / TypeScript', link: '/tech-stack/javascript-typescript' },
            { text: 'Go', link: '/tech-stack/go' },
            { text: 'C / C++', link: '/tech-stack/c-cpp' },
            { text: 'Rust', link: '/tech-stack/rust' },
            { text: 'C#', link: '/tech-stack/c-sharp' },
            { text: 'Kotlin / Swift / Dart', link: '/tech-stack/kotlin-swift-dart' },
          ],
        },
        {
          text: '数据库',
          items: [
            { text: 'SQL 与关系型数据库', link: '/tech-stack/sql-database' },
            { text: 'MySQL', link: '/tech-stack/mysql' },
            { text: 'PostgreSQL', link: '/tech-stack/postgresql' },
            { text: 'Redis', link: '/tech-stack/redis' },
            { text: 'MongoDB', link: '/tech-stack/mongodb' },
            { text: 'Elasticsearch', link: '/tech-stack/elasticsearch' },
          ],
        },
        {
          text: '中间件',
          items: [
            { text: 'Kafka / 消息队列', link: '/tech-stack/kafka' },
            { text: 'Nginx', link: '/tech-stack/nginx' },
          ],
        },
        {
          text: '运维与云',
          items: [
            { text: 'Docker', link: '/tech-stack/docker' },
            { text: 'Kubernetes', link: '/tech-stack/kubernetes' },
          ],
        },
      ],
      '/domain/': [
        { text: '概览', link: '/domain/' },
        {
          text: '应用领域路线',
          items: [
            { text: 'Web开发 / SaaS应用', link: '/domain/web-saas' },
            { text: '大数据 / 数据工程', link: '/domain/big-data' },
            { text: '人工智能 / 机器学习', link: '/domain/ai-ml' },
            { text: '网络安全', link: '/domain/cybersecurity' },
            { text: '移动开发', link: '/domain/mobile-dev' },
            { text: 'DevOps / 云计算 / 运维', link: '/domain/devops-cloud' },
            { text: 'GIS 技术路线', link: '/domain/gis' },
            { text: '可视化技术路线', link: '/domain/visualization' },
            { text: '游戏开发 / VR / AR', link: '/domain/game-vr-ar' },
            { text: '嵌入式 / IoT', link: '/domain/embedded-iot' },
            { text: '区块链 / Web3', link: '/domain/blockchain-web3' },
            { text: '软件测试 / QA', link: '/domain/software-testing' },
            { text: '金融科技 / 风控系统', link: '/domain/fintech' },
          ],
        },
      ],
      '/computer-science/': [
        {
          text: '计算机科学',
          items: [
            { text: '概览', link: '/computer-science/' },
            { text: '数据结构与算法', link: '/computer-science/data-structures-algorithms' },
            { text: '计算机网络', link: '/computer-science/computer-networks' },
            { text: '操作系统', link: '/computer-science/operating-systems' },
            { text: '数据库系统原理', link: '/computer-science/database-systems' },
            { text: '计算机组成原理', link: '/computer-science/computer-organization' },
            { text: '编译原理', link: '/computer-science/compilers' },
            { text: '离散数学', link: '/computer-science/discrete-mathematics' },
            { text: '软件工程', link: '/computer-science/software-engineering' },
            { text: '人工智能导论', link: '/computer-science/artificial-intelligence' },
            { text: '计算机图形学', link: '/computer-science/computer-graphics' },
            { text: '密码学', link: '/computer-science/cryptography' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          _splitIntoSections(file: string) {
            const src = readFileSync(file, 'utf-8')
            const { pageName, titles } = extractTitles(src)
            if (!titles.length) return undefined
            return [{ anchor: '', titles: pageName ? [pageName] : ['CS101'], text: titles.join(' ') }]
          },
        },
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除搜索条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },
    socialLinks: [],
    footer: {
      message: '基于 VitePress 构建 | 内容参考开源学习路径',
      copyright: '仅供学习参考',
    },
  },
})

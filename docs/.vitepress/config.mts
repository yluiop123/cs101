import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import vuetify from 'vite-plugin-vuetify';
import { defineConfig } from 'vitepress';
import { tutorialSeries } from './tutorial-meta';

interface SearchSection { anchor: string; titles: string[]; text: string }

function extractSections(md_src: string): SearchSection[] | undefined {
  // Page-level name
  const pageNameMatch = md_src.match(/name:\s*'([^']+)'/)
  const pageName = pageNameMatch ? pageNameMatch[1] : ''

  // Find the items array (ContentView pattern)
  const itemsPos = md_src.indexOf('items: [')
  if (itemsPos === -1) {
    // Plain markdown page: return undefined so VitePress falls back
    // to default section splitting based on rendered HTML
    return undefined
  }

  // Parse sections from items array
  const itemsContent = md_src.slice(itemsPos + 8)
  const sections: SearchSection[] = []
  let idx = 0

  // Match each section block: { name: '...', ... children: [...] }
  const secRegex = /\{\s*name:\s*'([^']+)'(?:[\s\S]*?)children:\s*\[/g
  let secMatch: RegExpExecArray | null

  while ((secMatch = secRegex.exec(itemsContent)) !== null) {
    const secName = secMatch[1]
    const childrenStart = secMatch.index + secMatch[0].length

    // Find matching closing bracket for children[...]
    let depth = 1
    let j = childrenStart
    while (j < itemsContent.length && depth > 0) {
      if (itemsContent[j] === '[') depth++
      else if (itemsContent[j] === ']') depth--
      j++
    }
    const childrenBlock = itemsContent.slice(childrenStart, j - 1)

    // Extract child titles
    const titleRegex = /title:\s*'([^']+)'/g
    const texts: string[] = [secName]
    let t
    while ((t = titleRegex.exec(childrenBlock)) !== null) {
      texts.push(t[1])
    }

    sections.push({
      anchor: '#item-' + idx,
      titles: pageName ? [pageName, secName] : [secName],
      text: texts.join(' '),
    })
    idx++
  }

  return sections
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const tutorialsDir = join(__dirname, '..', 'tutorials')

function readFrontmatterTitle(file: string): string {
  try {
    const src = readFileSync(file, 'utf-8').replace(/^\uFEFF/, '')
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const m = fm?.[1].match(/^title:\s*(.+)$/m)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
  } catch {
    return ''
  }
}

/** Scan every tutorial directory and build one sidebar per tutorial */
function buildTutorialSidebars(): Record<string, any> {
  const sidebars: Record<string, any> = {}
  if (!existsSync(tutorialsDir)) return sidebars
  for (const dir of readdirSync(tutorialsDir)) {
    const dirPath = join(tutorialsDir, dir)
    if (!statSync(dirPath).isDirectory()) continue
    const indexPath = join(dirPath, 'index.md')
    if (!existsSync(indexPath)) continue
    const title = readFrontmatterTitle(indexPath) || dir
    const chapters = readdirSync(dirPath)
      .filter((f) => /^\d{2}-.+\.md$/.test(f))
      .sort()
      .map((f) => ({
        text: readFrontmatterTitle(join(dirPath, f)) || f,
        link: `/tutorials/${dir}/${f.slice(0, -3)}`,
      }))
    sidebars[`/tutorials/${dir}/`] = [{ text: title, items: chapters }]
  }
  return sidebars
}

/** Sidebar for the tutorial center page: group tutorials by series */
function buildTutorialCenterSidebar(): any[] {
  const groups = tutorialSeries.map((s) => ({
    text: s.title,
    collapsed: true,
    items: s.tutorials
      .filter((t) => t.status !== 'planned')
      .map((t) => ({ text: t.title, link: `/tutorials/${t.slug}/` })),
  }))
  return [{ text: '教程中心', link: '/tutorials/' }, ...groups]
}

export default defineConfig({
  title: 'CS101',
  base:'/cs101/',
  description: '全面的技术学习路径汇总 —— 计算机科学 / 技术栈 / 应用领域',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/cs101/icon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/cs101/icon.svg' }],
    ['style', {}, `.VPNavBar .logo { height: 40px; width: auto; }
a { text-decoration: none !important; }
a:hover { text-decoration: none !important; }
.VPContent a { text-decoration: none !important; border-bottom: none !important; }
.VPContent a:hover { text-decoration: none !important; border-bottom: none !important; }`],
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
      {
        text: '计算机科学',
        items: [
          { text: '国内教程', link: '/computer-science/zh/' },
          { text: '国际教程', link: '/computer-science/ossu/' },
        ],
      },
      { text: '技术栈路线', link: '/tech-stack/' },
      { text: '应用领域路线', link: '/domain/' },
      { text: '全部教程', link: '/tutorials/' }
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
        { text: '计算机科学', link: '/computer-science/' },
        {
          text: '国内教程',
          items: [
            { text: '概述', link: '/computer-science/zh/' },
            { text: '专业基础课', link: '/computer-science/zh/#basic' },
            { text: '专业必修课', link: '/computer-science/zh/#required' },
            { text: '专业选修课', link: '/computer-science/zh/#elective' },
            { text: '数学必修/选修课', link: '/computer-science/zh/#math' },
          ],
        },
        {
          text: '国际教程',
          items: [
            { text: '概述', link: '/computer-science/ossu/' },
            { text: 'CS入门', link: '/computer-science/ossu/#intro' },
            { text: '核心课程', link: '/computer-science/ossu/#core' },
            { text: '高级课程', link: '/computer-science/ossu/#advanced' },
            { text: '毕业项目', link: '/computer-science/ossu/#project' },
          ],
        },
      ],
      '/tutorials/': buildTutorialCenterSidebar(),
      ...buildTutorialSidebars(),
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          _splitIntoSections(file: string) {
            const src = readFileSync(file, 'utf-8')
            return extractSections(src)
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

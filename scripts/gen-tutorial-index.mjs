// 从 docs/tutorials/** 生成章节索引，供技术栈详情页渲染卡片。
// 由 config.mts 在 dev/build 启动时自动调用；CI 用 --check 防止漂移。
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '..')
const tutorialsDir = path.join(repo, 'docs', 'tutorials')
const outFile = path.join(repo, 'docs', '.vitepress', 'tutorial-index.ts')

function title(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/^﻿/, '')
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const t = m?.[1].match(/^title:\s*(.+)$/m)
  return t ? t[1].trim().replace(/^["']|["']$/g, '') : ''
}

export function buildIndex() {
  const series = {}
  for (const slug of fs.readdirSync(tutorialsDir)) {
    const dir = path.join(tutorialsDir, slug)
    if (!fs.statSync(dir).isDirectory()) continue
    const chapters = fs
      .readdirSync(dir)
      .filter((f) => /^\d\d-.+\.md$/.test(f))
      .sort()
      .map((f, i) => ({ num: i + 1, title: title(path.join(dir, f)), path: `/tutorials/${slug}/${f.slice(0, -3)}` }))
    if (!chapters.length) continue
    series[slug] = { slug, title: title(path.join(dir, 'index.md')) || slug, chapters }
  }
  return series
}

function render(series) {
  return (
    '// 自动生成，请勿手改：由 scripts/gen-tutorial-index.mjs 从 docs/tutorials/** 生成\n' +
    'export interface TutorialChapter { num: number; title: string; path: string }\n' +
    'export interface TutorialSeries { slug: string; title: string; chapters: TutorialChapter[] }\n\n' +
    'export const tutorialIndex: Record<string, TutorialSeries> = ' +
    JSON.stringify(series, null, 2).replace(/\n( *)/g, '\n$1') +
    '\n'
  )
}

const series = buildIndex()
const content = render(series)
const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : ''

if (process.argv.includes('--check')) {
  if (current !== content) {
    console.error('tutorial-index.ts 与 docs/tutorials 内容不一致，请运行 pnpm gen:tutorial')
    process.exit(1)
  }
  console.log('tutorial-index.ts 与正文一致')
} else if (current !== content) {
  fs.writeFileSync(outFile, content)
  const n = Object.values(series).reduce((a, s) => a + s.chapters.length, 0)
  console.log(`已生成 tutorial-index.ts：${Object.keys(series).length} 个系列 / ${n} 章`)
}

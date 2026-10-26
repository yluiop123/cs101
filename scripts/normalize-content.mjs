#!/usr/bin/env node
/**
 * 内容规范化流水线（M2 先支持按目录抽样，M3 扩展到全量）。
 * 输入：.legacy/docs/**（旧站内容快照，仅作素材）
 * 输出：src/content/docs/**
 *
 * 规则：
 * - frontmatter：title 取正文 H1（保留“第 N 章”），原短标题进 sidebar.label
 * - 章节 sidebar.order 取文件名 NN- 前缀、duration 按中文字数估算
 * - 删除与标题重复的正文 H1
 * - ::: tip/info/warning/danger 标题语法 → Starlight aside
 * - 内链统一转换为相对链接（适配 base 子路径部署）
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, posix, relative } from 'node:path';

const SRC = '.legacy/docs';
const OUT = 'src/content/docs';
const onlyIndex = process.argv.indexOf('--only');
const ONLY = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;

const SERIES_DIFFICULTY = {
  git: 'beginner',
  markdown: 'beginner',
  vscode: 'beginner',
  regex: 'beginner',
  html: 'beginner',
  css: 'beginner',
  javascript: 'beginner',
  tailwind: 'beginner',
  vite: 'intermediate',
  vue: 'intermediate',
  react: 'intermediate',
  nodejs: 'intermediate',
  typescript: 'intermediate',
  angular: 'intermediate',
  java: 'intermediate',
  python: 'beginner',
  go: 'intermediate',
  rust: 'advanced',
  sql: 'beginner',
  mysql: 'intermediate',
  redis: 'intermediate',
  docker: 'intermediate',
  linux: 'beginner',
  dsa: 'intermediate',
  os: 'advanced',
  network: 'intermediate',
  'design-patterns': 'advanced',
};

const containerMap = { tip: 'tip', info: 'note', warning: 'caution', danger: 'danger' };

function countCjk(text) {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
}

function readFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return { data, body: source.slice(match[0].length) };
}

function extractDescription(body) {
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(#|>|[-*+]\s|\d+\.\s|```|:::|\|)/.test(line)) continue;
    const text = line
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    if (text.length < 8) continue;
    return text.length > 120 ? `${text.slice(0, 118)}…` : text;
  }
  return '';
}

function dirOf(url) {
  return url.endsWith('/') ? url : `${url.slice(0, url.lastIndexOf('/') + 1)}`;
}

/**
 * @param linkBase  生成链接时的基准（站点实际 URL，章节带尾斜杠）
 * @param resolveBase 解析旧站相对链接时的基准（旧站章节 URL 无尾斜杠，相当于文件）
 */
function toRelative(linkBase, resolveBase, rawTarget, available) {
  if (/^[a-z]+:/i.test(rawTarget) || rawTarget.startsWith('//') || rawTarget.startsWith('#')) return rawTarget;

  const [rawPath, hash] = rawTarget.split('#');
  const resolveDir = dirOf(resolveBase);
  const linkDir = dirOf(linkBase);
  const targetPath = rawPath.startsWith('/') ? rawPath : posix.join(resolveDir, rawPath);

  let normalized = targetPath;
  if (!normalized.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(normalized)) normalized += '/';

  // 目标页面/资源不存在（未迁移的章节、示例里的假文件等）：去掉链接保留文字
  if (normalized.startsWith('/') && !available.has(normalized)) return null;

  let rel = posix.relative(linkDir, normalized || '/') || './';
  if (normalized.endsWith('/') && rel !== './' && !rel.endsWith('/')) rel += '/';
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return hash ? `${rel}#${hash}` : rel;
}

function normalizeBody(body, pageUrl, baseUrl, available) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let removedH1 = false;
  for (const line of lines) {
    if (!removedH1 && /^#\s+/.test(line)) {
      removedH1 = true;
      continue;
    }
    const container = line.match(/^:::\s*(tip|info|warning|danger)\s*(.*)$/);
    if (container) {
      const kind = containerMap[container[1]];
      const title = container[2].trim().replace(/\]/g, '\\]');
      out.push(title ? `:::${kind}[${title}]` : `:::${kind}`);
      continue;
    }
    out.push(
      line.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text, url) => {
        const relative = toRelative(pageUrl, baseUrl, url, available);
        return relative === null ? text : `[${text}](${relative})`;
      }),
    );
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function yamlString(value) {
  return JSON.stringify(value ?? '');
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

const allFiles = await walk(SRC);
const available = new Set(
  allFiles
    .filter((file) => !relative(SRC, file).replace(/\\/g, '/').startsWith('.vitepress/'))
    .map((file) => {
      const rel = relative(SRC, file).replace(/\\/g, '/');
      return `/${rel.replace(/index\.md$/, '').replace(/\.md$/, '/').replace(/\/+/g, '/')}`;
    }),
);
const selected = allFiles.filter((file) => {
  const rel = relative(SRC, file).replace(/\\/g, '/');
  if (rel === 'index.md' || rel.startsWith('.vitepress/')) return false;
  return ONLY ? rel.startsWith(ONLY) : true;
});

let written = 0;
for (const file of selected) {
  const rel = relative(SRC, file).replace(/\\/g, '/');
  const source = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
  const { data, body } = readFrontmatter(source);
  const isSeriesIndex = /\/index\.md$/.test(rel);
  // 系列首页由新站手写（含章节列表组件），normalizer 只处理章节正文
  if (isSeriesIndex) continue;
  const urlPath = `/${rel.replace(/index\.md$/, '').replace(/\.md$/, '/').replace(/\/+/g, '/')}`;
  const pageUrl = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
  // 旧站章节 URL 无尾斜杠，相对链接（如 ./02-basic）以章节所在目录为基准
  const baseUrl = rel.endsWith('/index.md') ? pageUrl : `/${rel.replace(/\.md$/, '')}`;

  const h1 = body.match(/^#\s+(.+)$/m);
  const h1Text = h1 ? h1[1].trim() : '';
  const shortTitle = data.title || h1Text || rel;
  const title = h1Text || shortTitle;

  const series = rel.split('/')[1];
  const orderMatch = rel.match(/\/(\d{2})-/);
  const order = isSeriesIndex ? 0 : orderMatch ? Number(orderMatch[1]) : 99;

  const normalized = normalizeBody(body, pageUrl, baseUrl, available);
  const description = (data.description || extractDescription(normalized))
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const duration = Math.max(3, Math.round(countCjk(normalized) / 300));

  const frontmatter = ['---', `title: ${yamlString(title)}`, `description: ${yamlString(description)}`];
  if (!isSeriesIndex) {
    frontmatter.push(`series: ${series}`);
    frontmatter.push('sidebar:');
    frontmatter.push(`  order: ${order}`);
    frontmatter.push(`  label: ${yamlString(shortTitle)}`);
  }
  if (series && !isSeriesIndex) frontmatter.push(`difficulty: ${SERIES_DIFFICULTY[series] ?? 'intermediate'}`);
  if (!isSeriesIndex) frontmatter.push(`duration: ${duration}`);
  frontmatter.push('---', '');

  const target = join(OUT, rel);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${frontmatter.join('\n')}\n${normalized}\n`, 'utf8');
  written += 1;
}

console.log(`规范化完成：${written} 个文件${ONLY ? `（范围：${ONLY}）` : ''}`);

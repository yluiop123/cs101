#!/usr/bin/env node
/**
 * 构建期生成 ⌘K 搜索索引（section 级）。
 * 输出：public/search-index.json
 * 设计：中文按完整短语 + 拉丁词切分；前端用 MiniSearch + Intl.Segmenter 做查询。
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import GithubSlugger from 'github-slugger';

const DOCS = 'src/content/docs';
const OUT = 'public/search-index.json';

function stripFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return { frontmatter: match?.[1] ?? '', body: match ? source.slice(match[0].length) : source };
}

function titleFrom(frontmatter) {
  const match = frontmatter.match(/^title:\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
}

function descriptionFrom(frontmatter) {
  const match = frontmatter.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
}

function slugify(text, slugger) {
  return slugger.slug(text);
}

function clean(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(DOCS);
const records = [];

for (const file of files) {
  const rel = file.replace(/\\/g, '/').replace(/^src\/content\/docs\//, '');
  const source = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
  const { frontmatter, body } = stripFrontmatter(source);
  const pageTitle = titleFrom(frontmatter) || rel;
  const url = `/${rel.replace(/\.(md|mdx)$/, '/')}`.replace(/\/index\/$/, '/');
  const series = rel.startsWith('tutorials/') ? rel.split('/')[1] : undefined;

  const sections = [];
  let heading = '';
  let buffer = [];
  let inCode = false;
  // 与 Astro/rehype-slug 一致：每个页面一个 slugger，重复标题会自动加 -1
  const slugger = new GithubSlugger();

  for (const rawLine of body.split(/\r?\n/)) {
    if (/^\s*```/.test(rawLine)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (/^\s*(import\s|export\s|<[A-Z])/.test(rawLine)) continue;
    if (/^:::(tip|note|caution|danger)/.test(rawLine)) continue;

    const match = rawLine.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      if (heading || buffer.join(' ').trim()) {
        sections.push({ heading, text: clean(buffer.join(' ')) });
      }
      heading = clean(match[2]);
      buffer = [];
      continue;
    }
    buffer.push(rawLine);
  }
  if (heading || buffer.join(' ').trim()) sections.push({ heading, text: clean(buffer.join(' ')) });

  for (const section of sections) {
    if (!section.text && !section.heading) continue;
    records.push({
      u: url,
      t: pageTitle,
      s: series ?? '',
      h: section.heading,
      a: section.heading ? slugify(section.heading, slugger) : '',
      x: section.text.slice(0, 600),
    });
  }

  // 纯组件渲染的页面（首页、路线页、业务系统章节）正文里没有 markdown 小节，
  // 用 frontmatter 的 description 补一条记录，保证每个页面都能被搜到。
  if (sections.length === 0) {
    const description = descriptionFrom(frontmatter);
    records.push({
      u: url,
      t: pageTitle,
      s: series ?? '',
      h: '',
      a: '',
      x: description.slice(0, 600),
    });
  }
}

await mkdir('public', { recursive: true });
await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), records }), 'utf8');
console.log(`搜索索引生成：${records.length} 个 section，${files.length} 个页面 → ${OUT}`);

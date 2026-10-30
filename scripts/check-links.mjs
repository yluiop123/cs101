#!/usr/bin/env node
/**
 * 构建产物链接检查：扫描 dist 下所有 HTML 中真实的 <a>/<link>/<script>/<img>/<iframe> 引用，
 * 验证站内目标文件存在。只检查标签属性，不误报正文内联代码里的 src="a.js" 之类文本。
 * 用法：pnpm build && pnpm check:links
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const DIST = 'dist';
// 与 astro.config.mjs 的 base 保持同一来源，避免两处硬编码不同步
const BASE = (readFileSync('astro.config.mjs', 'utf8').match(/const BASE = '([^']+)'/) ?? [])[1] ?? '';
const broken = [];
let checked = 0;

const TAG_ATTRS = [
  /<a\b[^>]*?\bhref="([^"]+)"/gi,
  /<link\b[^>]*?\bhref="([^"]+)"/gi,
  /<script\b[^>]*?\bsrc="([^"]+)"/gi,
  /<img\b[^>]*?\bsrc="([^"]+)"/gi,
  /<iframe\b[^>]*?\bsrc="([^"]+)"/gi,
];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extname(entry.name) === '.html') files.push(full);
  }
  return files;
}

function pageUrl(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function existsForPath(pathname) {
  const clean = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  const target = join(DIST, clean.replace(new RegExp(`^${BASE}`), ''));
  if (existsSync(target) && statSync(target).isFile()) return true;
  if (existsSync(join(target, 'index.html'))) return true;
  return false;
}

function resolveLink(from, href) {
  if (!href) return null;
  if (/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;
  if (href.startsWith('//')) return null;
  if (href.startsWith(BASE + '/') || href === BASE) return href;
  if (href.startsWith('/')) return href;
  return new URL(href, `https://x${from}`).pathname;
}

for (const file of walk(DIST)) {
  const from = pageUrl(file);
  const html = readFileSync(file, 'utf8');
  for (const pattern of TAG_ATTRS) {
    for (const match of html.matchAll(pattern)) {
      const resolved = resolveLink(from, match[1]);
      if (!resolved) continue;
      checked += 1;
      if (!existsForPath(resolved)) broken.push({ from, href: match[1], resolved });
    }
  }
}

console.log(`检查 ${checked} 个站内引用，${broken.length} 个目标缺失`);
if (broken.length > 0) {
  for (const item of broken.slice(0, 40)) console.log(`  ${item.from} -> ${item.href}`);
  process.exitCode = 1;
}

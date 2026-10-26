#!/usr/bin/env node
/**
 * 生成新站页面（M3）：
 * 1) 26 个教程系列的系列首页（Git 已有手写版，跳过）
 * 2) 技术栈路线页 19 篇 + 领域路线页 14 篇（挂 TechNodes 组件）
 * 3) 计算机科学数据（zh / ossu）抽取为 JSON
 *
 * 输入：.legacy/docs/（旧站内容快照）
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';

const LEGACY = '.legacy/docs';
const OUT = 'src/content/docs';

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

function toRelative(fromUrl, rawTarget) {
  if (/^[a-z]+:/i.test(rawTarget) || rawTarget.startsWith('//') || rawTarget.startsWith('#')) return rawTarget;
  const [rawPath, hash] = rawTarget.split('#');
  const fromDir = fromUrl.endsWith('/') ? fromUrl : `${fromUrl.slice(0, fromUrl.lastIndexOf('/') + 1)}`;
  const targetPath = rawPath.startsWith('/') ? rawPath : posix.join(fromDir, rawPath);
  let normalized = targetPath;
  if (!normalized.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(normalized)) normalized += '/';
  let rel = posix.relative(fromDir, normalized || '/') || './';
  if (normalized.endsWith('/') && rel !== './' && !rel.endsWith('/')) rel += '/';
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return hash ? `${rel}#${hash}` : rel;
}

function firstParagraph(body) {
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^(#|>|[-*+]\s|\d+\.\s|```|:::|\||<|import\s)/.test(line)) continue;
    const text = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
    if (text.length < 8) continue;
    return text.length > 120 ? `${text.slice(0, 118)}…` : text;
  }
  return '';
}

function stripChapterList(body) {
  const lines = body.split(/\r?\n/);
  const output = [];
  let skipping = false;
  for (const line of lines) {
    if (/^##\s*章节目录/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping && /^##\s/.test(line)) skipping = false;
    if (!skipping) output.push(line);
  }
  return output.join('\n');
}

async function writeIfMissing(target, content) {
  try {
    await readFile(target, 'utf8');
    return false;
  } catch {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content, 'utf8');
    return true;
  }
}

const enc = new TextEncoder();

/* ---------- 1. 系列首页 ---------- */
const tutorialDirs = (await readdir(join(LEGACY, 'tutorials'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let seriesGenerated = 0;
const tutorialSlugs = new Set(tutorialDirs);
for (const slug of tutorialDirs) {
  const legacyIndex = join(LEGACY, 'tutorials', slug, 'index.md');
  let source;
  try {
    source = await readFile(legacyIndex, 'utf8');
  } catch {
    continue;
  }
  const { data, body } = readFrontmatter(source.replace(/^\uFEFF/, ''));
  const pageUrl = `/tutorials/${slug}/`;
  const h1 = body.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : data.title || slug;

  let content = stripChapterList(body)
    .replace(/^#\s+.+$/m, '')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text, url) => {
      let targetSlug = null;
      const absolute = url.match(/^\/tutorials\/([^/)#]+)/);
      const relativeMatch = url.match(/^\.\.\/([^/)#]+)\/?$/);
      if (absolute) targetSlug = absolute[1];
      else if (relativeMatch) targetSlug = relativeMatch[1];
      if (targetSlug && !tutorialSlugs.has(targetSlug)) return text;
      return `[${text}](${toRelative(pageUrl, url)})`;
    })
    .trim();

  const description = firstParagraph(content)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || data.description || '';

  // 把「章节目录」放到正文开头（前置知识/你将学到之前），方便直接开始学习
  const headingIndex = content.search(/\n##\s/);
  const introPart = headingIndex === -1 ? content.trim() : content.slice(0, headingIndex).trim();
  const restPart = headingIndex === -1 ? '' : content.slice(headingIndex + 1).trim();

  const mdx = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    'sidebar:',
    '  order: 0',
    '  hidden: true',
    '---',
    '',
    `import SeriesChapters from '../../../../components/tutorial/SeriesChapters.astro';`,
    '',
    introPart,
    '',
    '## 章节目录',
    '',
    `<SeriesChapters series="${slug}" />`,
    '',
    restPart,
    '',
  ].join('\n');

  // Git 系列首页是手写样板（含自定义介绍），不覆盖
  if (slug === 'git') continue;
  await mkdir(join(OUT, 'tutorials', slug), { recursive: true });
  await writeFile(join(OUT, 'tutorials', slug, 'index.mdx'), mdx, 'utf8');
  seriesGenerated += 1;
}

/* ---------- 2. 技术栈 / 领域路线页 ---------- */
// 站点侧已调整的领域标题：重跑生成脚本时保留，不被旧站标题覆盖
const DOMAIN_TITLES = {
  'ai-ml': '人工智能与大模型应用',
  'big-data': '数据分析与数据工程',
  'blockchain-web3': '区块链与 Web3',
  cybersecurity: '网络安全与应用安全',
  'devops-cloud': '云计算、云原生与 DevOps',
  'embedded-iot': '嵌入式软件与机器人软件',
  fintech: '金融科技与量化交易',
  'game-vr-ar': '游戏开发与实时图形',
  gis: 'GIS 与空间软件',
  'mobile-dev': '移动应用开发',
  'software-engineering': '软件工程与质量工程',
  visualization: '数据可视化与大屏',
  'web-saas': 'Web 开发 / SaaS 应用',
};

// 站点侧已删除的领域页：重跑脚本时不再生成
const DOMAIN_SKIP = new Set(['enterprise-erp', 'software-testing', 'network-distributed']);

async function generateRoutePages(dirName, keyPrefix) {
  const dir = join(LEGACY, dirName);
  const files = (await readdir(dir, { withFileTypes: true })).filter(
    (entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md',
  );
  let count = 0;
  for (const file of files) {
    const slug = file.name.replace(/\.md$/, '');
    if (dirName === 'domain' && DOMAIN_SKIP.has(slug)) continue;
    const source = (await readFile(join(dir, file.name), 'utf8')).replace(/^\uFEFF/, '');
    const { data, body } = readFrontmatter(source);
    const title = (dirName === 'domain' && DOMAIN_TITLES[slug]) || data.title || slug;
    const description = firstParagraph(body);
    const key = keyPrefix ? `${keyPrefix}${slug}` : slug;
    const mdx = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `description: ${JSON.stringify(description)}`,
      '---',
      '',
      `import TechNodes from '../../../components/roadmap/TechNodes.astro';`,
      '',
      `<TechNodes page="${key}" />`,
      '',
    ].join('\n');
    await mkdir(join(OUT, dirName), { recursive: true });
    await writeFile(join(OUT, dirName, `${slug}.mdx`), mdx, 'utf8');
    count += 1;
  }
  return count;
}

await mkdir(join(OUT, 'tech-stack'), { recursive: true });
await mkdir(join(OUT, 'domain'), { recursive: true });
const techCount = await generateRoutePages('tech-stack', '');
const domainCount = await generateRoutePages('domain', 'domain-');

/* ---------- 3. 计算机科学数据 ---------- */
async function extractCourses(file, outName) {
  const source = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
  const start = source.indexOf('const categories = [');
  const end = source.indexOf('\n]', start);
  if (start === -1 || end === -1) throw new Error(`无法定位 categories：${file}`);
  const arrayText = source.slice(start + 'const categories = '.length, end + 2);
  const categories = new Function(`return (${arrayText});`)();
  await mkdir('src/data/computer-science', { recursive: true });
  await writeFile(`src/data/computer-science/${outName}.json`, `${JSON.stringify(categories, null, 2)}\n`, 'utf8');
  return categories.length;
}

const zhCount = await extractCourses(join(LEGACY, 'computer-science/zh/index.md'), 'zh');
const ossuCount = await extractCourses(join(LEGACY, 'computer-science/ossu/index.md'), 'ossu');

/* ---------- 4. 计算机科学页面 ---------- */
const csIndex = [
  '---',
  'title: 计算机科学',
  'description: 从基础理论出发，夯实计算机科学核心课程',
  '---',
  '计算机科学是技术领域的根基，涵盖从底层硬件到上层应用的完整知识体系。这里汇集国内优质中文课程与 OSSU 国际公开课两条路线。',
  '',
  '## 两条学习路线',
  '',
  '### 国内路线',
  '',
  '按专业基础课、专业必修课、专业选修课与数学课程组织，配套中文视频教程。',
  '',
  '[进入国内路线 →](./zh/)',
  '',
  '### 国际路线（OSSU）',
  '',
  '以英文公开课为主，按 CS 入门、核心课程、高级课程与毕业项目推进。',
  '',
  '[进入 OSSU 路线 →](./ossu/)',
  '',
].join('\n');
await mkdir(join(OUT, 'computer-science'), { recursive: true });
await writeFile(join(OUT, 'computer-science', 'index.md'), csIndex, 'utf8');

const csPages = [
  { dir: 'zh', title: '国内版教程', source: 'zh' },
  { dir: 'ossu', title: 'OSSU 国际教程', source: 'ossu' },
];
for (const page of csPages) {
  const legacy = join(LEGACY, 'computer-science', page.dir, 'index.md');
  const source = (await readFile(legacy, 'utf8')).replace(/^\uFEFF/, '');
  const { body } = readFrontmatter(source);
  // 旧页面前半段是 <script setup> 数据定义，正文在 </script> 之后
  const textBody = body.split('</script>').pop() ?? body;
  const intro = firstParagraph(textBody) || page.title;
  const mdx = [
    '---',
    `title: ${JSON.stringify(page.title)}`,
    `description: ${JSON.stringify(intro)}`,
    '---',
    '',
    `import CourseSections from '../../../../components/computer-science/CourseSections.astro';`,
    '',
    intro,
    '',
    `<CourseSections source="${page.source}" />`,
    '',
  ].join('\n');
  await mkdir(join(OUT, 'computer-science', page.dir), { recursive: true });
  await writeFile(join(OUT, 'computer-science', page.dir, 'index.mdx'), mdx, 'utf8');
}

console.log(
  `生成完成：系列首页 ${seriesGenerated} 个，技术栈页 ${techCount} 个，领域页 ${domainCount} 个；` +
    `计算机科学课程 ${zhCount} + ${ossuCount} 类`,
);

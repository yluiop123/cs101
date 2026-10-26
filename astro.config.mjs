import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import baseLinks from './src/integrations/base-links.mjs';

const BASE = '/cs101';
const docsRoot = fileURLToPath(new URL('./src/content/docs', import.meta.url));

/** 从系列首页 frontmatter 读取标题（配置加载时执行，纯文件读取）。 */
function seriesTitle(slug) {
  try {
    const source = readFileSync(join(docsRoot, 'tutorials', slug, 'index.mdx'), 'utf8').replace(/^\uFEFF/, '');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const title = frontmatter?.[1].match(/^title:\s*(.+)$/m);
    return title ? title[1].trim().replace(/^["']|["']$/g, '') : slug;
  } catch {
    return slug;
  }
}

const tutorialGroups = readdirSync(join(docsRoot, 'tutorials'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(docsRoot, 'tutorials', entry.name, 'index.mdx')))
  .map((entry) => ({
    label: seriesTitle(entry.name),
    collapsed: true,
    items: [{ autogenerate: { directory: `tutorials/${entry.name}` } }],
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

export default defineConfig({
  site: 'https://yluiop123.github.io',
  base: BASE,
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    // 安全网：内容统一写相对链接；万一残留根路径链接，构建期补上 base。
    // 必须排在 Starlight 之前，保证 Pagefind 索引到的是补全后的链接。
    baseLinks(BASE),
    react(),
    starlight({
      title: 'CS101',
      description: '中文计算机学习路径：计算机科学 / 技术栈 / 应用领域',
      favicon: '/icon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      customCss: ['./src/styles/global.css'],
      credits: false,
      lastUpdated: false,
      pagination: true,
      // D7 默认值：隐藏右侧「本页内容」目录，保持教程站版式
      tableOfContents: false,
      pagefind: true,
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          borderRadius: '0px',
          codeFontSize: '0.9rem',
        },
      },
      components: {
        Header: './src/components/shell/Header.astro',
        PageTitle: './src/components/shell/PageTitle.astro',
        Pagination: './src/components/shell/Pagination.astro',
        Footer: './src/components/shell/Footer.astro',
      },
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '首页', link: '/' },
            { label: '教程总览', link: '/tutorials/' },
          ],
        },
        {
          label: '教程',
          items: tutorialGroups,
        },
        {
          label: '路线',
          items: [
            { label: '技术栈路线', link: '/tech-stack/' },
            { label: '应用领域', link: '/domain/' },
            { label: '计算机科学', link: '/computer-science/' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [tailwindcss()],
  },
});

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import baseLinks from './src/integrations/base-links.mjs';

const BASE = '/cs101';

// 部署在 GitHub Pages 项目路径下：https://<user>.github.io/cs101/
export default defineConfig({
  site: 'https://yluiop123.github.io',
  base: BASE,
  trailingSlash: 'always',
  prefetch: {
    // 站内 559 个页面：只在 hover 时预取，避免首页大量卡片触发整页预取
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    // 安全网：内容统一写相对链接；万一残留根路径链接，构建期补上 base。
    // 必须排在 Starlight 之前，保证 Pagefind 索引到的是补全后的链接。
    baseLinks(BASE),
    react(),
    starlight({
      title: 'CS101',
      description: '中文计算机学习路径：教程目录 / 应用领域 / 业务系统 / 计算机科学',
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
      // 使用自建 ⌘K 中文搜索（MiniSearch + Intl.Segmenter），关闭 Pagefind
      pagefind: false,
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          borderRadius: '0px',
          codeFontSize: '0.9rem',
        },
      },
      components: {
        Head: './src/components/shell/DocHead.astro',
        Header: './src/components/shell/Header.astro',
        Sidebar: './src/components/shell/Sidebar.astro',
        PageTitle: './src/components/shell/PageTitle.astro',
        Pagination: './src/components/shell/Pagination.astro',
        Footer: './src/components/shell/Footer.astro',
      },
      // 四个板块：首页（教程目录）+ 应用领域 + 业务系统 + 计算机科学（没有总览页，直接下拉到国内 / 国际教程）
      sidebar: [
        {
          label: '板块',
          items: [
            { label: '首页', link: '/' },
            { label: '应用领域', link: '/domain/' },
            { label: '业务系统', link: '/business-systems/' },
            {
              label: '计算机科学',
              items: [
                { label: '国内教程', link: '/computer-science/zh/' },
                { label: '国际教程', link: '/computer-science/en/' },
              ],
            },
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

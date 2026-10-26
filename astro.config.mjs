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
          items: [
            {
              label: 'Git 教程',
              items: [
                { label: '系列首页', link: '/tutorials/git/' },
                { label: '第 1 章 · 版本控制与 Git 入门', link: '/tutorials/git/01-introduction/' },
                { label: '第 2 章 · 基础操作', link: '/tutorials/git/02-basic/' },
                { label: '第 3 章 · 分支管理', link: '/tutorials/git/03-branch/' },
                { label: '第 4 章 · 远程仓库与 GitHub', link: '/tutorials/git/04-remote/' },
                { label: '第 5 章 · 团队协作流程', link: '/tutorials/git/05-collaboration/' },
                { label: '第 6 章 · 进阶技巧', link: '/tutorials/git/06-advanced/' },
                { label: '第 7 章 · 实战场景与最佳实践', link: '/tutorials/git/07-best-practices/' },
              ],
            },
          ],
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

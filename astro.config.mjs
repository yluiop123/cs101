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
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      pagefind: true,
      sidebar: [
        {
          label: '教程',
          items: [
            {
              label: '测试系列',
              items: [{ label: '第 1 章 · 演示', link: '/tutorials/test/01-demo/' }],
            },
          ],
        },
        {
          label: '路线',
          items: [{ label: '技术栈路线', link: '/tech-stack/' }],
        },
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

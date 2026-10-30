// 技术路线：frontend

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: 'Web 公共基础', required: true, items: ['html', 'css', 'javascript', 'typescript', 'dom', 'tailwind'] },
    {
      name: '框架选型',
      kind: 'choice',
      note: '五个框架任选其一即可，每个框架下是一系列配套教程；学完再继续下面的公共模块。React 生态与岗位需求最大，Vue / Angular 同样常用，Svelte / Solid 生态较小、适合按兴趣尝试或团队已有积累时选择。',
      items: [],
      options: [
        { name: 'React', role: 'recommended', items: ['react', 'react-router', 'react-state', 'ant-design', 'nextjs'] },
        { name: 'Vue', role: 'popular', items: ['vue', 'vue-router', 'pinia', 'element-plus', 'nuxt'] },
        { name: 'Angular', role: 'popular', items: ['angular', 'rxjs', 'ngrx', 'angular-material'] },
        { name: 'Svelte', role: 'niche', items: ['svelte'] },
        { name: 'Solid', role: 'niche', items: ['solid'] },
      ],
    },
    { name: '前端工程化与质量', required: true, items: ['frontend-bundler', 'eslint', 'vitest', 'playwright', 'a11y', 'i18n', 'perf-web'] },
    { name: '全栈与服务端', items: ['nodejs', 'rest-api', 'express', 'nestjs', 'bun', 'deno'] },
    { name: '桌面端开发', items: ['electron', 'tauri'] },
    { name: '跨端与小程序', items: ['flutter', 'react-native', 'uniapp'] },
    { name: '原生移动开发', items: ['kotlin', 'android-sdk', 'jetpack-compose', 'swift', 'swiftui'] },
    { name: '文档站点与静态站点生成', items: ['vitepress', 'docusaurus', 'starlight', 'astro'] },
];

export default route;

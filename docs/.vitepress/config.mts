import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/cs101/',
  title: "CS101",
  description: "计算机知识教程",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '计算机基础',
        items: [
          { text: '操作系统', link: '/item-1' },
          { text: '数据结构', link: '/item-2' },
          { text: '计算机网络', link: '/item-2' },
          { text: '软件工程', link: '/item-2' },
          { text: '数据库', link: '/item-3' }
        ]
      },
      {
        text: '学习路线',
        items: [
          { text: 'java开发', link: '/route/java/java/getting-started'},
          { text: '前端开发', link: '/route/java/java/index2' },
          { text: 'gis开发', link: '/item-3' },
          { text: '网络安全', link: '/item-3'}
        ]
      }
    ],

    sidebar: {
      '/route/java/': [
        {
          text: 'JAVA学习路线',
          items: [
            { text: 'java教程', 
              collapsed: false,
              items: [
                {
                  text: '入门指南',
                  link: '/route/java/java/getting-started',
                },
                {
                  text: '面向对象',
                  link: '/route/java/java/oop',
                },
                {
                  text: 'java语言基础',
                  collapsed: true,
                  items: [
                    {
                      text: '创建变量及命名',
                      link: '/route/java/java/language-basics/variables',
                    },
                    {
                      text: '基本数据类型',
                      link: '/route/java/java/language-basics/primitive-types',
                    },
                    {
                      text: '数组',
                      link: '/route/java/java/language-basics/arrays',
                    },
                    {
                      text: '使用 var 类型标识符',
                      link: '/route/java/java/language-basics/using-var',
                    },
                    {
                      text: '运算符的使用',
                      link: '/route/java/java/language-basics/using-operators',
                    },
                    {
                      text: '运算符概述',
                      link: '/route/java/java/language-basics/all-operators',
                    },
                    {
                      text: '表达式、语句和代码块',
                      link: '/route/java/java/language-basics/expressions-statements-blocks',
                    },
                    {
                      text: '控制流语句',
                      link: '/route/java/java/language-basics/controlling-flow',
                    },
                    {
                      text: 'Switch 语句',
                      link: '/route/java/java/language-basics/switch-statement',
                    },
                    {
                      text: 'Switch 表达式',
                      link: '/route/java/java/language-basics/switch-expression',
                    }
                  ]
                }
              ]
            },
            { text: 'springboot', link: '/route/java/springboot' },
            { text: 'springcloud+alibaba', link: '/route/java/java' },
            { text: 'lombok', link: '/route/java/java' },
            { text: 'java最新教程', link: '/route/java/java' },
            { text: 'java最新教程', link: '/route/java/java' },
            { text: 'springboot', link: '/route/java/java8/index2' }
          ]
        },
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/config/': [
        {
          text: 'Config',
          items: [
            { text: 'Index', link: '/config/' },
            { text: 'Three', link: '/config/three' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

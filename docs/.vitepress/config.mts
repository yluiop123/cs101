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
            { 
              base: '/route/java/',
              text: 'java教程', 
              collapsed: false,
              items: [
                {
                  text: '入门指南',
                  link: 'java/getting-started',
                },
                {
                  text: '面向对象',
                  link: 'java/oop',
                },
                {
                  base: '/route/java/java/language-basics/',
                  text: 'java语言基础',
                  collapsed: true,
                  items: [
                    {
                      text: '创建变量及命名',
                      link: 'variables',
                    },
                    {
                      text: '基本数据类型',
                      link: 'primitive-types',
                    },
                    {
                      text: '数组',
                      link: 'arrays',
                    },
                    {
                      text: '使用 var 类型标识符',
                      link: 'using-var',
                    },
                    {
                      text: '运算符的使用',
                      link: 'using-operators',
                    },
                    {
                      text: '运算符概述',
                      link: 'all-operators',
                    },
                    {
                      text: '表达式、语句和代码块',
                      link: 'expressions-statements-blocks',
                    },
                    {
                      text: '控制流语句',
                      link: 'controlling-flow',
                    },
                    {
                      text: 'Switch 语句',
                      link: 'switch-statement',
                    },
                    {
                      text: 'Switch 表达式',
                      link: 'switch-expression',
                    }
                  ]
                },
                {
                  base: '/route/java/java/classes-objects/',
                  text: '类和对象',
                  collapsed: true,
                  items: [
                    {
                      text: '创建类',
                      link: 'creating-classes',
                    },
                    {
                      text: '定义方法',
                      link: 'defining-methods',
                    },
                    {
                      text: '为类提供构造函数',
                      link: 'defining-constructors',
                    },
                    {
                      text: '调用方法和构造函数',
                      link: 'calling-methods-constructors',
                    },
                    {
                      text: '创建和使用对象',
                      link: 'creating-objects',
                    },
                    {
                      text: '有关类的更多信息',
                      link: 'more-on-classes',
                    },
                    {
                      text: '嵌套类',
                      link: 'nested-classes',
                    },
                    {
                      text: '枚举',
                      link: 'enums',
                    },
                    {
                      text: '最佳实践',
                      link: 'design-best-practices',
                    }
                  ]
                },
                {
                  text: 'Record',
                  link: 'java/records',
                },
                {
                  base: '/route/java/java/numbers-strings/',
                  text: '数值和字符串',
                  collapsed: true,
                  items: [
                    {
                      text: '数值',
                      link: 'numbers',
                    },
                    {
                      text: '字符',
                      link: 'characters',
                    },
                    {
                      text: '字符串',
                      link: 'strings',
                    },
                    {
                      text: 'StringBuilder',
                      link: 'string-builders',
                    },
                    {
                      text: '自动装箱和拆箱',
                      link: 'autoboxing',
                    }
                  ]
                },
                {
                  base: '/route/java/java/inheritance/',
                  text: '继承',
                  collapsed: true,
                  items: [
                    {
                      text: '继承',
                      link: 'what-is-inheritance',
                    },
                    {
                      text: '覆写',
                      link: 'overriding',
                    },
                    {
                      text: '多态',
                      link: 'polymorphism',
                    },
                    {
                      text: 'Object',
                      link: 'objects',
                    },
                    {
                      text: '抽象方法和类',
                      link: 'abstract-classes',
                    }
                  ]
                },
                {
                  base: '/route/java/java/interfaces/',
                  text: '接口',
                  collapsed: true,
                  items: [
                    {
                      text: '接口',
                      link: 'defining-interfaces',
                    },
                    {
                      text: '接口的实现',
                      link: 'examples',
                    },
                    {
                      text: '使用接口作为类型',
                      link: 'interfaces-as-a-type',
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

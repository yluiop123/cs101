import {type DefaultTheme } from 'vitepress'
export function nav(): DefaultTheme.NavItem[] {
    return [
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
          { text: 'python开发', link: '/item-3' },
          { text: 'c/c++', link: '/item-3' },
          { text: 'go语言', link: '/item-3' },
          { text: 'c#', link: '/item-3' },
          { text: 'gis开发', link: '/item-3' },
          { text: '网络安全', link: '/item-3'}
        ]
      }
    ]
  }
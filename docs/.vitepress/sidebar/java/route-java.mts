import {type DefaultTheme } from 'vitepress'
import {sidebarJava} from './java.mjs'

export function routeJava(): DefaultTheme.SidebarItem[] {
    return [
      {
        text: 'JAVA学习路线',
        items: [
          { 
            base: '/route/java/',
            text: 'java教程', 
            collapsed: false,
            items: sidebarJava()
          },
          { text: 'springboot', link: '/route/java/springboot' },
          { text: 'springcloud+alibaba', link: '/route/java/java' },
          { text: 'lombok', link: '/route/java/java' },
          { text: 'guava', link: '/route/java/java' },
          { text: 'apache common', link: '/route/java/java' },
          { text: 'maven', link: '/route/java/java' },
          { text: 'gradle', link: '/route/java/java' },
          { text: '文档处理技术', link: '/route/java/java8/index2' }
        ]
      },
    ]
  }
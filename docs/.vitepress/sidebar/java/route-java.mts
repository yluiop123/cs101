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
          { text: 'java最新教程', link: '/route/java/java' },
          { text: 'java最新教程', link: '/route/java/java' },
          { text: 'springboot', link: '/route/java/java8/index2' }
        ]
      },
    ]
  }
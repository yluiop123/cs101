import {type DefaultTheme } from 'vitepress'
import {sidebarOperateSystem} from './operate-system.mjs'

export function baseCs(): DefaultTheme.SidebarItem[] {
    return [
      {
        text: 'ComputeScience',
        items: [
          { 
            base: '/base/cs/operating-systems/',
            text: '操作系统', 
            collapsed: true,
            items: sidebarOperateSystem()
          },
          { text: '数据库系统', link: '/route/java/springboot' },
          { text: '软件工程', link: '/route/java/java' },
          { text: '数据机构与算法', link: '/route/java/java' },
          { text: '计算机网络', link: '/route/java/java' }
        ]
      },
    ]
  }
import { defineConfig, type DefaultTheme } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import {routeJava} from './sidebar/java/route-java.mjs'
import {baseCs} from './sidebar/cs/base-cs.mjs'
import {nav} from './nav.mjs'
// https://vitepress.dev/reference/site-config

export default withMermaid({
  mermaid: {
  
  },
  mermaidPlugin: {
    class: "mermaid my-class",
  },
  base:'/cs101/',
  title: "CS101",
  description: "计算机知识教程",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav:nav() ,
    sidebar: {
      '/route/java/': routeJava(),
      '/base/cs/': baseCs()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})




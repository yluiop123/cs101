import { defineConfig, type DefaultTheme } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import {routeJava} from './sidebar/java/route-java.mjs'
import {baseCs} from './sidebar/cs/base-cs.mjs'
import {nav} from './nav.mjs'
// https://vitepress.dev/reference/site-config

export default withMermaid({
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
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
      { icon: 'github',
        link: 'https://github.com/yluiop123/cs101' },
      { icon: {svg:`<svg t="1725095528389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4233" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="4234"></path></svg>`}, 
        link: 'https://github.com/yluiop123/cs101' },
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
    darkModeSwitchTitle: '切换到深色模式',
    search: {
      provider: 'local'
    }
  }
})




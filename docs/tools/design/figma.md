<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Figma',
  description: '基于浏览器的协作式 UI/UX 设计工具，支持矢量编辑、原型设计和开发者交接。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Figma 是一款基于 Web 的界面设计工具，支持多人实时协作编辑。它提供矢量图形编辑、组件系统、自动布局、原型交互等功能，是当今最流行的 UI/UX 设计平台之一。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Figma 官网', url: 'https://www.figma.com' }, { title: '帮助中心', url: 'https://help.figma.com' }] }]
        },
        {
          title: '安装方式',
          description: 'Figma 可直接在浏览器中使用，无需安装。也提供 Windows 和 macOS 桌面客户端，可从官网下载获得更流畅的本地体验。',
          groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '桌面客户端下载', url: 'https://www.figma.com/downloads' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '矢量编辑与设计',
          description: '提供钢笔工具、布尔运算、矢量网络等丰富的矢量编辑功能。支持像素级精确控制、渐变、阴影和混合模式等设计效果。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Figma 设计基础', url: 'https://help.figma.com/hc/en-us/categories/360002042553-Design' }] }]
        },
        {
          title: '组件与样式系统',
          description: '通过组件（Components）和变体（Variants）构建设计系统。样式（Styles）统一管理颜色、字体和效果，确保设计一致性。',
          groups: [{ name: '教程', icon: 'mdi-shape-outline', items: [{ title: '组件与样式指南', url: 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma' }] }]
        },
        {
          title: '自动布局',
          description: 'Auto Layout 功能让设计元素自动响应内容变化，类似前端 Flexbox 布局。极大提升响应式设计效率。',
          groups: [{ name: '教程', icon: 'mdi-view-grid-outline', items: [{ title: 'Auto Layout 教程', url: 'https://help.figma.com/hc/en-us/articles/5731482952591-Using-Auto-Layout-in-Figma' }] }]
        },
        {
          title: '原型与交互',
          description: '在设计稿上添加交互连接，创建可点击原型。支持过渡动画、滚动行为和条件逻辑，模拟真实应用体验。',
          groups: [{ name: '教程', icon: 'mdi-cellphone-link', items: [{ title: '原型设计入门', url: 'https://help.figma.com/hc/en-us/articles/360040315193-Create-prototypes-in-Figma' }] }]
        }
      ]
    },
    {
      name: '开发者协作', subtitle: '选修',
      children: [
        {
          title: '开发者模式',
          description: 'Figma 的 Dev Mode 专为开发者设计，可查看元素属性（尺寸、间距、颜色代码）、导出资源和生成 CSS/代码片段，简化设计交接流程。',
          optional: true,
          groups: [{ name: '教程', icon: 'mdi-code-json', items: [{ title: 'Dev Mode 说明', url: 'https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode' }] }]
        },
        {
          title: '插件与社区',
          description: 'Figma 社区提供大量插件和设计资源，包括图标库、设计系统、自动化工具等，可显著扩展 Figma 的功能。',
          optional: true,
          groups: [{ name: '资源', icon: 'mdi-puzzle-outline', items: [{ title: 'Figma 社区', url: 'https://www.figma.com/community' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

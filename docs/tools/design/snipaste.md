<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Snipaste',
  description: '轻量级截图工具，支持截图后贴图到屏幕上，适合设计师和开发者的日常取色和标注。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Snipaste（截图 + 贴图）是一款轻量级截图工具，核心特色是截图后可以将图片"贴"在屏幕上作为参考。内置取色器、标注工具和像素放大镜，非常适合 UI 设计和前端开发场景。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Snipaste 官网', url: 'https://www.snipaste.com' }] }]
        },
        {
          title: '安装方式',
          description: '从 Snipaste 官网下载对应操作系统的版本。Windows 用户也可通过 Microsoft Store 安装。绿色版无需安装，解压即用。',
          resources: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://www.snipaste.com/download.html' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '截图与标注',
          description: '按 F1 快捷键快速截图，支持矩形/椭圆/多边形/自由笔等多种标注工具，以及箭头、文字、马赛克和序号等标注元素。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '使用指南', url: 'https://www.snipaste.com/manual' }] }]
        },
        {
          title: '贴图功能',
          description: 'Snipaste 最独特的功能——截图后按 F3 可将截图"贴"在屏幕上，作为设计参考或临时备忘录。支持多张贴图、缩放旋转和透明度调节。',
          resources: [{ name: '教程', icon: 'mdi-sticker-outline', items: [{ title: '贴图功能介绍', url: 'https://www.snipaste.com/manual#paste' }] }]
        },
        {
          title: '取色器',
          description: '内置取色器支持屏幕任意位置取色，F1 截图界面中按 C 键即可复制颜色值，支持 HEX、RGB 等多种格式输出。',
          resources: [{ name: '教程', icon: 'mdi-eyedropper', items: [{ title: '取色器使用', url: 'https://www.snipaste.com/manual#color-picker' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '贴图与设计协作',
          description: '将设计稿截图贴图到屏幕上，再对照编写前端代码，无需频繁切换窗口。支持贴图置顶显示，可同时参考多张设计稿。',
          optional: true
        },
        {
          title: '历史记录与回放',
          description: 'Snipaste 会保存截图历史记录，Shift+F1 可查看历史截图。支持截图回放功能，方便回顾之前的操作。',
          optional: true,
          resources: [{ name: '参考', icon: 'mdi-history', items: [{ title: '历史记录说明', url: 'https://www.snipaste.com/manual#history' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />

---
title: 初识 HTML
---

# 第 1 章 · 初识 HTML

**本章目标：**

- 理解网页从请求到渲染的完整过程
- 知道 HTML 是什么、处于什么位置
- 跑通第一个网页，建立开发环境

## 1.1 网页是怎么显示出来的

在浏览器输入一个网址后发生了什么：

```text
1. 输入 https://example.com        （URL，统一资源定位符）
2. 浏览器向服务器发送 HTTP 请求
3. 服务器返回一个 HTML 文件
4. 浏览器解析 HTML → 绘制出你看到的页面
```

HTML 就是这个过程的"原料"：浏览器解析 HTML（HyperText Markup Language，超文本标记语言）文档，把它渲染成图文并茂的页面。

**超文本**：不止文字，还有图片、链接、视频——而链接让网页之间互相"跳转"，构成了 World Wide Web。

## 1.2 三件套：HTML / CSS / JS

网页由三种技术分工协作：

| 技术 | 职责 | 类比 |
| --- | --- | --- |
| **HTML** | 结构与内容（有什么） | 骨架 |
| **CSS** | 样式与外观（什么样） | 皮肤 |
| **JavaScript** | 行为与交互（做什么） | 神经 |

::: tip 学习顺序的意义
本教程按 HTML → CSS → JavaScript 的顺序展开——先搭骨架，再化妆，最后注入灵魂。每一层都建立在前一层之上。
:::

## 1.3 HTML5 简史

- **1991**：Tim Berners-Lee 发明第一版 HTML，仅十几个标签
- **1999**：HTML 4.01 成为广泛使用的经典版本
- **2000 年代初**：XHTML 试图用更严格的 XML 规则改造 HTML，因过于严苛逐渐失败
- **2014**：HTML5 正式定稿——支持多媒体（`video`/`audio`）、语义化标签、本地存储等，延续至今

今天的"写 HTML"默认就是写 HTML5，浏览器向后兼容一切合理的历史写法。

## 1.4 认识浏览器开发者工具

用 Chrome / Edge 打开任意网页，按 `F12` 打开**开发者工具（DevTools）**，重点认识 **Elements（元素）面板**：

- 左侧是**实时渲染后的 DOM 树**（文档对象模型，Document Object Model）——注意它可能和服务器返回的源码不同（JS 动态改过）
- 点击任意节点，右侧显示该元素的 CSS 样式
- 这是你以后排查页面问题的第一入口

::: tip 观察学习法
看到喜欢的网页，F12 打开 Elements 面板研究它的结构——这是前端学习最快的进步方式。
:::

## 1.5 第一个网页

确保已完成 [VS Code 教程](/tutorials/vscode/) 并安装了 **Live Server** 插件（实时预览），然后：

1. 新建文件夹 `html-demo`，用 VS Code 打开
2. 新建文件 `index.html`，输入以下内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>Hello, HTML!</h1>
    <p>这是我的第一个网页。</p>
  </body>
</html>
```

3. 右键编辑器 → **Open with Live Server**，浏览器自动打开页面

修改 `<h1>` 里的文字并保存，浏览器会**自动刷新**——这个即时反馈循环是学习前端最大的乐趣来源。

## 本章小结

- 网页流程：URL → HTTP 请求 → HTML → 渲染
- 三件套分工：HTML 骨架、CSS 皮肤、JS 神经
- DevTools 的 Elements 面板显示实时 DOM，是排查问题的第一入口
- Live Server 保存即刷新，建立即时反馈循环

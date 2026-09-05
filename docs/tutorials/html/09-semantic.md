---
title: 语义化与页面结构
---

# 第 9 章 · 语义化与页面结构

**本章目标：**

- 理解语义化（semantic）的三重价值
- 掌握页面结构语义标签的分工
- 能画出并写出规范的页面骨架

## 9.1 什么是语义化

语义化 = **用"含义正确"的标签描述内容**：

```html
<!-- 没有语义：全是无意义的盒子 -->
<div class="top"><div class="menu">...</div></div>
<div class="content">...</div>
<div class="bottom">...</div>

<!-- 语义化：标签即说明 -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

两种写法渲染出来可以一模一样，但语义化版本多出三重价值：

| 价值 | 说明 |
| --- | --- |
| **SEO** | 搜索引擎靠语义标签理解页面结构，权重判断更准 |
| **无障碍** | 屏幕阅读器（screen reader）用语义标签做快捷导航（如"跳到主内容"） |
| **可维护** | 团队成员读标签即懂结构，`<footer>` 永远比 `<div class="bottom">` 直白 |

## 9.2 结构语义标签全景

```text
┌──────────────────────────────┐
│ header   （页头：logo/标题）   │
│ nav      （主导航）           │
├──────────────┬───────────────┤
│              │               │
│   main       │    aside      │
│  （主内容）    │  （侧边栏）    │
│  ├ article   │               │
│  │  └ section│               │
│              │               │
├──────────────┴───────────────┤
│ footer   （页脚：版权/链接）    │
└──────────────────────────────┘
```

| 标签 | 语义 | 使用要点 |
| --- | --- | --- |
| `<header>` | 介绍性内容区 | 页面或区块的"头部" |
| `<nav>` | 导航链接集合 | 只放**主要**导航组 |
| `<main>` | 页面主内容 | **每页仅一个**，不放在 article/aside 等内部 |
| `<article>` | 独立完整的内容块 | 一篇帖子、一条评论、一张卡片——脱离上下文仍能独立成立 |
| `<section>` | 按主题分组的内容段 | 通常带一个标题（h2~h6） |
| `<aside>` | 与主内容弱相关的内容 | 侧边栏、广告、推荐阅读 |
| `<footer>` | 页脚/区块尾注 | 版权、备案、相关链接 |

## 9.3 article 与 section 怎么选

最容易混淆的两个标签，判断标准：

- 内容**独立成篇**（RSS 里单发也成立）→ `<article>`
- 内容**依附主题**（是大主题下的一节）→ `<section>`

```html
<main>
  <article>
    <h1>Vue 3 组合式 API 实战</h1>
    <section>
      <h2>为什么需要组合式 API</h2>
      <p>……</p>
    </section>
    <section>
      <h2>核心用法</h2>
      <p>……</p>
    </section>
  </article>
  <aside>相关教程推荐……</aside>
</main>
```

::: tip 心法
article/section 内**都应有一个标题**（h1~h6）——没有标题的"一段话"用 `<p>`，不确定语义时 `<div>` 兜底，永远优于滥用伪语义标签。
:::

## 9.4 div 与 span 的定位

`<div>`（块级）与 `<span>`（行内）是**无语义容器**——它们的正当用途是：

1. 纯粹为了**布局/样式分组**（CSS 需要一个挂载点）
2. 语义标签都不合适的兜底

判断顺序：**有语义标签用语义标签 → 没有再用 div/span**。反过来"全部 div 打天下"就是反模式。

## 9.5 典型页面骨架

一个标准的内容页骨架：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>文章标题 - 站点名</title>
  </head>
  <body>
    <header>
      <h1>CS101</h1>
      <nav>
        <a href="/">首页</a>
        <a href="/tutorials/">全部教程</a>
      </nav>
    </header>

    <main>
      <article>
        <h2>文章标题</h2>
        <section><h3>背景</h3><p>……</p></section>
        <section><h3>方案</h3><p>……</p></section>
      </article>
      <aside>相关推荐……</aside>
    </main>

    <footer>
      <p>© 2024 CS101 · 仅供学习参考</p>
    </footer>
  </body>
</html>
```

## 9.6 综合示例：带样式的语义布局

```html
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; margin: 0; }
  header, footer { background: #1e293b; color: #fff; padding: 12px 18px; }
  nav a { color: #93c5fd; margin-right: 14px; text-decoration: none; }
  main { display: flex; gap: 16px; padding: 16px; }
  article { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
  aside { width: 150px; background: #fef9c3; border-radius: 8px; padding: 12px; }
  footer { text-align: center; font-size: 13px; }
</style>

<header>
  <strong>CS101</strong>
  <nav><a href="#">首页</a><a href="#">教程</a><a href="#">关于</a></nav>
</header>
<main>
  <article>
    <h3>语义化让结构自解释</h3>
    <p>这个区块是 article：一篇独立的内容。</p>
  </article>
  <aside>我是 aside：侧边的补充内容</aside>
</main>
<footer>© 2024 CS101</footer>
```

::: info 观察要点
示例中的布局效果由 `<style>` 里的少量 CSS 实现（下一本 [CSS 教程](/tutorials/css/) 系统学习）；这里关注的是**标签结构**与区域的对应关系。
:::

## 本章小结

- 语义化 = 用含义正确的标签描述内容，收益是 SEO、无障碍与可维护性
- 页面骨架：header/nav/main/aside/footer，main 每页唯一
- 独立成篇用 article，主题分节用 section，都要配标题
- div/span 只做纯样式容器与兜底，永远先找语义标签

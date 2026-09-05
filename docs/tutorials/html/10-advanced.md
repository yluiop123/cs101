---
title: HTML5 进阶与综合实战
---

# 第 10 章 · HTML5 进阶与综合实战

**本章目标：**

- 掌握 data-* 自定义属性与常用 HTML5 组件
- 综合运用全教程知识，从零完成一个个人主页

## 10.1 data-*：自定义数据属性

HTML 允许用 `data-` 前缀给元素挂自定义数据，供 CSS/JS 使用：

```html
<article
  data-id="1024"
  data-author="tom"
  data-tags="vue,前端"
>
  ……
</article>
```

规则与用途：

- 属性名必须是 `data-xxx`（小写字母、数字、连字符）
- JS 通过 `element.dataset.xxx` 读写（`data-user-id` → `dataset.userId`）
- 典型场景：列表项携带业务 ID、标记元素状态，避免把数据塞进 class 或 id

```js
const el = document.querySelector('article')
el.dataset.id        // '1024'
el.dataset.tags      // 'vue,前端'
```

## 10.2 折叠面板：details 与 summary

零 JS 实现折叠交互：

```html
<details>
  <summary>如何重置密码？</summary>
  <p>进入"账号设置 → 安全中心"，点击"修改密码"。</p>
</details>

<details open>
  <summary>默认展开的条目</summary>
  <p>加 open 属性即可。</p>
</details>
```

FAQ、侧栏分组、轻量手风琴——很多场景不再需要写折叠组件。

## 10.3 原生对话框：dialog

```html
<button id="openBtn">打开对话框</button>

<dialog id="myDialog">
  <h3>确认操作</h3>
  <p>确定要删除这条记录吗？</p>
  <form method="dialog">
    <button value="cancel">取消</button>
    <button value="ok">确定</button>
  </form>
</dialog>

<script>
  const dlg = document.getElementById('myDialog')
  document.getElementById('openBtn').onclick = () => dlg.showModal()
</script>
```

`showModal()` 打开自带**遮罩 + ESC 关闭 + 焦点管理**，替代了大量第三方弹窗组件的入门场景。

## 10.4 其他实用标签速览

| 标签 | 用途 |
| --- | --- |
| `<progress value="70" max="100">` | 进度条 |
| `<meter value="0.8">` | 度量/评分展示 |
| `<time datetime="2024-01-15">1月15日</time>` | 机器可读的时间 |
| `<address>` | 联系方式区块 |
| `<wbr>` | 长单词的建议换行点 |
| `<template>` | 内容模板（配合 JS 批量渲染） |

## 10.5 综合实战：从零做一个个人主页

综合运用：语义化结构 + 文本/链接/图片标签 + 表单 + details/dialog/data-*。

```html
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; margin: 0; color: #1e293b; background: #f8fafc; }
  .wrap { max-width: 640px; margin: 0 auto; }
  header { background: linear-gradient(135deg, #1d4ed8, #2563eb); color: #fff; padding: 32px 24px; text-align: center; }
  header h1 { margin: 0 0 6px; font-size: 26px; }
  header p { margin: 0; opacity: 0.85; }
  nav { display: flex; justify-content: center; gap: 18px; padding: 10px; background: #fff; border-bottom: 1px solid #e2e8f0; }
  nav a { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px; }
  main { padding: 20px; }
  section { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  section h2 { margin: 0 0 10px; font-size: 17px; color: #1d4ed8; }
  .skill { display: inline-block; background: #eff6ff; color: #1d4ed8; border-radius: 999px; padding: 4px 12px; margin: 2px; font-size: 13px; }
  details { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; margin: 6px 0; }
  summary { cursor: pointer; font-weight: 600; }
  form input, form textarea { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 4px 0 10px; font-family: inherit; }
  form button { background: #2563eb; color: #fff; border: 0; padding: 8px 20px; border-radius: 6px; cursor: pointer; }
  footer { text-align: center; color: #64748b; font-size: 13px; padding: 18px; }
</style>

<div class="wrap">
  <header>
    <h1>你好，我是小天</h1>
    <p>前端学习者 · 正在学 HTML</p>
  </header>

  <nav>
    <a href="#about">关于我</a>
    <a href="#skills">技能</a>
    <a href="#contact">联系我</a>
  </nav>

  <main>
    <section id="about" data-page="home">
      <h2>关于我</h2>
      <p>一名刚入坑前端的学员，目标是三个月内上手 <strong>Vue</strong>，做出自己的第一个项目。</p>
      <details>
        <summary>我的学习路线</summary>
        <p>HTML → CSS → JavaScript → Vue，每天 2 小时，周日复盘。</p>
      </details>
    </section>

    <section id="skills">
      <h2>技能</h2>
      <span class="skill">HTML</span>
      <span class="skill">CSS</span>
      <span class="skill">学习中：JS</span>
    </section>

    <section id="contact">
      <h2>联系我</h2>
      <form method="get">
        <input type="text" name="name" placeholder="你的称呼" required />
        <input type="email" name="email" placeholder="你的邮箱" required />
        <textarea name="msg" rows="3" placeholder="想对我说的话"></textarea>
        <button type="submit">发送</button>
      </form>
    </section>
  </main>

  <footer>
    <address>邮箱：xiaotian@example.com</address>
    <p>© 2024 小天 · 用 HTML 手写</p>
  </footer>
</div>
```

::: info 对照检查清单
这个页面覆盖了教程全部核心知识点：文档结构（第 2 章）、标题与文本标签（第 3 章）、列表（第 4 章，技能标签）、锚点导航（第 5 章）、表单校验（第 7~8 章）、语义化布局（第 9 章）、data-* 与 details（本章）。把代码存为 HTML 打开，F12 逐项对照。
:::

## 10.6 浏览器兼容说明

本教程使用的全部特性（语义标签、表单校验、details/dialog/data-*）在**现代主流浏览器**（Chrome/Edge/Firefox/Safari 近两年版本）中均已稳定支持。个别企业项目仍需兼容旧浏览器时，参考 [caniuse.com](https://caniuse.com/) 查询特性的支持情况再决定取舍。

## HTML 教程结语

你已经能独立写出结构规范、语义清晰的网页骨架——接下来进入 [CSS 教程](/tutorials/css/)，为骨架穿上外衣。

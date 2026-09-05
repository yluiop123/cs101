---
title: 初识 CSS
---

# 第 1 章 · 初识 CSS

**本章目标：**

- 理解 CSS 在网页中的职责
- 掌握三种引入方式及选用原则
- 会读会写基本样式规则，并用 DevTools 调试

## 1.1 CSS 是什么

CSS（Cascading Style Sheets，层叠样式表）负责网页的外观：颜色、字体、间距、布局、动画。

HTML 回答"页面上有什么"，CSS 回答"它长什么样"：

```html
<!-- HTML：这里有一个标题 -->
<h1>Hello</h1>
```

```css
/* CSS：标题应该是蓝色的、36px 大 */
h1 {
  color: #2563eb;
  font-size: 36px;
}
```

## 1.2 基本语法：规则由选择器与声明块组成

```css
选择器 {
  属性: 值;
  属性: 值;
}
```

- **选择器（selector）**：选中谁（本例的 `h1`）
- **声明块**：花括号内的若干条声明
- **声明（declaration）**：`属性: 值;`，分号结尾
- 注释用 `/* ... */`（**没有** `//` 单行注释）

```css
/* 多条声明写多行，每行一条，团队约定 */
p {
  color: #334155;      /* 文字颜色 */
  line-height: 1.7;    /* 行高 */
}
```

## 1.3 三种引入方式

### 方式一：行内样式（inline style）

写在标签的 `style` 属性里：

```html
<p style="color: red; font-size: 14px;">红色小字</p>
```

### 方式二：内部样式表

写在 `<style>` 标签里（通常放 head 中）：

```html
<head>
  <style>
    p { color: red; }
  </style>
</head>
```

### 方式三：外部样式表（推荐）

独立 `.css` 文件，用 `<link>` 引入：

```html
<head>
  <link rel="stylesheet" href="./style.css" />
</head>
```

```css
/* style.css */
p { color: red; }
```

| 方式 | 优点 | 缺点 | 适用 |
| --- | --- | --- | --- |
| 行内 | 优先级最高、即写即用 | 无法复用、难维护 | 一次性微调、JS 动态设置 |
| 内部 | 单文件即用 | 不能跨页面复用 | 单页 demo、邮件模板 |
| **外部** | 复用、缓存、结构与样式分离 | 需要额外请求 | **一切正式项目** |

::: tip 结构与样式分离
外部样式表是"内容（HTML）与表现（CSS）分离"原则的落地——换肤只换 CSS 文件，HTML 一行不动。
:::

## 1.4 用 DevTools 调试样式

CSS 学习与工作中最常用的工具：

1. 页面元素上**右键 → 检查**（或 F12 → Elements）
2. 右侧 **Styles（样式）面板**：
   - 显示该元素命中的所有规则，按来源排列
   - 被划掉的属性 = 被**优先级更高**的规则覆盖（层叠的直观体现）
   - 可以**直接改值实时生效**（如把 `color` 改成别的颜色），刷新后还原
3. **Computed（计算后）面板**：查看某个属性最终生效的值

::: tip 学习方法
看到喜欢的页面效果，检查 → 找到对应规则 → 看懂 → 抄一遍。三个循环之后，你就有"样式直觉"了。
:::

## 1.5 初探"层叠"

CSS 的 C 就是 Cascading——多条规则同时命中一个元素时，按规则决胜：

```html
<p class="intro" style="color: blue">我是谁的颜色？</p>
```

```css
p { color: red; }         /* 命中，但 */
p.intro { color: green; } /* 类选择器优先级更高，胜出 */
/* 行内样式 blue 优先级最高，最终是蓝色 */
```

优先级的完整规则在下一章展开，这里先建立印象：**样式冲突不是随机的，是有精确规则的**。

## 1.6 综合示例

```html
<style>
  /* 内部样式表演示 */
  h2 { color: #2563eb; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 6px; }
  .tip { color: #b45309; background: #fef3c7; padding: 10px 14px; border-radius: 8px; }
</style>

<h2>CSS 接管了外观</h2>
<p>标题变蓝、加了下划线，提示框有了背景色——全部由几行 CSS 实现。</p>
<p class="tip" style="border: 1px dashed #f59e0b">这一行还叠加了行内样式（虚线边框），它优先级最高。</p>
```

## 本章小结

- CSS = 选择器 + 声明块，注释只有 `/* */` 一种
- 三种引入方式：行内（应急）、内部（demo）、外部（正式项目首选）
- DevTools Styles/Computed 面板是调试与学习的第一工具
- 层叠让样式冲突有章可循，优先级规则下一章详解

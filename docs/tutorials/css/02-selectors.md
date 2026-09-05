---
title: 选择器与优先级
---

# 第 2 章 · 选择器与优先级

**本章目标：**

- 熟练使用六大基础选择器与组合选择器
- 掌握常用伪类与伪元素
- 能精确计算优先级，解决"样式为什么不生效"

## 2.1 基础选择器

```css
/* 元素选择器：所有 p */
p { color: #334155; }

/* 类选择器：所有 class 含 tip 的元素（最常用） */
.tip { background: #fef3c7; }

/* ID 选择器：id 为 header 的唯一元素 */
#header { padding: 12px; }

/* 通配选择器：所有元素（慎用） */
* { box-sizing: border-box; }

/* 属性选择器 */
input[type='text'] { border: 1px solid #cbd5e1; }

/* 群组选择器：逗号并列 */
h1, h2, h3 { font-weight: 700; }
```

::: tip 类选择器是主力
日常 80% 的样式挂在 class 上——语义由 HTML 结构承担，class 只负责"这一组元素长一样"。
:::

## 2.2 组合选择器

```css
/* 后代选择器：空格——nav 里所有 a（任意深度） */
nav a { color: #2563eb; }

/* 子代选择器：> —— 只选直接子级 */
nav > a { text-decoration: none; }

/* 相邻兄弟：+ —— 紧跟在 h2 后面的第一个 p */
h2 + p { margin-top: 4px; }

/* 通用兄弟：~ —— h2 后面所有的同级 p */
h2 ~ p { color: #64748b; }
```

## 2.3 伪类：元素"状态"的选择

伪类（pseudo-class）用单个冒号，按**状态或位置**匹配：

```css
/* 交互状态 */
a:hover { color: #1d4ed8; }      /* 悬停 */
input:focus { border-color: #2563eb; } /* 聚焦 */

/* 结构位置 */
li:first-child { font-weight: 700; }  /* 第一个 */
li:last-child { border-bottom: 0; }   /* 最后一个 */
li:nth-child(2n) { background: #f1f5f9; } /* 偶数行（斑马纹） */

/* 表单状态 */
input:disabled { opacity: 0.5; }
input:checked { accent-color: #2563eb; }
```

::: info nth-child 常用写法
`odd` 奇数 / `even` 偶数 / `3` 第三个 / `2n+1` 奇数通式 / `-n+3` 前三个。斑马纹表格就是 `nth-child(even)` 的经典应用。
:::

## 2.4 伪元素：创建"虚拟元素"

伪元素（pseudo-element）用双冒号，能**创建出 HTML 里不存在的元素**：

```css
/* 在元素内容前/后插入内容 */
.price::before { content: '￥'; color: #b91c1c; }
.new::after { content: 'NEW'; font-size: 12px; color: #fff; background: #16a34a; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }

/* 首字下沉 */
.intro::first-letter { font-size: 2em; float: left; }

/* 选中占位符 */
input::placeholder { color: #94a3b8; }
```

::: warning 记忆口诀
**单冒号 = 状态**（`:hover`），**双冒号 = 新元素**（`::before`）。老代码里的单冒号伪元素（`:before`）仍兼容，但新代码统一写双冒号。
:::

## 2.5 优先级：谁说了算

当多条规则命中同一元素，浏览器按**优先级（specificity）**决胜。用"权重计分"理解：

```text
行内样式        1-0-0-0
ID 选择器       0-1-0-0
类/伪类/属性     0-0-1-0
元素/伪元素      0-0-0-1
```

比较规则：从左到右逐位比较，高位大者胜。

```css
p                    { color: gray;  }  /* 0-0-0-1 */
.text                { color: blue;  }  /* 0-0-1-0 胜过上一行 */
#main .text          { color: green; }  /* 0-1-1-0 胜过前两行 */
```

三个补充规则：

```css
/* 1. !important 直接封顶（急救用，平时禁用） */
.btn { color: red !important; }

/* 2. 同优先级看源码顺序：后者覆盖前者 */

/* 3. 继承的样式没有优先级：直接被任何选中器规则覆盖 */
```

::: danger !important 依赖症
一旦开始用 `!important` 解决冲突，很快整个项目都会变成 `!important` 大战。正确做法：**降低选择器优先级**去覆盖，而不是抬高。看到不得不 important 的场景，先反思选择器设计。
:::

## 2.6 继承

部分属性（文字类为主）会从父元素**自动传给子元素**：`color`、`font-*`、`line-height`、`text-align` 等；盒模型类（width/margin/border）不继承。

```css
body { font-family: system-ui; color: #1e293b; }
/* 全站文字自动继承这两个值，无需逐个设置 */
```

控制继承的三个关键字：`inherit`（强制继承）、`initial`（恢复默认）、`unset`（可继承则继承，否则默认）。

## 2.7 综合示例：交互式列表

```css
.demo-list { font-family: sans-serif; max-width: 300px; }
.demo-list li { padding: 8px 12px; border: 1px solid #e2e8f0; list-style: none; }
.demo-list li:first-child { border-radius: 8px 8px 0 0; background: #eff6ff; }
.demo-list li:last-child { border-radius: 0 0 8px 8px; }
.demo-list li:nth-child(2n) { background: #f8fafc; }
.demo-list li:hover { background: #dbeafe; cursor: pointer; }
.demo-list .hot::after { content: 'HOT'; font-size: 11px; background: #ef4444; color: #fff; padding: 1px 6px; border-radius: 4px; margin-left: 8px; vertical-align: 2px; }
```

```html
<ul class="demo-list">
  <li class="hot">第 1 项（首项 + HOT 徽标）</li>
  <li>第 2 项（偶数行浅色）</li>
  <li>第 3 项</li>
  <li>第 4 项（末项圆角）</li>
</ul>
```

把 CSS 与 HTML 放进同一文件用 Live Server 打开：悬停任意列表项看 `:hover` 效果。这个例子同时用到类选择器、结构伪类（first/last/nth-child）与伪元素（`::after` 徽标）。

## 本章小结

- class 是主力选择器，组合选择器控制命中范围
- 伪类选状态（:hover/:focus/:nth-child），伪元素造内容（::before/::after）
- 优先级：行内 > ID > 类 > 元素，同权重比源码顺序
- `!important` 是急救药不是日常药；能用优先级解决的冲突别加 important

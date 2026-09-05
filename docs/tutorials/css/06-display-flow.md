---
title: 显示模式与文档流
---

# 第 6 章 · 显示模式与文档流

**本章目标：**

- 理解块级/行内/行内块三种显示模式
- 掌握 display 属性的转换能力
- 建立"文档流"的排版心智模型

## 6.1 三种显示模式

每个元素天生有一种显示模式（display mode），决定它的排布行为：

| 模式 | 典型元素 | 行为特征 |
| --- | --- | --- |
| **块级（block）** | div / p / h1~h6 / ul / li | 独占一行；可设宽高；默认宽度撑满父容器 |
| **行内（inline）** | span / a / strong / em | 不换行排一行；**宽高无效**；边距仅水平方向有效 |
| **行内块（inline-block）** | img / input / button | 像行内一样并排；**又能设置宽高** |

```html
<style>
  .modes .row { background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px; margin: 8px 0; }
  .modes .blk { display: block; background: #dbeafe; padding: 8px; margin: 4px 0; }
  .modes .inl { display: inline; background: #dcfce7; padding: 2px 6px; }
  .modes .inb { display: inline-block; background: #fef9c3; padding: 8px 14px; width: 140px; }
</style>

<div class="modes">
  <div class="row">
    <span class="blk">block 独占一行 A</span>
    <span class="blk">block 独占一行 B</span>
  </div>
  <div class="row">
    <span class="inl">inline A</span>
    <span class="inl">inline B</span>
  </div>
  <div class="row">
    <span class="inb">inline-block A</span>
    <span class="inb">inline-block B</span>
  </div>
</div>
```

## 6.2 display：转换显示模式

`display` 属性可以改变元素的显示模式——这是布局的"开关"：

```css
span { display: block; }        /* 行内转块级：现在能设宽高、独占一行 */
div  { display: inline-block; } /* 块级转行内块：并排 + 可设尺寸 */
div  { display: none; }         /* 彻底隐藏（不占空间，见下方对比） */
```

::: tip 最重要的两个值先记牢
`none`（隐藏）与 `inline-block`（并排可设宽高）。`flex` 与 `grid` 是布局容器模式，第 9~11 章的主角。
:::

### display: none vs visibility: hidden

| | `display: none` | `visibility: hidden` |
| --- | --- | --- |
| 占位 | **不占**空间 | 占着空间 |
| 过渡动画 | 无法过渡（直接消失） | 可过渡（淡出淡入） |
| 使用频率 | 高 | 较低 |

## 6.3 文档流：默认排版规则

**文档流（normal flow）**是浏览器不施加任何布局干预时的默认排版：

```text
规则 1：块级元素自上而下逐个堆叠（像搭积木竖着码）
规则 2：行内元素从左到右排列，放不下自动折行（像写字换行）
规则 3：文字围绕行内元素，基线对齐（会出现著名的"图片底部缝隙"问题）
```

## 6.4 行内元素的"特性细节"

行内元素有几个新手必踩的坑：

1. **宽高无效**：`span { width: 100px }` 不会生效（转 inline-block 才行）
2. **垂直 padding/margin 不撑开布局**：视觉上溢出但不推动周围内容
3. **代码换行产生空格**：两个行内元素标签之间若在源码里换了行，渲染会有约 4px 空隙

```html
<!-- 源码换行 -->
<span>A</span>
<span>B</span>
<!-- A 与 B 之间会出现空隙！ -->

<!-- 防空隙写法：写在同一行或用注释连接 -->
<span>A</span><!--
--><span>B</span>
```

::: info 更优雅的解法
空格问题在 Flex 容器里自动消失（flex 布局不渲染空白文本），这也是现代布局优先用 Flex 的原因之一。
:::

## 6.5 元素分类速查

| 你要的效果 | 用什么 |
| --- | --- |
| 内容一行一个、可设宽高 | block（默认） |
| 多个元素并排、还要设宽高 | inline-block（或 Flex，第 9 章） |
| 文字流里的强调片段 | inline（span/em/a 天生如此） |
| 隐藏元素 | display: none |
| 整页布局 | Flex / Grid（不要再用 display 手搓） |

## 本章小结

- 三种显示模式：block 独行可设尺寸、inline 同行尺寸无效、inline-block 两者兼得
- display 可互相转换，none 隐藏不占位（对比 visibility: hidden）
- 文档流两大规则：块级竖排、行内横排自动折行
- 行内元素注意：宽高无效、垂直边距不推布局、源码换行产生空隙

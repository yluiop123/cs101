---
title: Grid 布局
---

# 第 11 章 · Grid 布局

**本章目标：**

- 掌握 Grid 的行与列定义、fr 单位
- 学会 gap、跨行跨列与 repeat/minmax
- 建立 Flex 与 Grid 的选型判断

## 11.1 何时用 Grid

一句话选型：

```text
Flex = 一维布局（一行或一列里的排布）
Grid = 二维布局（行和列同时规划）
```

典型 Grid 场景：卡片网格（要求每行严格等宽）、仪表盘、页面整体框架。

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;  /* 三列：固定 200px + 1 份 + 2 份 */
  grid-template-rows: auto 1fr auto;     /* 三行 */
}
```

::: tip fr 单位
`fr`（fraction，份数）表示**可用空间的等份**。`1fr 2fr` = 按 1:2 分剩余空间——比百分比灵活（自动扣除 gap 与固定列）。
:::

## 11.2 间距与自动排列

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 个等宽列 */
  gap: 16px;              /* 行列间距（也可 row-gap / column-gap 分开） */
}
```

`repeat(3, 1fr)` 是"3 份 1fr"的简写；`repeat(auto-fill, minmax(260px, 1fr))` 是**自适应卡片网格**的黄金公式——容器变宽自动加列，变窄自动减列：

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
```

```html
<style>
  .auto-cards { font-family: sans-serif; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
  .auto-cards div { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 10px; font-size: 13px; color: #1d4ed8; text-align: center; }
</style>

<div class="auto-cards">
  <div>卡片 1</div><div>卡片 2</div><div>卡片 3</div><div>卡片 4</div><div>卡片 5</div>
</div>
```

把代码放进本地页面运行，拖动浏览器窗口宽度，观察列数自动增减——每列始终不小于 140px，最后一行也严格对齐网格（这是 Flex 换行做不到的）。

## 11.3 跨行跨列

```css
.span-2col { grid-column: span 2; }   /* 横跨 2 列 */
.span-2row { grid-row: span 2; }      /* 纵跨 2 行 */
/* 或用起止线：从第 1 条线到第 3 条线 */
.wide { grid-column: 1 / 3; }
```

```html
<style>
  .span-demo { font-family: sans-serif; display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 52px; gap: 8px; font-size: 13px; }
  .span-demo div { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1d4ed8; }
  .span-demo .wide { grid-column: span 2; background: #dbeafe; }
  .span-demo .tall { grid-row: span 2; background: #dcfce7; border-color: #86efac; color: #166534; }
</style>

<div class="span-demo">
  <div class="wide">横跨 2 列</div>
  <div class="tall">纵跨<br />2 行</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
</div>
```

## 11.4 网格区域：命名布局

给区域命名，模板字符串直观"画出"布局：

```css
.page {
  display: grid;
  min-height: 100vh;
  grid-template-areas:
    'header header header'
    'side   main   main'
    'footer footer footer';
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}
.page .header { grid-area: header; }
.page .side   { grid-area: side; }
.page .main   { grid-area: main; }
.page .footer { grid-area: footer; }
```

调整布局 = 改模板字符串（比如把 side 挪到右边、header 占两行），HTML 一个字不用动——这是 Grid 相比 Flex 的"图纸感"优势。

## 11.5 页面骨架实战

```html
<style>
  .page-demo { font-family: sans-serif; display: grid; grid-template-areas: 'header header' 'side main' 'footer footer'; grid-template-columns: 120px 1fr; grid-template-rows: 44px 150px 40px; gap: 8px; font-size: 13px; }
  .page-demo div { border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; }
  .page-demo .h { grid-area: header; background: #1e293b; }
  .page-demo .s { grid-area: side; background: #64748b; }
  .page-demo .m { grid-area: main; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .page-demo .f { grid-area: footer; background: #334155; }
</style>

<div class="page-demo">
  <div class="h">header（占 2 列）</div>
  <div class="s">side</div>
  <div class="m">main（吃掉剩余）</div>
  <div class="f">footer（占 2 列）</div>
</div>
```

## 11.6 Flex 与 Grid 选型表

| 需求 | 选择 |
| --- | --- |
| 导航栏、按钮组、单行/单列排列 | Flex |
| 空间分配（侧栏+主内容） | Flex（简单）或 Grid（整体框架） |
| 卡片网格，要求对齐与响应式列数 | **Grid**（auto-fill + minmax） |
| 表单多行多列、仪表盘 | Grid |
| 文字环绕 | float（本职） |

::: tip 两者可以混用
页面骨架用 Grid、局部（导航、按钮组）用 Flex——这是最常见的组合，不必二选一。
:::

## 本章小结

- Grid 管**二维**：`grid-template-columns/rows` 定义轨道，`fr` 分份
- `repeat(auto-fill, minmax(260px, 1fr))` = 自适应卡片网格黄金公式
- `grid-column/row: span n` 跨行列；`grid-template-areas` 用图纸方式命名布局
- 一维用 Flex、二维用 Grid，混用是常态

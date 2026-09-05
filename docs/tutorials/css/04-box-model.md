---
title: 盒子模型
---

# 第 4 章 · 盒子模型

**本章目标：**

- 吃透盒子模型四层结构与尺寸计算
- 学会用 box-sizing 杜绝"越改越宽"
- 理解外边距合并与常见间距方案

## 4.1 每个元素都是盒子

CSS 中所有元素都是**矩形盒子（box）**，由内到外四层：

```text
┌─────────────── margin（外边距：与别人的距离）───────┐
│  ┌──────────── border（边框）──────────────────┐  │
│  │  ┌───────── padding（内边距：内容与边框）───┐ │  │
│  │  │            content（内容）              │ │  │
│  │  │         width × height 管这里           │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

```css
.card {
  width: 200px;
  height: 100px;       /* 内容区尺寸 */
  padding: 16px;       /* 内边距 */
  border: 2px solid #2563eb;
  margin: 12px;        /* 外边距 */
}
```

## 4.2 关键问题：width 到底算多大

默认规则（`content-box`）下：**width 只管内容区**，实际占位 = 内容 + 内边距 + 边框：

```css
.card {
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
}
/* 实际宽度 = 200 + 20*2 + 2*2 = 244px —— 比你写的 200 宽了 44px！ */
```

::: danger 越改越宽之谜
给定宽的容器加 padding/border，它就变宽、布局就崩——这是所有 CSS 新手的第一次"灵异事件"。根源就是默认的 `content-box`。
:::

## 4.3 解药：box-sizing: border-box

```css
.card {
  box-sizing: border-box;  /* width 含 padding + border */
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
}
/* 实际宽度 = 200px，说话算数 */
```

**border-box 模式下 width = 内容 + 内边距 + 边框的总宽**，加减内边距不再影响整体尺寸。

全站开启的最佳实践（每个项目的标配）：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4.4 padding 与 margin 的写法

四个方向可分别控制，简写按"**上右下左**"顺时针：

```css
.box {
  /* 完整写法 */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;

  /* 简写 1：一个值 → 四边相同 */
  padding: 12px;
  /* 简写 2：两个值 → 上下 | 左右 */
  padding: 12px 24px;
  /* 简写 3：三个值 → 上 | 左右 | 下 */
  padding: 12px 24px 8px;
  /* 简写 4：四个值 → 上 右 下 左（顺时针） */
  padding: 12px 24px 8px 16px;

  margin: 0 auto;   /* 经典：水平居中块级元素 */
}
```

::: tip padding 能"撑大"背景，margin 不能
背景色延伸到 padding 区域（所以按钮文字与边缘的距离用 padding），margin 是纯透明间隙。想让点击区域变大 → padding；想让元素与别人拉开 → margin。
:::

## 4.5 外边距合并（margin collapse）

**垂直方向相邻**的两个块级元素，上下 margin 会"合并"取较大者，而不是相加：

```html
<p style="margin-bottom: 20px">上段</p>
<p style="margin-top: 30px">下段</p>
<!-- 两段之间是 30px，不是 50px -->
```

```html
<div class="collapse-demo">
  <div class="a">蓝色块：margin-bottom: 20px</div>
  <div class="b">红色块：margin-top: 30px</div>
  <p class="note">两块之间的实际间距是 30px（取较大者合并），不是 50px。</p>
</div>

<style>
  .collapse-demo .a { margin-bottom: 20px; background: #dbeafe; padding: 10px; border-radius: 6px; }
  .collapse-demo .b { margin-top: 30px; background: #fee2e2; padding: 10px; border-radius: 6px; }
</style>
```

需要"不合并"的常见手段：中间加边框/内边距、父元素加 `overflow: hidden`、改用 Flex/Grid 布局（布局容器内的子项不会合并 margin）。

::: info 现代实践的思路
与其纠结合并规则，不如**只用一个方向的 margin**（团队规范如"margin 只用 bottom"），从源头减少相遇。
:::

## 4.6 块级元素的水平居中

```css
.container {
  width: 600px;
  margin: 0 auto;   /* 上下 0，左右 auto 自动平分 → 水平居中 */
}
```

前提是**有确定宽度**的块级元素。居中方案全家桶（Flex/Grid/text-align 等）在第 9~11 章展开。

## 本章小结

- 盒子四层：content → padding → border → margin
- 默认 width 只算内容区，**全站标配 `* { box-sizing: border-box }`**
- 简写顺序：1 值四边、2 值上下/左右、3 值上/左右/下、4 值顺时针
- 垂直相邻 margin 合并取大者；规范"只用一个方向 margin"可绕开
- `margin: 0 auto` 水平居中定宽块级元素

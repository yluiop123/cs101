---
title: 浮动与清除
---

# 第 7 章 · 浮动与清除

**本章目标：**

- 理解 float 的原始设计意图与历史布局角色
- 掌握浮动元素的行为规则与清除方案
- 明确现代开发中 float 的正确位置

::: info 先说结论
浮动是**历史布局方案**，现代项目用 Flex/Grid（第 9~11 章）。但浮动并没有消失——它还在"文字环绕图片"这个本职场景活跃，而且老项目维护绕不开它，所以值得花一章搞懂。
:::

## 7.1 float 的本职：文字环绕

float 的诞生目的只有一个——**让文字环绕图片**，像杂志排版一样：

```html
<img src="..." style="float: left; margin: 0 12px 8px 0" />
<p>这段文字会环绕在图片右侧……</p>
```

| 值 | 行为 |
| --- | --- |
| `float: left` | 元素浮到父容器左侧，后续内容环绕其右 |
| `float: right` | 浮到右侧，内容环绕其左 |
| `float: none` | 默认，不浮动 |

```html
<style>
  .float-demo .thumb { float: left; width: 96px; height: 96px; margin: 0 14px 8px 0; background: linear-gradient(135deg, #60a5fa, #a78bfa); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; text-align: center; }
  .float-demo p { font-size: 13px; line-height: 1.9; color: #334155; margin: 0; }
</style>

<div class="float-demo">
  <div class="thumb">浮动图</div>
  <p>float 的本职工作是文字环绕：这张"图"浮在左侧，段落文字自动环绕在它右侧流动，行到图片底部以下就恢复通栏。杂志式的图文混排，用浮动一行实现。</p>
</div>
```

## 7.2 浮动的行为规则

浮动元素脱离**常规流**，有三条核心规则：

1. 浮动元素**向左/右移动**，直到碰到父容器边缘或其他浮动元素
2. 常规流中的**块级盒子无视**浮动元素（文字却会环绕）——于是产生"父元素高度塌陷"
3. 浮动元素之间会依次"靠拢排队"

## 7.3 塌陷：浮动最大的坑

子元素全浮动后，父元素高度变为 0（因为它"看不见"浮动的子元素）：

```html
<div class="parent" style="border: 2px solid red">
  <div style="float: left; width: 100px; height: 100px; background: #dbeafe">浮动子块</div>
  <div style="float: left; width: 100px; height: 100px; background: #dcfce7">浮动子块</div>
</div>
<!-- 红框塌成一条线：父元素认为自己是"空"的 -->
```

## 7.4 清除浮动：现代标准方案

```css
/* clearfix：父元素加这个类，塌陷自愈 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

```html
<div class="parent clearfix">
  <div style="float: left">...</div>
  <div style="float: left">...</div>
</div>
```

原理：在父元素末尾生成一个"隐形块"，`clear: both` 让它**避开两侧浮动**，从而把父元素的高度撑起来。

其他方案对比：

| 方案 | 写法 | 评价 |
| --- | --- | --- |
| **clearfix 伪元素** | 如上 | ✅ 无侵入标签，业界标准 |
| 父元素 `overflow: hidden` | 一行 | ✅ 简单，但会裁切溢出内容 |
| 额外空 div + clear | `<div style="clear:both"></div>` | ❌ 污染 HTML 结构 |
| 父元素定高 | `height: 200px` | ❌ 违背内容自适应 |

## 7.5 读懂"浮动布局"遗产

2015 年前的经典布局几乎全是浮动写的（当年没有 Flex/Grid）：

```css
/* 老项目里的典型写法——读懂即可，新项目别模仿 */
.sidebar { float: left; width: 200px; }
.content { float: left; width: 700px; }
.clear { clear: both; }
```

维护老项目时的要点：认出"一堆 float + clearfix"的组合，知道它是**在模拟今天的一行 Flex**。改造老页面时优先用 Flex 重写而不是继续加浮动。

## 本章小结

- float 本职 = 文字环绕；脱离常规流，块级盒子无视它、文字环绕它
- 副作用：父元素高度塌陷
- 标准解法：`.clearfix::after { content:''; display:block; clear:both }`
- 新项目用 Flex/Grid；浮动只在图文环绕场景保留

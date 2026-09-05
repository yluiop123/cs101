---
title: Flexbox 布局（上）
---

# 第 9 章 · Flexbox 布局（上）

**本章目标：**

- 理解弹性布局的心智模型：容器与项目、主轴与交叉轴
- 熟练使用主轴对齐 justify-content
- 熟练使用交叉轴对齐 align-items 与 align-content

## 9.1 一行代码开启 Flex 布局

```css
.container {
  display: flex;
}
```

加上这一行，容器的直接子元素（**flex item，弹性项目**）立刻变成"弹性"排布：

- 默认**沿水平方向**从左到右排列
- 不再受行内/块级、margin 合并、行内空格等问题困扰
- 子元素可以方便地伸缩、对齐、换行

::: tip 两个角色
`display: flex` 的元素是**弹性容器（flex container）**，它的直接子元素是**弹性项目（flex item）**。所有对齐属性都作用在容器上；伸缩属性作用在项目上（第 10 章）。
:::

## 9.2 主轴与交叉轴

理解 Flex 的钥匙是**两根轴**：

```text
flex-direction: row（默认）
┌──────────────────────────────┐
│ →→→ 主轴（水平）               │
│ ↑↑↑ 交叉轴（垂直）             │
└──────────────────────────────┘
```

`flex-direction` 决定主轴方向，交叉轴永远与主轴垂直：

```css
.container { flex-direction: row; }           /* 水平：左 → 右（默认） */
.container { flex-direction: row-reverse; }   /* 水平：右 → 左 */
.container { flex-direction: column; }        /* 垂直：上 → 下 */
.container { flex-direction: column-reverse; }/* 垂直：下 → 上 */
```

::: danger 换轴=换属性
主轴是水平时，`justify-content` 管水平对齐；一旦改成 `column`，主轴变垂直——**`justify-content` 就改为管垂直对齐**。新手"设了居中却不居中"多半是轴方向记混了。
:::

## 9.3 主轴对齐：justify-content

控制项目**沿主轴**如何分布：

```css
.container {
  justify-content: flex-start;  /* 起点对齐（默认） */
  justify-content: flex-end;    /* 终点对齐 */
  justify-content: center;      /* 居中 */
  justify-content: space-between;   /* 两端贴边，中间平分空隙 */
  justify-content: space-around;    /* 每项两侧空隙相等（中间是边缘的两倍） */
  justify-content: space-evenly;    /* 所有空隙（含边缘）完全相等 */
}
```

```html
<style>
  .jc .row { display: flex; gap: 6px; background: #f1f5f9; border-radius: 6px; padding: 8px; margin: 8px 0; }
  .jc .row span { background: #2563eb; color: #fff; font-size: 12px; padding: 6px 10px; border-radius: 4px; }
  .jc .between { justify-content: space-between; }
  .jc .around { justify-content: space-around; }
  .jc .center { justify-content: center; }
  .jc .end { justify-content: flex-end; }
</style>

<div class="jc">
  <div class="row between"><span>A</span><span>B</span><span>C</span></div>
  <div class="row around"><span>A</span><span>B</span><span>C</span></div>
  <div class="row center"><span>A</span><span>B</span><span>C</span></div>
  <div class="row end"><span>A</span><span>B</span><span>C</span></div>
</div>
```

把代码存为 HTML 打开，对照四种分布方式的差异。

## 9.4 交叉轴对齐：align-items

控制项目**沿交叉轴**的对齐（主轴水平时即垂直方向）：

```css
.container {
  align-items: stretch;    /* 拉伸填满（默认）——等高卡片的原因 */
  align-items: flex-start; /* 顶部对齐 */
  align-items: flex-end;   /* 底部对齐 */
  align-items: center;     /* 垂直居中 */
  align-items: baseline;   /* 文字基线对齐 */
}
```

::: tip stretch 是"等高"的来源
Flex 项目默认 `stretch`——同一行里最高的那个项目决定行高，其余项目被拉到一样高。这就是"Flex 卡片自动等高"的原理；不想等高就显式设 `align-items: flex-start`。
:::

## 9.5 水平垂直居中：一行搞定

传统"居中玄学"在 Flex 里就是两行：

```css
.parent {
  display: flex;
  justify-content: center;   /* 主轴居中 */
  align-items: center;       /* 交叉轴居中 */
}
```

## 9.6 换行：flex-wrap

默认项目挤在一行（被压缩）也不换行；允许换行用 `flex-wrap`：

```css
.container {
  flex-wrap: nowrap;   /* 默认：不换行 */
  flex-wrap: wrap;     /* 换行：放不下就折到下一行 */
}
```

换行后**多行之间**的交叉轴分布用 `align-content`（`flex-start` / `center` / `space-between` 等，与 justify-content 的取值一致），它只对**多行**生效。

::: warning align-content vs align-items
`align-items` 管一行内的对齐；`align-content` 管**行与行之间**的分布。单行时 `align-content` 无效果——这是另一个高频混淆点。
:::

## 9.7 项目上的两个小属性

```css
.item {
  align-self: flex-end;   /* 单个项目的交叉轴对齐（覆盖容器的 align-items） */
  order: -1;              /* 调整排列顺序，越小越靠前（默认 0） */
}
```

## 9.8 综合示例：导航栏

```html
<style>
  .navbar { display: flex; align-items: center; justify-content: space-between; background: #1e293b; padding: 10px 18px; border-radius: 10px; }
  .navbar .logo { color: #fff; font-weight: 700; font-size: 15px; }
  .navbar .links { display: flex; gap: 16px; }
  .navbar .links a { color: #cbd5e1; font-size: 13px; text-decoration: none; }
  .navbar .links a:first-child { color: #fff; font-weight: 600; }
</style>

<div class="navbar">
  <span class="logo">CS101</span>
  <div class="links">
    <a href="#">首页</a><a href="#">教程</a><a href="#">路线</a><a href="#">关于</a>
  </div>
</div>
```

::: info 拆解
外层容器 `justify-content: space-between` 把 logo 推到最左、链接组推到最右；内层链接组自身也是 flex 容器，用 `gap: 16px` 统一间距。
:::

## 本章小结

- `display: flex` 开启布局；容器管对齐，项目管伸缩
- 先定 `flex-direction`，再谈对齐——轴变了，属性含义跟着变
- `justify-content` 主轴分布，`align-items` 交叉轴对齐，多行分布用 `align-content`
- 两行实现水平垂直居中；`gap` 统一项目间距（无需 margin）

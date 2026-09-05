---
title: 背景边框与阴影
---

# 第 5 章 · 背景边框与阴影

**本章目标：**

- 熟练使用 background 系列属性
- 会写线性/径向渐变
- 掌握 border-radius 与 box-shadow 的完整用法

## 5.1 背景：background 系列

```css
.banner {
  background-color: #eff6ff;          /* 背景色 */
  background-image: url('./bg.png');  /* 背景图 */
  background-repeat: no-repeat;       /* repeat 默认平铺 / no-repeat / repeat-x / repeat-y */
  background-position: center;        /* 位置：center / top right / 20px 30px / 50% 0 */
  background-size: cover;             /* 缩放：cover 铺满裁切 / contain 完整显示 */
}
```

简写一行搞定（颜色、图、平铺、位置/尺寸）：

```css
.banner {
  background: #eff6ff url('./bg.png') no-repeat center / cover;
}
```

::: tip cover 与 contain
- `cover`：等比放大到**铺满**容器，多余部分裁掉（首屏大图标配）
- `contain`：等比缩放到**完整显示**，可能留白（logo 展示）
:::

## 5.2 渐变：gradient

渐变是 `background-image` 的一种，不是"图片"：

```css
/* 线性渐变：方向 + 色标 */
.a { background: linear-gradient(to right, #2563eb, #60a5fa); }
.b { background: linear-gradient(135deg, #1d4ed8, #7c3aed); }
.c { background: linear-gradient(to bottom, #eff6ff 0%, #dbeafe 60%, #bfdbfe 100%); }

/* 径向渐变：从中心向外 */
.d { background: radial-gradient(circle, #fde68a, #f59e0b); }
```

::: info 渐变的本质
浏览器实时计算生成的"图"，无网络请求、任意尺寸不失真——导航栏、按钮、卡片头部的标配背景。
:::

## 5.3 边框：border

```css
.box {
  border-width: 2px;
  border-style: solid;    /* solid 实线 / dashed 虚线 / dotted 点线 / none */
  border-color: #2563eb;
  /* 简写 */
  border: 2px solid #2563eb;

  /* 单边控制 */
  border-bottom: 1px dashed #cbd5e1;
  border-left: 4px solid #16a34a;   /* 卡片左侧色条的经典做法 */
}
```

## 5.4 圆角：border-radius

```css
.avatar { border-radius: 12px; }        /* 统一圆角 */
.pill   { border-radius: 999px; }       /* 胶囊按钮（超大值自动取半） */
.circle { border-radius: 50%; }          /* 正方形变圆 */
.card   { border-radius: 12px 12px 0 0; } /* 上圆下方：顺时针 上右下左 */
```

## 5.5 阴影：box-shadow

```css
/* 语法：x偏移 y偏移 模糊半径 扩散 颜色 */
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);       /* 常规卡片 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);       /* 细腻微阴影 */
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.25); /* 大而柔 + 带色 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);  /* inset 内阴影 */
}
```

::: tip 阴影设计心法
- x 取 0、y 取小正值：模拟"自然光照从上方来"
- 阴影颜色用**黑色低透明度**（rgba 0.06~0.15）而非纯黑，否则发脏
- 想要彩色氛围光：用品牌色低透明度做大模糊
- hover 抬升效果 = transform 上移 + 阴影加大（第 12 章配合 transition）
:::

## 5.6 轮廓：outline（附赠）

`outline` 画在盒子外圈、**不占空间**，键盘聚焦（Tab 键）时的默认高亮就是它：

```css
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;   /* 离边框留 2px 缝 */
}
```

::: warning 别裸删 outline
全局 `outline: none` 会让键盘用户"失焦失明"（不知道焦点在哪）。要么别删，要么用 `:focus-visible` 给一个更美的替代。
:::

## 5.7 综合示例：一张现代卡片

```html
<style>
  .modern-card { font-family: sans-serif; width: 300px; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.16); }
  .modern-card .head { height: 110px; background: linear-gradient(135deg, #1d4ed8, #7c3aed); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; }
  .modern-card .body { padding: 16px; background: #fff; }
  .modern-card h3 { margin: 0 0 6px; font-size: 16px; }
  .modern-card p { margin: 0 0 12px; font-size: 13px; color: #64748b; line-height: 1.6; }
  .modern-card button { border: 1px solid #2563eb; color: #2563eb; background: #fff; border-radius: 999px; padding: 6px 18px; cursor: pointer; }
</style>

<div class="modern-card">
  <div class="head">渐变封面区</div>
  <div class="body">
    <h3>现代卡片</h3>
    <p>圆角 + 渐变头图 + 柔和阴影 + 胶囊按钮，组合出一张"现代感"卡片。</p>
    <button>查看详情</button>
  </div>
</div>
```

把代码存为 HTML 用 Live Server 打开，对照每个属性在成品中的表现。

## 本章小结

- background 简写：颜色 图 平铺 位置/尺寸；cover 铺满、contain 完整
- 渐变属于 background-image，线性 `linear-gradient` + 径向 `radial-gradient`
- border-radius：50% 变圆、999px 出胶囊、四值顺时针
- box-shadow 用低透明度黑/品牌色，x=0 y=小正值的"自然光"最耐看
- outline 不占空间，键盘焦点的高亮，不要裸删

---
title: 布局与盒模型工具类
---

# 第 3 章 · 布局与盒模型工具类

**本章目标：**

- 掌握 display、宽度/高度、最大最小尺寸工具类
- 熟练使用 padding / margin / border / 圆角
- 会用任意值（arbitrary values）处理刻度外的需求

## 3.1 display 与定位

```html
<div class="block">块级</div>
<span class="inline-block w-20">行内块</span>
<div class="hidden">不渲染占位</div>
<div class="relative">
  <span class="absolute top-0 right-0">角标</span>
</div>
<div class="fixed bottom-4 right-4">悬浮按钮</div>
<div class="sticky top-0">吸顶栏</div>
```

对照记忆：

| 工具类 | CSS |
| --- | --- |
| `block` `inline` `inline-block` | display 同名值 |
| `hidden` | display: none |
| `relative` `absolute` `fixed` `sticky` | position 同名值 |
| `top-0` `right-4` `bottom-2` `left-1/2` | 偏移，刻度同间距 |

## 3.2 宽高与最大尺寸

```html
<!-- 固定尺寸：w-16 = 4rem = 64px -->
<div class="w-16 h-16 bg-blue-500"></div>

<!-- 全宽 / 自适应 -->
<div class="w-full">撑满父容器</div>
<div class="w-fit">收缩到内容宽</div>

<!-- 最大宽度：内容排版神器 -->
<article class="max-w-2xl mx-auto">
  限制阅读宽度并居中
</article>

<!-- 百分比 -->
<div class="w-1/2">50%</div>
```

常用宽度刻度：`w-1`（4px）到 `w-96`（384px）；`max-w-xs/sm/md/lg/xl/2xl…` 是一组精心设计的阅读宽度。

## 3.3 padding：p / px / py / pt…

```html
<div class="p-4">四边 16px</div>
<div class="px-4 py-2">左右 16px、上下 8px</div>
<div class="pt-2 pr-4 pb-8 pl-1">逐边控制</div>
```

命名规则拆解：**轴 + 方向 + 刻度**。

```text
p  全部   px  水平（左右）   py  垂直（上下）
pt pr pb pl  上右下左单边
刻度：1=4px  2=8px  3=12px  4=16px  6=24px  8=32px
```

::: tip 一个心算口诀
刻度 n 对应 `n × 4px`（1rem = 16px 基准，0.25rem 步进）。看到 `p-6` 就知道是 24px。
:::

## 3.4 margin：m 系列同构

与 padding 完全同构（m/mx/my/mt/mr/mb/ml），另有负值与 auto：

```html
<div class="mx-auto w-72">水平居中（margin 左右 auto）</div>
<div class="mt-2">上方 8px</div>
<div class="-mt-2">上移 8px（负值加 - 前缀）</div>
```

## 3.5 边框与圆角

```html
<div class="border">1px 边框（v4 默认颜色 currentColor）</div>
<div class="border border-gray-300">灰色 1px 边框</div>
<div class="border-b">只有下边框</div>
<div class="border-2 border-red-500">2px 红色</div>

<div class="rounded">小圆角 4px</div>
<div class="rounded-md">中圆角</div>
<div class="rounded-lg">大圆角</div>
<div class="rounded-full">全圆（胶囊/圆形头像）</div>
```

常用组合——头像与卡片：

```html
<img class="w-10 h-10 rounded-full" src="avatar.png" alt="头像" />
<div class="rounded-xl border border-gray-200 p-4">卡片</div>
```

::: info v4 细节：border 默认颜色变了
v3 里 `border` 默认灰色，v4 改为继承文字色（currentColor）。所以**写 border 时习惯带上颜色**：`border border-gray-200`。
:::

## 3.6 阴影与溢出

```html
<div class="shadow-sm">轻阴影</div>
<div class="shadow-lg">抬升卡片</div>
<div class="shadow-xl">弹窗</div>

<div class="overflow-hidden rounded-lg">溢出裁切（配图片圆角）</div>
<div class="overflow-y-auto h-40">区域内滚动</div>
```

## 3.7 任意值：刻度不够时

内置刻度覆盖不到的精确值，用方括号直接写 CSS：

```html
<div class="w-[237px]">精确 237px</div>
<div class="p-[13px] text-[15px]">任意 padding 与字号</div>
<div class="top-[calc(100%-2rem)]">完整 CSS 表达式</div>
```

::: warning 任意值是逃生门，不是常态
能用刻度就用刻度（`w-60` 而非 `w-[240px]`）——任意值绕过了设计刻度，用多了一致性就没了。它为"接设计稿的精确还原"而生。
:::

## 3.8 综合练习：一个标准卡片

```html
<div class="mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
  <img class="h-40 w-full object-cover" src="cover.jpg" alt="封面" />
  <div class="p-4">
    <h3 class="text-lg font-bold text-gray-900">卡片标题</h3>
    <p class="mt-1 text-sm text-gray-600">描述文字，限制在卡片宽度内自动换行。</p>
    <button class="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">查看详情</button>
  </div>
</div>
```

逐类自检：居中限宽（mx-auto max-w-sm）→ 裁切圆角（overflow-hidden rounded-xl）→ 内边距（p-4）→ 间距节奏（mt-1 / mt-4）——盒子模型全用上了。

## 本章小结

- display/position 工具类与 CSS 值同名；hidden 隐藏、sticky 吸顶
- 宽高刻度 `n×4px`；max-w-* 限制阅读宽度；mx-auto 居中
- p/m 系列：轴（p/px/py）+ 方向 + 刻度；负值加 `-`
- border 记得配颜色（v4 默认 currentColor）；任意值 `[...]` 是逃生门

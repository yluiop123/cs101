---
title: Flex 与 Grid 工具类
---

# 第 5 章 · Flex 与 Grid 工具类

**本章目标：**

- 用 flex 系列工具类实现主轴/交叉轴控制
- 用 grid 搭建响应式多列布局
- 掌握 gap 间距与 flex-1 撑满的惯用法

## 5.1 Flex 起步：三行代码的居中

```html
<!-- 水平垂直居中：使用率最高的组合之一 -->
<div class="flex h-screen items-center justify-center">
  <p>完全居中</p>
</div>
```

```text
flex            → display: flex
items-center    → align-items: center（交叉轴居中）
justify-center  → justify-content: center（主轴居中）
```

## 5.2 主轴方向与间距

```html
<div class="flex flex-row">默认：横排</div>
<div class="flex flex-col">竖排（移动端布局常用）</div>
<div class="flex flex-row-reverse">反向</div>

<div class="flex gap-4">子元素之间统一 16px 间距</div>
<div class="flex gap-x-2 gap-y-4">横竖不同间距</div>
```

::: tip gap 取代 margin 技巧
传统布局用子元素的 margin-right 实现间距（还得处理最后一项的边界）；`gap` 天然"只在元素之间"。**flex/grid 布局里优先用 gap**。
:::

## 5.3 主轴对齐：justify-*

```html
<div class="flex justify-start">起头</div>
<div class="flex justify-center">居中</div>
<div class="flex justify-end">靠右（操作按钮栏常用）</div>
<div class="flex justify-between">两端对齐（导航栏灵魂）</div>
<div class="flex justify-evenly">均匀分布</div>
```

`justify-between` 的经典应用——导航栏：

```html
<header class="flex items-center justify-between px-4 py-3 border-b">
  <span class="font-bold">Logo</span>
  <nav class="flex gap-4"><a href="#">首页</a><a href="#">关于</a></nav>
</header>
```

## 5.4 交叉轴对齐：items-* 与内容高度

```html
<div class="flex items-start">顶部对齐</div>
<div class="flex items-center">垂直居中（列表行标准）</div>
<div class="flex items-end">底部对齐</div>
<div class="flex items-stretch">拉伸等高（默认值）</div>
```

## 5.5 子项伸缩：flex-1 与 flex-none

```html
<div class="flex gap-2">
  <div class="flex-none w-20">固定 80px（侧栏/图标）</div>
  <div class="flex-1">撑满剩余空间（主内容）</div>
</div>
```

```text
flex-1     → flex: 1 1 0%   均分/撑满剩余
flex-none  → flex: none     不伸缩，保持自身尺寸
flex-auto  → 按内容伸缩
```

`min-w-0` 配套知识：flex 子项内放长文本时加 `min-w-0`，否则 truncate 失效、内容会把容器撑爆：

```html
<div class="flex gap-3">
  <div class="flex-1 min-w-0">
    <p class="truncate">超长标题能正常截断</p>
  </div>
</div>
```

## 5.6 单个子项的例外：self-*

```html
<div class="flex items-start h-32 border">
  <div class="self-center">仅这一个元素垂直居中</div>
  <div class="self-end">仅这一个贴底</div>
</div>
```

## 5.7 Grid：列数与行数

```html
<!-- 三等分栅格 -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div><div>2</div><div>3</div>
</div>

<!-- 卡片墙：自动填充每列最小 240px -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
  <div>卡片</div><div>卡片</div><div>卡片</div>
</div>

<!-- 页面骨架：侧栏 + 内容 -->
<div class="grid grid-cols-[240px_1fr] gap-6">
  <aside>侧栏</aside>
  <main>内容</main>
</div>
```

```text
grid-cols-N     → N 等分列（fr 单位）
grid-rows-N     → N 等分行
col-span-2      → 跨 2 列
row-span-2      → 跨 2 行
```

## 5.8 不等分布局：12 列思维

```html
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-3">窄栏（3/12）</div>
  <div class="col-span-9">宽栏（9/12）</div>
</div>

<div class="grid grid-cols-12 gap-4">
  <div class="col-span-4">文章列表</div>
  <div class="col-span-4">文章列表</div>
  <div class="col-span-4">文章列表</div>
</div>
```

## 5.9 综合练习：响应式卡片网格

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-lg border p-4">
    <h3 class="font-semibold">卡片标题</h3>
    <p class="mt-1 text-sm text-gray-500">手机 1 列 / 平板 2 列 / 桌面 4 列</p>
  </div>
  <!-- 重复多个卡片 -->
</div>
```

`sm:grid-cols-2` 是响应式前缀（第 6 章主角）——grid + 前缀 = 一行实现自适应栅格。

## 本章小结

- 居中三件套 `flex items-center justify-center`；justify-between 做导航栏
- gap 替代 margin 技巧；flex-1/flex-none 组合"固定 + 自适应"
- 长文本的 flex 子项记得 min-w-0（否则 truncate 失效）
- grid-cols-N 等分、col-span 跨列、`[repeat(auto-fill,minmax(...))]` 卡片墙

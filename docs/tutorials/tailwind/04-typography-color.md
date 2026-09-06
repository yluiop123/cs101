---
title: 排版与颜色
---

# 第 4 章 · 排版与颜色

**本章目标：**

- 掌握字号/字重/行高的工具类体系
- 熟悉内置色板与颜色修饰（透明度）
- 会组织列表、链接与文字截断

## 4.1 字号与字重

```html
<p class="text-xs">极小 12px</p>
<p class="text-sm">小 14px</p>
<p class="text-base">正文 16px</p>
<p class="text-lg">大 18px</p>
<p class="text-xl">更大 20px</p>
<p class="text-2xl">标题 24px</p>
<p class="text-4xl">大标题 36px</p>

<p class="font-normal">400 常规</p>
<p class="font-medium">500 中等</p>
<p class="font-semibold">600 半粗</p>
<p class="font-bold">700 粗体</p>
```

字号的"阶梯"（xs→9xl）与字重的五档（normal→black）都来自内置刻度。常见的页面层级：

```html
<h1 class="text-3xl font-bold">页面主标题</h1>
<h2 class="text-xl font-semibold">小节标题</h2>
<p class="text-base">正文</p>
<p class="text-sm text-gray-500">辅助说明</p>
```

## 4.2 行高、字距与对齐

```html
<p class="leading-relaxed">宽松行高，适合长段落阅读</p>
<p class="leading-tight">紧凑行高，适合标题</p>

<h2 class="tracking-tight">标题收紧字距</h2>
<p class="tracking-wide">全大写标签放开字距</p>

<p class="text-left">左对齐</p>
<p class="text-center">居中</p>
<p class="text-right">右对齐</p>
```

::: tip 行高随字号走
v4 里 `text-lg` 等字号工具类会**自动带上匹配的行高**（字号越大行高越大）。单独用 `leading-*` 只在需要覆盖时出场。
:::

## 4.3 内置色板：10 档灰阶思维

每个色系由浅到深 100→900（另加 50 与 950）：

```html
<div class="bg-blue-50"></div>   最浅（背景底色）
<div class="bg-blue-100"></div>  浅（提示框背景）
<div class="bg-blue-400"></div>  中（次级按钮）
<div class="bg-blue-500"></div>  主色（主按钮）
<div class="bg-blue-600"></div>  深（悬停态）
<div class="bg-blue-900"></div>  很深（深色底）
```

中性灰（gray/slate/zinc）是使用频率最高的色系——文字、边框、分隔线全靠它：

```html
<div class="border-gray-200">边框</div>
<p class="text-gray-500">次要文字</p>
<p class="text-gray-900">正文</p>
<div class="bg-gray-50">浅灰区块背景</div>
```

语义化用法惯例：

| 用途 | 惯例 |
| --- | --- |
| 主按钮/主色 | 500 号（hover: 600） |
| 正文文字 | gray-900 / gray-800 |
| 次要文字 | gray-500 / gray-400 |
| 边框/分隔 | gray-200 / gray-100 |
| 区块底色 | gray-50 |

## 4.4 文字与背景色

```html
<p class="text-blue-600">蓝色文字（常用于链接）</p>
<p class="text-gray-500">灰色说明文字</p>

<div class="bg-green-100 text-green-800 p-3 rounded">成功提示</div>
<div class="bg-red-100 text-red-800 p-3 rounded">错误提示</div>
```

## 4.5 透明度修饰符

色值后加 `/透明度`，同刻度体系（0~100，步进 5）：

```html
<div class="bg-blue-500/10">10% 透明度的蓝色底</div>
<div class="bg-black/50">半透明遮罩</div>
<p class="text-gray-900/60">降不透明度的正文</p>
```

遮罩 + 绝对定位是"图片上叠文字"的标准姿势：

```html
<div class="relative">
  <img src="hero.jpg" alt="" class="w-full" />
  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
    <h1 class="text-white text-3xl font-bold">封面标题</h1>
  </div>
</div>
```

## 4.6 文字装饰与列表

```html
<a class="underline decoration-blue-400 decoration-2">自定义下划线</a>
<a class="underline-offset-4">下划线离字远一点</a>
<p class="line-through">划掉（原价）</p>
<h2 class="uppercase tracking-wide text-gray-400 text-sm">分组小标题</h2>

<ul class="list-disc pl-6">默认圆点列表（记得补 padding）</ul>
<ol class="list-decimal pl-6">有序列表</ol>
<ul class="list-none">去列表标记</ul>
```

::: warning 浏览器默认样式已被重置
Tailwind 的 preflight 重置了默认样式：标题不再自带加粗、ul 不带圆点、h1 字号与正文一样大。**所有视觉层级都靠你写类名**——这不是 bug，是"白纸"哲学。
:::

## 4.7 文字截断

单行截断三件套：

```html
<p class="truncate max-w-xs">
  很长的文字……超出宽度自动显示省略号（overflow + ellipsis + nowrap）
</p>
```

多行截断：

```html
<p class="line-clamp-2">最多两行，超出显示省略号</p>
<p class="line-clamp-3">最多三行</p>
```

## 4.8 综合练习：通知列表项

```html
<div class="flex items-start gap-3 p-4 border-b border-gray-100">
  <div class="h-10 w-10 rounded-full bg-blue-500/10 text-center leading-10 text-blue-600 font-bold">
    T
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-medium text-gray-900">
      Tom 评论了你的文章
    </p>
    <p class="mt-1 text-sm text-gray-500 line-clamp-2">
      这里是很长的评论内容摘要，超过两行自动省略……
    </p>
    <p class="mt-1 text-xs text-gray-400">10 分钟前</p>
  </div>
</div>
```

用到本章：色板（gray 蓝灰层级）、透明度（/10）、截断（line-clamp-2）、列表分隔（border-b）。

## 本章小结

- 字号阶梯 text-xs→9xl（自带行高）、字重五档、层级靠组合
- 色板 100→900 十档；主色 500 / hover 600；中性灰承担文字与边框
- `/透明度` 修饰符做遮罩与弱化；preflight 之后一切层级自己写
- truncate 单行、line-clamp-n 多行截断

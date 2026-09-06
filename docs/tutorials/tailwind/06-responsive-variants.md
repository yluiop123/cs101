---
title: 响应式与状态变体
---

# 第 6 章 · 响应式与状态变体

**本章目标：**

- 掌握断点前缀（sm:/md:/lg:）的移动优先逻辑
- 熟练使用 hover:/focus:/disabled: 等状态变体
- 理解变体的叠加与组合规则

## 6.1 断点：移动优先的阶梯

Tailwind 内置六个断点（viewport 宽度，单位 px）：

```text
sm: 640px 起        md: 768px 起
lg: 1024px 起       xl: 1280px 起
2xl: 1536px 起
```

**核心规则：不带前缀的类全局生效，带前缀的类只在达到断点后生效**——这是"移动优先"（mobile-first）：

```html
<!-- 手机 1 列 → 平板 2 列 → 桌面 3 列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 卡片们 -->
</div>
```

读法："默认 1 列；≥768px 时 2 列；≥1024px 时 3 列"。前缀覆盖的是**更小断点的设定**，且向下兼容（lg 生效时 md 的设定也在）。

::: warning 断点不是"手机/平板/桌面设备"
它们只是宽度阈值。同一个手机横过来可能命中 md——按**内容需要**选断点（这行文字什么时候该换布局），而不是按设备猜测。
:::

## 6.2 响应式实战三例

例一：隐藏与显示

```html
<!-- 移动端隐藏侧栏，桌面显示 -->
<aside class="hidden lg:block w-64">侧栏</aside>
<!-- 汉堡按钮只在移动端出现 -->
<button class="lg:hidden">☰</button>
```

例二：字号阶梯

```html
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">响应式标题</h1>
```

例三：布局换向

```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="md:w-64">窄栏（移动端在上，桌面在左）</div>
  <div class="flex-1">主内容</div>
</div>
```

## 6.3 状态变体：交互态一网打尽

伪类（pseudo-class）对应的状态前缀：

```html
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">
  主按钮（默认/悬停/按下）
</button>

<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md px-3 py-2 outline-none" />

<button class="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  禁用置灰
</button>

<input type="checkbox" class="checked:bg-blue-500" />
```

| 变体 | 触发时机 |
| --- | --- |
| `hover:` | 悬停 |
| `focus:` | 获得焦点 |
| `focus-within:` | 自身或子元素获得焦点 |
| `active:` | 按下瞬间 |
| `disabled:` | 禁用态 |
| `checked:` | 选中态 |
| `focus-visible:` | 键盘聚焦（无障碍友好） |

## 6.4 表单焦点态的标准模板

```html
<input
  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
         outline-none
         focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  placeholder="搜索…"
/>
```

```text
outline-none        → 去掉浏览器默认焦点框
focus:border-blue-500 → 聚焦时边框变蓝
focus:ring-2 focus:ring-blue-200 → 聚焦时出现浅蓝光环
```

## 6.5 变体可以叠加

响应式 × 状态可以组合，**响应式前缀放最前**：

```html
<!-- 桌面上悬停才加深的按钮；移动端悬停无意义，不写 -->
<button class="bg-blue-500 md:hover:bg-blue-600">按钮</button>

<!-- 大屏上聚焦光环更大 -->
<input class="focus:ring-2 lg:focus:ring-4" />
```

规则：变体顺序为 `断点:状态:工具类`，从左到右逐层包裹。

## 6.6 分组与后代：group / peer

**group**：父元素悬停/聚焦时影响子元素——卡片整体 hover，标题变色：

```html
<a href="#" class="group block rounded-lg border p-4 hover:border-blue-400">
  <h3 class="group-hover:text-blue-600 font-semibold">悬停卡片时我变蓝</h3>
  <p class="text-sm text-gray-500 group-hover:underline">我还出现下划线</p>
</a>
```

**peer**：兄弟元素的状态影响后面的元素——复选框点亮标签：

```html
<label class="flex items-center gap-2">
  <input type="checkbox" class="peer sr-only" />
  <span class="h-5 w-5 rounded border peer-checked:bg-blue-500 peer-checked:border-blue-500"></span>
  <span class="text-sm">我同意条款</span>
</label>
```

## 6.7 惯用法总结

```html
<!-- 标准卡片：hover 轻微上浮 + 阴影加深 + 过渡 -->
<div class="rounded-xl border bg-white p-5 shadow-sm
            transition hover:-translate-y-1 hover:shadow-md cursor-pointer">
  <h3 class="font-semibold">可点击卡片</h3>
</div>
```

三个高频组合记下来，写卡片不用再想：

```text
transition hover:-translate-y-1 hover:shadow-md   抬升卡
group + group-hover:text-…                        卡内联动
hidden md:block / md:hidden                       设备级显隐
```

## 本章小结

- 前缀断点移动优先：无前缀全局，sm:/md:/lg: 逐级覆盖
- hover:/focus:/disabled: 覆盖交互态；focus 态三件套（outline-none + border + ring）
- 叠加顺序 `断点:状态:类`；group/peer 实现父子、兄弟联动
- 断点按内容选，不按设备猜

---
title: 综合实战
---

# 第 8 章 · 综合实战

**本章目标：**

- 综合运用前七章搭建一个"课程列表页"
- 实战导航栏、卡片网格、响应式与暗色模式
- 沉淀一套可复用的 Tailwind 组件范式

## 8.1 页面目标与结构

还原一个课程平台首页：

```text
┌──────────────────────────────┐
│ 导航栏（sticky + 暗色适配）      │
├──────────────────────────────┤
│ Hero 区（标题 + 副标题 + 按钮）  │
├──────────────────────────────┤
│ 筛选标签栏（pill 按钮组）        │
├──────────────────────────────┤
│ 课程卡片网格（1/2/3/4 列响应式） │
└──────────────────────────────┘
```

前置：按第 2 章在 Vite 项目装好 Tailwind，style.css 里先写好主题（本章沿用第 7 章的 brand 色）。

## 8.2 导航栏

```html
<header class="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur
               dark:border-gray-700 dark:bg-gray-900/80">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
    <span class="text-lg font-bold text-brand">CS101</span>
    <nav class="hidden gap-6 text-sm text-gray-600 md:flex dark:text-gray-300">
      <a href="#" class="hover:text-brand">课程</a>
      <a href="#" class="hover:text-brand">关于</a>
    </nav>
    <div class="flex items-center gap-2">
      <button class="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100
                     dark:text-gray-300 dark:hover:bg-gray-800">登录</button>
      <button class="rounded-md bg-brand px-3 py-1.5 text-sm text-white
                     hover:bg-brand-dark">注册</button>
      <button class="lg:hidden text-xl">☰</button>
    </div>
  </div>
</header>
```

要点：`sticky top-0` 吸顶、`bg-white/80 backdrop-blur` 毛玻璃、导航链接 `hidden md:flex` 移动端收起。

## 8.3 Hero 区

```html
<section class="bg-brand-50 dark:bg-gray-800/50">
  <div class="mx-auto max-w-6xl px-4 py-16 text-center">
    <h1 class="text-3xl font-bold tracking-tight md:text-5xl dark:text-white">
      系统学前端，从这里开始
    </h1>
    <p class="mx-auto mt-4 max-w-2xl text-gray-600 md:text-lg dark:text-gray-300">
      HTML → CSS → JavaScript → 框架，一条完整路径。
    </p>
    <div class="mt-8 flex justify-center gap-3">
      <button class="rounded-lg bg-brand px-6 py-2.5 font-medium text-white
                     hover:bg-brand-dark">开始学习</button>
      <button class="rounded-lg border border-gray-300 px-6 py-2.5 font-medium
                     hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
        浏览课程
      </button>
    </div>
  </div>
</section>
```

要点：主副标题的字号阶梯（3xl→5xl）、max-w-2xl 限宽、双按钮的主次对比。

## 8.4 筛选标签栏（JS 联动）

```html
<div class="mx-auto max-w-6xl px-4 py-6">
  <div id="filters" class="flex flex-wrap gap-2">
    <button data-filter="all" class="rounded-full bg-gray-900 px-4 py-1.5 text-sm text-white dark:bg-white dark:text-gray-900">全部</button>
    <button data-filter="frontend" class="rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-900 dark:border-gray-600 dark:hover:border-gray-300">前端</button>
    <button data-filter="tools" class="rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-900 dark:border-gray-600 dark:hover:border-gray-300">工具链</button>
  </div>
</div>
```

选中态样式较长——抽成 JS 映射（第 7 章"条件选类"）：

```js
const activeCls = 'rounded-full bg-gray-900 px-4 py-1.5 text-sm text-white dark:bg-white dark:text-gray-900';
const idleCls = 'rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-900 dark:border-gray-600 dark:hover:border-gray-300';

document.querySelector('#filters').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach((b) => {
    b.className = b === btn ? activeCls : idleCls;
  });
});
```

## 8.5 课程卡片组件（本页核心）

```html
<article class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white
                transition hover:-translate-y-1 hover:shadow-md
                dark:border-gray-700 dark:bg-gray-800">
  <div class="h-36 bg-blue-500/10 flex items-center justify-center text-4xl">📚</div>
  <div class="flex flex-1 flex-col p-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900 dark:text-green-300">可学习</span>
      <span class="text-gray-400">10 章</span>
    </div>
    <h3 class="mt-2 font-semibold group-hover:text-brand dark:text-gray-100">HTML 教程</h3>
    <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">从标签语义到表单与多媒体。</p>
    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <span class="text-sm font-medium text-brand">开始学习 →</span>
    </div>
  </div>
</article>
```

要点清单：

```text
group + group-hover:text-brand   卡片整体悬停联动
hover:-translate-y-1 hover:shadow-md  抬升
line-clamp-2                     描述两行截断
flex flex-1 flex-col             内容区撑满、footer 贴底
```

## 8.6 响应式网格与数据渲染

```html
<main class="mx-auto max-w-6xl px-4 pb-16">
  <div id="grid" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
</main>
```

```js
const courses = [
  { icon: '📄', title: 'HTML 教程', desc: '从标签语义到表单与多媒体。', status: 'ready', chapters: 10, cat: 'frontend' },
  { icon: '🎨', title: 'CSS 教程', desc: '选择器、盒子模型、Flex 与 Grid。', status: 'ready', chapters: 12, cat: 'frontend' },
  { icon: '⚙️', title: 'Vite 教程', desc: '现代构建工具与开发服务器。', status: 'ready', chapters: 6, cat: 'tools' },
  { icon: '🟦', title: 'TypeScript 教程', desc: '静态类型系统与工程化。', status: 'ready', chapters: 10, cat: 'frontend' },
];

const cardTpl = (c) => `
  <article class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white
                  transition hover:-translate-y-1 hover:shadow-md
                  dark:border-gray-700 dark:bg-gray-800">
    <div class="h-36 bg-blue-500/10 flex items-center justify-center text-4xl">${c.icon}</div>
    <div class="flex flex-1 flex-col p-4">
      <div class="flex items-center gap-2 text-xs">
        <span class="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900 dark:text-green-300">可学习</span>
        <span class="text-gray-400">${c.chapters} 章</span>
      </div>
      <h3 class="mt-2 font-semibold group-hover:text-brand dark:text-gray-100">${c.title}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">${c.desc}</p>
    </div>
  </article>`;

function render(cat = 'all') {
  const list = cat === 'all' ? courses : courses.filter((c) => c.cat === cat);
  document.querySelector('#grid').innerHTML = list.map(cardTpl).join('');
}

document.querySelector('#filters').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach((b) => {
    b.className = b === btn ? activeCls : idleCls;
  });
  render(btn.dataset.filter);
});

render();
```

卡片模板由**数据驱动**——筛选切换只是重新渲染，样式类名零拼接。

## 8.7 暗色切换按钮

```html
<button id="theme-toggle" class="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">🌙</button>
```

```js
const btn = document.querySelector('#theme-toggle');
const apply = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  btn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};
apply(localStorage.getItem('theme') === 'dark');
btn.addEventListener('click', () =>
  apply(!document.documentElement.classList.contains('dark'))
);
```

## 8.8 自检清单

- [ ] 全部颜色走令牌（brand / gray 阶梯），无硬编码 hex
- [ ] 每个亮色类都有 dark: 对应类
- [ ] 响应式验证过 375px / 768px / 1280px 三档
- [ ] 无拼接类名；状态样式走映射表
- [ ] 间距只用刻度值，未出现任意值（逃生门留到还原设计稿时）

## 8.9 下一步

Tailwind 毕业后的自然路线：

- [Vue 3 教程](/tutorials/vue/)：组件化 + Tailwind 的完整体验
- [React 教程](/tutorials/react/)：同样的类名体系，另一套组件心智
- [Vite 教程](/tutorials/vite/)：把今天的构建环境吃透

## 本章小结

- 页面骨架：sticky 导航 / Hero / pill 筛选栏 / 响应式网格
- 卡片范式：group 联动 + 抬升 hover + line-clamp + flex 贴底
- 数据驱动渲染，状态类走映射表
- 暗色模式成对书写，theme 切换持久化到 localStorage

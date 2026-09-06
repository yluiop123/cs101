---
title: 初识 Tailwind CSS
---

# 第 1 章 · 初识 Tailwind CSS

**本章目标：**

- 理解"工具类优先"（utility-first）的写法与传统 CSS 的区别
- 看懂一条组合出来的 Tailwind 类名
- 明确它的适用场景与学习路线

## 1.1 同一个按钮，两种写法

传统 CSS：HTML 结构与样式分离，靠自定义 class 关联：

```html
<!-- 传统写法 -->
<button class="btn-primary">提交</button>
```

```css
/* styles.css */
.btn-primary {
  background-color: #3b82f6;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
}
.btn-primary:hover {
  background-color: #2563eb;
}
```

Tailwind：**不写样式表**，直接在 HTML 上组合工具类：

```html
<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">
  提交
</button>
```

类名拆开看，每个都是一条微型 CSS 规则：

```text
bg-blue-500    → background-color: #3b82f6
hover:bg-blue-600 → 悬停时 background-color: #2563eb
text-white     → color: #fff
px-4 / py-2    → padding-left/right 16px、padding-top/bottom 8px
rounded-md     → border-radius: 6px
font-semibold  → font-weight: 600
```

## 1.2 为什么不"违反关注点分离"

传统观念：样式与结构分离。Tailwind 的回答：**分离开的不是"文件"，而是"职责"**——把重复出现的按钮抽成组件（Vue/React），样式就跟着组件走，同样只写一次。

| 维度 | 传统 CSS | Tailwind |
| --- | --- | --- |
| 命名负担 | 持续想 class 名（btn-primary、list-item__title…） | 几乎为零 |
| 样式来源 | 分散在多个 css 文件 | 全部内联可见，即见即得 |
| 删除安全性 | 删 HTML 后 css 成"死代码" | 删 HTML 类名随之消失 |
| 设计一致性 | 依赖团队自觉 | 内置设计令牌（间距/色板/字号阶梯） |

::: tip 前提：组件化
Tailwind 的体验建立在**组件化框架**（Vue/React）之上——同样的类名组合抽成 `<Button>` 组件，"重复"问题就消失了。纯多页 HTML 站点用它收益有限。
:::

## 1.3 设计令牌：数字不是随便写的

Tailwind 内置一整套经过设计的"阶梯"（scale），所有工具类共享：

```text
间距：0.5 → 2px，1 → 4px，2 → 8px，4 → 16px，8 → 32px……
颜色：blue-100 到 blue-900，由浅到深 10 档
字号：text-xs / sm / base / lg / xl / 2xl ……
```

好处：界面上出现的每个间距、每个颜色都来自同一套刻度——**视觉一致性是刻度给的，不是自觉给的**。想"再大一点间距"，直接 `p-4` 改 `p-5`，不用纠结 15px 还是 17px。

## 1.4 典型场景

**适合：**

- Vue / React 组件库型应用（管理后台、SaaS 界面、营销页）
- 需要快速迭代、频繁调整细节的项目
- 小团队/独立开发——不用维护样式架构

**不适合：**

- 完全固定的静态页面（类名组合收益低）
- 需要深度复用视觉主题的 UI 库（可配合第 7 章主题定制）

## 1.5 与你已学知识的关系

Tailwind 不是新语言——工具类就是 CSS 属性的"起名封装"：

```text
p-4        就是 padding: 1rem（CSS 教程第 3 章盒子模型）
flex       就是 display: flex（CSS 教程第 5 章 Flex 布局）
grid       就是 display: grid
text-lg    就是 font-size: 1.125rem
hover:     对应 :hover 伪类
```

**学 Tailwind 的前提是懂 CSS**：知道想实现什么效果、该用哪个属性，工具类只是快捷键。

## 1.6 版本说明：v3 与 v4

本教程基于 **Tailwind CSS v4**（2025 年起的主流版本）：

```text
v3：tailwind.config.js 配置文件 + @tailwind 指令
v4：CSS-first——配置直接写在 CSS 里（@theme），默认接 Vite 插件
```

工具类名称两者几乎一致（学到的类名通用）；差异集中在安装与定制方式（第 2、7 章）。网上老教程遇到 config.js 写法时，可对照本文的 v4 等价做法。

## 本章小结

- 工具类优先：一条类名 = 一条微型 CSS，组合即样式
- 一致性来自内置刻度（间距/色板/字号），组件化消解重复
- 前提是懂 CSS——工具类只是属性名的快捷键
- 教程基于 v4（CSS-first），类名与 v3 基本通用

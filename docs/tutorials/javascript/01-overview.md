---
title: 初识 JavaScript
---

# 第 1 章 · 初识 JavaScript

**本章目标：**

- 理解 JavaScript 的定位与能力边界
- 学会三种引入方式与 console 调试
- 跑通第一行交互代码

## 1.1 JavaScript 是什么

JavaScript（简称 JS）是网页的**行为层**：HTML 提供结构、CSS 提供外观、JS 让页面"动起来"——响应点击、请求服务器、读写数据。

它有三个特殊身份：

1. **浏览器唯一原生语言**：所有浏览器都内置 JS 引擎
2. **全栈语言**：借助 Node.js 也能写服务器、命令行工具（见 [Node.js 教程](/tutorials/nodejs/)）
3. **动态弱类型**：变量不声明类型，灵活但易错（所以有 [TypeScript](/tutorials/typescript/)）

::: info 与 Java 的关系
没有任何关系。1995 年 Netscape 借 Java 的热度改名叫 JavaScript——纯营销行为，两者是完全不同的语言。
:::

## 1.2 它能做什么

```text
页面交互：按钮点击、表单校验、弹窗、轮播、拖拽
数据交互：fetch 请求接口、实时刷新（聊天/行情）
本地能力：localStorage 存数据、Geolocation 定位、通知
平台延伸：Node.js 服务端、小程序、桌面端（Electron）
```

## 1.3 三种引入方式

```html
<!-- 方式一：行内（不推荐，仅示意） -->
<button onclick="alert('点了')">点我</button>

<!-- 方式二：内部脚本 -->
<script>
  console.log('页面加载了');
</script>

<!-- 方式三：外部脚本（推荐） -->
<script src="./app.js"></script>
```

::: warning script 放哪里
传统上放 `</body>` 前——因为脚本执行时，**前面的 DOM 必须已经渲染**，放 head 会"取不到元素"。现代方案是给 script 加 `defer` 属性放 head：先下载、DOM 就绪后再执行。

```html
<head>
  <script src="./app.js" defer></script>
</head>
```
:::

## 1.4 console：你的第一调试工具

打开浏览器控制台（`F12` → Console），JS 的输出都显示在这里：

```js
console.log('普通输出');           // 最常用
console.warn('警告信息');          // 黄色
console.error('错误信息');         // 红色
console.table([{ name: 'Tom', age: 18 }, { name: 'Lucy', age: 20 }]); // 表格输出
```

::: tip 就地练习
本页的代码示例都可以直接贴进控制台运行——控制台就是 JS 的"草稿纸"，比新建文件快得多。
:::

## 1.5 第一个交互程序

```html
<button id="btn">点我</button>
<p id="out"></p>

<script>
  // 1. 找到元素
  const btn = document.getElementById('btn');
  const out = document.getElementById('out');

  // 2. 监听点击事件
  btn.addEventListener('click', () => {
    // 3. 修改页面内容
    out.textContent = '你点击了 ' + new Date().toLocaleTimeString();
  });
</script>
```

这段代码展示了 JS 三板斧：**找元素（DOM 查询）→ 听事件（监听）→ 改页面（DOM 操作）**——第 10~11 章会系统展开。

## 1.6 alert / prompt / confirm：早期交互三件套

```js
alert('欢迎来到 CS101');                 // 警告框
const name = prompt('你叫什么名字？');    // 输入框，返回输入内容或 null
const ok = confirm('确定要继续吗？');     // 确认框，返回 true/false
```

::: warning 仅限学习阶段
alert/prompt 会阻塞页面，且样式无法定制——正式项目用自定义弹窗组件替代。但练手阶段它们是最快的反馈工具。
:::

## 1.7 代码书写规范

```js
// 分号：每条语句结尾写分号（团队统一即可，本教程统一写）
const a = 1;

// 引号：字符串统一用单引号或反引号
const name = 'Tom';

// 命名：变量用小驼峰（camelCase）
const maxCount = 10;
const isLoggedIn = true;

// 注释：解释"为什么"，而不是复述"做了什么"
```

## 本章小结

- JS 负责行为：交互、数据请求、本地能力；浏览器 + Node 双平台
- 引入方式选外部脚本 + `defer`；控制台是练习草稿纸
- JS 三板斧：找元素 → 听事件 → 改页面
- 命名小驼峰、语句带分号、注释讲为什么

---
title: 初识 TypeScript
---

# 第 1 章 · 初识 TypeScript

**本章目标：**

- 理解 TypeScript 与 JavaScript 的关系
- 体会静态类型带来的实际收益
- 跑通第一个 TS 程序（编译与执行）

## 1.1 TypeScript 是什么

TypeScript（简称 TS）是微软开发的 **JavaScript 超集**：在 JS 的全部语法之上增加了**静态类型系统（static type system）**。

```ts
// JavaScript：参数没有类型约束
function add(a, b) {
  return a + b;
}
add(1, 2);      // 3
add(1, '2');    // '12' —— 不报错，运行时才发现（Bug 的温床）

// TypeScript：类型写进代码
function add(a: number, b: number): number {
  return a + b;
}
add(1, '2');    // ❌ 编辑器直接标红：Argument of type 'string' is not assignable to 'number'
```

三个关键词理解它：

1. **超集**：所有合法 JS 都是合法 TS，你现有的 JS 知识 100% 复用
2. **编译型**：TS 代码需要被编译（compile）成 JS 才能运行（编译器：tsc）
3. **编辑期报错**：错误在写代码时暴露，而不是上线后被用户发现

::: info 与 JS 的关系图
```text
你的代码 ──(TS 类型检查)──→ 编译后的 JS ──→ 浏览器 / Node 执行
   .ts / .tsx                .js
```
浏览器只认识 JS；TS 是"开发阶段的质量关卡"。
:::

## 1.2 为什么要学：三个真实收益

### 收益一：把运行时错误变成编辑时错误

```js
// JS 版：上线后用户点击才报错
const user = getUser();
user.name.toLowerCase();   // 如果 user 是 undefined → 白屏

// TS 版：写的时候就拦住
const user = getUser();          // user: User | undefined
user.name.toLowerCase();         // ❌ TS 提示：user 可能为 undefined
if (user) {
  user.name.toLowerCase();       // ✅ 收窄后放行
}
```

### 收益二：智能提示（IDE 体验质变）

类型即文档——`user.` 一点，所有可用属性/方法自动列出，参数类型悬停可见。团队里不用猜"这个函数返回什么结构"。

### 收益三：重构有保险

改名一个接口字段，所有受影响的调用点立即标红——重构从"祈祷"变成"按红点修完"。

::: tip 谁在用 TypeScript
Vue 3、Angular、React 生态（官方文档以 TS 为主）、VS Code 本身……前端职位 JD 中 TS 已是标配。
:::

## 1.3 环境搭建：tsc 编译器

```bash
mkdir ts-demo && cd ts-demo
npm init -y
npm i -D typescript          # 开发依赖：TS 编译器
npx tsc --version            # Version 5.x.x
```

第一个程序：

```ts
// hello.ts
const name: string = 'TS';
function greet(who: string): string {
  return `Hello, ${who}!`;
}
console.log(greet(name));
```

```bash
npx tsc hello.ts      # 编译 → 生成 hello.js
node hello.js         # 运行编译产物
# Hello, TS!
```

::: tip 在线练习（零安装）
不想装环境时，用官方在线编辑器 [TypeScript Playground](https://www.typescriptlang.org/play)——左边写 TS、右边实时看编译结果与类型报错，适合本章随手验证。
:::

## 1.4 编译器在做什么

```text
类型检查（type checking）：发现类型不匹配，报错但不产文件
代码转译（transpile）：擦除类型信息，输出浏览器/Node 能跑的 JS
```

```ts
// 输入 hello.ts
const n: number = 42;

// 输出 hello.js —— 类型"消失了"，但检查已经发生过
const n = 42;
```

::: danger 类型只在编译期存在
编译后的 JS **没有任何类型信息**。所以 TS 不能拦截"运行时才发生"的事（如接口返回的数据格式错）——那需要运行时校验配合（第 10 章实战中体现）。
:::

## 1.5 前端工具链中的 TS

真实项目几乎不手动跑 `tsc`：

| 场景 | 做法 |
| --- | --- |
| Vite 项目 | 内置 esbuild 转译（快），`vue-tsc` / `tsc` 只做类型检查 |
| Vue 项目 | `npm create vue` 时勾选 TypeScript 即可 |
| React 项目 | `npm create vite@latest -- --template react-ts` |

本教程前半程用 `tsc` 直跑建立直觉，第 9 章讲工程化配置后切换到 Vite 工作流。

## 本章小结

- TS = JS 超集 + 静态类型；编译成 JS 执行，浏览器不认识 TS
- 三大收益：错误前置、智能提示、重构保险
- `npx tsc 文件名.ts` 编译；Playground 在线练手
- 类型只在编译期存在——运行时数据校验仍需自己把关

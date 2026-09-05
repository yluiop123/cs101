---
title: 初识 Node.js 与安装
---

# 第 1 章 · 初识 Node.js 与安装

**本章目标：**

- 理解 Node.js 是什么、为什么前端离不开它
- 完成 Node.js 安装与版本管理
- 跑通第一个命令行程序

## 1.1 Node.js 是什么

Node.js 让 JavaScript 跑在**浏览器之外**：2009 年 Ryan Dahl 把 Chrome 的 V8 引擎（JS 执行核心）抽出来，配上文件读写、网络通信等系统能力，造出了一个 JS 运行时（runtime）。

```text
浏览器里的 JS：只能操作网页（DOM/BOM），不能读文件、不能监听端口
Node.js 里的 JS：没有 window/document，但能读写文件、建服务器、发请求
```

同一个语言，两个世界——这就是"JS 全栈"的基础。

## 1.2 为什么前端必须装 Node

哪怕你只想写前端，Node 环境也是必需品，因为现代前端的整套工具链跑在 Node 上：

| 工具 | 靠 Node 做什么 |
| --- | --- |
| npm / pnpm | 安装 Vue、React 等依赖（第 2~3 章） |
| Vite | 开发服务器 + 构建（[Vite 教程](/tutorials/vite/)） |
| 各类脚手架 | `npm create vue` 一步建项目 |
| ESLint / Prettier | 代码检查与格式化 |

::: tip 心智定位
学完本教程，你不仅掌握"装依赖"，还具备用 Express 写服务端接口的能力（第 9~10 章）——这就是它同时服务前端与后端的原因。
:::

## 1.3 安装 Node.js

### 方式一：官网安装包（最简单）

前往 [nodejs.org](https://nodejs.org/) 下载 **LTS（长期支持版）**，一路下一步：

```bash
node -v      # v20.x.x（LTS 大版本）
npm -v       # 10.x.x（随 Node 附带）
```

### 方式二：版本管理器（推荐长期使用）

不同项目可能需要不同 Node 版本，用 nvm 管理多版本：

```bash
# Windows 用 nvm-windows（github.com/coreybutler/nvm-windows）
nvm install 20       # 安装 Node 20
nvm use 20           # 切换到 20
nvm list             # 查看已装版本

# macOS / Linux 用 nvm（github.com/nvm-sh/nvm）
nvm install --lts
nvm use --lts
```

::: tip LTS 版本怎么选
Node 版本号 = 大版本.小版本.补丁（如 20.11.1）。**偶数大版本是 LTS**（20、22…），有约 30 个月的支持期；学习与生产一律选 LTS，不要追"最新奇数版"。
:::

## 1.4 REPL 与第一个程序

命令行输入 `node` 回车，进入 **REPL（交互式解释器）**——JS 版"控制台"：

```text
$ node
> 1 + 1
2
> console.log('hello node')
hello node
> .exit        （退出）
```

写一个正式的脚本：

```js
// hello.js
const os = require('os');
console.log(`你好，${os.userInfo().username}！`);
console.log(`当前目录：${process.cwd()}`);
```

```bash
node hello.js
# 你好，tom！
# 当前目录：D:\demo
```

::: info 两个内置对象的初见
- `os` / `process`：Node 内置模块（第 5 章系统学习）
- `require`：CommonJS 的模块引入方式，与浏览器 ESM 的 `import` 并存（第 4 章详讲）
:::

## 1.5 npm 与 package.json 初见

`npm -v` 能输出说明 npm 已随 Node 就位。npm 是 Node 的包管理器（package manager），第 2 章展开。先预热两个事实：

1. `npm -v` / `node -v` 是排查环境问题的第一动作
2. 项目目录里的 `package.json` 是"项目身份证"（依赖清单 + 脚本）

## 1.6 常见环境问题排查

| 现象 | 原因 | 解法 |
| --- | --- | --- |
| `node 不是内部或外部命令` | 未安装或未加入 PATH | 重装（勾选 Add to PATH） |
| `npm ERR! network` | 网络不通/被墙 | 换镜像源：`npm config set registry https://registry.npmmirror.com` |
| 安装时报权限错误 | 目录权限不足 | Windows 管理员运行 / macOS 用 nvm 避免全局 sudo |
| node 版本太老跑不了新工具 | 系统里装的是旧版 | 用 nvm 切版本 |

## 本章小结

- Node = V8 + 系统能力，让 JS 走出浏览器；前端工具链全部依赖它
- 安装选 LTS；多版本需求用 nvm
- REPL 即时试验；`node 文件名` 执行脚本
- `node -v` / `npm -v` 是环境检查的第一反应

---
title: 必备插件推荐
---

# 第 3 章 · 必备插件推荐

**本章目标：**

- 掌握插件的安装与管理方法
- 装好一套覆盖日常开发 90% 场景的插件组合
- 了解插件分类思路，避免盲目堆积

## 3.1 插件的安装与管理

VS Code 的插件在官方语境中称为**扩展（Extension）**，二者在中文社区里混用，本教程统一叫"插件"。

打开扩展面板（`Ctrl+Shift+X`），搜索插件名，点击 **Install** 即可。

常用管理操作：

- **禁用/卸载**：扩展面板中点击插件 → 齿轮图标 → 禁用 / 卸载
- **查看已安装**：扩展面板搜索框输入 `@installed`
- **查看推荐**：输入 `@recommended`

::: tip 按项目启停插件
在扩展面板右键某插件选择"禁用（工作区）"，可以让它只在当前项目关闭——比如某些插件只适合前端项目，进入后端项目时禁用即可。
:::

## 3.2 通用必备（所有方向都装）

### 中文语言包

**Chinese (Simplified) Language Pack** —— 第 2 章已装，界面汉化。

### 图标主题

**Material Icon Theme** —— 给文件树中的文件按类型显示彩色图标，`.js`、`.json`、`.vue` 一眼可辨，强烈推荐。

### 主题配色

内置主题已经不错，也可尝试：

- **One Dark Pro** —— 经典暗色主题，最流行
- **GitHub Theme** —— 官方风格，亮暗色都舒服

切换主题：`Ctrl+K Ctrl+T`，或命令面板输入 `theme`。

### 括号增强

新版 VS Code 已内置**彩色括号**与**括号引导线**，无需插件。若你的版本没有，搜索设置 `bracket pair colorization` 开启即可。

## 3.3 前端方向

| 插件 | 作用 |
| --- | --- |
| **Prettier - Code formatter** | 代码格式化，统一团队风格（配合 formatOnSave） |
| **ESLint** | JavaScript/TypeScript 语法与规范检查 |
| **Live Server** | 一键启动本地静态服务器，保存 HTML/CSS 自动刷新浏览器，前端入门神器 |
| **Auto Rename Tag** | 修改 HTML 标签名时，首尾标签同步修改 |
| **Vue - Official**（原 Volar） | Vue 3 官方语言支持 |
| **Tailwind CSS IntelliSense** | Tailwind 类名自动补全与预览 |

::: tip Live Server 怎么用
右键编辑器中的 HTML 文件 → **Open with Live Server**，浏览器会自动打开页面；此后每次保存，浏览器自动刷新。学习 HTML/CSS 阶段必装。
:::

## 3.4 后端方向

| 插件 | 作用 |
| --- | --- |
| **Extension Pack for Java** | Java 全家桶（语言支持、调试、Maven、测试） |
| **Python** | Python 官方语言支持（含调试、Jupyter） |
| **Go** | Go 官方语言支持 |

## 3.5 通用效率

| 插件 | 作用 |
| --- | --- |
| **Error Lens** | 把报错信息直接显示在出错的那一行末尾，不用悬停查看 |
| **GitLens** | Git 增强：每一行代码显示最后修改者与提交信息 |
| **Code Spell Checker** | 英文拼写检查，避免变量名拼错 |
| **Image preview** | 在代码行内预览图片、显示大小 |
| **Markdown All in One** | Markdown 编辑增强（目录生成、快捷键加粗等） |

## 3.6 插件取舍原则

::: warning 避免插件堆积
遵循三个原则：

1. **先用内置**：新版本 VS Code 内置功能越来越强（彩色括号、Git 集成、Emmet 都已内置）
2. **遇到痛点再装**：不要预装"可能会用到"的插件
3. **同类型只留一个**：多个格式化插件同时启用会互相打架（冲突时在设置里指定默认格式化器）
:::

## 本章小结

- 扩展面板（`Ctrl+Shift+X`）搜索安装；`@installed` 查看已装
- 通用三件套：图标主题 + Error Lens + GitLens
- 前端必装：Prettier + ESLint + Live Server；按方向选语言插件
- 原则：先用内置、痛点再装、同类留一

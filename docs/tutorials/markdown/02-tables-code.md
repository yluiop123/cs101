---
title: 表格、代码块与链接图片
---

# 第 2 章 · 表格、代码块与链接图片

**本章目标：**

- 掌握代码块与行内代码的写法（技术写作最高频）
- 会写表格
- 掌握链接与图片的三种常见写法

## 2.1 行内代码

用一对反引号 `` ` `` 包裹，用于标注代码、命令、文件名、按键等：

```markdown
执行 `npm install` 安装依赖，配置文件是 `package.json`。
按 `Ctrl+C` 终止进程。
```

效果：执行 `npm install` 安装依赖，配置文件是 `package.json`。

::: tip 写作习惯
凡是可以复制粘贴的东西（命令、路径、类名、错误信息）都用行内代码包起来，可读性立刻提升一个档次。
:::

## 2.2 代码块（Fenced Code Block）

三个反引号开始与结束，开头反引号后跟语言名可开启**语法高亮**：

`````markdown
```js
function greet(name) {
  return `Hello, ${name}!`;
}
```
`````

效果：

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

常用语言标识：`js` / `ts` / `html` / `css` / `python` / `java` / `bash` / `json` / `yaml` / `sql`。

不写语言名也可以，但没有高亮。**技术文档中代码块必须带语言标识**——这是专业度最直观的体现。

::: warning 嵌套代码块
如果要展示"一段 Markdown 代码本身"（里面有三反引号），外层要用**四个反引号**包裹，否则会提前闭合：

``````markdown
````markdown
```js
console.log('用四个反引号包住三反引号');
```
````
``````
:::

## 2.3 表格

用竖线 `|` 分列、短横线行分隔表头与表体：

```markdown
| 命令 | 作用 |
| --- | --- |
| `git add` | 暂存改动 |
| `git commit` | 提交到本地仓库 |
```

效果：

| 命令 | 作用 |
| --- | --- |
| `git add` | 暂存改动 |
| `git commit` | 提交到本地仓库 |

冒号控制对齐：`:---` 左对齐、`:---:` 居中、`---:` 右对齐。源码不需要竖线对齐得整整齐齐，但源码对齐更好维护。

## 2.4 链接

### 基本写法

```markdown
[链接文字](https://example.com)
[带标题的链接](https://example.com "悬停提示")
```

效果：[Vue 官方文档](https://cn.vuejs.org/)

### 相对链接（站内链接）

写文档站、项目内部文档时用相对路径：

```markdown
详见[第 3 章](./03-gfm.md)
```

### 参考式链接（Reference）

同一个链接出现多次时，可把 URL 集中放在文末管理：

```markdown
访问 [GitHub][gh] 和 [MDN][mdn]。

[gh]: https://github.com
[mdn]: https://developer.mozilla.org
```

## 2.5 图片

语法与链接几乎一致，前面多一个 `!`：

```markdown
![图片描述（替代文字）](https://example.com/cover.png)
![本地图片](./images/logo.png)
```

- **alt 描述必写**：图片加载失败时显示，也是无障碍（Accessibility）与 SEO 的要求
- 本地图放项目目录里用相对路径引用（如 `./images/xxx.png`）
- Markdown 原生不支持调整图片尺寸，需要尺寸控制时可内嵌 HTML `<img>` 标签

## 2.6 自动链接

直接书写完整 URL（或用 `<url>` 包裹），多数平台会自动渲染为可点击链接：

```markdown
官网：https://git-scm.com
邮箱：<hello@example.com>
```

## 本章小结

- 行内代码包一切可复制内容；代码块必带语言标识
- 展示含三反引号的源码用四反引号包裹
- 表格冒号控对齐；链接三式：行内/相对/参考式
- 图片多一个 `!`，alt 必写

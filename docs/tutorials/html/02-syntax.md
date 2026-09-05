---
title: 基础语法与文档结构
---

# 第 2 章 · 基础语法与文档结构

**本章目标：**

- 掌握标签、元素、属性三个核心概念
- 理解标准文档结构与 head 区的常见配置
- 学会 HTML 注释与空元素

## 2.1 标签、元素、属性

三个名词的关系用一句话说清：

```html
<a href="https://example.com">访问示例网站</a>
```

- **标签（tag）**：尖括号里的名字，`<a>` 是开始标签，`</a>` 是结束标签
- **元素（element）**：开始标签 + 内容 + 结束标签的整体
- **属性（attribute）**：开始标签内的键值对，`href="..."` 给元素附加信息

属性值用双引号包裹（单引号也合法，但**团队统一用双引号**）。

## 2.2 嵌套规则

元素可以互相嵌套，形成树状结构：

```html
<ul>
  <li>
    <a href="#">链接</a>
  </li>
</ul>
```

两条铁律：

1. **不允许交叉**：`<b><i>文字</b></i>` 是错的，谁先开谁后关
2. **正确缩进**：子元素缩进两个空格，层级一目了然

## 2.3 注释

```html
<!-- 这是一条注释，浏览器不会显示它 -->

<!--
  也可以多行。
  用于：解释代码意图、临时禁用某段标记。
-->
```

::: warning 注释会随源码公开
网页源码任何人可见（Ctrl+U 查看），注释里**不要写密码、密钥、敏感信息**。
:::

## 2.4 标准文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面标题</title>
  </head>
  <body>
    <!-- 用户能看见的内容都写在这里 -->
  </body>
</html>
```

逐行解析：

| 部分 | 作用 |
| --- | --- |
| `<!DOCTYPE html>` | 声明使用 HTML5 标准，必须是第一行 |
| `<html>` | 根元素，包裹整个文档，`lang` 声明语言 |
| `<head>` | 头部：给**浏览器/搜索引擎**看的元信息，不显示在页面里 |
| `<meta charset="UTF-8">` | 字符编码，不写会中文乱码 |
| `<meta name="viewport">` | 移动端视口适配，响应式的起点 |
| `<title>` | 浏览器标签页标题，也是搜索结果的标题 |
| `<body>` | 主体：用户**看得见**的所有内容 |

::: tip VS Code 快速骨架
新建 `xxx.html` 后输入 `!` 按 Tab（Emmet），瞬间生成以上完整骨架（见 [VS Code 教程第 4 章](/tutorials/vscode/)）。
:::

## 2.5 head 里还常放什么

```html
<head>
  <meta charset="UTF-8" />
  <title>CS101 - 技术学习地图</title>

  <!-- SEO：页面描述 -->
  <meta name="description" content="全面的技术学习路径汇总" />

  <!-- 图标 -->
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />

  <!-- 外部样式表 -->
  <link rel="stylesheet" href="style.css" />

  <!-- 外部脚本 -->
  <script src="app.js"></script>
</head>
```

## 2.6 空元素（Void Elements）

少数元素**没有内容、也没有结束标签**，称为空元素：

```html
<meta charset="UTF-8" />
<br />
<img src="photo.png" alt="照片" />
<input type="text" />
<hr />
```

它们只写一个开始标签即可（HTML5 中结尾的 `/` 可写可不写，写上可读性更好）。

## 本章小结

- 标签是标记名，元素 = 开始标签 + 内容 + 结束标签，属性是键值对
- 嵌套不交叉、缩进要规整；注释不写敏感信息
- 文档结构：DOCTYPE → html → head（给浏览器看）+ body（给用户看）
- meta charset 防乱码；空元素无结束标签

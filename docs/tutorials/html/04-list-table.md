---
title: 列表与表格
---

# 第 4 章 · 列表与表格

**本章目标：**

- 熟练使用三种列表并正确嵌套
- 掌握表格完整结构与合并单元格
- 建立"表格只装数据"的正确观念

## 4.1 无序列表：ul + li

内容**顺序无关**时用无序列表（unordered list）：

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

列表项（list item）内的内容不限：文字、链接、图片甚至另一个列表。

## 4.2 有序列表：ol + li

内容**顺序重要**时用有序列表（ordered list）：

```html
<ol>
  <li>安装 Node.js</li>
  <li>创建项目目录</li>
  <li>初始化 Git 仓库</li>
</ol>
```

常用属性：

```html
<!-- start：从几开始编号；reversed：倒序 -->
<ol start="3" reversed>
  <li>季军</li>
  <li>亚军</li>
  <li>冠军</li>
</ol>
```

编号样式（数字/字母/罗马数字）交给 CSS 的 `list-style-type` 控制，HTML 不管外观。

## 4.3 嵌套列表

子列表写在**父列表项 `<li>` 的内部**：

```html
<ul>
  <li>
    编程语言
    <ul>
      <li>JavaScript</li>
      <li>Python</li>
    </ul>
  </li>
  <li>工具</li>
</ul>
```

::: warning 常见错误
子列表放在 `<li>` 外面、两个 `<li>` 之间是非法结构，渲染易错、语义断裂。**子列表永远是 `<li>` 的孩子**。
:::

## 4.4 描述列表：dl + dt + dd

"术语 + 解释"型的内容用描述列表（description list）：

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，负责页面结构</dd>
  <dt>CSS</dt>
  <dd>层叠样式表，负责页面外观</dd>
</dl>
```

- `<dt>`：术语（term）
- `<dd>`：描述（description）
- 一个 `<dt>` 可以对应多个 `<dd>`

典型场景：术语表、FAQ、键值对展示（如商品参数）。

## 4.5 表格：table 家族

展示**二维数据**（行 × 列）用表格：

```html
<table>
  <caption>2024 年第 1 季度学习时长</caption>
  <thead>
    <tr>
      <th>月份</th>
      <th>时长（小时）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 月</td>
      <td>45</td>
    </tr>
    <tr>
      <td>2 月</td>
      <td>38</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>合计</td>
      <td>83</td>
    </tr>
  </tfoot>
</table>
```

结构解析：

| 标签 | 含义 |
| --- | --- |
| `<table>` | 表格容器 |
| `<caption>` | 表格标题（可选，置于表格顶部） |
| `<tr>` | 行（table row） |
| `<th>` | 表头单元格（table header，自动加粗居中） |
| `<td>` | 数据单元格（table data） |
| `<thead>` / `<tbody>` / `<tfoot>` | 语义分区（thead/tfoot 可选，tbody 建议写） |

## 4.6 合并单元格

用 `colspan`（跨列）与 `rowspan`（跨行）属性：

```html
<tr>
  <!-- 横向合并：这个格子占两列 -->
  <td colspan="2">整行合并</td>
</tr>
<tr>
  <!-- 纵向合并：这个格子占两行，下一行就少写一个 td -->
  <td rowspan="2">左侧合并</td>
  <td>右上</td>
</tr>
<tr>
  <td>右下</td>
</tr>
```

::: danger 合并的核心口诀
**被"吃掉"的格子不用写**。colspan="2" 意味着同行少写一个 td；rowspan="2" 意味着下一行少写一个 td。数错格子是表格排版错位的头号原因。
:::

## 4.7 表格的正确用途

::: danger 表格不是布局工具
2000 年代流行用 `<table>` 摆页面布局，如今是**明确的反模式**：

- 表格 = 数据表（有行列关系的二维数据）
- 页面布局 = CSS（Grid / Flex，见 [CSS 教程](/tutorials/css/)）

用表格做布局的问题：语义错误（屏幕阅读器混乱）、响应式困难、维护噩梦。
:::

## 本章小结

- ul 顺序无关、ol 顺序重要、dl 术语-解释
- 嵌套列表写在父 li 内部
- 表格结构 table > thead/tbody/tfoot > tr > th/td
- colspan/rowspan 口诀：被吃掉的格子不用写；表格只装数据

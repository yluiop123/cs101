---
title: 表单（下）：校验与进阶
---

# 第 8 章 · 表单（下）：校验与进阶

**本章目标：**

- 掌握 select、textarea、datalist 等进阶控件
- 用 HTML5 校验属性实现免 JS 表单校验
- 深入理解 GET 与 POST 的提交差异

## 8.1 下拉选择：select

```html
<select name="city">
  <option value="">-- 请选择城市 --</option>
  <optgroup label="华东">
    <option value="sh" selected>上海</option>
    <option value="nj">南京</option>
  </optgroup>
  <optgroup label="华南">
    <option value="gz">广州</option>
    <option value="sz">深圳</option>
  </optgroup>
</select>
```

- `selected`：默认选中项
- `<optgroup>`：选项分组（label 只展示、不可选）
- 提交的是选中项的 `value`；没写 value 时提交选项文字

## 8.2 多行文本：textarea

```html
<textarea name="intro" rows="4" placeholder="介绍一下自己…"></textarea>
```

注意：textarea 是**双标签**，初始值写在标签内容里（不是 value 属性）。`rows` 只影响初始高度，可拖拽调整（禁用拖拽用 CSS `resize: none`）。

## 8.3 输入建议：datalist

文本框 + 建议列表的组合（可自由输入，也可从建议中选）：

```html
<input type="text" name="framework" list="frameworks" />
<datalist id="frameworks">
  <option value="Vue"></option>
  <option value="React"></option>
  <option value="Angular"></option>
</datalist>
```

与 select 的区别：datalist **允许输入列表以外的值**，适合"常见项 + 自定义"场景（如输入邮箱、城市）。

## 8.4 分组框：fieldset 与 legend

```html
<fieldset>
  <legend>收货地址</legend>
  <p><label>省份 <input type="text" name="province" /></label></p>
  <p><label>详细地址 <input type="text" name="detail" /></label></p>
</fieldset>
```

视觉上是一圈边框加标题，语义上是"一组相关控件"——复杂表单用它分区，结构立刻清晰。

## 8.5 HTML5 免 JS 校验

给控件加属性，浏览器自动完成提交前校验，不合法则阻止提交并提示：

| 属性 | 作用 |
| --- | --- |
| `required` | 必填 |
| `minlength` / `maxlength` | 长度范围 |
| `min` / `max` / `step` | 数值/日期范围与步进 |
| `type="email"` / `url` 等 | 内置格式校验 |
| `pattern` | 正则校验（与 [正则表达式教程](/tutorials/regex/) 结合） |

```html
<input
  type="text"
  name="username"
  required
  minlength="2"
  maxlength="10"
  pattern="[a-zA-Z0-9]+"
  title="只能包含字母和数字"
/>
```

::: tip pattern 与 title
`pattern` 校验失败时，浏览器把 `title` 内容作为提示展示给用户——写给用户看的规则说明。完整的正则语法复习见[正则表达式教程](/tutorials/regex/)。
:::

### 关闭校验与手动校验

```html
<!-- 调试时临时关闭浏览器校验 -->
<form action="/api/save" method="post" novalidate>
```

HTML 校验只是第一道防线，**服务端必须再校验一次**——绕过前端校验（直接发请求）易如反掌，前端校验的目标是体验而非安全。

## 8.6 GET 与 POST 深入对比

| 维度 | GET | POST |
| --- | --- | --- |
| 数据位置 | URL 查询字符串（`?key=value&...`） | 请求体（Request Body） |
| 长度限制 | 受 URL 长度限制（约 2KB~8KB） | 基本无限制 |
| 浏览器历史 | 完整保留在地址栏 | 不保留 |
| 数据类型 | 仅文本 | 文本 + 文件上传 |
| 语义 | 获取资源、搜索 | 创建/修改数据 |

```html
<!-- 搜索表单：GET，可收藏、可分享 -->
<form action="/search" method="get">
  <input type="text" name="q" />
  <button type="submit">搜索</button>
</form>

<!-- 登录表单：POST，数据不进 URL -->
<form action="/api/login" method="post">
  <input type="password" name="pwd" />
  <button type="submit">登录</button>
</form>
```

::: danger 密码永远用 POST
GET 的数据直接暴露在地址栏、历史记录与服务器日志中。含敏感信息的表单一律 POST，且全站应使用 HTTPS。
:::

## 8.7 综合示例

```html
<style>
  form { font-family: sans-serif; max-width: 380px; }
  fieldset { border: 1px solid #cbd5e1; border-radius: 8px; margin: 12px 0; }
  legend { font-weight: 600; padding: 0 8px; }
  p { margin: 8px 0; }
  label { display: inline-block; min-width: 80px; }
  input[type='text'], input[type='email'], textarea, select { padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 200px; font-family: inherit; }
  textarea { width: 280px; }
  button { padding: 7px 18px; border: 0; border-radius: 6px; background: #16a34a; color: #fff; cursor: pointer; }
</style>

<form>
  <fieldset>
    <legend>基本信息（必填）</legend>
    <p><label>昵称 <input type="text" name="name" required minlength="2" maxlength="8" /></label></p>
    <p><label>邮箱 <input type="email" name="email" required /></label></p>
    <p><label>城市
      <select name="city" required>
        <option value="">请选择</option>
        <option value="sh">上海</option>
        <option value="gz">广州</option>
      </select>
    </label></p>
  </fieldset>

  <fieldset>
    <legend>补充信息</legend>
    <p><label>来源 <input type="text" name="src" list="sources" placeholder="可输入或选择" /></label></p>
    <datalist id="sources">
      <option value="搜索引擎"></option>
      <option value="朋友推荐"></option>
      <option value="社交媒体"></option>
    </datalist>
    <p><label>简介 <textarea name="intro" rows="3" placeholder="最多 100 字"></textarea></label></p>
  </fieldset>

  <button type="submit">提交报名</button>
</form>
```

::: info 校验体验
把这段代码存为 HTML 打开：直接提交会被浏览器拦截（必填/长度/格式校验生效）；把昵称填成 `tom123456789`（超过 8 位）再提交，观察 minlength 的提示。
:::

## 本章小结

- select/textarea/datalist 覆盖"选择、长文本、建议输入"三类场景
- fieldset/legend 给复杂表单分区，语义与外观兼得
- required/min/max/pattern 等属性实现零 JS 校验，但服务端必须复验
- GET 数据进 URL（可分享），POST 数据进请求体（更安全）；敏感信息永远 POST

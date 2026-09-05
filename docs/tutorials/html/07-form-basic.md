---
title: 表单（上）：基础控件
---

# 第 7 章 · 表单（上）：基础控件

**本章目标：**

- 理解 form 的提交模型：action、method、name
- 熟练使用 input 的常用 type
- 掌握 label 关联与按钮家族

表单（form）是网页收集用户输入的唯一标准方式——登录、注册、搜索、下单都靠它。

## 7.1 form：表单的容器

```html
<form action="/api/login" method="post">
  <p>
    <label for="username">用户名</label>
    <input id="username" name="username" type="text" />
  </p>
  <p>
    <label for="password">密码</label>
    <input id="password" name="password" type="password" />
  </p>
  <button type="submit">登录</button>
</form>
```

| 属性 | 作用 |
| --- | --- |
| `action` | 提交地址（数据发到哪） |
| `method` | 提交方式：`get`（默认）或 `post` |
| `name` | **控件的 key**——没有 name 的控件不会随表单提交 |

提交原理：点击提交按钮后，浏览器把所有带 `name` 的控件组织成 `key=value` 对发送。`get` 方式数据拼在 URL 后面（`?username=tom&password=123`），`post` 方式放在请求体里。

## 7.2 input 的常用 type

`<input>` 是单标签，`type` 决定它的形态：

```html
<input type="text" />        <!-- 单行文本 -->
<input type="password" />    <!-- 密码（圆点遮盖） -->
<input type="email" />       <!-- 邮箱（自带格式校验） -->
<input type="number" min="1" max="100" />  <!-- 数字（可带上下限与步进） -->
<input type="tel" />         <!-- 电话（移动端弹数字键盘） -->
<input type="date" />        <!-- 日期选择器 -->
<input type="time" />        <!-- 时间选择器 -->
<input type="color" />       <!-- 颜色选择器 -->
<input type="range" min="0" max="100" />   <!-- 滑块 -->
<input type="file" accept=".png,.jpg" />   <!-- 文件选择 -->
<input type="checkbox" />    <!-- 复选框 -->
<input type="radio" />       <!-- 单选框 -->
<input type="hidden" name="token" value="abc" />  <!-- 隐藏域 -->
```

::: tip 用语义 type 的三层好处
1. 移动端弹出**合适的键盘**（email 弹邮箱键盘、tel 弹数字键盘）
2. 浏览器**自带校验**（email 格式错误无法提交）
3. 浏览器自动填充能正确识别（自动填密码、地址）

能用语义 type 就不要一律写 `text`。
:::

## 7.3 单选与复选的分组

同一组单选框用**相同的 name**，勾选才互斥：

```html
<fieldset>
  <legend>性别</legend>
  <label><input type="radio" name="gender" value="m" /> 男</label>
  <label><input type="radio" name="gender" value="f" /> 女</label>
</fieldset>

<label><input type="checkbox" name="skill" value="html" /> HTML</label>
<label><input type="checkbox" name="skill" value="css" /> CSS</label>
```

复选框同 name 提交后是多个值（`skill=html&skill=css`）；`value` 指定被选中时提交的内容。

## 7.4 label：点文字也能选中控件

label 与控件的关联有两种写法：

```html
<!-- 写法一：for 指向控件 id -->
<label for="email">邮箱</label>
<input id="email" type="email" name="email" />

<!-- 写法二：包裹式（无需 id） -->
<label>
  记住我
  <input type="checkbox" name="remember" />
</label>
```

关联后点击 label 文字等于点击控件——对**小点击区域**（单选/复选框）的可用性提升巨大，同时屏幕阅读器靠它朗读控件名称。

::: danger 必须写 label
没有 label 的输入控件是无障碍（accessibility）硬伤——视觉正常的用户看 placeholder 猜字段，读屏用户则完全不知道要填什么。
:::

## 7.5 占位符与初始值

```html
<input type="text" name="nickname" placeholder="请输入昵称（3~10 字）" />
<input type="text" name="city" value="北京" />
```

- `placeholder`：提示文字，**输入即消失**——它不是 value，也不会被提交
- `value`：真实初始值，会被提交

## 7.6 按钮家族：button

```html
<button type="submit">提交</button>   <!-- 提交表单（默认） -->
<button type="reset">重置</button>    <!-- 恢复初始值 -->
<button type="button">普通按钮</button> <!-- 无默认行为，配合 JS 使用 -->
```

::: warning type 别省略
button 在 form 内的默认 type 是 `submit`——只想做点击交互（如"计算一下"）却忘写 `type="button"`，一点按钮表单就提交刷新了，这是新手最常见的"页面莫名刷新"问题。
:::

## 7.7 综合示例

```html
<style>
  form { font-family: sans-serif; max-width: 340px; }
  p { margin: 10px 0; }
  label { display: inline-block; min-width: 72px; }
  input[type='text'], input[type='password'] { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; width: 200px; }
  button { padding: 7px 18px; border: 0; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer; }
  button[type='reset'] { background: #94a3b8; }
</style>

<form>
  <p><label for="user">用户名</label><input id="user" name="username" type="text" placeholder="请输入用户名" /></p>
  <p><label for="pass">密码</label><input id="pass" name="password" type="password" placeholder="请输入密码" /></p>
  <p>
    <label><input type="radio" name="role" value="student" checked /> 学生</label>
    <label><input type="radio" name="role" value="teacher" /> 教师</label>
  </p>
  <p><label><input type="checkbox" name="remember" /> 记住我</label></p>
  <p>
    <button type="submit">登录</button>
    <button type="reset">重置</button>
    <button type="button">发送验证码</button>
  </p>
</form>
```

::: info 提交原理验证
把这段代码存为 HTML 并打开：点"登录"按钮后观察地址栏——没有 action 时浏览器会把数据拼到当前 URL（`?username=...&password=...`），这就是 GET 提交的直观展现。
:::

## 本章小结

- form 用 action/method 定义提交去向，控件必须带 `name` 才会提交
- input 的 type 按语义选择，移动端键盘与自动填充都依赖它
- 单选靠同 name 分组互斥；label 让点击文字即可选中控件
- button 三种 type 各司其职，form 内普通按钮务必 `type="button"`

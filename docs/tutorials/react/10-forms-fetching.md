---
title: 表单与数据请求
---

# 第 10 章 · 表单与数据请求

**本章目标：**

- 掌握受控组件与表单状态管理
- 建立请求层的 loading/error 状态机
- 完成带校验的注册表单实战

## 10.1 受控组件

React 的 input 值由 state 驱动——**受控组件（controlled component）**：

```jsx
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({ username: '', password: '' });

  function update(field) {
    // 工厂函数：一个更新器管所有字段
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  return (
    <form>
      <input value={form.username} onChange={update('username')} />
      <input value={form.password} type="password" onChange={update('password')} />
    </form>
  );
}
```

```text
value={state}      → 显示由 state 决定（单向）
onChange={…}       → 输入回写 state（闭合成"双向"）
```

各控件对照（Vue v-model 的 React 分解）：

```jsx
<input value={text} onChange={e => setText(e.target.value)} />        // 文本
<textarea value={text} onChange={e => setText(e.target.value)} />     // 多行
<input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />   // 布尔
<select value={v} onChange={e => setV(e.target.value)}>…</select>     // 下拉
```

::: warning checkbox 用 checked + e.target.checked
`value` 对 checkbox 无意义——读 `checked` 属性。这是最高频的表单 bug。
:::

## 10.2 提交与阻止默认

```jsx
async function onSubmit(e) {
  e.preventDefault();               // 阻止默认提交刷新
  console.log(form);
}

<form onSubmit={onSubmit}>
  ...
  <button type="submit">注册</button>
</form>
```

监听 form 的 submit（回车也能触发）；`e.preventDefault()` 必写。

## 10.3 校验：errors 状态

与 Vue 第 8 章同一模式——**errors 对象管理错误文案**：

```jsx
export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', password: '', agree: false });
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (form.username.length < 2) errs.username = '用户名至少 2 个字符';
    if (form.password.length < 6) errs.password = '密码至少 6 位';
    if (!form.agree) errs.agree = '请先同意条款';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await registerApi(form);
    alert('注册成功');
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="用户名" />
        {errors.username && <p className="error">{errors.username}</p>}
      </div>
      <div>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="密码" />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      <div>
        <label>
          <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} />
          同意条款
        </label>
        {errors.agree && <p className="error">{errors.agree}</p>}
      </div>
      <button type="submit">注册</button>
    </form>
  );
}
```

## 10.4 数据请求：请求层 + 状态机

```js
// src/api/todo.js —— 纯网络逻辑（与 Vue 同构）
const BASE = import.meta.env.VITE_API_BASE;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const todoApi = {
  list: () => request('/todos'),
  add: (text) => request('/todos', { method: 'POST', body: JSON.stringify({ text }) }),
};
```

```jsx
// 组件里的请求状态机（useEffect 版，第 5 章竞态细节）
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    todoApi.list()
      .then(data => { if (!ignore) setTodos(data); })
      .catch(e => { if (!ignore) setError(e); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  if (loading) return <p>加载中…</p>;
  if (error) return <p>出错了：{error.message}</p>;
  return <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>;
}
```

**封装成自定义 Hook**（第 5 章预告的 useRequest，第 9 章正式展开）。

## 10.5 提交防重复与提交后反馈

```jsx
const [submitting, setSubmitting] = useState(false);

async function onSubmit(e) {
  e.preventDefault();
  if (submitting.value === undefined) {} // 无意义示例防误读，见下方正确版
}

// 正确版
async function onSubmit(e) {
  e.preventDefault();
  if (submitting) return;             // 防重复
  if (!validate()) return;

  setSubmitting(true);
  try {
    await registerApi(form);
    alert('成功');
  } catch (err) {
    setErrors({ username: err.message });   // 后端错误回显
  } finally {
    setSubmitting(false);             // 无论成败复位
  }
}

<button type="submit" disabled={submitting}>
  {submitting ? '提交中…' : '注册'}
</button>
```

## 10.6 综合练习：登录表单（全要素）

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const errs = {};
    if (!form.username) errs.username = '请输入用户名';
    if (!form.password) errs.password = '请输入密码';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const { token } = await loginApi(form);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ password: '登录失败，请检查账号密码' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <input value={form.username} onChange={set('username')} placeholder="用户名" />
      {errors.username && <p className="error">{errors.username}</p>}
      <input type="password" value={form.password} onChange={set('password')} placeholder="密码" />
      {errors.password && <p className="error">{errors.password}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? '登录中…' : '登录'}
      </button>
    </form>
  );
}
```

统一 updater 工厂 `set(field)` + checkbox 分支处理，多字段表单不再写重复代码。

## 本章小结

- 受控组件：value + onChange 闭合双向；checkbox 用 checked
- 校验 = errors 对象；提交前统一 validate，错误文案就近渲染
- 请求层 api 纯函数化；组件内 loading/error/数据 三态机 + 竞态防护
- submitting 防重复、驱动按钮态；try/finally 复位

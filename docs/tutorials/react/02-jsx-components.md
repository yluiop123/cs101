---
title: JSX 与组件
---

# 第 2 章 · JSX 与组件

**本章目标：**

- 掌握 JSX 的全部语法规则
- 学会组件的组合与 props 传参
- 理解 children 与组件拆分

## 2.1 JSX 是什么

JSX（JavaScript XML）= **JS 里写"HTML"**。它不是模板字符串，而是语法糖——构建时被转译成函数调用：

```jsx
const el = <h1 className="title">你好</h1>;

// 转译后（Babel/esbuild 做的事）：
const el = createElement('h1', { className: 'title' }, '你好');
// 产物是一般的 JS 对象（虚拟 DOM），渲染时再变成真实 DOM
```

**JSX 产物是对象不是字符串**——可以存变量、当参数传、条件拼接，比模板字符串强大得多。

## 2.2 JSX 六条规则

```jsx
// ① 只能一个根元素（Fragment 解决）
return (
  <>
    <h1>标题</h1>
    <p>多根内容用空标签 Fragment 包裹（不产生多余 DOM）</p>
  </>
);

// ② class → className，属性一律小驼峰
<div className="box" tabIndex={0} htmlFor="name" />

// ③ 花括号里写任意 JS 表达式
<p>{user.name}</p>
<p>{a > b ? '大' : '小'}</p>
<p>{items.length * 2}</p>
{/* 语句不行：if/for 要写在 JSX 之外或用三元/map */}

// ④ 自闭合标签必须闭合
<img src="x.png" />
<br />

// ⑤ 注释用大括号包裹
{/* 这是注释 */}

// ⑥ style 是对象（不是字符串）
<div style={{ color: 'red', fontSize: 16 }} />
```

::: warning style 对象细节
`style={{ }}` 外层大括号 = "这里是表达式"，内层 = JS 对象；属性小驼峰（fontSize），数字单位默认 px。
:::

## 2.3 条件渲染的 JSX 风格

没有 v-if——用 JS 表达式：

```jsx
function Badge({ status }) {
  // 方式一：三元
  return <span>{status === 'done' ? '✅' : '⏳'}</span>;
}

function List({ items }) {
  return (
    <>
      {/* 方式二：&& 短路（真则渲染） */}
      {items.length > 0 && <p>共 {items.length} 项</p>}

      {/* 方式三：提取成变量（复杂条件首选） */}
      {(() => {
        // 不推荐 IIFE！复杂逻辑放组件体里
      })()}
    </>
  );
}

// ✅ 复杂条件的正确姿势：组件体里先算好
function Profile({ user }) {
  let statusText;
  if (!user) statusText = '未登录';
  else if (user.vip) statusText = 'VIP 会员';
  else statusText = '普通用户';

  return <p>{statusText}</p>;
}
```

## 2.4 props：组件的参数

```jsx
// 子组件：参数解构即 props
function CourseCard({ title, hours, done = false }) {
  return (
    <div className={done ? 'card done' : 'card'}>
      <h3>{title}</h3>
      <span>{hours} 小时</span>
    </div>
  );
}

// 父组件：属性传入
<CourseCard title="Vue 教程" hours={20} />
<CourseCard title="React 教程" hours={18} done />
```

与 Vue 相同的规则：

- 字符串直接写，其他类型加 `{}`：`hours={20}`、`done`（true 简写）、`onClick={fn}`
- **props 只读**（单向数据流），不能在子组件里改
- 默认值用参数默认 `done = false`

## 2.5 children：标签中间的内容

组件标签包裹的内容通过 `children` prop 传入：

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// 使用
<Card>
  <h3>标题</h3>
  <p>任意内容都是 children</p>
</Card>
```

children 可以是 JSX、字符串、甚至函数（渲染函数作 children = React 版"作用域插槽"）。

## 2.6 组合与拆分

React 项目就是组件树的组装：

```jsx
// src/components/Header.jsx
export default function Header({ title }) {
  return <header><h1>{title}</h1></header>;
}

// src/components/Footer.jsx
export default function Footer() {
  return <footer>© CS101</footer>;
}

// src/App.jsx —— 组装
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CourseList from './components/CourseList.jsx';

export default function App() {
  return (
    <>
      <Header title="课程平台" />
      <main><CourseList /></main>
      <Footer />
    </>
  );
}
```

拆分标准与 Vue 版一致（重复 / 超长 / 独立状态 / 说不清职责），目录惯例：

```text
src/
├── components/     # 通用组件
├── views/ (或 pages/)  # 页面组件
├── hooks/          # 自定义 Hooks（第 5 章）
└── App.jsx
```

## 2.7 综合练习：用户资料卡

```jsx
function Avatar({ name, size = 40 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {name[0]}
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar name={user.name} />
      <div>
        <p className="name">{user.name}</p>
        <p className="desc">{user.desc ?? '暂无简介'}</p>
      </div>
      {user.vip && <span className="badge">VIP</span>}
    </div>
  );
}

export default function App() {
  const user = { name: 'Tom', desc: '前端学习者', vip: true };
  return <UserCard user={user} />;
}
```

一个卡片用齐：props 解构与默认值、style 对象、`??` 兜底、`&&` 条件、组件组合——JSX 全景图。

## 本章小结

- JSX = 语法糖，产物是对象；`{}` 表达式、className、小驼峰
- 多根用 Fragment `<>`；复杂条件先算成变量再渲染
- props 只读；children 传递标签内容；组件树即应用

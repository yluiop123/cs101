---
title: 组件通信
---

# 第 6 章 · 组件通信

**本章目标：**

- 掌握 props 回调的"子通知父"模式
- 学会状态提升与组合复用
- 理解 Context 解决深层传递

## 6.1 通信全景

```text
父 → 子        props（数据下行）
子 → 父        回调 props（事件上行）
兄弟/跨层      状态提升 / Context（本章）
全局共享       Zustand（第 8 章）
```

与 Vue 对照：props 同名同义；emit → **回调函数作 props**；provide/inject → Context。

## 6.2 子通知父：回调 props

React 没有 emit——传一个**函数 prop**，子组件调用它：

```jsx
// 子组件：接到什么就调用什么
function CourseCard({ course, onSelect, onRemove }) {
  return (
    <div className="card">
      <h3 onClick={() => onSelect(course.id)}>{course.title}</h3>
      <button onClick={() => onRemove(course.id)}>删除</button>
    </div>
  );
}

// 父组件：把"处理函数"传下去
export default function CourseList() {
  const [courses, setCourses] = useState([...]);

  function handleSelect(id) { console.log('选中', id); }
  function handleRemove(id) { setCourses(courses.filter(c => c.id !== id)); }

  return courses.map(c => (
    <CourseCard key={c.id} course={c} onSelect={handleSelect} onRemove={handleRemove} />
  ));
}
```

命名约定：`onXxx`（子组件调用）+ `handleXxx`（父组件实现）——见名知向。

## 6.3 状态提升（Lifting State Up）

两个兄弟组件要共享数据 → 把状态提到**最近的共同父组件**：

```jsx
// ❌ 各自持有：温度转换器两边不同步
function CelsiusInput() { const [c, setC] = useState(''); ... }
function FahrenheitInput() { const [f, setF] = useState(''); ... }

// ✅ 状态上提到父组件，兄弟都从 props 读
export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');

  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitInput value={celsius === '' ? '' : (celsius * 9) / 5 + 32} />
    </>
  );
}
```

```text
提升的信号：两个组件需要同一份数据/保持同步
提升的终点：最近共同父组件（不必一路提到 App）
```

这就是 Vue 版"状态上提"的 React 原生姿势——Pinia/Zustand（第 8 章）解决的是提升后"父组件变厚"的进一步需求。

## 6.4 children 与 render 复用

第 2 章的 children 是最朴素的组合工具——外壳组件（布局、卡片、弹窗）都用它：

```jsx
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="mask" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// 使用：外壳写一次，内容随场景
<Modal open={open} onClose={() => setOpen(false)}>
  <h3>确认删除</h3>
  <p>删除后不可恢复</p>
  <button onClick={doDelete}>确定</button>
</Modal>
```

需要"子组件把数据递给内容"时（作用域插槽场景），传**函数作 children**：

```jsx
function TodoList({ todos, children }) {
  return <ul>{todos.map(t => <li key={t.id}>{children(t)}</li>)}</ul>;
}

// 使用：children 是函数，接收子组件递来的数据
<TodoList todos={todos}>
  {todo => <span className={todo.done ? 'done' : ''}>{todo.text}</span>}
</TodoList>
```

## 6.5 Context：跨层级注入

深层组件要用祖先的数据，逐层传 props（"props 钻井"）太痛苦。**Context** 建立一条"直达通道"：

```jsx
// ① 创建 Context（通常单独文件）
// src/context/ThemeContext.js
import { createContext } from 'react';
export const ThemeContext = createContext(null);
```

```jsx
// ② 祖先：Provider 提供值
import { useState } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export default function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

```jsx
// ③ 任意后代：useContext 注入（中间层完全透明）
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>切换主题</button>;
}
```

::: tip Context 的适用边界
与 Vue 的 provide/inject 同一纪律：**低频更新的"上下文"**（主题、语言、当前用户）适合 Context；高频业务数据（购物车频繁增删）用 Zustand——Context 变化会使所有消费组件重渲染，滥用伤性能。
:::

## 6.6 受控组件预热：表单组件的通信

表单元素的 value + onChange 组合叫**受控组件**（第 10 章展开）：

```jsx
function TextInput({ value, onChange }) {
  return (
    <input
      value={value}                          // 值由父组件控制
      onChange={e => onChange(e.target.value)}  // 变更回传父组件
    />
  );
}
```

这就是"回调 props"最典型的应用——组件的 value 完全由父级 state 驱动。

## 6.7 综合练习：可折叠的 FAQ 列表

```jsx
import { useState } from 'react';

function FaqItem({ question, answer, open, onToggle }) {
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={onToggle}>
        {question} {open ? '▲' : '▼'}
      </button>
      {open && <p className="faq-a">{answer}</p>}
    </div>
  );
}

export default function Faq() {
  const [openId, setOpenId] = useState(null);
  const faqs = [
    { id: 1, q: 'React 是框架吗？', a: '是 UI 库，路由等自行组合。' },
    { id: 2, q: 'Vue 会了学 React 难吗？', a: '思路同构，主要是不可变更新的适应。' },
  ];

  return (
    <div>
      {faqs.map(f => (
        <FaqItem
          key={f.id}
          question={f.q}
          answer={f.a}
          open={openId === f.id}
          onToggle={() => setOpenId(openId === f.id ? null : f.id)}
        />
      ))}
    </div>
  );
}
```

状态（openId）在父、展示在子、切换经回调——单向数据流的标准形态。

## 本章小结

- 子通知父 = 回调 props（onXxx 传下 / handleXxx 实现）
- 兄弟共享 → 状态提升到最近共同父
- children 组合外壳；函数 children 实现"子递数据父渲染"
- Context 直达深层（低频上下文）；高频业务状态交给状态库

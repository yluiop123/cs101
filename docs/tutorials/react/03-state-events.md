---
title: 状态与事件
---

# 第 3 章 · 状态与事件

**本章目标：**

- 掌握 useState 与事件处理的标准写法
- 理解"不可变更新"与 setState 的批处理
- 会做对象/数组状态的安全更新

## 3.1 useState：给组件装上记忆

函数组件每次渲染都会"重新执行"——普通变量一刷新就丢。`useState` 让值跨渲染存活：

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);   // [当前值, 修改函数]

  return (
    <button onClick={() => setCount(count + 1)}>
      点了 {count} 次
    </button>
  );
}
```

```text
useState(0)       → 声明状态，初始值 0
count             → 当前渲染用的值
setCount(新值)     → 修改并触发重渲染
[count, setCount]  → 数组解构接收（名字随你取，约定 setXxx）
```

**setCount 触发的不是"修改变量"，而是"用新值重跑整个组件函数"**——这就是 1.5 说的心智差异。

## 3.2 事件处理

```jsx
export default function Demo() {
  function handleClick(event) {
    event.preventDefault();          // 合成事件对象，用法同原生
    console.log('clicked');
  }

  return (
    <>
      {/* 函数引用（推荐） */}
      <button onClick={handleClick}>点我</button>

      {/* 箭头函数传参 */}
      <button onClick={(e) => remove(id, e)}>删除</button>

      {/* ❌ 常见错误：直接调用 = 渲染时就执行了 */}
      <button onClick={handleClick()}>错！</button>
    </>
  );
}
```

事件名小驼峰：`onClick` / `onChange` / `onSubmit` / `onKeyDown` / `onBlur`。

## 3.3 不可变更新：对象状态

**规则：永远生成新对象/新数组，绝不直接改旧值。**

```jsx
const [user, setUser] = useState({ name: 'Tom', age: 18 });

// ✅ 展开运算符生成新对象
setUser({ ...user, age: 19 });

// ✅ 嵌套对象：逐层展开
const [form, setForm] = useState({
  profile: { city: '北京' },
});
setForm({
  ...form,
  profile: { ...form.profile, city: '上海' },
});

// ❌ 直接改：React 检测不到（引用没变，可能跳过更新）
user.age = 19;
setUser(user);
```

::: info 为什么这么设计
React 靠"引用是否变化"判断要不要更新（Object.is 比较）。直接改旧对象 = 引用不变 = 系统不知道你改了。**引用比较 + 不可变更新是一对配套设计。**
:::

## 3.4 不可变更新：数组状态

JS 教程第 8 章的不可变数组方法全套适用：

```jsx
const [todos, setTodos] = useState([
  { id: 1, text: '学 useState', done: false },
]);

// 增（展开 + 新数组）
setTodos([...todos, { id: 2, text: '新任务', done: false }]);

// 删（filter）
setTodos(todos.filter(t => t.id !== id));

// 改（map + 展开替换该项）
setTodos(todos.map(t =>
  t.id === id ? { ...t, done: !t.done } : t
));
```

**push/splice/直接赋值索引 ❌**（变异原数组，引用未变）。Vue 里 push 能触发更新（Proxy 拦截），React 里不行——跨框架最容易踩的坑。

## 3.5 更新函数：基于旧值计算

新值依赖旧值时，传**函数**而不是值：

```jsx
// ❌ 直接用外层 count：多次调用会互相覆盖
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);   // 两次都基于同一个旧 count → 只加 1
}

// ✅ 更新函数：React 排队依次执行
function handleClick() {
  setCount(c => c + 1);
  setCount(c => c + 1);   // 正确加 2
}
```

**口诀：新值与旧状态有关 → 用更新函数 `setX(c => …)`；与旧值无关 → 直接传值。**

## 3.6 批处理（Batching）

一次事件处理函数里多次 setState，React 会**合并成一次渲染**：

```jsx
function handleClick() {
  setCount(c => c + 1);
  setName('Lucy');
  setActive(true);
  // 三次 setState → 一次重渲染（性能保障）
}
```

推论：setState 之后**立刻读 state 拿到的还是旧值**（渲染是异步合批的）：

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count);   // 旧值！新值在下次渲染生效
  // 确实需要"改完立刻用新值"→ 用 useEffect 监听变化（第 5 章）
}
```

## 3.7 综合练习：点赞按钮

```jsx
import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  function toggle() {
    setLiked(!liked);
    setLikes(l => (liked ? l - 1 : l + 1));   // 依赖旧值 → 更新函数
  }

  return (
    <button
      className={liked ? 'liked' : ''}
      onClick={toggle}
    >
      {liked ? '❤️ 已赞' : '🤍 点赞'} {likes}
    </button>
  );
}
```

## 本章小结

- `const [x, setX] = useState(初始值)`；setState 触发组件函数重跑
- 事件小驼峰、传函数引用不调用
- **不可变更新**：对象展开、数组 filter/map；push/splice 禁用
- 依赖旧值用更新函数 `setX(c => …)`；多次 setState 自动批处理

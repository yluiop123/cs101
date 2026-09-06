---
title: 列表与条件渲染
---

# 第 4 章 · 列表与条件渲染

**本章目标：**

- 用 map 渲染列表并理解 key 的原理
- 掌握 React 风格的条件渲染组合拳
- 实现过滤、空状态与动画过渡

## 4.1 map 渲染列表

没有 v-for——数组 `map` 成 JSX：

```jsx
const courses = [
  { id: 1, title: 'HTML', hours: 8 },
  { id: 2, title: 'CSS', hours: 10 },
  { id: 3, title: 'React', hours: 18 },
];

export default function CourseList() {
  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>
          {course.title}（{course.hours}h）
        </li>
      ))}
    </ul>
  );
}
```

map 回调返回 JSX，整个表达式就是"一组元素"——JS 对象可以自由组合的直观体现。

## 4.2 key：Diff 的身份证

React 更新时用 **Diff 算法**对比新旧两棵元素树，`key` 帮它识别"哪些元素是同一个"：

```text
[A, B, C] → 删除 B →

有 key：React 认出 A、C 没变，只移除 B      （精准）
没 key：按位置对比，状态可能错乱            （输入框内容串位）
```

与 Vue 完全一致的三条军规：

1. **key 用稳定唯一 id**，不用数组 index
2. key 只需在**兄弟之间**唯一（同一列表内），不是全局唯一
3. 数据没有 id 时可用稳定字段（标题/唯一值组合），实在没有再考虑 crypto.randomUUID() 生成时赋值

## 4.3 条件渲染全家桶

React 条件渲染就是 JS 语法本身：

```jsx
function Status({ user, items, loading }) {
  return (
    <>
      {/* ① && 短路：真才渲染（最常用） */}
      {loading && <p>加载中…</p>}

      {/* ② 三元：二选一 */}
      {user ? <Avatar user={user} /> : <LoginButton />}

      {/* ③ 提取变量：复杂条件 */}
      {statusMessage}

      {/* ④ 提前 return：整个区块不同 */}
      {empty}
    </>
  );
}
```

```jsx
// ③ 的变量版
function Profile({ user }) {
  let content;
  if (!user) content = <p>未登录</p>;
  else if (user.vip) content = <VipPanel user={user} />;
  else content = <NormalPanel user={user} />;
  return <div>{content}</div>;
}

// ④ 的提前返回版：条件决定整个组件返回什么
function EmptyOrList({ items }) {
  if (items.length === 0) {
    return <p className="empty">暂无数据</p>;   // 空状态兜底
  }
  return <ul>{items.map(...)}</ul>;
}
```

::: warning && 的数字陷阱
`{count && <Badge />}`——count 为 0 时渲染出"0"（0 是 falsy 但会被输出为文本）。写法防御：`{count > 0 && <Badge />}`。
:::

## 4.4 列表 + 条件：过滤渲染

```jsx
export default function TodoList({ todos, showDone }) {
  // 过滤逻辑与渲染分离（可读性）
  const visible = todos.filter(t => showDone || !t.done);

  return (
    <ul>
      {visible.map(t => (
        <li key={t.id} className={t.done ? 'done' : ''}>
          {t.text}
        </li>
      ))}
    </ul>
  );
}
```

更复杂时用 `useMemo` 缓存过滤结果（第 11 章性能）。

## 4.5 列表操作与不可变更新

第 3 章数组更新的列表版速查：

```jsx
const [todos, setTodos] = useState([...]);

// 添加
setTodos([...todos, newTodo]);

// 删除（filter 生成新数组）
setTodos(todos.filter(t => t.id !== id));

// 切换完成
setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

// 置顶
setTodos([todos.find(t => t.id === id), ...todos.filter(t => t.id !== id)]);
```

## 4.6 列表动画：CSS 过渡

React 没有内置 TransitionGroup，常见两种方式：

```jsx
// 方式一：纯 CSS——进出用类名控制（配合 useEffect 加类，第 5 章展开）
<li key={t.id} className={`item ${t.entering ? 'entering' : ''}`}>

// 方式二：直接给列表容器加 CSS 动画（简单场景够用）
```

```css
.item { animation: slide-in .3s ease; }
@keyframes slide-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
```

增删过渡的精细控制用 `framer-motion` 类库——先用 CSS 动画满足 80% 需求。

## 4.7 综合练习：可筛选任务列表（React 版）

```jsx
import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学 map', done: false },
    { id: 2, text: '学 key', done: true },
  ]);
  const [keyword, setKeyword] = useState('');
  const [showDone, setShowDone] = useState(true);

  const filtered = todos
    .filter(t => !keyword || t.text.includes(keyword))
    .filter(t => showDone || !t.done);

  function add(text) {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }]);
  }

  return (
    <div>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="筛选…"
      />
      <label>
        <input
          type="checkbox"
          checked={showDone}
          onChange={e => setShowDone(e.target.checked)}
        /> 显示已完成
      </label>

      {filtered.length === 0 && <p>没有匹配的任务</p>}
      <ul>
        {filtered.map(t => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() =>
                setTodos(todos.map(x => (x.id === t.id ? { ...x, done: !x.done } : x)))
              }
            />
            {t.text}
          </li>
        ))}
      </ul>
      <input
        placeholder="新增，回车确认"
        onKeyDown={e => e.key === 'Enter' && add(e.target.value)}
      />
    </div>
  );
}
```

对照 Vue 第 7 章同款：过滤逻辑从 computed 变成普通变量（每次渲染重算）、v-for 变 map、v-model 变 value+onChange——**思路同构，语法各表**。

## 本章小结

- map 渲染列表；key 用稳定 id（不用 index），帮 Diff 精准复用
- 条件渲染 = JS：`&&`、三元、变量、提前 return；防 `0 &&` 陷阱
- 列表更新全走不可变（filter/map/展开）
- 过滤逻辑与渲染分离，复杂时 useMemo

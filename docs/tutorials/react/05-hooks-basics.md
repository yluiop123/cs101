---
title: Hooks 入门：useState 与 useEffect
---

# 第 5 章 · Hooks 入门：useState 与 useEffect

**本章目标：**

- 建立 Hooks 的统一心智模型
- 深入 useEffect：依赖数组与清理函数
- 认识 useRef 与自定义 Hooks 的雏形

## 5.1 Hooks 是什么

Hook = "钩住" React 能力的函数，统一 `use` 前缀：

```text
useState    状态
useEffect   副作用
useRef      引用（DOM/可变值）
useContext  跨层级读值（第 6 章）
useMemo / useCallback 性能缓存（第 11 章）
自定义 Hook  逻辑复用（第 9 章）
```

**两条军规**（eslint-plugin-react-hooks 会帮你检查）：

1. 只在**组件顶层或自定义 Hook 里**调用——不能在 if/循环/普通函数里
2. 每次渲染按**相同顺序**调用——React 靠调用顺序对应状态

```jsx
// ❌ 条件里调用：顺序会变
if (isLoggedIn) {
  const [profile, setProfile] = useState(null);   // 禁止
}

// ✅ Hook 照常调用，条件放逻辑里
const [profile] = useState(null);
if (isLoggedIn) { /* 用 profile */ }
```

## 5.2 useEffect：副作用的舞台

**副作用**：渲染之外的事——请求、定时器、订阅事件、改 document.title。`useEffect(回调, 依赖数组)`：

```jsx
import { useState, useEffect } from 'react';

export default function Search() {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (!keyword) return;
    document.title = `搜索：${keyword}`;     // 副作用：改标题
  }, [keyword]);                             // 依赖数组：keyword 变了才执行
  ...
}
```

**依赖数组的三种形态**：

```jsx
useEffect(() => { … });          // 无数组：每次渲染后都执行（慎用）
useEffect(() => { … }, []);      // 空数组：仅挂载后执行一次
useEffect(() => { … }, [a, b]);  // 指定依赖：a 或 b 变化后执行
```

::: info useEffect 的执行时机
渲染完成后（浏览器画完才跑，不阻塞界面）。React 18 dev 模式 StrictMode 下会**故意执行两次**来暴露"没写清理"的问题——不是 bug，是体检。

:::

## 5.3 清理函数：借了要还

useEffect 回调**返回一个函数**，作为"卸载时执行"的清理：

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);

  return () => {                            // 清理函数
    window.removeEventListener('resize', onResize);
  };
}, []);
```

清理的触发时机：组件卸载时 + **下次 effect 执行前**——所以"每次变化的 effect"自动做到"先清旧的再上新的"：

```jsx
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);   // keyword 变化或卸载时都清理
}, [keyword]);
```

**原则：effect 里 addEventListener/setInterval/订阅了什么，清理函数里就 remove/clear/退订什么**——与 Vue 的 mounted/unmounted 配对同一纪律。

## 5.4 请求的effect

```jsx
function CourseDetail({ id }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;                       // 竞态标记
    setLoading(true);

    fetch(`/api/courses/${id}`)
      .then(res => res.json())
      .then(data => { if (!ignore) setCourse(data); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };          // id 变了：旧请求结果作废
  }, [id]);
  ...
}
```

`ignore` 标记解决**竞态**（race condition）：快速切换 id 时，慢的旧请求不能覆盖新请求的结果——异步数据请求的必修细节。

## 5.5 useRef：不触发渲染的"盒子"

```jsx
import { useRef, useEffect } from 'react';

export default function FocusForm() {
  const inputRef = useRef(null);            // 盒子，初始 null

  useEffect(() => {
    inputRef.current.focus();               // .current 拿真实 DOM
  }, []);

  return <input ref={inputRef} placeholder="自动聚焦" />;
}
```

ref 与 state 的分工：

```text
state：变化要"反映到界面" → useState
值：变化不需要界面刷新（计时器 id、上一次值缓存） → useRef
```

```jsx
const timerRef = useRef(null);     // 存定时器 id：改它不触发渲染
timerRef.current = setInterval(tick, 1000);
```

## 5.6 自定义 Hook 雏形

把 useEffect 模式抽成函数（命名 use 开头）就是自定义 Hook：

```jsx
// src/hooks/useWindowWidth.js
import { useState, useEffect } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
```

```jsx
// 任何组件一行接入
const width = useWindowWidth();
```

与 Vue 组合式函数（第 9 章）完全同构——**两框架在"逻辑复用"上殊途同归**。第 9 章系统展开。

## 5.7 综合练习：自动聚焦搜索框 + 标题同步

```jsx
import { useState, useEffect, useRef } from 'react';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);

  // 挂载后聚焦
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // keyword 变化同步标题（防抖可后续用 useDebounce Hook）
  useEffect(() => {
    document.title = keyword ? `搜索：${keyword}` : 'CS101';
  }, [keyword]);

  return (
    <input
      ref={inputRef}
      value={keyword}
      onChange={e => setKeyword(e.target.value)}
      placeholder="搜索…"
    />
  );
}
```

## 本章小结

- Hooks 只在顶层按序调用（两条军规）
- useEffect：依赖数组三形态（每次/一次/指定）；返回清理函数"借还配对"
- 请求 effect 要处理竞态（ignore 标记）；StrictMode 双跑是体检
- state 管界面相关值，useRef 存不影响渲染的值
- 自定义 Hook = useEffect 模式的抽取，与 Vue 组合式函数同构

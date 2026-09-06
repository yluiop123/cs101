---
title: 性能优化
---

# 第 11 章 · 性能优化

**本章目标：**

- 建立"先测量再优化"的流程意识
- 掌握 memo/useMemo/useCallback 三件套
- 学会懒加载与列表虚拟化的应用场景

## 11.1 React 的性能模型

React 渲染分两步：

```text
Render   执行组件函数，算出新 JSX（可能很贵）
Commit   Diff 对比，更新真实 DOM（精确）
```

组件函数**整体重跑**是默认行为（第 1 章 1.5）——多数情况这足够快，但以下信号出现才需要优化：

```text
① Profiler 显示某组件渲染耗时明显
② 输入卡顿：每次键入触发整棵大树重渲染
③ 列表成百上千项，交互明显掉帧
```

::: tip 先测量再动手
React DevTools 的 **Profiler** 面板录制交互，看每个组件渲染次数与耗时。没有数据支撑的 memo 化是"负优化"（缓存本身也有成本）。
:::

## 11.2 useMemo：缓存计算结果

```jsx
import { useMemo } from 'react';

function Dashboard({ todos, filter }) {
  // todos/filter 不变时，直接用上次算的结果
  const filtered = useMemo(
    () => todos.filter(t => !filter || t.text.includes(filter)),
    [todos, filter]
  );

  const stats = useMemo(
    () => ({
      total: todos.length,
      done: todos.filter(t => t.done).length,
    }),
    [todos]
  );
  ...
}
```

该用的信号：**计算昂贵**（大数组排序/聚合）**且**重算频繁。普通小计算不需要——缓存本身也有开销。

## 11.3 useCallback：缓存函数引用

组件重跑时，函数字面量会**重新创建**（引用变化）：

```jsx
// 每次渲染 handleClick 都是新函数（引用不同）
<button onClick={() => remove(id)}>删</button>
```

这影响两类场景：函数作为 props 传给 `memo` 子组件、作为 useEffect 依赖。`useCallback` 锁住引用：

```jsx
import { useCallback } from 'react';

const remove = useCallback((id) => {
  setTodos(prev => prev.filter(t => t.id !== id));   // 用更新函数，依赖干净
}, []);                                              // 依赖空数组：函数永远同一引用
```

## 11.4 memo：组件级缓存

`memo()` 包裹的组件：**props 没变（浅比较）就跳过重渲染**：

```jsx
import { memo } from 'react';

// 重渲染很贵的子组件（大列表项、图表）
const ExpensiveRow = memo(function ExpensiveRow({ todo, onToggle }) {
  return <li onClick={() => onToggle(todo.id)}>{todo.text}</li>;
});

// 父组件输入框打字时：todos 与 onToggle 引用不变 → 行组件全部跳过渲染
```

**配套纪律**：memo 的子组件收到的函数 props 必须是 useCallback 的（否则引用每次变，memo 白包）——三件套是一套组合拳：

```text
useMemo    缓存计算值
useCallback 缓存函数引用（通常为了配合 memo / 依赖）
memo       组件 props 未变则跳过渲染
```

::: warning 不必全员 memo
memo + useCallback 有代码噪音成本。**只对"渲染昂贵 + 父组件高频更新"的组件使用**——这是 Profiler 数据告诉你的，不是直觉。

:::

## 11.5 懒加载与代码分割

路由级懒加载（第 7 章）是最大杠杆；组件级同理：

```jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('@/components/HeavyChart.jsx'));

function Dashboard({ showChart }) {
  return (
    <>
      {showChart && (
        <Suspense fallback={<p>图表加载中…</p>}>
          <HeavyChart data={data} />
        </Suspense>
      )}
    </>
  );
}
```

重型库按需导入：

```jsx
// ❌ 全量
import _ from 'lodash';

// ✅ 按需（ESM 保证 Tree-Shaking，见 Vite 教程第 5 章）
import debounce from 'lodash-es/debounce';
```

## 11.6 长列表虚拟化

千条以上的列表只渲染可视区——**虚拟化（virtualization）**：

```bash
npm install @tanstack/react-virtual
```

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function BigList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,          // 每行高度
  });

  return (
    <div ref={parentRef} style={{ height: 480, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(row => (
          <div
            key={items[row.index].id}
            style={{
              position: 'absolute',
              top: row.start,
              height: row.size,
              width: '100%',
            }}
          >
            {items[row.index].text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

只渲染可视区 + 缓冲区的十几行——DOM 数量恒定，万条列表丝滑滚动。**超过 ~200 条的常驻列表**才值得上。

## 11.7 优化检查单

```text
□ Profiler 录制确认瓶颈（没有数据不动手）
□ 大计算 → useMemo；配合 memo 的回调 → useCallback
□ 渲染昂贵 + 高频更新的子组件 → memo
□ 路由/重型组件 → lazy + Suspense
□ 库按需导入（lodash-es、图标库）
□ 长列表 → 虚拟化
□ 图片 loading="lazy"（Vite 教程第 5 章）
```

## 本章小结

- 先 Profiler 后优化；渲染贵在组件函数重跑
- useMemo/useCallback/memo 三件套配套使用，只用在确认的瓶颈处
- 懒加载与按需导入是"无脑正确"的优化
- 虚拟化解决超长列表；普通列表别上

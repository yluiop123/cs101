---
title: 综合实战
---

# 第 12 章 · 综合实战

**本章目标：**

- 综合运用全教程知识完成"任务看板"（React 版）
- 沉淀 React 项目的工程化规范
- 对比 Vue 版实现，巩固两框架的异同

## 12.1 项目结构与规范

```text
src/
├── api/            # 请求层（纯函数）
├── components/     # 通用组件
├── hooks/          # 自定义 Hooks
├── stores/         # Zustand store
├── views/          # 页面组件
├── App.jsx
└── main.jsx
```

命名约定：

```text
组件文件   PascalCase    TaskCard.jsx
Hooks      use 前缀      useLocalStorage.js
store      useXxxStore   useBoardStore（文件 board.js）
```

与 Vue 版（[Vue 教程第 12 章](/tutorials/vue/)）完全同构的看板需求，用 React 语法重写一遍——**这是检验两套心智是否都建立的最好方式**。

## 12.2 store：看板数据层

```js
// src/stores/board.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

let nextId = 1;

export const useBoardStore = create(
  persist(
    (set, get) => ({
      columns: [
        { key: 'todo', title: '待办', tasks: [] },
        { key: 'doing', title: '进行中', tasks: [] },
        { key: 'done', title: '已完成', tasks: [] },
      ],

      addTask(columnKey, text) {
        if (!text.trim()) return;
        set((state) => ({
          columns: state.columns.map((col) =>
            col.key === columnKey
              ? { ...col, tasks: [...col.tasks, { id: nextId++, text: text.trim() }] }
              : col
          ),
        }));
      },

      removeTask(taskId) {
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            tasks: col.tasks.filter((t) => t.id !== taskId),
          })),
        }));
      },

      moveTask(taskId, toKey) {
        let task = null;
        get().columns.forEach((col) => {
          const found = col.tasks.find((t) => t.id === taskId);
          if (found) task = found;
        });
        if (!task) return;

        get().removeTask(taskId);
        set((state) => ({
          columns: state.columns.map((col) =>
            col.key === toKey
              ? { ...col, tasks: [...col.tasks, task] }
              : col
          ),
        }));
      },
    }),
    { name: 'cs101-react-board' }    // persist：刷新不丢数据
  )
);
```

对照 Vue 版：Pinia 的 ref 数组直接 push/filter，这里**全程不可变更新**（map/filter/展开）——两框架的核心差异浓缩在这一个文件里。

## 12.3 组件：泳道与卡片

```jsx
// components/TaskCard.jsx
export default function TaskCard({ task, onRemove, onDragStart }) {
  return (
    <div
      className="task"
      draggable
      onDragStart={() => onDragStart(task.id)}
    >
      <span>{task.text}</span>
      <button className="del" onClick={() => onRemove(task.id)}>✕</button>
    </div>
  );
}
```

```jsx
// components/TaskColumn.jsx
import TaskCard from './TaskCard.jsx';

export default function TaskColumn({ column, onAdd, onRemove, onDragStart, onDrop }) {
  function handleAdd(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    onAdd(column.key, input.value);
    input.value = '';
  }

  return (
    <section
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onDrop(column.key); }}
    >
      <header>
        <h3>{column.title}</h3>
        <span className="count">{column.tasks.length}</span>
      </header>

      {column.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onRemove={onRemove}
          onDragStart={onDragStart}
        />
      ))}
      {column.tasks.length === 0 && <p className="empty">拖拽卡片到这里</p>}

      <form onSubmit={handleAdd}>
        <input placeholder="新任务…" />
        <button type="submit">添加</button>
      </form>
    </section>
  );
}
```

## 12.4 页面：组装

```jsx
// views/BoardView.jsx
import { useRef } from 'react';
import TaskColumn from '@/components/TaskColumn.jsx';
import { useBoardStore } from '@/stores/board';

export default function BoardView() {
  const board = useBoardStore();
  const draggingId = useRef(null);        // 拖拽中转：不影响渲染 → useRef

  function handleDrop(toKey) {
    if (draggingId.current !== null) {
      board.moveTask(draggingId.current, toKey);
      draggingId.current = null;
    }
  }

  const total = board.columns.reduce((n, col) => n + col.tasks.length, 0);

  return (
    <div className="board">
      {board.columns.map((col) => (
        <TaskColumn
          key={col.key}
          column={col}
          onAdd={board.addTask}
          onRemove={board.removeTask}
          onDragStart={(id) => { draggingId.current = id; }}
          onDrop={handleDrop}
        />
      ))}
      <p className="total">共 {total} 个任务</p>
    </div>
  );
}
```

```css
/* BoardView.css（全局或 module 均可） */
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; }
.column { background: #f1f5f9; border-radius: 8px; padding: 12px; min-height: 300px; }
.task { display: flex; justify-content: space-between; align-items: center;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
        padding: 8px 10px; margin-bottom: 8px; cursor: grab; }
.empty { color: #94a3b8; font-size: 13px; text-align: center; padding: 24px 0; }
```

原生拖拽三要素与 Vue 版完全一致：draggable / dragover.prevent / drop.prevent；"拖了谁"用 useRef 中转（不触发渲染）。

## 12.5 Vue vs React 实现对照表

| 关注点 | Vue 版 | React 版 |
| --- | --- | --- |
| 全局状态 | Pinia（ref 可变） | Zustand（set 不可变） |
| 持久化 | useLocalStorage + watch | persist 中间件 |
| 组件通信 | emit | 回调 props |
| 条件渲染 | v-if | && / 三元 |
| 列表 | v-for + :key | map + key |
| 拖拽中转 | 页面临时变量 | useRef |
| 样式 | scoped CSS | CSS Modules / Tailwind |

**思路同构、语法各表**——能流畅互译，说明两套心智都已建立。

## 12.6 扩展练习

- 加"编辑任务"：双击卡片变输入框（受控组件 + 状态切换）
- 加泳道折叠：列标题点击收起（条件渲染）
- 接真实后端：[Node.js 教程第 10 章](/tutorials/nodejs/)的 REST API + api 层改造
- 性能体检：Profiler 录制拖拽，若卡顿按第 11 章流程优化

## 12.7 React 项目自查清单

- [ ] 状态分层清晰：组件 state / Zustand 全局 / props 下行回调上行
- [ ] 列表 key 稳定唯一（不用 index）
- [ ] 不可变更新贯穿（无 push/splice/直接改）
- [ ] useEffect 依赖数组准确，清理函数成对
- [ ] 请求层纯函数化，组件内三态机完整
- [ ] 优化有 Profiler 数据支撑
- [ ] build 通过、控制台无警告

## 12.8 下一步

React 主线毕业。第三框架：

- [Angular 教程](/tutorials/angular/)：完全不同的组织哲学（依赖注入、RxJS），补全三大框架视野

## 本章小结

- Zustand persist 一行持久化；store 里全程不可变更新
- 拖拽三要素 + useRef 中转；页面只做组装
- Vue/React 实现对照：思路同构、语法各表——互译能力是双修的标志
- 自查清单收尾，Profiler 验证性能

---
title: 综合实战
---

# 第 10 章 · 综合实战

**本章目标：**

- 用 TS 从零重写待办清单（JS 教程第 14 章同款项目）
- 覆盖接口建模、模块拆分与 DOM 类型
- 体验"类型先于实现"的开发流

## 10.1 项目结构与目标

```text
ts-todo/
├── index.html
├── tsconfig.json
└── src/
    ├── types.ts        # 数据模型（先写！）
    ├── storage.ts      # 持久化（泛型封装）
    ├── todoService.ts  # 业务逻辑
    ├── ui.ts           # 渲染与 DOM
    └── main.ts         # 入口
```

开发顺序：**types → storage → service → ui → main**——"先定形状，再填实现"，类型设计先行是 TS 项目的标准节奏。

## 10.2 第一步：types.ts（数据建模）

```ts
// src/types.ts —— 全项目的类型中心
export interface Todo {
  readonly id: number;
  text: string;
  done: boolean;
}

export type TodoFilter = 'all' | 'active' | 'done';

export interface TodoService {
  getAll(): Todo[];
  add(text: string): Todo | null;
  toggle(id: number): void;
  remove(id: number): void;
  getByFilter(filter: TodoFilter): Todo[];
}
```

先写接口的好处：ui/main 可以**对着蓝图开发**（哪怕实现还没写完，编辑器已能提示）。

## 10.3 第二步：storage.ts（泛型持久化）

```ts
// src/storage.ts
export function createJSONStore<T>(key: string) {
  const load = (): T | null => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;               // 数据损坏优雅降级
    }
  };

  const save = (value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { load, save };
}
```

## 10.4 第三步：todoService.ts（业务层）

```ts
// src/todoService.ts
import type { Todo, TodoFilter } from './types';
import { createJSONStore } from './storage';

const store = createJSONStore<Todo[]>('cs101-todos');

let todos: Todo[] = store.load() ?? [];

function persist(): Todo[] {
  store.save(todos);
  return todos;
}

export const todoService = {
  getAll(): Todo[] {
    return todos;
  },

  add(text: string): Todo | null {
    const trimmed = text.trim();
    if (!trimmed) return null;                    // 无效输入返回 null（类型已表达）
    const todo: Todo = { id: Date.now(), text: trimmed, done: false };
    todos = [...todos, todo];
    return persist(), todo;
  },

  toggle(id: number): void {
    todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    persist();
  },

  remove(id: number): void {
    todos = todos.filter((t) => t.id !== id);
    persist();
  },

  getByFilter(filter: TodoFilter): Todo[] {
    switch (filter) {
      case 'all':    return todos;
      case 'active': return todos.filter((t) => !t.done);
      case 'done':   return todos.filter((t) => t.done);
    }
  },
};
```

对照 JS 版：逻辑完全一致，但 `text.trim()` 的"非空检查"、`switch` 的穷尽性全部有编译器背书。

## 10.5 第四步：ui.ts（DOM 层的类型）

```ts
// src/ui.ts
import { todoService } from './todoService';
import type { TodoFilter } from './types';

// DOM 元素类型：HTMLElement / HTMLInputElement / HTMLUListElement …
const form = document.querySelector<HTMLFormElement>('#todo-form');
const list = document.querySelector<HTMLUListElement>('#todo-list');
const input = form?.querySelector<HTMLInputElement>('input');
const count = document.querySelector<HTMLElement>('#count');

if (!form || !list || !input || !count) {
  throw new Error('页面结构不完整');    // 非空断言的"正规替代"：集中检查一次
}

let filter: TodoFilter = 'all';

function render(): void {
  const todos = todoService.getByFilter(filter);
  list!.innerHTML = todos
    .map(
      (t) => `
      <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
        <span>${t.text}</span>
        <button class="del" data-id="${t.id}">×</button>
      </li>`
    )
    .join('');
  count.textContent = `未完成 ${todos.filter((t) => !t.done).length} 项`;
}

export function initUI(): void {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    todoService.add(input.value);
    input.value = '';
    render();
  });

  list.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;       // 事件目标收窄
    const li = target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);             // dataset 是 string，转 number
    if (target.classList.contains('del')) {
      todoService.remove(id);
    } else {
      todoService.toggle(id);
    }
    render();
  });

  render();
}
```

::: tip DOM 类型的三个要点
1. `querySelector<T>` 泛型直接声明元素类型（不再手写 as 断言链）
2. 查询结果可能是 null——开头**集中判空抛错**，后面放心用
3. `dataset.id` 永远是 string，`Number()` 转换处 TS 会提醒类型不匹配
:::

## 10.6 第五步：main.ts（入口）

```ts
// src/main.ts
import { initUI } from './ui';

initUI();
console.log('TS Todo 已启动');
```

## 10.7 HTML 与运行

```html
<!-- index.html -->
<body>
  <h1>TS 待办清单</h1>
  <form id="todo-form">
    <input type="text" placeholder="要做点什么…" />
    <button type="submit">添加</button>
  </form>
  <ul id="todo-list"></ul>
  <p id="count"></p>
  <script type="module" src="./src/main.ts"></script>
</body>
```

用 Vite 一键运行（无需手动编译）：

```bash
pnpm create vite ts-todo --template vanilla-ts
cd ts-todo && pnpm install && pnpm dev
```

## 10.8 体检：让类型检查说话

```bash
npx tsc --noEmit
```

故意制造两个实验：

```ts
todoService.add(42);            // ❌ 参数类型拦截
todoService.toggle('1');        // ❌ string 不能赋给 number
```

JS 版这两处都只能靠运行时崩掉才暴露——这就是 TS 教程的价值浓缩。

## 10.9 下一步

TS 之旅毕业。它不是新语言，而是 JS 的"类型护栏 + 提示放大器"：

- 框架实战：[Vue 3 教程](/tutorials/vue/)（组合式 API 的 TS 写法）或 [React 教程](/tutorials/react/)
- 样式方案：[Tailwind CSS 教程](/tutorials/tailwind/)
- 构建内幕：[Vite 教程](/tutorials/vite/)

## 本章小结

- 开发节奏：types → storage → service → ui → main，类型设计先行
- DOM 类型：`querySelector<T>` 泛型、集中判空、dataset 转 number
- Vite vanilla-ts 模板即开即用；`tsc --noEmit` 做全量体检
- 类型安全的收益在重构与联调时指数放大

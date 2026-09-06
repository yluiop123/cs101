---
title: 状态管理：Zustand
---

# 第 8 章 · 状态管理：Zustand

**本章目标：**

- 理解 Zustand 的"极简 store"哲学
- 掌握 create 定义 store 与组件订阅
- 学会持久化中间件与 store 组合

## 8.1 为什么是 Zustand

状态提升会让父组件变厚；Context 滥用会引发大范围重渲染。**Zustand**（德语"状态"）用最小的 API 提供"组件外的全局状态"：

```text
Redux：模板代码多（action/reducer/dispatch），大型项目可控
Zustand：一个 create 函数完事，体积极小，React 主流轻量首选
```

与 Pinia 的对照：同样是"组件外的响应式单例 store"，Zustand 更赤裸（不依赖 Provider、直接 import 使用）。

## 8.2 安装与定义 store

```bash
npm install zustand
```

```js
// src/stores/counter.js
import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  // state
  count: 0,

  // action：set 合并更新
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

```jsx
// 组件：直接 import 使用，无需 Provider
import { useCounterStore } from '@/stores/counter';

export default function Counter() {
  const count = useCounterStore((s) => s.count);        // 选择器订阅
  const increment = useCounterStore((s) => s.increment);

  return <button onClick={increment}>{count}</button>;
}
```

**选择器（selector）**是 Zustand 的精髓：`useCounterStore(s => s.count)` 只订阅 count——count 变了才重渲染本组件，其他状态变化与我无关（性能默认就好）。

## 8.3 set 与 get：更新的两种姿势

```js
export const useUserStore = create((set, get) => ({
  token: '',
  profile: null,
  log: [],

  // set（函数）：基于旧 state 计算（推荐，等价 React 的更新函数）
  login: (token) => set((state) => ({ token, log: [...state.log, 'login'] })),

  // set（对象）：直接覆盖
  logout: () => set({ token: '', profile: null }),

  // get：读当前最新值（不订阅，用于逻辑内部）
  isLoggedIn: () => !!get().token,
}));
```

**重要：部分更新**——`set({ a: 1 })` 只改 a，其余字段保留（自动浅合并），与 React 的 `setUser({ ...user, a: 1 })` 不同，Zustand 帮你做了合并。

## 8.4 实战 store：购物车

```js
// src/stores/cart.js
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],

  add(product) {
    const exists = get().items.find(i => i.id === product.id);
    if (exists) {
      set((state) => ({
        items: state.items.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      }));
    } else {
      set((state) => ({ items: [...state.items, { ...product, qty: 1 }] }));
    }
  },

  remove(id) {
    set((state) => ({ items: state.items.filter(i => i.id !== id) }));
  },

  clear() {
    set({ items: [] });
  },
}));
```

```jsx
// 派生值：在选择器里计算（或存为 getter 函数）
const total = useCartStore((s) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0)
);
```

::: warning 派生选择器返回新对象会过度渲染
`s => ({ a: s.a, b: s.b })` 每次都返回新对象（引用不同）→ 每次更新都重渲染。多值订阅要么分别订阅，要么用 `useShallow`（浅比较）包装。
:::

## 8.5 异步 action

action 就是普通函数，async 随便写：

```js
export const useCoursesStore = create((set) => ({
  list: [],
  loading: false,
  loaded: false,

  async fetchAll(force = false) {
    if (get().loaded && !force) return;       // 幂等：已加载不重复请求
    set({ loading: true });
    try {
      const res = await fetch('/api/courses');
      const list = await res.json();
      set({ list, loaded: true });
    } finally {
      set({ loading: false });
    }
  },
}));
```

```jsx
// 组件里
const fetchAll = useCoursesStore((s) => s.fetchAll);
useEffect(() => { fetchAll(); }, [fetchAll]);
```

多个页面调用 fetchAll 也只请求一次——`loaded` 幂等模式（与 Pinia 版思路一致）。

## 8.6 持久化中间件

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: (p) => { /* ... */ },
    }),
    {
      name: 'cs101-cart',        // localStorage 的 key
      // partialize: (s) => ({ items: s.items }),  // 只持久化部分字段
    }
  )
);
```

一行 `persist` 包装——store 变化自动写 localStorage、启动时自动恢复。**刷新页面购物车还在**，零额外代码。

## 8.7 store 之间协作

```js
// 在 action 里直接调用其他 store 的 hook
import { useUserStore } from './user';

export const useCartStore = create((set, get) => ({
  async checkout() {
    const user = useUserStore.getState();    // 非组件环境取值
    if (!user.token) throw new Error('请先登录');
    await checkoutApi(get().items, user.token);
    set({ items: [] });
  },
}));
```

```text
组件内：useXxxStore()              （hook，订阅）
action 内：useXxxStore.getState()  （取瞬时值，不订阅）
```

## 8.8 综合练习：全站通知队列

```js
// src/stores/toast.js
import { create } from 'zustand';

let nextId = 1;

export const useToastStore = create((set) => ({
  toasts: [],

  push(message, type = 'info') {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
}));
```

```jsx
// 任何组件：一行发通知
const push = useToastStore((s) => s.push);
push('保存成功', 'success');

// 全局通知组件（挂在 App 顶层）
function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="toasts">
      {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}
    </div>
  );
}
```

通知这种"任意组件触发、全局展示"的场景，正是 store 的甜蜜点。

## 本章小结

- `create((set, get) => ({ state, action }))`；组件里选择器订阅
- set 函数式更新（自动浅合并）；异步 action 直接 async
- persist 中间件一行持久化；getState() 在非组件环境取值
- 选择器订阅是性能核心；多字段用 useShallow

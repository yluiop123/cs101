---
title: 泛型
---

# 第 6 章 · 泛型

**本章目标：**

- 理解泛型（generics）解决的"类型参数化"问题
- 掌握泛型函数/接口/约束的写法
- 熟练使用常用工具类型（Utility Types）

## 6.1 泛型解决什么问题

不用泛型，"相同逻辑、不同类型"只能二选一：

```ts
// 方案 A：写死类型 —— 复用性差
function firstNumber(arr: number[]): number {
  return arr[0];
}

// 方案 B：any —— 丢失类型
function firstAny(arr: any[]): any {
  return arr[0];     // 返回 any：调用方失去所有提示
}

// 方案 C：泛型 —— 逻辑复用 + 类型保留
function first<T>(arr: T[]): T {
  return arr[0];
}
const n = first([1, 2, 3]);      // n: number（自动推断）
const s = first(['a', 'b']);     // s: string
```

泛型（generics）= **类型的形参**。调用时"传"入具体类型，逻辑模板一份，类型按需生成。

::: tip 心智模型
`function first<T>(arr: T[]): T` 读作："对于任意类型 T，接收 T 数组，返回 T"。调用时 TS 从实参**推断** T 是什么——大多数时候不用手写 `<number>`。

:::

## 6.2 泛型函数：推断与显式指定

```ts
function identity<T>(value: T): T {
  return value;
}

const a = identity('hello');    // T 推断为 string
const b = identity(42);         // T 推断为 number
const c = identity<string>('x'); // 显式指定（一般不需要）

// 多个类型参数
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}
const p = pair('age', 18);      // [string, number]
```

## 6.3 泛型约束：extends 限定范围

```ts
// 约束：T 必须有 length 属性
function logLength<T extends { length: number }>(item: T): number {
  return item.length;
}
logLength('hello');    // ✅ string 有 length
logLength([1, 2]);     // ✅ 数组有 length
logLength(42);         // ❌ number 没有 length

// keyof 约束：K 必须是 T 的键名之一
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: 'Tom', age: 18 };
getProp(user, 'name');    // ✅ 返回类型 string（T[K] 精确对应）
getProp(user, 'weight');  // ❌ 'weight' 不是 user 的键
```

`T[K]` 的返回类型是**精确的**——取 name 得 string，取 age 得 number。这就是"索引访问类型"的威力。

## 6.4 泛型接口与泛型类型

```ts
// 泛型接口：响应结构的标准建模
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 用的时候"填空"
type UserResponse = ApiResponse<{ name: string }>;
type TodosResponse = ApiResponse<Todo[]>;

const res: ApiResponse<Todo[]> = {
  code: 0,
  data: [{ id: 1, text: '学泛型', done: false }],
  message: 'ok',
};
```

```ts
// 泛型约束的实战模板：状态机（第 5 章可辨识联合 + 泛型）
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

const userState: AsyncState<User> = { status: 'loading' };
```

## 6.5 泛型默认值

```ts
interface Paginated<T = unknown> {
  list: T[];
  total: number;
}

const anyPage: Paginated = { list: [], total: 0 };       // T = unknown
const userPage: Paginated<User> = { list: [], total: 0 }; // 显式指定
```

## 6.6 常用工具类型（Utility Types）

TS 内置了一批泛型工具，日常使用率极高：

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// Partial<T>：全部属性变可选（"部分更新"场景）
function update(id: number, patch: Partial<User>) { /* ... */ }
update(1, { name: 'Lucy' });   // 只传要改的

// Pick<T, K>：挑选部分属性
type UserBrief = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K>：剔除部分属性
type UserNoEmail = Omit<User, 'email'>;

// Record<K, T>：键值字典
type UserMap = Record<string, User>;
const map: UserMap = {
  u1: { id: 1, name: 'Tom', email: 't@x.com' },
};

// Readonly<T>：全部只读
const frozen: Readonly<User> = { id: 1, name: 'Tom', email: 't@x.com' };

// ReturnType<T>：取函数返回类型
function create() { return { ok: true, data: 42 }; }
type CreateResult = ReturnType<typeof create>;   // { ok: boolean; data: number }
```

::: tip 记忆锚点
Partial/Pick/Omit/Record/Readonly 五个覆盖 80% 日常需求。本质都是"泛型 + 映射类型"——第 7 章揭示它们的实现原理。

:::

## 6.7 综合示例：泛型化的存储工具

```ts
// JS 教程第 12 章 storage 封装的 TS 版
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function createJSONStore<T>(key: string, storage: Storage = localStorage) {
  return {
    load(): T | null {
      const raw = storage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    save(value: T): void {
      storage.setItem(key, JSON.stringify(value));
    },
  };
}

interface Todo { id: number; text: string; done: boolean }
const todoStore = createJSONStore<Todo[]>('cs101-todos');
const todos = todoStore.load();   // Todo[] | null —— 调用方明确知道拿到什么
```

`createJSONStore` 一份实现，为 Todo/User/任何类型各生成一套类型安全的存取器——这就是泛型的日常价值。

## 本章小结

- 泛型 = 类型的形参：逻辑一份、类型按需生成；推断优先，显式 `<T>` 兜底
- `extends` 约束范围；`keyof` + `T[K]` 实现键名精确索引
- `ApiResponse<T>` / `AsyncState<T>` 是接口与状态建模的通用模板
- 工具类型五件套：Partial / Pick / Omit / Record / Readonly

---
title: 枚举与类型编程入门
---

# 第 7 章 · 枚举与类型编程入门

**本章目标：**

- 掌握枚举（enum）与 const 枚举的用法
- 理解映射类型与索引访问类型
- 初识条件类型（工具类型的底层原理）

## 7.1 枚举：命名的常量集合

```ts
enum Status {
  Idle,       // 0（默认从 0 自增）
  Loading,    // 1
  Done,       // 2
  Error,      // 3
}

const s: Status = Status.Loading;
s === 1;   // true —— 数字枚举
```

数字枚举支持反向映射（`Status[1] === 'Loading'`），但更推荐**字符串枚举**——可读、可调试（网络面板里看得懂）：

```ts
enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Done = 'done',
  Error = 'error',
}

function render(s: Status): string {
  switch (s) {
    case Status.Idle: return '等待';
    case Status.Loading: return '加载中…';
    case Status.Done: return '完成';
    case Status.Error: return '出错';
  }
}
```

## 7.2 更现代的选择：as const 对象

很多团队弃用 enum（有运行时产物、与 JS 生态略割裂），改用**字面量联合 + as const**：

```ts
// as const：把对象变成"全字面量只读"
export const STATUS = {
  idle: 'idle',
  loading: 'loading',
  done: 'done',
  error: 'error',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];
// 'idle' | 'loading' | 'done' | 'error'

// 纯类型方案（无运行时对象，最轻量）
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
```

::: tip 选型建议
需要"运行时对象 + 类型"双用 → as const 对象；只要类型 → 字面量联合。enum 读懂即可（存量代码大量存在）。

:::

## 7.3 索引访问类型

```ts
interface User {
  id: number;
  name: string;
  address: { city: string; street: string };
}

type UserId = User['id'];               // number
type UserAddress = User['address'];     // { city: string; street: string }
type City = User['address']['city'];    // string

// 配合 keyof：键名联合
type UserKeys = keyof User;             // 'id' | 'name' | 'address'

// 从数组取元素类型
const todos = [{ id: 1, text: 'a', done: false }];
type TodoItem = (typeof todos)[number]; // { id: number; text: string; done: boolean }
```

`typeof 变量` 把**运行时值**变成**类型**——从现有数据反推类型的高频技巧。

## 7.4 映射类型：批量生成属性

映射类型（mapped types）对类型做"循环"：

```ts
interface User {
  id: number;
  name: string;
}

// 把每个属性变 boolean
type Flags<T> = {
  [K in keyof T]: boolean;
};
type UserFlags = Flags<User>;   // { id: boolean; name: boolean }

// 加修饰符：每个属性只读
type Frozen<T> = {
  readonly [K in keyof T]: T[K];
};

// 去掉修饰符：-readonly
type Editable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

`[K in keyof T]` = "遍历 T 的每个键"；`T[K]` = 取对应值的类型——与 JS 的 for...in 语法神似，好记。

## 7.5 条件类型：类型层面的三元

条件类型（conditional types）：**类型依赖另一个类型做判断**：

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>;   // true
type B = IsString<42>;        // false

// 结合 infer：从类型中"抽取"信息
type ElementType<T> = T extends Array<infer E> ? E : never;

type E1 = ElementType<string[]>;    // string
type E2 = ElementType<number[]>;    // number
type E3 = ElementType<string>;      // never（不是数组）
```

`infer E` 在模式匹配中"捕获"数组元素类型——工具类型的实现基石。

### 分布式条件类型：官方工具的实现

```ts
// Partial 的真实原理：映射 + ?
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Omit 的原理：Exclude 排除键 + Pick 选键
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
type UserNoName = MyOmit<User, 'name'>;
```

第 6 章用的工具类型，全都是"映射 + 条件 + infer"的组合——你已经能读懂它们了。

## 7.6 综合示例：可配置的表单校验器

```ts
type Rule<T> = {
  [K in keyof T]?: (value: T[K], all: T) => string | null;
};

function validate<T>(data: T, rules: Rule<T>): string[] {
  const errors: string[] = [];
  for (const key in rules) {
    const rule = rules[key];
    if (!rule) continue;
    const msg = rule(data[key], data);
    if (msg) errors.push(msg);
  }
  return errors;
}

interface Signup {
  name: string;
  age: number;
}

const errors = validate<Signup>(
  { name: '', age: 15 },
  {
    name: (v) => (v.length >= 2 ? null : '姓名至少 2 字'),
    age: (v) => (v >= 18 ? null : '未满 18 岁'),
  }
);
// errors: ['姓名至少 2 字', '未满 18 岁']

// 类型亮点：rule 回调的 value 自动是 string / number——不用 any！
```

映射类型让"校验规则与数据字段一一对应"有了编译期保障：字段改名，规则处立即标红。

## 本章小结

- 字符串枚举可读优先；新代码可选 as const + 字面量联合
- `typeof 值` 从运行时反推类型；`T['key']` 索引访问取成员类型
- 映射类型 `[K in keyof T]` 批量变形；条件类型 `extends ? :` + infer 抽取
- 工具类型的原理 = 映射 + 条件的组合，你已能自己实现

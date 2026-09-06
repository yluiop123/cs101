---
title: 接口与类型别名
---

# 第 3 章 · 接口与类型别名

**本章目标：**

- 用 interface / type 给结构命名，消除重复标注
- 掌握可选、只读、索引签名与扩展
- 分清 interface 与 type 的使用场景

## 3.1 interface：结构的契约

接口（interface）给"对象长什么样"起个名字：

```ts
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// 复用：一处声明，处处引用
const todo: Todo = { id: 1, text: '学 TS', done: false };
const list: Todo[] = [todo];

function addTodo(item: Todo): Todo[] {
  return [...list, item];
}
```

对比第 2 章：同样的结构只写一次——这就是类型可读性与可维护性的分水岭。

## 3.2 可选、只读与只读数组

```ts
interface User {
  readonly id: number;      // 创建后不可改
  name: string;
  email?: string;           // 可选：可以没有
  tags?: string[];
}

const u: User = { id: 1, name: 'Tom' };   // email 省略合法
u.id = 2;                                  // ❌ 只读
```

```ts
// 只读数组：内容不可变
const fixed: readonly number[] = [1, 2, 3];
fixed.push(4);   // ❌ Property 'push' does not exist on type 'readonly number[]'
```

## 3.3 方法与索引签名

```ts
interface Counter {
  value: number;
  increment(): void;                 // 方法签名
}

// 索引签名：任意字符串键，值有统一类型（描述"字典"）
interface Dictionary {
  [key: string]: string;
}
const dict: Dictionary = {
  title: '标题',
  author: '作者',
};
dict.anything = '任意字符串键都是 string 值';
```

## 3.4 扩展：interface 的继承

```ts
interface Animal {
  name: string;
  eat(): void;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: '旺财',
  breed: '柴犬',
  eat() { console.log('吃狗粮'); },
};
```

`extends` 复用已有结构——修改 Animal 时所有继承它的类型自动跟进。

## 3.5 type：类型别名

类型别名（type alias）用 `type` 给**任何类型**起名——不只是对象：

```ts
// 基本类型别名
type ID = number | string;
type Nullable<T> = T | null;

// 对象类型
type User2 = {
  name: string;
  age: number;
};

// 联合类型（第 5 章主角，type 是唯一选择）
type Status = 'idle' | 'loading' | 'done' | 'error';

// 元组
type Point = [number, number];

// 函数类型
type Calc = (a: number, b: number) => number;
const add: Calc = (a, b) => a + b;
```

## 3.6 type 的交叉与扩展

```ts
interface A {
  name: string;
}

type B = A & { age: number };        // 交叉（&）：合并两个类型
const b: B = { name: 'Tom', age: 18 };

// type 也能"继承"对象类型（等价写法）
type C = {
  ...不行——type 不支持 extends，但可以用 & 达成同样效果
};
```

## 3.7 interface vs type：怎么选

| 能力 | interface | type |
| --- | --- | --- |
| 描述对象 | ✅ | ✅ |
| 描述联合/元组/函数/基本类型 | ❌ | ✅ |
| extends 继承 | ✅（声明合并友好） | ❌（用 & 交叉） |
| 同名合并（declaration merging） | ✅ 自动合并 | ❌ 报重复定义 |

```ts
// interface 同名自动合并（第三方库扩展场景有用）
interface Window {
  myGlobal: string;
}
interface Window {   // 再写一次，两份自动合并
  another: number;
}
```

::: tip 团队约定建议
**对象结构用 interface，其余（联合/别名/工具）用 type**——本教程后续遵循此约定。两者能力差异在 90% 场景中无感，一致性比选择本身更重要。

:::

## 3.8 综合示例：重构待办数据模型

```ts
// 第 2 章重复的两次标注，收敛为一组接口
interface Todo {
  readonly id: number;
  text: string;
  done: boolean;
  createdAt?: number;     // 可选：老数据可能没有
}

type TodoFilter = 'all' | 'active' | 'done';

interface TodoService {
  getAll(): Todo[];
  add(text: string): Todo;
  toggle(id: number): void;
  remove(id: number): void;
  getByFilter(filter: TodoFilter): Todo[];
}
```

`TodoService` 就是第 14 章 JS 版 todoService.js 的"类型蓝图"——第 10 章实战会按它实现。

## 本章小结

- interface 命名对象结构，消除重复标注；readonly/`?` 控制属性
- type 能给一切类型起名，联合/元组/函数类型是它的专属领域
- 对象用 interface、其他用 type；同名合并是 interface 的独门能力
- 结构化类型下，两者描述的"形状"等价时可互换

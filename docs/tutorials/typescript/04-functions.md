---
title: 函数与类型
---

# 第 4 章 · 函数与类型

**本章目标：**

- 掌握函数的类型标注全貌（参数/返回值/表达式）
- 理解可选参数、默认参数与 rest 参数的类型
- 初识重载与 this 类型问题

## 4.1 函数类型的完整标注

```ts
// 函数声明：参数必须标注，返回值建议标注
function add(a: number, b: number): number {
  return a + b;
}

// 函数表达式：两处可标
const multiply = (a: number, b: number): number => a * b;

// 用"函数类型"整体描述（配合 type，见第 3 章）
type Calc = (a: number, b: number) => number;
const divide: Calc = (a, b) => a / b;   // 参数类型自动带出（上下文推断）
```

::: tip 返回值类型能推断
`function add(a: number, b: number)` 不写返回值也 OK（推断为 number）。但**显式写返回值**有两个好处：意图文档化 + 防止实现改动悄悄改变了返回类型。公共 API 函数建议写。
:::

## 4.2 可选参数与默认参数

```ts
// 可选参数：? 表示可以不传（类型自动带 undefined）
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}
greet('Tom');            // 'Tom'
greet('Tom', 'Dr.');     // 'Dr. Tom'

// 默认参数：有默认值即自动"可选"，类型同默认值
function power(base: number, exponent: number = 2): number {
  return base ** exponent;
}
```

::: warning 可选参数必须放后面
`function f(a?: string, b: number)` ❌——可选参数之后不能有必选参数。rest 参数同理放最后。

:::

## 4.3 rest 参数与元组

```ts
// rest：收集为一个数组
function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3);   // 6

// 元组 rest：位置约束更强
function logInfo(level: string, ...parts: [string, number]): void {
  console.log(level, parts[0].toUpperCase(), parts[1]);
}
```

## 4.4 void 返回值的箭头函数陷阱

```ts
type Handler = (e: Event) => void;

// 处理函数返回了值也能赋给 void 类型（TS 特意允许）
const handler: Handler = (e) => {
  console.log(e.type);
  return 42;    // ✅ 合法：void 意为"返回值会被忽略"
};
```

这个设计让"附带返回值"的函数也能当回调用——记住即可，不必深究。

## 4.5 重载：一个函数多种签名

函数重载（overloads）：同一函数根据参数不同，返回类型不同：

```ts
// 重载签名（只写声明，不写实现）
function parse(input: string): string[];
function parse(input: number): number;
// 实现签名（兼容所有重载）
function parse(input: string | number): string[] | number {
  if (typeof input === 'string') {
    return input.split(',');
  }
  return input * 2;
}

const arr = parse('a,b');     // string[] —— 按"字符串入参"推断
const num = parse(42);        // number   —— 按"数字入参"推断
```

调用方拿到的返回类型**精确对应入参**，而不是宽泛的联合。日常业务重载用得少（联合类型 + 收窄更简单），但读库源码会大量遇到。

## 4.6 this 类型：普通函数的坑

```ts
const user = {
  name: 'Tom',
  sayHi() {
    return `我是 ${this.name}`;    // 方法内的 this 指向对象，TS 能推断
  },
};
user.sayHi();   // ✅

// 但把方法抽出来单独调用：
const fn = user.sayHi;
fn();   // ❌ this 为 undefined（运行时）—— TS 对独立调用的 this 管不到
```

规则：**对象方法里用 this 安全；回调/独立调用别依赖 this**（用箭头函数或显式传参）。Vue/React 的方法都遵循这一约定。

## 4.7 回调类型：把函数当参数

```ts
type MapFn<T, R> = (item: T, index: number) => R;

function mapArray<T, R>(arr: T[], fn: MapFn<T, R>): R[] {
  const result: R[] = [];
  arr.forEach((item, i) => result.push(fn(item, i)));
  return result;
}

const lengths = mapArray(['a', 'bb'], (s) => s.length);   // number[]
```

`<T, R>` 是泛型（下一章主角）——先有个印象：类型也当"参数"传。

## 4.8 综合示例：类型安全的工具函数集

```ts
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function toggle(list: Todo[], id: number): Todo[] {
  return list.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

function findText(list: Todo[], id: number): string {
  const found = list.find((t) => t.id === id);
  return found?.text ?? '未找到';
}

const todos: Todo[] = [{ id: 1, text: '学 TS', done: false }];
toggle(todos, 1);         // ✅
toggle(todos, '1');       // ❌ id 必须是 number（JS 版的 Number(li.dataset.id) 转换有了护栏）
```

## 本章小结

- 参数必标、返回值建议标；`type Calc = (...) => ...` 描述函数类型
- 可选参数 `?` 放后面；rest 收进数组
- 重载让"入参不同 → 返回类型不同"精确表达
- 方法里的 this 安全，独立调用别依赖 this

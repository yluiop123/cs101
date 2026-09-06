---
title: 基础类型
---

# 第 2 章 · 基础类型

**本章目标：**

- 掌握原始类型的标注方式
- 理解 any / unknown / void / never 的分工
- 会用数组、元组与对象类型描述数据结构

## 2.1 原始类型标注

在变量名后加 `: 类型`：

```ts
let num: number = 42;          // 数字（含小数/负数）
let str: string = 'hello';
let bool: boolean = true;
let nul: null = null;
let undef: undefined = undefined;
let big: bigint = 9007199254740993n;
let sym: symbol = Symbol('id');
```

::: tip 类型推断（type inference）
写明初始值时，TS 会自动推断类型——标注可以省略：

```ts
let num = 42;        // TS 自动推断为 number
num = 'hello';       // ❌ 依旧报错：推断出来的类型同样受保护

let maybe: string;   // 声明时未赋值 → 必须手动标注
maybe = 'later';
```

**原则：初始值能推断就不写标注；函数参数永远写标注**（参数无推断来源）。
:::

## 2.2 any：逃生门（慎用）

```ts
let anything: any = '随便什么';
anything = 42;
anything.foo();          // 不检查，编译通过
anything.bar().baz();    // 也不检查 —— 上线运行时炸
```

`any` 关闭类型检查：能编译，但等于回到 JavaScript。**使用原则：只有迁移老代码、对接无类型的第三方库时临时使用，能不用就不用。**

## 2.3 unknown：安全的 any

```ts
let mystery: unknown = '随便什么';
mystery = 42;

mystery.foo();           // ❌ 报错：unknown 不能直接操作
if (typeof mystery === 'string') {
  mystery.toUpperCase(); // ✅ 收窄为 string 后才能用
}
```

`unknown` 与 any 的区别：**用之前必须先验证**。接收外部输入（API 数据、用户输入）的标准选择。

## 2.4 void 与 never：函数的两种"空"

```ts
// void：函数"没有返回值"（实际返回 undefined）
function log(msg: string): void {
  console.log(msg);
}

// never：函数"永远不会正常返回"（抛错或死循环）
function fail(): never {
  throw new Error('boom');
}
```

回调约定：不关心返回值的函数标 `void`——它同时表达了"我承诺不返回有意义的东西"。

## 2.5 数组与元组

```ts
// 数组：两种等价写法
const nums: number[] = [1, 2, 3];
const nums2: Array<number> = [1, 2, 3];

const users: string[] = ['Tom', 'Lucy'];
users.push('Jerry');     // ✅ 只能推 string
users.push(42);          // ❌

// 元组（tuple）：固定长度 + 每位类型
const point: [number, number] = [3, 5];
const named: [string, number] = ['Tom', 18];
named[0].toUpperCase();   // 第 0 位确定是 string
```

## 2.6 对象类型

```ts
// 用"结构"描述对象
const user: { name: string; age: number } = {
  name: 'Tom',
  age: 18,
};

// 可选属性：?
const config: { host: string; port?: number } = {
  host: 'localhost',      // port 省略合法
};

// 只读属性：readonly
const point: { readonly x: number } = { x: 1 };
point.x = 2;   // ❌ Cannot assign to 'x' because it is a read-only property
```

::: info 结构化类型（structural typing）
TS 判断"类型是否匹配"看**形状**而不是名字：

```ts
type PointA = { x: number; y: number };
type PointB = { x: number; y: number };

const a: PointA = { x: 1, y: 2 };
const b: PointB = a;    // ✅ 形状一致即可互赋（不需要"声明关系"）
```
这就是 TS 类型系统的核心理念——记住了它，后面接口与类型别名的"等价性"就顺理成章。
:::

## 2.7 类型标注的几种位置

```ts
// 1. 变量
const n: number = 1;

// 2. 函数参数与返回值（最重要！）
function calc(price: number, count: number): number {
  return price * count;
}

// 3. 函数表达式
const calc2 = (a: number, b: number): number => a + b;

// 4. 数组元素
const names: string[] = [];

// 5. 对象属性
const user: { name: string; tags: string[] } = { name: 'Tom', tags: ['a'] };
```

## 2.8 综合示例：给待办数据建模

```ts
// JS 教程第 14 章的 todo 数据，用 TS 描述
const todo: {
  id: number;
  text: string;
  done: boolean;
} = {
  id: 1,
  text: '学 TS',
  done: false,
};

const todoList: { id: number; text: string; done: boolean }[] = [
  { id: 1, text: '学 HTML', done: true },
  { id: 2, text: '学 TS', done: false },
];

// 增删改查从此有了类型护栏
todoList.push({ id: 3, text: '忘了 done 字段' });   // ❌ 直接标红
```

类型重复了两次——第 3 章的 interface 就是用来消除这种重复的。

## 本章小结

- 推断优先：有初始值可不写标注；**函数参数必须标注**
- any 关检查（逃生门）、unknown 强制验证后使用、void 无返回、never 永不返回
- 数组 `T[]`，元组定长定位；对象结构 + `?` 可选 + `readonly` 只读
- 结构化类型：形状匹配即可赋值

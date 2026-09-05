---
title: 变量与数据类型
---

# 第 2 章 · 变量与数据类型

**本章目标：**

- 正确选择 let 与 const 声明变量
- 认识七大基本类型与 typeof 检测
- 理解类型转换的显式与隐式规则

## 2.1 声明变量：let 与 const

```js
let score = 90;        // 可变：之后可以重新赋值
score = 95;

const PI = 3.14159;    // 常量：声明后不可重新赋值
PI = 3;                // TypeError: Assignment to constant variable.
```

::: danger var 已过时
`var` 是历史产物，存在变量提升、可重复声明、无块级作用域三大坑。**新代码一律 `let` / `const`**，读老代码时只需认识 var。

**选择原则：默认 const，需要重新赋值才用 let。** 需要变的地方自然浮现，其余全锁定——这是防止误改的最好习惯。
:::

```js
// const 的对象：不能换引用，但内容可以改！
const user = { name: 'Tom' };
user.name = 'Lucy';     // ✅ 允许：修改属性
user = {};              // ❌ 报错：不能重新赋值
```

## 2.2 七大数据类型

```js
// 基本类型（6 种）
const n = 42;           // number 数字（含小数）
const s = 'hello';      // string 字符串
const b = true;         // boolean 布尔
let nothing = null;     // null "空"（有意置空）
let notYet;             // undefined 未赋值
const big = 9007199254740993n;  // bigint 大整数（日常少见）
const id = Symbol('id');        // symbol 唯一标识（进阶）

// 引用类型（1 大类）
const obj = { name: 'Tom' };   // object：对象/数组/函数都算
```

**基本类型存值，引用类型存地址**——这个差异在第 5 章（对象）会带来大量"为什么它也变了"的现象，先埋个种子。

## 2.3 typeof：类型检测

```js
typeof 42            // 'number'
typeof 'hello'       // 'string'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof null          // 'object' —— 历史遗留 bug！null 的检测要用 === null
typeof {}            // 'object'
typeof []            // 'object' —— 数组要用 Array.isArray([]) 判断
typeof (() => {})    // 'function'
```

::: warning 两个著名陷阱
1. `typeof null` 返回 `'object'`——JS 的历史 bug，判空用 `value === null`
2. `typeof []` 也是 `'object'`——判数组用 `Array.isArray()`
:::

## 2.4 模板字符串：现代拼接方式

```js
const name = 'Tom';
const score = 95;

// 老写法：加号拼接，变量多了容易乱
const msg1 = '学生 ' + name + ' 的分数是 ' + score;

// 模板字符串：反引号 + ${}，所见即所得
const msg2 = `学生 ${name} 的分数是 ${score}`;
const msg3 = `评价：${score >= 90 ? '优秀' : '良好'}`;   // 里面可以放表达式
```

反引号字符串还支持**多行**，直接换行书写。

## 2.5 显式类型转换

```js
// 转数字
Number('42');        // 42
Number('42px');      // NaN —— 只要有非数字字符就失败
parseInt('42px');    // 42 —— 从头解析整数
parseFloat('3.14元'); // 3.14

// 转字符串
String(42);          // '42'
(42).toString();     // '42'

// 转布尔
Boolean('hello');    // true
Boolean(0);          // false
```

**NaN**（Not a Number）是数字运算失败的产物，且 `NaN === NaN` 为 false，判断用 `Number.isNaN(value)`。

## 2.6 隐式转换：理解即可，别依赖

```js
'5' + 1      // '51' —— + 遇字符串走拼接
'5' - 1      // 4   —— 减号强制转数字
'5' * '2'    // 10
'' + null    // 'null'
```

规则复杂、坑多。实践准则：**运算前自己转**（`Number(x)` / `String(x)`），不把命运交给隐式规则。

## 2.7 布尔转换的"假值清单"

以下 6 个值转布尔为 `false`，其余全为 `true`：

```js
false
0          // 含 -0、0n
'' / ""    // 空字符串
null
undefined
NaN
```

```js
if (list.length) { }     // 常用技巧：length 为 0 即 falsy，跳过
if (userInput) { }       // 空串/null/undefined 都算"没填"
```

## 本章小结

- 默认 const，需重赋值用 let，var 淘汰
- 7 种类型：6 基本类型 + object；typeof 有 null/数组两个坑
- 字符串拼接用模板字符串 `` `${x}` ``
- 转换要显式：Number/String/Boolean；记住 6 个假值清单

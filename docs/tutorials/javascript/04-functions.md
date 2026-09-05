---
title: 函数基础
---

# 第 4 章 · 函数基础

**本章目标：**

- 掌握函数的三种定义方式与调用
- 理解参数、返回值与作用域
- 会用箭头函数并知道它与普通函数的差异

## 4.1 为什么需要函数

函数（function）把一段可复用的逻辑打包成"积木"：

```js
// 不用函数：算三个圆的面积要写三遍
const area1 = 3.14 * 5 * 5;
const area2 = 3.14 * 8 * 8;
const area3 = 3.14 * 2 * 2;

// 用函数：逻辑只写一遍
function circleArea(r) {
  return Math.PI * r * r;
}
circleArea(5);   // 78.5...
circleArea(8);   // 201.06...
```

函数的两大价值：**复用**（写一次用 N 次）与**命名抽象**（`circleArea(5)` 读起来就是意图）。

## 4.2 三种定义方式

```js
// 1. 函数声明（function declaration）—— 有提升，可先调用后定义
sayHi();
function sayHi() {
  console.log('hi');
}

// 2. 函数表达式（function expression）—— 赋值给变量，无提升
const add = function (a, b) {
  return a + b;
};

// 3. 箭头函数（arrow function）—— 现代主流
const mul = (a, b) => a * b;
```

## 4.3 箭头函数的形态变化

箭头函数（arrow function）根据"参数个数"与"返回值"有多种简写：

```js
const add = (a, b) => { return a + b; };   // 完整形态
const add = (a, b) => a + b;               // 简写 1：函数体一行可省 {} 和 return
const square = x => x * x;                 // 简写 2：单参数可省括号
const greet = () => console.log('hi');     // 无参数：括号必须留
const makeUser = (name, age) => ({ name, age });  // 返回对象：要用 () 包住
```

::: warning 返回对象必须加括号
`() => { name }` 中的 `{}` 会被解析为**函数体**而不是对象字面量。返回对象字面量要写 `() => ({ name })`。
:::

## 4.4 参数：形参、实参与默认值

```js
// 形参（parameter）是占位符，实参（argument）是传入的值
function greet(name, greeting = '你好') {   // 默认参数
  return `${greeting}，${name}！`;
}
greet('Tom');               // "你好，Tom！"
greet('Tom', '早上好');      // "早上好，Tom！"

// rest 参数：把多余的实参收进数组
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4);   // 10
```

::: info 参数按值传递
基本类型传的是"值"的副本，函数内改不影响外部；**引用类型传的是"地址"**，函数内修改对象属性会直接影响外部——进阶辨析见第 5 章。
:::

## 4.5 返回值：return

```js
function check(score) {
  if (score < 0 || score > 100) {
    return '非法分数';       // return 立即结束函数
  }
  return score >= 60 ? '及格' : '不及格';
}

// 没有 return 的函数返回 undefined
const f = () => { console.log('无返回'); };
f();    // 调用结果为 undefined
```

要点：`return` 后函数立即结束；箭头函数单表达式简写自带"隐式 return"。

## 4.6 作用域：变量可见的范围

```js
const globalVar = '全局可见';

function outer() {
  const outerVar = '函数内可见';

  function inner() {
    console.log(globalVar);  // ✅ 作用域链：内层可以访问外层
    console.log(outerVar);   // ✅ 逐层向外找
  }
  inner();
  // console.log(innerVar); // ❌ undefined：外层看不到内层
}
```

- **块级作用域**：`let/const` 只在 `{}` 内可见（if/for 的大括号都算块）
- **作用域链**：访问变量时沿"定义位置"逐层向外查找，直到全局
- 变量要在**最小必要范围**声明——循环计数器放 for 里，临时值放 if 里

## 4.7 函数是值：回调初体验

函数可以像数字一样被赋值、传递——这是 JS 的灵魂特性：

```js
// 函数作为参数（回调，callback）
[3, 1, 2].sort((a, b) => a - b);           // 排序规则是个函数
setTimeout(() => console.log('3秒后'), 3000);  // 定时执行
btn.addEventListener('click', () => { ... }); // 点击时执行

// 函数作为返回值
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
double(5);   // 10
```

数组的高阶方法（map/filter/reduce，第 6 章）、异步编程（第 13 章）全部建立在"回调"之上。

## 4.8 综合示例：简易计费函数

```js
// 按单价与数量计算订单总价，支持会员折扣
function calcTotal(price, count, isVip = false) {
  if (price <= 0 || count <= 0) {
    return 0;                      // 卫语句：非法输入提前返回
  }
  const subtotal = price * count;
  return isVip ? Math.round(subtotal * 0.9) : subtotal;
}

calcTotal(100, 3);          // 300
calcTotal(100, 3, true);    // 270（九折）
```

## 本章小结

- 函数 = 复用 + 意图命名；声明有提升，表达式/箭头没有
- 箭头函数：单表达式省 `{}` 与 return，返回对象加 `()`
- 默认参数 + rest（`...args`）覆盖绝大多数参数场景
- 作用域链由**定义位置**决定；let/const 是块级作用域
- 函数是值，能传能返——回调是后面所有章节的地基

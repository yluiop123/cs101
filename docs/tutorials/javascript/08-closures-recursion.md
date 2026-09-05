---
title: 深入函数：闭包与递归
---

# 第 8 章 · 深入函数：闭包与递归

**本章目标：**

- 理解闭包的形成与实用价值
- 掌握递归的写法与适用场景
- 补齐函数的进阶细节（IIFE、默认参数进阶）

## 8.1 闭包：函数记住了它的出生地

闭包（closure）= 函数 + 它创建时所处的作用域。即使外层函数已执行完毕，内层函数仍能访问外层的变量：

```js
function makeCounter() {
  let count = 0;            // 外层函数的局部变量

  return function () {
    count += 1;             // 内层函数"记住"了 count
    return count;
  };
}

const counter = makeCounter();
counter();   // 1
counter();   // 2 —— makeCounter 早就执行完了，count 却还活着
```

原理：内层函数持有对外层作用域的引用，只要内层函数还活着，那些变量就不会被回收——**变量被"关"在函数里**，故称闭包。

## 8.2 闭包的三大实用场景

### 1. 私有变量

```js
function createWallet(initial) {
  let balance = initial;         // 外界无法直接触碰

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) return '余额不足';
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; },
  };
}

const wallet = createWallet(100);
wallet.deposit(50);     // 150
wallet.balance;         // undefined —— 只能通过方法访问
```

### 2. 工厂函数：批量生产"带状态"的函数

```js
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);   // 两个闭包，各自的 factor 互不干扰
const triple = multiplier(3);
double(10);   // 20
triple(10);   // 30
```

### 3. 事件处理中"带参回调"

```js
items.forEach((item) => {
  btn.addEventListener('click', () => openDetail(item.id));  // 每个按钮记住自己的 item
});
```

## 8.3 闭包的注意点

::: warning 内存与循环陷阱
1. 闭包让变量常驻内存——大量大对象闭包会占用内存，用完可置 `null` 释放
2. 经典陷阱：循环中用 `var` + 闭包，所有闭包共享同一个变量（改用 `let` 天然解决——每轮循环是独立作用域）

```js
// var 版本：打印 3 3 3（共享一个 i）
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
// let 版本：打印 0 1 2（每轮独立）✅
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));
```
:::

## 8.4 递归：函数调用自己

递归（recursion）= 函数在自己的定义里调用自己，把大问题拆成同构的小问题：

```js
// 阶乘：5! = 5 × 4 × 3 × 2 × 1
function factorial(n) {
  if (n <= 1) return 1;       // 1. 基准条件（必须！）——停下来
  return n * factorial(n - 1); // 2. 递归条件——缩小问题
}
factorial(5);   // 120
```

递归两要素：

1. **基准条件（base case）**：不再递归的出口，没有它就是无限递归 → 栈溢出
2. **递归条件**：问题规模必须**收敛**（每层更接近基准条件）

## 8.5 递归的典型场景

```js
// 1. 嵌套数据：深层结构遍历
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flatten(value, path));   // 递归深入
    } else {
      result[path] = value;
    }
  }
  return result;
}
flatten({ user: { name: 'Tom', tags: ['a'] } });
// { 'user.name': 'Tom', 'user.tags': ['a'] }

// 2. 树形结构（目录树、菜单树）——前端最常见的递归场景
function renderTree(nodes, depth = 0) {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? renderTree(n.children, depth + 1) : undefined,
  }));
}
```

::: tip 能循环就别递归
简单计数/累加用循环更直观且无栈深度限制。递归的价值在**天然嵌套的结构**（树、目录、JSON）——场景匹配时它比循环优雅得多。
:::

## 8.6 IIFE：立即执行函数

定义即执行，常用于"一次性初始化代码"：

```js
(function init() {
  const config = { ... };   // 变量封在里面，不污染全局
  setup(config);
})();
```

模块化（第 14 章）普及后 IIFE 使用减少，但读老代码与工具库源码时会频繁遇到。

## 8.7 函数细节补充

```js
// 默认参数可以引用前面的参数
function greet(name, title = '同学', msg = `你好，${title}${name}`) {
  return msg;
}

// 具名函数表达式：函数体内可用自己的名字（利于递归）
const fact = function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);   // 内部名不污染外部
};
```

## 本章小结

- 闭包 = 函数 + 诞生作用域；三大用途：私有变量、工厂函数、带参回调
- 循环闭包陷阱用 `let` 天然规避
- 递归两要素：基准条件 + 收敛的递归条件；嵌套结构是主场
- IIFE 用于一次性初始化；默认参数可引用前面的参数

---
title: 运算符与流程控制
---

# 第 3 章 · 运算符与流程控制

**本章目标：**

- 熟练使用比较与逻辑运算符（含 === 与 == 之争）
- 掌握 if / switch / for / while 的选择标准
- 会用 break/continue 控制循环

## 3.1 算术与赋值运算符

```js
// 算术
10 + 3    // 13
10 - 3    // 7
10 * 3    // 30
10 / 3    // 3.3333...（不做整除）
10 % 3    // 1 —— 取余：判断奇偶/整除/循环取位
2 ** 10   // 1024 —— 幂运算

// 自增自减（for 循环常见）
let i = 0;
i++;      // i = 1

// 组合赋值
let n = 10;
n += 5;   // 15，等价 n = n + 5
n -= 3; n *= 2; n /= 4;   // 都有对应形式
```

## 3.2 比较运算符：=== 是铁律

```js
'5' == 5     // true  —— == 会先转换类型再比较（宽松相等）
'5' === 5    // false —— === 类型与值都要相同（严格相等）

0 == ''      // true  —— 宽松相等的"名场面"
0 === ''     // false
null == undefined   // true
null === undefined  // false
```

::: danger 永远用 === 和 !==
`==` 的转换规则表有一整页长，几乎没人能背对。行业规范：**一律 `===` / `!==`**，让"类型不同"老老实实返回 false。唯一例外：`x == null` 同时判 null 和 undefined（可读性尚可，但建议显式写）。
:::

```js
// 三元运算符：简单二选一
const level = score >= 90 ? 'A' : 'B';

// 优于 if 的场景：需要"值"而不是"动作"时
```

## 3.3 逻辑运算符

```js
// && 与：都真才真；|| 或：有真就真；! 非：取反
isLoggedIn && hasPermission   // 都满足才放行
name === '' || name === null  // 任一成立即"没填"
!isVip                        // 不是会员

// 短路求值：左边定了，右边就不算
false && console.log('不执行');   // 左为 false，右边被跳过
true || console.log('不执行');    // 左为 true，右边被跳过
```

短路的两个惯用模式：

```js
// 1. 默认值：左边是"空"就用右边
const name = inputName || '匿名';

// 2. 条件执行：左边成立才调用
user && user.sayHi();
```

现代补充（ES2020+）：

```js
const port = config.port ?? 3000;   // ?? 只在 null/undefined 时用默认值
// 与 || 的区别：port 为 0 或 '' 时，?? 会保留 0/''，|| 会错误地换成 3000
```

## 3.4 分支：if 与 switch

```js
// if / else if / else：区间、复杂条件
if (score >= 90) {
  grade = '优秀';
} else if (score >= 60) {
  grade = '及格';
} else {
  grade = '不及格';
}

// switch：单一变量的多值匹配
switch (day) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log('工作日');
    break;                 // 忘写 break 会"穿透"到下一个 case！
  case 6:
  case 0:
    console.log('周末');
    break;
  default:
    console.log('非法输入');
}
```

选择标准：**两个以上分支的"具体值匹配"用 switch；区间或组合条件用 if**。超过三层嵌套的 if 要重构（提前返回、卫语句）。

```js
// 卫语句：先处理异常分支，主逻辑不缩进
function calc(price, isVip) {
  if (price <= 0) return 0;
  return isVip ? price * 0.8 : price;
}
```

## 3.5 循环：for 与 while

```js
// 经典 for：已知次数
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// 遍历数组：for...of（推荐）
const langs = ['JS', 'Python', 'Go'];
for (const lang of langs) {
  console.log(lang);
}

// 遍历对象：for...in（少用，注意继承属性）
for (const key in user) {
  console.log(key, user[key]);
}

// while：未知次数，先判后做
let n = 1;
while (n <= 100) {
  n *= 2;
}

// do...while：至少执行一次
do {
  console.log('至少跑一次');
} while (false);
```

::: tip 循环选择口诀
遍历数组 → `for...of`；遍历对象 → `Object.keys()` + `for...of` 更安全；计数/步进逻辑 → 经典 for；"直到满足为止" → while。数组的函数式遍历（map/filter）在第 6 章登场。
:::

## 3.6 break 与 continue

```js
// break：终止整个循环
for (let i = 1; i <= 10; i++) {
  if (i === 4) break;      // 到 4 直接结束
  console.log(i);          // 输出 1 2 3
}

// continue：跳过本轮，继续下一轮
for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) continue;  // 跳过偶数
  console.log(i);             // 输出 1 3 5
}
```

## 3.7 综合练习：FizzBuzz

```js
// 经典面试题：1~100，3 的倍数打印 Fizz，5 的倍数打印 Buzz，
// 同时是 3 和 5 的倍数打印 FizzBuzz
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) {
    console.log('FizzBuzz');
  } else if (i % 3 === 0) {
    console.log('Fizz');
  } else if (i % 5 === 0) {
    console.log('Buzz');
  } else {
    console.log(i);
  }
}
```

::: tip 注意条件顺序
`i % 15` 必须放最前——如果先判 `% 3`，15 会提前命中 Fizz 而漏掉 Buzz。**分支的排列顺序本身就是逻辑**。
:::

## 本章小结

- 比较一律 `===`；三元适合简单取值，if 管区间，switch 管多值
- `&&` / `||` 有短路特性；默认值场景优先 `??`
- 遍历数组用 for...of，计数用经典 for
- break 退出循环，continue 跳过本轮；分支顺序即逻辑

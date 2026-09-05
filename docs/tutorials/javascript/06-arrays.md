---
title: 数组
---

# 第 6 章 · 数组

**本章目标：**

- 熟练使用数组的增删改查方法
- 掌握遍历三件套 map / filter / reduce
- 会用查找与排序的常用套路

## 6.1 数组基础

数组（array）是**有序**的值列表，索引从 0 开始：

```js
const langs = ['JS', 'Python', 'Go'];

langs[0]          // 'JS'
langs.length      // 3
langs[langs.length - 1]   // 'Go'（最后一项）

// 混合类型与嵌套都合法
const mixed = [1, 'two', true, { id: 1 }, [2, 3]];
```

数组是对象——`typeof []` 是 `'object'`，判断用 `Array.isArray(langs)`。

## 6.2 增删改查

| 操作 | 方法 | 说明 |
| --- | --- | --- |
| 尾部加 | `push(x)` | 返回新长度 |
| 尾部删 | `pop()` | 返回被删项 |
| 头部加 | `unshift(x)` | 返回新长度 |
| 头部删 | `shift()` | 返回被删项 |
| 任意删/插 | `splice(start, deleteCount, ...items)` | 万能刀 |
| 查索引 | `indexOf(x)` / `findIndex(fn)` | 找不到返回 -1 |
| 切片 | `slice(start, end)` | 复制一段（不改原数组） |

```js
const list = ['a', 'b', 'c', 'd'];

list.push('e');            // 尾部加 → ['a','b','c','d','e']
list.splice(1, 1);         // 删索引 1 → ['a','c','d','e']
list.splice(1, 0, 'X');    // 在索引 1 插入 → ['a','X','c','d','e']
list.indexOf('c');         // 2
list.slice(1, 3);          // ['X','c'] —— 原数组不变
```

::: warning 改原数组 vs 返回新数组
push/pop/splice/sort **修改原数组**；slice/map/filter/concat **返回新数组**。写"不可变"代码（React/Vue 状态）时只用后者 + 展开语法 `[...list, 'new']`。
:::

## 6.3 遍历与转换三件套

### map：一一映射

```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);        // [2, 4, 6]
const titles = posts.map(p => p.title);      // 提取字段
```

### filter：过滤

```js
const scores = [55, 89, 72, 91, 40];
const passed = scores.filter(s => s >= 60);  // [89, 72, 91]
```

### reduce：聚合为一个值

```js
const nums = [1, 2, 3, 4];
const total = nums.reduce((sum, n) => sum + n, 0);   // 10
// 累计对象也可以
const countByType = orders.reduce((acc, o) => {
  acc[o.type] = (acc[o.type] || 0) + 1;
  return acc;
}, {});
```

三件套组合出绝大多数数据处理需求，且**不修改原数组**：

```js
const users = [
  { name: 'Tom', age: 17, vip: true },
  { name: 'Lucy', age: 22, vip: false },
  { name: 'Jerry', age: 30, vip: true },
];

// 链式调用：成年 VIP 的名字列表
const names = users
  .filter(u => u.age >= 18 && u.vip)
  .map(u => u.name);        // ['Tom', 'Jerry']
```

## 6.4 查找与判断

```js
const users = [{ id: 1, name: 'Tom' }, { id: 2, name: 'Lucy' }];

users.find(u => u.id === 2);        // 找到返回对象，找不到返回 undefined
users.findIndex(u => u.id === 2);   // 找到返回索引，找不到返回 -1
users.some(u => u.age > 18);        // 有一个满足 → true
users.every(u => u.age > 10);       // 全部满足 → true
users.includes('Tom');              // 简单值包含判断（元素级）
```

## 6.5 排序与反转

```js
const nums = [40, 100, 1, 5];

nums.sort((a, b) => a - b);   // 升序：[1, 5, 40, 100]
nums.sort((a, b) => b - a);   // 降序

// 注意：默认 sort() 是按"字符串"排的！
[40, 100, 1].sort()          // [1, 100, 40] —— 错误示范

// 对象数组：按字段排
users.sort((a, b) => a.age - b.age);

// 中文按拼音：localeCompare
['张三', '李四'].sort((a, b) => a.localeCompare(b, 'zh'));
```

## 6.6 其他高频方法

```js
// 合并
const all = [...arr1, ...arr2];

// 数组转字符串
['a', 'b', 'c'].join('-');     // 'a-b-c'

// 扁平化
[1, [2, 3], [4, [5]]].flat(2);   // [1, 2, 3, 4, 5]

// 首尾判断
['a', 'b'].includes('a');      // true
```

## 6.7 综合示例：待办列表数据操作

```js
let todos = [
  { id: 1, text: '学 HTML', done: true },
  { id: 2, text: '学 CSS', done: true },
  { id: 3, text: '学 JS', done: false },
];

// 新增（不可变）
todos = [...todos, { id: 4, text: '做项目', done: false }];

// 切换完成状态
todos = todos.map(t =>
  t.id === 3 ? { ...t, done: !t.done } : t
);

// 删除已完成
todos = todos.filter(t => !t.done);

// 统计
const remain = todos.filter(t => !t.done).length;
```

这组"增删改查"正是第 14 章待办清单实战的数据层——先在本章用控制台把每个操作跑一遍。

## 本章小结

- push/pop/splice 改原数组，map/filter/slice 返回新数组——用前想清楚
- 三件套：map 映射、filter 过滤、reduce 聚合，链式组合处理数据
- find/findIndex/some/every 覆盖查找判断需求
- sort 必须传比较函数（`a - b` 升序），中文排序用 localeCompare

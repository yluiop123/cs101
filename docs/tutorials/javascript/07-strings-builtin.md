---
title: 字符串与内置对象
---

# 第 7 章 · 字符串与内置对象

**本章目标：**

- 熟练使用字符串常用方法与模板字符串进阶
- 掌握 Math 与 Date 的日常用法
- 了解 JSON 序列化的标准流程

## 7.1 字符串常用方法

```js
const s = 'Hello, CS101';

// 查找
s.includes('CS');       // true（包含）
s.startsWith('Hello');  // true（开头）
s.endsWith('101');      // true（结尾）
s.indexOf('CS');        // 7（索引，找不到 -1）

// 提取
s.slice(7);             // 'CS101'（从 7 到末尾）
s.slice(0, 5);          // 'Hello'（含头不含尾）
s.slice(-6);            // 'CS101'（负数从尾部数）

// 变形
s.toLowerCase();        // 全小写
s.toUpperCase();        // 全大写
'  hi  '.trim();        // 去首尾空白
'a,b,c'.split(',');     // ['a', 'b', 'c']（拆成数组）

// 替换
'2024-01'.replace('-', '/');        // '2024/01'（只换第一个）
'a-b-c'.replaceAll('-', '_');       // 'a_b_c'（全部替换）
```

::: warning 字符串不可变
所有方法都**返回新字符串**，原字符串永远不变——`s.toUpperCase()` 不接收返回值等于白调用。
:::

## 7.2 与正则表达式结合

```js
const text = '订单号: A1024, B2048';

text.match(/\d+/g);           // ['1024', '2048']（配合 g 标志取全部）
text.replace(/\d+/g, '***');  // '订单号: A***, B****'
/\d+/.test(text);             // true（测试是否包含）
```

完整正则体系见[正则表达式教程](/tutorials/regex/)，这里记住字符串侧的三个入口：`match` / `replace` / `test`。

## 7.3 模板字符串进阶

```js
const user = { name: 'Tom', score: 95 };

// 表达式插值
`${user.name}：${user.score >= 90 ? '优秀' : '良好'}`

// 多行字符串
const html = `
  <div class="card">
    <h3>${user.name}</h3>
  </div>
`;

// 简单的 HTML 模板拼接（第 10 章 DOM 会大量使用）
list.map(item => `<li>${item}</li>`).join('');
```

## 7.4 Math：数学工具箱

```js
Math.round(4.5);      // 5（四舍五入）
Math.floor(4.9);      // 4（向下取整）
Math.ceil(4.1);       // 5（向上取整）
Math.abs(-5);         // 5（绝对值）
Math.max(1, 9, 3);    // 9
Math.min(1, 9, 3);    // 1
Math.pow(2, 10);      // 1024
Math.sqrt(16);        // 4（平方根）

// 随机整数 [min, max] 的标准公式
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomInt(1, 6);      // 掷骰子
```

::: tip Math.max/min 配合展开
`Math.max(...nums)` 把数组展开成参数列表——找数组最大值的最短写法。
:::

## 7.5 Date：日期时间

```js
const now = new Date();
const birthday = new Date('2000-01-15');

// 获取（get 全家）
now.getFullYear();    // 2024
now.getMonth();       // 0~11！！一月是 0，常 +1
now.getDate();        // 几号（1~31）
now.getDay();         // 星期几（0 是周日）
now.getHours();       // 时
now.getTime();        // 毫秒时间戳（1970-01-01 至今）

// 时间戳运算：计算相差天数
const diffDays = Math.floor((now.getTime() - birthday.getTime()) / 86400000);

// 格式化：现代首选 toLocaleString
now.toLocaleString('zh-CN');          // '2024/1/15 20:30:00'
now.toLocaleDateString('zh-CN');      // '2024/1/15'
now.toLocaleTimeString('zh-CN', { hour12: false });  // '20:30:00'
```

::: warning 三个经典坑
1. `getMonth()` 从 0 开始——一月是 0，显示时 +1
2. `getDay()` 是星期几，`getDate()` 才是几号
3. 复杂日期计算（时区、加减月）建议用库（dayjs），别手搓
:::

## 7.6 JSON：数据交换格式

JSON（JavaScript Object Notation）是前后端传输数据的通用格式，长得像 JS 对象（但键必须双引号、不能有函数）：

```js
// 对象 → JSON 字符串（序列化）
const user = { name: 'Tom', scores: [90, 85] };
const json = JSON.stringify(user);
// '{"name":"Tom","scores":[90,85]}'

// JSON 字符串 → 对象（反序列化）
const parsed = JSON.parse(json);
parsed.name;   // 'Tom'

// 美化输出
JSON.stringify(user, null, 2);
```

```js
// 深拷贝的老方案（现代用 structuredClone）
const copy = JSON.parse(JSON.stringify(user));
```

::: warning JSON 深拷贝的局限
会丢失函数、undefined、Symbol；处理 Date 变字符串。简单数据用它没问题，复杂对象用 `structuredClone()`。
:::

## 7.7 综合示例：格式化订单摘要

```js
function formatOrder(order) {
  const { id, items, createdAt } = order;
  const total = items.reduce((sum, i) => sum + i.price * i.count, 0);
  const time = new Date(createdAt).toLocaleString('zh-CN');
  const lines = items.map(i => `${i.title} ×${i.count}`).join('、');
  return `订单 ${id}（${time}）\n商品：${lines}\n合计：¥${total}`;
}

formatOrder({
  id: 'A1024',
  createdAt: '2024-01-15T12:00:00',
  items: [
    { title: '键盘', price: 299, count: 1 },
    { title: '鼠标垫', price: 39, count: 2 },
  ],
});
// 订单 A1024（2024/1/15 12:00:00）
// 商品：键盘 ×1、鼠标垫 ×2
// 合计：¥377
```

reduce 聚合 + map/join 拼接 + Date 格式化——一个函数串起三样工具。

## 本章小结

- 字符串方法全部返回新值；查找 includes/startsWith，提取 slice，拆分 split
- 正则入口：match（提取）/ replace（替换）/ test（判断）
- Math 取整三兄弟 round/floor/ceil + 随机整数公式
- Date：getMonth 从 0 开始、格式化用 toLocaleString
- JSON.stringify/parse 是前后端数据往返的标准动作

---
title: 对象入门
---

# 第 5 章 · 对象入门

**本章目标：**

- 掌握对象的创建、读写与遍历
- 理解引用类型的"地址共享"行为
- 会用解构与展开语法简化对象操作

## 5.1 对象：属性的集合

对象（object）用**键值对**把相关数据打包：

```js
const user = {
  name: 'Tom',          // 属性（property）
  age: 18,
  isAdmin: false,
  greet() {             // 方法（method）：值为函数的属性
    return `你好，我是 ${this.name}`;
  },
};
```

## 5.2 读取与修改

```js
// 点号：属性名是固定标识符时
user.name            // 'Tom'
user.age = 20;       // 修改

// 方括号：属性名来自变量、含特殊字符时
const key = 'age';
user[key]            // 20
user['is-admin'] = true;   // 带连字符的键只能用方括号

// 新增与删除
user.email = 'tom@example.com';   // 直接赋值即新增
delete user.isAdmin;              // 删除属性
```

```js
// 判断属性是否存在
'name' in user               // true
user.name !== undefined      // 常用替代写法
```

## 5.3 this：方法里的"自己"

```js
const user = {
  name: 'Tom',
  sayHi() {
    return `我是 ${this.name}`;   // this = 调用这个方法的那个对象
  },
};
user.sayHi();   // '我是 Tom'
```

`this` 指向"方法被谁调用"。普通函数中 `this` 的行为复杂多变（第 9 章展开），**日常对象方法里记住"this = 该对象"即可**。

## 5.4 引用类型的核心行为：共享地址

基本类型复制的是**值**，对象复制的是**地址**：

```js
const a = { name: 'Tom' };
const b = a;          // b 与 a 指向同一个对象！
b.name = 'Lucy';
a.name                // 'Lucy' —— a 也变了！

// 真正的复制（浅拷贝）
const c = { ...a };   // 展开语法复制一层
c.name = 'Jerry';
a.name                // 仍是 'Lucy'，c 是独立副本
```

::: warning 浅拷贝只复制一层
`{...a}` 复制后，若属性值本身是对象/数组，**内层仍是共享地址**（改内层还是互相影响）。完整独立的"深拷贝"用 `structuredClone(obj)`（现代标准）。
:::

## 5.5 遍历对象

```js
const user = { name: 'Tom', age: 18, city: '北京' };

// 推荐：Object.keys/values/entries + for...of
for (const key of Object.keys(user)) {
  console.log(key, user[key]);
}
for (const value of Object.values(user)) {
  console.log(value);
}
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

## 5.6 解构：精准提取

```js
const user = { name: 'Tom', age: 18, city: '北京' };

// 解构赋值：按名字提取
const { name, age } = user;
name   // 'Tom'

// 改名 + 默认值
const { name: userName, level = 1 } = user;
userName   // 'Tom'

// 函数参数解构：直接"收"整个配置对象
function renderCard({ name, age }) {
  return `${name}（${age}）`;
}
renderCard(user);
```

## 5.7 展开语法：合并与改写

```js
const base = { name: 'Tom', role: 'student' };

// 合并（后面的覆盖前面的）
const updated = { ...base, role: 'admin', level: 3 };
// { name: 'Tom', role: 'admin', level: 3 }

// 不可变更新：不修改原对象，生成新对象（React/Vue 状态更新的标准姿势）
```

## 5.8 综合示例：购物车条目

```js
const item = {
  id: 1024,
  title: 'TypeScript 实战',
  price: 99,
  count: 2,
  subtotal() {
    return this.price * this.count;
  },
};

// 更新数量（不可变写法）
const afterAdd = { ...item, count: item.count + 1 };
afterAdd.subtotal();   // 297
```

## 本章小结

- 对象 = 属性 + 方法的键值对集合；点号读，方括号处理动态键
- 方法内 `this` 指向所属对象
- **对象赋值传地址**，独立副本用展开语法（浅拷贝），深拷贝用 structuredClone
- 解构提取、展开合并/不可变更新，是现代 JS 的日常语法

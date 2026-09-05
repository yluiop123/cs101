---
title: 面向对象与原型
---

# 第 9 章 · 面向对象与原型

**本章目标：**

- 掌握构造函数与 class 的写法
- 理解原型（prototype）与继承机制
- 会用 class 组织有状态的对象

## 9.1 从对象字面量到"批量生产"

对象字面量适合单个对象；**大量相似对象**需要模板：

```js
// 手写三个"用户"：重复劳动
const u1 = { name: 'Tom', sayHi() { return `我是 ${this.name}`; } };
const u2 = { name: 'Lucy', sayHi() { return `我是 ${this.name}`; } };
```

构造函数（constructor）就是一个"对象工厂"：

```js
function User(name, age) {
  this.name = name;
  this.age = age;
  this.sayHi = function () {
    return `我是 ${this.name}`;
  };
}

const u1 = new User('Tom', 18);   // new 触发"造对象"流程
u1.sayHi();   // '我是 Tom'
```

`new` 做了四件事：创建空对象 → 把 `this` 指向它 → 执行函数体 → 返回该对象。

## 9.2 class：现代语法糖

ES6 的 class 是构造函数 + 原型的语法糖，写法更接近其他语言：

```js
class User {
  constructor(name, age) {     // 构造器：new 时执行
    this.name = name;
    this.age = age;
  }

  sayHi() {                     // 方法（自动挂在原型上）
    return `我是 ${this.name}`;
  }

  get info() {                  // getter：像属性一样访问
    return `${this.name}（${this.age}）`;
  }

  static createGuest() {        // 静态方法：挂在类上，不需要实例
    return new User('游客', 0);
  }
}

const u = new User('Tom', 18);
u.sayHi();            // '我是 Tom'
u.info;               // 'Tom（18）'（没有括号！）
User.createGuest();   // '游客' 实例
```

::: tip class 只是糖
`class User {...}` 本质仍是函数 + 原型。日常开发用 class 写，理解原理看下一节。
:::

## 9.3 原型：方法共享的机制

```js
class User {
  sayHi() {}
}
User.prototype.sayHi === (new User()).sayHi   // true —— 同一个函数
```

- 每个函数天生带一个 `prototype` 对象；`new` 出来的实例通过内部的 `[[Prototype]]` 链接到它
- 访问 `u.sayHi` 时：实例自身没有 → 沿**原型链（prototype chain）**向上找 → 在 prototype 上找到
- 100 个实例共享**一份**方法——这就是"方法写 prototype"的意义

```js
// 原型链的顶点
const arr = [];
arr.map      // Array.prototype.map —— 数组方法的来源
arr.toString // 数组没有 → 沿链找到 Object.prototype
arr.foo      // undefined —— 链走到底也没有
```

第 6 章的数组方法、字符串方法，全部来自原型链。

## 9.4 继承：extends 与 super

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    return `${this.name} 在吃东西`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);              // 必须先调用父类构造器
    this.breed = breed;
  }
  bark() {
    return `${this.name}（${this.breed}）在汪汪叫`;
  }
  eat() {                     // 方法重写（override）
    return `${super.eat()}（狗粮）`;
  }
}

const d = new Dog('旺财', '柴犬');
d.eat();    // '旺财 在吃东西（狗粮）'
d.bark();   // '旺财（柴犬）在汪汪叫'
d instanceof Dog;      // true
d instanceof Animal;   // true —— instanceof 沿原型链判断
```

::: warning 子类构造器必须先 super()
`extends` 后在 `constructor` 里使用 `this` 之前必须调用 `super(...)`，否则报错。
:::

## 9.5 封装：私有字段

```js
class Wallet {
  #balance = 0;               // # 开头 = 真私有字段

  deposit(amount) {
    if (amount <= 0) throw new Error('金额必须为正');
    this.#balance += amount;
  }
  get balance() { return this.#balance; }
}

const w = new Wallet();
w.deposit(100);
w.balance;        // 100（通过 getter 读）
w.#balance;       // ❌ 语法错误：外部不可访问
```

`#私有字段` 让"内部状态 + 公开方法"的封装设计真正落地。

## 9.6 综合示例：待办事项类

```js
class TodoList {
  #items = [];
  #nextId = 1;

  add(text) {
    const item = { id: this.#nextId++, text, done: false };
    this.#items.push(item);
    return item;
  }

  toggle(id) {
    this.#items = this.#items.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }

  get active() {
    return this.#items.filter((t) => !t.done);
  }
}

const list = new TodoList();
list.add('学原型');
list.toggle(1);
```

类把"数据 + 操作"收拢在一起，第 14 章实战中它会直接作为数据层。

## 本章小结

- 构造函数/new 与 class 是同一机制的两套写法，新代码用 class
- 方法在 prototype 上被所有实例**共享**，访问沿原型链向上查找
- extends 继承 + super 调用父类；instanceof 沿链判断类型
- `#字段` 实现真私有；getter/setter 控制属性访问

---
title: 类与面向对象
---

# 第 8 章 · 类与面向对象

**本章目标：**

- 掌握 TS 类的标注与访问修饰符
- 理解抽象类与接口的协作
- 复习 JS 教程第 9 章 class 的 TS 强化点

## 8.1 类字段的类型标注

JS class（[JavaScript 教程第 9 章](/tutorials/javascript/)）基础上补类型：

```ts
class User {
  name: string;              // 字段标注
  age: number;
  private email: string;     // 访问修饰符（见下）

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  get info(): string {       // getter 显式返回类型
    return `${this.name}（${this.age}）`;
  }
}
```

## 8.2 访问修饰符：public / private / protected

```ts
class BankAccount {
  public owner: string;        // 默认：随便访问
  private balance: number;     // 仅类内部
  protected type: string;      // 类内部 + 子类

  constructor(owner: string) {
    this.owner = owner;
    this.balance = 0;
    this.type = '储蓄卡';
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('金额必须为正');
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const acc = new BankAccount('Tom');
acc.deposit(100);
acc.balance;   // ❌ Property 'balance' is private
```

| 修饰符 | 类内 | 子类 | 类外 |
| --- | --- | --- | --- |
| public（默认） | ✅ | ✅ | ✅ |
| protected | ✅ | ✅ | ❌ |
| private | ✅ | ❌ | ❌ |

::: info private vs JS 的 #私有字段
`private` 是**编译期**检查（编译后的 JS 里字段仍可访问）；`#field` 是**语言级真私有**（运行时也拦截）。TS 项目里两者并存：类内部约定的封装用 private，需要硬隔离用 #。

:::

## 8.3 参数属性：一行声明 + 赋值

```ts
// 传统写法：字段声明 + 构造器赋值，样板代码多
class UserA {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// 参数属性（parameter properties）：构造器参数加修饰符，一步到位
class UserB {
  constructor(private name: string, public age: number = 18) {}
  // TS 自动：声明字段 + 构造器里赋值
}
```

## 8.4 readonly 与静态成员

```ts
class Config {
  readonly version = '1.0';       // 只读字段
  static instanceCount = 0;       // 静态：挂在类上

  constructor() {
    Config.instanceCount += 1;
  }
}
Config.instanceCount;    // 通过类访问，实例访问不到
```

## 8.5 类实现接口：implements

```ts
interface Serializable {
  serialize(): string;
}

class Order implements Serializable {
  constructor(private id: number, private total: number) {}

  serialize(): string {     // 接口要求的方法必须实现（否则报错）
    return JSON.stringify({ id: this.id, total: this.total });
  }
}
```

`implements` 是"履约检查"——漏实现/签名不符立刻标红。

## 8.6 继承与抽象类

```ts
abstract class Shape {             // 抽象类：不能被直接 new
  abstract area(): number;         // 抽象方法：子类必须实现
  describe(): string {             // 具体方法：子类直接继承
    return `面积：${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rect extends Shape {
  constructor(private w: number, private h: number) {
    super();
  }
  area(): number {
    return this.w * this.h;
  }
}

const shapes: Shape[] = [new Circle(2), new Rect(3, 4)];
shapes.map((s) => s.describe());
```

`abstract` 表达"基类只定规矩、子类各管实现"——多态（polymorphism）的最小样板。

## 8.7 泛型类

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push('a');   // ❌

const strStack = new Stack<string>();
```

## 8.8 综合示例：类型安全的 TodoStore（JS 第 14 章升级版）

```ts
interface Todo {
  readonly id: number;
  text: string;
  done: boolean;
}

class TodoStore {
  private items: Todo[] = [];
  private nextId = 1;

  add(text: string): Todo {
    if (!text.trim()) throw new Error('内容不能为空');
    const todo: Todo = { id: this.nextId++, text: text.trim(), done: false };
    this.items.push(todo);
    return todo;
  }

  toggle(id: number): void {
    this.items = this.items.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }

  get active(): Todo[] {
    return this.items.filter((t) => !t.done);
  }
}

const store = new TodoStore();
store.add('学 TS 类');
store.add(42);        // ❌ 参数类型直接拦截
```

## 本章小结

- 字段标注 + 访问修饰符（public/private/protected）；参数属性省样板
- implements 履约、abstract 抽象基类 + 多态
- 泛型类让容器类型安全（Stack\<T\>）
- JS class 的所有机制原样适用，TS 只是加了类型层

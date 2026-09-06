---
title: 面向对象：类与对象
---

# 第 4 章 · 面向对象：类与对象

**本章目标：**

- 理解类与对象的关系，掌握字段与方法的封装
- 掌握构造器、this 与 static
- 初识 JavaBean 与 record

## 4.1 类：对象的图纸

**面向对象（Object-Oriented Programming，OOP）**的核心思想：把"数据"和"操作数据的行为"打包在一起。

```java
// 类 = 图纸；对象 = 按图纸造出的实例
public class Course {
    // 字段（field）：描述"有什么"
    String title;
    int hours;
    boolean published;

    // 方法（method）：描述"能做什么"
    void showInfo() {
        System.out.println(title + "（" + hours + " 小时）");
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Course c1 = new Course();    // new 创建对象（实例化）
        c1.title = "Java 教程";       // 通过 . 访问字段
        c1.hours = 12;
        c1.showInfo();               // 调用方法：Java 教程（12 小时）
    }
}
```

`c1` 是一个**引用**（reference）——存的是对象在堆内存里的地址，类似"遥控器"而非"电视机"。

## 4.2 封装：private 字段 + getter/setter

直接暴露字段（`c1.hours = -5`）无法做约束——**封装（encapsulation）**：字段私有，方法公开：

```java
public class Course {
    private String title;
    private int hours;

    // getter：读取
    public String getTitle() {
        return title;
    }

    // setter：写入（可以做校验！）
    public void setHours(int hours) {
        if (hours < 0) {
            throw new IllegalArgumentException("学时不能为负");
        }
        this.hours = hours;
    }
}
```

```java
Course c = new Course();
c.setHours(-5);        // ❌ 被拦截：学时不能为负
c.setHours(12);        // ✅
System.out.println(c.getTitle());
```

`private`：仅本类可见；`public`：到处可见。**字段一律 private** 是 Java 的默认纪律。

## 4.3 构造器（constructor）

创建对象时的初始化钩子：

```java
public class Course {
    private String title;
    private int hours;

    // 无参构造器
    public Course() {
        this("未命名", 0);
    }

    // 有参构造器
    public Course(String title, int hours) {
        this.title = title;    // this.title = 字段；title = 参数
        this.hours = hours;
    }
}

new Course("Java 教程", 12);   // 调用有参构造器
```

`this` = 当前对象自身。参数名与字段名撞车时，用 `this.xxx` 区分。**不写任何构造器时编译器送一个默认无参构造器**；一旦手写了有参的，默认的就没了（需要就自己补写）。

## 4.4 static：属于类而不是对象

```java
public class Counter {
    static int totalCreated = 0;    // 静态字段：全体对象共享一份

    public Counter() {
        totalCreated++;             // 每创建一个对象 +1
    }

    // 静态方法：不用 new 就能调
    static int getTotal() {
        return totalCreated;
    }
}

new Counter();
new Counter();
System.out.println(Counter.getTotal());   // 2 —— 通过类名调用
```

| | 实例成员 | 静态成员 |
| --- | --- | --- |
| 属于 | 每个对象一份 | 类全局一份 |
| 访问 | `对象.xxx` | `类名.xxx` |
| 场景 | 姓名、学时 | 常量、工具方法、计数 |

第 1 章的 `main` 为什么是 static？——JVM 启动时还没有任何对象，只能调"不依赖对象"的方法。

## 4.5 常量与工具类惯例

```java
public class MathUtils {
    // 常量：static + final（不可变），全大写命名
    public static final double PI = 3.14159;

    // 工具类：构造器私有，禁止 new
    private MathUtils() {}

    public static int square(int n) {
        return n * n;
    }
}

double area = MathUtils.PI * MathUtils.square(2);
```

`private` 构造器 + 全 static 方法 = 工具类的标准形态（如 JDK 的 `Math`、`Arrays`）。

## 4.6 JavaBean 与 record

**JavaBean**：封装字段 + 无参构造器 + getter/setter 的数据类约定——框架（Spring/JSON 库）靠这套约定读写对象属性。

传统写法样板代码极多，Java 16 引入 **record** 一行搞定"纯数据载体"：

```java
// 传统 JavaBean：约 30 行 getter/setter/构造器……

// record：一行
public record Point(int x, int y) {}

Point p = new Point(3, 5);
p.x();                      // 3（访问器名就叫字段名，不带 get）
System.out.println(p);      // Point[x=3, y=5]（自动生成 toString）
Point p2 = new Point(3, 5);
p.equals(p2);               // true（自动生成基于值的 equals/hashCode）
```

**原则：不可变的纯数据用 record；需要 setter/可变状态的类用传统类。**

## 4.7 对象的生命周期与引用

```java
Course c = new Course("Java", 12);   // 对象在堆上，c 持有引用
Course d = c;                        // d 与 c 指向同一个对象！
d.setHours(20);
c.getHours();                        // 20 —— 改 d 就是改 c

c = null;                            // 断开引用；无引用的对象交给 GC 回收
```

## 4.8 综合练习：用户类

```java
public record User(String name, int age) {
    // record 支持紧凑构造器：集中校验
    public User {
        if (age < 0) throw new IllegalArgumentException("年龄不能为负");
    }

    public boolean isAdult() {
        return age >= 18;
    }
}

User u = new User("Tom", 20);
u.isAdult();   // true
new User("Lucy", -1);   // ❌ IllegalArgumentException
```

## 本章小结

- 类 = 数据 + 行为的图纸；new 实例化；变量是引用
- 封装：private 字段 + getter/setter（set 里做校验）
- 构造器初始化；this 指当前对象；static 属于类
- 纯数据载体用 record，可变业务对象用传统类 + JavaBean 约定

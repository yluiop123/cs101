---
title: 接口与内部类
---

# 第 6 章 · 接口与内部类

**本章目标：**

- 掌握 interface 的定义与实现
- 理解"面向接口编程"与默认方法
- 认识函数式接口与 Lambda 的关系

## 6.1 接口：能力的契约

**接口（interface）**只声明"能做什么"，不关心"谁做、怎么做"：

```java
public interface Serializable {
    // 接口方法默认 public abstract（可省略）
    String serialize();
}

public interface Comparable2 {
    int compareTo(Object other);
}
```

类用 `implements` 实现接口，**必须实现全部方法**：

```java
public class Course implements Serializable {
    private String title;

    public Course(String title) {
        this.title = title;
    }

    @Override
    public String serialize() {
        return "{\"title\":\"" + title + "\"}";
    }
}
```

## 6.2 一个类可以实现多个接口

继承只能单继承（一个 extends），接口可以**多实现**——这是接口弥补单继承的关键价值：

```java
public class SmartPhone implements Camera, Phone, GPS {
    @Override
    public void takePhoto() { ... }

    @Override
    public void call() { ... }

    @Override
    public void navigate() { ... }
}
```

## 6.3 面向接口编程

**依赖抽象，不依赖具体**——变量/参数/返回值尽量声明为接口类型：

```java
// 依赖具体类：换实现就要改代码
ArrayList<String> list = new ArrayList<>();

// 面向接口：随时可换实现，调用方无感
List<String> list = new ArrayList<>();
List<String> list = new LinkedList<>();   // 换实现，只需改这一处
```

```java
// 接口作为参数：接受任何"能序列化"的东西
public void save(Serializable item) {
    String json = item.serialize();
    // 存库/发网络……
}

save(new Course("Vue 教程"));      // Course 实现了 Serializable ✅
```

前端类比：Vue 的 props 类型约定、TS 的 interface——**接口是"形状契约"，实现方各自负责履约**。

## 6.4 接口的成员

```java
public interface Animal {
    // 常量：接口里的字段默认 public static final
    int MAX_AGE = 200;

    // 抽象方法（默认 public abstract）
    void eat();

    // 默认方法（default，Java 8+）：有实现，实现类可直接继承
    default void breathe() {
        System.out.println("呼吸中……");
    }

    // 静态方法（Java 8+）：通过接口名直接调用
    static Animal create() {
        return new Dog();
    }
}
```

**抽象类 vs 接口**怎么选：

| 维度 | 抽象类 | 接口 |
| --- | --- | --- |
| 关系 | is-a（是什么） | can-do（有什么能力） |
| 字段 | 任意 | 只有常量 |
| 构造器 | 有 | 无 |
| 继承 | 单继承 | 多实现 |
| 典型用途 | 模板复用部分实现 | 定义能力契约 |

经验法则：**优先接口；只有需要给子类提供公共状态/部分实现时才用抽象类**。

## 6.5 函数式接口与 Lambda

**只有一个抽象方法的接口**叫**函数式接口（functional interface）**——它是 Lambda 的目标类型：

```java
@FunctionalInterface              // 注解：让编译器校验"确实只有一个抽象方法"
public interface Calculator {
    int calc(int a, int b);
}

// 传统匿名内部类写法（见 6.6）
Calculator add = new Calculator() {
    @Override
    public int calc(int a, int b) {
        return a + b;
    }
};

// Lambda 写法（Java 8+）：参数 -> 表达式
Calculator add2 = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;
Calculator max = Integer::max;    // 方法引用：更简洁

add2.calc(3, 4);   // 7
```

Lambda 本质是"接口方法的简写实现"。JDK 内置了大量函数式接口（第 9 章集合的 `forEach`、`removeIf` 都是），Stream API（第 9 章）把它们的威力发挥到极致。

## 6.6 匿名内部类与内部类

**内部类（inner class）**：定义在另一个类内部的类：

```java
public class Outer {
    private int count = 10;

    // 成员内部类：能访问外部类的私有成员
    class Inner {
        void show() {
            System.out.println(count);
        }
    }

    void run() {
        new Inner().show();
    }
}
```

**匿名内部类**：用完即弃的一次性实现（Lambda 出现前的主流写法）：

```java
Thread t = new Thread(new Runnable() {     // Runnable：函数式接口
    @Override
    public void run() {
        System.out.println("跑任务");
    }
});

// Lambda 等价：
Thread t2 = new Thread(() -> System.out.println("跑任务"));
```

新代码一律优先 Lambda；读老项目要认得出匿名内部类。

## 6.7 综合练习：支付渠道抽象

```java
public interface Payment {
    String channel();
    boolean pay(double amount);
}

public class Alipay implements Payment {
    @Override
    public String channel() { return "支付宝"; }

    @Override
    public boolean pay(double amount) {
        System.out.println("支付宝扣款 " + amount);
        return true;
    }
}

public class WechatPay implements Payment {
    @Override
    public String channel() { return "微信支付"; }

    @Override
    public boolean pay(double amount) {
        System.out.println("微信扣款 " + amount);
        return true;
    }
}

// 业务代码面向接口：新增渠道零改动
public class Checkout {
    private final Payment payment;             // 注入接口，不依赖具体渠道

    public Checkout(Payment payment) {
        this.payment = payment;
    }

    public void pay(double amount) {
        System.out.println("使用 " + payment.channel());
        payment.pay(amount);
    }
}

new Checkout(new Alipay()).pay(99.0);
new Checkout(new WechatPay()).pay(99.0);
```

这就是 Spring 依赖注入的思想原型（第 15 章 + Spring Boot 教程会大量出现这个模式）。

## 本章小结

- interface 声明能力契约；implements 实现，必须履约全部抽象方法
- 面向接口编程：声明接口类型，实现可替换
- 函数式接口（单抽象方法）是 Lambda 的目标类型
- 抽象类管"是什么"，接口管"能做什么"；优先接口

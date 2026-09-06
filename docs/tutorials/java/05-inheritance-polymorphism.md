---
title: 继承、多态与抽象类
---

# 第 5 章 · 继承、多态与抽象类

**本章目标：**

- 掌握 extends 继承与 super 调用
- 理解重写（override）与运行期多态
- 学会用抽象类定义"不完整的模板"

## 5.1 继承：代码的纵向复用

**继承（inheritance）**：子类自动获得父类的字段与方法，再补充自己的差异：

```java
public class Animal {
    protected String name;      // protected：本类 + 子类可见

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " 在吃东西");
    }
}

public class Dog extends Animal {     // Dog 是一种 Animal（is-a 关系）
    private String breed;

    public Dog(String name, String breed) {
        super(name);                  // 调用父类构造器（必须第一行）
        this.breed = breed;
    }

    public void fetch() {             // 子类独有
        System.out.println(name + " 衔回飞盘");
    }
}

Dog dog = new Dog("旺财", "柴犬");
dog.eat();     // 从父类继承来的
dog.fetch();   // 自己的
```

继承表达 **is-a**（是一种）关系；如果只是"含有"（Car 有 Engine），用组合（把 Engine 作为字段）——**组合优先于继承**是设计共识。

## 5.2 重写（override）：子类改写行为

```java
public class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }

    @Override                        // 注解：让编译器帮你校验"确实重写了"
    public void eat() {
        System.out.println(name + " 优雅地吃猫粮");
    }
}

new Cat("咪咪").eat();   // 咪咪 优雅地吃猫粮 —— 子类版本生效
```

`@Override` 注解强烈建议写：方法名拼错（`eat` 写成 `aet`）时编译器立刻报错，而不是悄悄变成新方法。

**重载 vs 重写**：重载（overload）= 同类中同名不同参（编译期选择）；重写（override）= 子类重新实现父类方法（运行期选择）。

## 5.3 多态：一个引用，多种形态

**多态（polymorphism）**：父类引用可以指向子类对象，**调用方法时执行的是实际对象的版本**：

```java
Animal[] zoo = { new Dog("旺财", "柴犬"), new Cat("咪咪") };

for (Animal a : zoo) {
    a.eat();     // 同一行代码：旺财在吃东西 / 咪咪优雅地吃猫粮
}
```

这就是"运行期多态"：编译期看引用类型（Animal，确定能调 eat），运行期看实际类型（Dog/Cat，决定执行谁的方法）。**新增一种动物只需新写一个类，循环代码一行不改**——开闭原则的雏形。

## 5.4 super 的两种用法

```java
public class Puppy extends Dog {
    public Puppy(String name) {
        super(name);                 // ① 调父类构造器（必须第一行）
    }

    @Override
    public void fetch() {
        super.fetch();               // ② 调父类版本（先执行父类逻辑）
        System.out.println("幼犬摔了一跤");
    }
}
```

## 5.5 抽象类：不完整的模板

有些父类的某个方法"没有合理默认实现"——**抽象类（abstract class）**：

```java
public abstract class Shape {
    protected String name;

    public Shape(String name) {
        this.name = name;
    }

    public abstract double area();          // 抽象方法：只有声明，没有实现

    public void describe() {                // 具体方法：子类直接继承
        System.out.println(name + " 面积 = " + area());
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        super("圆形");
        this.radius = radius;
    }

    @Override
    public double area() {                  // 子类必须实现，否则编译报错
        return Math.PI * radius * radius;
    }
}

Shape[] shapes = { new Circle(2) };
for (Shape s : shapes) s.describe();   // 圆形 面积 = 12.57
```

规则：

```text
abstract class 不能被 new（"模板"没有意义）
含抽象方法的类必须是抽象类；抽象类可以没有抽象方法
子类要么实现全部抽象方法，要么自己也是抽象类
```

## 5.6 final：三处封口

```java
final class String {}               // ① final 类：不许被继承
public final double RATE = 0.85;    // ② final 字段：常量（赋值后不可改）
public final void pay() {}          // ③ final 方法：不许被重写
```

JDK 里 String 就是 final 类——核心类不允许子类破坏其行为。

## 5.7 综合练习：员工薪资体系

```java
public abstract class Employee {
    protected String name;
    protected double baseSalary;

    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    // 不同职级算法不同 → 抽象
    public abstract double monthlyPay();

    public void printPayslip() {
        System.out.printf("%s 本月薪资：%.2f%n", name, monthlyPay());
    }
}

public class Manager extends Employee {
    private double bonus;

    public Manager(String name, double base, double bonus) {
        super(name, base);
        this.bonus = bonus;
    }

    @Override
    public double monthlyPay() {
        return baseSalary + bonus;
    }
}

public class Intern extends Employee {
    public Intern(String name, double daily) {
        super(name, daily * 22);
    }

    @Override
    public double monthlyPay() {
        return baseSalary;
    }
}

Employee[] staff = {
    new Manager("Tom", 15000, 5000),
    new Intern("Lucy", 300)
};
for (Employee e : staff) e.printPayslip();
```

## 本章小结

- extends 继承 is-a 关系；组合表达"含有"更常用
- @Override 重写父类方法；重载编译期 / 重写运行期
- 多态：父类引用指子类对象，执行实际类型的版本
- 抽象类 = 模板（不能 new）；final 封类/字段/方法

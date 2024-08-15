# 抽象方法和抽象类

## 抽象方法和抽象类
抽象类是一个声明为`abstract`的类——它可能包含也可能不包含抽象方法。抽象类不能被实例化，但可以被继承。

抽象方法是一个没有实现声明的方法（没有大括号，后面跟一个分号），像这样：
```java
abstract void moveTo(double deltaX, double deltaY);
```
如果一个类包含抽象方法，那么这个类本身必须声明为`abstract`，如下所示：
```java
public abstract class GraphicObject {
   // 声明字段
   // 声明非抽象方法
   abstract void draw();
}
```
当抽象类被继承时，子类通常为其父类中的所有抽象方法提供实现。但是，如果它没有提供，那么子类也必须声明为`abstract`。

> 注意：接口中的方法（见接口部分）如果没有声明为默认或静态，就是隐式抽象的，所以抽象修饰符不用于接口方法。（可以使用，但不必要。）

## 抽象类与接口比较
抽象类与接口类似。你不能实例化它们，它们可能包含有或没有实现声明的方法的混合。然而，抽象类中，你可以声明非静态和非最终字段，并定义`public`、`protected`和`private`的具体方法。而在接口中，所有字段都自动是`public`、`static`和`final`的，你声明或定义的所有方法（作为默认方法）都是`public`的。此外，你只能扩展一个类，无论它是否抽象，而可以实现任意数量的接口。

你应该使用抽象类还是接口呢？
- 如果以下任何陈述适用于你的情况，请考虑使用抽象类：
  - 你想在几个密切相关的类之间共享代码。
  - 你期望扩展你的抽象类的类有许多共同的方法或字段，或需要访问修饰符不是public（例如`protected`和`private`）。
  - 你想声明非静态或非最终字段。这使你能够定义可以访问和修改它们所属对象状态的方法。
- 如果以下任何陈述适用于你的情况，请考虑使用接口：
  - 你期望不相关的类将实现你的接口。例如，`Comparable`和`Cloneable`接口由许多不相关的类实现。
  - 你想指定特定数据类型的行为，但不关心谁实现其行为。
  - 你想利用类型的多重继承。

JDK中的一个抽象类示例是`AbstractMap`，它是集合框架的一部分。它的子类（包括`HashMap`、`TreeMap`和`ConcurrentHashMap`）共享许多方法（包括`get()`、`put()`、`isEmpty()`、`containsKey()`和`containsValue()`），这些是`AbstractMap`定义的。

JDK中实现多个接口的类的一个示例是`HashMap`，它实现了`Serializable`、`Cloneable`和`Map<K, V>`接口。通过阅读这个接口列表，你可以推断出`HashMap`的实例（无论由哪个开发人员或公司实现这个类）都可以被克隆，是可序列化的（这意味着它可以被转换为字节流；见序列化对象部分），并且具有映射的功能。此外，`Map<K, V>`接口已经通过许多默认方法（如`merge()`和`forEach()`）进行了增强，这些方法在旧的实现了这个接口的类中不必定义。

注意，许多软件库同时使用抽象类和接口；`HashMap`类实现了几个接口，并且还扩展了抽象类`AbstractMap`。

## 抽象类示例
在一个面向对象的绘图应用程序中，你可以绘制圆形、矩形、线条、贝塞尔曲线和许多其他图形对象。这些对象都有某些状态（例如：位置、方向、线条颜色、填充颜色）和行为（例如：移动、旋转、调整大小、绘制）是相同的。其中一些状态和行为对所有图形对象都是一样的（例如：位置、填充颜色和移动）。其他的需要不同的实现（例如，调整大小或绘制）。

所有GraphicObjects都必须能够自己绘制或调整大小；它们只是做法不同。这是使用抽象超类的完美情况。你可以利用相似之处，并声明所有图形对象都从同一个抽象父对象继承，例如`GraphicObject`。

首先，你声明一个抽象类`GraphicObject`，以提供所有子类完全共享的成员变量和方法，如当前位置和`moveTo()`方法。`GraphicObject`还声明了抽象方法，例如`draw()`或`resize()`，这些方法需要由所有子类实现，但必须以不同的方式实现。`GraphicObject`类可能看起来像这样：
```java
abstract class GraphicObject {
    int x, y;
    ...
    void moveTo(int newX, int newY) {
        ...
    }
    abstract void draw();
    abstract void resize();
}
```
每个`GraphicObject`的非抽象子类，如`Circle`和`Rectangle`，都必须为`draw()`和`resize()`方法提供实现：
```java
class Circle extends GraphicObject {
    void draw() {
        ...
    }
    void resize() {
        ...
    }
}
class Rectangle extends GraphicObject {
    void draw() {
        ...
    }
    void resize() {
        ...
    }
}
```
## 抽象类实现接口时
在接口部分提到，实现接口的类必须实现接口的所有方法。然而，可以定义一个类不实现接口的所有方法，只要该类被声明为`abstract`。例如：
```java
abstract class X implements Y {
  // 实现了Y的所有方法，除了一个
}

class XX extends X {
  // 实现Y中的剩余方法
}
```
在这种情况下，类`X`必须是抽象的，因为它没有完全实现`Y`，但类`XX`实际上确实实现了`Y`。

## 类成员
抽象类可能有`static`字段和`static`方法。你可以使用这些`static`成员与类引用一起（例如，`AbstractClass.staticMethod()`），就像你使用任何其他类一样。


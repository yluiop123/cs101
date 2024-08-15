# 创建类

## 声明类

在名为“对象、类和接口”的部分中介绍面向对象概念时，使用了`Bicycle`类作为示例，山地车、赛车和双人车作为子类。这里是一个可能的`Bicycle`类的实现示例代码，以让您对类声明有一个概览。后续部分将逐步回顾并解释类声明。目前，不必担心细节。

```java
public class Bicycle {
    // `Bicycle`类有
    // 三个字段
    public int cadence;
    public int gear;
    public int speed;

    // `Bicycle`类有
    // 一个构造器
    public Bicycle(int startCadence, int startSpeed, int startGear) {
        gear = startGear;
        cadence = startCadence;
        speed = startSpeed;
    }

    // `Bicycle`类有
    // 四个方法
    public void setCadence(int newValue) {
        cadence = newValue;
    }

    public void setGear(int newValue) {
        gear = newValue;
    }

    public void applyBrake(int decrement) {
        speed -= decrement;
    }

    public void speedUp(int increment) {
        speed += increment;
    }
}
```

一个`MountainBike`类的声明，作为`Bicycle`的子类，可能如下所示：

```java
public class MountainBike extends Bicycle {

    // `MountainBike`子类有
    // 一个字段
    public int seatHeight;

    // `MountainBike`子类有
    // 一个构造器
    public MountainBike(int startHeight, int startCadence,
                        int startSpeed, int startGear) {
        super(startCadence, startSpeed, startGear);
        seatHeight = startHeight;
    }

    // `MountainBike`子类有
    // 一个方法
    public void setHeight(int newValue) {
        seatHeight = newValue;
    }
}
```

`MountainBike`继承了`Bicycle`的所有字段和方法，并添加了字段`seatHeight`和设置它的方法（山地车的座椅可以根据地形需求上下移动）。

您已经看到类以以下方式定义：

```java
class MyClass {
    // 字段、构造器和
    // 方法声明
}
```

这是一个类声明。类体（括号之间的区域）包含所有为创建类的生命周期提供代码：用于初始化新对象的构造器、提供类及其对象状态的字段声明，以及实现类及其对象行为的方法。

前面的类声明是最小的。它只包含类声明所需的组件。您可以在类声明的开头提供更多关于类的详细信息，例如其父类的名称、它是否实现任何接口等。例如，

```java
class MyClass extends MySuperClass implements YourInterface {
    // 字段、构造器和
    // 方法声明
}
```

意味着`MyClass`是`MySuperClass`的子类，并且它实现了`YourInterface`接口。

您也可以在最开始添加诸如`public`或`private`之类的修饰符，这样您就可以看到类声明的开头可能会变得相当复杂。稍后将讨论确定其他类可以访问`MyClass`的`public`和`private`修饰符。本节的接口和继承部分将解释如何在类声明中使用`extends`和`implements`关键字以及使用它们的原因。目前，您不必担心这些额外的复杂性。

通常，类声明可以包括这些组件，按顺序：

1. 修饰符，如`public`、`private`等，您稍后将遇到的其他修饰符。（但请注意，`private`修饰符只能应用于嵌套类。）
2. 类名，按照惯例首字母大写。
3. 类的父类（超类）的名称（如果有），前面加上`extends`关键字。一个类只能扩展（子类化）一个父类。
4. 如果有，由`implements`关键字引导的类实现的接口列表，用逗号分隔。一个类可以实现多个接口。
5. 用大括号`{}`包围的类体。

## 声明成员变量

有几种类型的变量：
- 类中的成员变量——这些称为字段。
- 方法或代码块中的变量——这些称为局部变量。
- 方法声明中的变量——这些称为参数。
- `Bicycle`类使用以下代码行来定义其字段：

```java
public int cadence;
public int gear;
public int speed;
```

字段声明由三个组成部分组成，按顺序：

1. 零个或多个修饰符，如`public`或`private`。
2. 字段的类型。
3. 字段的名称。

`Bicycle`的字段命名为`cadence`、`gear`和`speed`，并且都是整数数据类型（`int`）。`public`关键字将这些字段标识为公共成员，可以被任何可以访问类的类访问。

## 控制谁可以访问成员

使用的首个（最左边的）修饰符允许您控制其他类可以访问成员字段。目前，只考虑`public`和`private`。稍后将讨论其他访问修饰符。

- `public`修饰符——字段可以从所有类访问。
- `private`修饰符——字段只能在其自己的类中访问。

封装的精神是通常将字段设置为私有的。这意味着它们只能直接从`Bicycle`类中访问。然而，我们仍然需要访问这些值。这可以通过添加公共方法间接完成，以获取字段值：

```java
public class Bicycle {
    private int cadence;
    private int gear;
    private int speed;

    public Bicycle(int startCadence, int startSpeed, int startGear) {
        gear = startGear;
        cadence = startCadence;
        speed = startSpeed;
    }

    public int getCadence() {
        return cadence;
    }

    public void setCadence(int newValue) {
        cadence = newValue;
    }

    public int getGear() {
        return gear;
    }

    public void setGear(int newValue) {
        gear = newValue;
    }

    public int getSpeed() {
        return speed;
    }

    public void applyBrake(int decrement) {
        speed -= decrement;
    }

    public void speedUp(int increment) {
        speed += increment;
    }
}
```

## 设置变量的类型

所有变量必须有一个类型。您可以使用原始类型，如`int`、`float`、`boolean`等。或者您可以使用引用类型，如字符串、数组或对象。

## 命名变量

无论是字段、局部变量还是参数，所有变量都遵循在语言基础部分，变量命名中介绍的相同的命名规则和约定。

在本节中，请注意，方法和类名使用相同的命名规则和约定，除了

- 类名的第一个字母应该大写，
- 方法名的第一个（或唯一）单词应该是一个动词。


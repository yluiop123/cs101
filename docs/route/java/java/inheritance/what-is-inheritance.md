# 继承

## 继承

在前面的章节中，你已经多次看到继承这个概念。在Java语言中，类可以从其他类派生出来，从而继承这些类的字段和方法。

> 定义：从一个类派生出来的类称为子类（也称为派生类、扩展类或子类）。派生子类的类称为超类（也称为基类或父类）。

> 除了`Object`类没有超类之外，每个类只有一个直接的超类（单继承）。如果没有显式指定其他超类，每个类隐式地是`Object`的子类。

> 类可以从一个类派生出来，这个类又可以从另一个类派生出来，以此类推，最终派生自最顶层的类`Object`。这样的类被称为从`Object`回溯到所有继承链中的类。

继承的概念简单但强大：当你想创建一个新类，并且已经有一个类包含了你想要的一些代码时，你可以从现有类派生出你的新类。这样做，你可以重用现有类的字段和方法，而不必自己编写（和调试！）它们。

一个子类继承了其超类的所有成员（字段、方法和嵌套类）。构造函数不是成员，因此它们不会被子类继承，但可以从子类调用超类的构造函数。

`Object`类在`java.lang`包中定义并实现了对所有类都通用的行为——包括你自己写的那些。在Java平台上，许多类直接从`Object`派生出来，其他类又从这些类派生出来，等等，形成了一个类的层次结构。

层次结构的顶部，`Object`是所有类中最通用的。层次结构底部的类提供更专业的行为。

## 继承的一个例子

这里是在类和对象部分展示的`Bicycle`类的一个可能实现的示例代码：

```java
public class Bicycle {
    // the Bicycle class has three fields
    public int cadence;
    public int gear;
    public int speed;

    // the Bicycle class has one constructor
    public Bicycle(int startCadence, int startSpeed, int startGear) {
        gear = startGear;
        cadence = startCadence;
        speed = startSpeed;
    }

    // the Bicycle class has four methods
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

`MountainBike`类的类声明，作为`Bicycle`的子类，可能看起来像这样：

```java
public class MountainBike extends Bicycle {
    // the MountainBike subclass adds one field
    public int seatHeight;

    // the MountainBike subclass has one constructor
    public MountainBike(int startHeight,
                        int startCadence,
                        int startSpeed,
                        int startGear) {
        super(startCadence, startSpeed, startGear);
        seatHeight = startHeight;
    }

    // the MountainBike subclass adds one method
    public void setHeight(int newValue) {
        seatHeight = newValue;
    }
}
```

`MountainBike`继承了`Bicycle`的所有字段和方法，并添加了字段`seatHeight`以及一个设置它的方法。除了构造函数之外，就好像你从头开始完全编写了一个新的`MountainBike`类，有四个字段和五个方法。然而，你不必做所有这些工作。如果`Bicycle`类中的方法很复杂，并且需要大量的时间来调试，这将特别有价值。

## 子类中可以做什么

子类继承了其父类的所有`public`和`protected`成员，不管子类在哪个包中。如果子类和父类在同一个包中，它还继承了父类的包私有成员。你可以像使用其他成员一样使用继承的成员，替换它们，隐藏它们，或用新成员来补充它们：

- 继承的字段可以直接使用，就像其他字段一样。
- 你可以在子类中声明一个与超类中同名的字段，从而隐藏它（不推荐）。
- 你可以在子类中声明一些不在超类中的新字段。
- 继承的方法可以直接使用。
- 你可以在子类中编写一个与超类中具有相同签名的新实例方法，从而覆盖它。
- 你可以在子类中编写一个与超类中具有相同签名的新静态方法，从而隐藏它。
- 你可以在子类中声明一些不在超类中的新方法。
- 你可以编写一个子类构造函数来调用超类的构造函数，无论是隐式地还是通过使用`super`关键字。
- 本课程的后续部分将扩展这些主题。

## 超类中的私有成员

子类不继承其父类的私有成员。然而，如果超类有用于访问其私有字段的公共或受保护的方法，这些方法也可以被子类使用。

嵌套类可以访问其封闭类的所有私有成员——包括字段和方法。因此，被子类继承的公共或受保护的嵌套类间接访问了超类的所有私有成员。

## 对象的转换

我们已经看到，一个对象是它实例化的类的类型。例如，如果我们写：

```java
public MountainBike myBike = new MountainBike();
```

那么`myBike`就是`MountainBike`类型。

`MountainBike`是从`Bicycle`和`Object`派生出来的。因此，`MountainBike`是一个`Bicycle`，也是一个`Object`，并且可以在需要`Bicycle`或`Object`对象的地方使用。

反过来则不一定正确：一个`Bicycle`可能是一个`MountainBike`，但不一定。同样，一个`Object`可能是一个`Bicycle`或`MountainBike`，但不一定。

转换显示了使用一个类型的对象代替另一个类型的对象，在允许继承和实现的对象中。例如，如果我们写：

```java
Object obj = new MountainBike();
```

那么`obj`既是`Object`也是一个`MountainBike`（直到`obj`被分配给另一个不是`MountainBike`的对象为止）。这称为_隐式转换_。

另一方面，如果我们写：

```java
MountainBike myBike = obj;
```

我们会得到一个编译时错误，因为编译器不知道`obj`是一个`MountainBike`。然而，我们可以通过显式转换告诉编译器我们承诺将一个`MountainBike`分配给`obj`：

```java
MountainBike myBike = (MountainBike)obj;
```

这个转换插入了一个运行时检查，以确保`obj`被分配了一个`MountainBike`，以便编译器可以安全地假定`obj`是一个`MountainBike`。如果`obj`在运行时不是`MountainBike`，将抛出一个异常。

> 注意：你可以使用`instanceof`运算符对特定对象的类型进行逻辑测试。这可以避免由于不当转换而导致的运行时错误。例如：

```java
if (obj instanceof MountainBike) {
    MountainBike myBike = (MountainBike)obj;
}
```

在这里，`instanceof`运算符验证`obj`是否指向一个`MountainBike`，这样我们就可以安全地进行转换，知道不会抛出运行时异常。

## 状态、实现和类型的多重继承

类和接口之间的一个显著区别是类可以有字段，而接口不能。此外，你可以实例化一个类来创建一个对象，而接口则不能。正如在"什么是对象？"一节中解释的，一个对象在其字段中存储其状态，这些字段在类中定义。Java编程语言不允许你扩展多个类的原因之一是为了避免多重继承状态的问题，这是从多个类继承字段的能力。例如，假设你可以定义一个新类，它扩展了多个类。当你通过实例化这个类来创建一个对象时，该对象将从所有超类的类中继承字段。如果来自不同超类的方法或构造函数实例化了同一个字段怎么办？哪个方法或构造函数将优先？因为接口不包含字段，所以你不必担心由多重继承状态引起的问题。

_多重继承实现_是从多个类继承方法定义的能力。这种多重继承类型的问题包括名称冲突和歧义。当支持这种类型的多重继承的编程语言的编译器遇到包含具有相同名称的方法的超类时，有时它们无法确定要访问或调用哪个成员或方法。此外，程序员可能会无意中通过向超类添加一个新方法来引入名称冲突。默认方法引入了一种多重继承实现的形式。一个类可以实现多个接口，这些接口可以包含具有相同名称的默认方法。Java编译器提供了一些规则来确定特定类使用哪个默认方法。

Java编程语言支持类型的多重继承，这是类实现多个接口的能力。一个对象可以有多个类型：它自己的类的类型以及它实现的所有接口的类型。这意味着如果一个变量被声明为接口的类型，那么它的值可以引用任何从实现该接口的任何类实例化的对象。这在"使用接口作为类型"一节中进行了讨论。

与多重继承实现一样，一个类可以继承它扩展的接口中定义的方法的不同实现（作为`default`或`static`）。在这种情况下，编译器或用户必须决定使用哪一个。

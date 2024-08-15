# 重写和隐藏方法

## 实例方法
子类中的实例方法如果具有与超类中的实例方法相同的签名（名称、参数数量及其类型）和返回类型，则会覆盖超类中的方法。

子类覆盖方法的能力允许一个类从行为“足够接近”的超类继承，然后根据需要修改行为。重写的方法具有与它所覆盖的方法相同的名称、参数数量和类型以及返回类型。重写的方法还可以返回被覆盖方法返回类型的子类型。这种子类型被称为协变返回类型。

在重写方法时，您可能想要使用`@Override`注解，这指示编译器您打算覆盖超类中的方法。如果出于某种原因，编译器检测到该方法在某个超类中不存在，则会生成一个错误。有关`@Override`的更多信息，请参见注解部分。

## 静态方法
如果子类定义了一个与超类中的静态方法具有相同签名的静态方法，则子类中的方法隐藏了超类中的方法。

隐藏静态方法与重写实例方法之间的区别具有重要的意义：
- 被调用的覆盖实例方法的版本是子类中的版本。
- 被调用的隐藏静态方法的版本取决于它是从超类还是子类调用的。

考虑一个包含两个类的例子。第一个是`Animal`，它包含一个实例方法和一个静态方法：

```java
public class Animal {
    public static void testClassMethod() {
        System.out.println("The static method in Animal");
    }
    public void testInstanceMethod() {
        System.out.println("The instance method in Animal");
    }
}
```

第二个类，`Animal`的子类，称为`Cat`：

```java
public class Cat extends Animal {
    public static void testClassMethod() {
        System.out.println("The static method in Cat");
    }
    public void testInstanceMethod() {
        System.out.println("The instance method in Cat");
    }

    public static void main(String[] args) {
        Cat myCat = new Cat();
        Animal myAnimal = myCat;
        Animal.testClassMethod();
        myAnimal.testInstanceMethod();
    }
}
```

`Cat`类覆盖了`Animal`中的实例方法并隐藏了`Animal`中的静态方法。这个类的主要方法创建了一个`Cat`的实例，并在类上调用`testClassMethod`，在实例上调用`testInstanceMethod`。

这个程序的输出如下：

```
The static method in Animal
The instance method in Cat
```

正如预期的那样，被调用的隐藏静态方法的版本是超类中的版本，而被调用的覆盖实例方法的版本是子类中的版本。

## 接口方法
接口中的默认方法和抽象方法像实例方法一样被继承。然而，当类的超类型提供具有相同签名的多个默认方法时，Java编译器遵循继承规则来解决名称冲突。这些规则由以下两个原则驱动：

- 实例方法优先于接口默认方法。

考虑以下类和接口：

```java
public class Horse {
    public String identifyMyself() {
        return "I am a horse.";
    }
}

public interface Flyer {
    default public String identifyMyself() {
        return "I am able to fly.";
    }
}

public interface Mythical {
    default public String identifyMyself() {
        return "I am a mythical creature.";
    }
}

public class Pegasus extends Horse implements Flyer, Mythical {
    public static void main(String... args) {
        Pegasus myApp = new Pegasus();
        System.out.println(myApp.identifyMyself());
    }
}
```

方法`Pegasus.identifyMyself()`返回字符串`I am a horse`。

- 已经被其他候选者覆盖的方法将被忽略。这种情况可能发生在超类型共享一个共同祖先时。

考虑以下接口和类：

```java
public interface Animal {
    default public String identifyMyself() {
        return "I am an animal.";
    }
}

public interface EggLayer extends Animal {
    default public String identifyMyself() {
        return "I am able to lay eggs.";
    }
}

public interface FireBreather extends Animal { }

public class Dragon implements EggLayer, FireBreather {
    public static void main (String... args) {
        Dragon myApp = new Dragon();
        System.out.println(myApp.identifyMyself());
    }
}
```

方法`Dragon.identifyMyself()`返回字符串`I am able to lay eggs`。

如果两个或多个独立定义的默认方法发生冲突，或者默认方法与抽象方法冲突，那么Java编译器将产生编译时错误。您必须显式覆盖超类型方法。

考虑关于现在可以飞行的计算机控制汽车的例子。您有两个接口（`OperateCar`和`FlyCar`），它们为相同的方法（`startEngine()`）提供默认实现：

```java
public interface OperateCar {
    // ...
    default public int startEngine(EncryptedKey key) {
        // 实现
    }
}

public interface FlyCar {
    // ...
    default public int startEngine(EncryptedKey key) {
        // 实现
    }
}
```

实现`OperateCar`和`FlyCar`的类必须覆盖`startEngine()`方法。您可以使用`super`关键字调用任何默认实现。

```java
public class FlyingCar implements OperateCar, FlyCar {
    // ...
    public int startEngine(EncryptedKey key) {
        FlyCar.super.startEngine(key);
        OperateCar.super.startEngine(key);
    }
}
```

`super`前面的名称（在这个例子中，`FlyCar`或`OperateCar`）必须引用定义或继承被调用方法默认值的直接超接口。这种方法调用形式不仅限于区分包含具有相同签名的默认方法的多个实现接口。您可以在类和接口中使用`super`关键字来调用默认方法。

从类中继承的实例方法可以覆盖抽象接口方法。考虑以下接口和类：

```java
public interface Mammal {
    String identifyMyself();
}

public class Horse {
    public String identifyMyself() {
        return "I am a horse.";
    }
}

public class Mustang extends Horse implements Mammal {
    public static void main(String... args) {
        Mustang myApp = new Mustang();
        System.out.println(myApp.identifyMyself());
    }
}
```

方法`Mustang.identifyMyself()`返回字符串`I am a horse`。类`Mustang`从类`Horse`继承了`identifyMyself()`方法，该方法覆盖了接口`Mammal`中同名的抽象方法。

> 注意：接口中的静态方法永远不会被继承。

## 修饰符
重写方法的访问说明符可以允许更多的访问权限，但不能比被重写的方法更少。例如，超类中的`protected`实例方法可以在子类中变为`public`，但不能变为`private`。

如果您尝试将超类中的实例方法更改为子类中的静态方法，反之亦然，您将得到编译时错误。

## 总结
下表总结了当您定义一个与超类中的方法具有相同签名时会发生什么。

| | 超类实例方法 | 超类静态方法 |
| --- | --- | --- |
| 子类实例方法 | 覆盖 | 生成编译时错误 |
| 子类静态方法 | 生成编译时错误 | 隐藏 |

> 注意：在子类中，您可以重载从超类继承的方法。这些重载的方法既不隐藏也不覆盖超类实例方法——它们是新的方法，仅属于子类。


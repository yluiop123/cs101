# 嵌套类

Java 编程语言允许您在另一个类中定义一个类，这样的类称为嵌套类：

```java
class OuterClass {
    ...
    class NestedClass {
        ...
    }
}
```

## 术语：嵌套类分为两类：非静态和静态。非静态嵌套类称为**内部类**。声明为静态的嵌套类称为**静态嵌套类**。

```java
class OuterClass {
    ...
    class InnerClass {
        ...
    }
    static class StaticNestedClass {
        ...
    }
}
```

嵌套类是其外围类的成员。非静态嵌套类（内部类）可以访问外围类的其他成员，即使它们被声明为 `private`。静态嵌套类不能访问外围类的其他成员。作为 `OuterClass` 的成员，嵌套类可以被声明为 `private`、`public`、`protected` 或包私有。回想一下，外围类只能被声明为 `public` 或包私有。

### 为什么要使用嵌套类？

使用嵌套类的强大理由包括：

- 它是逻辑上分组只在一个地方使用的类的途径：如果一个类只对另一个类有用，那么将它嵌入到那个类中并将两者保持在一起是合乎逻辑的。嵌套这样的“辅助类”可以使它们的包更加精简。
- 它增加了封装性：考虑两个顶级类 `A` 和 `B`，其中 `B` 需要访问 `A` 的成员，否则这些成员将被声明为私有。通过将类 `B` 隐藏在类 `A` 内部，`A` 的成员可以被声明为 `private`，而 `B` 可以访问它们。此外，`B` 本身也可以从外部隐藏。
- 它可以使代码更易于阅读和维护：将小类嵌套在顶级类中，将代码放置在使用它的位置附近。

### 内部类

与实例方法和变量一样，内部类与外围类的实例相关联，并且可以直接访问该对象的方法和字段。此外，由于内部类与实例相关联，它本身不能定义任何静态成员。

内部类的实例存在于外围类的实例中。考虑以下类：

```java
class OuterClass {
    ...
    class InnerClass {
        ...
    }
}
```

`InnerClass` 的实例只能存在于 `OuterClass` 的实例内部，并且可以直接访问其外围实例的方法和字段。

要实例化内部类，您必须首先实例化外围类。然后，使用以下语法在外围对象内部创建内部对象：

```java
OuterClass outerObject = new OuterClass();
OuterClass.InnerClass innerObject = outerObject.new InnerClass();
```

有两种特殊的内部类：局部类和匿名类。

### 静态嵌套类

与类方法和变量一样，静态嵌套类与外围类相关联。并且像静态类方法一样，静态嵌套类不能直接引用在其外围类中定义的实例变量或方法：它只能通过对象引用使用它们。

> 注意：静态嵌套类与其外围类的实例成员（和其他类）的交互就像任何其他顶级类一样。实际上，静态嵌套类在行为上是一个顶级类，它被嵌套在另一个顶级类中以方便打包。内部类和嵌套静态类示例也演示了这一点。

您实例化静态嵌套类的方式与顶级类相同：

```java
StaticNestedClass staticNestedObject = new StaticNestedClass();
```

### 内部类和嵌套静态类示例

以下示例 `OuterClass` 以及 `TopLevelClass` 演示了内部类（`InnerClass`）、嵌套静态类（`StaticNestedClass`）和顶级类（`TopLevelClass`）可以访问 `OuterClass` 的哪些类成员：

#### OuterClass.java

```java
public class OuterClass {

    String outerField = "Outer field";
    static String staticOuterField = "Static outer field";

    class InnerClass {
        void accessMembers() {
            System.out.println(outerField);
            System.out.println(staticOuterField);
        }
    }

    static class StaticNestedClass {
        void accessMembers(OuterClass outer) {
            // 编译器错误：无法对非静态字段 outerField 进行静态引用
            // System.out.println(outerField);
            System.out.println(outer.outerField);
            System.out.println(staticOuterField);
        }
    }

    public static void main(String[] args) {
        System.out.println("Inner class:");
        System.out.println("------------");
        OuterClass outerObject = new OuterClass();
        OuterClass.InnerClass innerObject = outerObject.new InnerClass();
        innerObject.accessMembers();

        System.out.println("\nStatic nested class:");
        System.out.println("--------------------");
        StaticNestedClass staticNestedObject = new StaticNestedClass();
        staticNestedObject.accessMembers(outerObject);

        System.out.println("\nTop-level class:");
        System.out.println("--------------------");
        TopLevelClass topLevelObject = new TopLevelClass();
        topLevelObject.accessMembers(outerObject);
    }
}
```

#### TopLevelClass.java

```java
public class TopLevelClass {

    void accessMembers(OuterClass outer) {
        // 编译器错误：无法对非静态字段 OuterClass.outerField 进行静态引用
        // System.out.println(OuterClass.outerField);
        System.out.println(outer.outerField);
        System.out.println(OuterClass.staticOuterField);
    }
}
```

此示例打印以下输出：

```
Inner class:
------------
Outer field
Static outer field

Static nested class:
--------------------
Outer field
Static outer field

Top-level class:
--------------------
Outer field
Static outer field
```

注意，静态嵌套类与其外围类的实例成员的交互就像任何其他顶级类一样。静态嵌套类 `StaticNestedClass` 无法直接访问 `outerField`，因为它是外围类 `OuterClass` 的实例变量。Java 编译器在突出显示的语句处生成错误：

```java
static class StaticNestedClass {
    void accessMembers(OuterClass outer) {
       // 编译器错误：无法对非静态字段 outerField 进行静态引用
       System.out.println(outerField);
    }
}
```

要修复此错误，请通过对象引用访问 `outerField`：

```java
System.out.println(outer.outerField);
```

同样，顶级类 `TopLevelClass` 也无法直接访问 `outerField`。

### 遮蔽

如果特定作用域（例如内部类或方法定义）中的类型声明（例如成员变量或参数名称）与外围作用域中的声明具有相同的名称，则该声明将遮蔽外围作用域的声明。您无法仅通过名称单独引用被遮蔽的声明。以下示例 `ShadowTest` 演示了这一点：

```java
public class ShadowTest {

    public int x = 0;

    class FirstLevel {

        public int x = 1;

        void methodInFirstLevel(int x) {
            System.out.println("x = " + x);
            System.out.println("this.x = " + this.x);
            System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
        }
    }

    public static void main(String... args) {
        ShadowTest st = new ShadowTest();
        ShadowTest.FirstLevel fl = st.new FirstLevel();
        fl.methodInFirstLevel(23);
    }
}
```

以下是此示例的输出：

```
x = 23
this.x = 1
ShadowTest.this.x = 0
```

此示例定义了三个名为 `x` 的变量：类 `ShadowTest` 的成员变量、内部类 `FirstLevel` 的成员变量和方法 `methodInFirstLevel()` 中的参数。作为 `methodInFirstLevel()` 方法参数定义的 `x` 变量遮蔽了内部类 `FirstLevel` 的变量。因此，当您在方法 `methodInFirstLevel()` 中使用变量 `x` 时，它指的是方法参数。要引用内部类 `FirstLevel` 的成员变量，使用关键字 `this` 表示外围作用域：

```java
System.out.println("this.x = " + this.x);
```

通过它们所属的类名引用外围更大作用域的成员变量。例如，以下语句从方法 `methodInFirstLevel()` 访问类 `ShadowTest` 的成员变量：

```java
System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
```

### 序列化

强烈不推荐对内部类进行序列化，包括局部类和匿名类。当Java编译器编译某些结构时，例如内部类，它会创建合成结构；这些是类、方法、字段和其他在源代码中没有对应结构的结构。合成结构使得Java编译器能够在不改变JVM的情况下实现新的Java语言特性。

然而，不同Java编译器实现之间的合成结构可能会有所不同，这意味着 `.class` 文件在不同实现之间也可能有所不同。因此，如果您序列化一个内部类，然后使用不同的JRE实现对其进行反序列化，可能会遇到兼容性问题。

## 内部类示例

要看到内部类的实际应用，首先考虑一个数组。以下示例创建一个数组，用整数值填充它，然后只输出数组的偶数索引值，按升序排列。

`DataStructure.java` 示例包括：

- `DataStructure` 外围类，它包括一个构造函数来创建一个包含连续整数值数组的 `DataStructure` 实例（0、1、2、3等），以及一个打印具有偶数索引值的数组元素的方法。
- `EvenIterator` 内部类，它实现了 `DataStructureIterator` 接口，该接口扩展了 `Iterator<Integer>` 接口。迭代器用于遍历数据结构，通常具有测试最后一个元素、检索当前元素和移动到下一个元素的方法。
- 一个主方法，它实例化一个 `DataStructure` 对象 (`ds`)，然后调用 `printEven()` 方法打印具有偶数索引值的 `arrayOfInts` 数组元素。

```java
public class DataStructure {

    // 创建一个数组
    private final static int SIZE = 15;
    private int[] arrayOfInts = new int[SIZE];

    public DataStructure() {
        // 用升序整数值填充数组
        for (int i = 0; i < SIZE; i++) {
            arrayOfInts[i] = i;
        }
    }

    public void printEven() {

        // 打印数组的偶数索引值
        DataStructureIterator iterator = this.new EvenIterator();
        while (iterator.hasNext()) {
            System.out.print(iterator.next() + " ");
        }
        System.out.println();
    }

    interface DataStructureIterator extends java.util.Iterator<Integer> { }

    // 内部类实现了 DataStructureIterator 接口，它扩展了 Iterator<Integer> 接口

    private class EvenIterator implements DataStructureIterator {

        // 从数组开头开始遍历
        private int nextIndex = 0;

        public boolean hasNext() {

            // 检查当前元素是否是数组中的最后一个元素
            return (nextIndex <= SIZE - 1);
        }

        public Integer next() {

            // 记录数组的偶数索引值
            Integer retValue = Integer.valueOf(arrayOfInts[nextIndex]);

            // 获取下一个偶数元素
            nextIndex += 2;
            return retValue;
        }
    }

    public static void main(String s[]) {

        // 用整数值填充数组并只打印出偶数索引的值
        DataStructure ds = new DataStructure();
        ds.printEven();
    }
}
```

输出为：

```
0 2 4 6 8 10 12 14
```

注意，`EvenIterator` 类直接引用了 `DataStructure` 对象的 `arrayOfInts` 实例变量。

您可以使用内部类来实现如本示例所示的辅助类。要处理用户界面事件，您必须知道如何使用内部类，因为事件处理机制广泛使用了它们。

### 局部和匿名类

还有两种类型的内部类。您可以在方法体内声明一个内部类。这些类称为局部类。您也可以在方法体内声明一个内部类而不命名该类。这些类称为匿名类。

### 修饰符

您可以对内部类使用与外围类其他成员相同的修饰符。例如，您可以使用访问说明符 `private`、`public` 和 `protected` 来限制对内部类的访问，就像您对其他类成员使用它们一样。

## 局部类

局部类是在块中定义的类，块是一组用大括号括起来的零个或多个语句。您通常会发现局部类在方法体中定义。

本节涵盖以下主题：

- 声明局部类
- 访问外围类的成员
- 遮蔽和局部类
- 局部类与内部类相似

### 声明局部类

您可以在任何块内定义局部类（有关更多信息，请参见表达式、语句和块）。例如，您可以在方法体、for 循环或 if 子句中定义局部类。

以下示例 `LocalClassExample` 验证两个电话号码。它在 `validatePhoneNumber()` 方法中定义了局部类 `PhoneNumber`：

```java
public class LocalClassExample {

    static String regularExpression = "[^0-9]";

    public static void validatePhoneNumber(
        String phoneNumber1, String phoneNumber2) {

        final int numberLength = 10;

        // JDK 8及更高版本中有效：

        // int numberLength = 10;

        class PhoneNumber {

            String formattedPhoneNumber = null;

            PhoneNumber(String phoneNumber){
                // numberLength = 7;
                String currentNumber = phoneNumber.replaceAll(
                  regularExpression, "");
                if (currentNumber.length() == numberLength)
                    formattedPhoneNumber = currentNumber;
                else
                    formattedPhoneNumber = null;
            }

            public String getNumber() {
                return formattedPhoneNumber;
            }

            // JDK 8及更高版本中有效：

//            public void printOriginalNumbers() {
//                System.out.println("Original numbers are " + phoneNumber1 +
//                    " and " + phoneNumber2);
//            }
        }

        PhoneNumber myNumber1 = new PhoneNumber(phoneNumber1);
        PhoneNumber myNumber2 = new PhoneNumber(phoneNumber2);

        // JDK 8及更高版本中有效：

//        myNumber1.printOriginalNumbers();

        if (myNumber1.getNumber() == null)
            System.out.println("First number is invalid");
        else
            System.out.println("First number is " + myNumber1.getNumber());
        if (myNumber2.getNumber() == null)
            System.out.println("Second number is invalid");
        else
            System.out.println("Second number is " + myNumber2.getNumber());
    }

    public static void main(String... args) {
        validatePhoneNumber("123-456-7890", "456-7890");
    }
}
```

该示例首先通过删除电话号码中除了0到9的数字之外的所有字符来验证电话号码。之后，它检查电话号码是否正好包含十个数字（北美电话号码的长度）。此示例打印以下内容：

```
First number is 1234567890
Second number is invalid
```

### 访问外围类的成员

局部类可以访问其外围类的成员。在前面的示例中，`PhoneNumber()` 构造函数访问了成员 `LocalClassExample.regularExpression`。

此外，局部类可以访问局部变量。然而，局部类只能访问被声明为 `final` 的局部变量。当局部类访问外围块的局部变量或参数时，它会捕获该变量或参数。例如，`PhoneNumber()` 构造函数可以访问局部变量 `numberLength`，因为它被声明为 `final`；`numberLength` 是一个被捕获的变量。

但是，从Java SE 8开始，局部类可以访问外围块中被声明为 `final` 或 _实际上最终的_ 的局部变量和参数。一个在初始化后其值从未改变的变量或参数是 _实际上最终的_。例如，假设变量 `numberLength` 没有被声明为 `final`，并且您在 `PhoneNumber()` 构造函数中添加了突出显示的赋值语句，以将有效电话号码的长度更改为7位数字：

```java
PhoneNumber(String phoneNumber) {
    numberLength = 7;
    String currentNumber = phoneNumber.replaceAll(
        regularExpression, "");
    if (currentNumber.length() == numberLength)
        formattedPhoneNumber = currentNumber;
    else
        formattedPhoneNumber = null;
}
```

由于这个赋值语句，变量 `numberLength` 不再是实际上最终的。结果，Java 编译器生成了一个错误消息，类似于“从内部类引用的局部变量必须最终的或实际上最终的”，其中内部类 `PhoneNumber` 尝试访问 `numberLength` 变量：

```java
if (currentNumber.length() == numberLength)
```

从Java SE 8开始，如果您在方法中声明局部类，它可以访问方法的参数。例如，您可以在 `PhoneNumber` 局部类中定义以下方法：

```java
public void printOriginalNumbers() {
    System.out.println("Original numbers are " + phoneNumber1 +
        " and " + phoneNumber2);
}
```

方法 `printOriginalNumbers()` 访问了 `validatePhoneNumber()` 方法的参数 `phoneNumber1` 和 `phoneNumber2`。

在局部类中，类型声明（如变量）会遮蔽外围作用域中具有相同名称的声明。有关详细信息，请参见遮蔽。

### 局部类与内部类相似

局部类与内部类相似，因为它们不能定义或声明任何静态成员。在静态方法中定义的局部类，例如在静态方法 `validatePhoneNumber()` 中定义的类 `PhoneNumber`，只能引用外围类的静态成员。例如，如果您没有将成员变量 `regularExpression` 定义为 `static`，那么Java编译器会生成一个错误，类似于“非静态变量 regularExpression 不能从静态上下文中引用。”

局部类是非静态的，因为它们可以访问外围块的实例成员。因此，它们不能包含大多数种类的静态声明。

您不能在块中声明接口；接口本质上是静态的。例如，以下代码片段不编译，因为接口 `HelloThere` 是在方法 `greetInEnglish()` 的体内定义的：

```java
public void greetInEnglish() {
    interface HelloThere {
       public void greet();
    }
    class EnglishHelloThere implements HelloThere {
        public void greet() {
            System.out.println("Hello " + name);
        }
    }
    HelloThere myGreeting = new EnglishHelloThere();
    myGreeting.greet();
}
```

您不能在局部类中声明静态初始化器或成员接口。以下代码片段不编译，因为方法 `EnglishGoodbye.sayGoodbye()` 被声明为静态。当编译器遇到这个方法定义时，会生成一个错误，类似于“修饰符 `static` 只允许在常量变量声明”：

```java
public void sayGoodbyeInEnglish() {
    class EnglishGoodbye {
        public static void sayGoodbye() {
            System.out.println("Bye bye");
        }
    }
    EnglishGoodbye.sayGoodbye();
}
```

如果它们是常量变量，局部类可以有静态成员。（常量变量是原始类型或 `String` 类型的变量，被声明为 `final` 并用编译时常量表达式初始化。编译时常量表达式通常是可以在编译时评估的字符串或算术表达式。有关更多信息，请参见理解类成员。）以下代码片段编译，因为静态成员 `EnglishGoodbye.farewell` 是一个常量变量：

```java
public void sayGoodbyeInEnglish() {
    class EnglishGoodbye {
        public static final String farewell = "Bye bye";
        public void sayGoodbye() {
            System.out.println(farewell);
        }
    }
    EnglishGoodbye myEnglishGoodbye = new EnglishGoodbye();
    myEnglishGoodbye.sayGoodbye();
}
```

## 匿名类

匿名类可以使您的代码更加简洁。它们允许您同时声明和实例化一个类。它们像局部类，只是它们没有名称。如果您只需要使用局部类一次，请使用它们。

### 声明匿名类

虽然局部类是类声明，但匿名类是表达式，这意味着您在另一个表达式中定义类。以下示例 `HelloWorldAnonymousClasses` 在局部变量 `frenchGreeting` 和 `spanishGreeting` 的初始化语句中使用匿名类，但使用局部类对变量 `englishGreeting` 进行初始化：

```java
public class HelloWorldAnonymousClasses {

    interface HelloWorld {
        public void greet();
        public void greetSomeone(String someone);
    }

    public void sayHello() {

        class EnglishGreeting implements HelloWorld {
            String name = "world";
            public void greet() {
                greetSomeone("world");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Hello " + name);
            }
        }

        HelloWorld englishGreeting = new EnglishGreeting();

        HelloWorld frenchGreeting = new HelloWorld() {
            String name = "tout le monde";
            public void greet() {
                greetSomeone("tout le monde");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Salut " + name);
            }
        };

        HelloWorld spanishGreeting = new HelloWorld() {
            String name = "mundo";
            public void greet() {
                greetSomeone("mundo");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Hola, " + name);
            }
        };
        englishGreeting.greet();
        frenchGreeting.greetSomeone("Fred");
        spanishGreeting.greet();
    }

    public static void main(String... args) {
        HelloWorldAnonymousClasses myApp =
            new HelloWorldAnonymousClasses();
        myApp.sayHello();
    }
}
```

### 匿名类的语法

如前所述，匿名类是一个表达式。匿名类表达式的语法类似于构造函数调用，只不过它包含在代码块中的类定义。

考虑 `frenchGreeting` 对象的实例化：

```java
HelloWorld frenchGreeting = new HelloWorld() {
    String name = "tout le monde";
    public void greet() {
        greetSomeone("tout le monde");
    }
    public void greetSomeone(String someone) {
        name = someone;
        System.out.println("Salut " + name);
    }
};
```

匿名类表达式由以下组成：

- `new` 操作符
- 要实现的接口名称或要扩展的类的名称。在此示例中，匿名类正在实现 `HelloWorld` 接口。
- 包含构造函数参数的括号，就像普通的类实例创建表达式一样。注意：当您实现接口时，没有构造函数，因此您使用空括号，就像在此示例中一样。
- 一个主体，这是一个类声明主体。更具体地说，在主体中，允许方法声明，但不允许语句。
- 因为匿名类定义是一个表达式，它必须是语句的一部分。在此示例中，匿名类表达式是实例化 `frenchGreeting` 对象的语句的一部分。（这解释了为什么封闭大括号后有分号。）

### 访问外围作用域的局部变量，声明和访问匿名类的成员

像局部类一样，匿名类也可以捕获变量；它们对外围作用域的局部变量具有相同的访问权限：

- 匿名类可以访问其外围类的成员。
- 匿名类不能访问其外围作用域中未声明为 `final` 或实际上最终的局部变量。
- 像嵌套类一样，在匿名类中类型（例如变量）的声明会遮蔽外围作用域中具有相同名称的任何其他声明。有关详细信息，请参见遮蔽。

匿名类在成员方面也与局部类具有相同的限制：

- 您不能在匿名类中声明静态初始化器或成员接口。
- 如果它们是常量变量，匿名类可以具有静态成员。

请注意，您可以在匿名类中声明以下内容：

- 字段
- 额外的方法（即使它们没有实现超类型的任何方法）
- 实例初始化器
- 局部类

然而，您不能在匿名类中声明构造函数。




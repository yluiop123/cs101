# Java反射

## 反射

Java反射允许一个对象照镜子，发现它拥有哪些字段、方法和构造函数。我们可以读取和写入字段，调用方法，甚至通过调用构造函数来创建新对象。就像我脸上的胡茬和轻微的晒伤一样，我们可以通过他人的眼睛看到自己。

你为什么要看本教程？如果你已经知道反射，你可能会想看它出于娱乐价值。但如果你从未听说过反射，那么，是时候好好照照镜子，发现一个新的魔法，它将允许你有时用几段位置良好的反射诗篇来节省成千上万行令人痛苦的代码。哦，我提到一些雇主会发布一些棘手的面试问题，这些问题通过反射可以轻松解决吗？我希望你会喜欢它，并尝试在教程中的代码片段。感谢你加入我这个旅程。

## 类 `Class`

不，这不是一个错字。有一个叫做 `Class` 的类。它是 `Object` 的子类。而 `Object` 有一个 `Class`。一个不错的循环依赖。

我们如何获得我们对象的 `Class`？每个对象都有一个从 `java.lang.Object` 继承的 `getClass()` 方法。当我们调用它时，我们会得到实际实现的 `Class`。

例如，考虑以下代码。注意，对于我们的代码片段，我们使用的是隐式声明的类，这是Java 22的一个预览特性。查看JEP 445：隐式声明类和实例主方法（第二次预览）。我们可以直接使用 `java --enable-preview --source 22 GetClassDemo.java` 运行它们。

```java
// GetClassDemo.java
import java.util.List;
import java.util.ArrayList;

// 使用隐式声明的类，这是Java 22的预览特性。
void main() {
    List<String> list1 = new ArrayList<>();
    System.out.println(list1.getClass());
    var list2 = new ArrayList<String>();
    System.out.println(list2.getClass());
}
```

换句话说，不管变量是如何声明的，我们总是得到实际实现对象的类。我们如何得到 `List` 类？这相当容易，使用类字面量。我们简单地写上类的名称，后面跟着 `.class`，像这样：

```java
// ClassLiteral.java
void main() {
    System.out.println(Number.class); // class java.lang.Number
    System.out.println(java.util.List.class); // interface java.util.List
}
```

我们也可以通过名称作为 `String` 加载类，甚至不知道类在运行时是否会可用。例如，这里我们正在 `Console` 上加载我们输入的任何类：

```java
// ClassForName.java
void main() throws ClassNotFoundException {
    var console = System.console();
    String className = console.readLine("Enter class name: ");
    System.out.println(Class.forName(className));
}
```

例如：

```plaintext
heinz$ java --enable-preview --source 21 ClassForName.java
Note: ClassForName.java uses preview features of Java SE 21.
Note: Recompile with -Xlint:preview for details.
Enter class name: java.util.Iterator
interface java.util.Iterator
```

每个类都被加载到一个 `ClassLoader` 中。JDK类都位于引导类加载器中，而我们的类位于系统类加载器中，也称为应用程序类加载器。我们可以在这里看到类加载器：

```java
// ClassLoaderDemo.java
void main() {
    System.out.println(String.class.getClassLoader());
    System.out.println(this.getClass().getClassLoader());
}
```

有趣的是，根据我们如何调用此代码，我们会得到不同的结果。例如，如果我们使用 `java ClassLoaderDemo.java` 调用它，那么类加载器的类型是 `MemoryClassLoader`，而如果我们先编译它，然后使用 `java ClassLoaderDemo` 调用它，它是一个 `AppClassLoader`。JDK类的类加载器返回为 `null`。

```plaintext
heinz$ java --enable-preview --source 21 ClassLoaderDemo.java
null
com.sun.tools.javac.launcher.Main$MemoryClassLoader@6483f5ae

heinz$ javac --enable-preview --source 21 ClassLoaderDemo.java
heinz$ java --enable-preview ClassLoaderDemo
null
jdk.internal.loader.ClassLoaders$AppClassLoader@3d71d552
```

类加载器的目的是出于安全原因对类进行分区。JDK中的类根本看不到我们的类，同样，在 `AppClassLoader` 中的类与 `MemoryClassLoader` 中的类没有关系。这可能会导致我们在编译类然后也使用单文件命令 `java SomeClass.java` 启动它们时出现一些意外。

## 浅反射访问

一旦我们有了类，我们可以发现它的很多信息，比如谁是超类，它有什么公共成员，它实现了哪些接口。如果它是一个 `sealed` 类型，我们甚至可以找到子类型。

让我们尝试找到 `java.util.Iterator` 上定义的方法：

```java
// MethodsOnIterator.java
import java.util.Iterator;
import java.util.stream.Stream;

void main() {
    Stream.of(Iterator.class.getMethods())
            .forEach(System.out::println);
}
```

我们看到四种方法，其中两种是 `default` 接口方法：

```plaintext
heinz$ java --enable-preview --source 21 MethodsOnIterator.java
public default void java.util.Iterator.remove()
public default void java.util.Iterator.forEachRemaining(java.util.function.Consumer)
public abstract boolean java.util.Iterator.hasNext()
public abstract java.lang.Object java.util.Iterator.next()
```

如果我们创建一个 `java.util.Iterator` 类型的对象，我们甚至可以调用这些方法。在下一个示例中，我们寻找一个名为 `"forEachRemaining"` 的方法，它接受一个 `Consumer` 作为参数。然后我们从 `List.of()` 创建一个 `Iterator` 并使用反射调用 `forEachRemaining` 方法。注意，有一些事情可能会出错，最值得注意的是方法不存在（`NoSuchMethodException`）和我们不被允许调用该方法（`IllegalAccessException`）。自Java 7以来，我们有一个涵盖反射可能发生的所有错误的通用异常，即 `ReflectiveOperationException`。

```java
// MethodsOnIteratorCalling.java
import java.util.List;
import java.util.Iterator;
import java.util.function.Consumer;

void main() throws ReflectiveOperationException {
    var iterator = List.of("Hello", "Dev", "Java").iterator();
    var forEachRemainingMethod = Iterator.class.getMethod(
        "forEachRemaining", Consumer.class);
    Consumer<?> println = System.out::println;
    forEachRemainingMethod.invoke(iterator, println);
}
```

我们的下一个示例甚至更有趣，如果我自己这么说的话。我们将取一个项目列表，然后在 `Collections` 类中搜索，看看我们是否能找到任何我们可以给方法的方法。我们调用该方法并看看我们的列表会发生什么。由于 `Collections` 中的方法被声明为 `static`，在 `invoke()` 方法的第一个参数将是 `null`。我们可以使用流，但它们与检查的异常“相处不好”，因此必须使用普通的for-in循环：

```java
// CollectionsListMethods.java
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

void main() throws ReflectiveOperationException {
    var pi = "3141592653589793".chars()
            .map(i -> i - '0')
            .boxed().collect(Collectors.toList());
    System.out.println(pi);
    for (var method : Collections.class.getMethods()) {
        if (method.getReturnType() == void.class
                && method.getParameterCount() == 1
                && method.getParameterTypes()[0] == List.class) {
            System.out.println("Calling " + method.getName() + "()");
            method.invoke(null, pi);
            System.out.println(pi);
        }
    }
}
```

这工作得很好，我们找到了三个符合我们要求的方法：`sort()`、`shuffle()` 和 `reverse()`。这些方法的顺序没有保证。例如，在OpenJDK 21的 `Collections.java` 文件中，它们的顺序是 `sort()`、`reverse()`、`shuffle()`。然而，当我运行代码时，它们出现的顺序是：

```plaintext
heinz$ java --enable-preview --source 21 CollectionsListMethods.java
[3, 1, 2, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3]
Calling reverse()
[3, 9, 7, 9, 8, 5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]
Calling sort()
[1, 1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9, 9, 9]
Calling shuffle()
[5, 7, 4, 9,1, 3, 1, 2, 6, 8, 3, 9, 5, 2, 3, 1]
```

## 深入反射

反射不仅仅是发现公共API。它还可以发现私有成员。然而，要访问它们，我们必须使用 `setAccessible(true)` 方法。这将禁用 Java 语言访问检查器，允许我们访问私有成员。请注意，这可能会带来安全风险，因为它允许我们访问我们不应该访问的代码。

## 反射API

Java反射API是一个强大的工具，但它也有其缺点。它使代码更难理解，更难维护，并且运行速度更慢。它还可能带来安全风险。因此，除非绝对必要，否则应避免使用它。然而，当您需要它时，它是一个宝贵的工具。




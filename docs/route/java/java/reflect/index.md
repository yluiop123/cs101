# Java 反射

Java Reflection 允许在运行时检查类、接口、字段和方法，而无需在编译时知道这些类的名称、方法等。它还可以使用反射来实例化新对象、调用方法和获取/设置字段值。

Java Reflection 功能强大且非常有用。例如，Java Reflection 可以用来将 JSON 文件中的属性映射到 Java 对象的 getter/setter 方法，像 Jackson、GSON、Boon 等库所做的那样。或者，Reflection 可以用来将 JDBC ResultSet 的列名映射到 Java 对象的 getter/setter 方法。

本教程将深入讲解 Java 反射。它将解释 Java 反射的基础知识，包括如何使用数组、注解、泛型和动态代理，以及动态类加载和重新加载。

它还将展示如何执行更具体的 Java 反射任务，比如读取一个类的所有 getter 方法，或者访问类的私有字段和方法。

本 Java 反射教程还将澄清关于泛型信息在运行时可用性的一些混淆。有些人声称所有泛型信息在运行时都会丢失。这不是真的。

本教程描述的是 Java 8 中的 Java 反射版本。

## Java 反射示例

这里是一个快速的 Java 反射示例，展示使用反射的样子：

```java
Method[] methods = MyObject.class.getMethods();

for(Method method : methods){
    System.out.println("method = " + method.getName());
}
```

这个示例从名为 `MyObject` 的类中获取了 `Class` 对象。使用类对象，示例获取了该类中的方法列表，遍历这些方法并打印出它们的名字。

所有这些是如何工作的，将在本教程的其余部分（在其他文本中）更详细地解释。

## Java 类对象

使用 Java 反射时，通常的起点是一个表示你想要通过反射检查的 Java 类的 `Class` 对象。例如，要获取名为 `MyObject` 的类的 `Class` 对象，你可以写：

```java
Class myObjectClass = MyObject.class;
```

现在你有了一个对 `MyObject` 类的 `Class` 对象的引用。

`Class` 对象在 Java 反射类教程中有更详细的描述。

## 字段

一旦你有了表示某个类的 `Class` 对象的引用，你就可以看到该类包含哪些字段。以下是访问 Java 类字段的示例：

```java
Class myObjectClass = MyObject.class;

Field[] fields   = myObjectClass.getFields();
```

有了对 Java 反射 `Field` 实例的引用，你可以开始检查该字段。
你可以读取它的名称、访问修饰符等。你可以在 Java 反射字段教程中阅读更多关于你可以用 Java 反射 `Field` 实例做的事情。

## 构造函数

使用 Java 反射，可以找出给定 Java 类包含哪些构造函数以及它们接受哪些参数等。我在 Java 反射 - 构造函数教程中解释了如何做到这一点。

## 方法

你也可以从它的 `Class` 对象中看到给定类有哪些方法。以下是通过 Java 反射访问给定类的方法的示例：

```java
Class myObjectClass = MyObject.class;

Method[] methods = myObjectClass.getMethods();
```

一旦你有了对 Java 反射 `Method` 实例的引用，你可以开始检查它。
你可以读取方法的名称、它接受的参数、返回类型等。你可以在 Java 反射方法教程中阅读更多关于你可以用 Java 反射 `Method` 实例做的事情。

### Getter和Setter

你还可以使用 Java 反射来找出一个类有哪些 getter 和 setter 方法。这在 Java 反射 - Getters 和 Setters 教程中有更详细的介绍。

## 私有字段和方法

你甚至可以通过 Java 反射访问私有字段和方法 - 即使是在拥有私有字段或方法的类之外。我在 Java 反射 - 私有字段和方法中解释了如何做到这一点。

## 注解

一些 Java 注解在运行时仍然可以访问。如果一个 Java 类有在运行时可用的注解，你也可以通过 Java 反射访问它们。如何在 Java 反射和注解教程中介绍了如何做到这一点。

## 数组

你可以使用 Java 反射来内省 Java 数组。例如，你可以确定数组是哪种类的数组。例如，如果你正在内省一个字符串数组，你可以通过检查数组类来检测元素类型是字符串。我在 Java 反射数组教程中解释了如何使用 Java 反射来内省 Java 数组。

## 动态代理

Java 反射有一个特殊的 `Proxy` 类，可以在运行时动态实现 Java 接口，而不是在编译时。动态代理被赋予了一个处理器对象，它截获对动态代理的所有方法调用。这可以是解决某些类型问题的一种非常方便的方式，比如在方法调用周围添加事务管理，或者记录日志，或其他所需的行为。我在 Java 反射动态代理教程中解释了如何使用动态代理。

## 泛型类型

可以内省字段、方法参数和方法返回参数的泛型类型，前提是这些类型声明了泛型类型。我在 Java 反射和泛型教程中解释了如何做到这一点。

## 动态类加载和重新加载

在 Java 中，可以使用 Java `ClassLoader` 动态加载甚至重新加载类。
`ClassLoader` 类实际上不是 Java 反射 API 的一部分，但是由于 Java 反射经常用来实现 "动态" 行为（运行时的行为变化），动态类加载和重新加载也符合这个主题。

## 模块

也可以使用反射来内省 Java 模块。

我在 Java 反射和模块教程中解释了如何做到这一点。

## 其他

其他的反射相关内容。

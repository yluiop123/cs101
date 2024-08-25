# 类

使用 **Java Reflection**，你可以在运行时检查 **Java** **类**。检查类通常是使用反射时首先进行的操作。
从类中，你可以获取以下信息：
- 类名
- 类修饰符（public, private, synchronized 等）
- 包信息
- 父类
- 实现的接口
- 构造函数
- 方法
- 字段
- 注解

以及与Java类相关的更多信息。要获取完整列表，你应该查阅 `java.lang.Class` 的 JavaDoc。
本文将简要介绍上述所有信息的访问方式。一些主题将在单独的文本中更详细地检查。例如，本文将展示如何获取所有方法或特定方法，但将有单独的文本展示如何调用该方法，如果存在多个具有相同名称的方法，如何找到匹配给定参数集的方法，通过反射调用方法时抛出了哪些异常，如何识别 getter/setter 等。
本文的主要目的是介绍 `Class` 对象以及你可以从中获取的信息。

## 类对象

在对类进行任何检查之前，你需要获取它的 `java.lang.Class` 对象。
Java 中的所有类型，包括原始类型（int, long, float 等）和数组，都有相关的 `Class` 对象。
如果你在编译时知道类名，可以这样获取 `Class` 对象：

```
    Class myObjectClass = MyObject.class
```

如果你在编译时不知道名称，但在运行时有类名作为字符串，可以这样做：

```java
String className = ... // 在运行时以字符串形式获取类名
Class class = Class.forName(className);
```

使用 `Class.forName()` 方法时，你必须提供完全限定的类名。
即包括所有包名的类名。例如，如果 MyObject 位于 `com.jenkov.myapp` 包中，那么完全限定的类名是 `com.jenkov.myapp.MyObject`。

`Class.forName()` 方法可能会抛出 `ClassNotFoundException`，如果在运行时在类路径中找不到类。

## 类名

从 `Class` 对象中，你可以以两种版本获取其名称。完全限定的类名（包括包名）是使用 `getName()` 方法获取的，如下所示：

```java
    Class aClass = ... // 获取 Class 对象。见前一节
    String className = aClass.getName();
```

如果你想获取不包含包名的类名，可以使用 `getSimpleName()` 方法，如下所示：

```java
    Class  aClass = ... // 获取 Class 对象。见前一节
    String simpleClassName = aClass.getSimpleName();
```

## 修饰符

你可以通过 `Class` 对象访问类的修饰符。类修饰符是关键字 "public"、"private"、"static" 等。
你像这样获取类修饰符：

```java
  Class  aClass = ... // 获取 Class 对象。见前一节
  int modifiers = aClass.getModifiers();
```

修饰符被打包到一个 `int` 中，每个修饰符是一个标志位，可以设置或清除。你可以使用类 `java.lang.reflect.Modifier` 中的这些方法来检查修饰符：

```java
    Modifier.isAbstract(int modifiers)
    Modifier.isFinal(int modifiers)
    Modifier.isInterface(int modifiers)
    Modifier.isNative(int modifiers)
    Modifier.isPrivate(int modifiers)
    Modifier.isProtected(int modifiers)
    Modifier.isPublic(int modifiers)
    Modifier.isStatic(int modifiers)
    Modifier.isStrict(int modifiers)
    Modifier.isSynchronized(int modifiers)
    Modifier.isTransient(int modifiers)
    Modifier.isVolatile(int modifiers)
```

## 包信息

你可以通过 `Class` 对象像这样获取包的信息：

```java
Class  aClass = ... // 获取 Class 对象。见前一节
Package package = aClass.getPackage();
```

从 `Package` 对象中，你可以访问有关包的信息，比如它的名称。
你还可以访问在类路径上此包所在的 JAR 文件的 `Manifest` 文件中为此包指定的信息。
例如，你可以在 `Manifest` 文件中指定包版本号。
你可以在这里阅读更多关于 `Package` 类的信息：
java.lang.Package

## 父类

从 `Class` 对象中，你可以访问类的父类。如下所示：

```java
Class superclass = aClass.getSuperclass();
```

父类类对象是一个 `Class` 对象，像任何其他对象一样，所以你可以在它上面继续进行类反射。

## 实现的接口

你可以获取一个类实现的接口列表。如下所示：

```java
Class  aClass = ... // 获取 Class 对象。见前一节
Class[] interfaces = aClass.getInterfaces();
```

一个类可以实现多个接口。因此返回了一个 `Class` 数组。
在 Java 反射中，接口也由 `Class` 对象表示。

注意：只返回由给定类明确声明实现的接口。
如果一个类的父类实现了一个接口，但该类没有明确声明它也实现了该接口，那么该接口将不会在数组中返回。
即使该类实际上因为父类而实现了该接口。

要获取一个类实现的所有接口的完整列表，你需要递归地查询该类及其父类。

## 构造函数

你可以像这样访问类的构造函数：

```java
 Constructor[] constructors = aClass.getConstructors();
```

构造函数在构造函数的文本中有更详细的介绍。

## 方法

你可以像这样访问类的方法：

```java
 Method[] method = aClass.getMethods();
```

方法在方法的文本中有更详细的介绍。

## 字段

你可以像这样访问类字段（成员变量）：

```java
 Field[] method = aClass.getFields();
```

字段在字段的文本中有更详细的介绍。

## 注解

你可以像这样访问类的类注解：

```java
 Annotation[] annotations = aClass.getAnnotations();
```



# 数组

在Java反射中使用数组有时可能会有些棘手。特别是如果你需要为某种类型的数组，比如`int[]`等，获取Class对象。本文将讨论如何通过Java反射创建数组并获取它们的类对象。

注意：在阅读了Eyal Lupu的博客文章"Two Side Notes About Arrays and Reflection"之后，本文已更新，该文章对本文的第一版提出了评论。当前版本考虑了他的评论。

## java.lang.reflect.Array

通过Java反射使用数组是通过`java.lang.reflect.Array`类完成的。不要将这个类与Java Collections套件中的`java.util.Arrays`类混淆，后者包含用于排序数组、将它们转换为集合等的实用方法。

## 创建数组

通过Java反射创建数组是通过`java.lang.reflect.Array`类完成的。以下是一个展示如何创建数组的示例：

```java
int[] intArray = (int[]) Array.newInstance(int.class, 3);
```

这段代码示例创建了一个`int`类型的数组。给`Array.newInstance()`方法的第一个参数`int.class`指明了数组中每个元素的类型。第二个参数指明了数组应该有多少个元素空间。

## 访问数组

也可以使用Java反射访问数组的元素。这是通过`Array.get(...)`和`Array.set(...)`方法完成的。以下是一个示例：

```java
int[] intArray = (int[]) Array.newInstance(int.class, 3);

Array.set(intArray, 0, 123);
Array.set(intArray, 1, 456);
Array.set(intArray, 2, 789);

System.out.println("intArray[0] = " + Array.get(intArray, 0));
System.out.println("intArray[1] = " + Array.get(intArray, 1));
System.out.println("intArray[2] = " + Array.get(intArray, 2));
```

这段代码示例将打印出：

```
intArray[0] = 123
intArray[1] = 456
intArray[2] = 789
```

## 获取数组的Class对象

在实现Butterfly DI Container中的脚本语言时，我遇到的一个问题是如何通过Java反射获取数组的`Class`对象。使用非反射代码，你可以这样做：

```java
Class stringArrayClass = String[].class;
```

使用`Class.forName()`这样做并不直接。例如，你可以像这样访问基本`int`数组的类对象：

```java
Class intArray = Class.forName("[I");
```

JVM通过字母`I`表示一个`int`。左边的`[`意味着我感兴趣的是`int`数组的类。这对所有其他基本类型也有效。

对于对象，你需要使用稍微不同的表示法：

```java
Class stringArrayClass = Class.forName("[Ljava.lang.String;");
```

注意类名左边的`[L`和右边的`;`。这意味着具有给定类型的一个对象数组。

顺便说一句，你不能使用`Class.forName()`获取基本类型的类对象。以下两个示例都会产生`ClassNotFoundException`：

```java
Class intClass1 = Class.forName("I");
Class intClass2 = Class.forName("int");
```

我通常会这样做来获取基本类型以及对象的类名：

```java
public Class getClass(String className){
  if("int".equals(className)) return int.class;
  if("long".equals(className)) return long.class;
  ...
  return Class.forName(className);
}
```

一旦你获得了一个类型的`Class`对象，有一个简单的方法来获取该类型的数组的`Class`。

解决方案，或者你可能称之为权宜之计，是创建一个所需类型的空数组，并从那个空数组获取类对象。这有点作弊，但它有效。以下是它的实现方式：

```java
Class theClass = getClass(theClassName);
Class stringArrayClass = Array.newInstance(theClass, 0).getClass();
```

这提供了一个单一的、统一的方法来访问任何类型的数组的数组类。不需要摆弄类名等。

为了确保`Class`对象确实是一个数组，你可以调用`Class.isArray()`方法进行检查：

```java
Class stringArrayClass = Array.newInstance(String.class, 0).getClass();
System.out.println("is array: " + stringArrayClass.isArray());
```

## 获取数组的组件类型

一旦你获得了一个数组的`Class`对象，你可以通过`Class.getComponentType()`方法访问其组件类型。组件类型是数组中项目的类型。例如，`int[]`数组的组件类型是`int.class`类对象。`String[]`数组的组件类型是`java.lang.String`类对象。

以下是访问组件类型数组的示例：

```java
String[] strings = new String[3];
Class stringArrayClass = strings.getClass();
Class stringArrayComponentType = stringArrayClass.getComponentType();
System.out.println(stringArrayComponentType);
```

这个示例将打印出"java.lang.String"，这是`String`数组的组件类型。



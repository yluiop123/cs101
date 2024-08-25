# 方法

使用Java反射，你可以检查类的方法并在运行时调用它们。这是通过Java类 `java.lang.reflect.Method` 完成的。本文将更详细地介绍Java `Method` 对象。

## 获取方法对象

`Method` 类是从 `Class` 对象中获得的。
以下是一个例子：

```java
Class aClass = ...//获取类对象
Method[] methods = aClass.getMethods();
```

`Method[]` 数组将为类中声明的每个公共方法提供一个 `Method` 实例。

如果你知道要访问的方法的确切参数类型，你可以这样做，而不是获取所有方法的数组。以下示例返回给定类中名为 "doSomething" 的公共方法，该方法接受 `String` 作为参数：

```java
Class aClass = ...//获取类对象
Method method = aClass.getMethod("doSomething", new Class[]{String.class});
```

如果没有与给定方法名称和参数匹配的方法，在这种情况下是 `String.class`，则会抛出 `NoSuchMethodException`。

如果尝试访问的方法不接受任何参数，像这样传递 `null` 作为参数类型数组：

```java
Class aClass = ...//获取类对象
Method method = aClass.getMethod("doSomething", null);
```

## 方法参数和返回类型

你可以这样读取给定方法所接受的参数：

```java
Method method = ... //获取方法 - 见上文
Class[] parameterTypes = method.getParameterTypes();
```

你可以这样访问方法的返回类型：

```java
Method method = ... //获取方法 - 见上文
Class returnType = method.getReturnType();
```

## 使用方法对象调用方法

你可以这样调用一个方法：

```java
//获取接受String参数的方法
Method method = MyObject.class.getMethod("doSomething", String.class);

Object returnValue = method.invoke(null, "parameter-value1");
```

`null` 参数是你想要调用方法的对象。如果方法是静态的，你提供 `null` 而不是对象实例。
在这个例子中，如果 `doSomething(String.class)` 不是静态的，你需要提供有效的 `MyObject` 实例而不是 `null`。

`Method.invoke(Object target, Object ... parameters)` 方法接受任意数量的参数，但你必须为你所调用的方法中的每个参数提供一个确切的参数。在这种情况下，它是一个接受 `String` 的方法，因此必须提供一个 `String`。


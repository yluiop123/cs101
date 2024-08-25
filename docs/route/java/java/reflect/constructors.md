# 构造函数

使用Java反射，你可以检查类的构造函数并在运行时实例化对象。这是通过Java类 `java.lang.reflect.Constructor` 完成的。本文将更详细地介绍Java `Constructor` 对象。

## 获取构造函数对象

`Constructor` 类是从 `Class` 对象中获得的。
以下是一个例子：

```java
Class aClass = ...//获取类对象
Constructor[] constructors = aClass.getConstructors();
```

`Constructor[]` 数组将为类中声明的每个公共构造函数提供一个 `Constructor` 实例。

如果你知道要访问的构造函数的确切参数类型，你可以这样做，而不是获取所有构造函数的数组。以下示例返回给定类接受 `String` 作为参数的公共构造函数：

```java
Class aClass = ...//获取类对象
Constructor constructor = aClass.getConstructor(new Class[]{String.class});
```

如果没有与给定构造函数参数匹配的构造函数，在这种情况下是 `String.class`，则会抛出 `NoSuchMethodException`。

## 构造函数参数

你可以这样读取给定构造函数所接受的参数：

```java
Constructor constructor = ... //获取构造函数 - 见上文
Class[] parameterTypes = constructor.getParameterTypes();
```

## 使用构造函数对象实例化对象

你可以这样实例化一个对象：

```java
//获取接受String参数的构造函数
Constructor constructor = MyObject.class.getConstructor(String.class);

MyObject myObject = (MyObject)constructor.newInstance("constructor-arg1");
```

`Constructor.newInstance()` 方法接受任意数量的参数，但你必须为你所调用的构造函数中的每个参数提供一个确切的参数。在这种情况下，它是一个接受 `String` 的构造函数，因此必须提供一个 `String`。



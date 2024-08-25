#  字段

使用Java反射，你可以检查类的字段（成员变量）并在运行时获取/设置它们。这是通过Java类 `java.lang.reflect.Field` 完成的。本文将更详细地介绍Java `Field` 对象。记得也要查看Sun的JavaDoc。

## 获取字段对象

`Field` 类是从 `Class` 对象中获得的。
以下是一个例子：

```java
Class aClass = ...//获取类对象
Field[] fields = aClass.getFields();
```

`Field[]` 数组将为类中声明的每个公共字段提供一个 `Field` 实例。

如果你知道要访问的字段的名称，可以这样访问：

```java
Class aClass = MyObject.class;
Field field = aClass.getField("someField");
```

上述示例将返回对应于 `MyObject` 中声明的 `someField` 字段的 `Field` 实例：

```java
public class MyObject {
  public String someField = null;
}
```

如果不存在名为 `getField()` 方法参数给定名称的字段，则会抛出 `NoSuchFieldException`。

## 字段名称

一旦你获得了 `Field` 实例，可以使用 `Field.getName()` 方法获取其字段名称，如下所示：

```java
Field field = ... //获取字段对象
String fieldName = field.getName();
```

## 字段类型

你可以使用 `Field.getType()` 方法确定字段的字段类型（String、int等）：

```java
Field field = aClass.getField("someField");
Object fieldType = field.getType();
```

## 获取和设置字段值

一旦你获得了 `Field` 引用，就可以使用 `Field.get()` 和 `Field.set()` 方法获取和设置其值，如下所示：

```java
Class aClass = MyObject.class;
Field field = aClass.getField("someField");

MyObject objectInstance = new MyObject();

Object value = field.get(objectInstance);

field.set(objectInstance, value);
```

传递给 `get` 和 `set` 方法的 `objectInstance` 参数应该是拥有该字段的类的实例。在上面的例子中，使用了 `MyObject` 的一个实例，因为 `someField` 是 `MyObject` 类的一个实例成员。

如果字段是静态字段（public static ...），则将 `null` 作为参数传递给 `get` 和 `set` 方法，而不是上面传递的 `objectInstance` 参数。


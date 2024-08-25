# 泛型

我经常在文章和论坛中读到，所有的Java泛型信息在编译时被擦除，以至于你无法在运行时访问这些信息。然而，这并不完全正确。在一些情况下，确实可以在运行时访问泛型信息。这些情况实际上涵盖了我们对Java泛型信息的几种需求。本文将解释这些情况。

## 泛型反射的经验法则

使用Java泛型通常属于以下两种不同情况之一：

1. 声明一个类/接口是可参数化的。
2. 使用一个可参数化的类。

当你编写一个类或接口时，可以指定它应该是可参数化的。`java.util.List`接口就是这样一个例子。与其创建一个`Object`列表，你可以参数化`java.util.List`来创建一个比如说`String`列表，像这样：

```java
List<String> myList = new ArrayList<String>();
```

当通过反射在运行时检查一个可参数化类型本身时，比如`java.util.List`，没有办法知道它已经被参数化为哪种类型。对象本身不知道它被参数化为哪种类型。

然而，对对象的引用知道它引用的类型，包括泛型类型。也就是说，如果它不是一个局部变量。如果一个对象被一个对象中的字段引用，那么你可以通过反射查看字段声明，以获取该字段声明的泛型类型信息。

如果对象是通过方法中的参数引用的，也是同样可能的。通过该方法的`Parameter`对象（一个Java反射对象），你可以看到该参数声明的泛型类型。

最后，你也可以查看方法的返回类型，看看它声明的泛型类型是什么。同样，你不能从实际返回的对象中看到。你需要通过反射查看方法声明，看看它声明了什么返回类型（包括泛型类型）。

总结起来：你只能从引用的声明（字段、参数、返回类型）中看到被这些引用引用的对象可能具有的泛型类型。你不能从对象本身看到。

以下各节将更仔细地查看这些情况。

## 泛型方法返回类型

如果你已经获得了一个`java.lang.reflect.Method`对象，就可以获得有关其泛型返回类型的信息。你可以阅读“Java泛型：方法”一文中如何获取`Method`对象的信息。以下是一个具有参数化返回类型的方法的示例类：

```java
public class MyClass {

  protected List<String> stringList = ...;

  public List<String> getStringList(){
    return this.stringList;
  }
}
```

在这个类中，可以获取`getStringList()`方法的泛型返回类型。换句话说，可以检测到`getStringList()`返回一个`List<String>`而不仅仅是一个`List`。以下是如何做到这一点的：

```java
Method method = MyClass.class.getMethod("getStringList", null);

Type returnType = method.getGenericReturnType();

if(returnType instanceof ParameterizedType){
    ParameterizedType type = (ParameterizedType) returnType;
    Type[] typeArguments = type.getActualTypeArguments();
    for(Type typeArgument : typeArguments){
        Class typeArgClass = (Class) typeArgument;
        System.out.println("typeArgClass = " + typeArgClass);
    }
}
```

这段代码将打印出"typeArgClass = java.lang.String"。`Type[]`数组`typeArguments`将包含一个项目 - 表示类`java.lang.String`的`Class`实例。`Class`实现了`Type`接口。

## 泛型方法参数类型

你还可以借助Java反射在运行时访问参数类型的泛型类型。以下是一个方法接受参数化`List`作为参数的示例类：

```java
public class MyClass {
  protected List<String> stringList = ...;

  public void setStringList(List<String> list){
    this.stringList = list;
  }
}
```

你可以像这样访问方法参数的泛型参数类型：

```java
method = MyClass.class.getMethod("setStringList", List.class);

Type[] genericParameterTypes = method.getGenericParameterTypes();

for(Type genericParameterType : genericParameterTypes){
    if(genericParameterType instanceof ParameterizedType){
        ParameterizedType aType = (ParameterizedType) genericParameterType;
        Type[] parameterArgTypes = aType.getActualTypeArguments();
        for(Type parameterArgType : parameterArgTypes){
            Class parameterArgClass = (Class) parameterArgType;
            System.out.println("parameterArgClass = " + parameterArgClass);
        }
    }
}
```

这段代码将打印出"parameterArgType = java.lang.String"。`Type[]`数组`parameterArgTypes`将包含一个项目 - 表示类`java.lang.String`的`Class`实例。`Class`实现了`Type`接口。

## 泛型字段类型

也可以访问公共字段的泛型类型。字段是类成员变量 - 可以是静态变量或实例变量。你可以在“Java泛型：字段”一文中阅读有关获取`Field`对象的信息。以下是前面示例中称为`stringList`的实例字段。

```java
public class MyClass {
  public List<String> stringList = ...;
}

Field field = MyClass.class.getField("stringList");

Type genericFieldType = field.getGenericType();

if(genericFieldType instanceof ParameterizedType){
    ParameterizedType aType = (ParameterizedType) genericFieldType;
    Type[] fieldArgTypes = aType.getActualTypeArguments();
    for(Type fieldArgType : fieldArgTypes){
        Class fieldArgClass = (Class) fieldArgType;
        System.out.println("fieldArgClass = " + fieldArgClass);
    }
}
```

这段代码将打印出"fieldArgClass = java.lang.String"。`Type[]`数组`fieldArgTypes`将包含一个项目 - 表示类`java.lang.String`的`Class`实例。`Class`实现了`Type`接口。



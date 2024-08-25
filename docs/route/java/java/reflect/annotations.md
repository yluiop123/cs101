# 注解

使用Java反射，你可以在运行时访问附加到Java类上的注解。
并不是所有的Java注解都可以在运行时访问。只有一些Java注解可以通过Java反射在运行时使用。

## 什么是Java注解？
Java注解在我的Java注解教程中有更详细的解释。
Java注解是Java 5的一个新特性。注解是一种可以插入到Java代码中的评论或元数据。然后这些注解可以在编译时由预编译工具处理，或者通过Java反射在运行时处理。以下是一个类注解的示例：

```java
@MyAnnotation(name="someName",  value = "Hello World")
public class TheClass {
}

```

类`TheClass`上有`@MyAnnotation`注解。注解的定义类似于接口。这是`MyAnnotation`的定义：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)

public @interface MyAnnotation {
    public String name();
    public String value();
}
```

`@interface`前面的`@`标记它为注解。一旦你定义了注解，就可以像前面的示例中那样在代码中使用它。

注解定义中的两个指令，`@Retention(RetentionPolicy.RUNTIME)`和`@Target(ElementType.TYPE)`，指定了注解的使用方法。

`@Retention(RetentionPolicy.RUNTIME)`意味着注解可以通过反射在运行时访问。如果你不设置这个指令，注解在运行时将不会被保留，因此也不会通过反射可用。

`@Target(ElementType.TYPE)`意味着注解只能用于类型（通常是类和接口）。你也可以指定`METHOD`或`FIELD`，或者你可以完全省略目标，以便注解可以用于类、方法和字段。

## 类注解

你可以在运行时访问类、方法或字段的注解。以下是一个访问类注解的示例：

```java
Class aClass = TheClass.class;
Annotation[] annotations = aClass.getAnnotations();

for(Annotation annotation : annotations){
    if(annotation instanceof MyAnnotation){
        MyAnnotation myAnnotation = (MyAnnotation) annotation;
        System.out.println("name: " + myAnnotation.name());
        System.out.println("value: " + myAnnotation.value());
    }
}
```

你也可以像这样访问特定的类注解：

```java
Class aClass = TheClass.class;
Annotation annotation = aClass.getAnnotation(MyAnnotation.class);

if(annotation instanceof MyAnnotation){
    MyAnnotation myAnnotation = (MyAnnotation) annotation;
    System.out.println("name: " + myAnnotation.name());
    System.out.println("value: " + myAnnotation.value());
}
```

## 方法注解

以下是一个带有注解的方法的示例：

```java
public class TheClass {
  @MyAnnotation(name="someName",  value = "Hello World")
  public void doSomething(){}
}
```

你可以像这样访问方法注解：

```java
Method method = ... //获取方法对象
Annotation[] annotations = method.getDeclaredAnnotations();

for(Annotation annotation : annotations){
    if(annotation instanceof MyAnnotation){
        MyAnnotation myAnnotation = (MyAnnotation) annotation;
        System.out.println("name: " + myAnnotation.name());
        System.out.println("value: " + myAnnotation.value());
    }
}
```

你也可以像这样访问特定方法注解：

```java
Method method = ... //获取方法对象
Annotation annotation = method.getAnnotation(MyAnnotation.class);

if(annotation instanceof MyAnnotation){
    MyAnnotation myAnnotation = (MyAnnotation) annotation;
    System.out.println("name: " + myAnnotation.name());
    System.out.println("value: " + myAnnotation.value());
}
```

## 参数注解

也可以向方法参数声明添加注解。以下是示例：

```java
public class TheClass {
  public static void doSomethingElse(
        @MyAnnotation(name="aName", value="aValue") String parameter){
  }
}
```

你可以像这样从`Method`对象访问参数注解：

```java
Method method = ... //获取方法对象
Annotation[][] parameterAnnotations = method.getParameterAnnotations();
Class[] parameterTypes = method.getParameterTypes();

int i=0;
for(Annotation[] annotations : parameterAnnotations){
  Class parameterType = parameterTypes[i++];
  
  for(Annotation annotation : annotations){
    if(annotation instanceof MyAnnotation){
        MyAnnotation myAnnotation = (MyAnnotation) annotation;
        System.out.println("param: " + parameterType.getName());
        System.out.println("name : " + myAnnotation.name());
        System.out.println("value: " + myAnnotation.value());
    }
  }
}
```

注意`Method.getParameterAnnotations()`方法返回一个二维`Annotation`数组，包含每个方法参数的注解数组。

## 字段注解

以下是一个带有注解的字段的示例：

```java
public class TheClass {
  @MyAnnotation(name="someName",  value = "Hello World")
  public String myField = null;
}
```

你可以像这样访问字段注解：

```java
Field field = ... //获取字段对象
Annotation[] annotations = field.getDeclaredAnnotations();

for(Annotation annotation : annotations){
    if(annotation instanceof MyAnnotation){
        MyAnnotation myAnnotation = (MyAnnotation) annotation;
        System.out.println("name: " + myAnnotation.name());
        System.out.println("value: " + myAnnotation.value());
    }
}
```

你也可以像这样访问特定字段注解：

```java
Field field = ... //获取字段对象
Annotation annotation = field.getAnnotation(MyAnnotation.class);

if(annotation instanceof MyAnnotation){
    MyAnnotation myAnnotation = (MyAnnotation) annotation;
    System.out.println("name: " + myAnnotation.name());
    System.out.println("value: " + myAnnotation.value());
}
```


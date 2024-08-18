# Java 注解（Annotations）

## 简介
注解（Annotations）具有多种用途，包括：
- 为编译器提供信息 - 注解可被编译器用于检测错误或抑制警告。
- 编译时和部署时处理 - 软件工具可以处理注解信息以生成代码、XML 文件等。
- 运行时处理 - 一些注解可在运行时进行检查。

本节将解释注解的使用位置、如何应用注解、Java 平台标准版（Java SE API）中提供的预定义注解类型、类型注解如何与可插拔类型系统结合使用以编写具有更强类型检查的代码，以及如何实现重复注解。

## 注解的格式
- 最简单的注解形式如下：
    ```
    @Entity 
    ```
    其中，`@`符号表示其后跟随的是一个注解。在下面的示例中，注解的名称是`Override`：
    ```
    @Override 
    void mySuperMethod() {...  }
    ```
- 注解可以包含元素，这些元素可以是命名的或未命名的，并且这些元素有相应的值：
    ```
    @Author ( 
       name = "Benjamin Franklin", 
       date = "3/27/2003" 
     ) 
    class MyClass {...  } 
    ```
    或者
    ```
    @SuppressWarnings (value = "unchecked")
    void myMethod() {...  }
    ```
- 如果只有一个名为`value`的元素，则可以省略名称，如下所示：
    ```
    @SuppressWarnings ("unchecked")
    void myMethod() {...  }
    ```
- 如果注解没有元素，则可以省略括号，如前面的`@Override`示例所示。
- 也可以在同一个声明上使用多个注解：
    ```
    @Author (name = "Jane Doe") 
    @EBook 
    class MyClass {...  } 
    ```
- 如果注解具有相同的类型，则称为重复注解：
    ```
    @Author (name = "Jane Doe") 
    @Author (name = "John Smith")
    class MyClass {...  } 
    ```
    从 Java SE 8 版本开始支持重复注解。有关更多信息，请参阅“重复注解”部分。

- 注解类型可以是 Java SE API 中`java.lang`或`java.lang.annotation`包中定义的类型之一。在前面的示例中，`Override`和`SuppressWarnings`是预定义的 Java 注解。也可以定义自己的注解类型。前面示例中的`Author`和`Ebook`注解是自定义注解类型。

## 注解的使用位置
注解可以应用于声明：类、字段、方法和其他程序元素的声明。按照惯例，当在声明上使用时，每个注解通常单独占一行。

从 Java SE 8 版本开始，注解也可以应用于类型的使用。以下是一些示例：
- 类实例创建表达式：
    ```
    new @Interned MyObject();
    ```
- 类型转换：
    ```
    myString = (@NonNull String) str;
    ```
- `implements`子句：
    ```
    class UnmodifiableList<T> implements 
      @Readonly List<@Readonly T> {... }
    ```
- 抛出异常声明：
    ```
    void monitorTemperature() throws 
      @Critical TemperatureException {... }
    ```
这种形式的注解称为类型注解。

## 声明注解类型
许多注解取代了代码中的注释。

假设一个软件团队传统上在每个类的主体开头使用注释提供重要信息：
```
public class Generation3List extends Generation2List { 

   // Author: John Doe 
   // Date: 3/17/2002 
   // Current revision: 6 
   // Last modified: 4/12/2004 
   // By: Jane Doe 
   // Reviewers: Alice, Bill, Cindy 

   // class code goes here 

 } 
```
要使用注解添加相同的元数据，必须首先定义注解类型。执行此操作的语法如下：
```
@interface ClassPreamble  { 
   String author(); 
   String date(); 
   int currentRevision() default 1; 
   String lastModified() default "N/A"; 
   String lastModifiedBy() default "N/A"; 
   // 注意数组的使用
   String [] reviewers(); 
 } 
```
注解类型定义看起来类似于接口定义，其中关键字`interface`前面有`@`符号（`@` = AT，如注解类型）。注解类型是一种接口形式，将在后面的部分中介绍。目前，您不需要理解接口。

前面注解定义的主体包含注解类型元素声明，它们看起来很像方法。请注意，它们可以定义可选的默认值。

定义注解类型后，可以使用该类型的注解，并填写相应的值，如下所示：
```
@ClassPreamble ( 
   author = "John Doe", 
   date = "3/17/2002", 
   currentRevision = 6, 
   lastModified = "4/12/2004", 
   lastModifiedBy = "Jane Doe", 
   // 注意数组表示法
   reviewers = { "Alice", "Bob", "Cindy"}
 ) 
 public class Generation3List extends Generation2List { 

 // class code goes here 

 } 
```
注意：要使`@ClassPreamble`中的信息出现在 Javadoc 生成的文档中，必须使用`@Documented`注解对`@ClassPreamble`定义进行注释：
```
// 导入此注解以使用 @Documented 
import java.lang.annotation.*; 

@Documented 
@interface ClassPreamble  { 

   // 注解元素定义 

 } 
```

## 预定义注解类型
Java SE API 中预定义了一组注解类型。一些注解类型由 Java 编译器使用，一些应用于其他注解。

### （一）Java 语言使用的注解类型
Java.lang 中定义的预定义注解类型包括`@Deprecated`、`@Override`和`@SuppressWarnings`。
- `@Deprecated`
    `@Deprecated`注解表示标记的元素已被弃用，不应再使用。每当程序使用带有`@Deprecated`注解的方法、类或字段时，编译器都会生成警告。当一个元素被弃用时，还应该使用 Javadoc 的`@deprecated`标签进行文档记录，如下面的示例所示。Javadoc 注释和注解中使用的`@`符号并非巧合：它们在概念上是相关的。此外，请注意 Javadoc 标签以小写`d`开头，而注解以大写`D`开头。
    ```
    // Javadoc 注释如下
    /**
     * @deprecated
     * 解释为什么它被弃用
     */
    @Deprecated 
    static void deprecatedMethod() {  } 
    ```
    从 Java SE 9 开始，`@Deprecated`注解添加了`forRemoval`属性。它表示被注解的元素是否会在未来版本中被删除。默认值为`false`。
- `@Override`
    `@Override`注解通知编译器该元素旨在覆盖超类中声明的元素。覆盖方法将在“接口和继承”部分中讨论。
    ```
    // 将方法标记为已覆盖的超类方法
    @Override  
    int overriddenMethod()  {  } 
    ```
    虽然在覆盖方法时不要求使用此注解，但它有助于防止错误。如果标记为`@Override`的方法未能正确覆盖其超类中的方法，编译器将生成错误。
- `@SuppressWarnings`
    `@SuppressWarnings`注解告诉编译器抑制它否则会生成的特定警告。在下面的示例中，使用了一个弃用的方法，编译器通常会生成警告。然而，在这种情况下，注解会导致警告被抑制。
    ```
    // 使用弃用的方法并告诉
    // 编译器不要生成警告
    @SuppressWarnings ("deprecation") 
    void useDeprecatedMethod ()  { 
        // 弃用警告
        // - 被抑制
        objectOne.deprecatedMethod();
    } 
    ```
    每个编译器警告都属于一个类别。Java 语言规范列出了两个类别：弃用和未检查。在与泛型出现之前编写的遗留代码进行交互时，可能会出现未检查的警告。要抑制多个类别的警告，请使用以下语法：
    ```
    @SuppressWarnings ({ "unchecked", "deprecation"}) 
    ```
- `@SafeVarargs`
    `@SafeVarargs`注解，当应用于方法或构造函数时，断言代码不会对其可变参数执行潜在的不安全操作。当使用此注解类型时，与可变参数使用相关的未检查警告将被抑制。
- `@FunctionalInterface`
    `@FunctionalInterface`注解，在 Java SE 8 中引入，表示类型声明旨在成为 Java 语言规范定义的函数式接口。

### （二）应用于其他注解的注解
应用于其他注解的注解称为元注解。`java.lang.annotation`中定义了几个元注解类型。
- `@Retention`
    `@Retention`注解指定标记的注解如何存储：
    - `RetentionPolicy.SOURCE` - 标记的注解仅在源代码级别保留，被编译器忽略。
    - `RetentionPolicy.CLASS` - 标记的注解在编译时被编译器保留，但被 Java 虚拟机（JVM）忽略。
    - `RetentionPolicy.RUNTIME` - 标记的注解被 JVM 保留，因此可以在运行时环境中使用。
- `@Documented`
    `@Documented`注解表示每当使用指定的注解时，这些元素应使用 Javadoc 工具进行文档记录。（默认情况下，注解不包含在 Javadoc 中）。有关更多信息，请参阅 Javadoc 工具页面。
- `@Target`
    `@Target`注解标记另一个注解，以限制该注解可以应用于哪种 Java 元素。目标注解指定以下元素类型之一作为其值：
    - `ElementType.ANNOTATION_TYPE`可以应用于注解类型。
    - `ElementType.CONSTRUCTOR`可以应用于构造函数。
    - `ElementType.FIELD`可以应用于字段或属性。
    - `ElementType.LOCAL_VARIABLE`可以应用于局部变量。
    - `ElementType.METHOD`可以应用于方法级注解。
    - `ElementType.MODULE`可以应用于模块声明。
    - `ElementType.PACKAGE`可以应用于包声明。
    - `ElementType.PARAMETER`可以应用于方法的参数。
    - `ElementType.RECORD_COMPONENT`可以应用于记录的组件。
    - `ElementType.TYPE`可以应用于类、抽象类、接口、注解接口、枚举或记录声明的声明。
    - `ElementType.TYPE_PARAMETER`可以应用于类型的参数。
    - `ElementType.TYPE_USE`可以应用于使用类型的地方，例如字段的声明。
- `@Inherited`
    `@Inherited`注解表示注解类型可以从超类继承。（默认情况下不是这样）。当用户查询注解类型而类没有该类型的注解时，将查询类的超类的注解类型。此注解仅适用于类声明。
- `@Repeatable`
    `@Repeatable`注解，在 Java SE 8 中引入，表示标记的注解可以多次应用于相同的声明或类型使用。有关更多信息，请参阅“重复注解”部分。

## 类型注解和可插拔类型系统
在 Java SE 8 版本之前，注解只能应用于声明。从 Java SE 8 版本开始，注解也可以应用于任何类型的使用。这意味着注解可以在使用类型的任何地方使用。使用类型的一些示例包括类实例创建表达式（`new`）、强制类型转换、`implements`子句和`throws`子句。这种形式的注解称为类型注解，在“注解基础”部分提供了一些示例。

类型注解的创建是为了支持对 Java 程序的改进分析，以确保更强的类型检查。Java SE 8 版本没有提供类型检查框架，但它允许您编写（或下载）一个类型检查框架，该框架作为一个或多个可插拔模块实现，与 Java 编译器结合使用。

例如，您希望确保程序中的特定变量永远不会被赋值为`null`；您希望避免触发`NullPointerException`。您可以编写一个自定义插件来检查这一点。然后，您将修改代码以注释该特定变量，表明它永远不会被赋值为`null`。变量声明可能如下所示：
```
@NonNull String str;
```
当您编译代码时，包括在命令行中包含`NonNull`模块，如果编译器检测到潜在问题，它将打印警告，允许您修改代码以避免错误。在您纠正代码以消除所有警告后，当程序运行时，这种特定错误将不会发生。

您可以使用多个类型检查模块，每个模块检查不同类型的错误。通过这种方式，您可以在 Java 类型系统的基础上进行构建，在需要的时间和地点添加特定的检查。

通过明智地使用类型注解和存在可插拔的类型检查器，您可以编写更强大且不易出错的代码。

在许多情况下，您不必编写自己的类型检查模块。有第三方已经为您完成了这项工作。例如，您可能希望利用华盛顿大学创建的 Checker Framework。该框架包括一个`NonNull`模块，以及一个正则表达式模块和一个互斥锁模块。有关更多信息，请参阅 Checker Framework。

## 重复注解
在某些情况下，您希望将相同的注解应用于声明或类型使用。从 Java SE 8 版本开始，重复注解使您能够做到这一点。

例如，您正在编写代码以使用定时器服务，该服务使您能够在给定时间或按特定计划运行方法，类似于 UNIX 的 cron 服务。现在，您希望设置一个定时器来运行方法`doPeriodicCleanup()`，在每个月的最后一天和每周五晚上 11:00。要设置定时器运行，请创建一个`@Schedule`注解，并将其两次应用于`doPeriodicCleanup()`方法。第一次使用指定每个月的最后一天，第二次指定周五晚上 11 点，如下面的代码示例所示：
```
@Schedule (dayOfMonth = "last")
@Schedule (dayOfWeek = "Fri", hour = "23") 
public void doPeriodicCleanup() {...  } 
```
前面的示例将注解应用于方法。您可以在使用标准注解的任何地方重复注解。例如，您有一个用于处理未经授权的访问异常的类。您用一个`@Alert`注解为经理注释该类，用另一个为管理员注释：
```
@Alert (role = "Manager") 
@Alert (role = "Administrator")
public class UnauthorizedAccessException extends SecurityException {...  } 
```
出于兼容性原因，重复注解存储在一个由 Java 编译器自动生成的容器注解中。为了使编译器能够这样做，您的代码需要两个声明。

### （一）声明可重复注解类型
注解类型必须用`@Repeatable`元注解标记。下面的示例定义了一个自定义的`@Schedule`可重复注解类型：
```
@Repeatable(Schedules.class)
public @interface Schedule {
  String dayOfMonth() default "first";
  String dayOfWeek() default "Mon";
  int hour() default 12;
}
```
`@Repeatable`元注解括号中的值是 Java 编译器生成的用于存储重复注解的容器注解的类型。在这个例子中，包含注解的类型是`@Schedules`，因此重复的`@Schedule`注解存储在`@Schedules`注解中。

如果在没有首先声明为可重复的情况下将相同的注解应用于声明，则会导致编译时错误。

### （二）声明包含注解类型
包含注解类型必须具有一个`value`元素，其类型为数组。数组类型的组件类型必须是可重复注解类型。`@Schedules`包含注解类型的声明如下：
```
public @interface Schedules  { 
    Schedule [] value();
 } 
```

### 检索注解
Reflection API 中提供了几种方法可用于检索注解。返回单个注解的方法（如`AnnotatedElement.getAnnotation(Class<T>)`）的行为保持不变，即如果存在请求类型的一个注解，则仅返回一个注解。如果存在多个请求类型的注解，则可以通过首先获取它们的容器注解来获取它们。这样，遗留代码可以继续工作。Java SE 8 中引入了其他方法，这些方法扫描容器注解以一次返回多个注解，例如`AnnotatedElement.getAnnotationsByType(Class<T>)`。有关所有可用方法的信息，请参阅`AnnotatedElement`类规范。

### 设计考虑
在设计注解类型时，必须考虑该类型注解的基数。现在可以使用注解零次、一次，或者，如果注解的类型被标记为`@Repeatable`，则可以多次使用。还可以使用`@Target`元注解限制注解类型可以使用的位置。例如，可以创建一个只能在方法和字段上使用的可重复注解类型。重要的是要仔细设计注解类型，以确保使用该注解的程序员发现它尽可能灵活和强大。
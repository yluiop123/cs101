# 组合Lambda表达式

## 使用默认方法链接谓词
您可能已经注意到`java.util.function`包中函数式接口存在默认方法。这些方法被添加是为了允许Lambda表达式的组合和链接。

您为什么要这样做？简单地说，是帮助您编写更简单、更易读的代码。

### 链接谓词的默认方法
假设您需要处理一个字符串列表，只保留非空、非空字符串，并且长度小于5个字符的字符串。这个问题的表述方式如下：您对给定的字符串有三个测试：
- 非空；
- 非空字符串；
- 小于5个字符。

每个测试都可以很容易地用非常简单的、一行的谓词写出来。也可以将这三种测试组合成一个单独的谓词。代码如下：

```java
Predicate<String> p = s -> (s != null) && !s.isEmpty() && s.length() < 5;
```

但是JDK允许您以这种方式编写这段代码：

```java
Predicate<String> nonNull = s -> s != null;
Predicate<String> nonEmpty = s -> !s.isEmpty();
Predicate<String> shorterThan5 = s -> s.length() < 5;

Predicate<String> p = nonNull.and(nonEmpty).and(shorterThan5);
```

隐藏技术复杂性并暴露代码的意图是组合Lambda表达式的关键。

这段代码在API级别是如何实现的？不深入细节，您可以看到：
- `and()`是一个方法；
- 它被调用在`Predicate<T>`的一个实例上：因此它是一个实例方法；
- 它接受另一个`Predicate<T>`作为参数；
- 它返回一个`Predicate<T>`。

由于只允许在函数式接口上有一个抽象方法，这个`and()`方法必须是默认方法。因此从API设计的角度来看，您拥有创建这个方法所需的所有元素。好消息是：`Predicate<T>`接口有一个`and()`默认方法，所以你不必自己来做。

顺便说一下，还有一个`or()`方法接受另一个谓词作为参数，还有一个`negate()`方法不接受任何东西。

使用这些，您可以以这种方式编写前面的示例：

```java
Predicate<String> isNull = Objects::isNull;
Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNullOrEmpty = isNull.or(isEmpty);
Predicate<String> isNotNullNorEmpty = isNullOrEmpty.negate();
Predicate<String> shorterThan5 = s -> s.length() < 5;

Predicate<String> p = isNotNullNorEmpty.and(shorterThan5);
```

即使这个示例可能有点过于夸张，您可以通过利用方法引用和默认方法极大地提高代码的表现力。

### 使用工厂方法创建谓词
通过使用函数式接口中定义的工厂方法，可以进一步推动表现力。`Predicate<T>`接口上有两个。

在以下示例中，谓词`isEqualToDuke`测试一个字符串。当被测试的字符串等于"Duke"时，测试为真。这个工厂方法可以为任何类型的对象创建谓词。

```java
Predicate<String> isEqualToDuke = Predicate.isEqual("Duke");
```

第二个工厂方法对给定参数的谓词取反。

```java
Predicate<Collection<String>> isEmpty = Collection::isEmpty;
Predicate<Collection<String>> isNotEmpty = Predicate.not(isEmpty);
```

### 使用默认方法链接消费者
`Consumer<T>`接口还有一个链接消费者的方法。您可以使用以下模式链接消费者：

```java
Logger logger = Logger.getLogger("MyApplicationLogger");
Consumer<String> log = message -> logger.info(message);
Consumer<String> print = message -> System.out.println(message);

Consumer<String> longAndPrint = log.andThen(print);
```

在这个示例中，`longAndPrint`是一个消费者，它首先将消息传递给`log`消费者，然后将消息传递给`print`消费者。

### 使用默认方法链接和组合函数
链接和组合之间的区别有点微妙。两种操作的结果实际上是一样的。不同的是您的编写方式。

假设您有两个函数`f1`和`f2`。您可以通过调用`f1.andThen(f2)`来链接它们。将结果函数应用于对象，首先将对象传递给`f1`，然后将结果传递给`f2`。

`Function<T, R>`接口有第二个默认方法：`f2.compose(f1)`。用这种方式写，结果函数将首先通过将对象传递给`f1`函数进行处理，然后将结果传递给`f2`。

您需要意识到，要获得相同的结果函数，您需要在`f1`上调用`andThen()`或在`f2`上调用`compose()`。

您可以链接或组合不同类型的函数。但有明显的限制：`f1`产生的结果类型应该与`f2`消费的类型兼容。

### 创建恒等函数
`Function<T, R>`接口还有一个创建恒等函数的工厂方法，称为`identity()`。

因此，可以使用以下简单模式创建恒等函数：

```java
Function<String, String> id = Function.identity();

```

这种模式适用于任何有效类型。



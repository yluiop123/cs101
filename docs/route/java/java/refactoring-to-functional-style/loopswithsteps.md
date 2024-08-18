# Java 中将带步长的循环转换为函数式风格（Converting Loops with Steps）

## 带步长的迭代
在本教程系列的前一篇文章中，我们研究了将命令式风格编写的简单循环转换为函数式风格。在本文中，我们将看到如何处理更复杂的循环——当我们必须在间隔中跳过一些值时。
当一次遍历一个范围内的值时，`IntStream`的`range()`方法对于以函数式风格实现非常方便。该方法返回一个流，该流将为指定范围内的值一次生成一个值。乍一想，为了跳过一些值，我们可能会尝试在流上使用`filter()`方法。然而，有一个更简单的解决方案，即`IntStream`的`iterate()`方法。

## 从命令式到函数式风格
以下是一个使用步长在所需范围内跳过一些值的循环：
```java
for (int i = 0; i < 15; i = i + 3) {
  System.out.println(i);
}
```
索引变量`i`的值从`0`开始，然后随着迭代的进行，每次增加`3`。当您发现自己看到这样的循环，其中迭代不是在范围内的每个值上进行，而是跳过一些值时，请考虑使用`IntStream`的`iterate()`方法。
在我们重构代码之前，让我们更仔细地查看前面代码中的`for()`循环，但使用一对想象的眼镜，让我们看看潜在的 lambda 用法。
```java
// 想象的代码
for (int i = 0; i < 15; i = i + 3) // 命令式
for (seed, i -> i < 15, i -> i + 3)  // 函数式
```
传递给`for`循环的第一个参数是迭代的起始值或种子，它可以保持不变。第二个参数是一个谓词，它告诉索引变量`i`的值不应超过`15`。在函数式风格中，我们可以用`IntPredicate`替换它。第三个参数是递增索引变量的值，在函数式风格中，这只是一个`IntUnaryOperator`。`IntStream`接口有一个名为`iterate()`的`static`方法，很好地表示了想象的代码：`iterate(int seed, IntPredicate hasNext, IntUnaryOperator next)`。
让我们重构循环以使用函数式风格。
```java
import java.util.stream.IntStream;

...
IntStream.iterate(0, i -> i < 15, i -> i + 3)
.forEach(System.out::println);
```
这非常直接，`;`变成了`,`，我们使用了两个 lambda：一个用于`IntPredicate`，另一个用于`IntUnaryOperator`。
除了跳过值之外，我们经常使用无界循环，这会给我们带来一些复杂性，但 Java 的函数式 API 可以处理，正如我们接下来将看到的。

## 带`break`的无界迭代
让我们看一下以下命令式风格的循环，除了步长之外，它是无界的，并使用了`break`语句。
```java
for (int i = 0;; i = i + 3) {
  if(i > 20) {
    break;
  }

  System.out.println(i);
}
```
`i < 15`的终止条件消失了，并且循环是无界的，如重复的`;;`所示。然而，在循环中，如果`i`的值大于`20`，我们有`break`语句来退出迭代。
对于函数式风格，我们可以从`iterate()`方法调用中删除第二个参数，即`IntPredicate`，但这将使迭代变成一个无限流。命令式风格`break`的函数式编程等效方法是`takeWhile()`方法。如果传递给它的`IntPredicate`评估为`false`，该方法将终止内部迭代器，即流。让我们将前面带有`break`的命令式风格无界`for`循环重构为函数式风格。
```java
IntStream.iterate(0, i -> i + 3)
.takeWhile(i -> i <= 20)
.forEach(System.out::println);
```
`iterate()`方法是重载的，有两种形式，一种带有`IntPredicate`，另一种没有。我们使用了没有谓词的版本来创建一个无限流，该流从种子或起始值生成值。作为第二个参数传递的`IntUnaryOperator`决定了步长。因此，在给定的代码示例中，流将生成值`0`、`3`、`6`等等。由于我们希望限制迭代，以使索引不超过`20`的值，我们使用`takeWhile()`。传递给`takeWhile()`的谓词表示，只要给定参数（索引`i`）的值不超过`20`的值，迭代就可以继续。
我们在前一篇文章中看到，`range()`和`rangeClosed()`是简单`for`循环的直接替代。如果循环变得更加复杂，不用担心，Java 为您提供了支持，您可以使用`IntStream`的`iterate()`方法，并可选地使用`takeWhile()`，如果循环使用`break`终止。

## 映射
在任何您看到带步长的`for`循环的地方，使用带有三个参数的`iterate()`方法，一个种子或起始值，一个用于终止条件的`IntPredicate`，以及一个用于步长的`IntUnaryOperator`。如果您的循环使用`break`语句，则从`iterate()`方法调用中删除`IntPredicate`，并使用`takeWhile()`方法。`takeWhile()`是命令式风格`break`的函数式等效方法。
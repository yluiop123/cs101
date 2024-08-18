# Java 中将带有`if`的`foreach`转换为函数式风格（Converting foreach with if）

## 使用`foreach`进行迭代
在本教程系列的前几篇文章中，我们研究了将命令式风格的循环转换为函数式风格。在本文中，我们将看到如何将使用`foreach`的命令式风格迭代转换为函数式风格。此外，我们还将看到如何使用`if`选择元素并将其转换为函数式风格。
Java 5 引入了非常流行的`foreach`语法。例如，要迭代一个表示名称的`String`集合，我们会写类似于`for(String name: names)`的代码。在底层，在字节码级别，`foreach`会被转换为使用`Iterator`——当迭代器告诉我们还有另一个元素时，获取下一个元素进行处理。换句话说，`foreach`是一种简洁的语法糖，用于使用`while`循环迭代由`Iterator`提供的元素。我们可以很容易地将`foreach`转换为函数式风格。让我们看看如何实现。

## 从命令式到函数式风格
以下是一个使用`foreach`迭代名称集合的示例：
```java
List<String> names = List.of("Jack", "Paula", "Kate", "Peter");

for (String name: names) {
  System.out.println(name);
}
```
在每次迭代中，随着迭代从给定集合中的一个元素前进到下一个元素，`name`变量会被绑定到一个新的值。将命令式风格的`foreach`转换为函数式风格，直接使用`forEach`内部迭代器方法即可。它被称为内部迭代器，因为前进到下一个元素是在内部自动处理的，而不是外部或显式地处理。
让我们重构这个循环以使用函数式风格：
```java
List<String> names = List.of("Jack", "Paula", "Kate", "Peter");

names.forEach(name -> System.out.println(name));
```
这非常直接，`for`循环变成了对集合上的`forEach()`方法的调用。在每次迭代中，作为参数提供给`forEach()`的 lambda 会被集合中的下一个元素调用。
接下来展示了一个使用`stream()`的略微变化的迭代：
```java
List<String> names = List.of("Jack", "Paula", "Kate", "Peter");

names.stream()
 .forEach(name -> System.out.println(name));
```
`forEach()`方法在`Collection<T>`和`Stream<T>`上都可用。像`filter()`这样的函数（我们很快会使用到），只在`Stream<T>`上可用，而不在`Collection`上。这是为了在多个中间操作可能在终端操作（如`forEach()`、`findFirst()`等）之前进行时提供效率而设计的。

## 使用`if`选择元素
假设在迭代过程中，我们想要根据某些条件从集合中选择一些值。例如，如果我们只想打印长度为 4 的名称，该怎么办？在命令式风格中，我们可以这样做：
```java
List<String> names = List.of("Jack", "Paula", "Kate", "Peter");

for (String name: names) {
  if(name.length() == 4) {
    System.out.println(name);
  }
}
```
对于函数式风格，`Stream`的`filter`方法直接替代了命令式风格的`if`。如果作为 lambda 传递给`filter()`方法的谓词评估为`true`，`filter`方法将允许集合中的元素通过并进入函数式管道的下一个阶段；否则，该值将被丢弃，不再进行进一步处理。
让我们将前面的代码转换为函数式风格：
```java
List<String> names = List.of("Jack", "Paula", "Kate", "Peter");

names.stream()
 .filter(name -> name.length() == 4)
 .forEach(name -> System.out.println(name));
```
`filter()`方法就像一个门，在迭代过程中，它打开让一些元素通过，关闭拒绝或丢弃一些元素。
在前几篇文章中，我们看到了传统`for`循环的函数式风格等效代码。在本文中，我们看到了 Java 5 中的命令式风格`foreach`如何转换为函数式风格中的优雅语法。此外，命令式风格循环中的`if`条件转换为对`Stream` API 的`filter()`方法的调用。

## 映射
在任何看到`foreach`循环的地方，直接在集合上使用`forEach()`方法。如果`foreach`的主体中有一个`if`语句来选择性地选择一些值，则使用`stream()` API 并调用`filter()`方法。
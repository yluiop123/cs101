# Java 中将带有转换的迭代转换为函数式风格（Iteration with Transformation）

## 带有转换的迭代
在之前的教程中，我们探讨了如何将简单的迭代和带有条件的迭代从命令式风格转换为函数式风格。在这篇教程中，我们将处理在迭代过程中进行元素转换的情况。

假设我们有一个整数列表，并且想要将每个整数乘以 2 并打印出来。在命令式风格中，可能会这样写：
```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

for (Integer number : numbers) {
    int result = number * 2;
    System.out.println(result);
}
```

## 从命令式到函数式风格
要将这种带有转换的迭代转换为函数式风格，我们可以利用 Java 8 的`Stream` API。以下是转换后的代码：
```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

numbers.stream()
   .map(number -> number * 2)
   .forEach(result -> System.out.println(result));
```
在这个函数式代码中，`map`方法用于对每个元素进行转换。它接受一个函数作为参数，该函数定义了如何对每个元素进行转换。在这个例子中，我们将每个数字乘以 2。然后，`forEach`方法用于处理转换后的结果。

## 映射
当遇到在迭代过程中需要对元素进行转换的情况时，使用`Stream`的`map`方法结合`forEach`方法来实现函数式风格的代码。`map`方法用于定义转换逻辑，`forEach`方法用于处理转换后的结果。 
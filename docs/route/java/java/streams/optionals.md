# 使用Optionals

## 支持可能无法产生结果的方法
我们已经讨论了`Optional`类的多种用途，特别是在对没有恒等元素的流调用终端操作时。这种情况不易处理，因为你不能返回任何值，包括0，返回`null`会让你的代码不得不在不希望出现的地方处理`null`值。

能够在无法产生值的情况下使用`Optional`类，为更好的模式提供了许多机会，特别是对于错误的更好处理。这是你应该使用选项对象的主要原因：它们表明在某些情况下，方法可能不会产生结果。在字段中存储`Optional`实例，在列表中，在映射中，或将其作为方法参数传递，并不是选项被创建的目的。

如果你设计一个返回可选值的方法，或者需要在变量中存储可选值，那么你不应该返回`null`或将此变量设置为`null`。你应该利用你的可选值可以为空的事实。

简而言之，`Optional`类是一个包装类，可以包装引用：`Optional<T>`，或者值：`OptionalInt`、`OptionalLong`和`OptionalDouble`。与您已经知道的典型包装类型：`Integer`、`Long`、`Double`等...的区别在于，可选对象可以为空。这样的实例不包装任何东西。

如果你需要一种机制，从你的方法返回某些东西意味着_没有值_，并且返回`null`可能会导致错误，包括`NullPointerException`，那么你应该考虑返回一个可选对象，并在这种情况下返回一个空的可选。

## 创建Optional对象
`Optional`类是一个最终类，构造函数是私有的。因此，创建它的实例的唯一方法是通过调用它的工厂方法之一。有三个这样的方法。
1. 你可以通过调用`Optional.empty()`来创建一个空的可选。
2. 你可以通过使用这个元素作为参数调用`Optional.of()`来包装非`null`元素。不允许向这个方法传递`null`引用。在这种情况下，你会得到一个`NullPointerException`。
3. 你可以通过使用这个元素作为参数调用`Optional.ofNullable()`来包装任何元素。你可以向这个方法传递`null`引用。在这种情况下，你将得到一个空的可选。

这些是创建此类实例的唯一方法。正如你所看到的，你不能使用可选对象包装`null`引用。因此，打开非空可选始终会返回非`null`引用。

`Optional<T>`类有三个等效的类，用于与数字的专业流一起使用：`OptionalInt`、`OptionalLong`和`OptionalDouble`。这些类是原始类型的包装器，即值。`ofNullable()`方法对这些类没有意义，因为值不能为`null`。

## 打开Optional对象
有几种使用可选并访问它包装的元素（如果有的话）的方法。你可以直接查询你拥有的实例，并在有内容时打开它，或者你可以在它上面使用类似流的方法：`map()`、`flatMap()`、`filter()`，甚至是`forEach()`的等效方法。

打开一个可选以获取其内容应该小心，因为如果可选为空，它将引发`NoSuchElementException`。除非你确定你的可选中有元素，否则你应该首先测试它，然后再进行此操作。

有两种方法可以测试你的可选对象：`isPresent()`和Java SE 11中添加的`isEmpty()`。

然后，你可以使用以下方法打开你的可选。
- `get()`: 这个方法已经被弃用，因为它看起来像一个_getter_，但如果可选为空，它可能会抛出`NoSuchElementException`。
- `orElseThrow()`是Java SE 10以来的首选模式。它和`get()`方法做同样的事情，但它的名字没有任何疑问，表明它可能会抛出`NoSuchElementException`。
- `orElseThrow(Supplier exceptionSupplier)`: 和前一种方法做同样的事情。它使用你作为参数传递的供应商来创建它抛出的异常。

你也可以尝试获取一个可选对象的内容，并提供一个对象，如果可选为空，则返回该对象。
- `orElse(T returnedObject)`: 如果在空可选上调用，则返回参数。
- `orElseGet(Supplier<T> supplier)`: 和前一个方法做同样的事情，不需要构建返回的对象，如果构建这个对象证明是昂贵的。事实上，只有在需要时才调用提供的供应商。

最后，如果这个可选是空的，你可以创建另一个可选。
- `or(Supplier<Optional> supplier)`: 如果它不为空，则返回这个未修改的可选，并在空的情况下调用提供的供应商。这个供应商创建了另一个可选，由这个方法返回。

## 处理Optional对象
`Optional`类还提供了模式，以便你可以将可选对象的处理与流处理集成。它有直接对应于流API中的方法，你可以使用它们以相同的方式处理你的数据，并且将与流无缝集成。这些方法是`map()`、`filter()`和`flatMap()`。它们接受与流API中的对应方法相同的参数，除了`flatMap()`，它接受一个返回`Optional<T>`实例的函数，而不是`Stream`实例。

这些方法返回一个可选对象，遵循以下约定。
1. 如果调用它们的可选是空的，那么它们返回一个可选对象。
2. 如果它不是空的，那么它们的参数、函数或谓词将应用于此选项的内容。结果被包装在另一个选项中，由这个方法返回。

使用这些方法可以在某些流模式中得到更易读的代码。

假设你有一系列`Customer`实例，它们有一个`id`属性。你需要找到给定ID的客户的名字。使用流的词汇，你需要找到给定ID的客户，并将其映射到它的名字。

你可以使用以下模式做到这一点。

```
String findCustomerNameById(int id){
    List<Customer> customers = ...;

    return customers.stream()
                    .filter(customer -> customer.getId() == id)
                    .findFirst()
                    .map(Customer::getName)
                    .orElse("UNKNOWN");
}
```

你可以看到这种模式中，`map()`方法来自`Optional`类，并且与流处理很好地集成。你不需要检查`findFirst()`方法返回的可选对象是否为空；调用`map()`实际上就是为你做的。

让我们检查另一个更复杂的例子，演示如何使用这些方法。通过这个例子，你将看到流API、收集器API和可选对象的几个主要模式。

假设你有一组文章需要处理。一篇文章有一个标题，一个起始年份，和一列作者。一个作者有一个名字。

你的列表中有很多文章，你需要知道哪些作者一起发表了最多的文章。

你的第一个想法可能是为给定的文章构建一对口对口的作者流。这实际上是给定文章作者集合的笛卡尔积。你不需要这个流中的所有对。你对两个作者是同一个作者的对不感兴趣；两个作者的对(_A1_, _A2_)与对(_A2_, _A1_)相同。为了实现这个约束，你可以通过声明，在对中，作者按字母顺序排序来添加对的约束。

让我们为这个模型写两个记录。

```
record Article (String title, int inceptionYear, List<Author> authors) {}

record Author(String name) implements Comparable<Author> {
    public int compareTo(Author other) {
        return this.name.compareTo(other.name);
    }
}

record PairOfAuthors(Author first, Author second) {
    public static Optional<PairOfAuthors> of(Author first, Author second) {
        if (first.compareTo(second) > 0) {
            return Optional.of(new PairOfAuthors(first, second));
        } else {
            return Optional.empty();
        }
    }
}
```

在`PairOfAuthors`记录中创建一个工厂方法允许你控制允许哪些实例的记录，并防止创建你不需要的对。为了表明这个工厂方法可能无法产生结果，你可以将它包装在一个可选中。这完全遵循原则：如果你不能产生结果，返回一个空的可选。

让我们写一个函数，为给定的文章创建一个`Stream<PairOfAuthors>`。你可以用两个嵌套的流进行笛卡尔积。

作为第一步，你可以写一个双函数，从文章和作者创建这个流。

```
BiFunction<Article, Author, Stream<PairOfAuthors>> buildPairOfAuthors =
    (article, firstAuthor) ->
        article.authors().stream().flatMap(
            secondAuthor -> PairOfAuthors.of(firstAuthor, secondAuthor).stream());
```

这个双函数从文章作者的流中创建了一个可选对象。你可以看到`stream()`方法被调用在`of()`方法返回的可选对象上。如果可选为空，返回的流是空的，否则只包含一对作者。这个流由`flatMap()`方法处理。这个方法打开流，空的就会消失，只有有效的对会出现在结果流中。

现在你可以构建一个函数，使用这个双函数从文章中创建作者对的流。

```
Function<Article, Stream<PairOfAuthors>> toPairOfAuthors =
    article ->
        article.authors().stream()
                     .flatMap(firstAuthor -> buildPairOfAuthors.apply(article, firstAuthor));
```

知道哪两位作者一起出版最多的，可以通过直方图来完成，其中键是对的作者，值是他们一起写的的文章数量。

你可以使用`groupingBy()`收集器来构建这个直方图。让我们先创建作者对的流。

```
Stream<PairOfAuthors> pairsOfAuthors =
    articles.stream()
            .flatMap(toPairOfAuthors);
```

这个流是这样构建的，如果一对作者一起写了两篇文章，这对就会出现在流中两次。所以，你需要做的就是计算每个对在这个流中出现了多少次。这可以通过`groupingBy()`模式来完成，其中分类器是恒等函数：对本身。在这一点上，值是对的列表，你需要计数。所以下游收集器只是`counting()`收集器。

```
Map<PairOfAuthors, Long> numberOfAuthorsTogether =
    articles.stream()
            .flatMap(toPairOfAuthors)
            .collect(Collectors.groupingBy(
                    Function.identity(),
                    Collectors.counting()
            ));
```

找到一起出版最多的作者，是通过提取这个映射的最大值来完成的。你可以为这个处理创建以下函数。

```
Function<Map<PairOfAuthors, Long>, Map.Entry<PairOfAuthors, Long>> maxExtractor =
    map -> map.entrySet().stream()
                         .max(Map.Entry.comparingByValue())
                         .orElseThrow();
```

这个函数在`Stream.max()`方法返回的可选对象上调用了`orElseThrow()`方法。

这个可选对象可能是空的吗？为了使它为空，映射本身必须是空的，这意味着原始流中没有作者对。只要你至少有一篇文章至少有两个作者，那么这个可选就不为空。

### 按每年找到一起出版最多的两位作者

让我们更进一步，想知道是否可以对每年进行相同的处理。实际上，如果能够使用单个收集器实现这个处理，那就可以解决你的问题，因为然后你可以将其作为下游收集器传递给`groupingBy(Article::inceptionYear)`收集器。

将映射到提取最大值的后处理可以作为一个`collectingAndThen()`收集器。这个模式在前面的部分“使用修饰器对收集器进行后期处理”中已经介绍过了。

让我们提取`groupingBy()`收集器和修饰器。如果你使用IDE输入这段代码，你可以使用它来获取收集器的正确类型。

```
Collector<PairOfAuthors, ?, Map<PairOfAuthors, Long>> groupingBy =
        Collectors.groupingBy(
                Function.identity(),
                Collectors.counting()
        );

Function<Map<PairOfAuthors, Long>, Map.Entry<PairOfAuthors, Long>> finisher =
        map -> map.entrySet().stream()
                  .max(Map.Entry.comparingByValue())
                  .orElseThrow();

```

现在你可以将它们合并到一个单独的`collectingAndThen()`收集器中。你可以将`groupingBy()`收集器识别为第一个参数，将`finisher`函数作为第二个参数。

```
Collector<PairOfAuthors, ?, Map.Entry<PairOfAuthors, Long>> pairOfAuthorsEntryCollector =
    Collectors.collectingAndThen(
            Collectors.groupingBy(
                Function.identity(),
                Collectors.counting()
            ),
            map -> map.entrySet().stream()
                      .max(Map.Entry.comparingByValue())
                      .orElseThrow()
    );

```

现在你可以写出带有初始flatmap操作和这个收集器的完整模式。

```
Map.Entry<PairOfAuthors, Long> numberOfAuthorsTogether =
    articles.stream()
            .flatMap(toPairOfAuthors)
            .collect(pairOfAuthorsEntryCollector);
```

由于使用了`flatMapping()`收集器，你可以通过合并中间的`flatMap()`和终端收集器，使用单个收集器编写此代码。以下代码与前一个代码等效。

```
Map.Entry<PairOfAuthors, Long> numberOfAuthorsTogether =
    articles.stream()
            .collect(
                Collectors.flatMapping(
                    toPairOfAuthors,
                    pairOfAuthorsEntryCollector)
```

按每年找到出版最多的两位作者，只是将这个`flatMapping()`收集器作为下游收集器传递给正确的`groupingBy()`。

```
Collector<Article, ?, Map.Entry<PairOfAuthors, Long>> flatMapping =
    Collectors.flatMapping(
            toPairOfAuthors,
            pairOfAuthorsEntryCollector));

Map<Integer, Map.Entry<PairOfAuthors, Long>> result =
    articles.stream()
            .collect(
                Collectors.groupingBy(
                    Article::inceptionYear,
                    flatMapping
                )
            );
```

你可能还记得，在`flatMapping()`收集器的深处有一个对`Optional.orElseThrow()`的调用。在之前的模式中，很容易检查这个调用是否会失败，因为在这一点上有一个空的可选是相当容易猜到的。

现在我们已经将这个收集器作为一个下游收集器使用，情况就不同了。你如何确定每年至少有一篇文章是由至少两位作者写的呢？更安全的做法是保护这段代码不受任何`NoSuchElementException`的影响。

### 避免打开Optionals

在第一个上下文中可以被接受的模式现在更加危险。处理它的方法就是从一开始就不调用`orElseThrow()`。

在这种情况下，收集器就变成了以下这样。它不是创建一对作者对和长数字的键值对，而是将结果包装在一个可选对象中。

```
Collector<PairOfAuthors, ?, Optional<Map.Entry<PairOfAuthors, Long>>> pairOfAuthorsEntryCollector =
    Collectors.collectingAndThen(
        Collectors.groupingBy(
            Function.identity(),
            Collectors.counting()
        ),
        map -> map.entrySet().stream()
                  .max(Map.Entry.comparingByValue())
);
```

注意`orElseThrow()`不再被调用，导致收集器的签名中有一个可选。

这个可选也出现在`flatMapping()`收集器的签名中。

```
Collector<Article, ?, Optional<Map.Entry<PairOfAuthors, Long>>> flatMapping =
    Collectors.flatMapping(
            toPairOfAuthors,
            pairOfAuthorsEntryCollector
);
```

使用这个收集器创建每年作者对的映射会创建一个类型为`Map<Integer, Optional<Map.Entry<PairOfAuthors, Long>>>`的映射，这是我们不需要的类型：有一个值是空可选的映射是无用的，也许是昂贵的。这是一个反模式。不幸的是，没有办法在计算这个最大值之前猜测这个可选是否会为空。

一旦这个中间映射构建完成，你需要摆脱空的可选，以构建你需要的直方图映射。我们将使用与之前相同的技术：在可选对象上调用`stream()`方法，在`flatMap()`上，以便`flatMap()`操作默默地删除空的可选。

这个模式如下。

```
Map<Integer, Map.Entry<PairOfAuthors, Long>> histogram =
    articles.stream()
            .collect(
                Collectors.groupingBy(
                        Article::inceptionYear,
                        flatMapping
                )
            )  // Map<Integer, Optional<Map.Entry<PairOfAuthors, Long>>>
            .entrySet().stream()
            .flatMap(
                entry -> entry.getValue()
                              .map(value -> Map.entry(entry.getKey(), value))
                              .stream())
            .collect(Collectors.toMap(
                    Map.Entry::getKey, Map.Entry::getValue
            )); // Map<Integer, Map.Entry<PairOfAuthors, Long>>
```

注意这个模式中的flatmap函数。它以类型为`Optional<Map.Entry<PairOfAuthors, Long>>`的`entry`作为参数，并在此可选上调用`map()`。

如果可选是空的，这个调用将返回一个空的可选。然后映射函数被忽略。接下来的`stream()`调用将返回一个空的流，这将从主流中删除，因为我们在一个`flatMap()`调用中。

如果可选中有值，那么映射函数将使用这个值被调用。这个映射函数创建了一个新的键值对，具有相同的键和这个存在的值。这个键值对是类型`Map.Entry<PairOfAuthors, Long>`，并被这个`map()`方法包装在一个可选对象中。`stream()`调用创建了一个包含这个可选内容的流，然后由`flatMap()`调用打开。

这个模式将`Stream<Map.Entry<Integer, Optional<Map.Entry<PairOfAuthors, Long>>>>`带有空可选的映射到`Stream<Map.Entry<Integer, Map.Entry<PairOfAuthors, Long>>>`，删除了所有有空可选的键/值对。

由于你知道这个流中不能有相同的键两次，所以可以安全地使用`toMap()`收集器重新创建映射。

这个模式使用了流API和可选的三个重要点。

1. `Optional.map()`方法，如果它在一个空可选上被调用，它将返回一个空可选。
2. `Optional.stream()`方法，它在可选的内容上打开一个流。如果可选是空的，那么返回的流也是空的。它允许你从可选空间无缝地移动到流空间。
3. `Stream.flatMap()`方法，它打开从可选构建的流，默默地删除空的流。

## 消费Optional的内容
`Optional`类还有两个方法，它们接受一个消费者作为参数。

- `ifPresent(Consumer consumer)`: 如果这个可选中有内容，这个方法将调用提供的内容的消费者。它实际上等同于`Stream.forEach(Consumer)`方法。
- `ifPresentOrElse(Consumer consumer, Runnable runnable)`: 如果可选不为空，这个方法和前一个方法做同样的事情。如果为空，那么它将调用提供的`Runnable`实例。

## 正确使用Optional的一些规则

**规则#1** 永远不要对可选变量或返回值使用`null`。

**规则#2** 除非你确定可选不为空，否则永远不要调用`orElseThrow()`或`get()`。

**规则#3** 优先选择`ifPresent()`、`orElseThrow()`或`get()`的替代方法。

**规则#4** 不要为了避免测试引用的空性而创建可选。

**规则#5** 不要在字段、方法参数、集合和映射中使用可选。

**规则#6** 不要对可选对象使用身份敏感的操作，如引用相等性、身份哈希码和同步。

**规则#7** 不要忘记可选对象不是可序列化的。


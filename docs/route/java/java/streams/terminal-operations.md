# 在流上添加终端操作

## 避免使用Reduce方法
如果流不以终端操作结束，则不会处理任何数据。我们已经介绍了 `reduce()` 这个终端操作，并在其他示例中看到了许多终端操作。现在，我们将介绍您可以在流上使用的其他终端操作。
使用 `reduce()` 方法不是简化流的最容易的方式。您需要确保您提供的二元操作符是结合的，然后您需要知道它是否有恒等元素。您需要检查许多要点以确保您的代码正确并产生预期的结果。如果您可以避免使用 `reduce()` 方法，那么您绝对应该这样做，因为它很容易出错。
幸运的是，Stream API为您提供了其他许多简化流的方法：我们在介绍数字流时介绍的 `sum()`、`min()` 和 `max()` 是方便的方法，您可以使用它们代替等效的 `reduce()` 调用。我们将在本部分介绍更多您应该了解的方法，以避免使用 `reduce()` 方法。实际上，您应该将这个 `reduce()` 方法作为最后的手段，仅在没有其他解决方案时使用。

## 统计流处理的元素数量
`count()` 方法出现在所有流接口中：无论是专门的流还是对象流。它只是返回流处理的元素数量，以 `long` 类型返回。这个数字可能非常大，实际上可以大于 `Integer.MAX_VALUE`，因为它是 `long` 类型。因此，流可以计算出比您可以放入 `ArrayList` 中的元素更多的对象。
您可能想知道为什么您需要如此大的数字。实际上，您可以从许多来源创建流，包括可以产生大于 `Integer.MAX_VALUE` 的元素数量的来源。即使不是这种情况，也很容易创建一个中间操作，将流处理的元素数量乘以一个因子。我们在本教程前面介绍的 `flatMap()` 方法就可以做到这一点。有许多方法可能导致您最终需要处理的元素数量大于 `Integer.MAX_VALUE`。这就是为什么 Stream API 支持它的原因。
以下是一个 `count()` 方法的示例。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten");

long count =
    strings.stream()
           .filter(s -> s.length() == 3)
           .count();
System.out.println("count = " + count);

```

运行此代码将产生以下结果。

```
count = 4
```

## 逐个消费每个元素
Stream API 的 `forEach()` 方法允许您将流的每个元素传递给 `Consumer` 接口的实例。此方法非常适合打印流处理的元素。以下代码就是这样做的。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");
strings.filter(s -> s.length() == 3)
       .map(String::toUpperCase)
       .forEach(System.out::println);

```

运行此代码将打印出以下内容。

```
ONE
TWO
```

这个方法非常简单，您可能会被诱惑在错误的用例中使用它。

请记住，您编写的 lambda 表达式应该避免在其外部作用域中进行变异。有时，在外部状态进行变异被称为 _产生副作用_。消费者的情况很特殊，因为没有任何副作用的消费者对您来说并没有太多用处。实际上，调用 `System.out.println()` 会在您的应用程序控制台上产生副作用。

让我们考虑以下示例。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");
List<String> result = new ArrayList<>();

strings.filter(s -> s.length() == 3)
       .map(String::toUpperCase)
       .forEach(result::add);

System.out.println("result = " + result);

```

运行前面的代码将打印出以下内容。

```
result = [ONE, TWO]
```

所以您可能会被诱惑使用这段代码，因为它很简单，并且 "就是工作"。嗯，这段代码有几个错误之处。让我们逐一了解。

调用 `result::add` 将通过在流内部变异外部的 `result` 列表，将流处理的所有元素添加到该列表中。这个消费者在流本身的作用域之外创建了一个副作用。

访问这样的变量使您的 lambda 表达式成为一个 _捕获 lambda 表达式_。创建这样的 lambda 表达式是完全合法的；您只需要意识到这样做在性能上会有很大的影响。如果性能在您的应用程序中是一个重要问题，那么您应该避免编写捕获 lambda。

此外，这种编写方式会阻止您使此流并行。如果您尝试这样做，那么您将有多个线程同时访问您的结果列表。这个列表是 `ArrayList` 的实例，不是为处理并发访问而设计的类。

您有两种模式可以将流的元素存储在列表中。以下示例演示了使用集合对象的第一个模式。第二个模式使用 Collector 对象，在稍后介绍。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toList());

```

这个收集器创建了一个 `ArrayList` 的实例，并将流处理的元素添加到其中。因此，这种模式没有创建任何副作用，因此在性能上没有损失。

并发和并行性由 Collector API 本身处理，所以您可以安全地使这个流并行。

这段模式代码与前面的代码一样简单易读。它没有任何在消费者对象内创建副作用的缺点。这绝对是您应该在代码中使用的模式。

从 Java SE 16 开始，您有了第二种更简单的模式。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .toList();

```

这种模式生成一个特殊的 `List` 实例，它是不可修改的。如果您需要一个可修改的列表，您应该坚持使用第一个收集器模式。它也可能比收集流到 `ArrayList` 的实例表现得更好。下一段将介绍这一点。

## 将流元素收集到集合或数组中
Stream API 为您提供了几种将流处理的所有元素收集到集合中的方式。您已经在前一节中对其中两种模式有了初步了解。让我们看看其他的。

在选择合适的模式之前，您需要问自己几个问题。

- 您是否需要构建一个不可修改的列表？
- 您是否习惯使用 `ArrayList` 的实例？或者您更倾向于使用 `LinkedList`？
- 您是否确切知道流将处理多少元素？
- 您是否需要将元素收集到一个精确的、可能是第三方或自制的 `List` 实现中？

Stream API 可以处理所有这些情况。

### 收集到普通的 ArrayList 中
您已经在前面的示例中使用了这个模式。这是您可以使用的最简单的模式，它以 `ArrayList` 的实例返回元素。

以下是这种模式的一个示例。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toList());

```

这个模式创建了一个简单的 `ArrayList` 实例，并将流的元素累积在其中。如果有太多元素而 `ArrayList` 的内部数组无法存储它们，当前数组将被复制到一个更大的数组中，并由垃圾收集器处理。

如果您想避免这种情况，并且您知道流将产生多少元素，那么您可以使用 `Collectors.toCollection()` 收集器，它接受一个供应商作为参数，以创建您将收集处理过的元素的集合。以下代码使用这种模式创建了一个初始容量为 10,000 的 `ArrayList` 实例。

```java
Stream<String> strings = ...;

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toCollection(() -> new ArrayList<>(10_000)));

```

### 收集到不可修改的列表中
有些情况下，您需要将元素累积在一个不可修改的列表中。这可能听起来有些矛盾，因为收集本质上是向必须可变的容器中添加元素。实际上，这就是 Collector API 稍后将在本教程中详细看到的工作原理。在这种累积操作结束时，Collector API 可以进行最后一个可选操作，此时，它包括在返回之前将列表封闭起来。

要做到这一点，您只需要使用以下模式。

```java
Stream<String> strings = ...;

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toUnmodifiableList()));

```

在这个例子中，`result` 是一个不可修改的列表。

从 Java SE 16 开始，有一种更好的方式将您的数据收集到不可修改的列表中，在某些情况下可能更有效率。模式如下。

```java
Stream<String> strings = ...;

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .toList();

```

它如何更有效率？第一个模式，建立在收集器的使用上，首先将元素收集到一个普通的 `ArrayList` 中，然后在处理完成后将其封闭以使其不可修改。您的代码看到的只是从这个 `ArrayList` 构建的不可修改列表。

众所周知，`ArrayList` 的实例是建立在一个固定大小的内部数组上的。这个数组可能会满。在这种情况下，`ArrayList` 实现会检测到它，并将数组复制到一个更大的数组中。这个机制对客户端是透明的，但它带来了开销：复制这个数组需要一些时间。

在某些情况下，Stream API 可以跟踪在消耗整个流之前要处理多少元素。在这种情况下，创建一个合适大小的内部数组更有效率，因为它避免了将小数组复制到大数组中的开销。

这种优化已经在 Java SE 16 中添加的 `Stream.toList()` 方法中实现。如果您需要一个不可修改的列表，那么您应该使用这种模式。

### 收集到自制列表中
如果您需要将数据收集到您自己的列表或 JDK 外部的第三方列表中，那么您可以使用 `Collectors.toCollection()` 模式。您用于调整 `ArrayList` 实例初始大小的供应商也可以用于构建任何 `Collection` 的实现，包括不是 JDK 一部分的实现。您所需提供的只是一个供应商。以下示例中，我们提供了一个供应商来创建 `LinkedList` 的实例。

```java
Stream<String> strings = ...;

List<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toCollection(LinkedList::new));

```

### 收集到集合中
由于 `Set` 接口是 `Collection` 接口的扩展，您可以使用模式 `Collectors.toCollection(HashSet::new)` 将数据收集到 `Set` 的实例中。这很好，但 Collector API 仍然为您提供了一个更清晰的模式：`Collectors.toSet()`。

```java
Stream<String> strings = ...;

Set<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toSet());

```

您可能想知道这两种模式是否有任何区别。答案是肯定的，有一个微妙的区别，您将在本教程后面看到。

如果您需要一个不可修改的集合，Collector API 为您提供了另一个模式：`Collectors.toUnmodifiableSet()`。

```java
Stream<String> strings = ...;

Set<String> result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .collect(Collectors.toUnmodifiableSet());

```

### 收集到数组中
Stream API 还有自己的一组 `toArray()` 方法重载。有两个。

第一个是一个简单的 `toArray()` 方法，返回一个 `Object[]` 的实例。如果您的流的确切类型是已知的，那么如果您使用这种模式，这个类型就会丢失。

第二个接受一个 `IntFunction<T[]>` 类型的参数。这种类型一开始可能看起来令人生畏，但编写这个函数的实现实际上非常容易。如果您需要构建一个字符串字符数组，那么这个函数的实现就是 `String[]::new`。

```java
Stream<String> strings = ...;

String[] result =
    strings.filter(s -> s.length() == 3)
           .map(String::toUpperCase)
           .toArray(String[]::new);

System.out.println("result = " + Arrays.toString(result));

```

运行此代码将产生以下结果。

```
result = [ONE, TWO]
```

## 提取流的最大值和最小值
Stream API 为您提供了几种方法，具体取决于您当前正在处理的流类型。

我们已经介绍了数字流的 `max()` 和 `min()` 方法：`IntStream`、`LongStream` 和 `DoubleStream`。您知道这些操作没有恒等元素，所以您不会惊讶地发现它们都返回可选对象。

顺便说一下，这些数字流的 `average()` 方法也返回一个可选对象，因为平均操作也没有恒等元素。

`Stream` 接口还有两个方法 `max()` 和 `min()`，它们也返回一个可选对象。与对象流的区别在于，`Stream` 的元素可以是任何类型。为了能够计算最大值或最小值，实现需要比较这些对象。这就是为什么您需要为这些方法提供一个比较器。

以下是 `max()` 方法的实际应用。

```java
Stream<String> strings = Stream.of("one", "two", "three", "four");
String longest =
    strings.max(Comparator.comparing(String::length))
            .orElseThrow();
System.out.println("longest = " + longest);

```

它将在您的控制台上打印出以下内容。

```
longest = three
```

请记住，尝试打开一个空的可选对象会抛出 `NoSuchElementException`，这是您不想在应用程序中看到的。这只会发生在您的流没有任何数据要处理的情况下。在这个简单的例子中，您有一个流处理了几个字符字符串，没有过滤操作。这个流不可能为空，所以您可以安全地打开这个可选对象。

## 在流中查找元素
Stream API 为您提供了两个终端操作来查找元素：`findFirst()` 和 `findAny()`。这两种方法不接受任何参数，并返回流中的单个元素。为了正确处理空流的情况，这个元素被包装在一个可选对象中。如果您的流为空，那么这个可选也是空的。

要理解返回哪个元素，需要理解流可能是 _有序的_。有序流只是在 Stream API 中元素的顺序很重要并被保持的流。默认情况下，在任何有序来源（例如 `List` 接口的实现）上创建的流本身也是有序的。

在这样一个流中，有第一个、第二个或第三个元素是有意义的。在这样一个流中找到 _第一个_ 元素也很有意义。

如果您的流没有顺序，或者在流处理中丢失了顺序，那么找到 _第一个_ 元素是未定义的，调用 `findFirst()` 实际上会返回流的任何元素。您将在本教程后面的部分看到有关有序流的更多细节。

请注意，调用 `findFirst()` 会触发流实现中的一些检查，以确保如果您的流是有序的，您将获得该流的 _第一个_ 元素。如果流是并行的，这可能是昂贵的。在许多情况下，找到第一个元素并不重要，包括您的流只处理单个元素的情况。在所有这些情况下，您应该使用 `findAny()` 而不是 `findFirst()`。

让我们看看 `findFirst()` 在实际中的应用。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten");

String first =
    strings.stream()
           // .unordered()
           // .parallel()
           .filter(s -> s.length() == 3)
           .findFirst()
           .orElseThrow();

System.out.println("first = " + first);

```

这个流是在 `List` 的实例上创建的，这使它成为一个 _有序_ 流。注意，`unordered()` 和 `parallel()` 的两个调用在这第一版中被注释掉了。

多次运行此代码将始终给您相同的结果。

```
first = one
```

`unordered()` 中间方法调用使您的 _有序_ 流变为 _无序_ 流。在这种情况下，这没有任何区别，因为您的流是顺序处理的。您的数据来自列表，列表总是以相同的顺序遍历其元素。出于同样的原因，将 `findFirst()` 方法调用替换为 `findAny()` 方法调用也没有区别。

您可以对此代码进行的第一个修改是取消注释 `parallel()` 方法调用。现在您有一个并行处理的 _有序_ 流。多次运行此代码将始终给您相同的结果：`one`。这是因为您的流是 _有序的_，所以第一个元素是定义的，不管您的流是如何处理的。

要使这个流变得 _无序_，您可以取消注释 `unordered()` 方法调用，或者将 `List.of()` 替换为 `Set.of()`。在这两种情况下，用 `findFirst()` 结束您的流将从那个并行流中返回一个随机元素。并行流的处理方式就是这样。

您可以对这段代码进行的第二个修改是将 `List.of()` 替换为 `Set.of()`。现在这个源不再是 _有序_ 的。此外，`Set.of()` 返回的实现是这样的，集合中元素的遍历发生在随机顺序中。多次运行此代码表明，即使 `unordered()` 和 `parallel()` 都被注释掉了，`findFirst()` 和 `findAny()` 都返回了一个随机的字符串。在 _非有序_ 源中查找 _第一个_ 元素是未定义的，结果是随机的。

从这些示例中，您可以推断出并行流的实现中采取了一些预防措施来跟踪哪个元素是第一个。这构成了开销，所以在这种情况下，只有在真正需要时才应该调用 `findFirst()`。

## 检查流的元素是否与谓词匹配
有些情况下，找到流中的元素或未能在流中找到任何元素可能是您真正需要执行的操作。您找到的元素对您的应用程序不重要；重要的是，这个元素存在。

以下代码将起作用，以检查给定元素的存在。

```java
boolean exists =
    strings.stream()
           .filter(s -> s.length() == 3)
           .findFirst()
           .isPresent();

```

实际上，这段代码检查返回的可选是否为空。

前面的模式工作得很好，但 Stream API 为您提供了一种更有效的方法。实际上，构建这个可选对象是一个开销，如果您使用以下三种方法之一，您就不需要支付这个开销。这三种方法接受一个谓词作为参数。

- `anyMatch(predicate)`：如果流中找到一个与给定谓词匹配的元素，则返回 `true`。
- `allMatch(predicate)`：如果流的所有元素都与谓词匹配，则返回 `true`。
- `noneMatch(predicate)`：如果没有任何元素与谓词匹配，则返回 `true`。

让我们看看这些方法的实际应用。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten");

boolean noBlank  =
        strings.stream()
               .allMatch(Predicate.not(String::isBlank));
boolean oneGT3   =
        strings.stream()
               .anyMatch(s -> s.length() == 3);
boolean allLT10  =
        strings.stream()
               .noneMatch(s -> s.length() > 10);

System.out.println("noBlank = " + noBlank);
System.out.println("oneGT3  = " + oneGT3);
System.out.println("allLT10 = " + allLT10);

```

运行此代码将产生以下结果。

```
noBlank = true
oneGT3  = true
allLT10 = true
```

## 短路流的处理
您可能已经注意到我们在这里介绍的不同终端操作之间有一个重要的区别。

其中一些需要处理流消耗的所有数据。这是 _COUNT_、_MAX_、_MIN_、_AVERAGE_ 操作以及 `forEach()`、`toList()` 或 `toArray()` 方法调用的情况。

对于我们介绍的最后几个终端操作则不是这样。`findFirst()` 或 `findAny()` 方法将在找到一个元素后立即停止处理数据，不管还有多少元素需要处理。同样，`anyMatch()`、`allMatch()` 和 `noneMatch()` 也可能在不需要处理流的所有元素的情况下中断流的处理并返回结果。

然而，在某些情况下，这些最后的方法需要处理所有元素：

- 只有在处理了所有元素后，`findFirst()` 和 `findAny()` 才能返回一个空的可选。
- 为 `anyMatch()` 返回 `false` 也需要处理流的所有元素。
- 为 `allMatch()` 和 `noneMatch()` 返回 `true` 也需要处理流的所有元素。

这些方法被称为 Stream API 中的 _短路_ 方法，因为它们可以在不处理流的所有元素的情况下产生结果。





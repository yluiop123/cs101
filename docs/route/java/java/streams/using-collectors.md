# 使用收集器作为终端操作

## 使用收集器收集流元素
您已经使用了一个非常有用的模式，将流处理的元素收集到 `List` 中：`collect(Collectors.toList())`。这个 `collect()` 方法是在 `Stream` 接口中定义的终端方法，它接受一个 `Collector` 类型的参数。这个 `Collector` 接口定义了自己的API，您可以使用它来创建任何类型的内存结构，以存储流处理的数据。收集可以在任何 `Collection` 或 `Map` 的实例中进行，它可以用来创建字符字符串，您也可以创建自己的 `Collector` 接口实例，以将您自己的结构添加到此列表中。

大多数您将使用的收集器可以通过 `Collectors` 工厂类的工厂方法创建。这就是您编写 `Collectors.toList()` 或 `Collectors.toSet()` 时所做的事情。使用这些方法创建的一些收集器可以组合，从而产生更多的收集器。本教程涵盖了所有这些要点。

如果您在这个工厂类中找不到所需的内容，那么您可以选择通过实现 `Collector` 接口来创建自己的收集器。本教程也涵盖了实现此接口的内容。

Collector API 在 `Stream` 接口和数字的专门流中处理方式不同：`IntStream`、`LongStream` 和 `DoubleStream`。`Stream` 接口有两个重载的 `collect()` 方法，而数字流只有一个。缺少的一个正是接受收集器对象作为参数的那个。因此，您不能在专门数字流上使用收集器对象。

## 在集合中收集
`Collectors` 工厂类为您提供了三种方法，将您的流元素收集到 `Collection` 接口的实例中。

1. `toList()` 在一个 `List` 对象中收集它们。
2. `toSet()` 在一个 `Set` 对象中收集它们。
3. 如果您需要任何其他 `Collection` 实现，可以使用 `toCollection(supplier)`，其中 `supplier` 参数将用于创建您需要的 `Collection` 对象。如果您需要将数据收集到 `LinkedList` 的实例中，那么这是您应该使用的方法。

您的代码不应依赖于这些方法当前返回的 `List` 或 `Set` 的确切实现，因为这不是规范的一部分。

您还可以使用 `toUnmodifiableList()` 和 `toUnmodifiableSet()` 这两个方法获得 `List` 和 `Set` 的不可修改实现。

以下示例展示了这种模式的实际应用。首先，让我们在普通的 `List` 实例中收集。

```java
List<Integer> numbers =
    IntStream.range(0, 10)
             .boxed()
             .collect(Collectors.toList());
System.out.println("numbers = " + numbers);

```

这段代码使用 `boxed()` 中间方法从 `IntStream.range()` 创建的 `IntStream` 中创建一个 `Stream<Integer>`，通过将该流的所有元素装箱。运行此代码将打印出以下结果。

```
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

这个第二个示例创建了一个只包含偶数且没有重复项的 `HashSet`。

```java
Set<Integer> evenNumbers =
    IntStream.range(0, 10)
             .map(number -> number / 2)
             .boxed()
             .collect(Collectors.toSet());
System.out.println("evenNumbers = " + evenNumbers);

```

运行此代码将给出以下结果。

```
evenNumbers = [0, 2, 4, 6, 8]
```

最后一个示例使用 `Supplier` 对象创建用于收集流元素的 `LinkedList` 实例。

```java
LinkedList<Integer> linkedList =
    IntStream.range(0, 10)
             .boxed()
             .collect(Collectors.toCollection(LinkedList::new));
System.out.println("linked list = " + linkedList);

```

运行此代码将给出以下结果。

```
linked list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## 使用收集器计数
`Collectors` 工厂类为您提供了几种方法，创建与普通终端方法相同的收集器。这就是 `Collectors.counting()` 工厂方法的情况，它与在流上调用 `count()` 相同。

值得注意的是，您可能会想知道为什么这个特性会用两种不同的模式实现两次。这个问题在下一节关于在映射中收集的中得到了解答，在那里您将组合收集器以创建更多的收集器。

现在，编写以下两行代码将得到相同的结果。

```java
Collection<String> strings = List.of("one", "two", "three");

long count = strings.stream().count();
long countWithACollector = strings.stream().collect(Collectors.counting());

System.out.println("count = " + count);
System.out.println("countWithACollector = " + countWithACollector);

```

运行此代码将给出以下结果。

```
count = 3
countWithACollector = 3
```

## 在字符字符串中收集
`Collectors` 工厂类提供的另一个非常有用收集器是 `joining()` 收集器。此收集器仅适用于字符串流，并将该流的元素连接在一起，形成一个单独的字符串。它有几个重载。

- 第一个接受一个分隔符作为参数。
- 第二个接受一个分隔符、前缀和后缀作为参数。

让我们看看这个收集器的实际应用。

```java
String joined =
    IntStream.range(0, 10)
             .boxed()
             .map(Object::toString)
             .collect(Collectors.joining());

System.out.println("joined = " + joined);

```

运行此代码将产生以下结果。

```
joined = 0123456789
```

您可以使用以下代码为此字符串添加分隔符。

```java
String joined =
    IntStream.range(0, 10)
             .boxed()
             .map(Object::toString)
             .collect(Collectors.joining(", "));

System.out.println("joined = " + joined);

```

结果如下。

```
joined = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

让我们看看最后一个重载的实际应用，它接受分隔符、前缀和后缀。

```java
String joined =
    IntStream.range(0, 10)
             .boxed()
             .map(Object::toString)
             .collect(Collectors.joining(", ", "{", "}"));

System.out.println("joined = " + joined);

```

结果如下。

```
joined = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
```

请注意，此收集器正确处理了流为空或只处理单个元素的边缘情况。

当您需要产生这种类型的字符串时，此收集器非常方便。即使您的数据最初不在集合中或只有几个元素，您也可能被诱惑去使用它。如果这是您的情况，也许使用 `String.join()` 工厂类或 `StringJoiner` 对象也可以达到同样的效果，而无需创建流的开销。

## 使用谓词对元素进行分区
Collector API 提供了三种模式，从流的元素创建映射。我们首先介绍的模式创建了具有布尔键的映射。它是用 `partitioningBy()` 工厂方法创建的。

流的所有元素将绑定到 `true` 或 `false` 布尔值。映射将所有绑定到每个值的元素存储在列表中。因此，如果将此收集器应用于 `Stream`，它将产生以下类型的映射：`Map<Boolean, List<T>>`。

通过使用谓词测试此元素来决定将给定元素绑定到 `true` 还是 `false`，谓词作为参数提供给收集器。

以下示例展示了这个收集器的实际应用。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Boolean, List<String>> map =
    strings.stream()
           .collect(Collectors.partitioningBy(s -> s.length() > 4));

map.forEach((key, value) -> System.out.println(key + " :: " + value));

```

运行此代码将产生以下结果。

```
false :: [one, two, four, five, six, nine, ten]
true :: [three, seven, eight, eleven, twelve]
```

这个工厂方法有一个重载，它接受一个收集器作为进一步的参数。这个收集器被称为下游收集器。我们将在本教程的下一段中介绍 `groupingBy()` 收集器时，介绍这些下游收集器。

## 通过分组在映射中收集
我们介绍的第二个收集器非常重要，因为它允许您创建直方图。

### 在映射中对流元素进行分组
您可以使用 `Collectors.groupingBy()` 方法创建用于创建直方图的收集器。这个方法有几个重载。

收集器创建了一个映射。通过将 `Function` 的实例应用于流的每个元素来计算键。这个函数作为 `groupingBy()` 方法的参数提供。它在 Collector API 中被称为 _分类器_。

此函数除了不能返回 null 外，没有其他限制。

应用此函数可能会为流中的多个元素返回相同的键。`groupingBy()` 收集器支持这一点，并将所有这些元素收集到一个列表中，绑定到该键。

因此，如果您正在处理一个 `Stream` 并使用 `Function<T, K>` 作为分类器，`groupingBy()` 收集器将创建一个 `Map<K, List<T>>`。

让我们检查以下示例。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, List<String>> map =
    strings.stream()
           .collect(Collectors.groupingBy(String::length));

map.forEach((key, value) -> System.out.println(key + " :: " + value));

```

这个示例中使用的分类器是一个函数，它返回流中每个字符串的长度。因此，映射按长度将字符串分组到列表中。它具有 `Map<Integer, List<String>>` 类型。

运行此代码将打印出以下结果。

```
3 :: [one, two, six, ten]
4 :: [four, five, nine]
5 :: [three, seven, eight]
6 :: [eleven, twelve]
```

### 使用分组对值进行后处理
#### 计数值列表

`groupingBy()` 方法还接受另一个参数，这是另一个收集器。这个收集器在 Collector API 中被称为下游收集器，但它只是一个普通的收集器。使它成为下游收集器的事实是，它作为参数传递给另一个收集器的创建。

这个下游收集器用于收集 `groupingBy()` 收集器创建的映射的值。

在上一个示例中，`groupingBy()` 收集器创建了一个映射，其值是字符串列表。如果您给 `groupingBy()` 方法提供了一个下游收集器，API 将逐个流式处理这些列表，并使用您的下游收集器收集这些流。

假设您将 `Collectors.counting()` 作为下游收集器传递。将计算以下内容。

```java
[one, two, six, ten]  .stream().collect(Collectors.counting()) -> 4L
[four, five, nine]    .stream().collect(Collectors.counting()) -> 3L
[three, seven, eight] .stream().collect(Collectors.counting()) -> 3L
[eleven, twelve]      .stream().collect(Collectors.counting()) -> 2L
```

这不是 Java 代码，所以您不能执行它。它只是用来解释如何使用这个下游收集器。

现在将创建的映射取决于您提供的下游收集器。键没有修改，但值可能已经改变。在 `Collectors.counting()` 的情况下，值被转换为 `Long` 类型。然后映射的类型变为 `Map<Integer, Long>`。

上一个示例变为以下内容。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, Long> map =
    strings.stream()
           .collect(
               Collectors.groupingBy(
                   String::length,
                   Collectors.counting()));

map.forEach((key, value) -> System.out.println(key + " :: " + value));

```

运行此代码将打印出以下结果。它给出了每个长度的字符串数量，这是按长度划分的字符串直方图。

```
3 :: 4
4 :: 3
5 :: 3
6 :: 2
```

#### 连接值列表

您也可以将 `Collectors.joining()` 收集器作为下游收集器传递，因为此映射的值是字符串列表。记住，这个收集器只能在字符串流上使用。这将创建一个 `Map<Integer, String>` 的实例：值采用此收集器创建的类型。您可以将上一个示例更改为以下内容。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, String> map =
    strings.stream()
           .collect(
               Collectors.groupingBy(
                   String::length,
                   Collectors.joining(", ")));
map.forEach((key, value) -> System.out.println(key + " :: " + value));

```

运行此代码将产生以下结果。

```
3 :: one, two, six, ten
4 :: four, five, nine
5 :: three, seven, eight
6 :: eleven, twelve
```

### 控制映射的实例

这个 `groupingBy()` 方法的最后一个重载接受一个 `Supplier` 实例作为参数，以便您控制此收集器需要创建的 `Map` 实例的类型。

您的代码不应依赖于 `groupingBy()` 收集器返回的确切映射类型，因为这不属于规范的一部分。

## 使用 To Map 模式在映射中收集
Collector API 为您提供了第二种创建映射的模式：`Collectors.toMap()` 模式。这个模式使用两个函数，都应用于流的元素。

1. 第一个称为 _键映射器_，用于创建键。
2. 第二个称为 _值映射器_，用于创建值。

这个收集器不用于与 `Collectors.groupingBy()` 相同的情况。特别是，它不处理流的多个元素生成相同键的情况。在这种情况下，默认情况下会抛出 `IllegalStateException`。

这个收集器非常方便，用于创建缓存。假设您有一个 `User` 类，它有一个类型为 `Long` 的 `primaryKey` 属性。您可以使用以下代码创建您的 `User` 对象的缓存。

```java
List<User> users = ...;

Map<Long, User> userCache =
    users.stream()
         .collect(Collectors.toMap(
                 User::getPrimaryKey,
                 Function.identity));

```

使用 `Function.identity()` 工厂方法只是告诉收集器不要转换流的元素。

如果您预期流的多个元素将生成相同的键，那么您可以向 `toMap()` 方法传递一个进一步的参数。这个参数是 `BinaryOperator` 类型。当检测到冲突元素时，实现将应用此二元操作符。然后您的二元操作符将产生一个结果，该结果将放在映射中替换前一个值。

以下示例向您展示了如何使用此收集器处理冲突值。在这里，值使用分隔符连接在一起。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, String> map =
    strings.stream()
            .collect(
                    Collectors.toMap(
                            element -> element.length(),
                            element -> element,
                            (element1, element2) -> element1 + ", " + element2));

map.forEach((key, value) -> System.out.println(key + " :: " + value));

```

在这个示例中，传递给 `toMap()` 方法的三个参数如下：

1. `element -> element.length()` 是 _键映射器_。
2. `element -> element` 是 _值映射器_。
3. `(element1, element2) -> element1 + ", " + element2` 是 _合并函数_，它使用生成相同键的两个元素调用。

运行此代码将产生以下结果。

```
3 :: one, two, six, ten
4 :: four, five, nine
5 :: three, seven, eight
6 :: eleven, twelve
```

对于 `groupingBy()` 收集器，您可以向 `toMap()` 方法传递一个供应商作为参数，以控制此收集器将使用的 `Map` 接口的实例。

`toMap()` 收集器有一个双胞胎方法 `toConcurrentMap()`，它将在并发映射中收集您的数据。映射的确切类型不受实现的保证。

`groupingBy()` 收集器是您在需要分析的数据上计算直方图的最佳模式。让我们检查一个完整的示例，您在其中构建一个直方图，然后尝试根据特定标准找到其中的最大值。

您将分析的直方图如下。它看起来像我们在前一个示例中使用的那个。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, Long> histogram =
    strings.stream()
            .collect(
                    Collectors.groupingBy(
                            String::length,
                            Collectors.counting()));

histogram.forEach((key, value) -> System.out.println(key + " :: " + value));

```

打印此直方图将给出以下结果。

```
3 :: 4
4 :: 3
5 :: 3
6 :: 2
```

从此直方图中提取最大值应该给出结果：`3 :: 4`。Stream API 拥有提取最大值所需的所有工具。不幸的是，`Map` 接口上没有 `stream()` 方法。因此，要创建映射的流，您首先需要获取可以从映射中获取的集合之一。

1. 使用 `entrySet()` 方法获取条目集。
2. 使用 `keySet()` 方法获取键集。
3. 或使用 `values()` 方法获取值集。

在这里，您需要同时获取键和最大值，所以正确的选择是流式化由 `entrySet()` 返回的集合。

您需要的代码如下。

```java
Map.Entry<Integer, Long> maxValue =
    histogram.entrySet().stream()
             .max(Map.Entry.comparingByValue())
             .orElseThrow();

System.out.println("maxValue = " + maxValue);

```

您可以看到，此代码使用了 `Stream` 接口的 `max()` 方法，它接受一个比较器作为参数。事实证明，`Map.Entry` 接口有几个工厂方法来创建这样的比较器。我们在示例中使用的那个创建了一个比较器，可以使用这些键值对的值来比较它们。这种比较只有在值实现 `Comparable` 接口时才能工作。

这段代码的模式非常通用，只要它具有可比较的值，就可以在任何映射上使用。由于 Java SE 16 中引入了记录，我们可以使其更不通用，更易读。

让我们创建一个记录来模拟此映射的键值对。创建记录是一行代码。因为语言允许局部记录，您可以将这些行复制到任何方法中。

```java
record NumberOfLength(int length, long number) {

    static NumberOfLength fromEntry(Map.Entry<Integer, Long> entry) {
        return new NumberOfLength(entry.getKey(), entry.getValue());
    }

    static Comparator<NumberOfLength> comparingByLength() {
        return Comparator.comparing(NumberOfLength::length);
    }
}

```

有了这个记录，前面的模式就变成了以下内容。

```java
NumberOfLength maxNumberOfLength =
    histogram.entrySet().stream()
             .map(NumberOfLength::fromEntry)
             .max(NumberOfLength.comparingByLength())
             .orElseThrow();

System.out.println("maxNumberOfLength = " + maxNumberOfLength);

```

运行这个示例将打印出以下内容。

```
maxNumberOfLength = NumberOfLength[length=3, number=4]
```

您可以看到，这个记录看起来像 `Map.Entry` 接口。它有一个用于映射键值对的工厂方法，以及一个用于创建您需要的比较器的工厂方法。对您的直方图的分析变得更加易读和易于理解。

前面的示例是一个很好的例子，因为您的列表中只有一个最大值。不幸的是，实际情况通常不是这样，您可能有多个键值对匹配最大值。

让我们从未修改的示例的集合中删除一个元素。

```java
Collection<String> strings =
    List.of("two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, Long> histogram =
    strings.stream()
            .collect(
                    Collectors.groupingBy(
                            String::length,
                            Collectors.counting()));

histogram.forEach((key, value) -> System.out.println(key + " :: " + value));

```

打印这个直方图将给出以下结果。

```
3 :: 3
4 :: 3
5 :: 3
6 :: 2
```

现在我们有三个键值对的最大值。如果您使用前面的代码模式来提取它，将选择并返回这三个中的一个，隐藏其他两个。

解决这个问题的一个方法是创建另一个映射，其中键是具有给定长度的字符串数量，值是匹配此数量的长度。换句话说：您需要反转这个映射。这是使用 `groupingBy()` 收集器的一个很好的用例。这个示例将在本部分后面介绍，因为我们需要一个更多的元素来编写此代码。

到目前为止我们介绍的收集器是计数、连接和收集到列表或映射。它们都模拟终端操作。Collector API 还提供其他收集器，执行中间操作：映射、过滤和扁平映射。您可能会想知道，使用终端方法 `collect()` 来模拟中间操作的意义是什么。事实上，这些特殊的收集器不能单独创建。您可以使用的所有工厂方法都需要一个下游收集器作为第二个参数。

因此，您可以使用这些方法创建的总体收集器是中间操作和终端操作的组合。

### 使用收集器进行映射
我们可以检查的第一个中间操作是映射操作。映射收集器是使用 `Collectors.mapping()` 工厂方法创建的。它接受一个常规的映射函数作为第一个参数，以及一个强制性的下游收集器作为第二个参数。

在以下示例中，我们正在将映射与收集映射元素到列表结合起来。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

List<String> result =
    strings.stream()
        .collect(
            Collectors.mapping(String::toUpperCase, Collectors.toList()));

System.out.println("result = " + result);

```

`Collectors.mappping()` 工厂方法创建了一个常规收集器。您可以将此收集器作为下游收集器传递给任何接受它的方法，包括 `groupingBy()` 或 `toMap()` 等。

您可能还记得在 "提取模糊最大值" 部分中，我们留下了一个关于如何反转映射的悬而未决的问题。让我们使用这个映射收集器来解决这个问题。

在这个示例中，您创建了一个直方图。现在，您需要使用 `groupingBy()` 来反转这个直方图，以找到所有最大值。

以下代码创建了这样的映射。

```java
Map<Integer, Long> histogram = ...;

var map =
    histogram.entrySet().stream()
        .map(NumberOfLength::fromEntry)
        .collect(
            Collectors.groupingBy(NumberOfLength::number));
```

让我们检查这段代码，并确定构建的映射的确切类型。

此映射的键是原始流中每种长度出现的次数。它是 `NumberOfLength` 记录的 `number` 组件，即 `Long` 类型。

值是流的元素，收集到列表中。因此，值是 `NumberOfLength` 对象的列表。这个映射的确切类型是 `Map<Long, List<NumberOfLength>>`。

结果，这并不完全是您需要的。您需要的是字符串的长度，而不是记录的两个组件。从记录中提取组件只是映射。您需要将这些 `NumberOfLength` 实例映射到它们的 `length` 组件。现在我们已经介绍了映射收集器，解决这个问题变得可能。您所要做的就是在 `groupingBy()` 调用中添加正确的下游收集器。

代码变为以下内容。

```java
Map<Integer, Long> histogram = ...;

var map =
    histogram.entrySet().stream()
        .map(NumberOfLength::fromEntry)
        .collect(
            Collectors.groupingBy(
                NumberOfLength::number,
                Collectors.mapping(NumberOfLength::length, Collectors.toList())));
```

现在构建的映射的值是使用 `NumberOfLength::length` 映射器映射的 `NumberOfLength` 对象的列表。这个映射的类型是 `Map<Long, List<Integer>>`，这正是您需要的。

要获取所有最大值，您可以应用我们之前使用的相同模式，使用键来获取最大值而不是值。

从直方图到包括最大值提取的完整代码如下。

```java
Map<Long, List<Integer>> map =
    histogram.entrySet().stream()
             .map(NumberOfLength::fromEntry)
             .collect(
                Collectors.groupingBy(
                    NumberOfLength::number,
                    Collectors.mapping(NumberOfLength::length, Collectors.toList())));
             
Map.Entry<Long, List<Integer>> result =
    map.entrySet().stream()
       .max(Map.Entry.comparingByKey())
       .orElseThrow();

System.out.println("result = " + result);

```

运行此代码将产生以下结果。

```
result = 3=[3, 4, 5]
```

这意味着在这个流中有三种字符串长度出现三次：3、4 和 5。

这个示例展示了一个收集器嵌套在另外两个收集器中，这在使用此 API 时非常常见。一开始可能看起来令人生畏，但它只是使用下游收集器机制组合收集器。

您可以看到拥有这些中间收集器是有意义的。能够使用收集器模拟中间操作为您提供了几乎任何类型处理的可能性，您可以使用它来后处理映射的值。

### 使用收集器进行过滤和扁平映射
过滤收集器遵循与映射收集器相同的模式。它是使用接受常规谓词以过滤数据和强制性下游收集器的 `Collectors.filtering()` 工厂方法创建的。

对于扁平映射收集器也是如此，它是由接受扁平映射函数（返回流的函数）和强制性下游收集器的 `Collectors.flatMapping()` 工厂方法创建的。

## 使用终端收集器
Collector API 还提供几种与 Stream API 上可用的终端操作相对应的终端操作。

- `maxBy()` 和 `minBy()`。这两个方法都接受一个比较器作为参数，并返回一个可选对象，如果处理的流本身为空，则为空。
- `summingInt()`、`summingLong()` 和 `summingDouble()`。这三个方法接受一个映射函数作为参数，将流的元素映射到 `int`、`long` 和 `double`，然后分别对它们求和。
- `averagingInt()`、`averagingLong()` 和 `averagingDouble()`。这三个方法也接受一个映射函数作为参数，将流的元素映射到 `int`、`long` 和 `double`，然后计算平均值。这些收集器的工作原理与 `IntStream`、`LongStream` 和 `DoubleStream` 中定义的相应 `average()` 方法不同。它们都返回一个 `Double` 实例，并对空流返回 0。`average()` 方法返回一个可选对象，对空流返回空。

。




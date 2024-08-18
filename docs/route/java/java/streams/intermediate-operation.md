# 在流上添加中间操作

## 将流映射到另一个流
将流映射意味着使用函数转换它的元素。这种转换可能会改变流处理的元素类型，但也可以转换它们而不改变其类型。

您可以使用 `map()` 方法将流映射到另一个流，该方法以 `Function` 作为参数。映射流意味着通过该函数转换流处理的所有元素。

代码模式如下：

```java
List<String> strings = List.of("one", "two", "three", "four");
Function<String, Integer> toLength = String::length;
Stream<Integer> ints = strings.stream()
                              .map(toLength);
```

您可以复制此代码并粘贴到您的IDE中运行它。您将看不到任何内容，并且可能想知道为什么。

答案实际上很简单：流上没有定义终端操作。您应该意识到这一点，并意识到此代码不做任何事情。它不处理任何数据。要回答这个问题："这段代码在做什么？"，只有一个有效的答案："无"。

让我们添加一个非常有用的终端操作，它将处理过的元素放入列表中：`collect(Collectors.toList())`。如果您不确定这段代码实际上做了什么，请不要担心；我们将在本教程后面介绍。

```java
List<String> strings = List.of("one", "two", "three", "four");
List<Integer> lengths = strings.stream()
                               .map(String::length)
                               .collect(Collectors.toList());
System.out.println("lengths = " + lengths);
```

运行此代码将打印以下结果：

```
lengths = [3, 3, 5, 4]
```

您可以看到，这种模式创建了一个由 `map(String::length)` 返回的 `Stream<Integer>`。您也可以通过调用 `mapToInt()` 而不是常规的 `map()` 调用来创建一个专门的 `IntStream`。这个 `mapToInt()` 方法以 `ToIntFunction<T>` 作为参数。在前面的例子中将 `.map(String::length)` 更改为 `.mapToInt(String::length)` 不会产生编译错误。方法引用 `String::length` 可以是两种类型之一：`Function<String, Integer>` 和 `ToIntFunction<String>`。

专门的流上没有接受 `Collector` 作为参数的 `collect()` 方法。所以如果您使用 `mapToInt()`，您不能再用这种模式将结果收集到列表中了。让我们来获取流的一些统计数据。这个 `summaryStatistics()` 方法非常有用，并且只在这些原始类型的专门流上可用。

```java
List<String> strings = List.of("one", "two", "three", "four");
IntSummaryStatistics stats = strings.stream()
                                    .mapToInt(String::length)
                                    .summaryStatistics();
System.out.println("stats = " + stats);
```

结果是：

```
stats = IntSummaryStatistics{count=4, sum=15, min=3, average=3.75, max=5}
```

有三种方法可以从 `Stream` 转换为原始类型的流：`mapToInt()`、`mapToLong()` 和 `mapToDouble()`。

## 过滤流
过滤是使用谓词丢弃流处理的某些元素。这种方法适用于对象流和原始类型流。

假设您需要统计长度为3的字符串的数量。您可以编写以下代码来执行此操作：

```java
List<String> strings = List.of("one", "two", "three", "four");
long count = strings.stream()
                    .map(String::length)
                    .filter(length -> length == 3)
                    .count();
System.out.println("count = " + count);
```

运行此代码将产生以下结果：

```
count = 2
```

请注意，您刚刚使用了Stream API的另一个终端操作 `count()`，它只是统计处理过的元素数量。此方法返回一个 `long`，因此您可以用它来统计很多元素。多到可以超出 `ArrayList` 的容量。

## 使用flatMap处理1:p关系的流
让我们通过一个例子看看 `flatMap` 操作。假设您有两个实体：`State` 和 `City`。一个 `state` 实例保存了几个 `city` 实例，存储在一个列表中。

以下是 `City` 类的代码。

```java
public class City {
    private String name;
    private int population;

    // 构造函数，getter
    // toString, equals 和 hashCode
}
```

以下是 `State` 类的代码，与 `City` 类的关系。

```java
public class State {
    private String name;
    private List<City> cities;

    // 构造函数，getter
    // toString, equals 和 hashCode
}
```

假设您的代码正在处理一个州的列表，并且在某个时候需要统计所有城市的人口。

您可能会编写以下代码：

```java
List<State> states = ...;

int totalPopulation = 0;
for (State state : states) {
    for (City city : state.getCities()) {
        totalPopulation += city.getPopulation();
    }
}

System.out.println("总人口 = " + totalPopulation);
```

这段代码的内循环是一种map-reduce的形式，您可以使用以下流重写：

```java
totalPopulation += state.getCities().stream().mapToInt(City::getPopulation).sum();
```

连接在州上的循环和这个流与map/reduce模式不太匹配，将流放在循环中也不是一个非常好的代码模式。

这正是 `flatMap` 操作符的作用。此操作符打开对象之间的一对多关系，并在这些关系上创建流。`flatMap()` 方法接受一个特殊函数作为参数，该函数返回一个 `Stream` 对象。给定类和另一个类之间的关系由这个函数定义。

在我们的示例中，这个函数很简单，因为 `State` 类中有一个 `List<City>`。所以您可以按以下方式编写它。

```java
Function<State, Stream<City>> stateToCity = state -> state.getCities().stream();
```

这个列表不是必需的。假设您有一个 `Continent` 类，它保存了一个 `Map<String, Country>`，其中键是国家的国家代码（CAN代表加拿大，MEX代表墨西哥，FRA代表法国等）。假设 `Continent` 类有一个 `getCountries()` 方法，返回这个映射。

在这种情况下，这个函数可以这样写。

```java
Function<Continent, Stream<Country>> continentToCountry =
    continent -> continent.getCountries().values().stream();
```

`flatMap()` 方法分两步处理流。

- 第一步是使用这个函数映射流的所有元素。从 `Stream<State>` 它创建了一个 `Stream<Stream<City>>`，因为每个州都映射到一个城市流。
- 第二步是展平产生的流的流。不是有一个城市流的流（每个州一个流），您最终会得到一个单一的流，其中包含所有州的所有城市。

所以，用嵌套for循环模式编写的代码可以变成以下这样，多亏了 `flatMap` 操作符。

```java
List<State> states = ...;

int totalPopulation =
        states.stream()
              .flatMap(state -> state.getCities().stream())
              .mapToInt(City::getPopulation)
              .sum();

System.out.println("总人口 = " + totalPopulation);
```

## 使用flatMap和mapMulti验证元素转换
`flatMap` 操作可以用来验证流元素的转换。

假设您有一个字符串流，代表整数。您需要使用 `Integer.parseInt()` 将它们转换为整数。不幸的是，其中一些字符串已损坏：可能有些是空的，null，或者在末尾有额外的空格字符。所有这些都会导致解析失败，并抛出 `NumberFormatException`。当然，您可以尝试使用谓词过滤这个流以移除有缺陷的字符串，但最安全的方法就是使用 try-catch 模式。

尝试使用过滤器不是正确的方法。您将编写的谓词看起来像这样。

```java
Predicate<String> isANumber = s -> {
    try {
        int i = Integer.parseInt(s);
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
};
```

第一个缺陷是您需要实际执行转换以查看它是否有效。然后您将不得不在下一个要执行的映射函数中再次执行它：不要这样做！第二个缺陷是永远不要从 catch 块返回。

您真正需要做的是在字符串中有一个合适的整数时返回一个整数，如果字符串损坏则返回空。这是一个 flatmapper 的工作。如果您可以解析一个整数，您可以返回一个带有结果的流。在其他情况下，您可以返回一个空的流。

然后您可以编写以下函数。

```java
Function<String, Stream<Integer>> flatParser = s -> {
    try {
        return Stream.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
    }
    return Stream.empty();
};

List<String> strings = List.of("1", " ", "2", "3 ", "", "3");
List<Integer> ints =
    strings.stream()
           .flatMap(flatParser)
           .collect(Collectors.toList());
System.out.println("ints = " + ints);
```

运行此代码将产生以下结果。所有有缺陷的字符串都已被静默移除。

```
ints = [1, 2, 3]
```

这种使用 flatmap 代码的方式效果很好，但它有一个开销：需要为要处理的流的每个元素创建一个流。从 Java SE 16 开始，Stream API 中添加了一个方法。它正是为了这种情况而添加的：当您创建许多包含零个或一个对象的流时。这个方法叫做 `mapMulti()` 并接受一个 `BiConsumer` 作为参数。

这个 `BiConsumer` 接受两个参数：

- 需要映射的流元素
- 一个 `Consumer`，这个 `BiConsumer` 需要用映射的结果调用这个 `Consumer`

用一个元素调用消费者将该元素添加到结果流中。如果映射无法完成，`BiConsumer` 就不会调用这个消费者，也不会添加任何元素。

让我们用这个 `mapMulti()` 方法重写您的模式。

```java
List<Integer> ints =
        strings.stream()
               .<Integer>mapMulti((string, consumer) -> {
                    try {
                        consumer.accept(Integer.parseInt(string));
                    } catch (NumberFormatException ignored) {
                    }
               })
               .collect(Collectors.toList());
System.out.println("ints = " + ints);
```

运行此代码与之前产生相同的结果。所有有缺陷的字符串都已被静默移除，但这一次没有创建其他流。

```
ints = [1, 2, 3]
```

要使用这个方法，您需要告诉编译器用于向结果流添加元素的 `Consumer` 的类型。这是通过在调用 `mapMulti()` 之前放置此类型的特殊语法完成的。这不是您在Java代码中经常看到的一种语法。您可以在静态和非静态上下文中使用它。

## 移除重复项并对流进行排序
Stream API有两个方法，`distinct()` 和 `sorted()`，它们将简单地检测并移除重复项并排序流中的元素。`distinct()` 方法使用 `hashCode()` 和 `equals()` 方法来发现重复项。`sorted()` 方法有一个重载版本，它接受一个比较器，用于比较和排序流中的元素。如果您没有提供比较器，那么Stream API假定您的流元素是可以比较的。如果它们不是，那么将引发 `ClassCastException`。

您可能还记得本教程的前一部分，流应该是一个不存储任何数据的空对象。有几种例外，这两种方法就是其中之一。

实际上，为了发现重复项，`distinct()` 方法需要存储流中的元素。当它处理一个元素时，它首先检查该元素是否已经被看到过。

对于 `sorted()` 方法也是如此。此方法需要存储所有元素，然后在将其发送到处理管道的下一步之前，将它们在内部缓冲区中进行排序。

`distinct()` 方法可以在无界（无限）流上使用，`sorted()` 方法则不能。

## 限制和跳过流中的元素
Stream API为您提供了两种选择流中元素的方式：基于它们的索引或使用谓词。

第一种方法是使用 `skip()` 和 `limit()` 方法，这两个方法都接受一个 `long` 作为参数。使用这些方法时需要避免一个小陷阱。您需要记住，每次在流上调用中间方法时，都会创建一个新的流。所以如果您在 `skip()` 之后调用 `limit()`，不要忘记从这个新流开始计算元素。

假设您有一个从1开始的所有整数的流。您需要在整数流上选择3到8之间的整数。您可能会想调用 `skip(2).limit(8)`，传递在第一个流上计算的界限。不幸的是，这不是流的工作方式。第二个调用 `limit(8)` 是在从3开始的流上操作的，所以它将选择直到11的整数，这不是您需要的。正确的代码如下。

```java
List<Integer> ints = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);

List<Integer> result =
    ints.stream()
        .skip(2)
        .limit(5)
        .collect(Collectors.toList());

System.out.println("result = " + result);
```

这段代码打印以下结果。

```
result = [3, 4, 5, 6, 7]
```

理解 `skip(2)` 已经被调用在一个处理元素 `1, 2, 3, ...` 的流上，并且产生另一个处理元素 `3, 4, 5, 6, ...` 的流非常重要。

所以 `limit(3)` 选择该流的前5个元素，即 `3, 4, 5, 6, 7`。

Java SE 9在这个领域引入了两个更多的方法。与其基于流中元素的索引跳过和限制元素，不如基于谓词的值这样做。

- `dropWhile(predicate)` 丢弃流处理的元素，直到对这些元素应用谓词时变为 true。此时，流处理的所有元素都被传输到下一个流。
- `takeWhile(predicate)` 则相反：在对这些元素应用此谓词时变为 false 之前，将元素传输到下一个流。

注意这些方法的工作方式类似于门。一旦 `dropWhile()` 打开门让处理过的元素流过，它就不会关闭。一旦 `takeWhile()` 关上门，它就不能再打开，不会再有元素被发送到下一个操作。

## 连接流
Stream API提供了几种模式，将多个流连接成一个流。最明显的方式是使用 `Stream` 接口中定义的工厂方法：`concat()`。

此方法接受两个流，并产生一个流，先产生第一个流的元素，然后是第二个流的元素。

您可能会想知道为什么这个方法不接受 vararg，以便连接任意数量的流。

原因是只要您有两个要连接的流，使用这个方法就可以了。如果您有超过两个流，那么 JavaDoc API 文档建议您使用另一种模式，基于使用 flatmap。

让我们通过一个例子看看这是如何工作的。

```java
List<Integer> list0 = List.of(1, 2, 3);
List<Integer> list1 = List.of(4, 5, 6);
List<Integer> list2 = List.of(7, 8, 9);

// 第1种模式：concat
List<Integer> concat =
    Stream.concat(list0.stream(), list1.stream())
          .collect(Collectors.toList());

// 第2种模式：flatMap
List<Integer> flatMap =
    Stream.of(list0.stream(), list1.stream(), list2.stream())
          .flatMap(Function.identity())
          .collect(Collectors.toList());

System.out.println("concat  = " + concat);
System.out.println("flatMap = " + flatMap);
```

运行此代码将产生以下结果：

```
concat  = [1, 2, 3, 4, 5, 6]
flatMap = [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

使用 `flatMap()` 的方式更好，因为 `concat()` 在连接过程中创建了中间流。当您使用 `Stream.concat()` 时，会创建一个新的流来连接您的两个流。如果您需要连接三个流，您最终会创建第一个流来处理第一次连接，第二个流用于第二次连接。所以每次连接都需要一个流，这个流很快就会被丢弃。

使用 flatmap 模式，您只创建一个流来保存您的所有流并执行 flatmap。开销要低得多。

您可能会想知道为什么要添加这两种模式。看起来 `concat()` 并没有太大用处。实际上，concat 产生的流和 flatmap 模式产生的流有一个微妙的区别。

如果您要连接的两个流的源大小是已知的，那么结果流的大小也是已知的。实际上，它只是两个连接流的总和。

在流上使用 flatmap 可能会在结果流中创建未知数量的元素进行处理。Stream API 无法跟踪结果流中将要处理的元素数量。

换句话说：concat 产生一个 `SIZED` 流，而 flatmap 则不。这个 `SIZED` 属性是流可能具有的属性，本教程后面将介绍。

## 调试流
有时在运行时检查流处理的元素可能很方便。Stream API有一个方法可以做到这一点：`peek()` 方法。此方法旨在用于调试您的数据处理管道。您不应该在生产代码中使用这个方法。

> 您绝对应该避免使用这个方法来执行应用程序中的一些副作用。

这个方法接受一个消费者作为参数，API将在流的每个元素上调用这个消费者。让我们看看这个方法的实际应用。

```java
List<String> strings = List.of("one", "two", "three", "four");
List<String> result =
        strings.stream()
                .peek(s -> System.out.println("Starting with = " + s))
                .filter(s -> s.startsWith("t"))
                .peek(s -> System.out.println("Filtered = " + s))
                .map(String::toUpperCase)
                .peek(s -> System.out.println("Mapped = " + s))
                .collect(Collectors.toList());
System.out.println("result = " + result);
```

如果您运行此代码，您将在控制台上看到以下内容。

```
Starting with = one
Starting with = two
Filtered = two
Mapped = TWO
Starting with = three
Filtered = three
Mapped = THREE
Starting with = four
result = [TWO, THREE]
```

让我们分析这个输出。

1. 要处理的第一个元素是 _one_。您可以看到它被过滤掉了。
2. 第二个是 _two_。这个元素通过了过滤器，然后被映射为大写。然后它被添加到结果列表中。
3. 第三个是 _three_，它也通过了过滤器，并且在被添加到结果列表之前也被映射为大写。
4. 第四个也是最后一个是 _four_，它被过滤步骤拒绝了。

您可以看到本教程前面提到过的一个要点，现在变得非常清楚：流确实会一个接一个地处理它需要处理的所有元素，从流的开头到结尾。这一点之前已经提到过，现在您可以看到它的实际应用。

您可以看到 `peek(System.out::println)` 模式对于逐个跟踪流处理的元素非常有用，无需调试您的代码。调试流很难，因为您需要小心放置断点的位置。大多数时候，在流处理上放置断点会将您带到 `Stream` 接口的实现中。这不是您需要的。大多数时候，您需要将这些断点放置在您的lambda表达式代码中。





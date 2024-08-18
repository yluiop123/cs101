# 实现 Collector 接口

## 为什么实现 Collector 接口？

创建自己的收集器有三种方式。

我们在本教程中考察了第一种方式。它由组合现有收集器和 `Collectors` 工厂类提供的不同机制组成，即将一个收集器作为下游收集器传递给另一个收集器，或者使用 `collectingAndThen()` 收集器与修饰器。

您还可以调用接受构建收集器的三个元素的 `collect()` 方法。这些方法适用于基本类型的流和对象流。它们接受我们在前几节中介绍的三个参数。
1. 用于创建收集流元素的可变容器的_供应商_。
2. 由双消费者建模的_累加器_。
3. 用于组合两个部分填充的容器的_组合器_，也由双消费者建模，用于并行流的情况。

第三种方式是自行实现 `Collector` 接口，并将您的实现传递给我们已经介绍的 `collect()` 方法。实现自己的收集器可以提供最大的灵活性，但也更具技术性。

## 理解 Collector 的参数类型

让我们检查这个接口的参数。

```java
interface Collector<T, A, R> {
    // 接口的内容
}
```

让我们首先检查以下类型：`T` 和 `R`。

第一个类型是 `T`，它对应于此收集器正在处理的流元素的类型。

最后一个类型是 `R`，这是此收集器产生的类型。

对于在 `Stream` 实例上调用的 `toList()` 收集器，类型 `R` 将是 `List<T>`。对于 `toSet()` 收集器，它将是 `Set<T>`。

`groupingBy()` 方法接受一个函数来计算返回映射的键。如果您使用此收集器收集 `Stream`，那么您需要传递一个可以映射 `T` 实例的函数。它可以将它们映射到任何 `K` 类型的实例以创建映射的键。因此，生成的映射类型将是 `Map<K, List<T>>`。所以类型 `R` 就是这一个：`Map<K, List<T>>`。

类型 `A` 更复杂。您可能尝试使用您的IDE存储前面示例中创建的收集器之一。如果您这样做了，您可能意识到您的IDE没有为这个类型提供显式值。对于以下示例就是这种情况。

```java
Collection<String> strings =
    List.of("two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Collector<String, ?, List<String>> listCollector = Collectors.toList();
List<String> list = strings.stream().collect(listCollector);

Collector<String, ?, Set<String>> setCollector = Collectors.toSet();
Set<String> set = strings.stream().collect(setCollector);

Collector<String, ?, Map<Integer, Long>> groupingBy =
    Collectors.groupingBy(String::length, Collectors.counting());
Map<Integer, Long> map = strings.stream().collect(groupingBy);
```

对于所有这些收集器，第二个参数类型只是 `?`。

如果您需要实现 `Collector` 接口，那么您将必须给 `A` 一个显式值。类型 `A` 是此收集器使用的中间可变容器的类型。对于 `toList()` 收集器，它将是 `ArrayList`，对于 `toSet()` 收集器，它将是 `HashSet`。事实证明，这个 `A` 类型是由 `toList()` 工厂方法声明的返回类型隐藏的，这就是为什么您不能将前一个示例中的 `?` 类型替换为 `ArrayList<T>` 的原因。

即使内部可变容器直接由实现返回，`A` 和 `R` 的类型也可能不同。例如，在 `toList()` 收集器的情况下，您可以通过将 `A` 固定为 `ArrayList<T>` 并将 `R` 固定为 `List<T>` 来实现 `Collector<T, A, R>` 接口。

## 理解收集器的特性

收集器定义了内部特性，这些特性被流实现用于优化此收集器的使用。

有三个特性。
1. `IDENTITY_FINISH` 特性表明此收集器的修饰器是恒等函数。实现将不为具有此特性的收集器调用修饰器。
2. `UNORDERED` 特性表明此收集器不保留它处理流元素的顺序。这是 `toSet()` 收集器的情况，它具有这个特性。另一方面，`toList()` 收集器则没有。
3. `CONCURRENT` 特性表明累加器存储处理过的元素的容器支持并发访问。对于并行流，这一点很重要。

这些特性在 `Collector.Characteristics` 枚举中定义，并通过 `Collector` 接口上定义的 `characteristics()` 方法以集合的形式返回。

## 实现 toList() 和 toSet() 收集器

有了这些元素，您现在可以重新创建一个工作方式类似于 `toList()` 收集器的收集器实现。

```java
class ToList<T> implements Collector<T, List<T>, List<T>> {

    public Supplier<List<T>> supplier() {
        return ArrayList::new;
    }

    public BiConsumer<List<T>, T> accumulator() {
        return Collection::add;
    }

    public BinaryOperator<List<T>> combiner() {
        return (list1, list2) -> { list1.addAll(list2); return list1; };
    }

    public Function<List<T>, List<T>> finisher() {
        return Function.identity();
    }

    public Set<Characteristics> characteristics() {
        return Set.of(Characteristics.IDENTITY_FINISH);
    }
}
```

您可以使用以下模式使用此收集器。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five");

List<String> result = strings.stream().collect(new ToList<>());
System.out.println("result = " + result);
```

这段代码打印出以下结果。

```
result = [one, two, three, four, five]
```

实现一个工作方式类似于 `toSet()` 收集器的收集器只需要两个修改。

- `supplier()` 方法将返回 `HashSet::new`。
- `characteristics()` 方法将在返回的集合中添加 `Characteristics.UNORDERED`。

## 实现 joining() 收集器

重新创建此收集器的实现是有趣的，因为它仅对字符串操作，并且它的修饰器不是恒等函数。

此收集器在 `StringBuffer` 的一个实例中累积它处理的字符串，然后调用此累加器上的 `toString()` 方法以产生最终结果。

此收集器的特性集合为空。它确实保留了处理元素的顺序（因此没有 _UNORDERED_ 特性），它的修饰器不是恒等函数，并且不能并发使用。

让我们看看这个收集器如何实现。

```java
class Joining implements Collector<String, StringBuffer, String> {

    public Supplier<StringBuffer> supplier() {
        return StringBuffer::new;
    }

    public BiConsumer<StringBuffer, String> accumulator() {
        return StringBuffer::append;
    }

    public BinaryOperator<StringBuffer> combiner() {
        return StringBuffer::append;
    }

    public Function<StringBuffer, String> finisher() {
        return Object::toString;
    }

    public Set<Characteristics> characteristics() {
        return Set.of();
    }
}
```

您可以看到以下示例中如何使用此收集器。

```java
Collection<String> strings =
    List.of("one", "two", "three", "four", "five");

String result = strings.stream().collect(new Joining());
System.out.println("result = " + result);
```

运行此代码将产生以下结果。

```
result = onetwothreefourfive
```

支持分隔符、前缀和后缀将使用 `StringJoiner` 而不是 `StringBuilder`，它已经支持这些元素。


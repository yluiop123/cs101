# 探寻流的特性

## 流的特性
Stream API 依赖于一个特殊的对象，即 `Spliterator` 接口的实例。这个接口的名称来自于 spliterator 在 Stream API 中的作用类似于迭代器在 Collection API 中的作用。此外，由于 Stream API 支持并行处理，一个 spliterator 对象还控制着如何将流的元素在处理并行化的 CPU 之间分配。这个名字是 _split_ 和 _iterator_ 的缩写。

详细讨论这个 spliterator 对象超出了本教程的范围。您需要知道的是，这个 spliterator 对象带有流的 _特性_。这些特性不是您经常使用的东西，但是了解它们将帮助您在某些情况下编写更好、更高效的管道。

流的特性如下：

| 特性 | 注释 |
| --- | --- |
| _ORDERED_ | 流处理元素的顺序很重要。 |
| _DISTINCT_ | 流处理的元素中没有重复项。 |
| _NONNULL_ | 该流中没有 null 元素。 |
| _SORTED_ | 流的元素已排序。 |
| _SIZED_ | 已知流处理的元素数量。 |
| _SUBSIZED_ | 分割此流会产生两个 _SIZED_ 流。 |

还有两个特性，《IMMUTABLE_ 和 _CONCURRENT_，在本教程中未涉及。

每个流在创建时都有所有这些特性设置或未设置。

请记住，流可以通过两种方式创建。

1. 您可以从数据源创建流，我们已经介绍过几种不同的模式。
2. 每次您在现有流上调用中间操作时，都会创建一个新流。

给定流的特性取决于它是从哪个源创建的，或者是从创建它的流的特性，以及创建它的操作。如果您使用源创建流，则其特性取决于该源；如果您使用另一个流创建它，则它们将取决于这个其他流以及您正在使用的操作类型。

让我们更详细地介绍每个特性。

## 有序流
_ORDERED_ 流是从有序数据源创建的。首先想到的例子可能是 `List` 接口的任何实例。还有其他：`Files.lines(path)` 和 `Pattern.splitAsStream(string)` 也会产生 _ORDERED_ 流。

跟踪流元素的顺序可能会导致并行流的开销。如果您不需要此特性，那么您可以通过在现有流上调用 `unordered()` 中间方法来删除它。这将返回一个没有此特性的新流。您为什么要这样做？在某些情况下，保持流 _ORDERED_ 可能是昂贵的，例如当您使用并行流时。

## 排序流
_SORTED_ 流是已排序的流。这个流可以从未排序的源创建，例如 `TreeSet` 实例，或通过调用 `sorted()` 方法。知道流已经被排序了，可以被流实现用来避免再次对已经排序的流进行排序。这种优化可能不是一直使用，因为 _SORTED_ 流可能会使用与第一次不同的比较器再次排序。

有一些中间操作会清除 _SORTED_ 特性。在以下代码中，您可以看到 `strings` 和 `filteredStream` 都是 _SORTED_ 流，而 `lengths` 不是。

```java
Collection<String> stringCollection = List.of("one", "two", "two", "three", "four", "five");

Stream<String> strings = stringCollection.stream().sorted();
Stream<String> filteredStrings = strings.filter(s -> s.length() < 5);
Stream<Integer> lengths = filteredStrings.map(String::length);

```

映射或扁平映射 _SORTED_ 流会从结果流中移除此特性。

## 不重复流
_DISTINCT_ 流是在处理的元素中没有重复项的流。这种特性是在从 `HashSet` 构建流时获得的，或者通过调用 `distinct()` 中间方法获得的。

过滤流时会保留 _DISTINCT_ 特性，但在映射或扁平映射流时会丢失此特性。

让我们检查以下示例。

```java
Collection<String> stringCollection = List.of("one", "two", "two", "three", "four", "five");

Stream<String> strings = stringCollection.stream().distinct();
Stream<String> filteredStrings = strings.filter(s -> s.length() < 5);
Stream<Integer> lengths = filteredStrings.map(String::length);

```

- `stringCollection.stream()` 不是 _DISTINCT_，因为它是从 `List` 的实例构建的。
- `strings` 是 _DISTINCT_，因为此流是通过调用 `distinct()` 中间方法创建的。
- `filteredStrings` 仍然是 _DISTINCT_：从流中移除元素不会产生重复项。
- `length` 已被映射，所以丢失了 _DISTINCT_ 特性。

## 非空流
_NONNULL_ 流是不含 null 值的流。集合框架中有一些结构不接受 null 值，包括 `ArrayDeque` 和像 `ArrayBlockingQueue`、`ConcurrentSkipListSet` 这样的并发结构，以及通过调用 `ConcurrentHashMap.newKeySet()` 返回的并发集合。使用 `Files.lines(path)` 和 `Pattern.splitAsStream(line)` 创建的流也是 _NONNULL_ 流。

对于前面的特性，一些中间操作可以产生具有不同特性的流。

- 过滤或排序 _NONNULL_ 流返回 _NONNULL_ 流。
- 在 _NONNULL_ 流上调用 `distinct()` 也返回 _NONNULL_ 流。
- 映射或扁平映射 _NONNULL_ 流返回没有此特性的流。

## 有大小和子大小的流

### 有大小的流
当您想使用并行流时，这个特性非常重要。并行流将在本教程后面更详细地介绍。

_SIZED_ 流是知道它将处理多少元素的流。从任何 `Collection` 实例创建的流就是这样的流，因为 `Collection` 接口有一个 `size()` 方法，所以获取这个数字很容易。

另一方面，有些情况下您知道您的流将处理有限数量的元素，但除非您处理流本身，否则您无法知道这个数字。

这适用于使用 `Files.lines(path)` 模式创建的流。您可以获得文本文件的字节大小，但这个信息并不能告诉您文本文件有多少行。您需要分析文件才能获得这些信息。

这也适用于 `Pattern.splitAsStream(line)` 模式。知道您正在分析的字符串中的字符数量并不能给出此模式将产生多少元素的任何提示。

### 子大小的流
_SUBSIZED_ 特性与流作为并行流计算时的分割方式有关。简而言之，并行化机制将流分成两部分，并将计算分配给 CPU 执行的不同可用核心。这种分割由流使用的 `Spliterator` 实例实现。这个实现取决于您使用的数据源。

假设您需要在 `ArrayList` 上打开流。这个列表的所有数据都保存在 `ArrayList` 实例的内部数组中。也许您记得 `ArrayList` 对象的内部数组是一个紧凑的数组，因为当您从这个数组中移除一个元素时，所有后续元素都会向左移动一个单元格，以便不留下任何空洞。

这使得分割 `ArrayList` 变得简单。分割 `ArrayList` 的实例，您可以将这个内部数组分成两部分，两部分的元素数量相同。这使得在 `ArrayList` 实例上创建的流是 _SUBSIZED_：您可以提前知道分割后每个部分将包含多少元素。

现在假设您需要在 `HashSet` 的实例上打开流。`HashSet` 在数组中存储其元素，但这个数组的使用方式与 `ArrayList` 使用的数组不同。实际上，这个数组的给定单元格中可以存储多个元素。分割这个数组没有问题，但您不能提前知道每个部分将包含多少元素而不进行计数。即使您将这个数组从中间分割，也无法确定两半的元素数量是否相同。这就是为什么在 `HashSet` 实例上创建的流是 _SIZED_ 而不是 _SUBSIZED_。

转换流可能会更改返回流的 _SIZED_ 和 _SUBSIZED_ 特性。

- 映射和排序流保留 _SIZED_ 和 _SUBSIZED_ 特性。
- 扁平映射、过滤和调用 `distinct()` 擦除这些特性。

对于并行计算，最好拥有 _SIZED_ 和 _SUBSIZED_ 流。

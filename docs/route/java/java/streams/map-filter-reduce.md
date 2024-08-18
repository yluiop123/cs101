# 使用Stream API在内存中处理数据

## 介绍Stream API
Stream API可能是Java SE 8中继lambda表达式之后第二重要的特性。简单来说，Stream API是为JDK提供了众所周知的map-filter-reduce算法的实现。

集合框架是关于在JVM的内存中存储和组织数据的。您可以将Stream API视为集合框架的伴侣框架，以非常高效的方式处理这些数据。实际上，您可以在集合上打开一个流来处理它包含的数据。

这还不止：Stream API不仅可以处理来自集合的数据。JDK为您提供了几种在其他来源（包括I/O来源）上创建流的模式。此外，您可以以很少的努力创建自己适合需求的数据来源。

当您掌握了Stream API，您将能够编写非常富有表现力的代码。以下是一个小程序段，您可以使用正确的静态导入进行编译：

```java
List<String> strings = List.of("one", "two", "three", "four");
var map = strings.stream()
                 .collect(groupingBy(String::length, counting()));
map.forEach((key, value) -> System.out.println(key + " :: " + value));
```

这段代码打印出以下内容：

- 它使用`groupingBy(String::length)`按长度对字符串进行分组
- 它使用`counting()`计算每个长度的字符串数量
- 然后创建一个`Map<Integer, Long>`来存储结果

运行此代码将产生以下结果：

```
3 :: 2
4 :: 1
5 :: 1
```

即使您不熟悉Stream API，阅读使用它的代码也可以让您第一眼就大致了解它在做什么。

## 介绍Map-Filter-Reduce算法
在深入研究Stream API本身之前，让我们看看您需要的map-filter-reduce算法的要素。

这个算法是一个非常经典的数据处理算法。让我们以一个例子为例。假设您有一组具有三个属性的`Sale`对象：日期、产品引用和金额。为了简单起见，我们将假设金额只是一个整数。以下是您的`Sale`类。

```java
public class Sale {
    private String product;
    private LocalDate date;
    private int amount;

    // 构造函数，getter，setter
    // equals, hashCode, toString
}
```

假设您需要计算三月份的销售总额。您可能会编写以下代码：

```java
List<Sale> sales = ...; // 这是所有销售的列表
int amountSoldInMarch = 0;
for (Sale sale : sales) {
    if (sale.getDate().getMonth() == Month.MARCH) {
        amountSoldInMarch += sale.getAmount();
    }
}
System.out.println("三月份销售总额: " + amountSoldInMarch);
```

在这个简单的数据处理算法中，您可以看到三个步骤。

第一步是只考虑发生在三月份的销售。您正在基于给定的标准进行一些元素的_filtering_（过滤）。这正是过滤步骤。

第二步是从`sale`对象中提取属性。您对整个对象不感兴趣；您需要的是它的`amount`属性。您正在将`sale`对象映射到一个金额，即一个`int`值。这是映射步骤；它包括将您正在处理的对象转换为其他对象或值。

最后一步是将所有这些金额加总到一个金额中。如果您熟悉SQL语言，您可以看到这一步看起来像是一个聚合。确实如此。这个总和是一个_reduction_（归约），将各个金额归约为一个金额。

顺便说一下，SQL语言在以可读的方式表达这种处理方面做得非常好。您需要的SQL代码非常容易阅读：

```sql
SELECT SUM(amount)
FROM Sales
WHERE EXTRACT(MONTH FROM date) = 3;
```

## 指定结果而不是编写算法
您可以看到，在SQL中，您正在编写的是您需要的结果描述：所有在三月份进行的销售的金额总和。计算这个结果的效率是数据库服务器的责任。

计算这个金额的Java代码是一步一步的描述。它以命令式的方式精确描述。它为Java运行时优化这个计算留下了很少的空间。

Stream API的两个目标是使您能够创建更易读和富有表现力的代码，并给Java运行时一些优化计算的空间。

## 将对象映射到其他对象或值
map-filter-reduce算法的第一步是_mapping_（映射）步骤。映射包括转换您正在处理的对象或值。映射是一种一对一的转换：如果您映射一个包含10个对象的列表，您将得到一个包含10个转换后对象的列表。

在Stream API中，映射步骤增加了一个额外的约束。假设您正在处理一个_有序_对象的集合。它可以是一个列表，或者是其他有序对象的来源。当您映射这个列表时，您得到的第一个对象应该是源中第一个对象的映射。换句话说：映射步骤尊重您的对象顺序；它不会打乱它们。

> 映射改变对象的类型；它不会改变它们的数量。

映射由`Function`功能接口建模。确实，一个函数可以采用任何类型的对象，并返回另一种类型的对象。此外，专门的函数可以将对象映射到原始类型，反之亦然。

## 过滤对象
另一方面，过滤不会触及您正在处理的对象。它只决定选择其中的一些，并移除其他对象。

> 过滤改变对象的数量；它不会改变它们的类型。

过滤由`Predicate`功能接口建模。确实，一个谓词可以采用任何类型的对象或原始类型，并返回布尔值。

## 将对象归约以产生结果
归约步骤比看起来更棘手。现在，我们将使用这个定义，它就像SQL聚合一样。想想_COUNT_、_SUM_、_MIN_、_MAX_、_AVERAGE_。顺便说一下，所有这些聚合都由Stream API支持。

只是给您一个提示，关于这条路径上等待您的东西：归约步骤允许您使用数据构建复杂结构，包括任何类型的列表、集合、映射，甚至您可以自己构建的结构。只需看看本页上的第一个示例：您可以看到对`collect()`方法的调用，它采用`groupingBy()`工厂方法构建的对象。这个对象是一个_collector_（收集器）。归约可能包括使用收集器收集数据。收集器将在本教程后面详细讨论。

## 优化Map-Filter-Reduce算法
让我们再举一个例子。假设您有一个城市集合。每个城市由一个`City`类建模，该类有两个属性：一个名称和一个人口，即居住在其中的人数。您需要计算人口超过100k的城市的总居住人口。

如果不使用Stream API，您可能会编写以下代码：

```java
List<City> cities = ...;

int sum = 0;
for (City city : cities) {
    int population = city.getPopulation();
    if (population > 100_000) {
        sum += population;
    }
}

System.out.println("总和 = " + sum);
```

您可以识别对城市列表的另一个map-filter-reduce处理。

现在，让我们做一个小的思维实验：假设Stream API不存在，而`Collection`接口上存在一个`map()`和一个`filter()`方法，以及一个`sum()`方法。

有了这些（虚构的）方法，之前的代码可以变成以下这样。

```java
int sum = cities.map(city -> city.getPopulation())
                .filter(population -> population > 100_000)
                .sum();
```

从可读性和表达性的角度来看，这段代码非常容易理解。因此，您可能会想：为什么这些map和filter方法没有被添加到`Collection`接口中呢？

让我们深入一点：这些`map()`和`filter()`方法的返回类型是什么？嗯，既然我们在集合框架中，返回一个集合看起来很自然。所以您可以以这种方式编写此代码。

```java
Collection<Integer> populations = cities.map(city -> city.getPopulation());
Collection<Integer> filteredPopulations = populations.filter(population -> population > 100_000);
int sum = filteredPopulations.sum();
```

即使链接调用提高了可读性，这段代码仍然应该是正确的。

现在让我们分析这段代码。

- 第一步是映射步骤。您看到了，如果您需要处理1000个城市，那么这个映射步骤会产生1000个整数并将它们放入一个集合中。
- 第二步是过滤步骤。它遍历所有元素，并根据给定的标准移除其中一些。这是另外1000个元素要测试和另一个要创建的集合，可能更小。

因为这段代码返回一个集合，它映射所有城市，然后过滤结果的整数集合。这与您最初编写的_for循环_非常不同。存储这个中间的整数集合可能会导致很多开销，特别是当您有很多城市要处理时。_for循环_没有这个开销：它直接在结果中累加整数，而不需要存储在中间结构中。

这个开销是不好的，并且有的情况下可能会更糟。假设您需要知道集合中是否有超过100k居民的城市。也许集合中的第一个城市就是这样的城市。在这种情况下，您可以几乎不费力气地产生一个结果。首先，从您的城市构建所有人口的集合，然后过滤它并检查结果是否为空将是荒谬的。

显然，出于性能原因，在`Collection`接口上创建一个返回`Collection`的`map()`方法是不正确的。您最终会创建不必要的中间结构，对内存和CPU都有很高的开销。

这就是为什么`map()`和`filter()`方法没有被添加到`Collection`接口中的原因。相反，它们被创建在`Stream`接口上。

正确的模式如下。

```java
Stream<City> streamOfCities = cities.stream();
Stream<Integer> populations = streamOfCities.map(city -> city.getPopulation());
Stream<Integer> filteredPopulations = populations.filter(population -> population > 100_000);
int sum = filteredPopulations.sum(); // 事实上，这段代码无法编译；我们将在后面修复
```

`Stream`接口避免创建中间结构来存储映射或过滤的对象。这里`map()`和`filter()`方法仍然返回新的流。因此，为了使这段代码工作并高效，这些流中不应该存储数据。这段代码中创建的流`streamOfCities`、`populations`和`filteredPopulations`都必须是空对象。

这引出了流的一个非常重要的属性：

> 流是一个不存储任何数据的对象。

Stream API的设计方式是，只要您在流模式中没有创建任何非流对象，就不会执行数据的计算。在前面的例子中，您正在计算流处理的元素的总和。

这个求和操作触发了计算：`cities`列表中的所有对象一个接一个地通过流的所有操作。首先它们被映射，然后被过滤，并在通过过滤步骤时被累加。

流以与等价的_for循环_相同的顺序处理数据。这样就没有内存开销。此外，有些情况下，您可以在不必遍历集合中的所有元素的情况下产生结果。

使用流是关于创建操作管道。在某个时刻，您的数据将通过这个管道流动并被转换、过滤，然后参与产生结果。

一个管道由一系列对流的方法调用组成。每个调用产生另一个流。然后在某个时刻，最后一个调用产生一个结果。返回另一个流的操作称为中间操作。另一方面，返回其他任何东西的操作，包括void，称为终端操作。

中间操作是返回另一个流的操作。调用这样的操作会在现有的操作管道上添加更多操作，而不需要处理任何数据。它由返回流的方法建模。

## 使用终端操作计算结果
终端操作是返回流的操作。调用这样的操作会触发流源元素的消耗。然后这些元素被中间操作的管道逐个处理。

终端操作由返回除流之外的任何内容的方法建模，包括void。

您不能在给定的流实例上调用多个中间或终端方法。如果您这样做，您将得到一个带有以下消息的`IllegalStateException`："流已经被操作或关闭了"，就像下面的例子一样。您不能在`stream`上调用`toList()`方法，因为您已经对它调用了`map()`。

```java
var stream = Stream.of(1, 2, 3, 4);
var stream1 = stream.map(i -> i + 1);
var list = stream.toList();

```

## 避免使用专门的数字流进行装箱
Stream API为您提供了四个接口。

第一个是`Stream`，您可以使用它来定义对任何类型对象的操作管道。

然后有三个专门的接口来处理数字流：`IntStream`、`LongStream`和`DoubleStream`。这三个流使用原始类型数字而不是包装类型来避免装箱和拆箱。它们几乎拥有与`Stream`中定义的方法相同的方法，有一些例外。因为它们处理数字，它们有一些在`Stream`中不存在的终端操作：

- `sum()`：计算总和
- `min()`、`max()`：计算流中的最小或最大数字
- `average()`：计算数字的平均值
- `summaryStatistics()`：这个调用产生一个特殊对象，它携带了几个统计数据，所有这些统计数据都是在对数据的一次遍历中计算的。这些统计数据是该流处理的元素数量、最小值、最大值、总和和平均值。

## 遵循良好实践
正如您所看到的，您只允许在流上调用一个方法，即使这个方法是中间的。因此，将流存储在字段或局部变量中是无用的，有时甚至是危险的。编写以流为参数的方法也可能是危险的，因为您不能确定您收到的流是否已经被操作过。流应该在当场创建和消耗。

流是连接到源的对象。它从这个源中拉取它处理的元素。这个源本身不应该被流修改。这样做会导致不确定的结果。在某些情况下，这个源是不可变的或只读的，所以您无法做到这一点，但在某些情况下您可以。

`Stream`接口中有大量可用的方法，您将在本教程中看到其中的大部分。编写修改流本身之外的一些变量或字段的操作是一个始终可以避免的坏主意。流不应该是有_side effects_（副作用）的。


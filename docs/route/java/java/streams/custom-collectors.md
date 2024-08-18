# 创建您自己的收集器 

## 理解收集器的工作原理

正如我们前面提到的，`Collectors` 工厂类仅处理对象流，因为只存在于`Stream`中的`collect()`方法需要一个收集器对象作为参数。如果您需要收集数字流，则需要了解收集器的基本构建元素是什么。

简而言之，收集器是基于四个基本组件构建的。前两个用于收集流中的元素。第三个仅对并行流是必需的。第四个对某些类型的收集器是必需的，这些收集器需要对构建的容器进行后期处理。

第一个组件用于创建容器，流中的元素将被收集到这个容器中。这个容器很容易识别。例如，在前一部分我们使用过的案例中，我们使用了`ArrayList`类、`HashSet`类或`HashMap`类。创建这样的容器可以通过`Supplier`的实例来建模。这个第一个组件被称为_供应商_。

第二个组件模拟将流中的单个元素添加到此容器中。此操作将由Stream API的实现反复调用，以便将流中的所有元素逐个添加到容器中。

在Collector API中，此组件由`BiConsumer`的实例建模。这个双消费者接受两个参数。
1. 第一个参数是容器本身，它已经部分填充了流的前几个元素。
2. 第二个参数是应该添加到这个部分填充的容器中的流元素。

在这个Collector API的上下文中，双消费者被称为_累加器_。

这两个组件应该足以使收集器工作，但Stream API带来了一个约束，使得收集器要正常工作还需要另外两个组件。

您可能还记得Stream API支持并行化。这一点将在本教程后面的部分更详细地介绍。您需要知道的是，当并行化时，您的流元素将被分割成子流，每个子流都由CPU的一个核心来处理。Collector API可以在这样的上下文中工作：每个子流将只被收集到由您的收集器创建的容器的实例中。

一旦这些子流被处理，您将有几个容器，每个容器都包含它处理的子流的元素。这些容器是相同的，因为它们都是使用相同的_供应商_创建的。现在，您需要一种方法将它们合并为一个。为了能够这样做，Collector API需要第三个组件，一个_组合器_，将这些容器合并在一起。组合器是由`BinaryOperator`的实例建模的，它接受两个部分填充的容器并返回一个。

这个`BinaryOperator`也在Stream API的`collect()`重载中由`BiConsumer`建模。

第四个组件被称为_修饰器_，稍后将在这部分介绍。

## 在集合中收集基本类型

有了前三个组件，您可以使用数字流的`collect()`方法。`IntStream.collect()`方法接受三个参数：
- 一个`Supplier`的实例，称为_供应商_；
- 一个`ObjIntConsumer`的实例，称为_累加器_；
- 一个`BiConsumer`的实例，称为_组合器_。

让我们编写代码，将`IntStream`收集到`List<Integer>`的实例中。

```java
Supplier<List<Integer>> supplier = ArrayList::new;
ObjIntConsumer<List<Integer>> accumulator = Collection::add;
BiConsumer<List<Integer>, List<Integer>> combiner = Collection::addAll;

List<Integer> collect =
    IntStream.range(0, 10)
             .collect(supplier, accumulator, combiner);

System.out.println("collect = " + collect);
```

运行此代码将产生以下结果。

```
collect = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

将此数据收集到一个集合中只需要更改`supplier`的实现并相应地调整类型。

## 在StringBuffer中收集基本类型

让我们看看如何实现一个等同于`Collectors.joining()`的功能，将流的基本类型元素连接成单个字符串。`String`类是不可变的，所以你不能在其中累积元素。而不是使用`String`类，您可以使用`StringBuffer`类，它是可变的。

将元素收集到`StringBuffer`中遵循与前一个相同的模式。

```java
Supplier<StringBuffer> supplier = StringBuffer::new;
ObjIntConsumer<StringBuffer> accumulator = StringBuffer::append;
BiConsumer<StringBuffer, StringBuffer> combiner = (sb1, sb2) -> sb1.append(sb2);

StringBuffer collect =
    IntStream.range(0, 10)
             .collect(supplier, accumulator, combiner);

System.out.println("collect = " + collect);
```

运行此代码将产生以下结果。

```
collect = 0123456789
```

## 使用修饰器对收集器进行后期处理

您在前一段代码中编写的代码几乎完成了您需要的操作：它将字符字符串连接到一个`StringBuffer`实例中，您可以简单地调用它的`toString()`方法来创建一个常规的`String`对象。但是`Collectors.joining()`收集器直接产生一个`String`，而不需要您调用`toString()`。这是怎么做到的呢？

Collector API定义了第四个组件来处理这种情况，称为_修饰器_。修饰器是一个`Function`的实例，它接受累积元素的容器，将其转换为其他东西。在`Collectors.joining()`的情况下，这个函数只是以下内容。

```java
Function<StringBuffer, String> finisher = stringBuffer -> stringBuffer.toString();
```

有许多收集器的修饰器只是恒等函数。以下是这种情况的收集器：`toList()`、`toSet()`、`groupingBy()`和`toMap()`。

在所有其他情况下，收集器内部使用的可变容器成为一个中间容器，它将被映射到其他对象，也许是另一个容器，然后返回给应用程序。这就是Collector API处理不可变列表、集合或映射的创建方式。修饰器用于在将中间容器密封为不可变容器并返回给应用程序之前使用。

修饰器还有其他用途，可以提高您的代码的可读性。`Collectors`工厂类有一个我们尚未涵盖的工厂方法：`collectingAndThen()`方法。此方法将收集器作为第一个参数，修饰器作为第二个参数。它将只对使用第一个收集器收集流的结果应用此函数，然后使用您提供的函数进行映射。

您可能还记得我们在前几节中多次检查过以下示例。这是关于提取直方图的最大值的。

```java
Collection<String> strings =
    List.of("two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Map<Integer, Long> histogram =
    strings.stream()
           .collect(Collectors.groupingBy(
                           String::length,
                           Collectors.counting()));

Map.Entry<Integer, Long> maxValue =
    histogram.entrySet().stream()
             .max(Map.Entry.comparingByValue())
             .orElseThrow();

System.out.println("maxValue = " + maxValue);
```

首先，您构建了一个`Map<Integer, Long>`类型的直方图，然后在第二步中，您提取了这个直方图的最大值，通过按值比较键值对。

实际上，这第二步是将映射转换为来自此映射的特殊键/值对。您可以使用以下函数来建模它。

```java
Function<Map<Integer, Long>, Map.Entry<Integer, Long>> finisher =
    map -> map.entrySet().stream()
              .max(Map.Entry.comparingByValue())
              .orElseThrow();
```

这个函数的类型一开始可能看起来很复杂。事实上，它只是从一个映射中提取一个键/值对。所以它接受一个特定类型的`Map`实例，并返回一个具有相同类型的`Map.Entry`实例。

现在您有了这个函数，您可以使用`collectingAndThen()`将最大值提取步骤集成到收集器本身中。然后模式变成以下内容。

```java
Collection<String> strings =
    List.of("two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve");

Function<Map<Integer, Long>, Map.Entry<Integer, Long>> finisher =
    map -> map.entrySet().stream()
              .max(Map.Entry.comparingByValue())
              .orElseThrow();

Map.Entry<Integer, Long> maxValue =
    strings.stream()
           .collect(Collectors.collectingAndThen(
                   Collectors.groupingBy(
                           String::length,
                           Collectors.counting()),
                   finisher));

System.out.println("maxValue = " + maxValue);
```

您可能想知道为什么您需要编写看起来相当复杂的代码？

现在您已经通过单个收集器建模了一个最大值提取器，您可以将其用作另一个收集器的下游收集器。能够这样做使得您可以组合更多的收集器，对您的数据进行更复杂的计算。

## 使用分叉收集器组合两个收集器的结果

Java SE 12中在`Collectors`类中添加了一个名为`teeing()`的方法。此方法接受两个下游收集器和一个合并函数。

让我们通过一个用例来看看您可以用收集器做什么。假设您有以下`Car`和`Truck`记录。

```java
enum Color {
    RED, BLUE, WHITE, YELLOW
}

enum Engine {
    ELECTRIC, HYBRID, GAS
}

enum Drive {
    WD2, WD4
}

interface Vehicle {}

record Car(Color color, Engine engine, Drive drive, int passengers) {}

record Truck(Engine engine, Drive drive, int weight) {}
```

汽车对象有几个组成部分：颜色、引擎、驱动方式以及它可以运输的乘客数量。卡车有一个引擎、一个驱动方式，它可以运输一定数量的货物。两者都实现了同一个接口：`Vehicle`。

假设您有一个车辆集合，您需要找到所有电动轿车。根据您的应用程序，您最终可能会使用流来过滤您的轿车集合。或者，如果您知道下一个请求是获取混合动力引擎的轿车，您可能更愿意准备一个映射，以引擎作为键，以引擎类型的轿车列表作为值。在这两种情况下，Stream API都将为您提供正确的模式来获得您需要的内容。

假设您需要将所有电动卡车添加到这个集合中。您仍然可以在一次通过您的车辆集合中创建这个联合，但您将使用的谓词变得越来越复杂，过滤您的数据。它可能看起来像下面这样。

```java
Predicate<Vehicle> predicate =
    vehicle -> vehicle instanceof Car car && car.engine() == Engine.ELECTRIC ||
               vehicle instanceof Truck truck && truck.engine() == Engine.ELECTRIC;
```

您真正需要的是：
1. 过滤车辆以获取所有电动轿车
2. 过滤它们以获取所有电动卡车
3. 合并两个结果。

这正是分叉收集器可以为您做的。分叉收集器是通过`Collectors.teeing()`工厂方法创建的，它接受三个参数。

1. 第一个下游收集器，用于收集您的流数据。
2. 第二个下游收集器，也用于以独立的方式收集您的数据。
3. 一个双函数，用于合并两个下游收集器创建的两个容器。

您的数据在一次通过中被处理，以保证最佳性能。

我们已经涵盖了您可以使用收集器过滤流元素的模式。合并函数只是一个调用`Collection.addAll()`方法。以下是代码：

```java
List<Vehicle> electricVehicles = vehicles.stream()
    .collect(Collectors.teeing(
        Collectors.filtering(
            vehicle -> vehicle instanceof Car car && car.engine() == Engine.ELECTRIC,
            Collectors.toList()),
        Collectors.filtering(
            vehicle -> vehicle instanceof Truck truck && truck.engine() == Engine.ELECTRIC,
            Collectors.toList()),
        (cars, trucks) -> {
            cars.addAll(trucks);
            return cars;
        })); 
```




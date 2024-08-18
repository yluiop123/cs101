# 使用集合工厂方法创建和处理数据

## 创建不可变集合
Java SE 9 在 `List` 和 `Set` 接口中增加了一组工厂方法来创建列表和集合。模式非常简单：只需调用 `List.of()` 或 `Set.of()` 静态方法，传递您的列表和集合的元素即可。

```java
List<String> stringList = List.of("one", "two", "three");
Set<String> stringSet = Set.of("one", "two", "three");
```

尽管如此，仍有几点值得注意：
- 返回给您的具体实现可能会因您在列表或集合中放置的元素数量而有所不同。它们都不是 `ArrayList` 或 `HashSet`，因此您的代码不应依赖于此。
- 您获得的列表和集合都是不可变结构。您不能在其中添加或修改元素，也不能修改这些元素。如果这些结构的对象是可变的，您仍然可以改变它们。
- 这些结构不接受空值。如果您尝试在此类列表或集合中添加 `null` 值，将会引发异常。
- `Set` 接口不允许重复项：这就是集合的本质。由于使用重复值创建这样的集合没有意义，因此假定编写此类代码是一个错误。所以，如果您尝试这样做，将会引发异常。
- 您获得的实现是 `Serializable`。

这些 `of()` 方法通常被称为集合的 _便捷工厂方法_。

## 获取集合的不可变副本
在集合的便捷工厂方法成功之后，Java SE 10 中又增加了一组便捷方法，用于创建集合的不可变副本。

有两个：`List.copyOf()` 和 `Set.copyOf()`。它们都遵循相同的模式：

```java
Collection<String> strings = Arrays.asList("one", "two", "three");

List<String> list = List.copyOf(strings);
Set<String> set = Set.copyOf(strings);
```

在所有情况下，您需要复制的集合不应该是空的，也不应该包含任何空元素。如果此集合有重复项，在 `Set.copyOf()` 的情况下，将只保留这些元素中的一个。

您返回的是一个不可变的集合副本。因此，修改此集合将不会反映在您作为副本获得的列表或集合中。

您获得的实现都不接受 `null` 值。如果您尝试复制包含 `null` 值的集合，将会引发 `NullPointerException`。

## 将数组包装在列表中
集合框架有一个名为 `Arrays` 的类，其中包含约200个方法来处理数组。它们大多数实现数组上的各种算法，如排序、合并、搜索等，本节不涵盖这些内容。

然而，有一个值得一提：`Arrays.asList()`。此方法采用可变参数作为参数，并返回您传递的元素的 `List`，保留它们的顺序。此方法不是集合的 _便捷工厂方法_ 的一部分，但仍然非常有用。

这个 `List` 作为数组的包装器，并以相同的方式表现，一开始可能会有点令人困惑。一旦您设置了数组的大小，就无法更改它。这意味着您不能向现有数组添加元素，也不能从其中删除元素。您所能做的只是用另一个可能为空的元素替换现有元素。

通过调用 `Arrays.asList()` 获得的 `List` 正是如此。
- 如果您尝试添加或删除元素，无论是直接还是通过迭代器，都会得到 `UnsupportedOperationException`。
- 替换现有元素是可以的。

所以这个列表不是不可变的，但对您可以如何更改它有限制。

## 使用集合工厂类处理集合
集合框架还提供另一个工厂类：`Collections`，提供一组方法来操作集合及其内容。这个类中有大约70个方法，一一检查它们将是乏味的，所以让我们只介绍其中的一部分。

`Collections` 类为您提供了两个方法：`min()` 和 `max()`。这两种方法都以集合作为参数，从中提取最小值或最大值。这两种方法都有重载版本，也可以接受比较器作为进一步的参数。

如果没有提供比较器，那么集合的元素必须实现 `Comparable`。如果没有，将引发 `ClassCastException`。如果提供了比较器，那么它将被用来获取最小值或最大值，无论集合的元素是否可比较。

使用这种方法获取空集合的最小值或最大值将引发 `NoSuchElementException`。

### 在列表中查找子列表
两种方法可以在较大的列表中定位给定的子列表：
- `indexOfSublist(List<?> source, List<?> target)`: 返回 `target` 列表在 `source` 列表中的第一个元素的索引，如果不存在则返回 -1；
- `lastIndexOfSublist(List<?> source, List<?> target)`: 返回这些索引中的最后一个。

### 更改列表元素的顺序
几种方法可以更改列表元素的顺序：
- `sort()` 就地对列表进行排序。此方法可以接受比较器作为参数。像往常一样，如果没有提供比较器，那么列表的元素必须是可比较的。如果提供了比较器，那么它将被用来比较元素。从 Java SE 8 开始，您应该优先使用 `List` 接口中的 `sort()` 方法。
- `shuffle()` 随机打乱提供的列表的元素。如果您需要可以重复的随机洗牌，您可以提供您的 `Random` 实例。
- `rotate()` 旋转列表的元素。旋转后，索引0处的元素将位于索引1处，依此类推。最后一个元素将被移动到列表的首位。您可以组合使用 `subList()` 和 `rotate()` 来移除给定索引处的元素，并将其插入列表中的另一个位置。以下代码演示了这一点：

```java
List<String> strings = Arrays.asList("0", "1", "2", "3", "4");
System.out.println(strings);
int fromIndex = 1, toIndex = 4;
Collections.rotate(strings.subList(fromIndex, toIndex), -1);
System.out.println(strings);
```

结果如下：

```
[0, 1, 2, 3, 4]
[0, 2, 3, 1, 4]
```

`fromIndex` 处的元素已从其位置移除，列表已相应地重新组织，该元素已被插入到 `toIndex - 1` 处。

- `reverse()`: 反转列表中元素的顺序。
- `swap()`: 交换列表中的两个元素。此方法可以接受列表作为参数，也可以接受普通数组。

### 将集合包装在不可变集合中
`Collections` 工厂类为您提供了几种方法，为您的集合或映射创建不可变包装器。结构的内容不会复制；您得到的是围绕您结构的包装器。所有修改尝试都将引发异常。

所有这些方法都以 `unmodifiable` 开头，后跟您结构的类型名称。例如，要创建列表的不可变包装器，您可以调用：

```java
List<String> strings = Arrays.asList("0", "1", "2", "3", "4");
List<String> immutableStrings = Collections.unmodifiableList(strings);
```

只是一句警告：您无法通过此包装器修改您的集合。但这个包装器是由您的集合支持的，所以如果您通过另一种方式修改它，这种修改将反映在不可变集合中。让我们在以下代码中看看：

```java
List<String> strings = new ArrayList<>(Arrays.asList("0", "1", "2", "3", "4"));
List<String> immutableStrings = Collections.unmodifiableList(strings);
System.out.println(immutableStrings);
strings.add("5");
System.out.println(immutableStrings);
```

运行此示例将给您以下结果：

```
[0, 1, 2, 3, 4]
[0, 1, 2, 3, 4, 5]
```

如果您计划使用此模式创建不可变集合，首先防御性地复制它可能是一个安全的预防措施。

### 将集合包装在同步集合中
正如您可以为您的映射和集合创建不可变包装器一样，`Collections` 工厂类可以为它们创建同步包装器。模式遵循与创建不可变包装器的方法相同的命名约定：方法称为 `synchronized` 后跟 `Collection`、`List`、`Set` 等。

您需要遵循两个预防措施。
- 您对集合的所有访问都应通过您获得的包装器进行
- 使用迭代器或流遍历集合时，应由调用代码在列表本身上同步

不遵循这些规则将使您的代码暴露于竞态条件。

使用 `Collections` 工厂方法同步集合可能不是您的最佳选择。Java Util Concurrent 框架提供了更好的解决方案。



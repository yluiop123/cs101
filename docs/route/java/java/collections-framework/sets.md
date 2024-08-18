
# 通过Set、SortedSet和NavigableSet扩展集合

## 探索Set接口
`Set` 接口没有为 `Collection` 接口带来任何新方法。集合框架为您提供了一个 `Set` 接口的普通实现：`HashSet`。内部地，`HashSet` 包装了一个 `HashMap` 的实例，这个类稍后会介绍，它作为 `HashSet` 的代理。

正如您已经看到的，`Set` 为 `Collection` 带来的是它禁止重复项。与 `List` 接口相比，您失去的是元素以无特定顺序存储。您迭代它们时以添加到集合中的顺序进行的可能性非常小。

您可以在以下示例中看到这一点：
```java
List<String> strings = List.of("one", "two", "three", "four", "five", "six");
Set<String> set = new HashSet<>();
set.addAll(strings);
set.forEach(System.out::println);
```
运行此代码将产生以下结果：
```
six
four
one
two
three
five
```

一些 `Set` 的实现在迭代其元素时给您相同的顺序，但既然这不保证，您的代码就不应依赖于此。

## 通过SortedSet扩展Set
`Set` 的第一个扩展是 `SortedSet` 接口。`SortedSet` 接口根据特定的比较逻辑保持其元素排序。集合框架为您提供了一个 `SortedSet` 的实现，称为 `TreeSet`。

正如您已经看到的，当您构建 `TreeSet` 时，要么您提供一个比较器，要么您为放入 `TreeSet` 中的元素实现 `Comparable` 接口。如果您两者都做，那么比较器优先。

`SortedSet` 接口为 `Set` 添加了新方法。
- `first()` 和 `last()` 返回集合中最低和最大的元素
- `headSet(toElement)` 和 `tailSet(fromElement)` 返回包含低于 `toElement` 或大于 `fromElement` 的元素的子集
- `subSet(fromElement, toElement)` 给您一个元素在 `fromElement` 和 `toElement` 之间的子集

`toElement` 和 `fromElement` 不必须是主集合的元素。如果是，那么 `toElement` 在结果中不包括，而 `fromElement` 包括，遵循通常的惯例。

考虑以下示例：
```java
SortedSet<String> strings = new TreeSet<>(Set.of("a", "b", "c", "d", "e", "f"));
SortedSet<String> subSet = strings.subSet("aa", "d");
System.out.println("sub set = " + subSet);
```
运行此代码将给您以下结果：
```
sub set = [b, c]
```

这三种子集这些方法返回的是主集合的 _视图_。不进行复制，这意味着您对这些子集所做的任何更改都将反映在集合中，反之亦然。

您可以通过这些子集添加或移除主集中的元素。不过，有一点需要注意。这三个子集记住了它们建立的限制。出于一致性原因，通过子集在其限制之外添加元素是不合法的。例如，如果您取一个 `headSet` 并尝试添加一个大于 `toElement` 的元素，那么您将得到一个 `IllegalArgumentException`。

## 通过NavigableSet扩展SortedSet
Java SE 6 通过添加更多方法引入了 `SortedSet` 的扩展。事实证明，`TreeSet` 类被改装以实现 `NavigableSet`。所以您可以使用同一个类来实现这两个接口。

一些方法被 `NavigableSet` 重载。
- `headSet()`、`tailSet()` 和 `subSet()` 可能接受一个额外的 `boolean` 参数，以指定限制 (`toElement` 或 `fromElement`) 是否要包含在结果子集中。

还添加了其他方法。
- `ceiling(element)` 和 `floor(element)` 返回大于或等于或小于或等于提供 `element` 的最大或最小元素。如果没有这样的元素，则返回 `null`
- `lower(element)` 和 `higher(element)` 返回小于或大于提供 `element` 的较大或较小元素。如果没有这样的元素，则返回 `null`
- `pollFirst()` 和 `pollLast()` 返回并移除集合中最低或最高的元素。

此外，`NavigableSet` 还允许您按降序迭代其元素。有两种方法可以做到这一点。
- 您可以调用 `descendingIterator()`：它给您一个常规的 `Iterator`，按降序遍历集合。
- 您也可以调用 `descendingSet()`。您得到的是另一个 `NavigableSet`，它是此集合的视图，并使您认为您拥有相同的集合，以相反的顺序排序。

以下示例演示了这一点。
```java
NavigableSet<String> sortedStrings = new TreeSet<>(Set.of("a", "b", "c", "d", "e", "f"));
System.out.println("sorted strings = " + sortedStrings);
NavigableSet<String> reversedStrings = sortedStrings.descendingSet();
System.out.println("reversed strings = " + reversedStrings);
```
运行此代码将给您以下结果：
```
sorted strings = [a, b, c, d, e, f]
reversed strings = [f, e, d, c, b, a]
```

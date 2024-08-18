# 使用列表扩展集合

## 探索列表接口

`List` 接口为普通集合带来了两个新功能：
- 迭代列表元素的顺序始终相同，并遵循元素添加到此列表的顺序。
- 列表的元素具有索引。

## 选择列表接口的实现
虽然 `Collection` 接口在集合框架中没有特定的实现（它依赖于其子接口的实现），但 `List` 接口有两种实现：`ArrayList` 和 `LinkedList`。正如您可能猜测的，前者建立在内部数组上，后者建立在双向链表上。

这两种实现中哪一种更好？如果您不确定选择哪一个，那么您的最佳选择可能是 `ArrayList`。

在60年代计算机发明时对链表的真实情况已经不再成立，链表在插入和删除操作上胜过数组的能力在现代硬件、CPU缓存和指针追踪方面大大减弱。遍历 `ArrayList` 中的元素比遍历 `LinkedList` 中的元素要快得多，主要原因是指针追踪和CPU缓存未命中。

仍然有链表比数组更快的情况。双向链表可以比 `ArrayList` 更快地访问其第一个和最后一个元素。这是使 `LinkedList` 比 `ArrayList` 更好的主要用例。因此，如果您的应用程序需要一个后进先出（LIFO，本教程后面将涵盖）栈，或者一个先进先出（FIFO，也将在后面涵盖）等待队列，那么选择链表可能是您的最佳选择。

另一方面，如果您计划迭代列表的元素，或者通过它们的索引随机访问它们，那么 `ArrayList` 可能是您最好的选择。

## 使用索引访问元素
`List` 接口为 `Collection` 接口带来了几个处理索引的方法。

### 访问单个对象
- `add(index, element)`: 在 `index` 处插入给定的对象，如果有剩余元素则调整索引
- `get(index)`: 返回给定 `index` 处的对象
- `set(index, element)`: 用新元素替换给定索引处的元素
- `remove(index)`: 移除给定 `index` 处的元素，调整剩余元素的索引

调用这些方法只对有效索引有效。如果给定的索引无效，则会抛出 `IndexOutOfBoundsException` 异常。

### 查找对象的索引
方法 `indexOf(element)` 和 `lastIndexOf(element)` 返回列表中给定元素的索引，或如果找不到元素则返回 -1。

### 获取子列表
`subList(start, end)` 返回一个列表，由索引 `start` 和 `end - 1` 之间的元素组成。如果索引无效，则会抛出 `IndexOutOfBoundsException` 异常。

请注意，返回的列表是主列表的视图。因此，对子列表的任何修改都会反映在主列表上，反之亦然。

例如，您可以使用以下模式清除列表的一部分内容：

```java
List<String> strings = new ArrayList<>(List.of("0", "1", "2", "3", "4", "5"));
System.out.println(strings);
strings.subList(2, 5).clear();
System.out.println(strings);
```

运行此代码将给出以下结果：

```
[0, 1, 2, 3, 4, 5]
[0, 1, 5]
```

### 插入集合
此列表的最后一个模式是关于在给定索引处插入集合：`addAll(int index, Collection collection)`。

## 对列表元素进行排序
列表保持其元素的已知顺序。这是它与普通集合的主要区别。因此，对列表元素进行排序是有意义的。这就是为什么在 JDK 8 中 `List` 接口添加了 `sort()` 方法的原因。

在 Java SE 7 及更早版本中，您可以通过调用 `Collections.sort()` 并传递您的列表作为参数（如果需要，还可以传递比较器）来对 `List` 的元素进行排序。

从 Java SE 8 开始，您可以直接在列表上调用 `sort()` 并传递您的比较器作为参数。此方法没有不接受任何参数的重载。如果使用 null 比较器调用它，将假定您的 `List` 中的元素实现了 `Comparable`，如果情况不是这样，您将得到一个 `ClassCastException`。

如果您不喜欢调用带有 null 参数的方法（您是对的！），您仍然可以使用 `Comparator.naturalOrder()` 调用它以获得相同的结果。

## 迭代列表的元素
`List` 接口为您提供了一种更多的方式来迭代其元素，使用 `ListIterator`。您可以通过调用 `listIterator()` 获得这样的迭代器。您可以不带参数调用此方法，或者传递一个整数索引给它。在这种情况下，迭代将从该索引开始。

`ListIterator` 接口扩展了您已经知道的常规 `Iterator`。它添加了几个方法。

- `hasPrevious()` 和 `previous()`：以降序而不是升序迭代
- `nextIndex()` 和 `previousIndex()`：获取将由下一个 `next()` 调用或下一个 `previous()` 调用返回的元素的索引
- `set(element)`：更新由 `next()` 或 `previous()` 返回的最后一个元素。如果在该迭代器上没有调用这些方法，则会引发 `IllegalStateException`。

让我们看看这个 `set()` 方法的实际应用：

```java
List<String> numbers = Arrays.asList("one", "two", "three");
for (ListIterator<String> iterator = numbers.listIterator(); iterator.hasNext();) {
    String nextElement = iterator.next();
    if (Objects.equals(nextElement, "two")) {
        iterator.set("2");
    }
}
System.out.println("numbers = " + numbers);
```

运行此代码将给出以下结果：

```
numbers = [one, 2, three]
```


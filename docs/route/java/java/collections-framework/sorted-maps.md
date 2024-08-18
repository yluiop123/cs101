# 使用SortedMap和NavigableMap保持键的排序

## SortedMap添加的方法

JDK提供了`Map`接口的两个扩展：`SortedMap`和`NavigableMap`。`NavigableMap`是`SortedMap`的扩展。这两个接口都由同一个类`TreeMap`实现。`TreeMap`类是一个红黑树，这是一个众所周知的数据结构。

`SortedMap`和`NavigableMap`通过键对其键值对进行排序。和`SortedSet`与`NavigableSet`一样，您需要提供一种比较键的方法。您有两种解决方案：要么键的类实现`Comparable`，要么在创建`TreeMap`时为您的键提供一个`Comparator`。如果您提供了`Comparator`，即使您的键是可比较的，也会使用它。

如果您选择的`SortedMap`或`NavigableMap`实现是`TreeMap`，那么您可以安全地将`keySet()`或`entrySet()`调用返回的集合转换为`SortedSet`或`NavigableSet`。`NavigableMap`有一个方法`navigableKeySet()`，返回一个您可以使用的`NavigableSet`实例，而不是简单的`keySet()`方法。这两种方法返回相同的对象。

`SortedMap`接口向`Map`添加了以下方法：

- `firstKey()`和`lastKey()`：返回映射中最低和最高的键；
- `headMap(toKey)`和`tailMap(fromKey)`：返回一个`SortedMap`，其键严格小于`toKey`，或大于等于`fromKey`；
- `subMap(fromKey, toKey)`：返回一个`SortedMap`，其键严格小于`toKey`，或大于等于`fromKey`。

这些映射是`SortedMap`的实例，并由这个映射支持的视图。对这个映射所做的任何更改都会在这些视图中看到。这些视图可以更新，但有一个限制：您不能在构建的映射边界之外插入键。

您可以在以下示例中看到这种行为：

```java
SortedMap<Integer, String> map = new TreeMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.put(5, "five");
map.put(6, "six");

SortedMap<Integer, String> headMap = map.headMap(3);
headMap.put(0, "zero"); // 这行是OK的
headMap.put(4, "four"); // 这行会抛出IllegalArgumentException
```

## NavigableMap添加的方法

### 访问特定键或条目

`NavigableMap`在`SortedMap`的基础上添加了更多方法。第一组方法允许您访问映射中的特定键和条目。

- `firstKey()`, `firstEntry()`, `lastEntry()`, 和 `lastKey()`：返回此映射中最低或最高的键或条目。
- `ceilingKey(key)`, `ceilingEntry(key)`, `higherKey(key)`, `higherEntry(key)`：返回大于提供键的最低键或条目。`ceiling`方法可能返回等于提供键的键，而`higher`方法返回的键严格大于提供键。
- `floorKey(key)`, `floorEntry(key)`, `lowerKey(key)`, `lowerEntry(key)`：返回小于提供键的最高键或条目。`floor`方法可能返回等于提供键的键，而`lower`方法返回的键严格小于提供键。

### 使用类似队列的功能访问映射

第二组为您提供类似队列的功能：

- `pollFirstEntry()`：返回并移除最低条目。
- `pollLastEntry()`：返回并移除最高条目。

### 以相反顺序遍历映射

第三组将您的映射反转，就好像它是根据相反的比较逻辑构建的一样。

- `navigableKeySet()`是一个便捷方法，返回一个`NavigableSet`，以便您不必转换`keySet()`的结果。
- `descendingKeySet()`：返回一个由映射支持的`NavigableSet`，您可以按降序迭代。
- `descendingMap()`：返回具有相同语义的`NavigableMap`。

这两个视图都支持元素的移除，但您不能通过它们添加任何内容。

以下是一个示例，演示了如何使用它们。

```java
NavigableMap<Integer, String> map = new TreeMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.put(4, "four");
map.put(5, "five");

map.keySet().forEach(key -> System.out.print(key + " "));
System.out.println();

NavigableSet<Integer> descendingKeys = map.descendingKeySet();
descendingKeys.forEach(key -> System.out.print(key + " "));
```

运行此代码将打印出以下结果。

```
1 2 3 4 5
5 4 3 2 1
```

### 获取子映射视图

最后一组方法允许您访问映射部分的视图。

- `subMap(fromKey, fromInclusive, toKey, toInclusive)`：返回一个子映射，您可以决定是否包括边界。
- `headMap(toKey, inclusive)`：对头部映射相同。
- `tailMap(fromKey, inclusive)`：对尾部映射相同。

这些映射是此映射的视图，您可以通过添加或删除键值对来更新它们。但添加元素有一个限制：您不能在视图创建的边界之外添加键。



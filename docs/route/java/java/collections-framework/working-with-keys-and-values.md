# 管理Map的内容

## 向映Map中添加键值对
您可以使用 `put(key, value)` 简单地向映射中添加键值对。如果映射中尚未存在该键，则将键值对简单地添加到映射中。如果存在，则用新的值替换现有值。
在两种情况下，`put()` 方法都会返回当前绑定到键的现有值。这意味着如果是一个新的键，调用 `put()` 将返回 null。

Java SE 8 引入了 `putIfAbsent()` 方法。此方法也可以向映射中添加键值对，但仅当键尚未存在且未与 null 值关联时。这可能一开始有点令人困惑，但 `putIfAbsent()` 将用新值替换 null 值。

如果您需要清除映射中的空值，这个方法非常有用。例如，以下代码将因尝试自动拆箱 null `Integer` 到 `int` 值而失败，并抛出 `NullPointerException`。

```java
Map<String, Integer> map = new HashMap<>();

map.put("one", 1);
map.put("two", null);
map.put("three", 3);
map.put("four", null);
map.put("five", 5);

for (int value : map.values()) {
    System.out.println("value = " + value);
}
```

仔细观察这段代码，您会发现 `map.values()` 是一个 `Collection<Integer>`。因此，迭代此集合会产生 `Integer` 的实例。因为您将 `value` 声明为 `int` 类型，编译器会自动将此 `Integer` 自动拆箱为 `int` 值。如果 `Integer` 的实例为 null，该机制将失败并抛出 `NullPointerException`。

您可以使用以下代码修复此映射，用默认值 `-1` 替换有问题的 null 值，这样就不会再产生任何 `NullPointerException`。

```java
for (String key : map.keySet()) {
    map.putIfAbsent(key, -1);
}
```

运行前面的代码将打印出以下结果。如您所见，此映射不再包含任何 null 值：

```
value = -1
value = 1
value = -1
value = 3
value = 5
```

## 从键中获取值
您可以通过调用 `get(key)` 方法简单地获取给定键绑定的值。

Java SE 8 引入了 `getOrDefault()` 方法，该方法采用一个键和一个默认值，如果映射中没有该键，则返回默认值。

让我们通过一个示例看看这个方法的实际应用：

```java
Map<Integer, String> map = new HashMap<>();

map.put(1, "one");
map.put(2, "two");
map.put(3, "three");

List<String> values = new ArrayList<>();
for (int key = 0; key < 5; key++) {
    values.add(map.getOrDefault(key, "UNDEFINED"));
}

System.out.println("values = " + values);
```

或者，如果您熟悉流（本教程后面将介绍）：

```java
List<String> values =
    IntStream.range(0, 5)
        .mapToObj(key -> map.getOrDefault(key, "UNDEFINED"))
        .collect(Collectors.toList());

System.out.println("values = " + values);
```

两种代码都会打印出相同的结果：

```
values = [UNDEFINED, one, two, three, UNDEFINED]
```

## 从映射中移除键
通过调用 `remove(key)` 方法来移除键值对。此方法返回绑定到该键的值，因此可能会返回 `null`。

如果您不确定映射中绑定到该键的值，盲目地从映射中移除键值对可能是有风险的。因此，Java SE 8 添加了一个重载版本，它接受一个值作为第二个参数。这一次，只有当键值对完全匹配映射中的键值对时，才会移除键值对。

这个 `remove(key, value)` 方法返回一个布尔值，如果键值对已从映射中移除，则返回 `true`。

## 检查键或值的存在
您有两种方法来检查给定键或给定值的存在：`containsKey(key)` 和 `containsValue(value)`。如果映射包含给定的键或值，这两种方法都返回 `true`。

## 检查映射的内容
`Map` 接口还提供了一些看起来与 `Collection` 接口中的方法相似的方法。这些方法不言自明：`isEmpty()` 对于空映射返回 `true`，`size()` 返回键值对的数量，`clear()` 移除映射中的所有内容。

还有一个方法可以将给定映射的内容添加到当前映射中：`putAll(otherMap)`。如果两个映射中都存在一些键，则 `otherMap` 的值将覆盖这个映射的值。

## 获取映射的键、值或条目的视图
您也可以在映射上获取不同的集合。

- `keySet()`: 返回一个 `Set` 实例，包含映射中定义的键
- `entrySet()`: 返回一个 `Set<Map.Entry>` 实例，包含映射中包含的键值对
- `values()`: 返回一个 `Collection` 实例，包含映射中存在的值

以下示例展示了这三种方法的应用：

```java
Map<Integer, String> map = new HashMap<>();

map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.put(4, "four");
map.put(5, "five");
map.put(6, "six");

Set<Integer> keys = map.keySet();
System.out.println("keys = " + keys);

Collection<String> values = map.values();
System.out.println("values = " + values);

Set<Map.Entry<Integer, String>> entries = map.entrySet();
System.out.println("entries = " + entries);
```

运行此代码将产生以下结果：

```
keys = [1, 2, 3, 4, 5, 6]
values = [one, two, three, four, five, six]
entries = [1=one, 2=two, 3=three, 4=four, 5=five, 6=six]
```

这些集合是由当前映射支持的 _视图_。对映射的任何更改都会反映在这些视图中。

### 从键集合中移除键
修改这些集合也会反映在映射中：例如，从 `keySet()` 返回的集合中移除键将从映射中移除相应的键值对。

您可以在前面的映射上运行此代码：

```java
keys.remove(3);
entries.forEach(System.out::println);
```

它将产生以下结果：

```
1=one
2=two
4=four
5=five
6=six
```

### 从值集合中移除值
移除值并不那么简单，因为在映射中一个值可能会多次出现。在这种情况下，从值集合中移除值只会移除第一个匹配的键值对。

您可以在以下示例中看到这一点。

```java
Map<Integer, String> map =
    Map.ofEntries(
        Map.entry(1, "one"),
        Map.entry(2, "two"),
        Map.entry(3, "three"),
        Map.entry(4, "three")
    );
System.out.println("map before = " + map);
map = new HashMap<>(map);
map.values().remove("three");
System.out.println("map after = " + map);
```

运行此代码将产生以下结果。

```
map before = {1=one, 2=two, 3=three, 4=three}
map after  = {1=one, 2=two, 4=three}
```

如您所见，此示例中仅移除了第一个键值对。在这种情况下您需要小心，因为如果您选择的实现是 `HashMap`，则无法提前知道将找到哪个键值对。

尽管如此，您并不能访问这些集合的所有操作。例如，您不能向键集合或值集合中添加元素。如果您尝试这样做，将得到一个 `UnsupportedOperationException`。

如果您需要迭代映射的键值对，那么您最好的选择是直接在键值对集合上迭代。这样做比迭代键集合并获取相应的值要高效得多。您可以使用的最佳模式如下：

```java
for (Map.Entry<Integer, String> entry : map.entrySet()) {
    System.out.println("entry = " + entry);
}
```


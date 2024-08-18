# 使用Lambda表达式处理映射值

## 消费映射的内容
`Map` 接口有一个 `forEach()` 方法，其工作方式与 `Iterable` 接口上的 `forEach()` 方法相同。不同之处在于这个 `forEach()` 方法接受一个 `BiConsumer` 作为参数，而不是一个简单的 `Consumer`。

让我们创建一个简单的映射并打印其内容。
```java
Map<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");

map.forEach((key, value) -> System.out.println(key + " :: " + value));
```
这段代码产生了以下结果：
```
1 :: one
2 :: two
3 :: three
```

## 替换值
`Map` 接口为您提供了三种方法，将绑定到键的值替换为另一个值。

第一种是 `replace(key, value)`，它盲目地用新值替换现有值。这相当于一个 put-if-present 操作。此方法返回从映射中移除的值。

如果您需要更精细的控制，那么您可以使用这个方法的重载，它接受现有值作为参数：`replace(key, existingValue, newValue)`。在这种情况下，只有当现有值与新值匹配时，才替换现有值。如果替换发生，此方法返回 `true`。

`Map` 接口还有一个方法，使用 `BiFunction` 替换您映射中的所有值。这个 `BiFunction` 是一个重映射函数，它接受键和值作为参数，并返回一个新值，该新值将替换现有值。调用此方法将在内部遍历您映射的所有键/值对。

以下示例展示了如何使用这个 `replaceAll()` 方法：
```java
Map<Integer, String> map = new HashMap<>();

map.put(1, "one");
map.put(2, "two");
map.put(3, "three");

map.replaceAll((key, value) -> value.toUpperCase());
map.forEach((key, value) -> System.out.println(key + " :: " + value));
```
运行此代码产生了以下结果：
```
1 :: ONE
2 :: TWO
3 :: THREE
```

## 计算值
`Map` 接口为您提供了第三种模式，以添加键值对到映射中或修改映射的现有值，形式为三种方法：`compute()`、`computeIfPresent()` 和 `computeIfAbsent()`。

这三种方法接受以下参数：

- 进行计算的键
- 绑定到该键的值，在 `compute()` 和 `computeIfPresent()` 的情况下
- 一个 `BiFunction`，充当重映射函数，或在 `computeIfAbsent()` 的情况下作为一个映射函数

在 `compute()` 的情况下，重映射双函数将使用两个参数调用。第一个是键，第二个是现有值（如果有的话），或者如果没有则为 `null`。您的重映射双函数可以被调用并传入一个 null 值。

对于 `computeIfPresent()`，如果该键绑定了一个非 null 值，并且如果它不是 null，则调用重映射函数。如果键绑定了一个 null 值，则不调用重映射函数。您的重映射函数不能被调用并传入一个 null 值。

对于 `computeIfAbsent()`，因为没有值绑定到该键，重映射函数实际上是一个简单的 `Function`，它接受键作为参数。如果键不在映射中或绑定到一个 null 值，则调用此函数。

在所有情况下，如果您的双函数（或函数）返回一个 null 值，则从映射中移除该键：不为此键创建映射。使用这三种方法之一不能将带有 null 值的键/值对放入映射中。

在所有情况下，返回的值是映射中绑定到该键的新值，如果重映射函数返回 null，则为 null。值得一提的是，这种语义与 `put()` 方法不同。`put()` 方法返回先前的值，而 `compute()` 方法返回新值。

`computeIfAbsent()` 方法的一个非常有趣的用例是使用列表作为值创建映射。假设您有以下字符串列表：`[one two three four five six seven]`。您需要创建一个映射，其中键是该列表中单词的长度，值是这些单词的列表。您需要创建的映射如下：
```
3 :: [one, two, six]
4 :: [four, five]
5 :: [three, seven]
```

如果没有 `compute()` 方法，您可能会这样编写：
```java
List<String> strings = List.of("one", "two", "three", "four", "five", "six", "seven");
Map<Integer, List<String>> map = new HashMap<>();
for (String word: strings) {
    int length = word.length();
    if (!map.containsKey(length)) {
        map.put(length, new ArrayList<>());
    }
    map.get(length).add(word);
}

map.forEach((key, value) -> System.out.println(key + " :: " + value));
```
运行此代码产生了预期的结果：
```
3 :: [one, two, six]
4 :: [four, five]
5 :: [three, seven]
```

顺便说一下，您可以使用 `putIfAbsent()` 来简化这个 for 循环：
```java
for (String word: strings) {
    int length = word.length();
    map.putIfAbsent(length, new ArrayList<>());
    map.get(length).add(word);
}
```

但是使用 `computeIfAbsent()` 可以使这段代码更好：
```java
for (String word: strings) {
    int length = word.length();
    map.computeIfAbsent(length, key -> new ArrayList<>()).add(word);
}
```
这段代码的工作原理是什么？
- 如果键不在映射中，则调用映射函数，该函数创建一个空列表。这个空列表是由 `computeIfAbsent()` 方法返回的。这是代码添加 `word` 的空列表。
- 如果键在映射中，不调用映射函数，并返回当前绑定到该键的值。这是您需要添加 `word` 的部分填充的列表。

这段代码比 `putIfAbsent()` 的效率更高，主要是因为在这种情况下，只有在需要时才创建空列表。`putIfAbsent()` 调用需要一个现有的空列表，仅当键不在映射中时才使用。在您需要按需创建添加到映射中的对象的情况下，使用 `computeIfAbsent()` 应该比 `putIfAbsent()` 更受青睐。

## 合并值
如果映射的值是其他值的聚合，则 `computeIfAbsent()` 模式效果很好。但是，支持此聚合的结构有一个限制：它必须是可变的。这是 `ArrayList` 的情况，也是您编写的代码所做的：它将您的值添加到 `ArrayList` 中。

而不是创建单词列表，假设您需要创建单词的连接。在这里，`String` 类被视为其他字符串的聚合，但它不是一个可变容器：您不能使用 `computeIfAbsent()` 模式来实现这一点。

这就是 `merge()` 模式发挥作用的地方。`merge()` 方法接受三个参数：
- 一个键
- 一个值，您需要将该值绑定到该键
- 一个重映射 `BiFunction`。

如果键不在映射中或绑定到一个 null 值，则将该值绑定到该键。在这种情况下不调用重映射函数。

相反，如果键已经绑定到一个非 null 值，则调用重映射函数，传入现有值和新值作为参数。如果这个重映射函数返回 null，则从映射中移除该键。否则，它产生的值将绑定到该键。

您可以在以下示例中看到这种 `merge()` 模式的实际应用：
```java
List<String> strings = List.of("one", "two", "three", "four", "five", "six", "seven");
Map<Integer, String> map = new HashMap<>();
for (String word: strings) {
    int length = word.length();
    map.merge(length, word,
              (existingValue, newWord) -> existingValue + ", " + newWord);
}

map.forEach((key, value) -> System.out.println(key + " :: " + value));
```
在这种情况下，如果 `length` 键不在映射中，则 `merge()` 调用只是添加它并将其绑定到 `word`。另一方面，如果 `length` 键已经在映射中，则使用现有值和 `word` 调用双函数。然后双函数的结果替换当前值。

运行此代码产生了以下结果：
```
3 :: one, two, six
4 :: four, five
5 :: three, seven
```

在 `computeIfAbsent()` 和 `merge()` 这两种模式中，您可能会想知道为什么创建的 lambda 接受一个在 lambda 上下文中始终可用并且可以从该上下文中捕获的参数。答案是：出于性能原因，您应该优先选择非捕获 lambda 而不是捕获 lambda。


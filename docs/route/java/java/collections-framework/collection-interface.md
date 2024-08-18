# 在集合中存储元素
## 探索集合接口

你需要了解的第一个接口是 `Collection` 接口。它模拟了一个简单的集合，可以存储元素，并提供了不同的方法来检索它们。

如果你想在这部分运行示例，你需要知道如何创建一个集合。我们还没有涵盖 `ArrayList` 类，我们将在稍后进行。

## 处理单个元素的方法

让我们从存储和从集合中删除一个元素开始。涉及的两个方法是 `add()` 和 `remove()`。

- `add(element)`: 在集合中添加一个元素。如果操作失败，此方法返回一个布尔值。你在介绍中看到，对于 `List` 它不应该失败，而对于 `Set` 它可能会失败，因为集合不允许重复项。
- `remove(element)`: 从集合中移除给定的元素。此方法也返回一个布尔值，因为操作可能会失败。例如，当请求删除的项目不在集合中时，删除可能会失败。

你可以运行以下示例。在这里，你使用 `ArrayList` 实现创建了 `Collection` 接口的实例。使用的泛型告诉Java编译器你想要在这个集合中存储 `String` 对象。`ArrayList` 不是你可以使用的唯一 `Collection` 实现。稍后会有更多的讨论。

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
System.out.println("strings = " + strings);
strings.remove("one");
System.out.println("strings = " + strings);
```

运行前面的代码应该打印出以下内容：

```
strings = [one, two]
strings = [two]
```

你可以使用 `contains()` 方法检查集合中是否存在一个元素。注意，你可以检查任何类型元素的存在。例如，在 `String` 集合中检查 `User` 对象的存在是有效的。这可能看起来很奇怪，因为这种检查返回 `true` 的机会很小，但编译器允许这样做。如果你使用IDE来测试这段代码，你的IDE可能会警告你在 `String` 对象的集合中测试 `User` 对象的存在。

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
if (strings.contains("one")) {
    System.out.println("one is here");
}
if (!strings.contains("three")) {
    System.out.println("three is not here");
}

User rebecca = new User("Rebecca");
if (!strings.contains(rebecca)) {
    System.out.println("Rebecca is not here");
}
```

运行这段代码会产生以下结果：

```
one is here
three is not here
Rebecca is not here
```

## 处理其他集合的方法

你看到的第一组方法允许你处理单个元素。

有四个这样的方法：`containsAll()`、`addAll()`、`removeAll()` 和 `retainAll()`。它们定义了对象集合上的四个基本操作。

- `containsAll()`: 定义了包含
- `addAll()`: 定义了联合
- `removeAll()`: 定义了补集
- `retainAll()`: 定义了交集

第一个非常简单：`containsAll()` 接受另一个集合作为参数，并返回 `true` 如果这个集合包含了另一个集合的所有元素。作为参数传递的集合不必与此集合类型相同：询问 `String` 类型的集合 `Collection<String>` 是否包含在 `User` 类型的集合 `Collection<User>` 中是合法的。

以下是使用此方法的示例：

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
strings.add("three");

Collection<String> first = new ArrayList<>();
first.add("one");
first.add("two");

Collection<String> second = new ArrayList<>();
second.add("one");
second.add("four");

System.out.println("Is first contained in strings? " + strings.containsAll(first));
System.out.println("Is second contained in strings? " + strings.containsAll(second));
```

运行此代码会产生以下结果：

```
Is first contained in strings? true
Is second contained in strings? false
```

第二个是 `addAll()`。它允许你将给定集合的所有元素添加到此集合中。与 `add()` 方法一样，在某些情况下，这可能会失败。此方法返回 `true` 如果此集合已被此调用修改。这是一个重要的理解点：得到 `true` 值并不意味着另一个集合的所有元素都已添加；这意味着至少添加了一个。

你可以在以下示例中看到 `addAll()` 的使用：

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
strings.add("three");

Collection<String> first = new ArrayList<>();
first.add("one");
first.add("four");

boolean hasChanged = strings.addAll(first);

System.out.println("Has strings changed? " + hasChanged);
System.out.println("strings = " + strings);
```

运行此代码会产生以下结果：

```
Has strings changed? true
strings = [one, two, three, one, four]
```

你需要意识到，如果你更改 `Collection` 的实现，运行此代码将产生不同的结果。这个结果代表 `ArrayList`，正如你将在下面看到的，它对于 `HashSet` 来说不会是相同的。

第三个是 `removeAll()`。它从这个集合中移除所有包含在另一个集合中的元素。正如 `contains()` 或 `remove()` 的情况一样，另一个集合可以定义在任何类型上；它不必与此集合的类型兼容。

你可以在以下示例中看到 `removeAll()` 的使用：

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
strings.add("three");

Collection<String> toBeRemoved = new ArrayList<>();
toBeRemoved.add("one");
toBeRemoved.add("four");

boolean hasChanged = strings.removeAll(toBeRemoved);

System.out.println("Has strings changed? " + hasChanged);
System.out.println("strings = " + strings);
```

运行此代码会产生以下结果：

```
Has strings changed? true
strings = [two, three]
```

最后一个是 `retainAll()`。此操作仅保留此集合中包含在另一个集合中的元素；其他所有元素都被移除。再次，正如 `contains()` 或 `remove()` 的情况一样，另一个集合可以定义在任何类型上。

你可以在以下示例中看到 `retainAll()` 的使用：

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
strings.add("three");

Collection<String> toBeRetained = new ArrayList<>();
toBeRetained.add("one");
toBeRetained.add("four");

boolean hasChanged = strings.retainAll(toBeRetained);

System.out.println("Has strings changed? " + hasChanged);
System.out.println("strings = " + strings);
```

运行此代码会产生以下结果：

```
Has strings changed? true
strings = [one]
```

## 处理集合本身的其他方法

然后，最后一批方法处理的是集合本身。

你有两种方法来检查集合的内容。

- `size()`: 以 `int` 类型返回集合中的元素数量。
- `isEmpty()`: 告诉你给定的集合是否为空。

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
if (!strings.isEmpty()) {
    System.out.println("Indeed strings is not empty!");
}
System.out.println("The number of elements in strings is " + strings.size());
```

运行此代码会产生以下结果：

```
Indeed strings is not empty!
The number of elements in strings is 2
```

然后你可以通过简单地调用 `clear()` 来删除集合的内容。

```
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
System.out.println("The number of elements in strings is " + strings.size());
strings.clear();
System.out.println("After clearing it, this number is now " + strings.size());
```

运行此代码会产生以下结果：

```
The number of elements in strings is 2
After clearing it, this number is now 0
```

## 获取集合元素的数组

即使在应用程序中将元素存储在集合中可能比将它们放在数组中更有意义，但仍有情况下你需要将它们获取为数组。

`Collection` 接口为您提供了三种模式，以三种重载的 `toArray()` 方法的形式，将集合的元素获取为数组。

第一种是一个简单的 `toArray()` 调用，没有参数。这将以普通对象数组的形式返回你的元素。

这可能不是你所需要的。如果你有一个 `Collection<String>`，你可能更希望得到一个 `String` 数组。你仍然可以将 `Object[]` 强制转换为 `String[]`，但没有保证这种转换在运行时不会失败。如果你需要类型安全，那么你可以调用以下任一方法。

- `toArray(T[] tab)` 返回 `T[]` 类型的数组：`T[]`
- `toArray(IntFunction<T[]> generator)`，以不同的语法返回相同的类型。

最后两种模式之间有什么区别？第一种是可读性。创建 `IntFunction<T[]>` 的实例一开始可能看起来很奇怪，但使用方法引用编写它实际上是非常简单的。

以下是第一种模式。在这种模式中，你需要传递一个相应类型的数组。

```
Collection<String> strings = ...; // 假设该集合中有15个元素

String[] tabString1 = strings.toArray(new String[] {});
// 你可以传递一个空数组
String[] tabString2 = strings.toArray(new String[15]);   // 或一个正确大小的数组
```

作为参数传递的这个数组有什么用？如果它足够大以容纳集合中的所有元素，那么这些元素将被复制到数组中，并返回。如果数组中有更多的空间，那么数组中第一个未使用的单元格将被设置为 null。如果你传递的数组太小，那么将创建一个正确大小的新数组来容纳集合的元素。

以下是这种模式的使用示例：

```
Collection<String> strings = List.of("one", "two");

String[] largerTab = {"three", "three", "three", "I", "was", "there"};
System.out.println("largerTab = " + Arrays.toString(largerTab));

String[] result = strings.toArray(largerTab);
System.out.println("result = " + Arrays.toString(result));

System.out.println("Same arrays? " + (result == largerTab));
```

运行前面的代码将给你：

```
largerTab = [three, three, three, I, was, there]
result = [one, two, null, I, was, there]
Same arrays? true
```

你可以看到数组被复制到了参数数组的第一个单元格中，并且在它之后添加了 `null`，因此保留了这个数组的最后元素。返回的数组与你作为参数给出的数组相同，但内容不同。

这里是使用零长度数组的第二个示例：

```
Collection<String> strings = List.of("one", "two");

String[] zeroLengthTab = {};
String[] result = strings.toArray(zeroLengthTab);

System.out.println("zeroLengthTab = " + Arrays.toString(zeroLengthTab));
System.out.println("result = " + Arrays.toString(result));
```

运行此代码将给你以下结果：

```
zeroLengthTab = []
result = [one, two]
```

在这种情况下创建了一个新的数组。

第二种模式使用构造函数方法引用实现 `IntFunction<T[]>`：

```
Collection<String> strings = ...;

String[] tabString3 = strings.toArray(String[]::new);
```

在这种情况下，使用这个函数创建了一个零长度的正确类型的数组，然后这个方法将这个数组作为参数调用 `toArray()`。

这种代码模式是在 JDK 8 中添加的，以提高 `toArray()` 调用的可读性。

## 使用谓词过滤集合中的元素

Java SE 8 为 `Collection` 接口添加了一个新特性：使用谓词过滤集合中的元素的可能性。

假设你有一个 `List<String>` 并且你需要移除所有的空字符串、空字符串和长度超过5个字符的字符串。在 Java SE 7 和更早版本中，你可以使用 `Iterator.remove()` 方法来实现这一点，在 `if` 语句中调用它。你将看到这种模式以及 `Iterator` 接口。有了 `removeIf()`，你的代码变得更加简单：

```
Predicate<String> isNull = Objects::isNull;
Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNullOrEmpty = isNull.or(isEmpty);

Collection<String> strings = new ArrayList<>();
strings.add(null);
strings.add("");
strings.add("one");
strings.add("two");
strings.add("");
strings.add("three");
strings.add(null);

System.out.println("strings = " + strings);
strings.removeIf(isNullOrEmpty);
System.out.println("filtered strings = " + strings);
```

运行此代码会产生以下结果：

```
strings = [null, , one, two, , three, null]
filtered strings = [one, two, three]
```

再次，使用这种方法将大大提高你的应用程序代码的可读性和表现力。

## 为集合接口选择实现

在所有这些示例中，我们使用 `ArrayList` 来实现 `Collection` 接口。

事实是：集合框架没有提供 `Collection` 接口的直接实现。`ArrayList` 实现了 `List`，并且因为 `List` 扩展了 `Collection`，它也实现了 `Collection`。

如果你决定使用 `Collection` 接口来模拟你的应用程序中的集合，那么将 `ArrayList` 作为你的默认实现通常是你的最佳选择。你将在本教程后面的部分看到更多关于选择正确实现的讨论。



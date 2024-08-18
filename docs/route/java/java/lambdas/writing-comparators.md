# 编写和组合比较器

## 使用Lambda表达式实现Comparator
由于函数式接口的定义，早在JDK 2中引入的`Comparator<T>`接口变得功能化。因此，可以使用Lambda表达式实现比较器。

这是`Comparator<T>`接口的唯一抽象方法：

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

比较器的约定如下：

- 如果`o1 < o2`，则`compare(o1, o2)`应该返回一个负数。
- 如果`o1 > o2`，则`compare(o1, o2)`应该返回一个正数。
- 在所有情况下，`compare(o1, o2)`和`compare(o2, o1)`应该有相反的符号。

当`o1.equals(o2)`为真时，比较`o1`和`o2`返回0并不是_严格_要求的。

如何创建一个整数比较器，实现自然顺序？你可以直接使用本教程开头看到的方法：

```java
Comparator<Integer> comparator = (i1, i2) -> Integer.compare(i1, i2);
```

你可能已经注意到，这个Lambda表达式也可以用一个非常优雅的方法引用来写：

```java
Comparator<Integer> comparator = Integer::compare;
```

> 避免使用`(i1 - i2)`实现此比较器。即使这种模式看起来有效，但在某些边缘情况下它不会产生正确的结果。

这个模式可以扩展到你需要比较的任何内容，只要你遵守比较器的约定。

`Comparator` API更进一步，提供了一个非常有用的API，以更易读的方式创建比较器。

## 使用工厂方法创建比较器
假设你需要创建一个比较器，以非自然的方式比较字符串：最短的字符串小于最长的字符串。

这样的比较器可以这样写：

```java
Comparator<String> comparator = (s1, s2) -> Integer.compare(s1.length(), s2.length());
```

你在前一部分学到，可以链接和组合Lambda表达式。这段代码是这种组合的另一个例子。实际上，你可以这样重写它：

```java
Function<String, Integer> toLength = String::length;
Comparator<String> comparator = 
        (s1, s2) -> Integer.compare(
                toLength.apply(s1), 
                toLength.apply(s2));
```

现在你可以看到，这个`Comparator`的代码只依赖于称为`toLength`的`Function`。因此，可以创建一个工厂方法，它将这个函数作为参数并返回相应的`Comparator<String>`。

`toLength`函数的返回类型仍然有一个约束：它必须是可比较的。在这里它工作得很好，因为你总是可以用自然顺序比较整数，但你需要记住这一点。

JDK中确实存在这样一个工厂方法：它直接被添加到`Comparator`接口中。所以你可以这样写前面的代码：

```java
Comparator<String> comparator = Comparator.comparing(String::length);
```

这个`comparing()`方法是`Comparator`接口的静态方法。它接受一个`Function`作为参数，该函数应该返回一个`Comparable`的扩展类型。

假设你有一个`User`类，它有一个`getName()`获取器，你需要根据用户名对用户列表进行排序。你需要编写的代码如下：

```java
List<User> users = ...; // 这是你的列表
Comparator<User> byName = Comparator.comparing(User::getName);
users.sort(byName);
```

## 链接比较器
你所在的公司对`Comparable<User>`非常满意。但有一个新的需求在版本2中：`User`类现在有`firstName`和`lastName`，你需要产生一个新的`Comparator`来处理这个变化。

编写每个比较器遵循与前一个相同的模式：

```java
Comparator<User> byFirstName = Comparator.comparing(User::getFirstName);
Comparator<User> byLastName = Comparator.comparing(User::getLastName);
```

现在你需要一种方法将它们链接起来，就像你链接`Predicate`或`Consumer`的实例一样。比较器API为您提供了一个解决方案：

```java
Comparator<User> byFirstNameThenLastName =
        byFirstName.thenComparing(byLastName);
```

`thenComparing()`方法是`Comparator`接口的一个默认方法，它接受另一个比较器作为参数并返回一个新的比较器。当应用于两个用户时，比较器首先使用`byFirstName`比较器比较这些用户。如果结果是0，那么它将使用`byLastName`比较器比较它们。简而言之：它按预期工作。

比较器API更进一步：由于`byLastName`仅依赖于`User::getLastName`函数，所以在API中添加了一个`thenComparing()`方法的重载版本，它将这个函数作为参数。所以模式变为：

```java
Comparator<User> byFirstNameThenLastName =
        Comparator.comparing(User::getFirstName)
                  .thenComparing(User::getLastName);
```

有了Lambda表达式、方法引用、链接和组合，创建比较器从未如此简单！

## 专门的比较器
装箱和拆箱原始类型或比较器也可能发生，导致与`java.util.function`包的函数式接口相同的性能问题。为了解决这个问题，添加了`comparing()`工厂方法和`thenComparing()`默认方法的专门版本。

你还可以使用以下方式创建`Comparator<T>`的实例：

- `comparingInt(ToIntFunction<T> keyExtractor);`
- `comparingLong(ToLongFunction<T> keyExtractor);`
- `comparingDouble(ToDoubleFunction<T> keyExtractor)。`

如果你需要使用原始类型属性比较对象，并需要避免这种原始类型的装箱/拆箱，你可以使用这些方法。

还有对应链接`Comparator<T>`的方法：

- `thenComparingInt(ToIntFunction<T> keyExtractor);`
- `thenComparingLong(ToLongFunction<T> keyExtractor);`
- `thenComparingDouble(ToDoubleFunction<T> keyExtractor)。`

想法是一样的：使用这些方法，你可以链接一个比较器，该比较器建立在返回原始类型的专门函数上，而不会因为装箱/拆箱造成任何性能损失。

## 使用自然顺序比较可比较对象
本教程中有几个值得一提的工厂方法，它们将帮助你创建简单的比较器。

JDK中的许多类可能在你的应用程序中也实现了JDK的一个特殊接口：`Comparable<T>`接口。这个接口有一个方法：`compareTo(T other)`，返回一个`int`。这个方法用于将此`T`实例与`other`进行比较，遵循`Comparator<T>`接口的约定。

JDK的许多类已经实现了这个接口。所有原始类型的包装类（`Integer`、`Long`等），`String`类，以及日期和时间API的日期和时间类都是如此。

你可以使用它们的自然顺序比较这些类的实例，即，使用`compareTo()`方法。比较器API为您提供了一个`Comparator.naturalOrder()`工厂类。它构建的比较器正是这样做的：它使用`compareTo()`方法比较任何`Comparable`对象。

当你需要链接比较器时，有这样一个工厂方法非常有用。这里有一个例子，你想根据字符串的长度和自然顺序（这个例子使用静态导入`naturalOrder()`方法以进一步提高可读性）对字符串进行比较：

```java
Comparator<String> byLengthThenAlphabetically =
        Comparator.comparing(String::length)
                  .thenComparing(naturalOrder());
List<String> strings = Arrays.asList("one", "two", "three", "four", "five");
strings.sort(byLengthThenAlphabetically);
System.out.println(strings);
```

运行此代码将产生以下结果：

```
[one, two, five, four, three]
```

## 反转比较器
比较器的一个主要用途当然是对对象列表进行排序。JDK 8在`List`接口上增加了一个特别的方法：`List.sort()`。此方法接受一个比较器作为参数。

如果你需要按相反顺序排序前面的列表，你可以使用`Comparator`接口中很好的`reversed()`方法。

```java
List<String> strings = Arrays.asList("one", "two", "three", "four", "five");
strings.sort(byLengthThenAlphabetically.reversed());
System.out.println(strings);
```

运行此代码将产生以下结果：

```
[three, four, five, two, one]
```

## 处理空值
比较空对象可能会导致在运行代码时出现`NullPointerException`，这是你想避免的。

假设你需要编写一个对整数列表进行排序的空安全比较器。你决定遵循的约定是将所有空值推到列表的末尾，这意味着空值大于任何其他非空值。然后你希望按照自然顺序对非空值进行排序。

这是你可能编写的代码，以实现这种行为：

```java
Comparator<Integer> comparator = (i1, i2) -> {
    if (i1 == null && i2 != null) {
        return 1;
    } else if (i1 != null && i2 == null) {
        return -1;
    } else {
        return Integer.compare(i1, i2);
    }
};
```

你可以将这段代码与本部分开头编写的第一个比较器进行比较，看看可读性受到了多大的影响。

幸运的是，使用`Comparator`接口的另一个工厂方法，有更简单的方法来编写这个比较器。
```java
Comparator<Integer> naturalOrder = Comparator.naturalOrder();

Comparator<Integer> naturalOrderNullsLast =
        Comparator.nullsLast(naturalOrder);

```

`nullsLast()`及其兄弟方法`nullsFirst()`是`Comparator`接口的工厂方法。它们都接受一个比较器作为参数，并且只做一件事：为你处理空值，将它们推到末尾或放到排序列表的开头。

这里有一个例子：

```java
List<String> strings = Arrays.asList("one", null, "two", "three", null, null, "four", "five");
Comparator<String> naturalNullsLast =
        Comparator.nullsLast(naturalOrder());
strings.sort(naturalNullsLast);
System.out.println(strings);
```

运行此代码将产生以下结果：

```
[five, four, one, three, two, null, null, null]
```




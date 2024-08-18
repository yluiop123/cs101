# 在应用程序中使用Lambda表达式

Java SE 8中Lambda表达式的引入伴随着JDK API的重大重写。在Lambda引入之后，JDK 8中更新的类比JDK 5中泛型的引入还要多。

由于_函数式接口_的定义非常简单，许多现有接口在不需要修改的情况下就成为了_函数式_的。同样，对于您的现有代码：如果您的应用程序中有在Java SE 8之前编写的接口，它们可能不需要触摸就可以成为函数式的，使得可以使用Lambda来实现它们。

## 发现 `java.util.function` 包

JDK 8还引入了一个新的包：`java.util.function`，其中包含您可以在应用程序中使用的函数式接口。这些函数式接口也在JDK API中得到了广泛使用，特别是在集合框架和Stream API中。此包位于 `java.base` 模块中。

这个包含40多个接口的包一开始可能看起来有点吓人。事实证明，它是围绕四个主要接口组织的。理解它们为您提供了理解所有其他接口的关键。

## 使用 `Supplier<T>` 创建或提供对象

### 实现 `Supplier<T>` 接口

第一个接口是 `Supplier<T>` 接口。简而言之，供应商不接受任何参数并返回一个对象。

我们真的应该说：实现供应商接口的Lambda不接受任何参数并返回一个对象。走捷径可以使事情更容易记住，只要它们不会引起混淆。

这个接口非常简单：它没有默认或静态方法，只有一个简单的 `get()` 方法。这是这个接口：

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

以下Lambda是对这个接口的实现：

```java
Supplier<String> supplier = () -> "Hello Duke!";
```

这个Lambda表达式简单地返回 `Hello Duke!` 字符串。您也可以编写一个每次被调用时都返回一个新对象的供应商：

```java
Random random = new Random(314L);
Supplier<Integer> newRandom = () -> random.nextInt(10);

for (int index = 0; index < 5; index++) {
    System.out.println(newRandom.get() + " ");
}
```

调用这个供应商的 `get()` 方法将调用 `random.nextInt()`，并将产生随机整数。由于这个随机生成器的种子固定为值 `314L`，您应该看到以下随机整数生成：

```
1
5
3
0
2
```

注意，这个Lambda捕获了外围作用域中的变量：`random`，使这个变量成为 _实际上最终的_。

### 使用 `Supplier<T>`

注意您如何在前一个示例中使用 `newRandom` 供应商生成随机数：

```java
for (int index = 0; index < 5; index++) {
    System.out.println(newRandom.get() + " ");
}
```

调用 `Supplier` 接口的 `get()` 方法将调用您的Lambda。

### 使用专门的供应商

Lambda表达式用于处理应用程序中的数据。因此，Lambda表达式可以多快执行在JDK中至关重要。任何可以节省的CPU周期都必须被节省，因为它在实际应用程序中可能代表一个重要的优化。

按照这个原则，JDK API还提供了 `Supplier<T>` 接口的专门优化版本。

您可能已经注意到我们的第二个示例提供了 `Integer` 类型，其中 `Random.nextInt()` 方法返回一个 `int`。所以在您编写的代码中，有两个事情在幕后发生：

- `Random.nextInt()` 返回的 `int` 首先通过自动装箱机制被装箱成一个 `Integer`；
- 当分配给 `nextRandom` 变量时，这个 `Integer` 然后通过自动拆箱机制被拆箱。

自动装箱是这样一个机制：一个 `int` 值可以直接赋给一个 `Integer` 对象：

```java
int i = 12;
Integer integer = i;
```

在幕后，为您创建了一个对象，包装了那个值。

自动拆箱则相反。您可以通过解包 `Integer` 中的值来将一个 `Integer` 赋给一个 `int` 值：

```java
Integer integer = Integer.valueOf(12);
int i = integer;
```

这种装箱/拆箱并不免费。大多数情况下，这个成本与您的应用程序正在做的其他事情相比将是小的，比如从数据库或远程服务中获取数据。但在某些情况下，这个成本可能不可接受，您需要避免支付它。

好消息是：JDK为您提供了解决方案，那就是 `IntSupplier` 接口。这是这个接口：

```java
@FunctionalInterface
public interface IntSupplier {
    int getAsInt();
}
```

注意您可以使用完全相同的代码来实现这个接口：

```java
Random random = new Random(314L);
IntSupplier newRandom = () -> random.nextInt();
```

您应用程序代码的唯一修改是您需要调用 `getAsInt()` 而不是 `get()`：

```java
for (int i = 0; i < 5; i++) {
    int nextRandom = newRandom.getAsInt();
    System.out.println("next random = " + nextRandom);
}
```

运行此代码的结果与之前相同，但这次没有发生装箱/拆箱：这段代码比之前的代码性能更好。

JDK为您提供了四个这些专门的供应商，以避免在您的应用程序中进行不必要的装箱/拆箱：`IntSupplier`、`BooleanSupplier`、`LongSupplier` 和 `DoubleSupplier`。

> 您将看到更多这些专门版本的函数式接口来处理原始类型。它们的抽象方法有一个简单的命名约定：取主要抽象方法的名称（供应商的情况下是 `get()`），并添加返回类型。因此，对于供应商接口我们有：`getAsBoolean()`、`getAsInt()`、`getAsLong()` 和 `getAsDouble()`。

## 使用 `Consumer<T>` 消费对象

### 实现和使用消费者

第二个接口是 `Consumer<T>` 接口。消费者与供应商相反：它接受一个参数并且不返回任何东西。

这个接口有点复杂：它里面有默认方法，我们将在本教程后面部分介绍。让我们集中关注它的抽象方法：

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    // 默认方法已删除
}
```

您已经实现了消费者：

```java
Consumer<String> printer = s -> System.out.println(s);
```

您可以使用此消费者更新前面的示例：

```java
for (int i = 0; i < 5; i++) {
    int nextRandom = newRandom.getAsInt();
    printer.accept("next random = " + nextRandom);
}
```

### 使用专门的消费者

假设您需要打印整数。然后您可以编写以下消费者：

```java
Consumer<Integer> printer = i -> System.out.println(i);
```

然后您可能会遇到与供应商示例中相同的自动装箱问题。在您的应用程序中，从性能角度来看，这种装箱/拆箱是否可以接受？

如果不是这种情况，请不要担心，JDK已经用三个专门的消费者来保护您：`IntConsumer`、`LongConsumer` 和 `DoubleConsumer`。这三种消费者的抽象方法遵循与供应商相同的约定，因为它们的返回类型始终是 `void`，它们都被命名为 `accept`。

### 使用 `BiConsumer<T, U>` 消费两个元素

然后JDK添加了 `Consumer<T>` 接口的另一个变体，它接受两个参数而不是一个，称为 `BiConsumer<T, U>` 接口。这是这个接口：

```java
@FunctionalInterface
public interface BiConsumer<T, U> {

    void accept(T t, U u);

    // 默认方法已删除
}
```

这里是一个双消费者的例子：

```java
BiConsumer<Random, Integer> randomNumberPrinter =
        (random, number) -> {
            for (int i = 0; i < number; i++) {
                System.out.println("next random = " + random.nextInt());
            }
        };
```

您可以使用这个双消费者以不同的方式编写前面的示例：

```java
randomNumberPrinter.accept(new Random(314L), 5);
```

有三个专门处理原始类型的 `BiConsumer<T, U>` 接口的版本：`ObjIntConsumer<T>`、`ObjLongConsumer<T>` 和 `ObjDoubleConsumer<T>`。

### 将消费者传递给 Iterable

已经向集合框架的接口添加了几个重要方法，这些方法在本教程的另一部分中介绍。其中之一接受 `Consumer<T>` 作为参数，并且非常实用：`Iterable.forEach()` 方法。这里是一个简单的例子，您将随处可见：

```java
List<String> strings = ...; // 任何类型的对象列表
Consumer<String> printer = s -> System.out.println(s);
strings.forEach(printer);

```

这最后一行代码将简单地将消费者应用于列表中的所有对象。在这里，它将简单地将它们一个接一个地打印在控制台上。您将在稍后的部分看到编写此消费者的另一种方式。

这个 `forEach()` 方法暴露了一种访问 `Iterable` 的所有元素的内部迭代的方式，将您需要对这些元素执行的操作传递过去。这是一种非常强大的方法，它也使您的代码更易于阅读。

## 使用 `Predicate<T>` 测试对象

### 实现和使用谓词

第三个接口是 `Predicate<T>` 接口。谓词用于测试一个对象。它用于在Stream API中过滤流，您将在稍后看到这个话题。

它的抽象方法接受一个对象并返回布尔值。这个接口再次比 `Consumer<T>` 复杂一点：它上面定义了默认方法和静态方法，您将在稍后看到。让我们集中关注它的抽象方法：

```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    // 默认和静态方法已删除
}
```

您已经在前面的部分中看到了 `Predicate<String>` 的一个例子：

```java
Predicate<String> length3 = s -> s.length() == 3;
```

要测试给定的字符串，您所要做的就是调用 `Predicate` 接口的 `test()` 方法：

```java
String word = ...; // 任何单词
boolean isOfLength3 = length3.test(word);
System.out.println("Is of length 3? " + isOfLength3);
```

### 使用专门的谓词

假设您需要测试整数值。您可以编写以下谓词：

```java
Predicate<Integer> isGreaterThan10 = i -> i > 10;
```

对于消费者、供应商和这个谓词来说，情况相同。这个谓词接受的参数是对 `Integer` 类的实例的引用，所以在将这个值与10进行比较之前，这个对象会自动拆箱。这非常方便，但有开销。

JDK为您提供的解决方案与供应商和消费者相同：专门的谓词。与 `Predicate<String>` 一起，有三个专门的接口：`IntPredicate`、`LongPredicate` 和 `DoublePredicate`。它们的抽象方法都遵循命名约定。由于它们都返回 `boolean`，它们都被命名为 `test()`，并且接受与接口相对应的参数。

所以您可以按以下方式编写前面的示例：

```java
IntPredicate isGreaterThan10 = i -> i > 10;
```

您可以看到Lambda本身的语法是相同的，唯一的区别是 `i` 现在是 `int` 类型而不是 `Integer`。

### 使用 `BiPredicate<T, U>` 测试两个元素

按照您在 `Consumer<T>` 中看到的约定，JDK还添加了一个 `BiPredicate<T, U>` 接口，它测试两个元素而不是一个。这是接口：

```java
@FunctionalInterface
public interface BiPredicate<T, U> {

    boolean test(T t, U u);

    // 默认方法已删除
}
```

这里是这样一个双谓词的例子：

```java
Predicate<String, Integer> isOfLength = (word, length) -> word.length() == length;
```

您可以使用以下模式使用这个双谓词：

```java
String word = ...; // 任何单词都可以！
int length = 3;
boolean isWordOfLength3 = isOfLength.test(word, length);
```

没有专门处理原始类型的 `BiPredicate<T, U>` 的版本。

### 将谓词传递给集合

添加到集合框架的方法之一接受一个谓词：`removeIf()` 方法。此方法使用这个谓词来测试集合的每个元素。如果测试的结果是 `true`，则此元素将从集合中删除。

您可以在以下示例中看到这个模式的应用：

```java
List<String> immutableStrings =
        List.of("one", "two", "three", "four", "five");
List<String> strings = new ArrayList<>(immutableStrings);
Predicate<String> isEvenLength = s -> s.length() % 2 == 0;
strings.removeIf(isEvenLength);
System.out.println("strings = " + strings);

```

运行此代码将产生以下结果：

```
strings = [one, two, three]
```

在此示例中有几点值得注意：

- 正如您所看到的，调用 `removeIf()` 会改变这个集合。
- 因此，您不应该在像 `List.of()` 工厂方法产生的不可变集合上调用 `removeIf()`。如果您这样做，会因为无法从不可变集合中删除元素而抛出异常。
- `Arrays.asList()` 生产的集合表现得像数组。您可以更改其现有元素，但您不允许从这个工厂方法返回的列表中添加或删除元素。所以在这个列表上调用 `removeIf()` 也行不通。

## 使用 `Function<T, R>` 将对象映射到其他对象

### 实现和使用函数

第四个接口是 `Function<T, R>` 接口。函数的抽象方法接受类型为 `T` 的对象，并返回将该对象转换为任何其他类型 `U` 的转换。这个接口还有默认和静态方法。

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    // 默认和静态方法已删除
}
```

函数在Stream API中用于将对象映射到其他对象，稍后将介绍这个话题。谓词可以被视为返回布尔值的专门类型的函数。

### 使用专门的函数

这是一个接受字符串并返回该字符串长度的函数示例。

```java
Function<String, Integer> toLength = s -> s.length();
String word = ...; // 任何类型的单词都可以
int length = toLength.apply(word);
```

在这里，您再次可以看到装箱和拆箱操作。首先，`length()` 方法返回一个 `int`。由于函数返回一个 `Integer`，这个 `int` 被装箱。但随后结果被分配给类型为 `int` 的变量 `length`，所以 `Integer` 随后被拆箱以存储在这个变量中。

如果您的应用程序中性能不是问题，那么这种装箱和拆箱真的没什么大不了的。如果是，您可能想避免它。

JDK为您提供了解决方案，有专门版本的 `Function<T, R>` 接口。这组接口比我们在供应商、`Consumer<T>` 或 `Predicate` 类别中看到的更复杂，因为专门函数既定义了输入参数的类型，也定义了返回的类型。

输入参数和输出可以有四种不同的类型：

- 一个参数化类型 `T`；
- 一个 `int`；
- 一个 `long`；
- 一个 `double`。

事情并没有在这里停止，因为API设计中有一个微妙之处。有一个特殊的接口：`UnaryOperator<T>` 它扩展了 `Function<T, T>`。这个一元运算符概念用于命名接受给定类型参数并返回相同类型的结果的函数。一元运算符正是您所期望的。所有经典的数学运算符都可以被 `UnaryOperator<T>` 建模：平方根、所有三角运算符、对数和指数。

这里是您可以在 `java.util.function` 包中找到的16种专门类型的函数。

| 参数类型 | `T` | `int` | `long` | `double` |
| --- | --- | --- | --- | --- |
| `T` | `UnaryOperator<T>` | `IntFunction<T>` | `LongFunction<T>` | `DoubleFunction<T>` |
| `int` | `ToIntFunction<T>` | `IntUnaryOperator` | `LongToIntFunction` | `DoubleToIntFunction` |
| `long` | `ToLongFunction<T>` | `IntToLongFunction` | `LongUnaryOperator` | `DoubleToLongFunction` |
| `double` | `ToDoubleFunction<T>` | `IntToDoubleFunction` | `LongToDoubleFunction` | `DoubleUnaryOperator` |

所有这些接口的抽象方法都遵循相同的约定：它们根据函数返回的类型进行命名。这里是它们的名称：

- `apply()` 用于返回通用类型 `T` 的函数
- `applyAsInt()` 如果它返回原始类型 `int`
- `applyAsLong()` 用于 `long`
- `applyAsDouble()` 用于 `double`

### 将一元运算符传递给列表

您可以使用 `UnaryOperator<T>` 转换列表的元素。有人可能会想知道为什么是 `UnaryOperator<T>` 而不是基本的 `Function`。答案实际上非常简单：一旦声明，您就不能更改列表的类型。所以您应用的函数可以更改列表的元素，但不能更改它们的类型。

采用这个一元运算符的方法将其传递给 `replaceAll()` 方法。这里是一个例子：

```java
List<String> strings = Arrays.asList("one", "two", "three");
UnaryOperator<String> toUpperCase = word -> word.toUpperCase();
strings.replaceAll(toUpperCase);
System.out.println(strings);

```

运行此代码将显示以下内容：

```
[ONE, TWO, THREE]
```

注意这次我们使用了 `Arrays.asList()` 创建的列表。事实上，您不需要向该列表添加或删除任何元素：这段代码只是逐个修改每个元素，这是可以的，使用这种特定的列表。

### 使用双函数映射两个元素

与消费者和谓词一样，函数也有一个接受两个参数的版本：双函数。接口是 `BiFunction<T, U, R>`，其中 `T` 和 `U` 是参数，`R` 是返回类型。这是接口：

```java
@FunctionalInterface
public interface BiFunction<T, U, R> {

    R apply(T t, U u);

    // 默认方法已删除
}
```

您可以使用Lambda表达式创建双函数：

```java
BiFunction<String, String, Integer> findWordInSentence =
    (word, sentence) -> sentence.indexOf(word);
```

`UnaryOperator<T>` 接口还有一个有两个参数的兄弟接口：`BinaryOperator<T>`，它扩展了 `BiFunction<T, U, R>`。正如您所期望的，四种基本的算术运算可以用 `BinaryOperator` 来建模。

JDK添加了双函数的一个子集：

- `IntBinaryOperator`、`LongBinaryOperator` 和 `DoubleBinaryOperator`；
- `ToIntBiFunction<T>`、`ToLongBiFunction<T>` 和 `ToDoubleBiFunction<T>`。

## 总结四种类别的函数式接口

`java.util.function` 包现在在Java中居于中心地位，因为您将在集合框架或Stream API中使用的所有Lambda表达式都实现了该包中的一个接口。

如您所见，此包包含许多接口，在其中找到您的方向可能很棘手。

首先，您需要记住的是有四类接口：

- 供应商：不接受任何参数，返回某些内容
- 消费者：接受一个参数，不返回任何内容
- 谓词：接受一个参数，返回布尔值
- 函数：接受一个参数，返回某些内容

其次：一些接口有接受两个参数而不是一个的版本：

- 双消费者
- 双谓词
- 双函数

第三：一些接口有专门版本，添加了它们以避免装箱和拆箱。它们太多了，无法一一列出。它们按照它们接受的类型命名。例如：`IntPredicate`，或者按照它们返回的类型，如 `ToLongFunction<T>`。它们可能按照两者命名：`IntToDoubleFunction`。

最后：对于所有类型都相同的情况，`Function<T, R>` 和 `BiFunction<T, U, R>` 有扩展：`UnaryOperator<T>` 和 `BinaryOperator<T>`，以及原始类型的专门版本。




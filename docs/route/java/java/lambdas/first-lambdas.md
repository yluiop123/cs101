# 编写你的第一个Lambda表达式

在2014年，Java SE 8引入了Lambda表达式的概念。如果你还记得Java SE 8发布之前的日子，那你可能还记得匿名类的概念。也许你已经听说Lambda表达式是在某些特定情况下编写匿名类实例的更简单的方式。

如果你不记得那些日子，那么你可能听说过匿名类，并可能对这种晦涩的语法感到害怕。

好吧，好消息是：你不需要通过匿名类来理解如何编写Lambda表达式。而且，在许多情况下，由于Java语言中添加了Lambda，你不再需要匿名类了。

编写Lambda表达式可以归结为三个步骤：

- 确定你想编写的Lambda表达式的类型
- 寻找正确的方法来实现
- 实现这个方法

这就是全部。让我们详细看看这三个步骤。

## 确定Lambda表达式的类型

Java语言中的一切都有类型，并且这个类型在编译时就已知晓。所以总是可以找到Lambda表达式的类型。它可能是一个变量的类型，一个字段的类型，一个方法参数的类型，或者一个方法的返回类型。

Lambda表达式的类型有一个限制：它必须是函数式接口。因此，不实现函数式接口的匿名类不能写成Lambda表达式。

函数式接口的完整定义有点复杂。在这一点上，你需要知道的是，函数式接口是一个只包含一个抽象方法的接口。

你应该意识到，从Java SE 8开始，接口中允许有具体方法。如果它们是实例方法，在这种情况下，它们被称为默认方法，它们也可以是静态方法。这些方法不算数，因为它们不是抽象方法。

> 我需要在接口上添加`@FunctionalInterface`注解来使其成为函数式接口吗？
> 
> 不，你不需要。这个注解在这里是为了帮助你确保你的接口确实是函数式的。如果你将这个注解放在不是函数式接口的类型上，编译器会报错。

### 函数式接口的示例

让我们来看一些从JDK API中获取的示例。我们刚刚从源代码中删除了注释。

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

`Runnable`接口确实是函数式的，因为它只有一个抽象方法。`@FunctionalInterface`注解被添加为辅助工具，但这不是必需的。

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        // 此方法的主体已被删除
    }
}
```

`Consumer<T>`接口也是函数式的：它有一个抽象方法和一个默认的、具体的方法，这个默认方法不算数。同样，`@FunctionalInterface`注解不是必需的。

```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        // 此方法的主体已被删除
    }

    default Predicate<T> negate() {
        // 此方法的主体已被删除
    }

    default Predicate<T> or(Predicate<? super T> other) {
        // 此方法的主体已被删除
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        // 此方法的主体已被删除
    }

    static <T> Predicate<T> not(Predicate<? super T> target) {
        // 此方法的主体已被删除
    }
}
```

`Predicate<T>`接口有点复杂，但它仍然是一个函数式接口：

- 它有一个抽象方法
- 它有三个默认方法不算数
- 它还有两个静态方法也不算数

## 寻找正确的方法来实现

到这一点，你已经确定了你需要编写的Lambda表达式的类型，好消息是：你已经完成了最困难的部分：其余的都是非常机械的，也更容易做。

Lambda表达式是这个函数式接口中唯一抽象方法的实现。所以寻找正确的方法来实现只是找到这个方法的问题。

你可以花一分钟时间在前一段的三个示例中寻找它。

对于`Runnable`接口，它是：

```java
public abstract void run();
```

对于`Predicate`接口，它是：

```java
boolean test(T t);
```

而对于`Consumer<T>`接口，它是：

```java
void accept(T t);
```

## 使用Lambda表达式实现正确的方法

### 编写第一个实现`Predicate<String>`的Lambda表达式

现在是最后一部分：编写Lambda本身。你需要明白的是，你正在编写的Lambda表达式是你所找到的抽象方法的实现。使用Lambda表达式语法，你可以在代码中很好地内联这个实现。

这个语法由三个元素组成：

- 一个参数块；
- 一个表示箭头的小ASCII艺术：`->`。注意，Java使用的是 _细箭头_ (`->`)而不是 _粗箭头_ (`=>`)；
- 一个代码块，这是方法的主体。

让我们看一些示例。假设你需要一个`Predicate`的实例，它对恰好有三个字符的字符串返回`true`。

1. 你的Lambda表达式的类型是`Predicate`
2. 你需要实现的方法是`boolean test(String s)`

然后你编写参数块，这是方法签名的简单复制/粘贴：`(String s)`。

然后你添加一个细箭头：`->`。

以及方法的主体。你的结果应该像这样：

```java
Predicate<String> predicate =
    (String s) -> {
        return s.length() == 3;
    };
```

### 简化语法

然后，由于编译器可以猜测很多事情，所以你不需要编写它们，这个语法可以进一步简化。

首先，编译器知道它正在实现`Predicate`接口的抽象方法，并且它知道这个方法以`String`作为参数。所以`(String s)`可以简化为`(s)`。在只有一个参数的情况下，你甚至可以更进一步，通过去掉括号。参数块变成`s`。如果你有多个参数或没有参数，你应该保留括号。

其次，方法主体中只有一行代码。在这种情况下，你不需要大括号，也不需要`return`关键字。

所以最终的语法实际上是这样的：

```java
Predicate<String> predicate = s -> s.length() == 3;
```

这引出了第一个良好的实践：保持你的Lambda简短，使它们只是一行简单、可读的代码。

### 实现`Consumer<String>`

在某些时候，人们可能会想走捷径。你会听到开发人员说“消费者接受一个对象，不返回任何东西”。或者“当字符串恰好有三个字符时，谓词是true”。大多数时候，Lambda表达式、它实现的抽象方法和包含这个方法的函数式接口之间存在混淆。

但由于函数式接口、它的抽象方法和实现它的Lambda表达式如此紧密地联系在一起，这种说话方式实际上完全讲得通。所以这没问题，只要它不导致任何歧义。

让我们写一个Lambda，它消费一个`String`并在`System.out`上打印。语法可以是这样的：

```java
Consumer<String> print = s -> System.out.println(s);
```

在这里，我们直接编写了Lambda表达式的简化版本。

### 实现Runnable

实现`Runnable`意味着编写`void run()`的实现。这个参数块是空的，所以应该用括号书写。记住：只有当你有一个参数时，你可以省略括号，这里我们有零个。

所以让我们写一个可运行的，告诉我们它正在运行：

```java
Runnable runnable = () -> System.out.println("I am running");
```

## 调用Lambda表达式

让我们回到我们之前的`Predicate`示例，并假设这个谓词已经在一个方法中定义了。你如何使用它来测试给定的字符串是否确实是长度为3？

好吧，尽管你用来编写Lambda的语法，你需要记住这个Lambda是接口`Predicate`的一个实例。这个接口定义了一个叫做`test()`的方法，它接受一个`String`并返回一个`boolean`。

让我们在一个方法中这样写：

```java
List<String> retainStringsOfLength3(List<String> strings) {
    Predicate<String> predicate = s -> s.length() == 3;
    List<String> stringsOfLength3 = new ArrayList<>();
    for (String s: strings) {
        if (predicate.test(s)) {
            stringsOfLength3.add(s);
        }
    }
    return stringsOfLength3;
}
```

注意你是如何定义谓词的，就像你在上一个示例中做的那样。由于`Predicate`接口定义了这个方法`boolean test(String)`，所以通过类型为`Predicate`的变量来调用`Predicate`中定义的方法是完全合法的。起初这可能看起来令人困惑，因为这个谓词变量看起来并没有定义方法。

请耐心等待，本教程后面你会看到编写这段代码的更好方法。

所以每次你写一个Lambda，你可以调用这个Lambda实现的接口上定义的任何方法。调用抽象方法将调用你的Lambda代码本身，因为Lambda是那个方法的实现。调用默认方法将调用接口中编写的代码。Lambda无法覆盖默认方法。

## 捕获局部值

一旦你习惯了，编写Lambda就会变得非常自然。它们在集合框架、Stream API以及JDK中的许多其他地方都很好地集成了。从Java SE 8开始，Lambda无处不在，这是最好的。

在使用Lambda时有一些限制，你可能会碰到编译时错误，你需要理解它们。

让我们考虑以下代码：

```java

int calculateTotalPrice(List<Product> products) {
    int totalPrice = 0;
    Consumer<Product> consumer =
        product -> totalPrice += product.getPrice();
    for (Product product: products) {
        consumer.accept(product);
    }
}
```

即使这段代码看起来不错，尝试编译它会在`Consumer`实现中使用`totalPrice`时给出以下错误：

> 在Lambda表达式中使用的变量应该是final的或实际上final的

原因是这样的：Lambda不能修改它们体外定义的变量。它们可以读取它们，只要它们是`final`的，即不可变的。这种访问变量的过程称为_捕获_：Lambda不能_捕获_变量，它们只能_捕获_值。一个final变量实际上就是一个值。

你已经注意到错误消息告诉我们变量可以是_final_的，这是Java语言中的一个经典概念。它还告诉我们变量可以是_effectively final_的。这个概念是在Java SE 8中引入的：即使你没有显式声明一个变量为`final`，编译器也可能为你做这件事。如果它看到这个变量是从Lambda中读取的，并且你没有修改它，那么它将为你在编译后的代码中很好地添加`final`声明。当然，这是在编译后的代码中完成的，编译器不会修改你的源代码。这样的变量不被称为_final_；它们被称为_effectively final_变量。这是一个非常有用的功能。

## 序列化Lambda

Lambda表达式被构建为可以被序列化。

为什么要序列化Lambda表达式？好吧，一个Lambda表达式可能存储在一个字段中，这个字段可能通过构造函数或setter方法被访问。然后你可能在运行时的对象状态中有一个Lambda表达式，而没有意识到它。

所以为了保持与现有可序列化类的向后兼容性，序列化Lambda表达式是可能的。


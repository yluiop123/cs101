# AtomicLong

## 概述
`AtomicLong` 类提供了一个可以原子地读写的 `long` 变量，并包含高级原子操作，如 `compareAndSet()`。`AtomicLong` 类位于 `java.util.concurrent.atomic` 包中，因此完整类名是 `java.util.concurrent.atomic.AtomicLong`。本文描述的是Java 8中发现的 `AtomicLong` 版本，但第一个版本是在Java 5中添加的。

`AtomicLong` 设计背后的原因是在我的Java并发教程中关于Compare and Swap的文本中解释的。

## 创建 AtomicLong
创建 `AtomicLong` 如下所示：

```java
AtomicLong atomicLong = new AtomicLong();

```

这个例子创建了一个初始值为 `0` 的 `AtomicLong`。

如果你想创建一个带有初始值的 `AtomicLong`，可以这样做：

```java
AtomicLong atomicLong = new AtomicLong(123);

```

这个例子将 `123` 作为参数传递给 `AtomicLong` 构造函数，将 `AtomicLong` 实例的初始值设置为 `123`。

## 获取 AtomicLong 值
你可以通过 `get()` 方法获取 `AtomicLong` 实例的值。
这是 `AtomicLong.get()` 的一个例子：

```java
AtomicLong atomicLong = new AtomicLong(123);

long theValue = atomicLong.get();

```

## 设置 AtomicLong 值
你可以通过 `set()` 方法设置 `AtomicLong` 实例的值。
这是 `AtomicLong.set()` 的一个例子：

```java
AtomicLong atomicLong = new AtomicLong(123);

atomicLong.set(234);

```

这个例子首先创建了一个初始值为123的 `AtomicLong` 示例，然后在下一行将其值设置为 `234`。

## 比较和设置 AtomicLong 值
`AtomicLong` 类还有一个原子的 `compareAndSet()` 方法。此方法将 `AtomicLong` 实例的当前值与期望值进行比较，如果两个值相等，则为 `AtomicLong` 实例设置一个新值。这是 `AtomicLong.compareAndSet()` 的一个例子：

```java
AtomicLong atomicLong = new AtomicLong(123);

long expectedValue = 123;
long newValue      = 234;
atomicLong.compareAndSet(expectedValue, newValue);

```

这个例子首先创建了一个初始值为 `123` 的 `AtomicLong` 实例。
然后它将 `AtomicLong` 的值与期望值 `123` 进行比较，如果它们相等，则 `AtomicLong` 的新值变为 `234`。

## 向 AtomicLong 值添加
`AtomicLong` 类包含一些方法，你可以用来向 `AtomicLong` 添加一个值并返回其值。这些方法是：

- `addAndGet()`
- `getAndAdd()`
- `getAndIncrement()`
- `incrementAndGet()`

第一个方法 `addAndGet()` 向 `AtomicLong` 添加一个数字，并返回加法后的值。第二个方法 `getAndAdd()` 也向 `AtomicLong` 添加一个数字，但返回添加前的 `AtomicLong` 值。你应该使用这两种方法中的哪一种取决于你的用例。这里有两个例子：

```java
AtomicLong atomicLong = new AtomicLong();

System.out.println(atomicLong.getAndAdd(10));
System.out.println(atomicLong.addAndGet(10));

```

这个例子将打印出值 `0` 和 `20`。首先，示例在添加10之前获取 `AtomicLong` 的值。加之前的值是0。然后示例向 `AtomicLong` 添加10并获取加法后的值。现在的值是20。

你也可以通过这两种方法向 `AtomicLong` 添加负数。结果实际上就是减法。

`getAndIncrement()` 和 `incrementAndGet()` 方法的工作方式与 `getAndAdd()` 和 `addAndGet()` 相同，但只是向 `AtomicLong` 的值添加1。

## 从 AtomicLong 值中减去
`AtomicLong` 类还包含一些方法，用于原子地从 `AtomicLong` 值中减去值。这些方法是：

- `decrementAndGet()`
- `getAndDecrement()`

`decrementAndGet()` 从 `AtomicLong` 值中减去1并返回减法后的值。`getAndDecrement()` 也从 `AtomicLong` 值中减去1，但返回减法前的 `AtomicLong` 值。

## 在 Lambda 表达式中使用 AtomicLong 作为计数器
Java Lambda 表达式不能包含任何成员字段，因此它们不能在Lambda表达式调用之间内部保持任何状态。然而，你可以通过在Lambda表达式外部创建 `AtomicLong` 并从Lambda表达式内部使用它来绕过这个限制。这里有一个例子：

```java
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

public class AtomicLongExample {

    public static void main(String[] args) {

        AtomicLong atomicLong = new AtomicLong();

        Function<Long, Long> myLambda = (input) -> {
            long noOfCalls = atomicLong.incrementAndGet();
            System.out.println("Lambda called " + noOfCalls + " times.");
            return input * 2;
        };

        System.out.println(myLambda.apply(1L));
        System.out.println(myLambda.apply(3L));
        System.out.println(myLambda.apply(5L));
    }
}

```

运行上述代码的输出如下：

```
Lambda called 1 times.
2
Lambda called 2 times.
6
Lambda called 3 times.
10
```


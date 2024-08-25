# AtomicInteger

## 概述
`AtomicInteger` 类提供了一个可以原子地读写的 `int` 变量，并包含高级原子操作，如 `compareAndSet()`。`AtomicInteger` 类位于 `java.util.concurrent.atomic` 包中，因此完整类名是 `java.util.concurrent.atomic.AtomicInteger`。本文描述的是Java 8中发现的 `AtomicInteger` 版本，但第一个版本是在Java 5中添加的。

`AtomicInteger` 设计背后的原因是在我的Java并发教程中关于Compare and Swap的文本中解释的。

## 创建 AtomicInteger
创建 `AtomicInteger` 如下所示：

```java
AtomicInteger atomicInteger = new AtomicInteger();

```

这个例子创建了一个初始值为 `0` 的 `AtomicInteger`。

如果你想创建一个带有初始值的 `AtomicInteger`，可以这样做：

```java
AtomicInteger atomicInteger = new AtomicInteger(123);

```

这个例子将 `123` 作为参数传递给 `AtomicInteger` 构造函数，将 `AtomicInteger` 实例的初始值设置为 `123`。

## 获取 AtomicInteger 值
你可以通过 `get()` 方法获取 `AtomicInteger` 实例的值。
这是 `AtomicInteger.get()` 的一个例子：

```java
AtomicInteger atomicInteger = new AtomicInteger(123);

int theValue = atomicInteger.get();

```

## 设置 AtomicInteger 值
你可以通过 `set()` 方法设置 `AtomicInteger` 实例的值。
这是 `AtomicInteger.set()` 的一个例子：

```java
AtomicInteger atomicInteger = new AtomicInteger(123);

atomicInteger.set(234);

```

这个例子首先创建了一个初始值为123的 `AtomicInteger` 示例，然后在下一行将其值设置为 `234`。

## 比较和设置 AtomicInteger 值
`AtomicInteger` 类还有一个原子的 `compareAndSet()` 方法。此方法将 `AtomicInteger` 实例的当前值与期望值进行比较，如果两个值相等，则为 `AtomicInteger` 实例设置一个新值。这是 `AtomicInteger.compareAndSet()` 的一个例子：

```java
AtomicInteger atomicInteger = new AtomicInteger(123);

int expectedValue = 123;
int newValue      = 234;
atomicInteger.compareAndSet(expectedValue, newValue);

```

这个例子首先创建了一个初始值为 `123` 的 `AtomicInteger` 实例。
然后它将 `AtomicInteger` 的值与期望值 `123` 进行比较，如果它们相等，则 `AtomicInteger` 的新值变为 `234`。

## 向 AtomicInteger 值添加
`AtomicInteger` 类包含一些方法，你可以用来向 `AtomicInteger` 添加一个值并返回其值。这些方法是：

- `addAndGet()`
- `getAndAdd()`
- `getAndIncrement()`
- `incrementAndGet()`

第一个方法 `addAndGet()` 向 `AtomicInteger` 添加一个数字，并返回加法后的值。第二个方法 `getAndAdd()` 也向 `AtomicInteger` 添加一个数字，但返回添加前的 `AtomicInteger` 值。你应该使用这两种方法中的哪一种取决于你的用例。这里有两个例子：

```java
AtomicInteger atomicInteger = new AtomicInteger();

System.out.println(atomicInteger.getAndAdd(10));
System.out.println(atomicInteger.addAndGet(10));

```

这个例子将打印出值 `0` 和 `20`。首先，示例在添加10之前获取 `AtomicInteger` 的值。加之前的值是0。然后示例向 `AtomicInteger` 添加10并获取加法后的值。现在的值是20。

你也可以通过这两种方法向 `AtomicInteger` 添加负数。结果实际上就是减法。

`getAndIncrement()` 和 `incrementAndGet()` 方法的工作方式与 `getAndAdd()` 和 `addAndGet()` 相同，但只是向 `AtomicInteger` 的值添加1。

## 从 AtomicInteger 值中减去
`AtomicInteger` 类还包含一些方法，用于原子地从 `AtomicInteger` 值中减去值。这些方法是：

- `decrementAndGet()`
- `getAndDecrement()`

`decrementAndGet()` 从 `AtomicInteger` 值中减去1并返回减法后的值。`getAndDecrement()` 也从 `AtomicInteger` 值中减去1，但返回减法前的 `AtomicInteger` 值。

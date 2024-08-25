# AtomicBoolean

## 概述
`AtomicBoolean` 类提供了一个可以原子地读写的 `boolean` 变量，并包含高级原子操作，如 `compareAndSet()`。`AtomicBoolean` 类位于 `java.util.concurrent.atomic` 包中，因此完整类名是 `java.util.concurrent.atomic.AtomicBoolean`。本文描述的是Java 8中发现的 `AtomicBoolean` 版本，但第一个版本是在Java 5中添加的。

`AtomicBoolean` 设计背后的原因是在我的Java并发教程中关于Compare and Swap的文本中解释的。

## 创建 AtomicBoolean
你可以这样创建一个 `AtomicBoolean`：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean();

```

这个例子创建了一个新的 `AtomicBoolean`，默认值为 `false`；

如果你需要为 `AtomicBoolean` 实例设置一个显式的初始值，你可以像这样将初始值传递给 `AtomicBoolean` 构造函数：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean(true);

```

## 获取 AtomicBoolean 的值
你可以使用 `get()` 方法获取 `AtomicBoolean` 的值。以下是一个例子：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean(true);

boolean value = atomicBoolean.get();

```

执行此代码后，`value` 变量将包含值 `true`。

## 设置 AtomicBoolean 的值
你可以使用 `set()` 方法设置 `AtomicBoolean` 的值。以下是一个例子：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean(true);

atomicBoolean.set(false);

```

执行此代码后，`AtomicBoolean` 变量将包含值 `false`。

## 交换 AtomicBoolean 的值
你可以使用 `getAndSet()` 方法交换 `AtomicBoolean` 的值。
`getAndSet()` 方法返回 `AtomicBoolean` 的当前值，并为其设置一个新值。以下是一个例子：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean(true);

boolean oldValue = atomicBoolean.getAndSet(false);

```

执行此代码后，`oldValue` 变量将包含值 `true`，`AtomicBoolean` 实例将包含值 `false`。该代码有效地将 `false` 交换为 `AtomicBoolean` 的当前值，即 `true`。

## 比较和设置 AtomicBoolean 的值
`compareAndSet()` 方法允许你将 `AtomicBoolean` 的当前值与期望值进行比较，如果当前值等于期望值，则可以在 `AtomicBoolean` 上设置一个新值。`compareAndSet()` 方法是原子的，所以一次只能有一个线程执行它。因此，`compareAndSet()` 方法可以用来实现简单的同步器，如锁。

以下是一个 `compareAndSet()` 的例子：

```java
AtomicBoolean atomicBoolean = new AtomicBoolean(true);

boolean expectedValue = true;
boolean newValue      = false;

boolean wasNewValueSet = atomicBoolean.compareAndSet(
    expectedValue, newValue);

```

这个例子将 `AtomicBoolean` 的当前值与 `true` 进行比较，如果两个值相等，则将 `AtomicBoolean` 的新值设置为 `false`。


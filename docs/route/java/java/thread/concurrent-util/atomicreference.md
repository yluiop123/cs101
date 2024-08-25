# AtomicReference

## 概述
`AtomicReference` 类提供了一个对象引用变量，该变量可以被原子地读写。所谓原子性，意味着多个线程尝试更改同一个 `AtomicReference`（例如使用比较并交换操作）不会导致 `AtomicReference` 最终处于不一致的状态。`AtomicReference` 甚至有一个高级的 `compareAndSet()` 方法，允许你将引用与期望的值（引用）进行比较，如果它们相等，则可以在 `AtomicReference` 对象中设置一个新的引用。

## 创建 AtomicReference

你可以这样创建一个 `AtomicReference` 实例：

```java
AtomicReference atomicReference = new AtomicReference();

```

如果你需要带有初始引用的 `AtomicReference`，则可以这样做：

```java
String initialReference = "the initially referenced string";
AtomicReference atomicReference = new AtomicReference(initialReference);

```

### 创建类型化的 AtomicReference

你可以使用 Java 泛型创建一个类型化的 `AtomicReference`。以下是一个类型化的 `AtomicReference` 示例：

```java
AtomicReference<String> atomicStringReference = new AtomicReference<String>();

```

你也可以为类型化的 `AtomicReference` 设置初始值。以下是一个带有初始值的类型化 `AtomicReference` 实例化示例：

```java
String initialReference = "the initially referenced string";
AtomicReference<String> atomicStringReference = new AtomicReference<String>(initialReference);

```

## 获取 AtomicReference 引用

你可以使用 `AtomicReference` 的 `get()` 方法获取存储在 `AtomicReference` 中的引用。如果你有一个未类型化的 `AtomicReference`，那么 `get()` 方法返回一个 `Object` 引用。如果你有一个类型化的 `AtomicReference`，那么 `get()` 返回你在创建 `AtomicReference` 变量时声明的类型的引用。

首先是未类型化 `AtomicReference` 的 `get()` 示例：

```java
AtomicReference atomicReference = new AtomicReference("first value referenced");

String reference = (String) atomicReference.get();

```

注意，需要将 `get()` 返回的引用强制转换为 `String`，因为当 `AtomicReference` 未类型化时，`get()` 返回一个 `Object` 引用。

以下是一个类型化 `AtomicReference` 示例：

```java
AtomicReference<String> atomicReference = new AtomicReference<String>("first value referenced");

String reference = atomicReference.get();

```

注意，不再需要对 `get()` 返回的引用进行强制转换，因为编译器知道它将返回一个 `String` 引用。

## 设置 AtomicReference 引用

你可以使用 `set()` 方法设置存储在 `AtomicReference` 实例中的引用。在未类型化的 `AtomicReference` 实例中，`set()` 方法以 `Object` 引用作为参数。在类型化的 `AtomicReference` 中，`set()` 方法接受你在声明 `AtomicReference` 时声明的任何类型的参数。

以下是一个 `AtomicReference` `set()` 示例：

```java
AtomicReference atomicReference = new AtomicReference();

atomicReference.set("New object referenced");

```

对于未类型化或类型化引用的 `set()` 方法的使用没有区别。你将体验到的唯一真正的区别是编译器将限制你可以在类型化的 `AtomicReference` 上设置的类型。

## 比较和设置 AtomicReference 引用

`AtomicReference` 类包含一个有用的方法，名为 `compareAndSet()`。`compareAndSet()` 方法可以将存储在 `AtomicReference` 实例中的引用与期望的引用进行比较，如果这两个引用相同（不是 `equals()` 中的相等，而是 `==` 中的相同），那么可以在 `AtomicReference` 实例上设置一个新的引用。

如果 `compareAndSet()` 在 `AtomicReference` 中设置了一个新的引用，`compareAndSet()` 方法返回 `true`。否则 `compareAndSet()` 返回 `false`。

以下是一个 `AtomicReference` `compareAndSet()` 示例：

```java
String initialReference = "initial value referenced";

AtomicReference<String> atomicStringReference = new AtomicReference<String>(initialReference);

String newReference = "new value referenced";
boolean exchanged = atomicStringReference.compareAndSet(initialReference, newReference);
System.out.println("exchanged: " + exchanged);

exchanged = atomicStringReference.compareAndSet(initialReference, newReference);
System.out.println("exchanged: " + exchanged);

```

这个示例创建了一个带有初始引用的类型化 `AtomicReference`。然后它调用 `comparesAndSet()` 两次，将存储的引用与初始引用进行比较，并在存储的引用与初始引用相等时设置一个新的引用。第一次两个引用相同，所以在 `AtomicReference` 上设置了一个新的引用。第二次存储的引用是刚刚在调用 `compareAndSet()` 之前设置的新引用，因此存储的引用当然不等于初始引用。因此，没有在 `AtomicReference` 上设置新的引用，`compareAndSet()` 方法返回 `false`。


# AtomicStampedReference

## 概述
`AtomicStampedReference` 类提供了一个对象引用变量，该变量可以被原子地读写。所谓原子性，意味着多个线程尝试更改同一个 `AtomicStampedReference` 不会导致 `AtomicStampedReference` 最终处于不一致的状态。

`AtomicStampedReference` 与 `AtomicReference` 不同之处在于 `AtomicStampedReference` 内部同时保存了一个对象引用和一个时间戳。引用和时间戳可以通过单个原子比较并交换操作，通过 `compareAndSet()` 方法进行交换。

`AtomicStampedReference` 被设计为能够解决 A-B-A 问题，而仅使用 `AtomicReference` 是无法解决的。A-B-A 问题在本文后面有解释。

## 创建 AtomicStampedReference

你可以这样创建一个 `AtomicStampedReference` 实例：

```java
Object initialRef   = null;
int    initialStamp = 0;

AtomicStampedReference atomicStampedReference =
    new AtomicStampedReference(intialRef, initialStamp);
```

### 创建类型化的 AtomicStampedReference

你可以使用 Java 泛型创建一个类型化的 `AtomicStampedReference`。以下是一个类型化的 `AtomicStampedReference` 示例：

```java
String initialRef   = null;
int    initialStamp = 0;

AtomicStampedReference<String> atomicStampedReference =
    new AtomicStampedReference<String>(
        initialRef, initialStamp
    );
```

这个例子中创建的 Java `AtomicStampedReference` 将只接受对 String 实例的引用。如果你知道将保存在其中引用的类型，建议总是使用 AtomicStampedReference 的泛型类型。

## 获取 AtomicStampedReference 引用

你可以使用 `AtomicStampedReference` 的 `getReference()` 方法获取存储在 `AtomicStampedReference` 中的引用。如果你有一个未类型化的 `AtomicStampedReference`，那么 `getReference()` 方法返回一个 `Object` 引用。如果你有一个类型化的 `AtomicStampedReference`，那么 `getReference()` 返回你在创建 `AtomicStampedReference` 变量时声明的类型的引用。

首先是未类型化 `AtomicStampedReference` 的 `getReference()` 示例：

```java
String initialRef = "first text";

AtomicStampedReference atomicStampedReference =
    new AtomicStampedReference(initialRef, 0);

String reference = (String)
    atomicStampedReference.getReference();
```

注意，需要将 `getReference()` 返回的引用强制转换为 `String`，因为当 `AtomicStampedReference` 未类型化时，`getReference()` 返回一个 `Object` 引用。

以下是一个类型化 `AtomicStampedReference` 示例：

```java
String initialRef = "first text";

AtomicStampedReference<String> atomicStampedReference =
    new AtomicStampedReference<String>(
        initialRef, 0
    );

String reference =
    atomicStampedReference.getReference();
```

注意，不再需要对 `getReference()` 返回的引用进行强制转换，因为编译器知道它将返回一个 `String` 引用。

## 获取 AtomicStampedReference 时间戳

`AtomicStampedReference` 还包含一个 `getStamp()` 方法，可以用来获取内部存储的时间戳。以下是一个 `getStamp()` 示例：

```java
String initialRef = "first text";

AtomicStampedReference<String> atomicStampedReference =
    new AtomicStampedReference<String>(initialRef, 0);

int stamp = atomicStampedReference.getStamp();
```

## 原子地获取引用和时间戳

你可以使用 `get()` 方法以单个原子操作从 `AtomicStampedReference` 中获取引用和时间戳。`get()` 方法将引用作为方法的返回值。时间戳被插入到作为参数传递给 `get()` 方法的 `int[]` 数组中。以下是一个 `get()` 示例：

```java
String initialRef   = "text";
String initialStamp = 0;

AtomicStampedReference<String> atomicStampedReference =
    new AtomicStampedReference<>(
        initialRef, initialStamp
    );

int[] stampHolder = new int[1];
String ref = atomicStampedReference.get(stampHolder);

System.out.println("ref = " + ref);
System.out.println("stamp = " + stampHolder[0]);
```

能够以单个原子操作获取引用和时间戳对于某些类型的并发算法是重要的。

## 设置 AtomicStampedReference 引用

你可以使用 `set()` 方法设置存储在 `AtomicStampedReference` 实例中的引用。在未类型化的 `AtomicStampedReference` 实例中，`set()` 方法以 `Object` 引用作为第一个参数。在类型化的 `AtomicStampedReference` 中，`set()` 方法接受你在声明 `AtomicStampedReference` 时声明的任何类型的参数。

以下是一个 `AtomicStampedReference` `set()` 示例：

```java
AtomicStampedReference<String> atomicStampedReference =
     new AtomicStampedReference<>(null, 0);

String newRef = "New object referenced";
int    newStamp = 1;

atomicStampedReference.set(newRef, newStamp);
```

对于未类型化或类型化引用的 `set()` 方法的使用没有区别。你将体验到的唯一真正的区别是编译器将限制你可以在类型化的 `AtomicStampedReference` 上设置的类型。

## 比较并设置 AtomicStampedReference 引用

`AtomicStampedReference` 类包含一个有用的方法，名为 `compareAndSet()`。`compareAndSet()` 方法可以将存储在 `AtomicStampedReference` 实例中的引用与期望的引用进行比较，并将存储的时间戳与期望的时间戳进行比较，如果这两个引用和时间戳相同（不是 `equals()` 中的相等，而是 `==` 中的相同），那么可以在 `AtomicStampedReference` 实例上设置一个新的引用。

如果 `compareAndSet()` 在 `AtomicStampedReference` 中设置了一个新的引用，`compareAndSet()` 方法返回 `true`。否则 `compareAndSet()` 返回 `false`。

以下是一个 `AtomicStampedReference` `compareAndSet()` 示例：

```java
String initialRef   = "initial value referenced";
int    initialStamp = 0;

AtomicStampedReference<String> atomicStringReference =
    new AtomicStampedReference<String>(
        initialRef, initialStamp
    );

String newRef   = "new value referenced";
int    newStamp = initialStamp + 1;

boolean exchanged = atomicStringReference
    .compareAndSet(
        initialRef, newRef,
        initialStamp, newStamp);
System.out.println("exchanged: " + exchanged);  //true

exchanged = atomicStringReference
    .compareAndSet(
        initialRef, "new string",
        newStamp, newStamp + 1);
System.out.println("exchanged: " + exchanged);  //false

exchanged = atomicStringReference
    .compareAndSet(
        newRef, "new string",
        initialStamp, newStamp + 1);
System.out.println("exchanged: " + exchanged);  //false

exchanged = atomicStringReference
    .compareAndSet(
        newRef, "new string",
        newStamp, newStamp + 1);
System.out.println("exchanged: " + exchanged);  //true
```

这个示例首先创建了一个 `AtomicStampedReference`，然后使用 `compareAndSet()` 来交换引用和时间戳。

在第一次 `compareAndSet()` 调用之后，示例尝试两次交换引用和时间戳，但都没有成功。第一次调用时，`initialRef` 作为期望的引用传递，但此时内部存储的引用是 `newRef`，所以 `compareAndSet()` 调用失败。第二次调用时，`initialStamp` 作为期望的时间戳传递，但此时内部存储的时间戳是 `newStamp`，所以 `compareAndSet()` 调用失败。

最后的 `compareAndSet()` 调用将成功，因为期望的引用是 `newRef`，期望的时间戳是 `newStamp`。

## AtomicStampedReference 与 A-B-A 问题

`AtomicStampedReference` 被设计为解决 A-B-A 问题。A-B-A 问题是当一个引用先指向 A，然后指向 B，再然后指回 A 时发生的情况。

当使用比较并交换操作来原子地更改引用，并确保只有一个线程可以将引用从旧引用更改为新引用时，检测 A-B-A 情况是不可能的。

A-B-A 问题可能出现在非阻塞算法中。非阻塞算法通常使用对受保护数据结构的正在进行的修改的引用，向其他线程发出信号表示当前正在进行修改。如果线程 1 看到没有正在进行的修改（引用指向 `null`），另一个线程可能提交一个修改（引用现在非 `null`），完成修改并将引用交换回 `null`，而线程 1 没有检测到。A-B-A 问题如何在非阻塞算法中发生，在有关非阻塞算法的教程中有更详细的解释。

通过使用 `AtomicStampedReference` 而不是 `AtomicReference`，可以检测 A-B-A 情况。线程 1 可以使用 `get()` 原子地从 `AtomicStampedReference` 中复制引用和时间戳。如果另一个线程将引用从 A 更改为 B，然后再变回 A，那么时间戳将发生变化（前提是线程合理地更新时间戳 - 例如，递增它）。

下面的代码展示了如何使用 `AtomicStampedReference` 检测 A-B-A 情况：

```java
int[] stampHolder = new int[1];
Object ref = atomicStampedReference.get(stampHolder);

if(ref == null){
   //prepare optimistic modification
}

//if another thread changes the
//reference and stamp here,
//it can be detected

int[] stampHolder2 = new int[1];
Object ref2 = atomicStampedReference.get(stampHolder);

if(ref == ref2 && stampHolder[0] == stampHolder2[0]){
    //no modification since
    //optimistic modification was prepared

} else {
    //retry from scratch.
}
```



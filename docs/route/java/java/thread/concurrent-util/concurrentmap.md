# ConcurrentMap

`java.util.concurrent.ConcurrentMap` 接口代表了一个能够处理并发访问（插入和获取）的Map。

`ConcurrentMap` 除了继承自其父接口 `java.util.Map` 的方法外，还有一些额外的原子方法。

## ConcurrentMap 实现

由于 `ConcurrentMap` 是一个接口，你需要使用它的一个实现才能使用它。`java.util.concurrent` 包包含以下 `ConcurrentMap` 接口的实现：

- ConcurrentHashMap

### ConcurrentHashMap

`ConcurrentHashMap` 与 `java.util.HashTable` 类非常相似，除了 `ConcurrentHashMap` 提供了比 `HashTable` 更好的并发性。在从 `ConcurrentHashMap` 读取时，它不会锁定 `Map`。此外，当写入 `ConcurrentHashMap` 时，它不会锁定整个 `Map`。它只是内部锁定正在写入的 `Map` 的部分。

另一个区别是，如果在迭代过程中 `ConcurrentHashMap` 发生改变，`ConcurrentHashMap` 不会抛出 `ConcurrentModificationException`。不过，迭代器并不设计为供多个线程使用。

查看官方 JavaDoc 以获取有关 `ConcurrentMap` 和 `ConcurrentHashMap` 的更多详细信息。

## ConcurrentMap 示例

以下是如何使用 `ConcurrentMap` 接口的示例。示例使用了一个 `ConcurrentHashMap` 实现：

```java
ConcurrentMap<String, String> concurrentMap = new ConcurrentHashMap<>();

concurrentMap.put("key", "value");

String value = (String) concurrentMap.get("key");
```


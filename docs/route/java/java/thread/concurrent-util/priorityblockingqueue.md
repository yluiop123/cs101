# PriorityBlockingQueue

`PriorityBlockingQueue` 类实现了 `BlockingQueue` 接口。
有关该接口的更多信息，请阅读 `BlockingQueue` 文本。

`PriorityBlockingQueue` 是一个无界限的并发队列。它使用与 `java.util.PriorityQueue` 类相同的排序规则。你不能向此队列中插入空值。

所有插入到 `PriorityBlockingQueue` 的元素必须实现 `java.lang.Comparable` 接口。
因此，元素会根据你在 `Comparable` 实现中决定的优先级进行排序。

注意，`PriorityBlockingQueue` 并不强制执行具有相等优先级（compare() == 0）的元素的任何特定行为。

还请注意，如果你从 `PriorityBlockingQueue` 获取一个 `Iterator`，`Iterator` 不保证以优先级顺序迭代元素。

以下是如何使用 `PriorityBlockingQueue` 的示例：

```java
BlockingQueue<String> queue = new PriorityBlockingQueue<>();

// String 实现了 java.lang.Comparable
queue.put("Value");

String value = queue.take();
```

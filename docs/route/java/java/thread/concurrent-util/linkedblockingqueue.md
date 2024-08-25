# LinkedBlockingQueue

`LinkedBlockingQueue` 类实现了 `BlockingQueue` 接口。
有关该接口的更多信息，请阅读 `BlockingQueue` 文本。

`LinkedBlockingQueue` 在内部的链接结构（链接节点）中保存元素。
这个链接结构可以选择性地有一个上限。如果没有指定上限，
`Integer.MAX_VALUE` 被用作上限。

`LinkedBlockingQueue` 内部按 FIFO（先进先出）顺序存储元素。
队列的 `head` 是在队列中时间最长的元素，而队列的 `tail` 是在队列中时间最短的元素。

以下是如何实例化和使用 `LinkedBlockingQueue` 的示例：

```java
BlockingQueue<String> unbounded = new LinkedBlockingQueue<String>();
BlockingQueue<String> bounded = new LinkedBlockingQueue<String>(1024);

bounded.put("Value");

String value = bounded.take();
```


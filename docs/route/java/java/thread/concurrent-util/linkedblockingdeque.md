# LinkedBlockingDeque

`LinkedBlockingDeque` 类实现了 `BlockingDeque` 接口。
有关该接口的更多信息，请阅读 `BlockingDeque` 文本。

"Deque" 这个词来自 "Double Ended Queue"（双端队列）这个术语。因此，`Deque` 是一个队列，你可以从队列的两端插入和移除元素。

`LinkedBlockingDeque` 是一个 `Deque`，如果线程尝试在它为空时从中取出元素，无论线程尝试从哪一端取出元素，它都会阻塞。

以下是如何实例化和使用 `LinkedBlockingDeque` 的示例：

```java
BlockingDeque<String> deque = new LinkedBlockingDeque<>();

deque.addFirst("1");
deque.addLast("2");

String two = deque.takeLast();
String one = deque.takeFirst();
```


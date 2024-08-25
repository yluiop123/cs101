# ArrayBlockingQueue

`ArrayBlockingQueue` 类实现了 `BlockingQueue` 接口。
有关该接口的更多信息，请阅读 `BlockingQueue` 文本。

`ArrayBlockingQueue` 是一个有界限的阻塞队列，它在内部数组中存储元素。
它有界限意味着它不能存储无限数量的元素。它能够同时存储的元素数量有一个上限。
在实例化时设置这个上限，之后就不能再更改了。

`ArrayBlockingQueue` 内部按 FIFO（先进先出）顺序存储元素。
队列的 `head` 是在队列中时间最长的元素，队列的 `tail` 是在队列中时间最短的元素。

以下是如何实例化和使用 `ArrayBlockingQueue` 的示例：

```java
BlockingQueue queue = new ArrayBlockingQueue(1024);

queue.put("1");

Object object = queue.take();
```

以下是一个使用 Java 泛型的 `BlockingQueue` 示例。注意你可以直接放入和取出 String 对象，而不是：

```java
BlockingQueue<String> queue = new ArrayBlockingQueue<String>(1024);

queue.put("1");

String string = queue.take();
```


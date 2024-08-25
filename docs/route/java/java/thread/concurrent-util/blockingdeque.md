# BlockingDeque

`java.util.concurrent` 类中的 `BlockingDeque` 接口代表了一个线程安全的双端队列，可以安全地向其中放入元素，也可以从中取出实例。本文将展示如何使用 `BlockingDeque`。

`BlockingDeque` 类是一个在尝试插入或从双端队列中移除元素时，如果无法进行这些操作，则会阻塞线程的 `Deque`。
"deque" 是 "Double Ended Queue" 的缩写。因此，`deque` 是一个队列，你可以从两端插入和取出元素。

## BlockingDeque 使用

如果多个线程同时生产和消费同一个队列中的元素，或者生产线程需要在队列的两端插入元素，消费线程需要从队列的两端移除元素，那么可以使用 `BlockingDeque`。以下是这种情况的示意图：

|  |
| --- |
| ![img](./image/blocking-deque.png) |
| **一个 BlockingDeque - 线程可以从双端队列的两端放入和取出元素。** |

一个线程将生产元素并将其插入队列的任一端。如果双端队列当前已满，插入线程将被阻塞，直到一个移除线程从双端队列中取出一个元素。如果双端队列当前为空，移除线程将被阻塞，直到一个插入线程将元素插入双端队列。

### BlockingDeque 方法

`BlockingDeque` 有 4 组不同的方法用于插入、移除和检查双端队列中的元素。如果请求的操作不能立即执行，每组方法的行为各不相同。以下是方法表：

|  | **抛出异常** | **特殊值** | **阻塞** | **超时** |
| --- | --- | --- | --- | --- |
| **插入** | `addFirst(o)` | `offerFirst(o)` | `putFirst(o)` | `offerFirst(o, timeout, timeunit)` |
| **移除** | `removeFirst(o)` | `pollFirst(o)` | `takeFirst(o)` | `pollFirst(timeout, timeunit)` |
| **检查** | `getFirst(o)` | `peekFirst(o)` |  |  |

|  | **抛出异常** | **特殊值** | **阻塞** | **超时** |
| --- | --- | --- | --- | --- |
| **插入** | `addLast(o)` | `offerLast(o)` | `putLast(o)` | `offerLast(o, timeout, timeunit)` |
| **移除** | `removeLast(o)` | `pollLast(o)` | `takeLast(o)` | `pollLast(timeout, timeunit)` |
| **检查** | `getLast(o)` | `peekLast(o)` |  |  |

4 种不同的行为组表示：

1. **抛出异常**：
   如果尝试的操作不能立即执行，则抛出异常。
2. **特殊值**：
   如果尝试的操作不能立即执行，则返回一个特殊值（通常是 true / false）。
3. **阻塞**：
   如果尝试的操作不能立即执行，则方法调用将阻塞，直到可以执行。
4. **超时**：
   如果尝试的操作不能立即执行，则方法调用将阻塞，但不会等待超过给定的超时时间。返回一个特殊值，指示操作是否成功（通常是 true / false）。

## BlockingDeque 扩展了 BlockingQueue

`BlockingDeque` 接口扩展了 `BlockingQueue` 接口。这意味着你可以将 `BlockingDeque` 用作 `BlockingQueue`。如果这样做，各种插入方法将把元素添加到双端队列的末尾，而移除方法将从双端队列的开头移除元素。即 `BlockingQueue` 接口的插入和移除方法。

以下是 `BlockingQueue` 方法在 `BlockingDeque` 实现中的作用表：

| BlockingQueue | BlockingDeque |
| --- | --- |
| add() | addLast() |
| offer() x 2 | offerLast() x 2 |
| put() | putLast() |
| remove() | removeFirst() |
| poll() x 2 | pollFirst() |
| take() | takeFirst() |
| element() | getFirst() |
| peek() | peekFirst() |

## BlockingDeque 实现

由于 `BlockingDeque` 是一个接口，你需要使用它的许多实现之一来使用它。
`java.util.concurrent` 包有以下 `BlockingDeque` 接口的实现：

- LinkedBlockingDeque

## BlockingDeque 代码示例

以下是如何使用 `BlockingDeque` 方法的一个小代码示例：

```java
BlockingDeque<String> deque = new LinkedBlockingDeque<>();

deque.addFirst("1");
deque.addLast("2");

String two = deque.takeLast();
String one = deque.takeFirst();
```

\

# Semaphore

`java.util.concurrent.Semaphore` 类是一个计数信号量。
这意味着它有两个主要方法：
- acquire()
- release()

计数信号量用给定数量的“许可证”初始化。每个 `acquire()` 调用都会由调用线程取出一个许可证。每个 `release()` 调用都会向信号量返回一个许可证。
因此，最多 N 个线程可以在没有 `release()` 调用的情况下通过 `acquire()` 方法，其中 N 是信号量初始化时许可证的数量。许可证只是一个简单的计数器。
这里没什么花哨的。

## 信号量使用

信号量通常有两个用途：
1. 防止超过 N 个线程同时进入临界区。
2. 在两个线程之间发送信号。

### 保护临界区

如果你想使用信号量来保护临界区，试图进入临界区的线程通常会首先尝试获取一个许可证，进入临界区，然后再次释放许可证。像这样：

```java
Semaphore semaphore = new Semaphore(1);

// 临界区
semaphore.acquire();

...
// 临界区代码

semaphore.release();
```

### 线程间发送信号

如果你想使用信号量在线程之间发送信号，那么通常会有一个线程调用 `acquire()` 方法，另一个线程调用 `release()` 方法。

如果没有许可证可用，`acquire()` 调用将被阻塞，直到另一个线程释放许可证。同样，如果不能再向这个信号量中释放更多的许可证，`release()` 调用也会被阻塞。

因此，可以协调线程。例如，如果获取操作是在线程 1 在共享列表中插入一个对象之后调用的，而线程 2 在从列表中取出对象之前调用了 `release()`，那么你基本上就创建了一个阻塞队列。信号量中可用的许可证数量将对应于阻塞队列可以持有的最大元素数量。

## 公平性

`Semaphore` 从信号量获取许可证的线程没有公平性的保证。也就是说，没有保证第一个调用 `acquire()` 的线程也是第一个获得许可证的线程。如果第一个线程被阻塞等待许可证，那么第二个线程在许可证刚被释放时检查许可证，实际上可能会在线程 1 之前获得许可证。

如果你想强制公平性，`Semaphore` 类有一个构造函数，它接受一个布尔值，告诉信号量是否应该强制公平性。强制公平性会带来性能/并发的惩罚，所以除非你需要它，否则不要启用它。

以下是如何在公平模式下创建 `Semaphore`：

```java
Semaphore semaphore = new Semaphore(1, true);
```

## 更多方法

`java.util.concurrent.Semaphore` 类有更多的方法。例如：
- `availablePermits()`
- `acquireUninterruptibly()`
- `drainPermits()`
- `hasQueuedThreads()`
- `getQueuedThreads()`
- `tryAcquire()`
- `等等。`

查看 JavaDoc 以获取这些方法的更多详细信息。



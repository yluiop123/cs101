# ReadWriteLock

## 概述
`java.util.concurrent.locks.ReadWriteLock` 是一种高级线程锁机制。
它允许多个线程同时读取某个资源，但一次只能有一个线程写入。

这个想法是，多个线程可以从共享资源中读取而不会引起并发错误。
当对共享资源的读取和写入同时发生，或者同时发生多个写入时，才会首次出现并发错误。

在本文中，我只介绍Java内置的 `ReadWriteLock`。如果你想阅读更多关于ReadWriteLock实现背后的理论，你可以在我的Java并发教程中阅读有关读写锁的文本。

## ReadWriteLock 锁定规则
线程被允许锁定 `ReadWriteLock` 以读取或写入受保护资源的规则如下：

| 锁类型 | 锁定条件 |
| --- | --- |
| **读锁** | 如果没有线程锁定 `ReadWriteLock` 进行写入，<br>并且没有线程请求写锁（但尚未获得）。<br><br>因此，多个线程可以锁定锁进行读取。 |
| **写锁** | 如果没有线程正在读取或写入。<br>因此，一次只能有一个线程锁定锁进行写入。 |

## ReadWriteLock 实现
`ReadWriteLock` 是一个接口。因此，要使用 `ReadWriteLock`，你需要使用它的实现类。

`java.util.concurrent.locks` 包包含以下 `ReadWriteLock` 实现：

- ReentrantReadWriteLock

## ReadWriteLock 代码示例
以下是一个简单的代码示例，展示了如何创建一个 `ReadWriteLock` 以及如何对其进行读写锁定：

```java
ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

readWriteLock.readLock().lock();

    // 多个读取者可以进入此部分
    // 如果没有锁定进行写入，并且没有写入者等待
    // 锁定进行写入。

readWriteLock.readLock().unlock();

readWriteLock.writeLock().lock();

    // 只有一个写入者可以进入此部分，
    // 并且只有在没有线程当前正在读取时。

readWriteLock.writeLock().unlock();
```

注意 `ReadWriteLock` 实际上内部保持了两个 `Lock` 实例。一个用于保护读访问，另一个用于保护写访问。


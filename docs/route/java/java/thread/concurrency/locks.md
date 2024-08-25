# Java中的锁

锁是一种线程同步机制，与同步块类似，但锁可以比Java的同步块更复杂。锁（以及其他更高级的同步机制）是使用同步块创建的，所以我们不能完全摆脱`synchronized`关键字。

从Java 5开始，`java.util.concurrent.locks`包包含几个锁实现，所以您可能不必自己实现锁。但您仍需要知道如何使用它们，了解它们实现背后的理论仍然有用。更多详情请查看我的教程`java.util.concurrent.locks.Lock`接口。

## 一个简单的锁

让我们先看看Java代码中的同步块：

```java
public class Counter {
    private int count = 0;

    public int inc() {
        synchronized (this) {
            return ++count;
        }
    }
}
```

注意`inc()`方法中的`synchronized(this)`块。这个块确保一次只有一个线程可以执行`return ++count`。同步块中的代码可能更复杂，但简单的`++count`足以说明问题。

`Counter`类也可以使用`Lock`而不是同步块来编写，如下所示：

```java
public class Counter {
    private Lock lock = new Lock();
    private int count = 0;

    public int inc() {
        lock.lock();
        int newCount = ++count;
        lock.unlock();
        return newCount;
    }
}
```

`lock()`方法锁定`Lock`实例，以便所有调用`lock()`的线程都被阻塞，直到执行`unlock()`。

这是一个简单的`Lock`实现：

```java
public class Lock {
    private boolean isLocked = false;

    public synchronized void lock() throws InterruptedException {
        while (isLocked) {
            wait();
        }
        isLocked = true;
    }

    public synchronized void unlock() {
        isLocked = false;
        notify();
    }
}
```

注意`while(isLocked)`循环，也称为“自旋锁”。自旋锁和`wait()`、`notify()`方法在文本“线程信号”中有更详细的介绍。当`isLocked`为真时，调用`lock()`的线程在`wait()`调用中等待。如果线程意外地从wait()调用中返回，而没有收到`notify()`调用（即虚假唤醒），线程会重新检查`isLocked`条件，以确定是否可以继续，而不是假设被唤醒就表示可以继续。如果`isLocked`为假，线程退出`while(isLocked)`循环，并重新设置`isLocked`为真，为其他调用`lock()`的线程锁定`Lock`实例。

当线程完成临界区代码（`lock()`和`unlock()`之间的代码）后，线程调用`unlock()`。执行`unlock()`将`isLocked`重新设置为假，并通知（唤醒）在`lock()`方法的`wait()`调用中等待的一个线程，如果有的话。

## 锁的可重入性

Java的同步块是可重入的。这意味着，如果一个Java线程进入一个同步块的代码，并因此获取该块同步的监视器对象的锁，该线程可以进入其他Java代码块，这些代码块也同步在同一监视器对象上。以下是一个例子：

```java
public class Reentrant {
    public synchronized outer() {
        inner();
    }

    public synchronized inner() {
        //执行一些操作
    }
}
```

注意`outer()`和`inner()`都声明为同步的，在Java中等同于`synchronized(this)`块。如果一个线程调用`outer()`，在`outer()`内部调用inner()是没有问题的，因为两个方法（或块）都同步在同一监视器对象（"this"）上。如果一个线程已经持有监视器对象的锁，它就可以访问所有同步在同一监视器对象上的块。这称为可重入性。线程可以重新进入任何它已经持有锁的代码块。

然而，即使同步块是可重入的，前面显示的`Lock`类也不是可重入的。如果我们像下面这样重写`Reentrant`类，调用`outer()`的线程将在`inner()`方法中的`lock.lock()`内被阻塞。

```java
public class Reentrant2 {
    Lock lock = new Lock();

    public outer() {
        lock.lock();
        inner();
        lock.unlock();
    }

    public synchronized inner() {
        lock.lock();
        //执行一些操作
        lock.unlock();
    }
}
```

调用`outer()`的线程首先锁定`Lock`实例。然后它将调用`inner()`。在`inner()`方法内部，线程将再次尝试锁定`Lock`实例。这将失败（即线程将被阻塞），因为`Lock`实例已经在`outer()`方法中被锁定了。

当我们查看`lock()`实现时，就清楚了为什么线程在第二次调用`lock()`时没有在中间调用`unlock()`就会被阻塞：

```java
public class Lock {
    boolean isLocked = false;

    public synchronized void lock() throws InterruptedException {
        while (isLocked) {
            wait();
        }
        isLocked = true;
    }

    ...
}
```

正是while循环（自旋锁）中的条件决定线程是否被允许退出`lock()`方法。目前的条件下，`isLocked`必须为`false`才能允许，无论哪个线程锁定了它。

要使`Lock`类可重入，我们需要进行小改动：

```java
public class Lock {
    boolean isLocked = false;
    Thread lockedBy = null;
    int lockedCount = 0;

    public synchronized void lock() throws InterruptedException {
        Thread callingThread = Thread.currentThread();
        while (isLocked && lockedBy != callingThread) {
            wait();
        }
        isLocked = true;
        lockedCount++;
        lockedBy = callingThread;
    }

    public synchronized void unlock() {
        if (Thread.currentThread() == this.lockedBy) {
            lockedCount--;

            if (lockedCount == 0) {
                isLocked = false;
                notify();
            }
        }
    }

    ...
}
```

注意while循环（自旋锁）现在也考虑了锁定`Lock`实例的线程。如果锁未锁定（`isLocked` = false）或调用线程是锁定`Lock`实例的线程，则while循环不会执行，调用`lock()`的线程将被允许退出方法。

此外，我们需要统计同一个线程锁定锁的次数。否则，即使锁被锁定了多次，一个`unlock()`调用也会解锁锁。我们不希望锁在锁定它的线程执行了与`lock()`调用次数相同的`unlock()`调用次数之前就被解锁。

现在`Lock`类是可重入的。

## 锁的公平性

Java的同步块不保证尝试进入它们的线程被授权访问的顺序。因此，如果许多线程不断争夺对同一同步块的访问权，就有风险，一个或多个线程永远不会被授权访问——访问权总是授予其他线程。这称为饥饿。为了避免这种情况，`Lock`应该是公平的。
由于本文中显示的`Lock`实现在内部使用同步块，它们不保证公平性。饥饿和公平性在“饥饿与公平性”文本中有更详细的讨论。

## 在finally子句中调用unlock()

当使用`Lock`保护临界区，并且临界区可能会抛出异常时，重要的是要从`finally`子句中调用`unlock()`方法。这样做确保了`Lock`被解锁，以便其他线程可以锁定它。以下是一个例子：

```java
lock.lock();
try {
  //执行可能抛出异常的临界区代码
} finally {
  lock.unlock();
}

```

这个小结构确保了如果从临界区代码抛出异常，`Lock`将被解锁。如果没有在`finally`子句中调用`unlock()`，并且从临界区抛出了异常，`Lock`将永远被锁定，导致所有调用该`Lock`实例上的`lock()`的线程无限期地暂停。

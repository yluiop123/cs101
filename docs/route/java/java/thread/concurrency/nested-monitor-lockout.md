# 嵌套监视器锁定是如何发生的

嵌套监视器锁定是一个类似于死锁的问题。嵌套监视器锁定发生如下：

```plaintext
Thread 1 在 A 上进行同步
Thread 1 在 A 同步的情况下在 B 上同步（while synchronized on A）
Thread 1 决定在继续之前等待另一个线程的信号
Thread 1 调用 B.wait() 因此释放了对 B 的锁定，但没有释放 A。
Thread 2 需要锁定 A 和 B（按该顺序）
      为了发送信号给 Thread 1。
Thread 2 无法锁定 A，因为 Thread 1 仍然持有 A 的锁定。
Thread 2 无限期地被阻塞等待 Thread1
      释放 A 上的锁定
Thread 1 无限期地被阻塞等待来自
      Thread 2 的信号，从而
      从未释放对 A 的锁定，这必须被释放才能使
      Thread 2 能够向 Thread 1 发送信号，等等。
```

这听起来可能是一个相当理论的情况，但看看下面简单的`Lock`实现：

```java
//带有嵌套监视器锁定问题锁的实现

public class Lock {
    protected MonitorObject monitorObject = new MonitorObject();
    protected boolean isLocked = false;

    public void lock() throws InterruptedException {
        synchronized (this) {
            while (isLocked) {
                synchronized (this.monitorObject) {
                    this.monitorObject.wait();
                }
            }
            isLocked = true;
        }
    }

    public void unlock() {
        synchronized (this) {
            this.isLocked = false;
            synchronized (this.monitorObject) {
                this.monitorObject.notify();
            }
        }
    }
}
```

注意`lock()`方法首先在"this"上同步，然后在`monitorObject`成员上同步。如果`isLocked`是false，就没有问题。调用`lock()`的线程不会调用`monitorObject.wait()`。然而，如果`isLocked`是true，调用`lock()`的线程会在`monitorObject.wait()`调用中被暂停。

这个问题在于，调用`monitorObject.wait()`只释放了对`monitorObject`成员的监视器锁定，而没有释放与"this"相关联的同步监视器。换句话说，刚刚被暂停等待的线程仍然持有"this"的同步锁。

当最初锁定`Lock`的线程尝试通过调用`unlock()`来解锁时，它将被阻塞尝试进入`unlock()方法`中的`synchronized(this)`块。它将被阻塞，直到在`lock()`中等待的线程离开`synchronized(this)`块。但是，在`lock()`方法中等待的线程不会离开那个块，直到`isLocked`被设置为false，并执行`monitorObject.notify()`，正如在`unlock()`中发生的那样。

简而言之，`lock()`中等待的线程需要`unlock()`调用成功执行，以便它退出`lock()`和其中的同步块。但是，实际上没有任何线程可以执行`unlock()`，直到在`lock()`中等待的线程离开外部同步块。

结果是任何调用`lock()`或`unlock()`的线程将被无限期地阻塞。这被称为嵌套监视器锁定。

## 更现实的例子

您可能会声称您永远不会实现像前面展示的那样的锁。您不会在内部监视器对象上调用`wait()`和`notify()`，而是在"this"上调用。这可能是真的。但是有些情况下可能会出现像上面这样的设计。例如，如果您要实现锁的公平性。

在这样做时，您希望每个线程在它们各自的队列对象上调用`wait()`，以便您可以一次通知一个线程。

看看这个简单公平锁的实现：

```java
//带有嵌套监视器锁定问题的公平锁实现

public class FairLock {
    private boolean isLocked = false;
    private Thread lockingThread = null;
    private List<QueueObject> waitingThreads = new ArrayList<>();

    public void lock() throws InterruptedException {
        QueueObject queueObject = new QueueObject();

        synchronized (this) {
            waitingThreads.add(queueObject);

            while (isLocked || waitingThreads.get(0) != queueObject) {
                synchronized (queueObject) {
                    try {
                        queueObject.wait();
                    } catch (InterruptedException e) {
                        waitingThreads.remove(queueObject);
                        throw e;
                    }
                }
            }
            waitingThreads.remove(queueObject);
            isLocked = true;
            lockingThread = Thread.currentThread();
        }
    }

    public synchronized void unlock() {
        if (this.lockingThread != Thread.currentThread()) {
            throw new IllegalMonitorStateException(
                "Calling thread has not locked this lock");
        }
        isLocked = false;
        lockingThread = null;
        if (waitingThreads.size() > 0) {
            QueueObject queueObject = waitingThreads.get(0);
            synchronized (queueObject) {
                queueObject.notify();
            }
        }
    }
}

public class QueueObject {}
```

乍一看，这个实现可能看起来不错，但注意`lock()`方法如何在两个同步块内调用`queueObject.wait();`。一个在"this"上同步，嵌套在内的是在一个局部变量`queueObject`上同步的块。

当一个线程调用`queueObject.wait()`时，它释放了对`QueueObject`实例的锁定，但没有释放与"this"相关联的锁定。

还要注意，`unlock()`方法被声明为同步的，这等于一个`synchronized(this)`块。这意味着，如果有线程在`lock()`内等待，与"this"相关联的监视器对象将被等待线程锁定。所有调用`unlock()`的线程将无限期地被阻塞，等待等待线程释放对"this"的锁定。但这永远不会发生，因为这只有在线程成功向等待线程发送信号时才会发生，而这个信号只能通过执行`unlock()`方法来发送。

因此，上面的FairLock实现可能导致嵌套监视器锁定。

公平锁的更好实现在“饥饿与公平性”文本中有所描述。

## 嵌套监视器锁定与死锁

嵌套监视器锁定和死锁的结果几乎相同：涉及的线程最终被永远阻塞，等待彼此。

但这两种情况并不相同。正如死锁文本中所解释的，死锁发生在两个线程以不同顺序获取锁时。线程1锁定A，等待B。线程2锁定了B，现在等待A。如死锁预防文本中所解释，通过始终以相同的顺序锁定锁（锁排序），可以避免死锁。然而，嵌套监视器锁定正是由于两个线程以**相同的顺序**获取锁而发生的。线程1锁定A和B，然后释放B并等待来自线程2的信号。线程2需要A和B两个来向线程1发送信号。所以，一个线程在等待信号，另一个在等待锁被释放。

差异可以概括如下：

```plaintext
在死锁中，两个线程正在等待彼此释放锁。

在嵌套监视器锁定中，线程1持有锁A，并等待来自线程2的信号。线程2需要锁A才能向线程1发送信号。
```


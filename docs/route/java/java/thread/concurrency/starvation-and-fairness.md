# 饥饿与公平性

如果一个线程因为其他线程占用了所有CPU时间而没有获得CPU时间，这种情况被称为“饥饿”。这个线程因为其他线程被允许使用CPU时间而“饿死”。解决饥饿的方法叫做“公平性”——即所有线程都被公平地给予执行的机会。

## Java中导致饥饿的原因

下面三个常见的原因可能导致Java中的线程饥饿：

1. 高优先级的线程吞噬了所有低优先级线程的CPU时间。
2. 线程被无限期地阻塞，等待进入同步块，因为其他线程不断地被允许进入。
3. 等待对象的线程（调用了wait()）无限期地等待，因为其他线程总是被唤醒而不是它。

### 高优先级的线程吞噬了低优先级线程的所有CPU时间

您可以为每个线程单独设置线程优先级。优先级越高，线程获得的CPU时间越多。您可以将线程的优先级设置在1到10之间。具体如何解释这取决于您的应用程序运行的操作系统。对于大多数应用程序来说，最好保持优先级不变。

### 线程被无限期地阻塞等待进入同步块

Java的同步代码块可能是导致饥饿的另一个原因。Java的同步代码块没有保证等待进入同步块的线程被允许进入的顺序。这意味着从理论上讲，一个线程可能永远被阻塞，试图进入块，因为其他线程总是在它之前被允许进入。这个问题被称为“饥饿”，即一个线程因为其他线程被允许使用CPU时间而“饿死”。

### 等待对象的线程（调用了wait()）无限期地等待

notify()方法没有保证如果有多个线程调用了对象上的wait()，哪个线程将被唤醒。它可能是等待的任何线程。因此，一个等待某个特定对象的线程可能永远不会被唤醒，因为其他等待的线程总是被唤醒而不是它。

## 在Java中实现公平性

虽然在Java中不可能实现100%的公平性，我们仍然可以实现我们的同步构造来提高线程之间的公平性。

首先让我们学习一个简单的同步代码块：

```java
public class Synchronizer {
    public synchronized void doSynchronized() {
        //执行需要很长时间的大量工作
    }
}
```

如果有多个线程调用doSynchronized()方法，它们中的一些将被阻塞，直到第一个获得访问权限的线程离开方法。如果有多个线程被阻塞等待访问，就没有保证哪个线程将被下一个授予访问权限。

### 使用锁而不是同步块

为了提高等待线程的公平性，我们首先将代码块更改为由锁而不是同步块保护：

```java
public class Synchronizer {
    Lock lock = new Lock();

    public void doSynchronized() throws InterruptedException {
        this.lock.lock();
        //临界区，执行需要很长时间的大量工作
        this.lock.unlock();
    }
}
```

注意doSynchronized()方法不再声明为synchronized。相反，关键部分由lock.lock()和lock.unlock()调用保护。

一个简单的Lock类的实现可能如下所示：

```java
public class Lock {
    private boolean isLocked = false;
    private Thread lockingThread = null;

    public synchronized void lock() throws InterruptedException {
        while (isLocked) {
            wait();
        }
        isLocked = true;
        lockingThread = Thread.currentThread();
    }

    public synchronized void unlock() {
        if (this.lockingThread != Thread.currentThread()) {
            throw new IllegalMonitorStateException("调用线程没有锁定此锁");
        }
        isLocked = false;
        lockingThread = null;
        notify();
    }
}
```

如果您查看上面的Synchronizer类，并查看此Lock实现，您会发现如果多个线程同时调用lock()，现在线程在尝试访问lock()方法时会被阻塞。其次，如果锁被锁定，线程在lock()方法中的while(isLocked)循环内的wait()调用中被阻塞。记住，调用wait()的线程会释放对Lock实例的同步锁，因此等待进入lock()的线程现在可以做到。结果是，多个线程最终可能会在lock()中调用wait()。

如果您回顾doSynchronized()方法，您会注意到在lock()和unlock()之间的注释指出，这两个调用之间的代码执行时间很长。让我们进一步假设，与进入lock()方法和调用wait()相比，因为锁被锁定，这段代码的执行时间很长。这意味着大多数等待锁定锁并进入关键部分的时间都花在lock()方法内的wait()调用中等待，而不是被阻塞尝试进入lock()方法。

正如前面所述，如果多个线程等待进入，同步块不保证哪个线程将被授予访问权限。同样，当调用notify()时，wait()也不保证哪个线程将被唤醒。所以，Lock类的当前版本在公平性方面与doSynchronized()的同步版本没有不同的保证。但我们可以改变这一点。

当前版本的Lock类调用它自己的wait()方法。如果每个线程在不同的对象上调用wait()，以便只有一个线程在每个对象上调用wait()，Lock类可以决定在哪个对象上调用notify()，从而有效地选择唤醒哪个线程。

### 一个公平的锁

下面显示的是之前的Lock类变成了一个名为FairLock的公平锁。您会注意到，与之前显示的Lock类相比，实现在同步和`wait()`/`notify()`方面有所改变。

我是如何从上一个Lock类开始，通过几个增量设计步骤，每一步都解决了前一步的问题：嵌套监视器锁定、滑动条件和错过的信号，这是一个更长的故事。为了保持文本简短，这部分讨论没有包含在本文中，但每个步骤都在适当主题的适当文本中讨论了（见上面的链接）。重要的是，现在每个调用`lock()`的线程都被排队，只有队列中的第一个线程被允许锁定FairLock实例，如果它没有被锁定。所有其他线程都在等待，直到它们到达队列的顶部。

```java
public class FairLock {
    private boolean isLocked = false;
    private Thread lockingThread = null;
    private List<QueueObject> waitingThreads = new ArrayList<>();

    public void lock() throws InterruptedException {
        QueueObject queueObject = new QueueObject();
        boolean isLockedForThisThread = true;
        synchronized (this) {
            waitingThreads.add(queueObject);
        }

        while (isLockedForThisThread) {
            synchronized (this) {
                isLockedForThisThread =
                    isLocked || waitingThreads.get(0) != queueObject;
                if (!isLockedForThisThread) {
                    isLocked = true;
                    waitingThreads.remove(queueObject);
                    lockingThread = Thread.currentThread();
                    return;
                }
            }
            try {
                queueObject.doWait();
            } catch (InterruptedException e) {
                synchronized (this) {
                    waitingThreads.remove(queueObject);
                }
                throw e;
            }
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
            waitingThreads.get(0).doNotify();
        }
    }
}

public class QueueObject {
    private boolean isNotified = false;

    public synchronized void doWait() throws InterruptedException {
        while (!isNotified) {
            this.wait();
        }
        this.isNotified = false;
    }

    public synchronized void doNotify() {
        this.isNotified = true;
        this.notify();
    }

    public boolean equals(Object o) {
        return this == o;
    }
}
```

首先，您可能会注意到`lock()`方法不再声明为`synchronized`。相反，只有必要的块嵌套在`synchronized`块内进行同步。

FairLock为每个调用`lock()`的线程创建一个新的`QueueObject`实例并将其入队。

调用`unlock()`的线程将取出队列中的顶部`QueueObject`并调用其上的`doNotify()`，以唤醒等待该对象的线程。这样一次只唤醒一个等待的线程，而不是所有等待的线程。这部分是`FairLock`公平性的控制。

注意锁的状态仍然在同一个同步块内测试和设置，以避免滑动条件。

还要注意，`QueueObject`实际上是一个信号量。`doWait()`和`doNotify()`方法在`QueueObject`内部存储信号。这是为了避免由于线程在调用`queueObject.doWait()`之前被抢占，由另一个调用`unlock()`并因此调用`queueObject.doNotify()`的线程引起的错过信号。`queueObject.doWait()`调用被放置在`synchronized(this)`块外面，以避免嵌套监视器锁定，这样当没有线程在`lock()`方法的`synchronized(this)`块内执行时，另一个线程实际上可以调用unlock()。

最后，注意`queueObject.doWait()`是如何在`try - catch`块中调用的。如果抛出InterruptedException，线程将离开lock()方法，我们需要将其出队。

### 关于性能的说明

如果您比较`Lock`和`FairLock`类，您会发现`FairLock`类中的`lock()`和`unlock()`有更多的操作。这些额外的代码将使`FairLock`成为一个比`Lock`稍微慢的同步机制。这对您的应用程序有多大影响取决于由`FairLock`保护的关键部分代码执行的时间长度。这段代码执行时间越长，同步器的额外开销就越不重要。当然，这也取决于这段代码被调用的频率。


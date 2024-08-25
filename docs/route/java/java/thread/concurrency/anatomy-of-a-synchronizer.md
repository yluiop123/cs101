# 同步器剖析

尽管许多同步器（锁、信号量、阻塞队列等）在功能上各不相同，但它们在内部设计上往往并没有太大差异。换句话说，它们在内部由相同或相似的基本部分组成。了解这些基本部分对于设计同步器非常有帮助。本文将更详细地探讨这些部分。

**注意**：本文内容是哥本哈根信息技术大学2004年春季M.Sc.学生项目的一部分，由Jakob Jenkov、Toke Johansen和Lars Bjørn完成。在该项目中，我们询问了Doug Lea是否知道类似的工作。有趣的是，他在开发Java 5并发工具时，独立于本项目得出了类似的结论。我相信Doug Lea的工作在《Java并发实践》一书中有所描述。该书还包含了一个标题为"同步器剖析"的章节，内容与本文相似，但并不完全相同。

大多数（如果不是全部）同步器的目的是保护代码的某个区域（临界区）不受线程的并发访问。为此，同步器通常需要以下部分：

1. 状态
2. 访问条件
3. 状态变化
4. 通知策略
5. 测试并设置方法
6. 设置方法

并非所有同步器都包含所有这些部分，包含这些部分的同步器也可能与这里描述的不完全相同。通常你可以找到这些部分中的一个或多个。

## 状态

同步器的状态由访问条件用来确定是否可以授予线程访问权限。在锁中，状态保存在一个`boolean`中，表示`Lock`是否被锁定。在有界信号量中，内部状态保存在一个计数器（int）和一个上限（int）中，分别表示当前的"获取"数量和"获取"的最大数量。在阻塞队列中，状态保存在队列中的元素列表（List）和最大队列大小（int）成员中（如果有的话）。

以下是`Lock`和`BoundedSemaphore`的两个代码片段。状态代码用粗体标记。

```java
public class Lock {
  //状态保存在这里
  private boolean isLocked = false;

  public synchronized void lock()
  throws InterruptedException{
    while(isLocked){
      wait();
    }
    isLocked = true;
  }

  ...
}
```

```java
public class BoundedSemaphore {
  //状态保存在这里
  private int signals = 0;
  private int bound   = 0;

  public BoundedSemaphore(int upperBound){
    this.bound = upperBound;
  }

  public synchronized void take() throws InterruptedException{
    while(this.signals == bound) wait();
    this.signal++; // 此处应为 signals++，原文有误
    this.notify();
  }
  ...
}
```

## 访问条件

访问条件决定了调用测试并设置状态方法的线程是否可以被允许设置状态。访问条件通常基于同步器的状态。访问条件通常在while循环中检查，以防止虚假唤醒。当评估访问条件时，它要么是真要么是假。

在锁中，访问条件简单地检查`isLocked`成员变量的值。在有界信号量中，实际上有两个访问条件，这取决于你是尝试"获取"还是"释放"信号量。如果线程尝试获取信号量，`signals`变量将与上限进行比较。如果线程尝试释放信号量，`signals`变量将与0进行比较。

以下是`Lock`和`BoundedSemaphore`的两个访问条件的代码片段，访问条件用粗体标记。注意条件总是在while循环内进行检查。

```java
public class Lock {
  ...
  public synchronized void lock()
  throws InterruptedException{
    //访问条件
    while(isLocked){
      wait();
    }
    isLocked = true;
  }
  ...
}
```

```java
public class BoundedSemaphore {
  ...
  public synchronized void take() throws InterruptedException{
    //访问条件
    while(this.signals == bound) wait();
    this.signals++;
    this.notify();
  }

  public synchronized void release() throws InterruptedException{
    //访问条件
    while(this.signals == 0) wait();
    this.signals--;
    this.notify();
  }
}
```

## 状态变化

一旦线程获得了对临界区的访问，它必须改变同步器的状态，以（可能）阻止其他线程进入。换句话说，状态需要反映一个线程现在正在临界区内执行的事实。这应该影响其他尝试获得访问权限的线程的访问条件。

在锁中，状态变化是设置`isLocked = true`的代码。在信号量中，它要么是`signals--`要么是`signals++`的代码。

以下是两个状态变化的代码片段，状态变化代码用粗体标记：

```java
public class Lock {
  ...
  public synchronized void lock()
  throws InterruptedException{
    ...
    //状态变化
    isLocked = true;
  }

  public synchronized void unlock(){
    //状态变化
    isLocked = false;
    notify();
  }
}
```

```java
public class BoundedSemaphore {
  ...
  public synchronized void take() throws InterruptedException{
    ...
    //状态变化
    this.signals++;
    this.notify();
  }

  public synchronized void release() throws InterruptedException{
    ...
    //状态变化
    this.signals--;
    this.notify();
  }
}
```

## 通知策略

一旦线程改变了同步器的状态，有时可能需要通知其他等待线程关于状态变化。也许这个状态变化可能会使其他线程的访问条件变为真。

通知策略通常分为三类：

1. 通知所有等待线程。
2. 随机通知N个等待线程中的1个。
3. 通知N个等待线程中的1个特定线程。

通知所有等待线程非常简单。所有等待线程都在同一对象上调用`wait()`。一旦线程想要通知等待线程，它就在等待线程调用`wait()`的对象上调用`notifyAll()`。

通知单个随机等待线程也非常简单。只需让通知线程在等待线程调用`wait()`的对象上调用`notify()`即可。调用`notify`不保证哪个等待线程会被通知。因此称为"随机等待线程"。

有时你可能需要通知特定而不是随机的等待线程。例如，如果你需要保证等待线程以特定顺序被通知，无论是他们调用同步器的顺序，还是某种优先级顺序。为了实现这一点，每个等待线程必须在自己的、单独的对象上调用`wait()`。当通知线程想要通知特定等待线程时，它将在这个特定线程调用`wait()`的对象上调用`notify()`。这在"饥饿和公平性"文本中可以找到示例。

以下是带有通知策略（随机通知1个等待线程）的代码片段，通知策略用粗体标记：

```java
public class Lock {
  ...
  public synchronized void unlock(){
    isLocked = false;
    notify(); //通知策略
  }
}
```

## 测试并设置方法

同步器通常有两种类型的方法，其中`test-and-set`是第一种类型（另一种是`set`）。测试并设置意味着调用此方法的线程**测试**同步器的内部状态与访问条件。如果条件满足，线程**设置**同步器的内部状态以反映该线程已获得访问权限。

状态转换通常会导致其他尝试获得访问权限的线程的访问条件变为假，但并不总是如此。例如，在读写锁中，获得读访问权限的线程将更新读写锁的状态以反映这一点，但只要没有线程请求写访问权限，其他请求读访问权限的线程也将被允许访问。

执行测试并设置操作必须是原子性的，这意味着在测试和设置状态之间不允许其他线程执行测试并设置方法。

测试并设置方法的程序流程通常如下：

1. 如有必要，在测试之前设置状态
2. 测试状态与访问条件
3. 如果访问条件未满足，等待
4. 如果访问条件满足，设置状态，并在必要时通知等待线程

下面是一个ReadWriteLock类的`lockWrite()`方法的示例。调用`lockWrite()`的线程首先在测试之前设置状态（`writeRequests++`）。然后它在`canGrantWriteAccess()`方法中测试内部状态与访问条件。如果测试成功，方法退出前再次设置内部状态。请注意，此方法不通知等待线程。

```java
public class ReadWriteLock {
  private Map<Thread, Integer> readingThreads = new HashMap<Thread, Integer>();
  private int writeAccesses = 0;
  private int writeRequests = 0;
  private Thread writingThread = null;

  ...

  public synchronized void lockWrite() throws InterruptedException{
    writeRequests++;
    Thread callingThread = Thread.currentThread();
    while(! canGrantWriteAccess(callingThread)){
      wait();
    }
    writeRequests--;
    writeAccesses++;
    writingThread = callingThread;
  }

  ...
}
```

下面显示的`BoundedSemaphore`类有两个测试并设置方法：`take()`和`release()`。两种方法都测试并设置内部状态。

```java
public class BoundedSemaphore {
  private int signals = 0;
  private int bound = 0;

  public BoundedSemaphore(int upperBound){
    this.bound = upperBound;
  }

  public synchronized void take() throws InterruptedException{
    while(this.signals == bound) wait();
    this.signals++;
    this.notify();
  }

  public synchronized void release() throws InterruptedException{
    while(this.signals == 0) wait();
    this.signals--;
    this.notify();
  }
}
```

## 设置方法

设置方法是同步器通常包含的第二种类型的方法。设置方法只设置同步器的内部状态，而不先进行测试。一个典型的设置方法是`Lock`类的`unlock()`方法。持有锁的线程总是可以解锁它，而无需测试`Lock`是否已解锁。

设置方法的程序流程通常如下：

1. 设置内部状态
2. 通知等待线程

以下是`unlock()`方法的示例：

```java
public class Lock {
  private boolean isLocked = false;

  public synchronized void unlock(){
    isLocked = false;
    notify();
  }
}
```




# 信号量 Semaphore

信号量是一种线程同步构造，可以用来在线程之间发送信号以避免错过信号，或者像使用锁一样保护一个临界区。Java 5在`java.util.concurrent`包中提供了信号量的实现，所以你不需要自己实现信号量。不过，了解它们实现和使用背后的理论可能很有用。

Java 5内置了`Semaphore`，所以你不需要自己实现。你可以在我的`java.util.concurrent`教程中阅读更多关于`java.util.concurrent.Semaphore`的内容。

## 简单信号量

这里是一个简单的`Semaphore`实现：

```java
public class Semaphore {
  private boolean signal = false;

  public synchronized void take() {
    this.signal = true;
    this.notify();
  }

  public synchronized void release() throws InterruptedException {
    while(!this.signal) wait();
    this.signal = false;
  }
}
```

`take()`方法在信号量内部发送一个信号。`release()`方法等待一个信号。收到信号后，信号标志再次被清除，`release()`方法退出。

像这样使用信号量，你可以避免错过信号。你会用`take()`代替`notify()`，用`release()`代替`wait()`。如果`take()`的调用发生在`release()`之前，调用`release()`的线程仍然会知道`take()`被调用了，因为信号在`signal`变量内部存储。这与`wait()`和`notify()`不同。

使用信号量进行信号传递时，`take()`和`release()`的名字可能看起来有点奇怪。这些名字来源于信号量作为锁的使用，正如本文后面解释的那样。在那种情况下，这些名字更有意义。

## 使用信号量进行信号传递

这里是一个简化的例子，两个线程使用`Semaphore`相互发送信号：

```java
Semaphore semaphore = new Semaphore();

SendingThread sender = new SendingThread(semaphore);

ReceivingThread receiver = new ReceivingThread(semaphore);

receiver.start();
sender.start();
```

```java
public class SendingThread {
  Semaphore semaphore = null;

  public SendingThread(Semaphore semaphore){
    this.semaphore = semaphore;
  }

  public void run(){
    while(true){
      //做一些事情，然后发送信号
      this.semaphore.take();
    }
  }
}
```

```java
public class ReceivingThread {
  Semaphore semaphore = null;

  public ReceivingThread(Semaphore semaphore){
    this.semaphore = semaphore;
  }

  public void run(){
    while(true){
      this.semaphore.release();
      //接收信号，然后做一些事情...
    }
  }
}
```

## 计数信号量

前一节中的`Semaphore`实现没有计算`take()`方法调用发送给它的信号数量。我们可以改变`Semaphore`实现来这样做。这称为计数信号量。这里是计数信号量的简单实现：

```java
public class CountingSemaphore {
  private int signals = 0;

  public synchronized void take() {
    this.signals++;
    this.notify();
  }

  public synchronized void release() throws InterruptedException {
    while(this.signals == 0) wait();
    this.signals--;
  }
}
```

## 有界信号量

`CountingSemaphore`没有对它可以存储的信号数量设置上限。我们可以改变信号量实现，设置一个上限，如下所示：

```java
public class BoundedSemaphore {
  private int signals = 0;
  private int bound   = 0;

  public BoundedSemaphore(int upperBound){
    this.bound = upperBound;
  }

  public synchronized void take() throws InterruptedException {
    while(this.signals == bound) wait();
    this.signals++;
    this.notify();
  }

  public synchronized void release() throws InterruptedException {
    while(this.signals == 0) wait();
    this.signals--;
    this.notify();
  }
}
```

注意`take()`方法现在如果信号数量等于上限就会阻塞。只有在调用了`release()`之后，调用`take()`的线程才被允许发送其信号，如果`BoundedSemaphore`已经达到了其信号上限。

## 将信号量用作锁

可以使用有界信号量作为锁。为此，将上限设置为1，并让`take()`和`release()`调用保护临界区。这里是一个例子：

```java
BoundedSemaphore semaphore = new BoundedSemaphore(1);

...
semaphore.take();

try{
  //临界区
} finally {
  semaphore.release();
}
```

与信号使用情况不同，现在同一个线程调用`take()`和`release()`方法。由于只允许一个线程获取信号量，所有其他调用`take()`的线程将被阻塞，直到调用`release()`。由于总是先调用`take()`，所以`release()`调用永远不会阻塞。

你还可以使用有界信号量限制进入代码段的线程数量。例如，在上面的例子中，如果你将`BoundedSemaphore`的限制设置为5会怎样？将允许5个线程一次进入临界区。不过，你必须确保这5个线程的操作不冲突，否则你的应用程序将失败。

`release()`方法在finally块中调用，以确保即使从临界区抛出异常也会被调用。



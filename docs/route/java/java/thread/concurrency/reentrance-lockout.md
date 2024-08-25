# 可重入锁排除

可重入锁排除是一种类似于死锁和嵌套监视器锁排除的情况，它也在有关锁和读写锁的文本中部分涉及。

如果一个线程重新进入一个不可重入的锁、读写锁或其他同步器，可能会发生可重入锁排除。可重入意味着已经持有锁的线程可以再次获取它。Java的同步块是可重入的。因此，以下代码将无问题地工作：

```java
public class Reentrant {

  public synchronized outer() {
    inner();
  }

  public synchronized inner() {
    // 执行某些操作
  }
}

```
注意，`outer()` 和 `inner()` 都被声明为同步的，在Java中等同于 `synchronized(this)` 块。如果一个线程调用了 `outer()`，从 `outer()` 内部调用 `inner()` 是没有问题的，因为两个方法（或块）都是同步在同一监视器对象（"this"）上。如果一个线程已经持有监视器对象上的锁，它就可以访问所有在同一个监视器对象上同步的块。这称为可重入。线程可以重新进入任何它已经持有锁的代码块。

以下 `Lock` 实现不是可重入的：

```java
public class Lock {

  private boolean isLocked = false;

  public synchronized void lock()
  throws InterruptedException {
    while(isLocked) {
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

如果一个线程在没有调用中间的 `unlock()` 的情况下两次调用 `lock()`，第二次调用 `lock()` 将被阻塞。已经发生了可重入锁排除。

为了避免可重入锁排除，你有两个选择：

1. 避免编写重新进入锁的代码
2. 使用可重入锁

这些选项中哪一个最适合你的项目取决于你的具体情况。可重入锁通常不像不可重入锁那样性能好，并且它们更难实现，但这在您的情况下可能不是问题。你的代码是否更容易使用或不使用锁可重入性来实现，必须逐案确定。



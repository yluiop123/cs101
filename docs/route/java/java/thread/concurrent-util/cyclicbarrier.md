# CyclicBarrier

`java.util.concurrent.CyclicBarrier` 类是一个同步机制，它可以同步正在通过某个算法进展的线程。换句话说，它是一个所有线程都必须等待的屏障，直到所有线程都到达它，然后这些线程才能继续执行。以下是一张图示说明了这一点：

|  |
| --- |
| ![img](./image/cyclic-barrier.png) |
| **两个线程在 CyclicBarriers 处等待彼此。** |

线程通过调用 `CyclicBarrier` 上的 `await()` 方法相互等待。
一旦 N 个线程在 `CyclicBarrier` 处等待，所有线程都会被释放并可以继续运行。

## 创建 CyclicBarrier

当你创建一个 `CyclicBarrier` 时，你需要指定有多少线程需要在它处等待，然后才能释放它们。
以下是如何创建一个 `CyclicBarrier`：

```java
CyclicBarrier barrier = new CyclicBarrier(2);
```

## 在 CyclicBarrier 处等待

以下是线程如何在 `CyclicBarrier` 处等待：

```java
barrier.await();
```

你也可以为等待线程指定一个超时时间。当超时时间过去时，即使不是所有 N 个线程都在 `CyclicBarrier` 处等待，线程也会被释放。
以下是如何指定超时：

```java
barrier.await(10, TimeUnit.SECONDS);
```

等待线程在 `CyclicBarrier` 处等待，直到以下任一情况发生：

- 最后一个线程到达（调用 await()）
- 线程被另一个线程中断（另一个线程调用它的 interrupt() 方法）
- 另一个等待线程被中断
- 另一个等待线程在 `CyclicBarrier` 处等待时超时
- 某个外部线程调用了 `CyclicBarrier.reset()` 方法

## CyclicBarrier 动作

`CyclicBarrier` 支持一个屏障动作，这是一个 `Runnable`，在最后一个线程到达时执行一次。
你将 `Runnable` 屏障动作传递给 `CyclicBarrier` 的构造函数，如下所示：

```java
Runnable barrierAction = ...;
CyclicBarrier barrier = new CyclicBarrier(2, barrierAction);
```

## CyclicBarrier 示例

以下是一个代码示例，展示了如何使用 `CyclicBarrier`：

```java
Runnable barrier1Action = new Runnable() {
    public void run() {
        System.out.println("BarrierAction 1 executed ");
    }
};
Runnable barrier2Action = new Runnable() {
    public void run() {
        System.out.println("BarrierAction 2 executed ");
    }
};

CyclicBarrier barrier1 = new CyclicBarrier(2, barrier1Action);
CyclicBarrier barrier2 = new CyclicBarrier(2, barrier2Action);

CyclicBarrierRunnable barrierRunnable1 =
        new CyclicBarrierRunnable(barrier1, barrier2);

CyclicBarrierRunnable barrierRunnable2 =
        new CyclicBarrierRunnable(barrier1, barrier2);

new Thread(barrierRunnable1).start();
new Thread(barrierRunnable2).start();
```

以下是 `CyclicBarrierRunnable` 类：

```java
public class CyclicBarrierRunnable implements Runnable {

    CyclicBarrier barrier1 = null;
    CyclicBarrier barrier2 = null;

    public CyclicBarrierRunnable(
            CyclicBarrier barrier1,
            CyclicBarrier barrier2) {

        this.barrier1 = barrier1;
        this.barrier2 = barrier2;
    }

    public void run() {
        try {
            Thread.sleep(1000);
            System.out.println(Thread.currentThread().getName() +
                    " waiting at barrier 1");
            this.barrier1.await();

            Thread.sleep(1000);
            System.out.println(Thread.currentThread().getName() +
                    " waiting at barrier 2");
            this.barrier2.await();

            System.out.println(Thread.currentThread().getName() +
                    " done!");

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }
    }
}
```

以下是上述代码执行的控制台输出。请注意，线程写入控制台的顺序可能因执行而异。有时 `Thread-0` 首先打印，有时 `Thread-1` 首先打印等。

```
Thread-0 waiting at barrier 1
Thread-1 waiting at barrier 1
BarrierAction 1 executed
Thread-1 waiting at barrier 2
Thread-0 waiting at barrier 2
BarrierAction 2 executed
Thread-0 done!
Thread-1 done!
```


# CountDownLatch

`java.util.concurrent.CountDownLatch` 是一个并发构造，它允许一个或多个线程等待一组操作完成。

`CountDownLatch` 用给定的计数初始化。这个计数会通过调用 `countDown()` 方法递减。等待这个计数到达零的线程可以调用其中一个 `await()` 方法。调用 `await()` 会阻塞线程，直到计数到达零。

下面是一个简单的示例。在 `Decrementer` 对 `CountDownLatch` 调用了3次 `countDown()` 之后，等待的 `Waiter` 从 `await()` 调用中释放。

```
CountDownLatch latch = new CountDownLatch(3);

Waiter      waiter      = new Waiter(latch);
Decrementer decrementer = new Decrementer(latch);

new Thread(waiter)     .start();
new Thread(decrementer).start();

Thread.sleep(4000);
```

```java
public class Waiter implements Runnable {

    CountDownLatch latch = null;

    public Waiter(CountDownLatch latch) {
        this.latch = latch;
    }

    public void run() {
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Waiter Released");
    }
}
```

```java
public class Decrementer implements Runnable {

    CountDownLatch latch = null;

    public Decrementer(CountDownLatch latch) {
        this.latch = latch;
    }

    public void run() {

        try {
            Thread.sleep(1000);
            this.latch.countDown();

            Thread.sleep(1000);
            this.latch.countDown();

            Thread.sleep(1000);
            this.latch.countDown();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```



# 阻塞队列

阻塞队列是一种在你尝试从空队列中出队时会阻塞的队列，或者当你尝试向已满的队列中入队项目时也会阻塞。尝试从空队列中出队的线程将被阻塞，直到其他线程向队列中插入项目。尝试在满队列中入队的线程将被阻塞，直到其他线程通过出队一个或多个项目或完全清空队列来为队列腾出空间。

下面是一张图示，展示了两个线程通过阻塞队列进行协作：

| **一个阻塞队列，一个线程向其放入项目，另一个线程从中取出项目。**
|---|
| ![img](./image/blocking-queue.png)|

Java 5在`java.util.concurrent`包中提供了阻塞队列的实现。你可以在我的`java.util.concurrent.BlockingQueue`教程中阅读有关该类的内容。即使Java 5提供了阻塞队列的实现，了解它们实现背后的理论也可能是有用的。

## 阻塞队列实现

阻塞队列的实现看起来类似于有界信号量。以下是一个阻塞队列的简单实现：

```java
public class BlockingQueue {

  private List queue = new LinkedList();
  private int  limit = 10;

  public BlockingQueue(int limit){
    this.limit = limit;
  }

  public synchronized void enqueue(Object item)
  throws InterruptedException  {
    while(this.queue.size() == this.limit) {
      wait();
    }
    this.queue.add(item);
    if(this.queue.size() == 1) {
      notifyAll();
    }
  }

  public synchronized Object dequeue()
  throws InterruptedException {
    while(this.queue.size() == 0){
      wait();
    }
    if(this.queue.size() == this.limit){
      notifyAll();
    }

    return this.queue.remove(0);
  }

}

```

注意`notifyAll()`只在使用`enqueue()`和`dequeue()`方法时，如果队列大小等于大小界限（0或限制）才被调用。如果调用`enqueue()`或`dequeue()`时队列大小不等于任一界限，则不会有线程等待入队或出队项目。



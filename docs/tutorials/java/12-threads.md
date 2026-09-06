---
title: 多线程基础
---

# 第 12 章 · 多线程基础

**本章目标：**

- 理解进程/线程与并发的动机
- 掌握 Thread 创建与生命周期
- 学会 synchronized 解决竞态条件

## 12.1 为什么需要多线程

单线程串行执行，一个慢任务拖住整个程序：

```text
单线程：下载(5s) → 解析(1s) → 下载(5s) → 解析(1s) = 12s
多线程：[下载A ‖ 下载B] 并行 5s → [解析A ‖ 解析B] 并行 1s = 6s
```

**进程（process）**= 运行中的程序（独立内存空间）；**线程（thread）**= 进程内的执行单元（共享进程内存）。Java 的 JVM 本身就是多线程程序（GC 就跑在独立线程里）。

并发带来的新问题——**竞态条件（race condition）**：

```java
public class Counter {
    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 10000; i++) {
                count++;        // 读 → 加 → 写，三步非原子！
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join();  t2.join();   // 等两个线程结束

        System.out.println(count);   // 预期 20000，实际 1万出头到 2万随机！
    }
}
```

`count++` 不是原子操作：两个线程同时读到 100，各自 +1 写回 101——一次加法被"丢失"。

## 12.2 创建线程的两种方式

```java
// ① 继承 Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("线程跑任务：" + Thread.currentThread().getName());
    }
}
new MyThread().start();        // start() 启动新线程；直接调 run() 是普通方法调用！

// ② 实现 Runnable（推荐：不占用继承位，配合线程池）
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("任务执行");
    }
}
new Thread(new MyTask()).start();
new Thread(() -> System.out.println("Lambda 任务")).start();   // Runnable 是函数式接口
```

**线程池方式才是工程标配**（第 13 章）——直接 new Thread 在生产代码里几乎见不到。

## 12.3 线程生命周期

```text
NEW        创建了还没 start()
RUNNABLE   可运行（就绪/运行中）
BLOCKED    等锁（synchronized 被别人占着）
WAITING    无限等待（wait/join，需要被唤醒）
TIMED_WAITING  限时等待（sleep(1000)）
TERMINATED 执行完毕
```

常用控制方法：

```java
Thread.sleep(1000);      // 当前线程睡 1 秒（不释放锁）
t.join();                // 等待 t 执行完再继续（汇合点）
t.interrupt();           // 礼貌请求中断（设置标志位）
Thread.currentThread();  // 拿当前线程对象
t.setDaemon(true);       // 守护线程：JVM 退出不等它（如 GC 线程）
```

## 12.4 synchronized：最简单的锁

`synchronized`（同步）保证**同一时刻只有一个线程**进入被保护的代码：

```java
public class SafeCounter {
    private int count = 0;

    // 同步方法：锁的是 this（对象本身）
    public synchronized void increment() {
        count++;
    }

    public synchronized int get() {
        return count;
    }
}

// 同步块：只锁关键段落（锁粒度更细，性能更好）
private final Object lock = new Object();

public void add(int delta) {
    synchronized (lock) {       // 拿到 lock 的线程才能进来
        count += delta;
    }
    // 出了块自动释放锁
}
```

用 synchronized 修好 12.1 的计数器：

```java
Runnable task = () -> {
    for (int i = 0; i < 10000; i++) {
        synchronized (Counter.class) {   // 类锁：静态场景
            count++;
        }
    }
};
// 现在 20000 稳定输出
```

::: info 锁的代价与原则
加锁 = 串行化 = 牺牲性能。原则：**锁粒度尽量小**（锁代码块不锁整个方法）、**锁对象尽量专用**（别锁 String 字面量/Integer 缓存等被共享的对象）。
:::

## 12.5 volatile：可见性关键字

```java
private volatile boolean running = true;   // volatile：修改立即可见于其他线程

public void run() {
    while (running) {          // 没有 volatile 时：另一线程改 running，此循环可能永远看不到
        doWork();
    }
}

public void stop() {
    running = false;           // 立即生效
}
```

`volatile` 解决**可见性**（一个线程的修改立刻刷新到主内存），但不解决**原子性**（count++ 依然会丢）。典型用途：状态标志位。计数这类复合操作还是得 synchronized 或原子类（第 13 章）。

## 12.6 wait / notify：线程协作

```java
public class TaskQueue {
    private final List<String> tasks = new ArrayList<>();

    public synchronized String take() throws InterruptedException {
        while (tasks.isEmpty()) {
            wait();            // 队列空：等待并释放锁
        }
        return tasks.remove(0);
    }

    public synchronized void put(String task) {
        tasks.add(task);
        notifyAll();           // 唤醒所有等待的消费者
    }
}
```

`wait/notifyAll` 必须在 synchronized 块内使用。生产者-消费者模式的原生实现——第 13 章的 BlockingQueue 会给出更省心的现成方案。

## 12.7 综合练习：并发下载模拟器

```java
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class DownloadSimulator {
    public static void main(String[] args) throws InterruptedException {
        List<String> urls = List.of("file1", "file2", "file3", "file4", "file5");
        CountDownLatch latch = new CountDownLatch(urls.size());   // 计数门闩

        for (String url : urls) {
            new Thread(() -> {
                try {
                    System.out.println("开始下载 " + url);
                    Thread.sleep((long) (Math.random() * 2000));  // 模拟耗时
                    System.out.println("完成 " + url);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();    // 完成一个，门闩 -1
                }
            }).start();
        }

        latch.await();    // 等全部完成才继续
        System.out.println("全部下载完成，开始合并文件");
    }
}
```

CountDownLatch（第 13 章细讲）+ 多线程并行——把 5 个串行任务压成一次并行等待。

## 本章小结

- 进程有独立内存，线程共享内存；count++ 非原子 → 竞态条件
- 创建线程：Thread/Runnable（Lambda 友好）；启动用 start()
- synchronized 加锁互斥；volatile 管可见性不管原子性
- 生产工程用线程池（第 13 章），裸 new Thread 仅限演示

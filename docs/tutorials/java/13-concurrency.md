---
title: 线程池与并发工具
---

# 第 13 章 · 线程池与并发工具

**本章目标：**

- 理解线程池的价值与核心参数
- 掌握 Executors 常用工厂与 Future 异步结果
- 熟悉 JUC 高频工具（原子类、并发集合、CountDownLatch）

## 13.1 线程池：复用而非滥造

线程创建销毁有开销，无节制 new Thread 会拖垮系统。**线程池（thread pool）**：预建一批线程反复使用：

```text
任务提交 → 入队列 → 空闲工作线程取出执行 → 执行完回到池中待命
```

三大好处：降低创建销毁开销、控制并发上限（防资源耗尽）、统一管理（监控/拒绝策略）。

## 13.2 创建与使用线程池

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// 固定大小线程池（最常用）
ExecutorService pool = Executors.newFixedThreadPool(4);

// 提交任务（Runnable：无返回值）
pool.execute(() -> System.out.println("任务A：" + Thread.currentThread().getName()));
pool.execute(() -> System.out.println("任务B"));

// submit + Callable：有返回值的任务（返回 Future）
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

Future<Integer> future = pool.submit(() -> {
    Thread.sleep(1000);        // 模拟耗时计算
    return 42;
});

Integer result = future.get();     // 阻塞等待结果（拿到 42）
future.isDone();                   // 是否完成

// 收尾：不再接受新任务，等存量任务跑完（优雅关闭）
pool.shutdown();
```

常用工厂：

```text
newFixedThreadPool(n)    固定 n 个线程（通用首选）
newCachedThreadPool()    按需扩张、空闲回收（短时突发任务）
newSingleThreadExecutor() 单线程（保证顺序执行）
newScheduledThreadPool(n) 定时/周期任务
```

::: warning 生产环境手写 ThreadPoolExecutor
Executors 的工厂在阿里规范中不推荐直接用于生产（如 newFixedThreadPool 的队列无界，可能堆积内存溢出）。生产用 `new ThreadPoolExecutor(核心数, 最大数, 存活时间, 时间单位, 有界队列, 拒绝策略)` 显式指定参数——本章理解机制即可，Spring Boot 里默认线程池配置已封装好这些。
:::

## 13.3 原子类：无锁的线程安全计数

```java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger count = new AtomicInteger(0);

count.incrementAndGet();      // ++count（原子）
count.decrementAndGet();      // --count
count.addAndGet(10);          // +=10
count.get();

// CAS（Compare-And-Swap）：CPU 级指令实现，比 synchronized 轻量
count.compareAndSet(42, 43);  // 若当前值是 42 则改成 43，返回是否成功
```

修好第 12 章的计数器竞态——不需要锁：

```java
public class Counter {
    private static final AtomicInteger count = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 10000; i++) {
                count.incrementAndGet();     // 原子自增，20000 稳定输出
            }
        };
        Thread t1 = new Thread(task), t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println(count.get());     // 20000 ✅
    }
}
```

## 13.4 并发集合

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

// ConcurrentHashMap：线程安全的 HashMap（分段锁，性能远超 Hashtable）
ConcurrentHashMap<String, Integer> online = new ConcurrentHashMap<>();
online.put("user1", 1);
online.computeIfAbsent("user2", k -> 0);

// CopyOnWriteArrayList：写时复制，读多写少场景
CopyOnWriteArrayList<String> listeners = new CopyOnWriteArrayList<>();

// BlockingQueue：生产者-消费者的现成方案（替代第 12 章手写 wait/notify）
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

new Thread(() -> {
    try {
        queue.put("任务");       // 队列满自动阻塞
    } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
}).start();

new Thread(() -> {
    try {
        String task = queue.take();   // 队列空自动阻塞
    } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
}).start();
```

## 13.5 CountDownLatch 与 Semaphore

```java
// CountDownLatch：等待 N 个任务全部完成（第 12 章用过）
CountDownLatch latch = new CountDownLatch(3);
// 工作线程：latch.countDown()
// 主线程：  latch.await() —— 计数归零才放行

// Semaphore：限流——同时最多 N 个线程访问资源
Semaphore slots = new Semaphore(3);        // 3 个车位

slots.acquire();        // 占位（没位就等）
try {
    doWork();           // 最多 3 个线程同时在这里
} finally {
    slots.release();    // 释放（必须 finally！）
}
```

数据库连接池、接口限流都是 Semaphore 思想。

## 13.6 并发三大原则回顾

```text
① 原子性：count++ 用 AtomicInteger 或 synchronized（别依赖"看起来一行"）
② 可见性：跨线程的标志位加 volatile
③ 有序性：发布对象前完成初始化（final 字段天然安全）
```

## 13.7 综合练习：并发统计单词数

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ParallelWordCount {
    public static void main(String[] args) throws Exception {
        List<String> lines = Files.readAllLines(Path.of("big-text.txt"));
        Map<String, Integer> counts = new ConcurrentHashMap<>();
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // 按行提交任务（简化示例；真实场景按块切分更高效）
        for (String line : lines) {
            pool.execute(() -> {
                for (String word : line.split("\\s+")) {
                    if (!word.isBlank()) {
                        counts.merge(word, 1, Integer::sum);   // 原子合并
                    }
                }
            });
        }

        pool.shutdown();
        pool.awaitTermination(30, TimeUnit.SECONDS);   // 等全部完成

        counts.entrySet().stream()
              .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
              .limit(10)
              .forEach(e -> System.out.println(e.getKey() + " => " + e.getValue()));
    }
}
```

线程池 + ConcurrentHashMap + merge 原子合并 + Stream 排序——第 9/11/12/13 章的知识点拧成一股绳。

## 本章小结

- 线程池复用线程：execute（无返回）/ submit+Future（有返回）；关闭用 shutdown
- AtomicInteger 等 CAS 原子类：无锁解决计数竞态
- ConcurrentHashMap/CopyOnWriteArrayList/BlockingQueue 替代手写锁
- CountDownLatch 等待组任务、Semaphore 限流

# ThreadPoolExecutor

`java.util.concurrent.ThreadPoolExecutor` 是 `ExecutorService` 接口的一个实现。`ThreadPoolExecutor` 使用其内部池中的一个线程来执行给定的任务（`Callable` 或 `Runnable`）。

`ThreadPoolExecutor` 包含的线程池可以包含不同数量的线程。池中的线程数由以下变量决定：

- `corePoolSize`
- `maximumPoolSize`

当向线程池委派任务时，如果创建的线程少于 `corePoolSize`，则即使池中有空闲线程，也会创建一个新线程。

如果任务的内部队列已满，并且 `corePoolSize` 个线程或更多线程正在运行，但运行的线程少于 `maximumPoolSize`，则会创建一个新线程来执行任务。

以下是一张图示，阐释了 `ThreadPoolExecutor` 的原理：

|  |
| --- |
| ![img](./image/thread-pool-executor.png) |
| **一个 ThreadPoolExecutor** |

## 创建 ThreadPoolExecutor

`ThreadPoolExecutor` 有几个构造函数可供使用。例如：

```java
int corePoolSize = 5;
int maxPoolSize = 10;
long keepAliveTime = 5000;

ExecutorService threadPoolExecutor =
        new ThreadPoolExecutor(
                corePoolSize,
                maxPoolSize,
                keepAliveTime,
                TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>()
        );
```

然而，除非你需要为 `ThreadPoolExecutor` 明确指定所有这些参数，否则通常使用 `java.util.concurrent.Executors` 类中的工厂方法会更容易，正如 ExecutorService 文本中所示。



# ScheduledExecutorService

`java.util.concurrent.ScheduledExecutorService` 是一个 `ExecutorService`，它可以安排任务在延迟后运行，或者在每次执行之间以固定的时间间隔重复执行。任务由工作线程异步执行，而不是由将任务交给 `ScheduledExecutorService` 的线程执行。

## ScheduledExecutorService 示例

以下是一个简单的 `ScheduledExecutorService` 示例：

```java
ScheduledExecutorService scheduledExecutorService =
    Executors.newScheduledThreadPool(5);

ScheduledFuture scheduledFuture =
    scheduledExecutorService.schedule(new Callable() {
        public Object call() throws Exception {
            System.out.println("Executed!");
            return "Called!";
        }
    },
    5,
    TimeUnit.SECONDS);
```

首先创建了一个包含5个线程的 `ScheduledExecutorService`。然后创建了一个 `Callable` 接口的匿名实现，并将其传递给 `schedule()` 方法。最后两个参数指定 `Callable` 应该在5秒后执行。

## ScheduledExecutorService 实现

由于 `ScheduledExecutorService` 是一个接口，你将必须使用 `java.util.concurrent` 包中的它的实现，以便使用它。`ScheduledExecutorService` 有以下实现：

- ScheduledThreadPoolExecutor

## 创建 ScheduledExecutorService

你如何创建 `ScheduledExecutorService` 取决于你使用的实现。然而，你也可以使用 `Executors` 工厂类来创建 `ScheduledExecutorService` 实例。以下是一个示例：

```java
ScheduledExecutorService scheduledExecutorService =
    Executors.newScheduledThreadPool(5);
```

## ScheduledExecutorService 使用

一旦你创建了一个 `ScheduledExecutorService`，你可以通过调用它的一个方法来使用它：

- schedule (Callable task, long delay, TimeUnit timeunit)
- schedule (Runnable task, long delay, TimeUnit timeunit)
- scheduleAtFixedRate (Runnable, long initialDelay, long period, TimeUnit timeunit)
- scheduleWithFixedDelay (Runnable, long initialDelay, long period, TimeUnit timeunit)

我将在下面简要介绍这些方法。

### schedule (Callable task, long delay, TimeUnit timeunit)

此方法在给定的延迟后安排给定的 `Callable` 执行。

该方法返回一个 `ScheduledFuture`，你可以使用它在任务开始执行之前取消任务，或者在任务执行后获取结果。

以下是一个示例：

```java
ScheduledExecutorService scheduledExecutorService =
    Executors.newScheduledThreadPool(5);

ScheduledFuture scheduledFuture =
    scheduledExecutorService.schedule(new Callable() {
        public Object call() throws Exception {
            System.out.println("Executed!");
            return "Called!";
        }
    },
    5,
    TimeUnit.SECONDS);

System.out.println("result = " + scheduledFuture.get());

scheduledExecutorService.shutdown();
```

此示例输出：

```
Executed!
result = Called!
```

### schedule (Runnable task, long delay, TimeUnit timeunit)

此方法的工作方式类似于以 `Callable` 作为参数的方法版本，除了 `Runnable` 不能返回值，所以当任务完成时，`ScheduledFuture.get()` 方法返回 null。

### scheduleAtFixedRate (Runnable, long initialDelay, long period, TimeUnit timeunit)

此方法安排一个任务定期执行。任务首次在 `initialDelay` 之后执行，然后每隔 `period` 时间重复执行。

如果执行给定任务时抛出异常，则不再执行该任务。如果没有抛出异常，该任务将继续执行，直到 `ScheduledExecutorService` 关闭。

如果一个任务的执行时间比计划执行之间的周期长，下一次执行将在当前执行完成后开始。计划任务一次最多只能由一个线程执行。

### scheduleWithFixedDelay (Runnable, long initialDelay, long period, TimeUnit timeunit)

此方法的工作原理与 `scheduleAtFixedRate()` 非常相似，只是 `period` 的解释方式不同。

在 `scheduleAtFixedRate()` 方法中，`period` 被解释为前一次执行开始到下一次执行开始之间的延迟。

然而，在此方法中，`period` 被解释为前一次执行的 **结束** 到下一次执行的开始之间的延迟。因此，延迟是在执行结束之间，而不是在执行开始之间。

## ScheduledExecutorService 关闭

就像 `ExecutorService` 一样，当你完成使用 `ScheduledExecutorService` 时，需要关闭它。如果不这样做，即使所有其他线程都已关闭，它也会保持 JVM 运行。

你可以使用从 `ExecutorService` 接口继承的 `shutdown()` 或 `shutdownNow()` 方法关闭 `ScheduledExecutorService`。有关更多信息，请参见 ExecutorService 关闭部分。


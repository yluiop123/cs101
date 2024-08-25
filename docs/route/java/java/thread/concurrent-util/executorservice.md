# ExecutorService

Java `ExecutorService` 接口，`java.util.concurrent.ExecutorService`，代表一种异步执行机制，能够在后台同时执行任务。

在本 Java `ExecutorService` 教程中，我将解释如何创建 `ExecutorService`，如何向其提交执行任务，如何查看这些任务的结果，以及当你需要时如何关闭 `ExecutorService`。

## 任务委派

以下是一张图示，展示了一个线程将任务委派给 Java `ExecutorService` 进行异步执行：

|  |
| --- |
| ![img](https://jenkov.com/images/java-concurrency-utils/executor-service.png) |
| **一个线程将任务委派给 ExecutorService 进行异步执行。** |

一旦线程将任务委派给 `ExecutorService`，该线程将继续独立于任务执行自己的执行。`ExecutorService` 随后将并发地独立于提交任务的线程执行任务。

## Java ExecutorService 示例

在我们深入了解 `ExecutorService` 之前，让我们看一个简单的示例。以下是一个简单的 Java `ExecutorService` 示例：

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);

executorService.execute(new Runnable() {
    public void run() {
        System.out.println("Asynchronous task");
    }
});

executorService.shutdown();
```

首先使用 `Executors` 的 `newFixedThreadPool()` 工厂方法创建了一个 `ExecutorService`。这创建了一个有10个线程执行任务的线程池。

其次，将 `Runnable` 接口的匿名实现传递给 `execute()` 方法。这导致 `Runnable` 由 `ExecutorService` 中的一个线程执行。

你将在整个教程中看到更多如何使用 `ExecutorService` 的示例。此示例只是为了快速了解如何在后台使用 `ExecutorService` 执行任务。

## Java ExecutorService 实现

Java `ExecutorService` 非常类似于线程池。实际上，`java.util.concurrent` 包中存在的 `ExecutorService` 接口实现就是线程池实现。如果你想了解 `ExecutorService` 接口如何内部实现，请阅读上面的教程。

由于 `ExecutorService` 是一个接口，你需要使用它的实现才能使用它。`ExecutorService` 在 `java.util.concurrent` 包中有以下实现：

- ThreadPoolExecutor
- ScheduledThreadPoolExecutor

## 创建 ExecutorService

如何创建 `ExecutorService` 取决于你使用的实现。但是，你也可以使用 `Executors` 工厂类来创建 `ExecutorService` 实例。以下是创建 `ExecutorService` 的几个示例：

```java
ExecutorService executorService1 = Executors.newSingleThreadExecutor();

ExecutorService executorService2 = Executors.newFixedThreadPool(10);

ExecutorService executorService3 = Executors.newScheduledThreadPool(10);
```

## 使用虚拟线程创建 ExecutorService

Java 虚拟线程在 Java 19 中被添加到 Java 中。
还可以创建一个在内部使用虚拟线程的 Java ExecutorService。以下是一个示例，展示了为每个提交的任务创建一个新虚拟线程的 Java ExecutorService：

```java
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

## ExecutorService 使用

有几种不同的方法可以将任务委派给 `ExecutorService` 执行：

- execute(Runnable)
- submit(Runnable)
- submit(Callable)
- invokeAny(...)
- invokeAll(...)

我将在以下部分中查看这些方法的每一个。

### 执行 Runnable

Java `ExecutorService` 的 `execute(Runnable)` 方法接受一个 `java.lang.Runnable` 对象，并异步执行它。以下是使用 `ExecutorService` 执行 `Runnable` 的示例：

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();

executorService.execute(new Runnable() {
    public void run() {
        System.out.println("Asynchronous task");
    }
});

executorService.shutdown();
```

没有办法获得执行的 `Runnable` 的结果，如果需要。你必须使用 `Callable`（在后续部分解释）。

### 提交 Runnable

Java `ExecutorService` 的 `submit(Runnable)` 方法也接受一个 `Runnable` 实现，但返回一个 `Future` 对象。这个 `Future` 对象可以用来检查 `Runnable` 是否已完成执行。

以下是一个 Java `ExecutorService` `submit()` 示例：

```java
Future future = executorService.submit(new Runnable() {
    public void run() {
        System.out.println("Asynchronous task");
    }
});

future.get();  // 如果任务正确完成则返回 null。
```

`submit()` 方法返回一个 Java Future 对象，可以用来检查 `Runnable` 何时完成。

### 提交 Callable

Java `ExecutorService` 的 `submit(Callable)` 方法类似于 `submit(Runnable)` 方法，但它接受一个 Java Callable 而不是 `Runnable`。Callable 和 Runnable 之间的确切区别稍后解释。

Callable 的结果可以通过 `submit(Callable)` 方法返回的 Java Future 对象获得。以下是一个 `ExecutorService` Callable 示例：

```java
Future future = executorService.submit(new Callable() {
    public Object call() throws Exception {
        System.out.println("Asynchronous Callable");
        return "Callable Result";
    }
});

System.out.println("future.get() = " + future.get());
```

上述代码示例将输出以下内容：

```
Asynchronous Callable
future.get() = Callable Result
```

### invokeAny()

`invokeAny()` 方法接受一组 `Callable` 对象或 Callable 的子接口。调用此方法不会返回 `Future`，而是返回一个 `Callable` 对象的结果。你无法保证获得哪个 `Callable` 的结果。只是其中一个完成的。

如果一个 Callable 完成，以便从 `invokeAny()` 返回结果，那么其余的 Callable 实例将被取消。

如果其中一个任务完成（或抛出异常），其余的 `Callable` 将被取消。

以下是一个代码示例：

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();

Set<Callable<String>> callables = new HashSet<Callable<String>>();

callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 1";
    }
});
callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 2";
    }
});
callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 3";
    }
});

String result = executorService.invokeAny(callables);

System.out.println("result = " + result);

executorService.shutdown();
```

这个代码示例将打印出给定集合中的一个 `Callable` 返回的对象。我尝试运行了几次，结果不同。有时是 "Task 1"，有时是 "Task 2" 等。

### invokeAll()

`invokeAll()` 方法调用你传递给它的所有 `Callable` 对象，作为参数传递的集合。`invokeAll()` 通过你可以获得每个 `Callable` 执行结果的 `Future` 对象列表返回。

请注意，任务可能由于异常而完成，因此可能没有 "成功"。在 `Future` 上没有办法区分。

以下是一个代码示例：

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();

Set<Callable<String>> callables = new HashSet<Callable<String>>();

callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 1";
    }
});
callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 2";
    }
});
callables.add(new Callable<String>() {
    public String call() throws Exception {
        return "Task 3";
    }
});

List<Future<String>> futures = executorService.invokeAll(callables);

for(Future<String> future : futures){
    System.out.println("future.get = " + future.get());
}

executorService.shutdown();
```

### Runnable 与 Callable

`Runnable` 接口与 `Callable` 接口非常相似。Runnable 接口代表一个可以由线程或 `ExecutorService` 并发执行的任务。Callable 只能由 ExecutorService 执行。两个接口都只有一个方法。然而，Callable 和 Runnable 接口之间有一个小区别。当你看到接口声明时，Callable 和 Runnable 接口之间的区别更容易看到。

首先是 Runnable 接口声明：

```java
public interface Runnable {
    public void run();
}
```

然后是 Callable 接口声明：

```java
public interface Callable {
    public Object call() throws Exception;
}
```

Runnable 的 `run()` 方法与 Callable 的 `call()` 方法之间的主要区别在于，`call()` 方法可以从方法调用中返回一个 `Object`。`call()` 和 `run()` 之间的另一个区别是，`call()` 可以抛出异常，而 `run()` 不能（除了非检查型异常 - `RuntimeException` 的子类）。

如果你需要向 Java `ExecutorService` 提交一个任务，并且你需要任务的结果，那么你需要使你的任务实现 `Callable` 接口。否则，你的任务可以实现 `Runnable` 接口。

### 取消任务

你可以通过调用提交任务时返回的 `Future` 上的 `cancel()` 方法来取消提交给 Java `ExecutorService` 的任务（`Runnable` 或 `Callable`）。只有在任务尚未开始执行时才能取消任务。以下是通过调用 `Future.cancel()` 方法取消任务的示例：

```java
future.cancel();
```

## ExecutorService 停止

当完成使用 Java `ExecutorService` 时，你应该关闭它，以便线程不会继续运行。如果你的应用程序是通过 `main()` 方法启动的，并且你的主线程退出了应用程序，如果你的应用程序中有活动的 `ExecutorService`，应用程序将继续运行。这个 `ExecutorService` 中的活动线程阻止了 JVM 的关闭。

### shutdown()

要终止 `ExecutorService` 内的线程，你可以调用它的 `shutdown()` 方法。
`ExecutorService` 不会立即关闭，但它不再接受新任务，并且一旦所有线程完成当前任务，`ExecutorService` 就会关闭。在调用 `shutdown()` 之前提交给 `ExecutorService` 的所有任务都将被执行。以下是执行 Java `ExecutorService` 停止的示例：

```java
executorService.shutdown();
```

### shutdownNow()

如果你想立即关闭 `ExecutorService`，你可以调用 `shutdownNow()` 方法。这将尝试立即停止所有正在执行的任务，并跳过所有已提交但未处理的任务。对于正在执行的任务没有保证。也许它们停止了，也许它们执行到结束。这是最好的尝试。以下是调用 `ExecutorService` `shutdownNow` 的示例：

```java
executorService.shutdownNow();
```

### awaitTermination()

`ExecutorService` 的 `awaitTermination()` 方法将阻塞调用它的线程，直到 `ExecutorService` 完全关闭，或者直到出现给定的超时。通常在调用 `shutdown()` 或 `shutdownNow()` 后调用 `awaitTermination()` 方法。以下是调用 `ExecutorService` `awaitTermination()` 的示例：

```java
executorService.shutdown();

executorService.awaitTermination(10_000L, TimeUnit.MILLISECONDS );
```



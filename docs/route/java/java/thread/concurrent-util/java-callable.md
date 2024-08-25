# Java Callable

Java `Callable` 接口，`java.util.concurrent.Callable`，表示一个可以由单独线程执行的异步任务。例如，可以将 `Callable` 对象提交给 Java ExecutorService，然后由它异步执行。

## Java Callable 接口定义

Java `Callable` 接口非常简单。它包含一个名为 `call()` 的方法。
以下是 `Callable` 接口的大致样子：

```java
public interface Callable<V> {

    V call() throws Exception;

}
```

`call()` 方法被调用以执行异步任务。`call()` 方法可以返回一个结果。如果任务异步执行，结果通常通过 Java Future 回调给任务的创建者。这就是当 `Callable` 被提交给 `ExecutorService` 进行并发执行的情况。

`call()` 方法也可以在任务执行期间失败时抛出 `Exception`。

## 实现 Callable

以下是一个实现 Java `Callable` 接口的简单示例：

```java
public class MyCallable implements Callable<String> {

    @Override
    public String call() throws Exception {
        return String.valueOf(System.currentTimeMillis());
    }

}
```

这个实现非常简单。它将泛型类型设置为 Java String。
结果就是 `call()` 方法将返回一个 String。`call()` 实现只是返回当前时间的毫秒数的字符串表示。在实际应用中，任务可能是更复杂或更大的操作集。

通常，像读写磁盘或网络这样的 I/O 操作是并发执行任务的好候选。I/O 操作通常在读写数据块之间有长时间的等待。通过在单独的线程中执行这样的任务，你可以避免不必要的阻塞主应用程序线程。

## Callable 与 Runnable

Java `Callable` 接口与 Java `Runnable` 接口相似，因为两者都表示打算由单独线程并发执行的任务。

Java `Callable` 与 `Runnable` 不同之处在于 `Runnable` 接口的 `run()` 方法不返回值，并且它不能抛出受检异常（只有 `RuntimeException`）。

此外，`Runnable` 最初是为长期并发执行而设计的，例如并发运行网络服务器或监视目录是否有新文件。
`Callable` 接口更适合于返回单一结果的一次性任务。

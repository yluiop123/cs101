# Java Future

Java `Future`，`java.util.concurrent.Future`，代表异步计算的结果。
创建异步任务时，会返回一个Java `Future` 对象。这个 `Future` 对象作为异步任务结果的句柄。一旦异步任务完成，就可以通过启动任务时返回的 `Future` 对象访问结果。

Java的一些内置并发工具，例如Java `ExecutorService`，在它们的方法中返回Java `Future` 对象。在 `ExecutorService` 的情况下，当你提交一个 `Callable` 让它并发（异步）执行时，它会返回一个 `Future`。

## Java Future 接口定义

为了理解Java `Future` 接口的工作原理，这里是一个接口定义的近似：

```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    V       get() throws InterruptedException, ExecutionException;
    V       get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
    boolean isCancelled();
    boolean isDone();
}
```

稍后将介绍这些方法 - 但正如你看到的，Java `Future` 接口并不那么高级。

## 从 Future 获取结果

如前所述，Java `Future` 代表异步任务的结果。要获取结果，你可以在 `Future` 上调用两个 `get()` 方法之一。`get()` 方法都返回一个 `Object`，但返回类型也可以是泛型返回类型（意味着特定类的对象，而不仅仅是 `Object`）。以下是通过 `get()` 方法从Java `Future` 获取结果的示例：

```java
Future future = ... // 通过启动异步任务获取 Future

// 在准备好通过 Future 检查结果之前做其他事情

// 从 Future 获取结果
try {
    Object result = future.get();
} catch (InterruptedException e) {
    e.printStackTrace();
} catch (ExecutionException e) {
    e.printStackTrace();
}
```

如果在异步任务完成之前调用 `get()` 方法，`get()` 方法将阻塞直到结果准备好。

有一个 `get()` 方法的版本可以在经过一定时间后超时，你可以在方法参数中指定这个时间。以下是调用该 `get()` 版本的示例：

```java
try {
    Object result = future.get(1000, TimeUnit.MILLISECONDS);
} catch (InterruptedException e) {

} catch (ExecutionException e) {

} catch (TimeoutException e) {
    // 如果在结果可用之前超时时间间隔已过
    // 则抛出此异常。
}
```

上述示例在 `Future` 中最多等待1000毫秒的结果可用。如果在1000毫秒内没有结果可用，则抛出 `TimeoutException`。

## 通过 Future cancel() 取消任务

你可以通过调用 `Future` `cancel()` 方法取消由 Java `Future` 实例表示的异步任务。异步任务执行必须实现以支持取消。没有这种支持，调用 `cancel()` 将没有效果。以下是通过 Java `Future` `cancel()` 方法取消任务的示例：

```java
future.cancel();
```

## 检查任务是否完成

你可以通过调用 `Future` `isDone()` 方法检查异步任务是否完成（并且结果是否可用）。以下是调用 Java `Future` `isDone()` 方法的示例：

```java
Future future = ... // 从某处获取 Future

if (future.isDone()) {
    Object result = future.get();
} else {
    // 做其他事情
}
```

## 检查任务是否已取消

也可以检查由 Java `Future` 表示的异步任务是否已取消。你可以通过调用 `Future` `isCancelled()` 方法来检查。以下是检查任务是否已取消的示例：

```java
Future future = ... // 从某处获取 Future

if (future.isCancelled()) {

} else {

}
```


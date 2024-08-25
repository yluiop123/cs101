# DelayQueue

`DelayQueue` 类实现了 `BlockingQueue` 接口。
有关该接口的更多信息，请阅读 `BlockingQueue` 文本。

`DelayQueue` 在内部阻塞元素，直到特定的延迟期满。元素必须实现接口 `java.util.concurrent.Delayed`。以下是接口的示例：

```java
public interface Delayed extends Comparable<Delayed> {
    public long getDelay(TimeUnit timeUnit);
}
```

`getDelay()` 方法返回的值应该是在释放此元素之前的剩余延迟时间。如果返回0或负值，将认为延迟已过期，并且在 `DelayQueue` 上的下一个 `take()` 等调用时释放元素。

传递给 `getDelay()` 方法的 `TimeUnit` 实例是一个 `Enum`，它指示应以哪种时间单位返回延迟。`TimeUnit` 枚举可以取这些值：

```java
DAYS
HOURS
MINUTES
SECONDS
MILLISECONDS
MICROSECONDS
NANOSECONDS
```

如您所见，`Delayed` 接口还扩展了 `java.lang.Comparable` 接口，这意味着 `Delayed` 对象可以相互比较。这可能在 `DelayQueue` 内部用于对队列中的元素进行排序，以便它们按过期时间有序释放。

以下是如何使用 `DelayQueue` 的示例：

```java
public class DelayQueueExample {

    public static void main(String[] args) {
        DelayQueue<Delayed> queue = new DelayQueue<>();

        Delayed element1 = new DelayedElement();

        queue.put(element1);

        Delayed element2 = queue.take();
    }
}
```

`DelayedElement` 是我创建的 `Delayed` 接口的实现。它不是 `java.util.concurrent` 包的一部分。您必须创建自己的 `Delayed` 接口实现才能使用 `DelayQueue` 类。



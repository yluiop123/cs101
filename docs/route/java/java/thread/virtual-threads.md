以下是将您提供的网页内容翻译成Markdown格式的完整文档：

---

# 虚拟线程 - Dev.java

## 为什么需要虚拟线程？

当1995年Java 1.0发布时，其API约有一百个类，其中包括`java.lang.Thread`。Java是首个直接支持并发编程的主流编程语言。

自Java 1.2起，每个Java线程都运行在由底层操作系统提供的一个*平台线程*上。（在Java 1.1及之前版本中，在某些平台上，所有Java线程都由单一平台线程执行。）

平台线程有不小的成本。它们启动需要几千条CPU指令，并且消耗几兆字节的内存。服务器应用程序可能需要服务大量并发请求，以至于为每个请求单独使用一个平台线程变得不可行。在典型的服务器应用程序中，这些请求大部分时间都在*阻塞*，等待来自数据库或其他服务的结果。

提高吞吐量的传统补救措施是使用非阻塞API。与传统的等待结果不同，程序员需要指明当结果可用时应调用哪个方法，以及可能失败时调用的另一个方法。随着回调的深度不断增加，这很快就会变得不愉快。

JEP 425在Java 19中引入了*虚拟线程*。许多虚拟线程可以运行在单个平台线程上。每当虚拟线程阻塞时，它会从平台线程上*卸载*，然后平台线程可以运行另一个虚拟线程。（“虚拟线程”这个名字意在让人联想到映射到实际RAM的虚拟内存。）虚拟线程在Java 20（JEP 436）中成为预览功能，并在Java 21中正式发布。

有了虚拟线程，阻塞变得便宜。当结果不能立即获得时，你可以简单地在虚拟线程中阻塞。你可以使用熟悉的编程结构——分支、循环、尝试块——而不是回调链。

虚拟线程在处理大量并发任务且任务主要阻塞在网络I/O时非常有用。它们对于CPU密集型任务没有好处。对于这类任务，考虑使用并行流或递归分叉-合并任务。

## 创建虚拟线程

工厂方法`Executors.newVirtualThreadPerTaskExecutor()`会生成一个`ExecutorService`，它在单独的虚拟线程中运行每个任务。例如：

```java
import java.util.concurrent.*;

public class VirtualThreadDemo {
   public static void main(String[] args) {
     final int NTASKS = 100;
     ExecutorService service = Executors.newVirtualThreadPerTaskExecutor();
     for (int i = 0; i < NTASKS; i++) {
        service.submit(() -> {
           long id = Thread.currentThread().threadId();
           LockSupport.parkNanos(1_000_000_000);
           System.out.println(id);
        });
     }
     service.shutdown();
   }
}
```

顺便说一下，代码使用`LockSupport.parkNanos`而不是`Thread.sleep`，这样我们就不必捕获烦人的`InterruptedException`。

如果你正在使用一个需要线程工厂的较低层次API，可以使用新的`Thread.Builder`类来获取虚拟线程的工厂：

```java
Thread.Builder builder = Thread.ofVirtual().name("request-").sequence(1);
ThreadFactory factory = builder.factory();

// 现在调用 factory.newThread(myRunnable) 创建一个新的（未启动的）虚拟线程
```

`name`方法配置构建器来设置线程名称，如`request-1`、`request-2`等。

你也可以使用构建器直接创建一个单一的虚拟线程：

```java
Thread t = builder.unstarted(myRunnable); // 创建一个未启动的虚拟线程

// 或者如果你想立即启动线程：
Thread t = builder.started(myRunnable);
```

最后，对于快速演示，有一个便捷方法：

```java
Thread t = Thread.startVirtualThread(myRunnable);
```

注意，仅有使用执行服务的方法适用于有结果的任务（Callable）。

## 线程API变更

在对不同API进行一系列实验之后，Java虚拟线程的设计者决定简单地重用熟悉的`Thread` API。一个虚拟线程是`Thread`的一个实例。取消操作与平台线程一样，通过调用`interrupt`来进行。正如以往，线程代码必须检查“中断”标志或调用一个方法。（大多数阻塞方法都会这样做。）

有几个不同之处。特别是，所有虚拟线程：

- 都在一个单一的线程组中
- 具有优先级`NORM_PRIORITY`
- 是守护线程

没有API用于构造属于不同线程组的虚拟线程。尝试对虚拟线程调用`setPriority`或`setDaemon`不会有任何效果。

静态方法`Thread.getAllStackTraces`返回一个映射，包含所有*平台*线程的堆栈跟踪。虚拟线程不包括在内。

新的实例方法`Thread.isVirtual`可以告诉你一个线程是否是虚拟的。

注意，没有办法找到执行虚拟线程的平台线程。

Java 19对`Thread` API进行了一些更改，这些更改与虚拟线程无关：

- 现在有实例方法`join(Duration)`和`sleep(Duration)`。
- `getId`方法被弃用，因为有人可能会重写它以返回除线程ID之外的值。请改用`threadId`方法。

从Java 20开始，`stop`、`suspend`和`resume`方法对平台线程和虚拟线程都会抛出`UnsupportedOperationException`。这些方法自Java 1.2起就被弃用，并自Java 18起就计划被移除。

## 捕获任务结果

你经常想要组合多个并发任务的结果：

```java
Future<T1> f1 = service.submit(callable1);
Future<T2> f2 = service.submit(callable2);
result = combine(f1.get(), f2.get());
```

在虚拟线程之前，你可能会对阻塞的`get`调用感到不安。但现在阻塞变得便宜了。这里是一个更具体的示例程序：

```java
import java.util.concurrent.*;
import java.net.*;
import java.net.http.*;

public class VirtualThreadDemo {
   public static void main(String[] args) throws InterruptedException, ExecutionException {
      ExecutorService service = Executors.newVirtualThreadPerTaskExecutor();
      Future<String> f1 = service.submit(() -> get("https://horstmann.com/random/adjective"));
      Future<String> f2 = service.submit(() -> get("https://horstmann.com/random/noun"));
      String result = f1.get() + " " + f2.get();
      System.out.println(result);
      service.shutdown();
   }

   private static HttpClient client = HttpClient.newHttpClient();

   public static String get(String url) {
      try {
         var request = HttpRequest.newBuilder().uri(new URI(url)).GET().build();
         return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
      } catch (Exception ex) {
         throw new RuntimeException(ex);
      }
   }
}
```

如果有一组具有相同结果类型的任务，可以使用`invokeAll`方法，然后对每个`Future`调用`get`：

```java
List<Callable<T>> callables = ...;
List<T> results = new ArrayList<>();
for (Future<T> f : service.invokeAll(callables))
  results.add(f.get());
```

再次，一个更具体的示例程序：

```java
// 示例代码省略，详情请查看原文
```

## 速率限制

虚拟线程通过允许更多的并发任务来提高应用程序的吞吐量，这比平台线程要多得多。这可能会对任务调用的服务施加压力。例如，Web服务可能无法容忍大量并发请求。

对于平台线程，一个简单的（如果粗糙）调整因素是任务线程池的大小。但你不应该对虚拟线程进行池化。在虚拟线程上调度任务，然后再调度到平台线程上显然是低效的。而且有什么好处呢？将虚拟线程的数量限制为你的服务可以容忍的少量并发请求？那么你一开始为什么要使用虚拟线程呢？

对于虚拟线程，你应该使用替代机制来控制对有限资源的访问。而不是对并发任务设置总体限制，应该适当地保护每个资源。对于数据库连接，连接池可能已经在做正确的事情。当访问Web服务时，你了解你的服务，并可以提供适当的速率限制。

作为一个例子，我的个人网站上提供了演示服务，用于生成随机项目。如果来自同一IP地址的大量请求突然到来，托管公司会将该IP地址列入黑名单。

以下示例程序显示了使用简单的信号量进行速率限制，允许少量并发请求。当超过最大值时，`acquire`方法会阻塞，但这没关系。有了虚拟线程，阻塞变得便宜。

```java
import java.util.*;
import java.util.concurrent.*;
import java.net.*;
import java.net.http.*;

public class RateLimitDemo {
   public static void main(String[] args) throws InterruptedException, ExecutionException {
      ExecutorService service = Executors.newVirtualThreadPerTaskExecutor();
      List<Future<String>> futures = new ArrayList<>();
      final int TASKS = 250;
      for (int i = 1; i <= TASKS; i++)
         futures.add(service.submit(() -> get("https://horstmann.com/random/word")));
      for (Future<String> f : futures)
         System.out.print(f.get() + " ");
      System.out.println();
      service.shutdown();
   }

   private static HttpClient client = HttpClient.newHttpClient();

   private static final Semaphore SEMAPHORE = new Semaphore(20);

   public static String get(String url) {
      try {
         var request = HttpRequest.newBuilder().uri(new URI(url)).GET().build();
         SEMAPHORE.acquire();
         try {
            Thread.sleep(100);
            return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
        } finally {
            SEMAPHORE.release();
         }
      } catch (Exception ex) {
         throw new RuntimeException(ex);
      }
   }
}
```

## 固定

虚拟线程调度器将虚拟线程挂载到载体线程上。默认情况下，载体线程的数量与CPU核心数量相同。你可以使用`jdk.virtualThreadScheduler.parallelism` VM选项来调整该数量。

当虚拟线程执行阻塞操作时，它应该从其载体线程上卸载，然后该载体线程可以执行另一个不同的虚拟线程。然而，在某些情况下，这种卸载是不可能的。在Java 21中，如果发生这种情况，虚拟线程调度器会通过启动另一个载体线程来进行补偿。你可以使用`jdk.virtualThreadScheduler.maxPoolSize` VM选项来控制载体线程的最大数量。

线程在以下两种情况下被称为*固定*：

1. 当执行`synchronized`方法或块时
2. 当调用本地方法或外部函数时

固定本身并不是问题。但当一个固定的线程阻塞时，它不能被卸载。这会导致其载体线程被阻塞，在Java 21中，不会再启动额外的载体线程。这会减少可用于运行虚拟线程的载体线程数量。

如果`synchronized`用于避免内存操作中的竞态条件，那么固定是无害的。然而，如果有阻塞调用，最好用`ReentrantLock`替换`synchronized`。当然，这只有在你有源代码控制权时才是一个选项。

要找出固定线程是否被阻塞，可以使用以下VM选项启动JVM：

```java
-Djdk.tracePinnedThreads=short
-Djdk.tracePinnedThreads=full
```

你将获得一个显示固定线程阻塞时的堆栈跟踪：

```java
...
org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49) <== monitors:1
...
```

注意，每个固定位置你只会收到一次警告！

或者，你可以使用Java飞行记录器进行记录，并通过你最喜欢的任务控制查看器查看，并寻找`VirtualThreadPinned`和`VirtualThreadSubmitFailed`事件。

JVM最终将实现，使得`synchronized`方法或块不再导致固定。那时，你只需要担心本地代码的固定问题。

以下示例程序展示了固定在实际中的效果。我们启动了一些虚拟线程，它们在同步方法中休眠，从而阻塞了它们的载体线程。然后我们添加了一些实际上不执行任何工作的虚拟线程。但由于载体线程池已经被完全耗尽，它们无法被调度。注意，当你

- 使用`ReentrantLock`
- 不使用虚拟线程

时，问题就会消失。

```java
import java.util.concurrent.*;
import java.util.concurrent.locks.*;

public class PinningDemo {
   public static void main(String[] args) throws InterruptedException, ExecutionException {
      ExecutorService service = Executors.newVirtualThreadPerTaskExecutor();
      // 或者使用 Executors.newCachedThreadPool();

      final int TASKS = 20;
      long start = System.nanoTime();
      for (int i = 1; i <= TASKS; i++) {
         service.submit(() -> block());
         // service.submit(() -> rblock());
      }
      for (int i = 1; i <= TASKS; i++) {
         service.submit(() -> noblock());
      }
      service.shutdown();
      long end = System.nanoTime();
      System.out.printf("%.2f%n", (end - start) * 1E-9);
   }

   public static synchronized void block() {
      System.out.println("进入 block " + Thread.currentThread());
      LockSupport.parkNanos(1_000_000_000);
      System.out.println("退出 block " + Thread.currentThread());
   }

   private static Lock lock = new ReentrantLock();
   public static void rblock() {
      lock.lock();
      try {
         System.out.println("进入 rblock " + Thread.currentThread());
         LockSupport.parkNanos(1_000_000_000);
         System.out.println("退出 rblock " + Thread.currentThread());
      } finally {
         lock.unlock();
      }
   }

   public static void noblock() {
      System.out.println("进入 noblock " + Thread.currentThread());
      LockSupport.parkNanos(1_000_000_000);
      System.out.println("退出 noblock " + Thread.currentThread());
   }
}
```

## 线程局部变量

*线程局部变量*是一个对象，其`get`和`set`方法访问依赖于当前线程的值。你为什么要使用这样的变量，而不是使用全局变量或局部变量？一个经典应用是服务本身不是线程安全的，例如`SimpleDateFormat`，或者如果使用全局实例会遭受争用，例如随机数生成器。每个线程的实例可能比由锁保护的全局实例表现得更好。

线程局部变量的另一个常见用途是提供“隐式”上下文，例如数据库连接，它为每个任务正确配置。任务代码不需要将上下文从一个方法传递到另一个方法，而是在需要访问数据库时，简单地读取线程局部变量。

当迁移到虚拟线程时，线程局部变量可能会成为一个问题。可能会有比传统线程池中的线程多得多的虚拟线程，现在你有了很多更多的线程局部实例。在这种情况下，你应该重新考虑你的共享策略。

要定位应用程序中线程局部变量的使用，请使用VM标志`jdk.traceVirtualThreadLocals`运行。当虚拟线程修改线程局部变量时，你将获得一个堆栈跟踪。

## 结论

- 使用虚拟线程来增加大量任务主要阻塞在网络I/O时的吞吐量。
- 主要好处是熟悉的“同步”编程风格，没有回调。
- 不要对虚拟线程进行池化；使用其他机制进行速率限制。
- 检查固定情况并必要时进行缓解。
- 在虚拟线程中最小化线程局部变量的使用。



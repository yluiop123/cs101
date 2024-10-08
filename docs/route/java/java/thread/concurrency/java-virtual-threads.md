# Java 虚拟线程

从Java 19开始，Java虚拟线程是一种新的线程构造。

Java虚拟线程与原始平台线程不同，因为虚拟线程在运行时所需的资源（RAM）要少得多。因此，你可以在应用程序中运行的虚拟线程数量远远超过平台线程。

运行更多的虚拟线程意味着你可以并行执行更多的阻塞IO，而不是较少的平台线程。如果你的应用程序需要对外部服务（如REST API）进行许多并行网络调用，或者打开许多连接到外部数据库（通过JDBC）或类似的情况，这非常有用。

## Java虚拟线程图示

下图展示了由平台线程执行的Java虚拟线程，这些平台线程又由操作系统线程执行。虽然平台线程一次只能执行一个虚拟线程，但在当前执行的虚拟线程进行阻塞调用（例如网络或并发数据结构）时，它有能力切换到执行不同的虚拟线程。这将在本Java虚拟线程教程的后面部分更详细地解释。

![img](./image/java-virtual-threads-1.png)

## 虚拟线程挂载到平台线程

Java虚拟线程由平台线程执行。平台线程一次只能执行一个虚拟线程。当虚拟线程由平台线程执行时，称该虚拟线程已挂载到该线程。

新的虚拟线程排队等待，直到平台线程准备好执行它。当平台线程准备好时，它会获取一个虚拟线程并开始执行它。

执行一些阻塞网络调用（IO）的虚拟线程将从平台线程上卸载下来，同时等待响应。在此期间，平台线程可以执行另一个虚拟线程。

### 虚拟线程之间没有时间切片

虚拟线程之间没有时间切片发生。换句话说，平台线程不会在执行多个虚拟线程之间切换 - 除非在阻塞网络调用的情况下。只要虚拟线程正在运行代码并没有被阻塞等待网络响应 - 平台线程将继续执行相同的虚拟线程。

## 虚拟线程固定

如上所述，虚拟线程一直保持挂载到平台线程，直到虚拟线程进行阻塞网络调用 - 在这种情况下，虚拟线程会从平台线程上卸载。此外，调用例如BlockingQueue上的阻塞操作也会使虚拟线程卸载。

然而，如果虚拟线程进行阻塞文件系统调用 - 这不会卸载虚拟线程。在文件系统调用期间，虚拟线程仍然固定到平台线程。这意味着，在等待文件系统的响应时，平台线程不能执行任何其他虚拟线程。Java虚拟线程系统可能会通过启动另一个平台线程来运行在文件系统调用期间启动的其他虚拟线程来补偿这一点。

还有其他情况可能当前会使虚拟线程固定到平台线程。例如，进入同步块。如果虚拟线程在同步块内进行阻塞网络调用，虚拟线程也可能仍然固定到平台线程。

哪些情况卸载和固定虚拟线程在未来的Java版本中可能会发生变化，因此你需要关注随着新Java版本发布是如何发展的。

## 创建Java虚拟线程

在Java中创建一个新的虚拟线程，使用新的Thread.ofVirtual()工厂方法，传递Runnable接口的实现。

以下是创建Java虚拟线程的示例：

```java
Runnable runnable = () -> {
    for(int i=0; i<10; i++) {
        System.out.println("Index: " + i);
    }
};

Thread vThread = Thread.ofVirtual().start(runnable);
```

这个示例创建了一个虚拟线程并立即启动它，执行传递给`start()`方法的Runnable。

如果你不希望虚拟线程立即启动，可以使用unstarted()方法。以下是创建未启动虚拟线程的示例：

```java
Thread vThreadUnstarted = Thread.ofVirtual().unstarted(runnable);
```

要启动一个未启动的虚拟线程，你只需在它上面调用start()方法，如下所示：

```java
vThreadUnstarted.start();
```

## 加入虚拟线程

你可以像加入平台线程一样加入虚拟线程 - 这意味着等待虚拟线程完成其工作并停止执行。换句话说，join()方法阻塞调用线程，直到虚拟线程完成其工作并停止执行。以下是加入Java虚拟线程的示例：

```java
Thread vThread = Thread.ofVirtual().start(runnable);

vThread.join();
```

## 使用虚拟线程的ExecutorService

可以创建一个内部使用虚拟线程的Java ExecutorService。我在这里解释了如何做到这一点：创建一个内部使用虚拟线程的ExecutorService。

# 创建和启动Java线程

Java线程就像一个虚拟CPU，可以在你的Java应用程序中执行Java代码。当Java应用程序启动时，它的`main()`方法由主线程执行——这是一个特殊的线程，由Java虚拟机创建，用于运行你的应用程序。从应用程序内部，你可以创建并启动更多的线程，这些线程可以与主线程并行执行应用程序代码。

Java线程和其他Java对象一样，是对象。线程是`java.lang.Thread`类的实例，或者是这个类的子类的实例。除了是对象，Java线程还可以执行代码。在本Java线程教程中，我将解释如何创建和启动线程。

## 创建和启动线程

在Java中创建线程如下：

```java
Thread thread = new Thread();
```

要启动Java线程，将调用它的`start()`方法：

```java
thread.start();
```

此示例未指定线程要执行的任何代码。因此，线程将在启动后立即停止。

有两种方法可以指定线程应执行的代码。第一种是创建Thread的子类并覆盖`run()`方法。第二种方法是将实现了`Runnable`的对象（`java.lang.Runnable`）传递给Thread构造函数。下面介绍这两种方法。

## 线程子类

指定线程要运行的代码的第一种方法是创建Thread的子类并覆盖`run()`方法。`run()`方法是在调用`start()`后由线程执行的。以下是创建Java `Thread`子类的示例：

```java
public class MyThread extends Thread {
    public void run(){
        System.out.println("MyThread running");
    }
}
```

创建并启动上述线程的方法如下：

```java
MyThread myThread = new MyThread();
myThread.start();
```

`start()`调用将在线程启动后立即返回。它不会等待`run()`方法完成。`run()`方法将像由不同CPU执行一样执行。当`run()`方法执行时，它将打印出文本"MyThread running"。

你也可以像这样创建`Thread`的匿名子类：

```java
Thread thread = new Thread() {
    public void run(){
        System.out.println("Thread Running");
    }
};

thread.start();
```

此示例将在新线程执行`run()`方法后打印出文本"Thread running"。

## 可运行接口实现

指定线程应运行的代码的第二种方法是通过创建实现`java.lang.Runnable`接口的类。实现`Runnable`接口的Java对象可以由Java `Thread`执行。稍后在本教程中展示如何实现这一点。

`Runnable`接口是Java平台附带的标准Java接口。`Runnable`接口只有一个`run()`方法。基本上`Runnable`接口如下所示：

```java
public interface Runnable() {
    public void run();
}
```

线程执行时应该做的任何操作都必须包含在`run()`方法的实现中。实现`Runnable`接口有三种方式：

1. 创建实现`Runnable`接口的Java类。
2. 创建实现`Runnable`接口的匿名类。
3. 创建实现`Runnable`接口的Java Lambda表达式。

接下来的部分将解释所有三种选项。

### Java类实现Runnable

实现Java `Runnable`接口的第一种方式是创建自己的Java类来实现`Runnable`接口。以下是一个实现`Runnable`接口的自定义Java类的示例：

```java
public class MyRunnable implements Runnable {
    public void run(){
        System.out.println("MyRunnable running");
    }
}
```

这个`Runnable`实现所做的只是打印文本"MyRunnable running"。打印完该文本后，`run()`方法退出，运行`run()`方法的线程将停止。

### 匿名实现Runnable

你也可以创建`Runnable`的匿名实现。以下是一个实现`Runnable`接口的匿名Java类的示例：

```java
Runnable myRunnable = new Runnable() {
    public void run(){
        System.out.println("Runnable running");
    }
};
```

除了是一个匿名类外，这个示例与使用自定义类实现`Runnable`接口的示例非常相似。

### Java Lambda实现Runnable

实现`Runnable`接口的第三种方式是通过创建Java Lambda表达式实现`Runnable`接口。这是可能的，因为`Runnable`接口只有一个未实现的方法，因此实际上是（尽管可能不是有意的）一个功能性Java接口。

以下是一个实现`Runnable`接口的Java Lambda表达式的示例：

```java
Runnable runnable = () -> { System.out.println("Lambda Runnable running"); };
```

### 使用Runnable启动线程

要让线程执行`run()`方法，将实现`Runnable`接口的类的实例、匿名类或Lambda表达式传递给Thread构造函数。以下是操作方法：

```java
Runnable runnable = new MyRunnable(); // 或匿名类，或lambda...
Thread thread = new Thread(runnable);
thread.start();
```

当线程启动时，它将调用`MyRunnable`实例的`run()`方法，而不是执行自己的`run()`方法。上述示例将打印出文本"MyRunnable running"。

## 子类还是Runnable？

没有规定哪种方法是最好的。两种方法都有效。不过，我个人更喜欢实现`Runnable`，并将实现的实例传递给`Thread`实例。当`Runnable`由线程池执行时，很容易将`Runnable`实例排队，直到线程池中的线程变为空闲状态。使用`Thread`子类则稍微困难一些。

有时，你可能需要同时实现`Runnable`和子类化`Thread`。例如，创建一个可以执行多个`Runnable`的`Thread`子类。这通常是实现线程池时的情况。

## 常见陷阱：调用run()而不是start()

创建和启动线程时的一个常见错误是调用`Thread`的`run()`方法而不是`start()`，如下所示：

```java
Thread newThread = new Thread(MyRunnable());
newThread.run();  // 应该是 start();
```

起初，你可能没有注意到任何问题，因为`Runnable`的`run()`方法像预期的那样被执行了。然而，它不是由你刚刚创建的新线程执行的。相反，`run()`方法是被创建线程的线程执行的。换句话说，就是执行上述两行代码的线程。要让新创建的线程`newThread`调用`MyRunnable`实例的`run()`方法，你必须调用`newThread.start()`方法。

## 线程名称

创建Java线程时，你可以给它一个名称。名称可以帮助你区分不同的线程。例如，如果有多个线程写入`System.out`，看到哪个线程写了文本会很方便。以下是一个示例：

```java
Thread thread = new Thread("New Thread") {
    public void run(){
        System.out.println("run by: " + getName());
    }
};

thread.start();
System.out.println(thread.getName());
```

注意传递给`Thread`构造函数的字符串"New Thread"。这个字符串是线程的名称。名称可以通过`Thread`的`getName()`方法获得。使用`Runnable`实现时，也可以给`Thread`传递一个名称。如下所示：

```java
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable, "New Thread");

thread.start();
System.out.println(thread.getName());
```

不过，注意，由于`MyRunnable`类不是`Thread`的子类，它无法访问执行它的线程的`getName()`方法。

## 当前线程()

`Thread.currentThread()`方法返回执行`currentThread()`的`Thread`实例的引用。这样，你就可以访问代表执行给定代码块的线程的Java `Thread`对象。以下是如何使用`Thread.currentThread()`的示例：

```java
Thread thread = Thread.currentThread();
```

一旦你有了`Thread`对象的引用，你就可以在它上面调用方法。例如，你可以像这样获取当前执行代码的线程的名称：

```java
String threadName = Thread.currentThread().getName();
```

## Java线程示例

这里有一个小型示例。首先，它打印出执行`main()`方法的线程的名称。这个线程由JVM分配。然后它启动了10个线程，并给它们全部指定了一个数字作为名称（`"" + i`）。每个线程然后打印出它的名字，然后停止执行。

```java
public class ThreadExample {
    public static void main(String[] args){
        System.out.println(Thread.currentThread().getName());
        for(int i=0; i<10; i++){
            new Thread("" + i){
                public void run(){
                    System.out.println("Thread: " + getName() + " running");
                }
            }.start();
        }
    }
}
```

请注意，即使线程是按顺序启动的（1、2、3等），它们可能不会按顺序执行，这意味着线程1不一定是第一个将其名称写入`System.out`的线程。这是因为线程原则上是并行执行而不是顺序执行的。JVM和/或操作系统确定线程的执行顺序。这个顺序不必与它们启动的顺序相同。

## 暂停线程

线程可以通过调用静态方法`Thread.sleep()`来暂停自己。`sleep()`方法接受毫秒数作为参数。`sleep()`方法将尝试在继续执行前休眠指定的毫秒数。线程`sleep()`不是100%精确的，但它仍然相当准确。以下是通过调用`Thread` `sleep()`方法暂停Java线程3秒钟（3,000毫秒）的示例：
```java
try {
    Thread.sleep(10L * 1000L);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

执行上述Java代码的线程将睡眠大约10秒钟（10,000毫秒）。

## 停止线程

停止Java线程需要对线程实现代码进行一些准备。Java的`Thread`类包含一个`stop()`方法，但它已弃用。原始的`stop()`方法不能保证线程停止时的状态。这意味着，在执行期间线程访问的所有Java对象将处于未知状态。如果应用程序中的其他线程也访问相同的对象，你的应用程序可能会意外且不可预测地失败。

代替调用`stop()`方法，你必须实现线程代码，使其可以被停止。以下是一个实现了`Runnable`的类的示例，其中包含一个名为`doStop()`的额外方法，用于向`Runnable`发出停止信号。`Runnable`将在准备好时检查此信号并停止。

```java
public class MyRunnable implements Runnable {
    private boolean doStop = false;

    public synchronized void doStop() {
        this.doStop = true;
    }

    private synchronized boolean keepRunning() {
        return this.doStop == false;
    }

    @Override
    public void run() {
        while(keepRunning()) {
            // 继续执行这个线程应该做的工作。
            System.out.println("Running");

            try {
                Thread.sleep(3L * 1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

注意`doStop()`和`keepRunning()`方法。`doStop()`旨在被执行`MyRunnable`的`run()`方法的线程之外的另一个线程调用。`keepRunning()`方法由执行`MyRunnable`的`run()`方法的线程内部调用。只要`doStop()`尚未被调用，`keepRunning()`方法将返回`true`，这意味着执行`run()`方法的线程将继续运行。

以下是启动一个执行上述`MyRunnable`类的Java线程，并在延迟后再次停止它的示例：

```java
public class MyRunnableMain {
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();

        Thread thread = new Thread(myRunnable);

        thread.start();

        try {
            Thread.sleep(10L * 1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        myRunnable.doStop();
    }
}
```

这个示例首先创建了一个`MyRunnable`实例，然后将该实例传递给一个线程并启动该线程。然后执行`main()`方法的线程（主线程）睡眠10秒钟，然后调用`MyRunnable`实例的`doStop()`方法。这将导致执行`MyRunnable`方法的线程停止，因为`doStop()`被调用后`keepRunning()`将返回`false`。

请记住，如果你的`Runnable`实现需要的不仅仅是`run()`方法（例如，还需要`stop()`或`pause()`方法），那么你就不能再使用Java Lambda表达式来创建你的`Runnable`实现了。Java Lambda只能实现单一方法。相反，你必须使用自定义类，或自定义接口扩展`Runnable`具有额外方法的接口，并由匿名类实现。

## 守护线程

Java中的守护线程是一种线程，如果主线程退出应用程序，它不会保持Java虚拟机（JVM）运行。非守护线程即使主线程退出应用程序也会保持JVM运行。

你可以通过其`setDaemon()`方法告诉一个线程成为一个守护线程。以下是在Java中创建守护线程的示例：

```java
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Daemon Thread running.");
    }
});

thread.setDaemon(true);
thread.start();

try {
    thread.join();
} catch (InterruptedException e) {
    throw new RuntimeException(e);
}
```

最后一个调用`thread.join()`只是为了确保主应用程序线程在守护线程有机会执行之前不会退出（并关闭JVM）。




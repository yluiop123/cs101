# Java 同步块

在Java中，一个**同步块**（synchronized block）可以将一个方法或者代码块标记为同步的。Java中的同步块一次只能由单个线程执行（取决于使用方式）。因此，Java同步块可以用来避免竞态条件。

这篇**Java同步教程**（Java Synchronized Tutorial）更详细地解释了Java中`synchronized`关键字的工作原理。

## Java并发工具

`synchronized`机制是Java最初的一种同步机制，用于同步被多个线程共享的对象。但是`synchronized`机制并不十分高级。这就是为什么Java 5引入了一整套并发工具类，帮助开发者实现比`synchronized`更细粒度的并发控制。

## Java 同步关键字

Java中的同步块使用`synchronized`关键字标记。Java中的同步块是针对某个对象进行同步的。所有针对同一个对象同步的同步块一次只能有一个线程在其中执行。所有其他尝试进入同步块的线程都会被阻塞，直到在同步块中的线程退出该块。

`synchronized`关键字可以用来标记四种不同类型的块：

1. 实例方法
2. 静态方法
3. 实例方法内的代码块
4. 静态方法内的代码块

这些块针对不同的对象进行同步。你需要哪种类型的同步块取决于具体情况。下面将更详细地解释这些同步块。

## 同步实例方法

下面是一个同步实例方法的例子：

```java
public class MyCounter {
    private int count = 0;

    public synchronized void add(int value){
        this.count += value;
    }
}
```

注意`add()`方法声明中的`synchronized`关键字的使用。这告诉Java该方法是同步的。

Java中的同步实例方法是针对拥有该方法的实例（对象）进行同步的。因此，每个实例的同步方法都是针对不同的对象进行同步的：即拥有该实例。

每个实例中一次只能有一个线程执行在同步实例方法内。如果存在多个实例，那么每个实例中一次只能有一个线程执行在同步实例方法内。每个实例一个线程。

这对于同一个对象（实例）的所有同步实例方法都是成立的。因此，在下面的例子中，一次只有一个线程可以执行两个同步方法中的任何一个。每个实例总共一个线程：

```java
public class MyCounter {
    private int count = 0;

    public synchronized void add(int value){
        this.count += value;
    }
    public synchronized void subtract(int value){
        this.count -= value;
    }
}
```

## 同步静态方法

静态方法和实例方法一样，使用`synchronized`关键字标记为同步。下面是一个Java同步静态方法的例子：

```java
public static class MyStaticCounter {
    private static int count = 0;

    public static synchronized void add(int value){
        count += value;
    }
}
```

这里`synchronized`关键字同样告诉Java`add()`方法是同步的。

同步静态方法是针对包含该同步静态方法的类的类对象进行同步的。由于每个类在Java虚拟机中只有一个类对象，因此同一个类中一次只能有一个线程执行静态同步方法。

如果一个类包含多个静态同步方法，一次也只能有一个线程同时执行这些方法中的任何一个。看这个静态同步方法的例子：

```java
public static class MyStaticCounter {
    private static int count = 0;

    public static synchronized void add(int value){
        count += value;
    }

    public static synchronized void subtract(int value){
        count -= value;
    }
}
```

任何给定时间，只有一个线程可以执行`add()`和`subtract()`方法中的任何一个。如果线程A正在执行`add()`，那么线程B就不能执行`add()`或`subtract()`，直到线程A退出`add()`。

如果静态同步方法位于不同的类中，那么每个类中一次可以有一个线程执行静态同步方法。每个类一个线程，不管它调用的是哪个静态同步方法。

## 实例方法中的同步块

你不必同步整个方法。有时，只同步方法的一部分可能更可取。Java方法内的同步块使得这成为可能。

下面是一个非同步Java方法中的同步块的Java代码示例：

```java
public void add(int value){
    synchronized(this){
        this.count += value;
    }
}
```

这个例子使用Java同步块结构来标记一段代码为同步的。这段代码现在将像同步方法一样执行。

注意Java同步块结构需要在括号中使用一个对象。在这个例子中使用了"this"，这是调用`add`方法的实例。通过同步结构括号中获取的对象称为监视器对象。代码被称为在监视器对象上同步。同步实例方法使用它所属的对象作为监视器对象。

只有一个线程可以在同一个监视器对象上同步的Java代码块内执行。

下面两个例子都是在它们被调用的实例上同步的。因此，在同步方面它们是等效的：

```java
public class MyClass {
    public synchronized void log1(String msg1, String msg2){
        log.writeln(msg1);
        log.writeln(msg2);
    }

    public void log2(String msg1, String msg2){
        synchronized(this){
            log.writeln(msg1);
            log.writeln(msg2);
        }
    }
}
```

因此，在这个例子中，只有一个线程可以同时执行两个同步块中的任何一个。

如果第二个同步块在不同于`this`的对象上同步，那么每个方法一次将能够有一个线程在内部执行。

## 静态方法中的同步块

同步块也可以在静态方法中使用。这里是前一节中的两个例子作为静态方法。这些方法针对它们所属类的类对象进行同步：

```java
public class MyClass {
    public static synchronized void log1(String msg1, String msg2){
        log.writeln(msg1);
        log.writeln(msg2);
    }

    public static void log2(String msg1, String msg2){
        synchronized(MyClass.class){
            log.writeln(msg1);
            log.writeln(msg2);
        }
    }
}
```

任何给定时间，只有一个线程可以同时执行这两种方法中的任何一个。

如果第二个同步块在不同于`MyClass.class`的对象上同步，那么每个方法可以同时有一个线程在内部执行。

## Lambda表达式中的同步块

甚至可以在Java Lambda表达式以及匿名类内部使用同步块。

下面是一个包含内部同步块的Java Lambda表达式的例子。注意，同步块是针对包含该Lambda表达式的类的类对象进行同步的。如果根据特定用例，使用另一个对象进行同步更有意义，那也是可以的，但在这个例子中使用类对象是可行的。

```java
import java.util.function.Consumer;

public class SynchronizedExample {
    public static void main(String[] args) {
        Consumer<String> func = (String param) -> {
            synchronized(SynchronizedExample.class) {
                System.out.println(
                    Thread.currentThread().getName() +
                    " step 1: " + param);

                try {
                    Thread.sleep((long) (Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                System.out.println(
                    Thread.currentThread().getName() +
                    " step 2: " + param);
            }
        };

        Thread thread1 = new Thread(() -> {
            func.accept("Parameter");
        }, "Thread 1");

        Thread thread2 = new Thread(() -> {
            func.accept("Parameter");
        }, "Thread 2");

        thread1.start();
        thread2.start();
    }
}
```

## Java同步示例

下面是一个示例，启动了两个线程，并且它们都调用了同一个`Counter`实例上的`add`方法。由于方法是在它所属的实例上同步的，一次只有一个线程能够调用同一个实例上的`add`方法。

```java
public class Example {
    public static void main(String[] args){
        Counter counter = new Counter();
        Thread threadA = new CounterThread(counter);
        Thread threadB = new CounterThread(counter);

        threadA.start();
        threadB.start();
    }
}
```

上面示例中使用的两个类是`Counter`和`CounterThread`。

```java
public class Counter {
    long count = 0;

    public synchronized void add(long value){
        this.count += value;
    }
}
```

```java
public class CounterThread extends Thread {
    protected Counter counter = null;

    public CounterThread(Counter counter) {
        this.counter = counter;
    }

    public void run() {
        for(int i=0; i<10; i++){
            counter.add(i);
        }
    }
}
```

创建了两个线程。它们在构造函数中传递了同一个`Counter`实例。

由于`add`方法是实例方法，并且标记为同步，因此`Counter.add()`方法是在实例上同步的。因此，一次只有一个线程可以调用`add()`方法。另一个线程将等待第一个线程离开`add()`方法后才能执行该方法本身。

如果两个线程引用了两个不同的`Counter`实例，那么同时调用`add()`方法将不会有问题。调用将是针对不同的对象，因此被调用的方法也将在不同的对象上同步（拥有方法的对象）。因此调用不会被阻塞。下面展示了如何实现：

```java
public class Example {
    public static void main(String[] args){
        Counter counterA = new Counter
();
        Counter counterB = new Counter();
        Thread threadA = new CounterThread(counterA);
        Thread threadB = new CounterThread(counterB);

        threadA.start();
        threadB.start();
    }
}
```

注意，两个线程threadA和threadB不再引用同一个计数器实例。`counterA`和`counterB`的`add`方法分别在它们各自的拥有实例上同步。因此，在`counterA`上调用`add()`不会阻塞在`counterB`上调用`add()`。

## 同步与数据可见性

如果不使用`synchronized`关键字（或Java volatile关键字），就不能保证当一个线程通过所有线程都可以访问的对象（例如）更改了与其它线程共享的变量的值时，其它线程能够看到更改后的值。没有关于一个线程在CPU寄存器中保持的变量何时被“提交”到主内存的保证，也没有关于其它线程何时从主内存“刷新”一个在CPU寄存器中保持的变量的保证。

`synchronized`关键字改变了这一点。当一个线程进入一个同步块时，它将刷新对线程可见的所有变量的值。当一个线程退出一个同步块时，对线程可见的所有变量的更改都将被提交到主内存。这与volatile关键字的工作方式类似。

## 同步与指令重排序

Java编译器和Java虚拟机允许重新排序代码中的指令，使它们执行得更快，通常是通过使重新排序的指令能够由CPU并行执行。

指令重排序可能会在由多个线程同时执行的代码中引起问题。例如，如果在同步块内部发生的对变量的写操作被重新排序到同步块外面。

为了解决这个问题，Java的`synchronized`关键字对在同步块之前、内部和之后的指令重排序施加了一些限制。这与volatile关键字施加的限制类似。

最终结果是，您可以确信您的代码正确工作——没有发生指令重排序，导致代码的行为与您编写的代码预期的不同。

## 同步在什么对象上

正如在本Java同步教程中多次提到的，同步块必须在某个对象上同步。您实际上可以选择任何对象进行同步，但建议您不要在String对象或任何原始类型包装器对象上同步，因为编译器可能会优化这些对象，以至于您在代码的不同地方使用了相同的实例，而您认为使用的是不同的实例。看这个例子：

```java
synchronized("Hey") {
   //在这里做些事情。
}

```

如果您有多个在字面量String值"Hey"上同步的同步块，那么编译器实际上可能会在幕后使用相同的String对象。结果就是，这两个同步块实际上是在同一个对象上同步的。那可能不是您想要的行为。

使用原始类型包装器对象进行同步也可能会有同样的问题。看这个例子：

```java
synchronized(Integer.valueOf(1)) {
   //在这里做些事情。
}

```

如果您多次调用`Integer.valueOf(1)`，它实际上可能会为相同的输入参数值返回相同的包装器对象实例。这意味着，如果您在同一个原始包装器对象上同步多个块（例如，多次使用`Integer.valueOf(1)`作为监视器对象），那么您就有风险，这些同步块实际上都同步在同一个对象上。那也可能不是您想要的行为。

为了安全起见，可以在`this`或`new Object()`上同步。这些不会被Java编译器、Java虚拟机或Java库在内部缓存或重用。

## 同步块的限制和替代方案

Java中的同步块有一些限制。例如，Java中的同步块一次只允许一个线程进入。但是，如果两个线程只是想读取一个共享值，而不是更新它呢？那可能是安全的允许。作为同步块的替代方案，您可以使用读写锁来保护代码，它比同步块具有更高级的锁定语义。Java实际上提供了一个内置的ReadWriteLock类供您使用。

如果您想允许N个线程进入同步块，而不仅仅是一个呢？您可以使用Semaphore来实现这种行为。Java实际上提供了一个内置的Java Semaphore类供您使用。

同步块不保证等待进入它们的线程按什么顺序被授予访问同步块的权限。

如果您需要保证尝试进入同步块的线程按照它们请求访问的确切顺序获得访问权限呢？您需要自己实现公平性。

如果您只有一个线程正在写入共享变量，而其他线程只读取该变量呢？那么您可能可以使用一个volatile变量，而不需要任何同步。

## 同步块的性能开销

进入和退出Java中的同步块有很小的性能开销。随着Java的发展，这种性能开销已经降低了，但仍然需要付出一定的代价。

进入和退出同步块的性能开销主要需要担心的是，如果您在紧密循环中多次进入和退出同步块。

同时，尽量不要让同步块比必要的大。换句话说，只同步确实需要同步的操作——避免阻塞其他线程执行不需要同步的操作。只同步同步块中绝对必要的指令。这应该会增加您代码的并行性。

## 同步块的可重入性

一旦一个线程进入了一个同步块，该线程就被认为是“持有”了同步块所同步的监视器对象上的“锁”。如果线程调用了另一个方法，该方法又回调到包含同步块的第一个方法，持有锁的线程可以重新进入同步块。它不会被阻塞，仅仅因为它自己持有锁。只有在不同的线程持有锁时才会被阻塞。

看这个例子：

```java
public class MyClass {
    List<String> elements = new ArrayList<String>();

    public void count() {
        if(elements.size() == 0) {
            return 0;
        }
        synchronized(this) {
            elements.remove();
            return 1 + count();
        }
    }
}

```

暂时忘掉上述计数列表元素的方法根本没有意义。

只关注在`count()`方法内的同步块是如何递归调用`count()`方法的。因此，调用count()的线程最终可能多次进入同一个同步块。这是允许的。这是可能的。

但请注意，如果一个线程进入多个同步块的设计可能会导致嵌套监视器锁定，如果您不仔细设计代码的话。

## 集群设置中的同步块

请注意，同步块只阻止同一Java虚拟机中的线程进入该代码块。如果您在集群中的多个Java虚拟机上运行相同的Java应用程序，那么每个Java虚拟机中的一个线程可能同时进入该同步块。

如果您需要在集群中的所有Java虚拟机上进行同步，您将需要使用其他同步机制而不仅仅是同步块。



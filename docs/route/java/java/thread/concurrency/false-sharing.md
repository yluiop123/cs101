# Java中的伪共享

在Java中，**伪共享**（False Sharing）发生在两个线程分别在两个不同的CPU上运行时，它们写入两个不同的变量，而这些变量恰好存储在同一个CPU缓存行中。当第一个线程修改其中一个变量时，整个CPU缓存行在另一个线程正在运行的CPU的缓存中就会失效。这意味着其他CPU需要重新加载该失效缓存行的内容，即使它们并不真的需要那个在缓存行中被修改的变量。

## 伪共享示意图

下图展示了Java中的伪共享：

![伪共享示意图](./image/false-sharing-in-java-1.png)

图中显示了两个在不同CPU上运行的线程，它们写入不同变量——这些变量存储在同一个CPU缓存行中——导致伪共享。

## 缓存行

当CPU缓存从低级缓存或主RAM（例如，从L2到L1，从L3到L2，以及从L3到主RAM）读取数据时，它们不会一次只读取一个字节。那样效率太低。相反，它们一次读取一个**缓存行**（Cache Line）。
一个缓存行通常由64字节组成。因此，缓存一次从低级缓存或主RAM读取64字节。

由于缓存行包含多个字节，一个缓存行通常存储多个变量。
如果同一个CPU需要访问存储在同一个缓存行中的多个变量——这是一个优势。
如果多个CPU需要访问存储在同一个缓存行中的变量，则可能发生伪共享。

## 缓存行失效

当CPU写入缓存行中的内存地址时，通常因为CPU正在写入一个变量，该缓存行就会变成**脏**（Dirty）。然后需要将该缓存行同步到其他也拥有该缓存行的CPU的缓存中。存储在其他CPU缓存中的相同缓存行因此变得**无效**——换句话说，它们需要被刷新。

在上面的图中，使缓存行变脏用蓝色线条表示，缓存行失效用红色箭头表示。

缓存失效后的缓存刷新可以通过缓存一致性机制或从主RAM重新加载缓存行来完成。

CPU在缓存行被刷新之前不允许访问该缓存行。

## 伪共享导致性能损失

当一个缓存行因为另一个CPU更改了该缓存行内的数据而失效时，那么该失效的缓存行需要被刷新——要么来自L3缓存，要么通过缓存一致性机制。
因此，如果CPU需要读取该失效的缓存行，它必须等待缓存行被刷新。
这导致性能下降。CPU的时间被浪费在等待缓存行刷新上——这意味着在那段时间内CPU可以执行的指令更少。

伪共享意味着两个（或更多）CPU正在写入存储在同一个缓存行中的变量，但每个CPU并不真正依赖另一个CPU写入的值。然而，它们仍然都在不断地使缓存行变脏，导致它对另一个CPU失效，迫使另一个CPU刷新它——然后另一个CPU也使缓存行变脏，导致第一个CPU必须刷新它，等等。

解决伪共享的方法是改变你的数据结构，使得不同线程使用的独立变量不再存储在同一个缓存行中。

注意：即使CPU有时使用另一个CPU写入的变量，你仍然可以从确保共享变量不存储在同一个缓存行中获益。具体有多少好处，你需要通过实验来找出——在你具体的情况下。

## 伪共享Java代码示例

下面两个类说明了Java应用程序中如何发生伪共享。

第一个类是一个由两个线程使用的Counter类。第一个线程将增加`count1`字段，第二个线程将增加`count2`字段。

```java
public class Counter {
    public volatile long count1 = 0;
    public volatile long count2 = 0;
}
```

以下是启动两个线程增加同一个Counter实例中两个计数器字段的代码示例：

```java
public class FalseSharingExample {
    public static void main(String[] args) {

        Counter counter1 = new Counter();
        Counter counter2 = counter1;

        long iterations = 1_000_000_000;

        Thread thread1 = new Thread(() -> {
            long startTime = System.currentTimeMillis();
            for(long i=0; i<iterations; i++) {
                counter1.count1++;
            }
            long endTime = System.currentTimeMillis();
            System.out.println("total time: " + (endTime - startTime));
        });
        Thread thread2 = new Thread(() -> {
            long startTime = System.currentTimeMillis();
            for(long i=0; i<iterations; i++) {
                counter2.count2++;
            }
            long endTime = System.currentTimeMillis();
            System.out.println("total time: " + (endTime - startTime));
        });

        thread1.start();
        thread2.start();
    }
}
```

在我的笔记本电脑上，运行这个示例大约需要36秒。

如果代码改为每个线程增加两个不同的Counter实例的字段（如下所示），那么代码只需要大约9秒即可运行。这与有和没有伪共享的代码之间的差异是一个4倍的因素。这是一个相当大的差异！

这种速度差异很可能是由第一个示例中的伪共享引起的，其中共享Counter实例中的`count1`和`count2`字段在运行时位于同一个缓存行中。在第二个示例（如下）中，两个线程使用各自它们自己的Counter实例，这些实例不再将字段存储在同一个缓存行中。因此，没有发生伪共享，代码运行得更快。

这是更改后的代码。唯一更改的行用粗体文本标记：

```java
public class FalseSharingExample {
    public static void main(String[] args) {

        Counter counter1 = new Counter();
        Counter counter2 = new Counter();

        long iterations = 1_000_000_000;

        Thread thread1 = new Thread(() -> {
            long startTime = System.currentTimeMillis();
            for(long i=0; i<iterations; i++) {
                counter1.count1++;
            }
            long endTime = System.currentTimeMillis();
            System.out.println("total time: " + (endTime - startTime));
        });
        Thread thread2 = new Thread(() -> {
            long startTime = System.currentTimeMillis();
            for(long i=0; i<iterations; i++) {
                counter2.count2++;
            }
            long endTime = System.currentTimeMillis();
            System.out.println("total time: " + (endTime - startTime));
        });

        thread1.start();
        thread2.start();
    }
}
```

## 修复伪共享问题

修复伪共享问题的方法是设计你的代码，使得不同线程使用的不同的变量不要最终被存储在同一个CPU缓存行中。具体如何做到这一点取决于你的具体代码，但是将变量存储在不同的对象中是一种方法——正如前一节中的示例所示。

## 使用@Contented注解防止伪共享

从Java 8和9开始，Java有了一个**@Contended**注解，它可以在类中用空字节填充字段（存储在RAM中时在字段之后），以确保该类的对象中的字段不会存储在同一个CPU缓存行中。以下是早期示例中带有`@Contended`注解添加到字段之一的Counter类。添加此注解使执行时间降低到大约与两个线程使用两个不同的Counter实例时相同的时间。以下是修改后的Counter类：

```java
public class Counter1 {
    @jdk.internal.vm.annotation.Contended
    public volatile long count1 = 0;
    public volatile long count2 = 0;
}
```

### 对类使用@Contended注解

你可以在类定义上方使用`@Contended`，使得所有字段相互之间都有填充。然而，在我的示例中，这样做并没有减少执行时间。注释第一个字段确实有效。确保你在选择之前对不同选项进行性能测量。以下是使用`@Contended`注解Counter类的示例：

```java
@jdk.internal.vm.annotation.Contended
public class Counter1 {
    public volatile long count1 = 0;
    public volatile long count2 = 0;
}
```

### 对字段使用@Contented注解

你可以在字段上方使用`@Contended`，以便对该字段和类中的其他字段进行填充。

以下是如何使用`@Contended`注解字段的示例：

```java
public class Counter1 {
    @jdk.internal.vm.annotation.Contended
    public volatile long count1 = 0;

    @jdk.internal.vm.annotation.Contended
    public volatile long count2 = 0;
}
```

### 组合字段

`@Contended`注解使得将字段分组成为可能，使得分组的字段在RAM中紧密地保持在一起，但在它们和其他类字段之间有填充。以下是使用`@Contended`注解对字段进行分组的示例：

```java
public class Counter1 {
    @jdk.internal.vm.annotation.Contended("group1")
    public volatile long count1 = 0;

    @jdk.internal.vm.annotation.Contended("group1");
    public volatile long count2 = 0;

    @jdk.internal.vm.annotation.Contended("group2");
    public volatile long count3 = 0;
}
```

在这个示例中，字段`count1`和`count2`被分组在同一个名为`group1`的组中，字段`count3`位于它自己的组中。因此，`count1`和`count2`将在类中紧密地放在一起，但它们和`count3`字段之间将有填充。

组名除了匹配字段到组之外并不重要。

### 配置填充大小

默认情况下，@Contended注解在用@Contended注解的字段之后添加128字节的填充。
然而，你可以通过JVM命令行参数告诉Java VM使用多少字节作为填充。以下是该命令行参数的样子：

```java
-XX:ContendedPaddingWidth=64
```

这个参数配置Java VM使用64字节作为@Contended注解的填充，而不是128字节。

避免Java中伪共享所需的填充字节数量取决于底层硬件架构——即每个CPU缓存行包含多少字节。如果知道这一点，你可以优化防止伪共享的填充以匹配缓存行大小。因此，如果缓存行只有64字节，那么就没有必要用128字节进行填充。此外，如果缓存行是256字节，那么只填充128字节就不足以防止伪共享。




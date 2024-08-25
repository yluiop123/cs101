# Java Happens Before 保证

Java的**happens before保证**是一组规则，规定了Java虚拟机（JVM）和CPU如何在不改变程序语义的情况下重新排序指令以提高性能。happens before保证使得线程能够在变量值同步到或从主内存中同步出来时依赖于此，以及同时同步了哪些其他变量。

Java happens before保证主要围绕对`volatile`变量的访问以及在同步块内访问的变量。

本Java happens before保证教程将提及由Java `volatile`和Java `synchronized`声明提供的happens before保证，但我不会在本教程中解释这些声明的所有内容。这些术语在以下链接中有更详细的介绍：

- Java volatile教程
- Java synchronized教程

## 指令重排序

现代CPU有能力并行执行指令，如果这些指令彼此不依赖。例如，以下两个指令不依赖于彼此，因此可以并行执行：

```java
a = b + c
d = e + f
```

然而，以下两个指令不能轻易地并行执行，因为第二条指令依赖于第一条指令的结果：

```java
a = b + c
d = a + e
```

想象一下，上述两条指令是一组更大指令集的一部分，如下所示：

```java
a = b + c
d = a + e
l = m + n
y = x + z
```

指令可以像下面这样重新排序。然后CPU至少可以并行执行前三条指令，并在第一条指令完成后立即开始执行第四条指令。

```java
a = b + c
l = m + n
y = x + z
d = a + e
```

如你所见，重新排序指令可以增加CPU中指令的并行执行。增加的并行化意味着提高性能。

只要程序的语义没有改变，Java虚拟机和CPU就允许指令重排序。最终结果必须与指令在源代码中列出的确切顺序执行时相同。

## 多CPU计算机中的指令重排序问题

指令重排序在多线程、多CPU系统中带来了一些挑战。我将尝试通过一个代码示例来说明这些问题。请记住，该示例是特意构造来说明这些问题的。因此，代码示例绝不是任何推荐！

想象两个线程协作尽可能快地在屏幕上绘制帧。一个线程生成帧，另一个线程在屏幕上绘制帧。

这两个线程需要通过某种通信机制交换帧。在以下代码示例中，我创建了这样一个通信机制的示例 - 一个名为FrameExchanger的Java类。

帧生成线程尽可能快地生成帧。帧绘制线程将尽可能快地绘制这些帧。

有时，生产者线程可能在绘制线程有时间绘制它们之前就生产了2帧。在这种情况下，应该只绘制最新的帧。我们不希望绘制线程落后于生产者线程。如果生产者线程在前一帧被绘制之前就准备好了新帧，那么前一帧将被新帧覆盖。换句话说，前一帧被“丢弃”。

有时，绘制线程可能会绘制一帧，并在生产者线程产生新帧之前准备好绘制新帧。在这种情况下，我们希望绘制帧等待新帧。没有必要浪费CPU和GPU资源重绘刚刚绘制的完全相同的帧！屏幕不会有任何变化，用户也不会看到任何新内容。

FrameExchanger统计存储的帧数和取出的帧数，这样我们就可以了解有多少帧被丢弃。

以下是FrameExchanger的代码。注意：Frame类定义被省略了。这不重要，理解FrameExchanger的工作原理不需要知道这个类的样子。生产者线程将连续调用`storeFrame()`，绘制线程将连续调用`takeFrame()`。

```java
public class FrameExchanger  {
    private long framesStoredCount = 0;
    private long framesTakenCount  = 0;

    private boolean hasNewFrame = false;
    private Frame frame = null;

    // 由帧生成线程调用
    public void storeFrame(Frame frame) {
        this.frame = frame;
        this.framesStoredCount++;
        this.hasNewFrame = true;
    }

    // 由帧绘制线程调用
    public Frame takeFrame() {
        while( !hasNewFrame) {
            // 忙等待直到新帧到达
        }

        Frame newFrame = this.frame;
        this.framesTakenCount++;
        this.hasNewFrame = false;
        return newFrame;
    }
}
```

注意`storeFrame()`方法内的三条指令看起来它们彼此之间没有依赖。这意味着，对于Java虚拟机和CPU来说，如果Java虚拟机或CPU确定重新排序指令会有利，那么重新排序指令似乎是可以的。然而，想象一下如果指令像下面这样重新排序会发生什么：

```java
public void storeFrame(Frame frame) {
    this.hasNewFrame = true;
    this.framesStoredCount++;
    this.frame = frame;
}
```

注意字段`hasNewFrame`现在在`frame`字段被分配引用新帧对象之前被设置为`true`。这意味着，如果绘制线程在`takeFrame()`方法中的while循环中等待，绘制线程可能会退出那个while循环，并取出旧的帧对象。这将导致重绘旧帧，导致资源浪费。

显然，在这种特殊情况下，重绘旧帧不会导致应用程序崩溃或故障。它只是浪费CPU和GPU资源。然而，在其他情况下，这样的指令重新排序可能会使应用程序出现故障。

## Java volatile可见性保证

Java `volatile`关键字为写入和读取volatile变量时的同步提供了一些可见性保证，这些同步将变量的值与主内存同步。这种与主内存的同步是使值对其他线程**可见**的原因。因此称为_可见性保证_。

在本节中，我将简要介绍Java volatile可见性保证，并解释指令重排序如何可能破坏volatile可见性保证。这就是为什么我们还有Java volatile _happens before保证_，以限制指令重排序，以便volatile可见性保证不会被指令重排序破坏。

## Java volatile写入可见性保证

当您写入Java `volatile`变量时，保证值直接写入主内存。此外，对写入volatile变量的线程可见的所有变量也将同步到主内存。

为了说明Java volatile写入可见性保证，请看这个例子：

```java
this.nonVolatileVarA = 34;
this.nonVolatileVarB = new String("Text");
this.volatileVarC    = 300;
```

这个例子包含对两个非volatile变量的写入，以及对volatile变量的一个写入。例子没有明确显示哪个变量声明为volatile，为了清楚起见，想象变量（字段，真的）名为`volatileVarC`被声明为`volatile`。

当上述例子中的第三条指令写入volatile变量`volatileVarC`时，两个非volatile变量的值也将同步到主内存 - 因为这些变量在写入volatile变量时对线程可见。

### Java volatile读取可见性保证

当您读取Java `volatile`的值时，保证值直接从内存中读取。此外，读取volatile变量时对线程可见的所有变量的值也将从主内存中刷新。

为了说明Java volatile读取可见性保证，请看这个例子：

```java
c = other.volatileVarC;
b = other.nonVolatileB;
a = other.nonVolatileA;
```

注意第一条指令是读取`volatile`变量（`other.volatileVarC`）。当`other.volatileVarC`从主内存中读取时，`other.nonVolatileB`和`other.nonVolatileA`也从主内存中读取。

## Java Volatile Happens Before保证

Java volatile happens before保证对volatile变量周围的指令重排序设置了一些限制。为了说明为什么需要这种保证，让我们修改本教程前面`FrameExchanger`类，使`hasNewFrame`变量声明为`volatile`：

```java
public class FrameExchanger  {
    private long framesStoredCount = 0;
    private long framesTakenCount  = 0;

    private volatile boolean hasNewFrame = false;
    private Frame frame = null;

    // 由帧生成线程调用
    public void storeFrame(Frame frame) {
        this.frame = frame;
        this.framesStoredCount++;
        this.hasNewFrame = true;
    }

    // 由帧绘制线程调用
    public Frame takeFrame() {
        while( !hasNewFrame) {
            // 忙等待直到新帧到达
        }

        Frame newFrame = this.frame;
        this.framesTakenCount++;
        this.hasNewFrame = false;
        return newFrame;
    }
}
```

现在，当`hasNewFrame`变量设置为`true`时，`frame`和`frameStoredCount`也将同步到主内存。此外，每次绘制线程在`takeFrame()`方法中的while循环内读取`hasNewFrame`变量时，`frame`和`framesStoredCount`也将从主内存中刷新。甚至`framesTakenCount`此时也会从主内存中更新。

想象一下，如果Java虚拟机重新排序了`storeFrame()`方法中的指令，像这样：

```java
// 由帧生成线程调用
public void storeFrame(Frame frame)
{
    this.hasNewFrame = true;
    this.framesStoredCount++;
    this.frame = frame;
}
```

现在`framesStoredCount`和`frame`字段将在执行第一条指令时同步到主内存（因为`hasNewFrame`是volatile） - 这是在它们被赋予新值之前！

这意味着，执行`takeFrame()`方法的绘制线程可能会在`frame`变量被赋予新值之前就退出`while`循环。即使生产者线程已经为`frame`变量分配了新值，也不会有任何保证这个值已经被同步到主内存，以便对绘制线程可见！

### 对volatile变量写入的Happens Before保证

正如你看到的，`storeFrame()`方法中指令的重新排序可能会使应用程序出现故障。这里就是volatile写入happens before保证的用武之地 - 对围绕volatile变量写入的指令重排序设置一些限制：

在写入volatile变量之前发生的对非volatile或volatile变量的写入保证在写入该volatile变量之前发生。

在`storeFrame()`方法的情况下，这意味着前两个写入指令不能重新排序以在对`hasNewFrame`的最后一次写入之后发生，因为`hasNewFrame`是一个volatile变量。

```java
// 由帧生成线程调用
public void storeFrame(Frame frame) {
    this.frame = frame;
    this.framesStoredCount++;
    this.hasNewFrame = true;  // hasNewFrame是volatile
}
```

前两个指令没有写入volatile变量，所以它们可以被Java虚拟机自由地重新排序。因此，这种重新排序是允许的：

```java
// 由帧生成线程调用
public void storeFrame(Frame frame) {
    this.framesStoredCount++;
    this.frame = frame;
    this.hasNewFrame = true;  // hasNewFrame是volatile
}
```

这种重新排序不会破坏`takeFrame()`方法中的代码，因为`frame`变量在写入`hasNewFrame`变量之前仍然被写入。整个程序仍然按预期工作。

### 对volatile变量读取的Happens Before保证

Java中的volatile变量对volatile变量的读取有一个类似的happens before保证。只是方向相反：

对volatile变量的读取将发生在随后对volatile和非volatile变量的读取之前。

当我说方向与写入不同，我的意思是对于volatile写入，所有_在写入之前_的指令将保持在volatile写入之前。对于volatile读取，所有_在读取之后_的读取将保持在volatile读取之后。

看下面的例子：

```java
int a = this.volatileVarA;
int b = this.nonVolatileVarB;
int c = this.nonVolatileVarC;
```

由于第一条指令读取了volatile变量，因此2和3两条指令都必须保持在第一条指令之后，因为第一条指令读取了volatile变量。换句话说，volatile变量的读取保证在随后对两个非volatile变量的读取之前发生。

最后两条指令可以自由地重新排序，而不会违反第一条指令中volatile读取的happens before保证。因此，这种重新排序是允许的：

```java
int a = this.volatileVarA;
int c = this.nonVolatileVarC;
int b = this.nonVolatileVarB;
```

由于volatile读取可见性保证，当`this.volatileVarA`从主内存中读取时，所有在该时间点对线程可见的其他变量也会从主内存中刷新。这意味着，读取`volatileVarA`的线程可以依赖于`nonVolatileVarB`和`nonVolatileVarC`也与主内存保持最新。

如果最后两条指令中的任何一条被重新排序到第一条volatile读取指令之上，那么在执行该指令时的保证将不成立。这就是为什么后续读取不能被重新排序以出现在对volatile变量的读取之上。

关于`takeFrame()`方法，第一条对volatile变量的读取是while循环内`hasNewFrame`字段的读取。这意味着，没有任何读取指令可以重新排序到位于该位置之上。在这个特定的例子中，将任何其他读取操作移动到while循环之上也会破坏代码的语义，所以这些重新排序无论如何都是不允许的。

```java
// 由帧绘制线程调用
public Frame takeFrame() {
    while( !hasNewFrame) {
        // 忙等待直到新帧到达
    }

    Frame newFrame = this.frame;
    this.framesTakenCount++;
    this.hasNewFrame = false;
    return newFrame;
}
```

## Java Synchronized可见性保证

Java `synchronized`块提供了类似于Java `volatile`变量的可见性保证。我将简要解释Java synchronized可见性保证。

### Java Synchronized入口可见性保证

当一个线程进入一个`synchronized`块时，对线程可见的所有变量都会从主内存中刷新。

### Java Synchronized出口可见性保证

当一个线程退出一个`synchronized`块时，对线程可见的所有变量都会被写回到主内存。

### Java Synchronized可见性示例

看这个`ValueExchanger`类：

```java
public class ValueExchanger {
    private int valA;
    private int valB;
    private int valC;

    public void set(Values v) {
        this.valA = v.valA;
        this.valB = v.valB;

        synchronized(this) {
            this.valC = v.valC;
        }
    }

    public void get(Values v) {
        synchronized(this) {
            v.valC = this.valC;
        }
        v.valB = this.valB;
        v.valA = this.valA;
    }
}
```

注意`set()`和`get()`方法内的两个synchronized块。注意这些块在两个方法中的位置，分别在最后和最前面。

在`set()`方法中，方法末尾的synchronized块将强制在退出synchronized块时将所有变量刷新（写入）到主内存。

在`get()`方法中，synchronized块位于方法开头。当调用`get()`的线程进入synchronized块时，所有变量都会重新从主内存中读取。这就是为什么这个synchronized块被放置在方法开头 - 以保证在读取之前所有变量都从主内存中刷新。

## Java Synchronized Happens Before保证

Java synchronized块提供了两个happens before保证：一个与synchronized块的开始相关，另一个与synchronized块的结束相关。我将在以下各节中介绍这两个保证。

### Java Synchronized块开始Happens Before保证

Java synchronized块的开始提供了可见性保证（在本教程前面提到过），当一个线程进入一个synchronized块时，对线程可见的所有变量将被读取（从主内存中刷新）。

为了能够维持这一保证，需要对指令重排序进行一系列限制。为了说明原因，我将使用前面展示的`ValueExchanger`的`get()`方法：

```java
public void get(Values v) {
    synchronized(this) {
        v.valC = this.valC;
    }
    v.valB = this.valB;
    v.valA = this.valA;
}
```

如你所见，方法开头的synchronized块将保证所有变量`this.valC`、`this.valB`和`this.valA`都从主内存中刷新。随后对这些变量的读取将使用最新值。

为了使这工作，这些变量的读取不能被重新排序以出现在synchronized块的开始之前。如果变量的读取被重新排序以出现在synchronized块的开始之前，你将失去变量值从主内存刷新的保证。如果指令被不允许地重新排序，情况将如下：

```java
public void get(Values v) {
    v.valB = this.valB;
    v.valA = this.valA;
    synchronized(this) {
        v.valC = this.valC;
    }
}
```

### Java Synchronized块结束Happens Before保证

synchronized块的结束提供了可见性保证，即当线程退出synchronized块时，所有更改的变量将被写回到主内存。

为了能够维持这一保证，需要对指令重排序进行一系列限制。为了说明原因，我将使用前面展示的`ValueExchanger`的`set()`方法：

```java
public void set(Values v) {
    this.valA = v.valA;
    this.valB = v.valB;

    synchronized(this) {
        this.valC = v.valC;
    }
}
```

如你所见，方法末尾的synchronized块将保证所有更改的变量`this.valA`、`this.valB`和`this.valC`将在调用`set()`的线程退出synchronized块时被写回到（刷新到）主内存。

为了使这工作，对变量的写入不能被重新排序以出现在synchronized块的结束之后。如果对变量的写入被重新排序以出现在synchronized块的结束之后，你将失去变量值被写回到主内存的保证。如果指令被不允许地重新排序，情况将如下：

```java
public void set(Values v) {
    synchronized(this) {
        this.valC = v.valC;
    }
    this.valA = v.valA;
    this.valB = v.valB;
}
```



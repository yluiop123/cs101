# Java Lock

## 概述
Java `Lock` 接口，`java.util.concurrent.locks.Lock`，表示一个并发锁，可用于保护关键代码段中的竞态条件。因此，Java Lock接口提供了一种比Java同步块更灵活的替代方案。

如果你不熟悉Java同步块、竞态条件和关键代码段，可以阅读我的教程：
- Java Synchronized
- Race Conditions and Critical Sections

顺便说一下，在我的Java并发教程中，我描述了如何实现你自己的锁，如果你感兴趣（或需要）。详见我的Locks文本以获取更多详情。

## Lock和同步块的主要区别
`Lock` 和同步块之间的主要区别包括：
- 同步块不保证等待进入它的线程的顺序。
- 你不能向同步块的入口传递任何参数。因此，尝试获取同步块访问权限时不能设置超时。
- 同步块必须完全包含在一个单一方法中。
`Lock` 可以将其对 `lock()` 和 `unlock()` 的调用放在不同的方法中。

## Java Lock实现
由于Java Lock是一个接口，你不能直接创建Lock实例。你必须创建实现Lock接口的类的实例。`java.util.concurrent.locks` 包有以下Lock接口的实现：
- `java.util.concurrent.locks.ReentrantLock`

在接下来的部分中，我将解释如何使用ReentrantLock类作为Lock。

## 创建可重入锁
创建 `ReentrantLock` 类的实例非常简单，只需使用 `new` 操作符，如下所示：
```java
Lock lock = new ReentrantLock();
```
现在你拥有了一个Java Lock实例，实际上是一个ReentrantLock实例。

## 锁定和解锁Java Lock
由于 `Lock` 是一个接口，你需要使用它的一个实现来在你的应用程序中使用 `Lock`。以下示例中，我创建了一个ReentrantLock实例。要锁定Lock实例，你必须调用它的 `lock()` 方法。要解锁Lock实例，你必须调用它的 `unlock()` 方法。以下是锁定和解锁Java锁实例的示例：
```java
Lock lock = new ReentrantLock();

lock.lock();

// 关键代码段

lock.unlock();
```
首先创建一个 `Lock`。然后调用它的 `lock()` 方法。现在 `Lock` 实例被锁定了。任何其他线程调用 `lock()` 将被阻塞，直到锁定锁的线程调用 `unlock()`。最后调用 `unlock()`，`Lock` 现在被解锁，其他线程可以锁定它。

显然，所有线程必须共享同一个Lock实例。如果每个线程创建自己的Lock实例，那么它们将锁定在不同的锁上，因此不会阻止彼此访问。我稍后将在本Java Lock教程中展示一个共享Lock实例的示例。

### 容错锁定和解锁
如果你查看上一节中的示例，想象一下如果在调用 `lock.lock()` 和 `lock.unlock()` 之间抛出异常会发生什么。异常将中断程序流程，调用 `lock.unlock()` 将永远不会执行。因此，锁将永远保持锁定。

为了避免异常永久锁定Lock，你应该在try-finally块内锁定和解锁它，像这样：
```java
Lock lock = new ReentrantLock();

try{
    lock.lock();
    // 关键代码段
} finally {
    lock.unlock();
}
```
这样，即使在try块内抛出异常，Lock也会被解锁。

## 示例：受锁保护的计数器
为了更好地理解使用Lock与使用同步块的不同之处，我创建了两个简单的并发计数器类，它们以不同的方式保护其内部的 `count`。第一个类使用同步块，第二个类使用Java Lock：
```java
public class CounterSynchronized {
    private long count = 0;

    public synchronized void inc() {
        this.count++;
    }

    public synchronized long getCount() {
        return this.count;
    }
}

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class CounterLock {
    private long count = 0;

    private Lock lock = new ReentrantLock();

    public void inc() {
        try {
            lock.lock();
            this.count++;
        } finally {
            lock.unlock();
        }
    }

    public long getCount() {
        try {
            lock.lock();
            return this.count;
        } finally {
            lock.unlock();
        }
    }
}
```
注意，`CounterLock` 类比 `CounterSynchronized` 类长。然而，使用Java Lock来保护内部的 `count` 变量可能提供更高的灵活性，如果你需要的话。这些简单的例子实际上并不需要它 - 但更高级的计数器可能会。

## 可重入锁
如果一个线程持有锁并且可以再次锁定它，这种锁被称为可重入的。非可重入锁是一种如果已经锁定，则不能再次被锁定的锁，即使是持有锁的线程也不行。非可重入锁可能导致重入锁定，这是一种类似于死锁的情况。

`ReentrantLock` 类是一个可重入锁。这意味着，即使一个线程持有锁，它也可以再次锁定它。因此，线程必须解锁它锁定的次数，以便完全解锁 `ReentrantLock` 供其他线程使用。

可重入锁在某些并发设计中很有用。以下是计算器的并发实现。计算器可以在内部保存当前结果，并提供一组方法来执行结果上的计算。
```java
public class Calculator {
    public static class Calculation {
        public static final int UNSPECIFIED = -1;
        public static final int ADDITION    = 0;
        public static final int SUBTRACTION = 1;
        int type = UNSPECIFIED;

        public double value;

        public Calculation(int type, double value){
            this.type  = type;
            this.value = value;
        }
    }

    private double result = 0.0D;
    Lock lock = new ReentrantLock();

    public void add(double value) {
        try {
            lock.lock();
            this.result += value;
        } finally {
            lock.unlock();
        }
    }

    public void subtract(double value) {
        try {
            lock.lock();
            this.result -= value;
        } finally {
            lock.unlock();
        }
    }

    public void calculate(Calculation ... calculations) {
        try {
            lock.lock();

            for(Calculation calculation : calculations) {
                switch(calculation.type) {
                    case Calculation.ADDITION   : add     (calculation.value); break;
                    case Calculation.SUBTRACTION: subtract(calculation.value); break;
                }
            }
        } finally {
            lock.unlock();
        }
    }
}
```
注意 `calculate()` 方法在执行任何计算之前锁定了Calculator实例的Lock，并且还调用了 `add()` 和 `subtract()` 方法，这些方法也锁定了锁。因为 `ReentrantLock` 是可重入的，所以这不会引起任何问题。

## 锁的公平性
不公平的锁不保证等待锁定锁的线程将获得访问锁的顺序。这意味着，一个等待的线程可能会永远等待，如果其他线程不断尝试锁定锁，并且被优先于等待线程。这种情况可能导致饥饿。我在Starvation and Fairness教程中更详细地介绍了饥饿和公平性。

`ReentrantLock` 的行为默认是不公平的。然而，你可以通过其构造函数告诉它以公平模式操作。`ReentrantLock` 类有一个构造函数，它接受一个 `boolean` 参数，指定 `ReentrantLock` 是否应该为等待锁定的线程提供公平性。
以下是使用公平模式创建 `ReentrantLock` 实例的示例：
```java
ReentrantLock lock = new ReentrantLock(true);
```
请注意，没有参数的 `tryLock()` 方法（稍后在本Java Lock教程中介绍）不尊重 `ReentrantLock` 的公平模式。要获得公平性，你必须使用 `tryLock(long timeout, TimeUnit unit)` 方法，像这样：
```java
lock.tryLock(0, TimeUnit.SECONDS);
```
## Lock和ReentrantLock方法
Java Lock接口包含以下主要方法：
- lock()
- lockInterruptibly()
- tryLock()
- tryLock(long timeout, TimeUnit timeUnit)
- unlock()

Java ReentrantLock还有一些有趣的公共方法：
- getHoldCount()
- getQueueLength()
- hasQueuedThread(Thread)
- hasQueuedThreads()
- isFair()
- isHeldByCurrentThread()
- isLocked()

我将在以下部分中更详细地介绍这些方法。

### lock()
`lock()` 方法如果可能的话锁定 `Lock` 实例。如果 `Lock` 实例已经被锁定，调用 `lock()` 的线程将被阻塞，直到 `Lock` 被解锁。

### lockInterruptibly()
`lockInterruptibly()` 方法锁定 `Lock`，除非调用该方法的线程已经被中断。此外，如果一个线程通过此方法阻塞等待锁定 `Lock`，并且它被中断，它将退出这个方法调用。

### tryLock()
`tryLock()` 方法立即尝试锁定 `Lock` 实例。如果锁定成功，它返回 `true`；如果 `Lock` 已经被锁定，返回 `false`。这个方法从不阻塞。

### tryLock(long timeout, TimeUnit timeUnit)
`tryLock(long timeout, TimeUnit timeUnit)` 方法的工作方式与 `tryLock()` 方法相同，除了它在放弃尝试锁定 `Lock` 之前等待给定的超时时间。

### unlock()
`unlock()` 方法解锁 `Lock` 实例。通常，`Lock` 实现只允许锁定了 `Lock` 的线程调用这个方法。其他线程调用这个方法可能会导致未经检查的异常（`RuntimeException`）。

### getHoldCount()
Java ReentrantLock `getHoldCount()` 方法返回给定线程锁定此Lock实例的次数。由于Lock的可重入性，线程可以多次锁定Lock。

### getQueueLength()
ReentrantLock `getQueueLength()` 方法返回等待锁定Lock的线程数量。

### hasQueuedThread()
ReentrantLock `hasQueuedThread(Thread thread)` 方法接受一个Thread作为参数，并返回 `true` 如果那个Thread正在排队等待锁定Lock，如果没有则返回 `false`。

### hasQueuedThreads()
ReentrantLock `hasQueuedThreads()` 方法返回 `true` 如果有任何线程正在排队等待锁定此Lock，如果没有则返回 `false`。

### isFair()
ReentrantLock `isFair()` 方法返回 `true` 如果此Lock保证等待锁定它的线程之间的公平性，如果没有则返回 `false`。有关Lock公平性的更多信息，请参阅Lock Fairness。

### isHeldByCurrentThread()
ReentrantLock `isHeldByCurrentThread()` 方法返回 `true` 如果Lock被调用 `isHeldByCurrentThread()` 的线程持有（锁定），如果没有则返回 `false`。

### isLocked()
ReentrantLock `isLocked()` 方法返回 `true` 如果Lock当前被锁定，如果没有则返回 `false`。



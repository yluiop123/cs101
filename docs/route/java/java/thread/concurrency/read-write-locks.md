# Java中的读写锁

读写锁是一种比Java中展示的`Lock`实现更为复杂的锁。设想你有一个应用程序，它读取和写入一些资源，但写入操作并不像读取操作那样频繁。两个线程同时读取同一个资源不会引起问题，因此可以同时允许多个线程重叠地访问资源。但是，如果有单个线程想要写入资源，那么在写入时不能有其他线程正在读取或写入。为了解决允许多个读取者但只有一个写入者的问题，你需要一个读写锁。

Java 5在`java.util.concurrent`包中提供了读写锁的实现。即便如此，了解它们背后的理论可能仍然很有用。

## Java中读写锁的实现

首先，让我们总结一下获取资源的读取和写入访问的条件：

| 访问类型 | 条件 |
| --- | --- |
| **读取访问** | 如果没有线程正在写入，且没有线程请求写入访问。 |
| **写入访问** | 如果没有线程正在读取或写入。 |

如果一个线程想要读取资源，只要没有线程正在写入它，且没有线程请求写入访问即可。通过提升写入访问请求的优先级，我们假设写入请求比读取请求更重要。此外，如果读取是最常发生的操作，而我们没有提升写入的优先级，那么可能会发生饥饿。请求写入访问的线程将被阻塞，直到所有读取者解锁了`ReadWriteLock`。如果新线程不断被允许读取访问，那么等待写入访问的线程将无限期地保持阻塞状态，导致饥饿。因此，只有在没有线程当前锁定了`ReadWriteLock`用于写入，或者请求它锁定用于写入时，才能授予线程读取访问。

一个想要写入访问资源的线程可以在没有线程正在读取或写入资源时获得访问。有多少线程请求写入访问或者请求的顺序是什么并不重要，除非你想保证请求写入访问的线程之间的公平性。

记住这些简单规则，我们可以按照以下方式实现一个`ReadWriteLock`：

```java
public class ReadWriteLock {
  private int readers       = 0;
  private int writers       = 0;
  private int writeRequests = 0;

  public synchronized void lockRead() throws InterruptedException {
    while(writers > 0 || writeRequests > 0) {
      wait();
    }
    readers++;
  }

  public synchronized void unlockRead() {
    readers--;
    notifyAll();
  }

  public synchronized void lockWrite() throws InterruptedException {
    writeRequests++;
    while(readers > 0 || writers > 0) {
      wait();
    }
    writeRequests--;
    writers++;
  }

  public synchronized void unlockWrite() throws InterruptedException {
    writers--;
    notifyAll();
  }
}
```

`ReadWriteLock`有两个锁定方法和两个解锁方法。一个用于读取访问的锁定和解锁方法，另一个用于写入访问。

读取访问的规则在`lockRead()`方法中实现。除非有线程拥有写入访问，或者一个或多个线程请求了写入访问，否则所有线程都可以获得读取访问。

写入访问的规则在`lockWrite()`方法中实现。想要写入访问的线程首先请求写入访问（`writeRequests++`）。然后它将检查是否真的可以获得写入访问。如果没有任何线程正在读取资源，也没有线程拥有写入访问，线程就可以获得写入访问。请求写入访问的线程数量并不重要。

值得注意的是，`unlockRead()`和`unlockWrite()`都调用了`notifyAll()`而不是`notify()`。为了解释为什么会这样，想象以下情况：

在ReadWriteLock内部，有等待读取访问的线程和等待写入访问的线程。

如果由`notify()`唤醒的是一个读取访问线程，它将因为还有线程在等待写入访问而被放回等待状态。然而，等待写入访问的线程并没有被唤醒，所以什么也没有发生。没有线程获得读取或写入访问。通过调用`notifyAll()`，所有等待的线程都被唤醒并检查是否可以获得所需的访问。

调用`notifyAll()`还有另一个优势。如果有多个线程正在等待读取访问，而没有线程等待写入访问，并且调用了`unlockWrite()`，所有等待读取访问的线程将一次性获得读取访问，而不是一个接一个。

## 读写锁的可重入性

前面展示的`ReadWriteLock`类不是可重入的。
如果一个拥有写入访问权限的线程再次请求它，它将被阻塞，因为已经有一个写入者——它自己。此外，考虑这种情况：

1. 线程1获得读取访问。
2. 线程2请求写入访问，但因为有一个读取者而被阻塞。
3. 线程1重新请求读取访问（重新进入锁），但因为有写入请求而被阻塞。

在这种情况下，之前的`ReadWriteLock`将锁定——类似于死锁的情况。没有请求读取或写入访问的线程将被授权。

为了使`ReadWriteLock`可重入，需要做一些改变。将分别处理读者和写入者的可重入性。

## 读取可重入性

要使`ReadWriteLock`对读者可重入，我们首先建立读取可重入的规则：

- 如果一个线程可以获得读取访问（没有写入者或写入请求），或者如果它已经有读取访问（不管写入请求）。

为了确定一个线程是否已经有读取访问，将使用一个Map来保留每个获得读取访问的线程的引用以及它获取读取锁的次数。

当确定是否可以授予读取访问时，将检查这个Map是否有对调用线程的引用。以下是`lockRead()`和`unlockRead()`方法在更改后的样子：

```java
public class ReadWriteLock {
  private Map<Thread, Integer> readingThreads =
      new HashMap<Thread, Integer>();

  private int writers        = 0;
  private int writeRequests  = 0;

  public synchronized void lockRead() throws InterruptedException {
    Thread callingThread = Thread.currentThread();
    while(! canGrantReadAccess(callingThread)){
      wait();
    }

    readingThreads.put(callingThread,
       (getAccessCount(callingThread) + 1));
  }

  public synchronized void unlockRead(){
    Thread callingThread = Thread.currentThread();
    int accessCount = getAccessCount(callingThread);
    if(accessCount == 1){ readingThreads.remove(callingThread); }
    else { readingThreads.put(callingThread, (accessCount -1)); }
    notifyAll();
  }

  private boolean canGrantReadAccess(Thread callingThread){
    if(writers > 0)            return false;
    if(isReader(callingThread)) return true;
    if(writeRequests > 0)      return false;
    return true;
  }

  private int getReadAccessCount(Thread callingThread){
    Integer accessCount = readingThreads.get(callingThread);
    if(accessCount == null) return 0;
    return accessCount.intValue();
  }

  private boolean isReader(Thread callingThread){
    return readingThreads.get(callingThread) != null;
  }
}
```

如你所见，只有在没有线程当前正在写入资源时，才允许读取可重入性。此外，如果调用线程已经拥有读取访问权限，这将优先于任何写入请求。

## 写入可重入性

写入可重入性仅在线程已经拥有写入访问权限时才被允许。以下是`lockWrite()`和`unlockWrite()`方法在更改后的样子：

```java
public class ReadWriteLock {
    private Map<Thread, Integer> readingThreads =
        new HashMap<Thread, Integer>();

    private int writeAccesses    = 0;
    private int writeRequests    = 0;
    private Thread writingThread = null;

  public synchronized void lockWrite() throws InterruptedException{
    writeRequests++;
    Thread callingThread = Thread.currentThread();
    while(! canGrantWriteAccess(callingThread)){
      wait();
    }
    writeRequests--;
    writeAccesses++;
    writingThread = callingThread;
  }

  public synchronized void unlockWrite() throws InterruptedException{
    writeAccesses--;
    if(writeAccesses == 0){
      writingThread = null;
    }
    notifyAll();
  }

  private boolean canGrantWriteAccess(Thread callingThread){
    if(hasReaders())             return false;
    if(writingThread == null)    return true;
    if(!isWriter(callingThread)) return false;
    return true;
  }

  private boolean hasReaders(){
    return readingThreads.size() > 0;
  }

  private boolean isWriter(Thread callingThread){
    return writingThread == callingThread;
  }
}
```

注意，当前持有写入锁的线程现在在确定调用线程是否可以获得写入访问时被考虑在内。

## 从读取到写入的可重入性

有时，拥有读取访问权限的线程也需要获得写入访问权限。为了允许这样做，该线程必须是唯一的读取者。为了实现这一点，应该稍微更改`writeLock()`方法。以下是它的样子：

```java
public class ReadWriteLock {
    private Map<Thread, Integer> readingThreads =
        new HashMap<Thread, Integer>();

    private int writeAccesses    = 0;
    private int writeRequests    = 0;
    private Thread writingThread = null;

  public synchronized void lockWrite() throws InterruptedException{
    writeRequests++;
    Thread callingThread = Thread.currentThread();
    while(! canGrantWriteAccess(callingThread)){
      wait();
   }
    writeRequests--;
    writeAccesses++;
    writingThread = callingThread;
  }

  public synchronized void unlockWrite() throws InterruptedException{
    writeAccesses--;
    if(writeAccesses == 0){
      writingThread = null;
    }
    notifyAll();
  }

  private boolean canGrantWriteAccess(Thread callingThread){
    if(isOnlyReader(callingThread))    return true;
    if(hasReaders())                   return false;
    if(writingThread == null)          return true;
    if(!isWriter(callingThread))       return false;
    return true;
  }

  private boolean hasReaders(){
    return readingThreads.size() > 0;
  }

  private boolean isWriter(Thread callingThread){
    return writingThread == callingThread;
  }

  private boolean isOnlyReader(Thread thread){
      return readingThreads.size() == 1 &&
             readingThreads.get(callingThread) != null;
  }
}
```

现在`ReadWriteLock`类支持从读取到写入的访问可重入性。

## 从写入到读取的可重入性

有时，拥有写入访问权限的线程也需要读取访问权限。如果请求，写入者应该总是被授予读取访问权限。如果一个线程拥有写入访问权限，那么没有其他线程可以拥有读取或写入访问权限，所以这并不危险。以下是`canGrantReadAccess()`方法在更改后的样子：

```java
public class ReadWriteLock {
    private boolean canGrantReadAccess(Thread callingThread){
      if(isWriter(callingThread)) return true;
      if(writingThread != null)   return false;
      if(isReader(callingThread))  return true;
      if(writeRequests > 0)       return false;
      return true;
    }
}
```

## 完全可重入的ReadWriteLock

以下是完全可重入的`ReadWriteLock`实现。我对访问条件进行了一些重构，使它们更易于阅读，从而使你更容易确信它们是正确的。

```java
public class ReadWriteLock {
  private Map<Thread, Integer> readingThreads =
       new HashMap<Thread, Integer>();

   private int writeAccesses    = 0;
   private int writeRequests    = 0;
   private Thread writingThread = null;

  public synchronized void lockRead() throws InterruptedException{
    Thread callingThread = Thread.currentThread();
    while(! canGrantReadAccess(callingThread)){
      wait();
    }

    readingThreads.put(callingThread,
     (getReadAccessCount(callingThread) + 1));
  }

  private boolean canGrantReadAccess(Thread callingThread){
    if( isWriter(callingThread) ) return true;
    if( hasWriter()             ) return false;
    if( isReader(callingThread) ) return true;
    if( hasWriteRequests()      ) return false;
    return true;
  }

  public synchronized void unlockRead(){
    Thread callingThread = Thread.currentThread();
    if(!isReader(callingThread)){
      throw new IllegalMonitorStateException("Calling Thread does not" +
        " hold a read lock on this ReadWriteLock");
    }
    int accessCount = getReadAccessCount(callingThread);
    if(accessCount == 1){ readingThreads.remove(callingThread); }
    else { readingThreads.put(callingThread, (accessCount -1)); }
    notifyAll();
  }

  public synchronized void lockWrite() throws InterruptedException{
    writeRequests++;
    Thread callingThread = Thread.currentThread();
    while(! canGrantWriteAccess(callingThread)){
      wait();
    }
    writeRequests--;
    writeAccesses++;
    writingThread = callingThread;
  }

  public synchronized void unlockWrite() throws InterruptedException{
    if(!isWriter(Thread.currentThread())){
      throw new IllegalMonitorStateException("Calling Thread does not" +
        " hold the write lock on this ReadWriteLock");
    }
    writeAccesses--;
    if(writeAccesses == 0){
      writingThread = null;
    }
    notifyAll();
  }

  private boolean canGrantWriteAccess(Thread callingThread){
    if(isOnlyReader(callingThread))    return true;
    if(hasReaders())                   return false;
    if(writingThread == null)          return true;
    if(!isWriter(callingThread))       return false;
    return true;
  }

  private int getReadAccessCount(Thread callingThread){
    Integer accessCount = readingThreads.get(callingThread);
    if(accessCount == null) return 0;
    return accessCount.intValue();
  }

  private boolean hasReaders(){
    return readingThreads.size() > 0;
  }

  private boolean isReader(Thread callingThread){
    return readingThreads.get(callingThread) != null;
  }

  private boolean isOnlyReader(Thread callingThread){
    return readingThreads.size() == 1 &&
           readingThreads.get(callingThread) != null;
  }

  private boolean hasWriter(){
    return writingThread != null;
  }

  private boolean isWriter(Thread callingThread){
    return writingThread == callingThread;
  }

  private boolean hasWriteRequests(){
      return this.writeRequests > 0;
  }
}
```

## 从finally子句中调用unlock()

当使用`ReadWriteLock`保护一个关键部分，而这个关键部分可能会抛出异常时，重要的是在`finally`子句中调用`readUnlock()`和`writeUnlock()`方法。这样做确保了`ReadWriteLock`被解锁，以便其他线程可以锁定它。以下是一个示例：

```java
lock.lockWrite();
try{
  //do critical section code, which may throw exception
} finally {
  lock.unlockWrite();
}
```

这个小小的结构确保了如果关键部分的代码抛出异常，`ReadWriteLock`将被解锁。如果`unlockWrite()`没有在`finally`子句中调用，并且关键部分抛出了异常，`ReadWriteLock`将永远保持写入锁定状态，导致所有调用该`ReadWriteLock`实例上的`lockRead()`或`lockWrite()`的线程无限期地停止。唯一能再次解锁`ReadWriteLock`的方法是如果`ReadWriteLock`是可重入的，并且当异常抛出时锁定它的线程后来成功地锁定它，执行关键部分，然后再次调用`unlockWrite()`。这将再次解锁`ReadWriteLock`。但是，如果它发生，为什么要等待呢？从`finally`子句中调用`unlockWrite()`是一个更加稳健的解决方案。



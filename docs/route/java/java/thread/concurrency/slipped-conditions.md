# 什么是条件滑动？

条件滑动指的是，从线程检查某个条件到根据该条件采取行动的这段时间内，另一个线程已经改变了该条件，使得第一个线程根据该条件采取行动变得错误。以下是一个简单的例子：

```java
public class Lock {
    private boolean isLocked = true;

    public void lock(){
      synchronized(this){
        while(isLocked){
          try{
            this.wait();
          } catch(InterruptedException e){
            //什么也不做，继续等待
          }
        }
      }

      synchronized(this){
        isLocked = true;
      }
    }

    public synchronized void unlock(){
      isLocked = false;
      this.notify();
    }
}
```

注意`lock()`方法包含两个同步块。第一个块等待`isLocked`变为false。第二个块将`isLocked`设置为true，以锁定`Lock`实例，防止其他线程进入。

设想`isLocked`为false，并且有两个线程同时调用`lock()`。如果第一个进入第一个同步块的线程在第一个同步块之后被抢占，该线程将检查了`isLocked`并记录它为false。如果现在允许第二个线程执行，并进入第一个同步块，这个线程也将看到`isLocked`为false。现在两个线程都读取了条件为false。然后两个线程都将进入第二个同步块，将`isLocked`设置为true，并继续。

这种情况就是条件滑动的一个例子。两个线程测试条件，然后退出同步块，允许其他线程测试条件，然后两个线程中的任何一个改变条件供后续线程使用。换句话说，从条件被检查到线程改变条件供后续线程使用的时间，条件已经滑动了。

为了避免条件滑动，测试和设置条件必须由执行它的线程原子性地完成，这意味着在第一个线程测试和设置条件之间，任何其他线程都不能检查条件。

上面例子中的解决方案很简单。只需将`isLocked = true;`这行代码向上移动到第一个同步块中，在while循环之后。它看起来像这样：

```java
public class Lock {
    private boolean isLocked = true;

    public void lock(){
      synchronized(this){
        while(isLocked){
          try{
            this.wait();
          } catch(InterruptedException e){
            //什么也不做，继续等待
          }
        }
        isLocked = true;
      }
    }

    public synchronized void unlock(){
      isLocked = false;
      this.notify();
    }
}
```

现在`isLocked`条件的测试和设置是在同一个同步块内原子性地完成的。

## 更现实的例子

您可能会正确地争辩说，您永远不会实现像本文中展示的第一个Lock实现那样的东西，因此声称条件滑动是一个相当理论化的问题。但是，第一个例子保持相当简单，以便更好地传达条件滑动的概念。

一个更现实的例子是在实现公平锁时，如在“饥饿与公平性”文本中讨论的。如果我们查看“嵌套监视器锁定”文本中的简单实现，并尝试消除嵌套监视器锁定问题，很容易就会得到一个受条件滑动影响的实现。首先，我将展示嵌套监视器锁定文本中的例子：

```java
//带有嵌套监视器锁定问题的公平锁实现

public class FairLock {
    private boolean isLocked = false;
    private Thread lockingThread = null;
    private List<QueueObject> waitingThreads = new ArrayList<>();

    public void lock() throws InterruptedException{
        QueueObject queueObject = new QueueObject();

        synchronized(this){
            waitingThreads.add(queueObject);

            while(isLocked || waitingThreads.get(0) != queueObject){

                synchronized(queueObject){
                    try{
                        queueObject.wait();
                    }catch(InterruptedException e){
                        waitingThreads.remove(queueObject);
                        throw e;
                    }
                }
            }
            waitingThreads.remove(queueObject);
            isLocked = true;
            lockingThread = Thread.currentThread();
        }
    }

    public synchronized void unlock(){
        if(this.lockingThread != Thread.currentThread()){
            throw new IllegalMonitorStateException(
              "调用线程没有锁定此锁");
        }
        isLocked = false;
        lockingThread = null;
        if(waitingThreads.size() > 0){
            QueueObject queueObject = waitingThread.get(0);
            synchronized(queueObject){
                queueObject.notify();
            }
        }
    }
}

public class QueueObject {}
```

注意`synchronized(queueObject)`及其`queueObject.wait()`调用是如何嵌套在`synchronized(this)`块内，导致嵌套监视器锁定问题。为了避免这个问题，必须将`synchronized(queueObject)`块移到`synchronized(this)`块外面。以下就是这样的一个例子：

```java
//带有条件滑动问题的公平锁实现

public class FairLock {
    private boolean isLocked = false;
    private Thread lockingThread = null;
    private List<QueueObject> waitingThreads = new ArrayList<>();

    public void lock() throws InterruptedException{
        QueueObject queueObject = new QueueObject();

        synchronized(this){
            waitingThreads.add(queueObject);
        }

        boolean mustWait = true;
        while(mustWait){

            synchronized(this){
                mustWait = isLocked || waitingThreads.get(0) != queueObject;
            }

            synchronized(queueObject){
                if(mustWait){
                    try{
                        queueObject.wait();
                    }catch(InterruptedException e){
                        waitingThreads.remove(queueObject);
                        throw e;
                    }
                }
            }
        }

        synchronized(this){
            waitingThreads.remove(queueObject);
            isLocked = true;
            lockingThread = Thread.currentThread();
        }
    }
}
```

注意：仅显示了`lock()`方法，因为这是我唯一更改过的方法。

注意`lock()`方法现在包含3个同步块。

第一个`synchronized(this)`块通过设置`mustWait = isLocked || waitingThreads.get(0) != queueObject`来检查条件。

第二个`synchronized(queueObject)`块检查线程是否需要等待。此时，可能已经有另一个线程解锁了锁，但让我们暂时忽略这一点。假设锁已经被解锁，所以线程立即退出了`synchronized(queueObject)`块。

第三个`synchronized(this)`块仅在`mustWait = false`时执行。这将条件`isLocked`重新设置为`true`等等，并退出`lock()`方法。

设想以下场景：两个线程A和B，同时调用`lock()`。首先线程A进展到第二个同步块之后。然后线程B进展到第二个同步块之后。线程A现在将其`mustWait`变量设置为`true`，但线程B将其`mustWait`变量设置为`false`。现在，设想线程A完成整个`lock()`方法，并在线程B进一步进展之前再次解锁锁。现在锁实际上已经解锁了，但线程B不知道，所以线程B进入等待状态——等待锁被解锁。由于这种情况永远不会发生，线程B现在将永久等待。等待的条件从线程B检测到条件的时间滑动到线程B根据条件采取行动的时间。

### 消除条件滑动问题

要从上述示例中消除条件滑动问题，必须将最后一个`synchronized(this)`块的内容向上移动到第一个块中。代码自然也需要进行一些调整以适应这一移动。它看起来像这样：

```java
//没有嵌套监视器锁定问题，但有错过信号问题的公平锁实现

public class FairLock {
    private boolean isLocked = false;
    private Thread lockingThread = null;
    private List<QueueObject> waitingThreads = new ArrayList<>();

    public void lock() throws InterruptedException{
        QueueObject queueObject = new QueueObject();

        synchronized(this){
            waitingThreads.add(queueObject);
            boolean mustWait = isLocked || waitingThreads.get(0) != queueObject;
            if(!mustWait){
                waitingThreads.remove(queueObject);
                isLocked = true;
                lockingThread = Thread.currentThread();
                return;
            }
        }

        synchronized(queueObject){
            if(mustWait){
                try{
                    queueObject.wait();
                }catch(InterruptedException e){
                    waitingThreads.remove(queueObject);
                    throw e;
                }
            }
        }
    }
}
```

注意`mustWait`局部变量现在在同一个同步代码块内进行测试和设置。还要注意，即使`mustWait`局部变量也在`synchronized(this)`代码块外部进行检查，在`while(mustWait)`子句中，`mustWait`变量的值也不会在`synchronized(this)`外部改变。评估`mustWait`为false的线程也将原子性地设置内部条件（`isLocked`），以便任何其他检查条件的线程都会将其评估为true。

`synchronized(this)`块中的`return;`语句并不是必须的。这只是一个优化。如果线程不需要等待（`mustWait == false`），那么没有必要进入`synchronized(queueObject)`块并执行`if(mustWait)`子句。

细心的读者会注意到上述公平锁的实现仍然存在错过信号的问题。想象一下，当一个线程调用`lock()`时，FairLock实例被锁定。在第一个`synchronized(this)`块之后`mustWait`为true。然后想象一下，调用`lock()`的线程被抢占，锁定锁的线程调用解锁。如果您查看前面显示的`unlock()`实现，您会注意到它调用了`queueObject.notify()`。但是，由于在`lock()`中等待的线程还没有调用`queueObject.wait()`，对`queueObject.notify()`的调用就消失了。信号被错过了。当调用`lock()`的线程紧接着调用`queueObject.wait()`时，它将一直被阻塞，直到其他线程调用`unlock()`，这种情况可能永远不会发生。

错过信号问题是“饥饿与公平性”文本中展示的`FairLock`实现将`QueueObject`类变成带有`doWait()`和`doNotify()`两个方法的信号量的的原因。这些方法在`QueueObject`内部存储和响应信号。这样即使`doNotify()`在`doWait()`之前被调用，信号也不会丢失。



# 线程死锁

死锁发生在两个或多个线程被阻塞，等待获取其他线程持有的锁时。当多个线程同时需要相同的锁，但以不同的顺序获取它们时，可能会发生死锁。

## 死锁示例

下面是一个死锁情况的示例：

如果线程1锁定了A并尝试锁定B，而线程2已经锁定了B并尝试锁定A，就会发生死锁。线程1永远无法获取B，线程2也永远无法获取A。此外，它们永远不会知道。它们将永远被阻塞在各自的对象A和B上。这种情况就是死锁。

这种情况如下所示：
```
Thread 1 锁定 A，等待 B
Thread 2 锁定 B，等待 A
```

以下是一个TreeNode类的示例，该类在不同实例中调用同步方法：
```java
public class TreeNode {
    TreeNode parent = null;
    List children = new ArrayList();

    public synchronized void addChild(TreeNode child){
        if(!this.children.contains(child)) {
            this.children.add(child);
            child.setParentOnly(this);
        }
    }

    public synchronized void addChildOnly(TreeNode child){
        if(!this.children.contains(child)){
            this.children.add(child);
        }
    }

    public synchronized void setParent(TreeNode parent){
        this.parent = parent;
        parent.addChildOnly(this);
    }

    public synchronized void setParentOnly(TreeNode parent){
        this.parent = parent;
    }
}
```

如果一个线程(1)同时调用parent.addChild(child)方法，而另一个线程(2)同时调用child.setParent(parent)方法，并且是在同一对父和子实例上，就可能发生死锁。以下是一些伪代码，说明了这一点：
```
Thread 1: parent.addChild(child); //锁定父对象
          --\u003e child.setParentOnly(parent);

Thread 2: child.setParent(parent); //锁定子对象
          --\u003e parent.addChildOnly()
```

首先，线程1调用parent.addChild(child)。由于addChild()是同步的，线程1实际上锁定了父对象，防止其他线程访问。

然后，线程2调用child.setParent(parent)。由于setParent()是同步的，线程2实际上锁定了子对象，防止其他线程访问。

现在，子和父对象都被两个不同的线程锁定了。接下来，线程1尝试调用child.setParentOnly()方法，但子对象被线程2锁定了，所以该方法调用只是被阻塞。线程2也尝试调用parent.addChildOnly()，但父对象被线程1锁定了，导致线程2在该方法调用上被阻塞。现在，两个线程都被阻塞，等待获取对方持有的锁。

注意：两个线程必须按照上述描述同时调用parent.addChild(child)和child.setParent(parent)，并且是在同一对父和子实例上，才会发生死锁。上述代码可能长时间执行良好，直到突然发生死锁。

线程确实需要同时获取锁*。

例如，如果线程1领先于线程2一点，因此锁定了A和B，那么线程2在尝试锁定B时已经被阻塞了。那么就不会发生死锁。由于线程调度通常是不可预测的，没有办法预测*何时*会发生死锁。只能知道它*可能*发生。

## 更复杂的死锁

死锁还可以包括两个以上的线程。这使得它更难以检测。下面是一个例子，其中四个线程发生了死锁：
```
Thread 1 锁定 A，等待 B
Thread 2 锁定 B，等待 C
Thread 3 锁定 C，等待 D
Thread 4 锁定 D，等待 A
```

线程1等待线程2，线程2等待线程3，线程3等待线程4，线程4等待线程1。

## 数据库死锁

死锁可能发生的一个更复杂的情况是数据库事务。数据库事务可能包括许多SQL更新请求。当事务期间更新记录时，该记录会被锁定，防止其他事务更新，直到第一个事务完成。因此，同一事务中的每个更新请求可能都会锁定数据库中的一些记录。

如果多个事务同时运行并且需要更新相同的记录，就有陷入死锁的风险。

例如：
```
Transaction 1, request 1, 锁定记录 1 进行更新
Transaction 2, request 1, 锁定记录 2 进行更新
Transaction 1, request 2, 尝试锁定记录 2 进行更新。
Transaction 2, request 2, 尝试锁定记录 1 进行更新。
```

由于锁是在不同的请求中获取的，并且一个给定事务所需的所有锁事先并不都是已知的，因此在数据库事务中检测或预防死锁是困难的。


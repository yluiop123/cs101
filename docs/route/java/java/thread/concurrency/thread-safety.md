# 线程安全与共享资源

被多个线程同时调用且安全的代码称为_线程安全_。
如果一段代码是线程安全的，那么它不包含竞态条件。
竞态条件只发生在多个线程更新共享资源时。
因此，了解Java线程在执行时共享哪些资源非常重要。

## 局部变量
局部变量存储在每个线程自己的栈中。这意味着局部变量永远不会在线程之间共享。这也意味着所有的局部原始变量都是线程安全的。以下是一个线程安全的局部原始变量的示例：

```java
public void someMethod(){
    long threadSafeInt = 0;
    threadSafeInt++;
}
```

## 局部对象引用
局部对象引用有些不同。
引用本身不是共享的。然而，引用的对象不是存储在每个线程的本地栈中。所有的对象都存储在共享的堆中。

如果一个在局部创建的对象从未逃离它被创建的方法，它是线程安全的。实际上，只要没有这些方法或对象使传递的对象对其他线程可用，你也可以将其传递给其他方法和对象。

以下是一个线程安全的局部对象的示例：

```java
public void someMethod(){
    LocalObject localObject = new LocalObject();
    localObject.callMethod();
    method2(localObject);
}

public void method2(LocalObject localObject){
    localObject.setValue("value");
}
```

在这个示例中，`LocalObject`实例没有从方法返回，也没有传递给任何可以从`someMethod()`方法外部访问的其他对象。每个执行`someMethod()`方法的线程将创建自己的`LocalObject`实例并将其分配给`localObject`引用。因此，这里`LocalObject`的使用是线程安全的。

实际上，整个`someMethod()`方法是线程安全的。即使`LocalObject`实例作为参数传递给同一类中的其他方法或其他类中的方法，它的使用也是线程安全的。

唯一的例外是，如果使用`LocalObject`作为参数调用的方法以允许从其他线程访问的方式存储`LocalObject`实例。

## 对象成员变量
对象成员变量（字段）与对象一起存储在堆上。因此，如果两个线程调用同一个对象实例上的方法，而这个方法更新对象成员变量，那么这个方法就不是线程安全的。以下是一个不是线程安全的方法的示例：

```java
public class NotThreadSafe{
    StringBuilder builder = new StringBuilder();
    public add(String text){
        this.builder.append(text);
    }
}
```

如果两个线程同时对同一个`NotThreadSafe`实例调用`add()`方法，那么它会导致竞态条件。例如：

```java
NotThreadSafe sharedInstance = new NotThreadSafe();

new Thread(new MyRunnable(sharedInstance)).start();
new Thread(new MyRunnable(sharedInstance)).start();
```

注意两个`MyRunnable`实例共享同一个`NotThreadSafe`实例。因此，当它们对`NotThreadSafe`实例调用`add()`方法时，会导致竞态条件。

然而，如果两个线程同时对不同实例调用`add()`方法，那么它不会导致竞态条件。以下是稍作修改之前的示例：

```java
new Thread(new MyRunnable(new NotThreadSafe())).start();
new Thread(new MyRunnable(new NotThreadSafe())).start();
```

现在两个线程各自有自己的`NotThreadSafe`实例，所以它们对添加方法的调用不会互相干扰。代码不再有竞态条件。所以，即使一个对象不是线程安全的，它仍然可以以不导致竞态条件的方式使用。

## 线程控制逃逸规则
当你试图确定你的代码对某个资源的访问是否是线程安全的，你可以使用线程控制逃逸规则：

```
如果一个资源在同一个线程的控制下被创建、使用并释放，
并且从未逃离这个线程的控制，
那么对该资源的使用是线程安全的。
```

资源可以是任何共享资源，如对象、数组、文件、数据库连接、套接字等。
在Java中，你并不总是显式地释放对象，所以“释放”意味着失去或将对象引用置为null。

即使一个对象的使用是线程安全的，如果该对象指向一个共享资源，如文件或数据库，你的应用程序整体可能不是线程安全的。例如，如果线程1和线程2各自创建自己的数据库连接，连接1和连接2，每个连接本身的使用是线程安全的。但是，连接指向的数据库的使用可能不是线程安全的。例如，如果两个线程执行如下代码：

```
检查记录X是否存在
如果不存在，插入记录X
```

如果两个线程同时执行，并且它们检查的记录X恰好是同一条记录，那么有可能两个线程最终都插入了它。这是这样的：

```
线程1检查记录X是否存在。结果 = 否
线程2检查记录X是否存在。结果 = 否
线程1插入记录X
线程2插入记录X
```

这也可能发生在操作文件或其他共享资源的线程上。
因此，区分一个线程控制的对象**是**资源，还是它仅仅**引用**资源（如数据库连接那样）非常重要。



# Java ThreadLocal

Java的`ThreadLocal`类允许你创建只有创建它的线程才能读写的变量。即使两个线程执行相同的代码，并且代码引用了相同的`ThreadLocal`变量，这两个线程也无法看到彼此的`ThreadLocal`变量。因此，Java `ThreadLocal`类提供了一个简单的方法来使代码线程安全，否则可能不会是线程安全的。

## 创建ThreadLocal

你创建一个`ThreadLocal`实例就像创建任何其他Java对象一样——通过`new`操作符。以下是一个展示如何创建`ThreadLocal`变量的示例：

```java
private ThreadLocal threadLocal = new ThreadLocal();
```

每个线程只需要做一次。现在，多个线程可以在这个`ThreadLocal`中获取和设置值，每个线程只会看到它自己设置的值。

## 设置ThreadLocal值

一旦创建了`ThreadLocal`，你可以使用它的`set()`方法来设置要存储的值。

```java
threadLocal.set("一个线程局部变量的值");
```

## 获取ThreadLocal值

你使用`ThreadLocal`的`get()`方法来读取存储在其中的值。以下是一个获取Java `ThreadLocal`中存储值的示例：

```java
String threadLocalValue = (String) threadLocal.get();
```

## 移除ThreadLocal值

可以从ThreadLocal变量中移除设置的值。你可以通过调用`ThreadLocal`的`remove()`方法来移除值。以下是一个从Java `ThreadLocal`中移除设置值的示例：

```java
threadLocal.remove();
```

## 泛型ThreadLocal

你可以创建一个带有泛型类型的`ThreadLocal`。使用泛型类型，只有泛型类型的实例才能被设置为`ThreadLocal`的值。此外，你不需要对`get()`返回的值进行类型转换。以下是一个泛型`ThreadLocal`示例：

```java
private ThreadLocal<String> myThreadLocal = new ThreadLocal<String>();
```

现在，你只能在`ThreadLocal`实例中存储字符串。此外，你不需要对从`ThreadLocal`获取的值进行类型转换：

```java
myThreadLocal.set("Hello ThreadLocal");

String threadLocalValue = myThreadLocal.get();
```

## 初始ThreadLocal值

你可以为Java `ThreadLocal`设置初始值，当第一次调用`get()`时将使用这个值——在通过`set()`调用设置新值之前。你有两种方式为`ThreadLocal`指定初始值：

- 创建一个重写`initialValue()`方法的`ThreadLocal`子类。
- 使用`Supplier`接口实现创建`ThreadLocal`。

我将在以下部分展示这两种选项。

### 重写initialValue()

为Java `ThreadLocal`变量指定初始值的一种方式是创建一个`ThreadLocal`的子类，重写它的`initialValue()`方法。创建`ThreadLocal`的子类的最简单方式是在创建`ThreadLocal`变量的地方直接创建一个匿名子类。以下是一个重写`initialValue()`方法创建`ThreadLocal`匿名子类的示例：

```java
private ThreadLocal<String> myThreadLocal = new ThreadLocal<String>() {
    @Override protected String initialValue() {
        return String.valueOf(System.currentTimeMillis());
    }
};
```

注意，不同的线程仍然会看到不同的初始值。每个线程将创建它自己的初始值。只有当你从`initialValue()`方法返回完全相同的对象时，所有线程才会看到相同的对象。然而，使用`ThreadLocal`的首要原因是避免不同的线程看到相同的实例。

### 提供Supplier实现

为Java `ThreadLocal`变量指定初始值的第二种方法是使用它的静态工厂方法`withInitial(Supplier)`，将一个`Supplier`接口实现作为参数传递。这个`Supplier`实现为`ThreadLocal`提供初始值。以下是一个使用`withInitial()`静态工厂方法创建`ThreadLocal`的示例，将一个简单的`Supplier`实现作为参数传递：

```java
ThreadLocal<String> threadLocal = ThreadLocal.withInitial(new Supplier<String>() {
    @Override
    public String get() {
        return String.valueOf(System.currentTimeMillis());
    }
});
```

由于`Supplier`是一个函数式接口，它可以使用Java Lambda表达式来实现。以下是如何使用Lambda表达式向`withInitial()`提供一个`Supplier`实现的示例：

```java
ThreadLocal threadLocal = ThreadLocal.withInitial(
    () -> { return String.valueOf(System.currentTimeMillis()); }
);
```

如你所见，这比前面的示例稍短一些。但它甚至可以更简洁一些，使用Lambda表达式最紧凑的语法：

```java
ThreadLocal threadLocal3 = ThreadLocal.withInitial(
    () -> String.valueOf(System.currentTimeMillis())
);
```

## 延迟设置ThreadLocal值

在某些情况下，你不能使用标准的设置初始值的方式。例如，你可能需要一些配置信息，而这些信息在你创建ThreadLocal变量时还不可用。在这种情况下，你可以延迟设置初始值。以下是一个在Java ThreadLocal上延迟设置初始值的示例：

```java
public class MyDateFormatter {

    private ThreadLocal<SimpleDateFormat> simpleDateFormatThreadLocal = new ThreadLocal<>();

    public String format(Date date) {
        SimpleDateFormat simpleDateFormat = getThreadLocalSimpleDateFormat();
        return simpleDateFormat.format(date);
    }

    private SimpleDateFormat getThreadLocalSimpleDateFormat() {
        SimpleDateFormat simpleDateFormat = simpleDateFormatThreadLocal.get();
        if(simpleDateFormat == null) {
            simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            simpleDateFormatThreadLocal.set(simpleDateFormat);
        }
        return simpleDateFormat;
    }
}
```

注意`format()`方法如何调用`getThreadLocalSimpleDateFormat()`方法来获取一个Java SimpleDatFormat实例。如果在`ThreadLocal`中尚未设置`SimpleDateFormat`实例，则会创建一个新的`SimpleDateFormat`并设置在`ThreadLocal`变量中。一旦一个线程在`ThreadLocal`变量中设置了它自己的`SimpleDateFormat`，在该线程后续的调用中将使用同一个`SimpleDateFormat`对象。但仅限于该线程。每个线程都创建它自己的`SimpleDateFormat`实例，因为它们看不到彼此在`ThreadLocal`变量上设置的实例。

`SimpleDateFormat`类不是线程安全的，所以多个线程不能同时使用它。为了解决这个问题，上面的`MyDateFormatter`类为每个线程创建一个`SimpleDateFormat`，所以每个调用`format()`方法的线程将使用它自己的`SimpleDateFormat`实例。

## 在线程池或ExecutorService中使用ThreadLocal

如果你计划在Java线程池或Java ExecutorService中的任务内使用Java `ThreadLocal`，请记住你没有任何保证哪个线程将执行你的任务。然而，如果你只需要确保每个线程使用它自己的某些对象的实例，这不是问题。然后你可以在线程池或`ExecutorService`中很好地使用Java ThreadLocal。

## 完整的ThreadLocal示例

以下是一个完整的可运行Java `ThreadLocal`示例：

```java
public class ThreadLocalExample {

    public static void main(String[] args) {
        MyRunnable sharedRunnableInstance = new MyRunnable();

        Thread thread1 = new Thread(sharedRunnableInstance);
        Thread thread2 = new Thread(sharedRunnableInstance);

        thread1.start();
        thread2.start();

        thread1.join(); //等待线程1结束
        thread2.join(); //等待线程2结束
    }
}

public class MyRunnable implements Runnable {

    private ThreadLocal<Integer> threadLocal = new ThreadLocal<Integer>();

    @Override
    public void run() {
        threadLocal.set((int) (Math.random() * 100D));

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
        }

        System.out.println(threadLocal.get());
    }
}
```

这个示例创建了一个单一的`MyRunnable`实例，它被传递给两个不同的线程。两个线程执行`run()`方法，因此在`ThreadLocal`实例上设置了不同的值。如果对`set()`调用的访问被同步了，并且如果不是一个`ThreadLocal`对象，第二个线程将覆盖第一个线程设置的值。

然而，由于它是一个`ThreadLocal`对象，那么两个线程看不到彼此的值。
因此，它们设置并获取了不同的值。

## InheritableThreadLocal

`InheritableThreadLocal`类是`ThreadLocal`的子类。与每个线程在`ThreadLocal`中拥有自己的值不同，`InheritableThreadLocal`允许一个线程以及该线程创建的所有子线程访问值。以下是一个完整的Java `InheritableThreadLocal`示例：

```java
public class InheritableThreadLocalBasicExample {

    public static void main(String[] args) {

        ThreadLocal<String> threadLocal = new ThreadLocal<>();
        InheritableThreadLocal<String> inheritableThreadLocal = new InheritableThreadLocal<>();

        Thread thread1 = new Thread(() -> {
            System.out.println("===== 线程1 =====");
            threadLocal.set("线程1 - ThreadLocal");
            inheritableThreadLocal.set("线程1 - InheritableThreadLocal");

            System.out.println(threadLocal.get());
            System.out.println(inheritableThreadLocal.get());

            Thread childThread = new Thread(() -> {
                System.out.println("===== 子线程 =====");
                System.out.println(threadLocal.get());
                System.out.println(inheritableThreadLocal.get());
            });
            childThread.start();
        });

        thread1.start();

        Thread thread2 = new Thread(() -> {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("===== 线程2 =====");
            System.out.println(threadLocal.get());
            System.out.println(inheritableThreadLocal.get());
        });
        thread2.start();
    }
}
```

这个示例创建了一个普通的Java ThreadLocal和一个Java InheritableThreadLocal。然后示例创建了一个线程，该线程设置了ThreadLocal和InheritableThreadLocal的值，然后创建了一个子线程，该子线程访问了ThreadLocal和InheritableThreadLocal的值。只有InheritableThreadLocal的值对子线程是可见的。

最后，示例创建了第三个线程，它也尝试访问ThreadLocal和InheritableThreadLocal，但它没有看到第一个线程存储的任何值。

运行此示例的输出将如下所示：

```java
===== 线程1 =====
线程1 - ThreadLocal
线程1 - InheritableThreadLocal
===== 子线程 =====
null
线程1 - InheritableThreadLocal
===== 线程2 =====
null
null
```



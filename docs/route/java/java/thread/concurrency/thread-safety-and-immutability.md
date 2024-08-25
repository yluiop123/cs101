# 线程安全与不变性

只有当多个线程访问同一资源，并且其中一个或多个线程**写入**资源时，才会出现竞态条件。如果多个线程读取相同的资源，则不会出现竞态条件。

我们可以通过使共享对象不可变，从而确保线程之间永远不会更新这些对象，使它们成为线程安全的。以下是一个示例：

```java
public class ImmutableValue {
    private final int value = 0;

    public ImmutableValue(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
```

注意`ImmutableValue`实例的值是如何在构造函数中传递的。同时注意没有设置setter方法。一旦创建了`ImmutableValue`实例，你就不能更改它的值。它是不可变的。但是你可以使用`getValue()`方法读取它。

如果你需要对`ImmutableValue`实例执行操作，你可以通过返回一个包含操作结果值的新实例来实现。以下是一个加法操作的示例：

```java
public class ImmutableValue {
    private final int value;

    public ImmutableValue(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }

    public ImmutableValue add(int valueToAdd) {
        return new ImmutableValue(this.value + valueToAdd);
    }
}
```

注意`add()`方法返回一个新的`ImmutableValue`实例，该实例包含加法操作的结果，而不是将值添加到自身。

## 引用不是线程安全的！

重要的是要记住，即使对象是不可变的，从而是线程安全的，对这个对象的引用也可能不是线程安全的。看这个例子：

```java
public class Calculator {
    private ImmutableValue currentValue = null;

    public ImmutableValue getValue() {
        return currentValue;
    }

    public void setValue(ImmutableValue newValue) {
        this.currentValue = newValue;
    }

    public void add(int newValue) {
        this.currentValue = this.currentValue.add(newValue);
    }
}
```

`Calculator`类持有对`ImmutableValue`实例的引用。注意可以通过`setValue()`和`add()`方法更改该引用。因此，即使`Calculator`类在内部使用了一个不可变对象，它本身不是不可变的，因此不是线程安全的。换句话说：`ImmutableValue`类是线程安全的，但是它的**使用**不是。这是在尝试通过不变性实现线程安全时需要记住的。

要使`Calculator`类线程安全，你可以声明`getValue()`、`setValue()`和`add()`方法为`synchronized`。那样就能做到这一点。



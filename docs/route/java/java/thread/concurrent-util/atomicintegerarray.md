# AtomicIntegerArray

## 创建AtomicIntegerArray
 - 使用两个构造函数之一创建`AtomicIntegerArray`。
     - 第一个构造函数接受一个`int`作为参数，指定`AtomicIntegerArray`的长度（可容纳的元素数量）。例如：`AtomicIntegerArray array = new AtomicIntegerArray(10);`
     - 第二个构造函数接受一个`int[]`数组作为参数，创建的`AtomicIntegerArray`具有与该数组参数相同的容量，并将数组参数的所有元素复制到`AtomicIntegerArray`中。例如：
```java
int[] ints = new int[10];
ints[5] = 123;
AtomicIntegerArray array = new AtomicIntegerArray(ints);
```

## `get()`方法
 - 使用`AtomicIntegerArray`的`get()`方法获取给定元素的值。例如：`int value = array.get(5);`

## `set()`方法
 - 使用`set()`方法设置给定元素的值。例如：`array.set(5, 999);`

## `compareAndSet()`方法
 - `compareAndSet()`方法用于将给定元素的值与指定值进行比较，如果两个值相等，则为该元素设置新值。这是`AtomicIntegerArray`支持的原子比较和交换功能的示例。一次只能有一个线程执行`compareAndSet()`方法。例如：`boolean swapped = array.compareAndSet(5, 999, 123);`

## `addAndGet()`方法
 - `AtomicIntegerArray`还包含一个方法，可用于向给定元素添加值，并返回该元素的新值。调用`addAndGet()`也是一个原子操作（与`AtomicIntegerArray`上的所有操作一样）。例如：`int newValue = array.addAndGet(5, 3);`

## `getAndAdd()`方法
 - `AtomicIntegerArray`类还包含一个名为`getAndAdd()`的方法。`getAndAdd()`方法与`addAndGet()`方法的作用相同，只是`getAndAdd()`方法返回在向其添加值之前元素的值。例如：`int oldValue = array.getAndAdd(5, 3);`

## `incrementAndGet()`方法
 - `incrementAndGet()`方法将给定元素的值递增（加1）并返回该元素的新值。例如：`int newValue = array.incrementAndGet(5);`

## `getAndIncrement()`方法
 - `AtomicIntegerArray`类还包含一个名为`getAndIncrement()`的方法。`getAndIncrement()`方法与`incrementAndGet()`方法的作用相同，只是`getAndIncrement()`方法返回在递增之前元素的值。例如：`int oldValue = array.getAndIncrement(5);`

## `decrementAndGet()`方法
 - `decrementAndGet()`方法将给定元素的值递减（减1）并返回该元素的新值。例如：`int newValue = array.decrementAndGet(5);`

## `getAndDecrement()`方法
 - `AtomicIntegerArray`类还包含一个名为`getAndDecrement()`的方法。`getAndDecrement()`方法与`decrementAndGet()`方法的作用相同，只是`getAndDecrement()`方法返回在递减之前元素的值。例如：`int oldValue = array.getAndDecrement(5);`

## 其他方法
 - `AtomicIntegerArray`还有一些其他方法可用于特殊目的。您应该查看`AtomicIntegerArray`类的JavaDoc以了解更多关于这些方法的信息。
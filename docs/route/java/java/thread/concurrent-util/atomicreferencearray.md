# AtomicReferenceArray

## 创建AtomicReferenceArray
 - 使用两个构造函数之一创建`AtomicReferenceArray`。
     - 第一个构造函数接受一个`int`作为参数，指定`AtomicReferenceArray`的长度（可容纳的元素数量）。例如：`AtomicReferenceArray array = new AtomicReferenceArray(10);`
     - 第二个构造函数接受一个`E[]`数组作为参数，其中`E`是对象引用的类型（类）。使用此构造函数创建的`AtomicReferenceArray`将具有与数组参数相同的容量，并将数组参数的所有元素复制到`AtomicReferenceArray`中。例如：
```java
Object[] source = new Object[10];
source[5] = "Some string";
AtomicReferenceArray array = new AtomicReferenceArray(source);
```
 - 也可以为`AtomicReferenceArray`设置泛型类型。例如，将泛型类型设置为`String`：
```java
String[] source = new String[10];
source[5] = "Some string";
AtomicReferenceArray<String> array = new AtomicReferenceArray<String>(source);
```

## `get()`方法
 - `get()`方法返回给定索引处的元素的值。索引作为参数传递给`get()`方法。例如：`Object element = array.get(5);`
 - 如果`AtomicReferenceArray`具有泛型类型，则`get()`方法返回该类型的对象。例如，如果泛型类型是`String`，则可以这样调用`get()`：`String element = array.get(5);`（注意不需要进行类型转换为`String`）。

## `set()`方法
 - `set()`方法设置具有特定索引的元素的值。索引和值作为参数传递给`set()`方法。例如：`array.set(5, "another object");`
 - 第一个参数是要设置的元素的索引。第二个参数是要为该元素设置的值。如果`AtomicReferenceArray`具有泛型类型，则此参数的类型将是该类型。否则，类型为`Object`。

## `compareAndSet()`方法
 - `AtomicReferenceArray`的`compareAndSet()`方法可以将给定元素中存储的当前引用与预期引用进行比较，如果引用相同，则将当前引用替换为新引用。例如：
```java
String string1 = "string1";
String string2 = "string2";

String[] source = new String[10];
source[5] = string1;

AtomicReferenceArray<String> array = new AtomicReferenceArray<String>(source);

array.compareAndSet(5, string1, string2);
```
 - 此示例首先创建一个`String`数组，并将索引为5的元素设置为指向`string1`引用。然后，它将索引为5的元素的值与`string1`引用进行比较，如果它们相同，则将该元素的引用设置为`string2`。如果没有其他线程更改索引为5的元素的引用（在上述情况下不可能），则设置成功（设置新引用）。

## 其他方法
 - `AtomicReferenceArray`还有一些其他方法可用于特殊目的。您应该查看`AtomicReferenceArray`类的JavaDoc以了解更多关于这些方法的信息。
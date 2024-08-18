# 迭代集合中的元素

## 使用for-each模式
迭代集合元素的最简单选择是使用for-each模式。
```java
Collection<String> strings = List.of("one", "two", "three");

for (String element : strings) {
    System.out.println(element);
}
```
运行此代码将产生以下结果：
```
one
two
three
```
此模式非常高效，只要您只需要读取集合的元素。`Iterator`模式允许在迭代过程中删除集合的一些元素。如果您需要这样做，那么您将使用`Iterator`模式。

## 在集合上使用Iterator
使用一个特殊的对象，`Iterator`接口的实例，来迭代集合的元素。您可以从任何扩展`Collection`接口的对象获取`Iterator`对象。`iterator()`方法定义在`Iterable`接口上，由`Collection`接口扩展，并由集合层次结构的所有接口进一步扩展。

使用此对象迭代集合的元素是一个两步过程。
1. 首先，您需要使用`hasNext()`方法检查是否还有更多元素要访问
2. 然后，您可以使用`next()`方法前进到下一个元素。

如果您调用`next()`方法，但是集合中没有更多元素，您将得到一个`NoSuchElementException`。调用`hasNext()`不是强制性的，它在这里是为了确保确实有下一个元素。

以下是模式：
```java
Collection<String> strings = List.of("one", "two", "three", "four");
for (Iterator<String> iterator = strings.iterator(); iterator.hasNext();) {
    String element = iterator.next();
    if (element.length() == 3) {
        System.out.println(element);
    }
}
```
此代码将产生以下结果：
```
one
two
```

`Iterator`接口有一个第三个方法：`remove()`。调用此方法将从集合中删除当前元素。但是，在某些情况下，此方法不受支持，它将抛出一个`UnsupportedOperationException`。很明显，在一个不可变的集合上调用`remove()`是不行的，所以这是不支持情况之一。您从`ArrayList`、`LinkedList`和`HashSet`获取的`Iterator`实现都支持此remove操作。

## 在迭代过程中更新集合
如果您在迭代过程中修改了集合的内容，您可能会得到一个`ConcurrentModificationException`。得到这个异常可能有点令人困惑，因为这个异常也在并发编程中使用。在集合框架的上下文中，您可能会在没有触及多线程编程的情况下得到它。

以下代码抛出一个`ConcurrentModificationException`。
```java
Collection<String> strings = new ArrayList<>();
strings.add("one");
strings.add("two");
strings.add("three");

Iterator<String> iterator = strings.iterator();
while (iterator.hasNext()) {
    String element = iterator.next();
    strings.remove(element);
}
```
如果您需要删除满足特定条件的集合元素，您可以使用`removeIf()`方法。

## 实现Iterable接口
现在您已经看到了集合框架中的迭代器是什么，您可以创建一个简单的`Iterable`接口实现。

假设您需要创建一个`Range`类，该类模拟两个限制之间的整数范围。您所需要做的就是从第一个整数迭代到最后一个。

您可以使用记录（Java SE 16中引入的功能）实现`Iterable`接口：
```java
record Range(int start, int end) implements Iterable<Integer> {

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            private int index = start;

            @Override
            public boolean hasNext() {
                return index < end;
            }

            @Override
            public Integer next() {
                if (index > end) {
                    throw new NoSuchElementException("" + index);
                }
                int currentIndex = index;
                index++;
                return currentIndex;
            }
        };
    }
}
```
如果您的应用程序还不支持Java SE 16，您可以使用普通类做同样的事情。注意，`Iterator`实现的代码完全相同。

```java
class Range implements Iterable<Integer> {

    private final int start;
    private final int end;

    public Range(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            private int index = start;

            @Override
            public boolean hasNext() {
                return index < end;
            }

            @Override
            public Integer next() {
                if (index >= end) { // 注意这里的条件是 `>=` 而不是 `>`，以避免越界
                    throw new NoSuchElementException("" + index);
                }
                int currentIndex = index;
                index++;
                return currentIndex;
            }
        };
    }
}
```
在这两种情况下，您可以在for-each语句中使用`Range`的实例，因为它实现了`Iterable`：
```java
for (int i : new Range(0, 5)) {
    System.out.println("i = " + i);
}
```
运行此代码将给出以下结果：
```
i = 0
i = 1
i = 2
i = 3
i = 4
```
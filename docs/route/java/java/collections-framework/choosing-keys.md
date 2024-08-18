# 选择不可变类型作为您的键

## 避免使用可变键

使用可变键是一种不良实践，您绝对应该避免这样做。如果您这样做，可能会产生可怕的副作用：您可能会使映射的内容无法访问。

很容易设置一个示例来展示这一点。以下是一个 `Key` 类，它只是对 `String` 的可变包装。请注意，`equals()` 和 `hashCode()` 方法已经被您的IDE生成的代码覆盖了。

```java
//
// !!!!! 这是一个不良实践的例子 !!!!!!
// !!! 不要在生产代码中这样做 !!!!!!!!
//
class Key {
    private String key;

    public Key(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String toString() {
        return key;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Key key = (Key) o;
        return Objects.equals(this.key, key.key);
    }

    @Override
    public int hashCode() {
        return key.hashCode();
    }
}
```

您可以使用此包装器创建一个映射，在其中放置键值对。

```java
Key one = new Key("1");
Key two = new Key("2");

Map<Key, String> map = new HashMap<>();
map.put(one, "one");
map.put(two, "two");

System.out.println("map.get(one) = " + map.get(one));
System.out.println("map.get(two) = " + map.get(two));
```

到目前为止，这段代码是好的，打印出以下内容：

```
map.get(one) = one
map.get(two) = two
```

如果有人变异了您的键，会发生什么呢？这实际上取决于变异。您可以尝试以下示例中的一些，并看看当您尝试取回值时会发生什么。

在以下情况下，您正在用一个新值变异现有的键，这个新值与已经存在的键不对应。

```java
one.setKey("5");

System.out.println("map.get(one) = " + map.get(one));
System.out.println("map.get(two) = " + map.get(two));
System.out.println("map.get(new Key(1)) = " + map.get(new Key("1")));
System.out.println("map.get(new Key(2)) = " + map.get(new Key("2")));
System.out.println("map.get(new Key(5)) = " + map.get(new Key("5")));
```

结果是以下内容。您不能再从键获取值了，即使使用相同的对象。获取持有原始值的键的值也失败了。这个键值对丢失了。

```
map.get(one) = null
map.get(two) = two
map.get(new Key(1)) = null
map.get(new Key(2)) = two
map.get(new Key(5)) = null
```

如果您用另一个现有键的值变异了您的键，结果会有所不同。

```java
one.setKey("2");

System.out.println("map.get(one) = " + map.get(one));
System.out.println("map.get(two) = " + map.get(two));
System.out.println("map.get(new Key(1)) = " + map.get(new Key("1")));
System.out.println("map.get(new Key(2)) = " + map.get(new Key("2")));
```

现在的结果是以下内容。获取绑定到变异键的值返回绑定到另一个键的值。和前面的示例一样，您不能再获取绑定到变异键的值了。

```
map.get(one) = two
map.get(two) = two
map.get(new Key(1)) = null
map.get(new Key(2)) = two
```

如您所见，即使在非常简单的示例中，事情也可能变得非常糟糕：第一个键不能再用来访问正确的值了，而且在这个过程中您可能会丢失值。

简而言之：如果您真的不能避免使用可变键，请不要再变异它们。但您最好的选择是使用不可修改的键。

## 深入了解 HashSet 的结构

您可能想知道在这个部分讨论 `HashSet` 类为什么有趣？好吧，事实证明 `HashSet` 类实际上是内置在 `HashMap` 之上的。所以这两个类有一些共同的特点。

以下是 `HashSet` 类的 `add(element)` 代码：

```java
private transient HashMap<E,Object> map;
private static final Object PRESENT = new Object();

public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}
```

您可以看到，实际上，一个散列集将您的对象存储在哈希映射中（`transient` 关键字无关紧要）。您的对象是这个哈希映射的键，而值只是一个占位符，一个没有任何意义的对象。

需要记住的重要一点是，如果您在将对象添加到集合后变异它们，您可能会遇到应用程序中的一些奇怪的错误，这些错误将很难修复。

让我们再次以可变的 `Key` 类为例，这次您将把这个类的实例添加到集合中。

```java
Key one = new Key("1");
Key two = new Key("2");

Set<Key> set = new HashSet<>();
set.add(one);
set.add(two);

System.out.println("set = " + set);

// 永远不要在将对象添加到 Set 后变异它！
one.setKey("3");
System.out.println("set.contains(one) = " + set.contains(one));
boolean addedOne = set.add(one);
System.out.println("addedOne = " + addedOne);
System.out.println("set = " + set);
```

运行此代码将产生以下结果：

```
set = [1, 2]
set.contains(one) = false
addedOne = true
set = [3, 2, 3]
```

您可以看到，实际上集合的第一个元素和最后一个元素是相同的：

```java
List<Key> list = new ArrayList<>(set);
Key key0 = list.get(0);
Key key2 = list.get(2);

System.out.println("key0 = " + key0);
System.out.println("key2 = " + key2);
System.out.println("key0 == key2 ? " + (key0 == key2));
```

如果您运行这段最后的代码，您将得到以下结果：

```
key0 = 3
key2 = 3
key0 == key2 ? true
```

在这个示例中，您看到一旦将对象添加到集合后变异它，可能会导致集合中有同一个对象多次出现。简单来说，不要这样做！



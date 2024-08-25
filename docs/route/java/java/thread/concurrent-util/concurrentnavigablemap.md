# ConcurrentNavigableMap

`java.util.concurrent.ConcurrentNavigableMap` 类是一个 `java.util.NavigableMap`，支持并发访问，并为其子图启用了并发访问。"子图" 是由 `headMap()`、`subMap()` 和 `tailMap()` 等方法返回的映射。

我不会重新解释 `NavigableMap` 中的所有方法，而只是看看 `ConcurrentNavigableMap` 添加的方法。

## headMap()

`headMap(T toKey)` 方法返回一个视图，其中包含严格小于给定键的所有键的映射。

如果你对原始映射进行了更改，这些更改会反映在头部映射中。

以下是一个示例，演示了 `headMap()` 方法的使用。

```java
ConcurrentNavigableMap map = new ConcurrentSkipListMap();

map.put("1", "one");
map.put("2", "two");
map.put("3", "three");

ConcurrentNavigableMap headMap = map.headMap("2");
```

`headMap` 将指向一个 `ConcurrentNavigableMap`，其中只包含键 `"1"`，因为只有这个键严格小于 `"2"`。

查看 JavaDoc 以获取有关此方法如何工作以及其重载版本如何工作的更多具体细节。

## tailMap()

`tailMap(T fromKey)` 方法返回一个视图，其中包含所有大于或等于给定 `fromKey` 的键的映射。

如果你对原始映射进行了更改，这些更改会反映在尾部映射中。

以下是一个示例，演示了 `tailMap()` 方法的使用：

```java
ConcurrentNavigableMap map = new ConcurrentSkipListMap();

map.put("1", "one");
map.put("2", "two");
map.put("3", "three");

ConcurrentNavigableMap tailMap = map.tailMap("2");
```

`tailMap` 将包含键 `"2"` 和 `"3"`，因为这两个键都大于或等于给定的键 `"2"`。

查看 JavaDoc 以获取有关此方法如何工作以及其重载版本如何工作的更多具体细节。

## subMap()

`subMap()` 方法返回一个视图，其中包含原始映射中的所有键，这些键在两个作为参数传递给方法的键之间（包括前者，不包括后者）。以下是一个示例：

```java
ConcurrentNavigableMap map = new ConcurrentSkipListMap();

map.put("1", "one");
map.put("2", "two");
map.put("3", "three");

ConcurrentNavigableMap subMap = map.subMap("2", "3");
```

返回的子映射仅包含键 `"2"`，因为只有这个键大于或等于 `"2"`，并且小于 `"3"`。

## 更多方法

`ConcurrentNavigableMap` 接口还包含一些可能有用的其他方法。
例如：

- descendingKeySet()
- descendingMap()
- navigableKeySet()

查看官方 JavaDoc 以获取有关这些方法的更多信息。



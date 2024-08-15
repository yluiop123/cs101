# 使用接口作为类型
## 使用接口作为类型

当你定义一个新的接口时，你就定义了一个新的引用数据类型。你可以在任何可以使用其他数据类型名称的地方使用接口名称。如果你定义了一个引用变量，其类型为接口，那么分配给它的任何对象必须是实现了该接口的类的实例。

以一个示例方法为例，该方法可以在任意两个对象中找出较大的一个，适用于任何由实现 `Relatable` 接口的类实例化的对象：

```java
public Object findLargest(Object object1, Object object2) {
   Relatable obj1 = (Relatable)object1;
   Relatable obj2 = (Relatable)object2;
   if ((obj1).isLargerThan(obj2) > 0)
      return object1;
   else
      return object2;
}
```

通过将 `object1` 强制转换为 `Relatable` 类型，它可以调用 `isLargerThan()` 方法。

如果你在很多不同的类中实现 `Relatable` 接口，那么从这些类实例化的对象都可以使用 `findLargest()` 方法进行比较——前提是两个对象是同一个类的实例。类似地，它们也可以使用以下方法进行比较：

```java
public Object findSmallest(Object object1, Object object2) {
   Relatable obj1 = (Relatable)object1;
   Relatable obj2 = (Relatable)object2;
   if ((obj1).isLargerThan(obj2) < 0)
      return object1;
   else
      return object2;
}

public boolean isEqual(Object object1, Object object2) {
   Relatable obj1 = (Relatable)object1;
   Relatable obj2 = (Relatable)objec2;
   if ( (obj1).isLargerThan(obj2) == 0)
      return true;
   else
      return false;
}
```

这些方法适用于任何“可比较”的对象，无论它们的类继承是什么。当它们实现 `Relatable` 接口时，它们可以是它们自己的类（或超类）类型和 `Relatable` 类型。这给了它们一些多重继承的优势，它们可以同时拥有来自超类和接口的行为。



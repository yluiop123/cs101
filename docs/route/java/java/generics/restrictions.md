# 泛型的限制

## 不能使用原始类型实例化泛型类型
考虑以下参数化类型：

```java
class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    // ...
}
```

在创建一个`Pair`对象时，你不能用原始类型替换类型参数`K`或`V`：

```java
Pair<int, char> p = new Pair<>(8, 'a');  // 编译时错误
```

你只能使用非原始类型替换类型参数`K`和`V`：

```java
Pair<Integer, Character> p = new Pair<>(8, 'a');
```

注意Java编译器自动将`8`装箱为`Integer.valueOf(8)`，将`'a'`装箱为`Character('a')`：

```java
Pair<Integer, Character> p = new Pair<>(Integer.valueOf(8), new Character('a'));
```

有关自动装箱的更多信息，请参阅数字和字符串部分中的自动装箱和拆箱。

## 不能创建类型参数的实例
你不能创建类型参数的实例。例如，以下代码会导致编译时错误：

```java
public static <E> void append(List<E> list) {
    E elem = new E();  // 编译时错误
    list.add(elem);
}
```

作为解决方法，你可以通过反射创建类型参数的对象：

```java
public static <E> void append(List<E> list, Class<E> cls) throws Exception {
    E elem = cls.newInstance();   // 可以
    list.add(elem);
}
```

你可以按以下方式调用`append()`方法：

```java
List<String> ls = new ArrayList<>();
append(ls, String.class);
```

## 不能声明类型参数类型的静态字段
类的一个静态字段是类的所有非静态对象共享的类级变量。因此，不允许静态字段使用类型参数。考虑以下类：

```java
public class MobileDevice<T> {
    private static T os;

    // ...
}
```

如果允许使用类型参数的静态字段，那么以下代码将会混淆：

```java
MobileDevice<Smartphone> phone = new MobileDevice<>();
MobileDevice<Pager> pager = new MobileDevice<>();
MobileDevice<TabletPC> pc = new MobileDevice<>();
```

由于静态字段`os`由`phone`、`pager`和`pc`共享，`os`的实际类型是什么？它不能同时是`Smartphone`、`Pager`和`TabletPC`。因此，你不能创建类型参数的静态字段。

## 不能对参数化类型使用强制类型转换或instanceof
由于Java编译器会擦除泛型代码中的所有类型参数，你不能在运行时验证泛型类型使用了哪种参数化类型：

```java
public static <E> void rtti(List<E> list) {
    if (list instanceof ArrayList<Integer>) {  // 编译时错误
        // ...
    }
}
```

传递给`rtti()`方法的参数化类型集合是：

```java
S = { ArrayList<Integer>, ArrayList<String>, LinkedList<Character>, ... }
```

运行时不跟踪类型参数，所以它无法区分`ArrayList<Integer>`和`ArrayList<String>`。你最多可以使用无界限通配符来验证列表是否是`ArrayList`：

```java
public static void rtti(List<?> list) {
    if (list instanceof ArrayList<?>) {  // 可以；instanceof需要一个可重写类型
        // ...
    }
}
```

通常，你不能对参数化类型进行强制类型转换，除非它由无界限通配符参数化。例如：

```java
List<Integer> li = new ArrayList<>();
List<Number> ln = (List<Number>) li;  // 编译时错误
```

然而，在某些情况下，编译器知道类型参数始终有效，并允许强制类型转换。例如：

```java
List<String> l1 = ...;
ArrayList<String> l2 = (ArrayList<String>)l1;  // 可以
```

## 不能创建参数化类型的数组
你不能创建参数化类型的数组。例如，以下代码无法编译：

```java
List<Integer>[] arrayOfLists = new List<Integer>[2];  // 编译时错误
```

以下代码展示了当不同类型的对象被插入数组时会发生什么：

```java
Object[] strings = new String[2];
strings[0] = "hi";   // 可以
strings[1] = 100;    // 抛出ArrayStoreException。
```

如果你尝试对泛型列表做同样的事情，会有问题：

```java
Object[] stringLists = new List<String>[2];  // 编译器错误，但假设它被允许
stringLists[0] = new ArrayList<String>();   // 可以
stringLists[1] = new ArrayList<Integer>();  // 应该抛出ArrayStoreException，
                                            // 但运行时无法检测到。
```

如果允许参数化列表的数组，前面的代码将无法抛出期望的`ArrayStoreException`。

## 不能创建、捕获或抛出参数化类型的对象
泛型类不能直接或间接扩展`Throwable`类。例如，以下类将无法编译：

```java
// 间接扩展Throwable
class MathException<T> extends Exception { /* ... */ }    // 编译时错误

// 直接扩展Throwable
class QueueFullException<T> extends Throwable { /* ... */ } // 编译时错误
```

方法不能捕获类型参数的实例：

```java
public static <T extends Exception, J> void execute(List<J> jobs) {
    try {
        for (J job : jobs)
            // ...
    } catch (T e) {   // 编译时错误
        // ...
    }
}
```

然而，你可以在`throws`子句中使用类型参数：

```java
class Parser<T extends Exception> {
    public void parse(File file) throws T {     // 可以
        // ...
    }
}
```

## 不能在类型擦除后具有相同原始类型的重载方法
一个类不能有两个重载方法，在类型擦除后将具有相同的签名。

```java
public class Example {
    public void print(Set<String> strSet) { }
    public void print(Set<Integer> intSet) { }
}
```

所有的重载将共享相同的classfile表示，并将生成编译时错误。

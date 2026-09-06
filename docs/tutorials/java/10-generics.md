---
title: 泛型深入
---

# 第 10 章 · 泛型深入

**本章目标：**

- 掌握泛型类与泛型方法的定义
- 理解通配符 `?` 与上下界约束
- 认识类型擦除及其实际影响

## 10.1 为什么需要泛型

没有泛型的容器装什么都行，取出来都得强转：

```java
// 原始类型（raw type）—— 泛型出现前的写法
List list = new ArrayList();
list.add("hello");
list.add(42);                     // 什么都能塞
String s = (String) list.get(1);  // ❌ ClassCastException 运行时才炸
```

**泛型（generics）**把类型检查提前到编译期：

```java
List<String> list = new ArrayList<>();
list.add("hello");
list.add(42);        // ❌ 编译错误 —— 直接拦住
String s = list.get(0);   // 无需强转，类型自动正确
```

第 9 章的 `List<String>` 就是泛型的应用——本章学习"自己写泛型"。

## 10.2 泛型类

类型参数用大写字母约定：`T`（Type）、`E`（Element）、`K/V`（Key/Value）、`R`（Result）：

```java
// 一个"盒子"，装什么类型由使用方决定
public class Box<T> {
    private T content;

    public void put(T item) {
        this.content = item;
    }

    public T get() {
        return content;
    }
}

Box<String> stringBox = new Box<>();
stringBox.put("hello");
String s = stringBox.get();       // 不用强转

Box<Integer> intBox = new Box<>();
intBox.put(42);
int n = intBox.get();
```

多个类型参数：

```java
public class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> port = new Pair<>("http", 80);
```

## 10.3 泛型方法

```java
public class Utils {
    // <T> 声明在返回类型之前；参数与返回值都能用 T
    public static <T> T firstOrNull(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }

    // 多个类型参数
    public static <K, V> Map<V, K> reverse(Map<K, V> map) {
        Map<V, K> result = new HashMap<>();
        map.forEach((k, v) -> result.put(v, k));
        return result;
    }
}

String first = Utils.firstOrNull(List.of("a", "b"));   // T 推断为 String
```

与泛型类的区别：**泛型方法的 T 是"方法级别"的**，每次调用可以推断出不同类型。

## 10.4 类型约束：extends 上界

```java
// T 必须是 Number 或其子类（才能调用 doubleValue()）
public static <T extends Number> double sum(List<T> list) {
    double total = 0;
    for (T item : list) {
        total += item.doubleValue();     // 有 Number 的能力保证
    }
    return total;
}

sum(List.of(1, 2, 3));           // ✅ Integer 是 Number 子类
sum(List.of(1.5, 2.5));          // ✅
sum(List.of("a"));               // ❌ String 不是 Number
```

`<T extends 接口>` 同理——约束 T 必须实现某接口（对比 TS 的 `<T extends { length: number }>`，思想完全一致）。

## 10.5 通配符：? 的两种形态

泛型没有协变——`List<Dog>` 不是 `List<Animal>` 的子类型！通配符解决"接受一组相关泛型"的问题：

```java
// ① 无界通配符 ?：只读不可写（写会编译错，因为不知道具体类型）
public static int countNonNull(Collection<?> c) {
    int count = 0;
    for (Object item : c) {
        if (item != null) count++;
    }
    return count;
}

// ② 上界通配符 extends：生产者——只从中读取
public static double sumAll(List<? extends Number> list) {
    double total = 0;
    for (Number n : list) total += n.doubleValue();   // 读出来当 Number 用
    return total;
}
sumAll(List.of(1, 2));         // List<Integer> ✅
sumAll(List.of(1.5));          // List<Double> ✅

// ③ 下界通配符 super：消费者——只往里写入
public static void fillDogs(List<? super Dog> list) {
    list.add(new Dog());         // Dog 或其父类的列表都能装 Dog
}
fillDogs(new ArrayList<Dog>());      // ✅
fillDogs(new ArrayList<Animal>());   // ✅
```

记忆口诀（PECS）：**Producer Extends, Consumer Super**——读数据用 extends，写数据用 super。

## 10.6 类型擦除（type erasure）

Java 泛型是**编译期**检查，运行时类型信息被**擦除**：

```java
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();

a.getClass() == b.getClass();    // true！运行时都是同一个 ArrayList 类

// 推论：运行时拿不到 T 的真实类型
T item = ...;
item.getClass();     // 只能拿到擦除后的类型
new T();             // ❌ 编译错误——运行时不知道 T 是什么，无法实例化
T[] arr = new T[10]; // ❌ 同理
```

对比 C#/TS：C# 泛型运行时保留（真泛型），TS 泛型纯编译期。Java 介于两者——**编译期检查 + 运行时擦除**。需要运行时类型信息时，传 `Class<T>` 参数（第 14 章反射会用到这个技巧）。

## 10.7 泛型与继承的实战套路

```java
// 通用响应包装（前后端交互的标准结构）
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = 0;
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = code;
        r.message = message;
        return r;
    }
}

ApiResponse<List<Course>> res = ApiResponse.ok(courseList);
ApiResponse<Void> deleted = ApiResponse.fail(404, "未找到");
```

这个 `ApiResponse<T>` 在 Spring Boot 教程里会原样出现——泛型是读懂任何 Java 框架源码的门票。

## 10.8 综合练习：类型安全的缓存

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TypedCache {
    private final Map<String, Object> store = new ConcurrentHashMap<>();

    // Class<T> 参数让"运行时知道 T"成为可能（绕过类型擦除）
    public <T> T get(String key, Class<T> type) {
        Object value = store.get(key);
        if (value == null) {
            return null;
        }
        return type.cast(value);     // 安全强转
    }

    public <T> void put(String key, T value) {
        store.put(key, value);
    }
}

TypedCache cache = new TypedCache();
cache.put("count", 42);
Integer count = cache.get("count", Integer.class);   // 类型安全
cache.get("count", String.class);   // ❌ ClassCastException —— 但这是"按约定"的类型错，不是泛型漏洞
```

## 本章小结

- 泛型把类型错误提前到编译期；T/E/K/V/R 命名约定
- 泛型类（类级参数）与泛型方法（方法级参数，需 `<T>` 声明）
- `extends` 约束能力；通配符 PECS：读 extends、写 super
- 类型擦除：编译期有、运行时无；`Class<T>` 传参绕过

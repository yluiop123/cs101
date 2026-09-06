---
title: 集合框架
---

# 第 9 章 · 集合框架

**本章目标：**

- 理解 List/Set/Map 三大家族的分工
- 熟练 ArrayList、HashMap 的增删改查与遍历
- 掌握 Collections 与 Stream 的常用操作

## 9.1 集合框架总览

数组定长、功能裸奔——**集合框架（Collections Framework）**提供一套开箱即用的容器：

```text
Collection（单值集合）
├── List    有序可重复        ArrayList / LinkedList
├── Set     无序不可重复      HashSet / LinkedHashSet / TreeSet
└── Queue   队列              ArrayDeque / LinkedList

Map（键值对，不在 Collection 体系内）
└── HashMap / LinkedHashMap / TreeMap
```

选型口诀：

```text
要顺序、可重复           → List（默认 ArrayList）
要去重                   → Set（默认 HashSet）
要 key 查 value          → Map（默认 HashMap）
```

## 9.2 List：有序列表

```java
import java.util.ArrayList;
import java.util.List;

List<String> list = new ArrayList<>();    // 面向接口声明（第 6 章）

list.add("Java");          // 尾部追加
list.add("Python");
list.add(1, "Go");         // 指定位置插入 → [Java, Go, Python]
list.get(0);               // "Java"
list.set(1, "Golang");     // 替换下标 1
list.size();               // 3
list.contains("Java");     // true
list.indexOf("Java");      // 0
list.remove("Java");       // 按对象删除（返回 boolean）
list.remove(0);            // 按下标删除（Integer 列表注意重载歧义！）
list.isEmpty();            // false

// 遍历三种方式
for (String s : list) { ... }                          // 增强 for（首选）
list.forEach(s -> System.out.println(s));              // forEach + Lambda
for (int i = 0; i < list.size(); i++) { ... }          // 需要下标时
```

::: warning 遍历中删除：用 removeIf
```java
// ❌ ConcurrentModificationException：边遍历边删破坏迭代器
for (String s : list) {
    if (s.startsWith("J")) list.remove(s);
}

// ✅ 专用 API
list.removeIf(s -> s.startsWith("J"));
```
:::

## 9.3 Set：去重容器

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("backend");
tags.add("java");           // 重复元素被忽略
tags.size();                // 2

// 判重：Set.contains 是 O(1)（哈希），List.contains 是 O(n) —— 海量判重用 Set
```

三实现差异：

```text
HashSet          无序、最快（默认选它）
LinkedHashSet    保持插入顺序
TreeSet          自动排序（红黑树）
```

## 9.4 Map：键值对

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();

scores.put("Tom", 95);              // 存
scores.put("Lucy", 88);
scores.get("Tom");                  // 95
scores.getOrDefault("Bob", 0);      // 0（key 不存在给默认值）
scores.containsKey("Tom");          // true
scores.remove("Tom");
scores.size();

// 三种遍历
for (String key : scores.keySet()) { ... }                       // 只要键
for (Integer v : scores.values()) { ... }                        // 只要值
for (Map.Entry<String, Integer> e : scores.entrySet()) {         // 键值都要
    System.out.println(e.getKey() + " = " + e.getValue());
}
scores.forEach((k, v) -> System.out.println(k + " = " + v));     // Lambda 遍历

// 计数惯用法三连
map.put(word, map.getOrDefault(word, 0) + 1);    // 老写法
map.merge(word, 1, Integer::sum);                 // merge：有则加，无则置
map.computeIfAbsent(word, k -> 0);                // 不存在才计算放入
```

## 9.5 不可变集合与 List.of

```java
// 只读集合（Java 9+）：不能增删改，适合常量列表
List<String> langs = List.of("Java", "Go", "Python");
Map<String, Integer> ports = Map.of("http", 80, "https", 443);

// List.of(null) 直接 NPE —— 不允许 null 元素
```

## 9.6 Collections 工具类

```java
import java.util.Collections;

Collections.sort(list);                  // 排序
Collections.reverse(list);               // 反转
Collections.shuffle(list);               // 洗牌
Collections.max(list); Collections.min(list);
Collections.unmodifiableList(list);      // 包装成只读视图
```

## 9.7 Stream：声明式数据处理

**Stream API**（Java 8+）把"循环+条件+收集"变成链式声明——现代 Java 代码的主力写法：

```java
import java.util.stream.Collectors;

List<String> names = List.of("Tom", "Lucy", "Jerry", "Lily");

// 需求：取以 L 开头的名字，转大写，收集成列表
List<String> result = names.stream()
        .filter(n -> n.startsWith("L"))       // 过滤
        .map(String::toUpperCase)             // 转换
        .collect(Collectors.toList());        // 收集（Java 16+ 可用 .toList()）
// [LUCY, LILY]

// 数字流统计
List<Integer> nums = List.of(5, 3, 9, 1);
nums.stream().mapToInt(Integer::intValue).sum();    // 18
nums.stream().max(Integer::compareTo).get();        // 9
nums.stream().sorted().toList();                    // [1, 3, 5, 9]

// 分组（按首字母）
Map<Character, List<String>> groups = names.stream()
        .collect(Collectors.groupingBy(n -> n.charAt(0)));
// {T=[Tom], L=[Lucy, Lily], J=[Jerry]}
```

Stream 是**惰性求值**：中间操作（filter/map）只是构建管道，终结操作（collect/forEach）才真正执行。

## 9.8 综合练习：学生成绩分析

```java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record Student(String name, String clazz, int score) {}

public class ScoreAnalyzer {
    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Tom", "A", 92),
            new Student("Lucy", "B", 85),
            new Student("Jerry", "A", 78),
            new Student("Lily", "B", 95)
        );

        // ① 及格（>=80）名单按分数降序
        List<Student> passed = students.stream()
                .filter(s -> s.score() >= 80)
                .sorted((a, b) -> b.score() - a.score())
                .toList();

        // ② 按班级分组
        Map<String, List<Student>> byClass = students.stream()
                .collect(Collectors.groupingBy(Student::clazz));

        // ③ 每班平均分
        Map<String, Double> avgByClass = students.stream()
                .collect(Collectors.groupingBy(
                    Student::clazz,
                    Collectors.averagingInt(Student::score)));

        System.out.println(passed);
        System.out.println(byClass);
        System.out.println(avgByClass);
        // {A=85.0, B=90.0}
    }
}
```

filter / sorted / groupingBy / averagingInt——一段代码覆盖 Stream 日常的 80% 用法，也是第 15 章实战的数据处理基础。

## 本章小结

- List 有序可重复、Set 去重、Map 键值对；默认 ArrayList/HashSet/HashMap
- 遍历中删除用 removeIf；计数用 merge/getOrDefault
- List.of/Map.of 不可变集合；Collections 提供排序反转等工具
- Stream 链式处理：filter → map → collect，惰性求值

---
title: 数组与字符串
---

# 第 3 章 · 数组与字符串

**本章目标：**

- 掌握数组的声明、遍历与 Arrays 工具类
- 理解 String 不可变性与其常用方法
- 会用 StringBuilder 做高效拼接

## 3.1 数组：固定长度的同类型容器

```java
// 声明与初始化
int[] nums = new int[5];              // 长度 5，默认值全 0
int[] odds = {1, 3, 5, 7, 9};         // 字面量初始化（长度自动）
String[] names = new String[] {"Tom", "Lucy"};

// 访问与修改（下标从 0 开始）
odds[0] = 11;
System.out.println(odds.length);      // 5 —— length 是属性，无括号

// 遍历
for (int i = 0; i < odds.length; i++) {
    System.out.println(odds[i]);
}

// 增强 for（for-each）：只读遍历首选
for (int n : odds) {
    System.out.println(n);
}
```

::: danger 数组越界
`odds[5]` 编译不报错，**运行时抛 `ArrayIndexOutOfBoundsException`**。边界判断永远用 `i < arr.length`。
:::

多维数组：

```java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};
matrix[1][2]   // 6
```

## 3.2 Arrays 工具类

```java
import java.util.Arrays;

int[] nums = {5, 2, 8, 1};

Arrays.sort(nums);                    // 排序 → {1, 2, 5, 8}
System.out.println(Arrays.toString(nums));   // [1, 2, 5, 8]（直接打印数组只会得到地址，必须用 toString）

int idx = Arrays.binarySearch(nums, 5);      // 二分查找（要求已排序）→ 2
int[] copy = Arrays.copyOf(nums, 6);         // 复制并扩容 → [1,2,5,8,0,0]
Arrays.fill(copy, 0);                        // 全部填充 0
```

## 3.3 String：不可变的字符序列

```java
String s = "Hello, Java";

s.length();                 // 10
s.charAt(0);                // 'H'
s.substring(7);             // "Java"（从下标 7 到末尾）
s.substring(0, 5);          // "Hello"（含头不含尾）
s.indexOf("Java");          // 7（找不到返回 -1）
s.toUpperCase();            // "HELLO, JAVA"
s.replace("Java", "World"); // "Hello, World"
s.contains("Java");         // true
s.trim();                   // 去首尾空白
s.split(", ");              // ["Hello", "Java"] —— 字符串数组
```

### 关键认知：String 不可变（immutable）

```java
String a = "hello";
a.toUpperCase();      // 返回新字符串 "HELLO"，a 本身仍是 "hello"！
a = a.toUpperCase();  // ✅ 要重新赋值才能"改变" a
```

**所有 String 方法都返回新对象，原串永远不变**——这是设计（安全、可缓存、线程安全）。

### == 与 equals：新手第一大坑

```java
String s1 = "hello";
String s2 = new String("hello");

s1 == s2;        // false —— == 比较引用（是否同一个对象）
s1.equals(s2);   // true  —— equals 比较内容
```

::: danger 比较字符串一律用 equals
`==` 偶尔"看起来对"（字面量会被 JVM 缓存复用），但换种写法就翻车。**铁律：字符串内容比较用 `equals`，`==` 只用于判空或枚举。**
:::

## 3.4 字符串拼接的性能：StringBuilder

```java
// 拼接 1 万次：每次 + 都创建新字符串对象 → O(n²) 灾难
String result = "";
for (int i = 0; i < 10000; i++) {
    result += i;          // ❌ 性能陷阱
}

// StringBuilder：内部可变缓冲区，追加不产生新对象
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);         // ✅
}
String result2 = sb.toString();
```

选择口诀：**循环里拼字符串必用 StringBuilder**；两三个片段的一次性拼接用 `+` 无妨。

## 3.5 文本块（Java 15+）

多行字符串不再需要拼接和转义：

```java
// 传统写法
String sql = "SELECT *\n" +
             "  FROM users\n" +
             " WHERE age > 18";

// 文本块：三引号，所见即所得
String sql2 = """
    SELECT *
      FROM users
     WHERE age > 18
    """;
```

JSON、SQL、HTML 模板场景的可读性利器。

## 3.6 char 与字符串的转换

```java
char c = 'A';
int code = c;                 // 65 —— char 可隐式转 int（Unicode 码点）
char upper = (char) (c + 1);  // 'B' —— 需要强制转换

String str = String.valueOf(c);        // char → String
char[] chars = "hello".toCharArray();  // String → char 数组
char first = "hello".charAt(0);        // 取单个字符
```

## 3.7 综合练习：统计单词频率

```java
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class WordCount {
    public static void main(String[] args) {
        String text = "the quick brown fox jumps over the lazy dog the fox";

        String[] words = text.split(" ");
        Map<String, Integer> counts = new HashMap<>();

        for (String word : words) {
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }

        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            System.out.println(entry.getKey() + " => " + entry.getValue());
        }
        // the => 3, fox => 2 ...
    }
}
```

HashMap 是第 9 章集合框架的主角，这里先尝鲜——它让"计数"从双层数组循环变成三行代码。

## 本章小结

- 数组定长；越界运行时报错；遍历首选增强 for
- Arrays 工具类：sort/toString/binarySearch/copyOf
- String 不可变；**内容比较用 equals**；循环拼接用 StringBuilder
- 文本块三引号写多行字符串

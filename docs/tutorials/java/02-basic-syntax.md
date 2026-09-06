---
title: 基础语法与流程控制
---

# 第 2 章 · 基础语法与流程控制

**本章目标：**

- 掌握 8 种基本类型与变量声明
- 熟练使用运算符与三大流程控制结构
- 会定义方法并理解重载

## 2.1 变量与基本类型

Java 是**强类型语言**：每个变量都有明确的类型，声明时写死：

```java
int age = 18;              // 整数
long bigNum = 9_000_000_000L;   // 长整数（超过 int 范围用 long，结尾加 L）
double price = 9.99;       // 浮点数
float f = 1.5f;            // 单精度（结尾加 f，少用）
boolean ok = true;         // 布尔：只有 true/false（没有 0/1）
char grade = 'A';          // 单个字符（单引号）
String name = "Tom";       // 字符串（引用类型，双引号）
```

8 种基本类型速查：

```text
整数：byte(1字节) short(2) int(4) long(8)     日常用 int / long
浮点：float(4) double(8)                      日常用 double
字符：char(2字节，Unicode)
布尔：boolean
```

::: warning int 的边界与除法陷阱
```java
int a = 7 / 2;        // 3 —— 整数除法直接舍弃小数！
double b = 7 / 2;     // 3.0 —— 先按 int 算出 3，再转 double
double c = 7.0 / 2;   // 3.5 —— 有一个操作数是浮点数才按浮点算
```
金额等精确小数场景不用 double（有精度误差），用 `BigDecimal`（第 8 章）。
:::

## 2.2 var：局部变量类型推断

Java 10 起，**局部变量**可以省略重复的类型声明：

```java
var message = "Hello";      // 编译器推断为 String
var count = 42;             // int
var list = new ArrayList<String>();   // ArrayList<String>

var x;                      // ❌ 没有初始值，推断不出来
var y = null;               // ❌ 同理
```

`var` 只是"让编译器替你写类型"，**类型依然固定**——推断完成后就是 int，不能再赋字符串。

## 2.3 运算符

```java
int a = 10, b = 3;
a + b;   // 13      a - b;  // 7
a * b;   // 30      a / b;  // 3（整数除法）
a % b;   // 1       取余（判断奇偶、循环队列常用）

a == b;  // false   a != b; // true
a > b && b > 0;     // 逻辑与（短路：左边 false 就不算右边）
a < b || b > 0;     // 逻辑或
!ok                 // 逻辑非

int c = b > 0 ? 1 : -1;   // 三元运算符：条件 ? 真值 : 假值
```

`==` 与 `equals` 的区别（引用比较 vs 内容比较）在第 3 章字符串处展开——先记住：**比较字符串内容用 equals**。

## 2.4 流程控制

### if / else

```java
int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

### switch：现代箭头写法（Java 14+）

```java
// 传统写法（会 fall-through 穿透，容易忘 break）
// 现代写法：箭头语法，不穿透、可直接当表达式用
String level = switch (score / 10) {
    case 10, 9 -> "优秀";
    case 8, 7 -> "良好";
    case 6 -> "及格";
    default -> "不及格";
};
```

### 循环

```java
// for：次数确定
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// while：条件不确定
int n = 100;
while (n > 1) {
    n = n / 2;
}

// do-while：至少执行一次
int input;
do {
    input = readInput();   // 伪代码：先执行再判断
} while (input != 0);

// break 跳出循环；continue 跳过本次进入下一轮
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;    // 跳过 3
    if (i == 8) break;       // 到 8 停止
    System.out.println(i);
}
```

## 2.5 方法（method）

方法 = 其他语言里的"函数"，必须归属于某个类：

```java
public class Calculator {

    // 访问修饰符 返回类型 方法名(参数列表)
    static int add(int a, int b) {
        return a + b;
    }

    // 无返回值用 void
    static void greet(String name) {
        System.out.println("你好，" + name);
    }

    public static void main(String[] args) {
        int sum = add(1, 2);    // 调用并接收返回值
        greet("Tom");
    }
}
```

### 重载（overload）：同名不同参

```java
static int add(int a, int b)          { return a + b; }
static double add(double a, double b) { return a + b; }
static int add(int a, int b, int c)   { return a + b + c; }

add(1, 2);        // 调第一个
add(1.5, 2.5);    // 调第二个
```

**方法名相同、参数列表不同**——编译器按实参自动选择。这是编译期多态，第 5 章的"运行期多态"（重写）会与它对照。

## 2.6 注释

```java
// 单行注释

/* 多行注释
   可以跨行 */

/**
 * 文档注释（javadoc）：生成 API 文档，公共方法建议写
 */
```

## 2.7 综合练习：FizzBuzz

```java
public class FizzBuzz {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            String out = "";
            if (i % 3 == 0) out += "Fizz";
            if (i % 5 == 0) out += "Buzz";
            if (out.isEmpty()) out = String.valueOf(i);
            System.out.println(out);
        }
    }
}
```

经典面试题：3 的倍数打 Fizz、5 的倍数打 Buzz、两者倍数打 FizzBuzz——用上了取余、字符串拼接、循环与分支。

## 本章小结

- 强类型：8 种基本类型 + String；整数除法舍弃小数
- var 只推断局部变量，类型依旧固定
- switch 箭头语法不穿透；for/while/do-while 各有场景
- 方法必须归属类；重载 = 同名不同参

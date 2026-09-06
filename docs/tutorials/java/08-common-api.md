---
title: 常用 API 与工具类
---

# 第 8 章 · 常用 API 与工具类

**本章目标：**

- 掌握包装类型与自动装箱拆箱
- 熟练日期时间 API（java.time）
- 会用 Objects、BigDecimal、UUID 等高频工具

## 8.1 包装类型：基本类型的对象形态

集合框架只能存对象（第 9 章），基本类型需要**包装类（wrapper）**：

```text
byte→Byte  short→Short  int→Integer  long→Long
float→Float  double→Double  char→Character  boolean→Boolean
```

```java
// 自动装箱 / 拆箱（编译器自动转换）
Integer boxed = 42;           // int → Integer（装箱）
int primitive = boxed;        // Integer → int（拆箱）

// 常用静态方法
int n = Integer.parseInt("123");        // 字符串 → int
String s = Integer.toString(123);       // int → 字符串
Integer.toBinaryString(5);              // "101"
Integer.MAX_VALUE;                      // 2147483647（int 上限）
```

::: danger 包装类型的 == 陷阱与 NPE
```java
Integer a = 127, b = 127;
a == b;        // true —— -128~127 有缓存，是同一对象
Integer c = 128, d = 128;
c == d;        // false！超出缓存范围，是两个对象

Integer maybeNull = null;
int x = maybeNull;             // ❌ 拆箱 null → NullPointerException
```
铁律：**包装类型比较用 equals**；可能为 null 的拆箱前先判空。
:::

## 8.2 日期时间：java.time（Java 8+）

老 API（`Date`/`SimpleDateFormat）已过时——新代码统一用 **java.time**：

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

LocalDate today = LocalDate.now();            // 2026-09-06
LocalDateTime now = LocalDateTime.now();      // 2026-09-06T14:30:05.123

// 创建
LocalDate birthday = LocalDate.of(2000, 1, 1);
LocalDateTime meeting = LocalDateTime.of(2026, 9, 6, 14, 30);

// 读取
today.getYear();          // 2026
today.getMonthValue();    // 9
today.getDayOfWeek();     // SUNDAY

// 运算：不可变设计，返回新对象
today.plusDays(7);           // 一周后
today.minusMonths(1);        // 一个月前
birthday.until(today).getYears();   // 26（间隔）

// 比较
today.isBefore(birthday);    // false
today.isAfter(birthday);     // true

// 格式化与解析
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String text = now.format(fmt);                    // "2026-09-06 14:30:05"
LocalDateTime parsed = LocalDateTime.parse("2026-09-06 14:30:05", fmt);
```

::: info java.time 全部不可变
和 String 一样，`plusDays` 返回新对象，原对象不变——不会出现"改了日期忘了接返回值"的隐蔽 bug（老 Calendar API 的经典翻车点）。
:::

## 8.3 Objects：判空与比较工具

```java
import java.util.Objects;

Objects.equals(a, b);          // 空安全的 equals（任一为 null 也不炸）
Objects.isNull(obj);           // obj == null 的可读写法
Objects.requireNonNull(obj, "obj 不能为空");   // 参数校验（为 null 直接抛 NPE）

Objects.hash(name, age);       // 生成 hashCode（重写 hashCode 时用）
```

## 8.4 BigDecimal：精确小数

金额计算的标准答案（double 有二进制精度误差）：

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

BigDecimal price = new BigDecimal("0.1");     // ✅ 用字符串构造！
BigDecimal qty = new BigDecimal("3");

BigDecimal total = price.multiply(qty);                        // 0.3
BigDecimal rate = total.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);   // 0.15（保留 2 位，四舍五入）

price.compareTo(BigDecimal.ZERO) > 0;    // 比较用 compareTo，不用 equals
```

::: danger new BigDecimal(0.1) ≠ new BigDecimal("0.1")
用 double 构造会把二进制误差原样带进来（0.1000000000000000055…）。**永远用字符串构造**。比较也用 `compareTo`（equals 连精度位数一起比，`1.0` 与 `1.00` 不相等）。
:::

## 8.5 其他高频工具

```java
// UUID：全局唯一 ID（分布式系统的"身份证"）
import java.util.UUID;
String id = UUID.randomUUID().toString();    // "3f8a2c1e-9b4d-4e6f-..."

// Random：伪随机数
import java.util.Random;
Random random = new Random();
random.nextInt(100);          // 0~99
random.nextInt(16, 256);      // 16~255（Java 17+）

// Math
Math.abs(-5);        // 5
Math.max(3, 7);      // 7
Math.pow(2, 10);     // 1024.0
Math.round(3.6);     // 4（四舍五入）

// Optional：优雅表达"可能没有值"（第 9 章集合配合使用）
import java.util.Optional;
Optional<String> name = Optional.ofNullable(nullableName);
name.orElse("默认名");          // 为 null 时给默认值
name.ifPresent(n -> System.out.println(n));   // 有值才执行
```

## 8.6 String 的进阶方法（Java 11+ 补充）

```java
"  hello  ".strip();          // "hello"（支持 Unicode 空白，比 trim 更全）
" ".isBlank();                // true（空白或空串）
"java".repeat(3);             // "javajavajava"
String.join("-", "a", "b");   // "a-b"（批量拼接）
"a,b,,c".split(",", -1);      // ["a","b","","c"]（保留尾部空串）
```

## 8.7 综合练习：订单金额计算

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public record Order(String id, String item, int qty, BigDecimal unitPrice, LocalDateTime createdAt) {

    public BigDecimal total() {
        return unitPrice.multiply(BigDecimal.valueOf(qty))
                        .setScale(2, RoundingMode.HALF_UP);
    }

    public String toReceipt() {
        String time = createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        return "[%s] 订单 %s：%s × %d = ¥%s".formatted(time, id, item, qty, total());
    }
}

Order order = new Order(
    UUID.randomUUID().toString().substring(0, 8),
    "机械键盘", 2, new BigDecimal("199.00"),
    LocalDateTime.now()
);
System.out.println(order.toReceipt());
// [2026-09-06 15:20] 订单 a1b2c3d4：机械键盘 × 2 = ¥398.00
```

record（第 4 章）+ java.time + BigDecimal + UUID——后端开发一天的日常工作量。

## 本章小结

- 包装类型集合必备；比较用 equals、拆箱防 NPE
- java.time 不可变、API 现代；日期时间统一用它
- Objects 判空比较、BigDecimal 管钱（字符串构造 + compareTo）、UUID 管唯一 ID
- Optional 表达可空，orElse/ifPresent 优雅兜底

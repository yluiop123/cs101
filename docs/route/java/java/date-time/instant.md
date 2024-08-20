# Instant

## Instant
`Instant`类
日期时间 API 的核心类之一是`Instant`类，它表示时间线上纳秒的开始。这个类对于生成表示机器时间的时间戳非常有用。
```java
Instant timestamp = Instant.now(); 
```
从`Instant`类返回的值从 1970 年 1 月 1 日的第一秒（1970 - 01 - 01T00:00:00Z）开始计算时间，也称为`EPOCH`。在纪元之前发生的瞬间具有负值，在纪元之后发生的瞬间具有正值。
`Instant`类提供的其他常量是`MIN`，表示最小可能的（遥远过去）瞬间，和`MAX`，表示最大的（遥远未来）瞬间。
对`Instant`调用`toString()`会产生如下输出：
```
2013 - 05 - 30T23:38:23.085Z
```
此格式遵循 ISO - 8601 标准来表示日期和时间。
`Instant`类提供了各种方法来操作`Instant`。有`plus()`和`minus()`方法用于添加或减去时间。以下代码将当前时间增加 1 小时：
```java
Instant oneHourLater = Instant.now().plus(1, ChronoUnit.HOURS);
```
有用于比较瞬间的方法，如`isAfter()`和`isBefore()`。`until()`方法返回两个`Instant`对象之间存在的时间量。以下代码行报告自 Java 纪元开始以来发生了多少秒。
```java
long secondsFromEpoch = Instant.ofEpochSecond(0L).until(Instant.now(), ChronoUnit.SECONDS);
```
`Instant`类不处理人类时间单位，如年、月或日。如果您想以这些单位进行计算，可以将`Instant`转换为其他类，如`LocalDateTime`或`ZonedDateTime`，通过将`Instant`与时区绑定。然后，您可以以所需的单位访问该值。以下代码使用`ofInstant()`方法和默认时区将`Instant`转换为`LocalDateTime`对象，然后以更可读的形式打印出日期和时间：
```java
Instant timestamp; 

LocalDateTime ldt = LocalDateTime.ofInstant(timestamp, ZoneId.systemDefault()); 
System.out.printf("%s %d %d at %d:%d%n", ldt.getMonth(), ldt.getDayOfMonth(), 
                  ldt.getYear(), ldt.getHour(), ldt.getMinute()); 
```
输出将类似于以下内容：
```
MAY 30 2021 at 18:21
```
`ZonedDateTime`或`OffsetDateTime`对象可以转换为`Instant`对象，因为它们都映射到时间线上的精确时刻。然而，反之则不然。要将`Instant`对象转换为`ZonedDateTime`或`OffsetDateTime`对象，需要提供时区或时区偏移信息。
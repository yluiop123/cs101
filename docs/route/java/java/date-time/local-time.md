# 日期和时间

## 日期和时间

### `LocalTime`类
`LocalTime`类与其他以`Local`为前缀的类类似，但仅处理时间。这个类对于表示基于人类的一天中的时间非常有用，例如电影时间或当地图书馆的开放和关闭时间。它也可以用于创建数字时钟，如以下示例所示：
```java
LocalTime thisSec; 

for (; ; ) { 
    thisSec = LocalTime.now(); 

    // 显示代码的实现留给读者
    display(thisSec.getHour(), thisSec.getMinute(), thisSec.getSecond());
} 
```
`LocalTime`类不存储时区或夏令时信息。

### `LocalDateTime`类
处理日期和时间（不带时区）的类是`LocalDateTime`，它是日期时间 API 的核心类之一。这个类用于表示日期（月 - 日 - 年）和时间（时 - 分 - 秒 - 纳秒）的组合，实际上是`LocalDate`和`LocalTime`的组合。这个类可以用于表示特定事件，例如 2013 年 8 月 17 日下午 1:10 开始的美洲杯挑战者系列赛中路易威登杯决赛的第一场比赛。请注意，这意味着当地时间下午 1:10。要包含时区，您必须使用`ZonedDateTime`或`OffsetDateTime`，如“时区和偏移类”中所讨论的。
除了每个基于时间的类提供的`now()`方法外，`LocalDateTime`类还有各种`of()`方法（或以`of`为前缀的方法）来创建`LocalDateTime`的实例。有一个`from()`方法可以将其他时间格式的实例转换为`LocalDateTime`实例。还有用于添加或减去小时、分钟、天、周和月的方法。以下示例展示了其中的一些方法：
```java
System.out.printf("now: %s%n", LocalDateTime.now()); 

System.out.printf("Apr 15, 1994 @ 11:30am: %s%n", 
                  LocalDateTime.of(1994, Month.APRIL, 15, 11, 30)); 

System.out.printf("now (from Instant): %s%n", 
                  LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault())); 

System.out.printf("6 months from now: %s%n", 
                  LocalDateTime.now().plusMonths(6)); 

System.out.printf("6 months ago: %s%n", 
                  LocalDateTime.now().minusMonths(6)); 
```
此代码生成的输出将类似于以下内容：
```
now: 2013 - 07 - 24T17:13:59.985
Apr 15, 1994 @ 11:30am: 1994 - 04 - 15T11:30
now (from Instant): 2013 - 07 - 24T17:14:00.479
6 months from now: 2014 - 01 - 24T17:14:00.480
6 months ago: 2013 - 01 - 24T17:14:00.481
```
# 遗留日期时间代码

## 遗留日期时间代码
在 Java SE 8 发布之前，Java 的日期和时间机制由`java.util.Date`、`java.util.Calendar`和`java.util.TimeZone`类以及它们的子类（如`java.util.GregorianCalendar`）提供。这些类有几个缺点，包括：
- `Calendar`类不是类型安全的。
- 由于这些类是可变的，它们不能在多线程应用程序中使用。
- 由于月份编号不寻常和缺乏类型安全性，应用程序代码中的错误很常见。

### 与遗留代码的互操作性
也许您有使用`java.util`日期和时间类的遗留代码，并且您希望在对代码进行最小更改的情况下利用`java.time`的功能。
在 JDK 8 中添加了几个方法，允许在`java.util`和`java.time`对象之间进行转换：
- `Calendar.toInstant()`将`Calendar`对象转换为`Instant`。
- `GregorianCalendar.toZonedDateTime()`将`GregorianCalendar`实例转换为`ZonedDateTime`。
- `GregorianCalendar.from(ZonedDateTime)`使用默认区域设置从`ZonedDateTime`实例创建`GregorianCalendar`对象。
- `Date.from(Instant)`从`Instant`创建`Date`对象。
- `Date.toInstant()`将`Date`对象转换为`Instant`。
- `TimeZone.toZoneId()`将`TimeZone`对象转换为`ZoneId`。

以下示例将`Calendar`实例转换为`ZonedDateTime`实例。请注意，从`Instant`转换为`ZonedDateTime`时必须提供时区：
```java
Calendar now = Calendar.getInstance();
ZonedDateTime zdt = ZonedDateTime.ofInstant(now.toInstant(), ZoneId.systemDefault());
```

以下示例展示了`Date`和`Instant`之间的转换：
```java
Instant inst = date.toInstant(); 

Date newDate = Date.from(inst); 
```

以下示例将`GregorianCalendar`转换为`ZonedDateTime`，然后将`ZonedDateTime`转换为`GregorianCalendar`。其他基于时间的类使用`ZonedDateTime`实例创建：
```java
GregorianCalendar cal =...; 

TimeZone tz = cal.getTimeZone(); 
int tzoffset = cal.get(Calendar.ZONE_OFFSET); 

ZonedDateTime zdt = cal.toZonedDateTime(); 

GregorianCalendar newCal = GregorianCalendar.from(zdt); 

LocalDateTime ldt = zdt.toLocalDateTime(); 
LocalDate date = zdt.toLocalDate();
LocalTime time = zdt.toLocalTime();
```

### 将遗留日期和时间功能映射到日期时间 API
由于 Java SE 8 中对日期和时间的 Java 实现进行了完全重新设计，您不能将一个方法替换为另一个方法。如果您想使用`java.time`包提供的丰富功能，最简单的解决方案是使用上一节中列出的`toInstant()`或`toZonedDateTime()`方法。但是，如果您不想使用这种方法或它不能满足您的需求，则必须重写您的日期时间代码。
“概述”页面上介绍的表格是开始评估哪些`java.time`类满足您需求的好地方。
两个 API 之间没有一对一的映射对应关系，但以下表格让您大致了解`java.util`日期和时间类中的哪些功能映射到`java.time` API。

### 遗留`Date`和`Instant`的对应关系
`Instant`和`Date`类相似。每个类：
- 表示时间线上的瞬时点（UTC）
- 保存与时区无关的时间
- 表示为纪元秒（自 1970 - 01 - 01T00:00:00Z 起）加纳秒

`Date.from(Instant)`和`Date.toInstant()`方法允许在这些类之间进行转换。

### `GregorianCalendar`和`ZonedDateTime`的对应关系
`ZonedDateTime`类是`GregorianCalendar`的替代品。它提供了以下类似的功能。人类时间表示如下：
- `LocalDate`：年、月、日
- `LocalTime`：小时、分钟、秒、纳秒
- `ZoneId`：时区
- `ZoneOffset`：当前与 GMT 的偏移量

`GregorianCalendar.from(ZonedDateTime)`和`GregorianCalendar.toZonedDateTime()`方法有助于在这些类之间进行转换。

### 遗留`TimeZone`和`ZoneId`或`ZoneOffset`的对应关系
`ZoneId`类指定时区标识符，并可以访问每个时区使用的规则。`ZoneOffset`类仅指定与格林威治/UTC 的偏移量。有关更多信息，请参阅“时区和偏移类”。

### `GregorianCalendar`（日期设置为 1970 - 01 - 01）和`LocalTime`的对应关系
在`GregorianCalendar`实例中将日期设置为 1970 - 01 - 01 以使用时间组件的代码可以替换为`LocalTime`实例。

### `GregorianCalendar`（时间设置为 00:00）和`LocalDate`的对应关系
在`GregorianCalendar`实例中将时间设置为 00:00 以使用日期组件的代码可以替换为`LocalDate`实例。（这种`GregorianCalendar`方法存在缺陷，因为由于过渡到夏令时，一些国家每年有一次不会出现午夜。）

### 日期和时间格式化
尽管`java.time.format.DateTimeFormatter`提供了一种强大的机制来格式化日期和时间值，但您也可以使用`java.time`基于时间的类直接与`java.util.Formatter`和`String.format()`一起使用，使用与`java.util`日期和时间类相同的基于模式的格式化。
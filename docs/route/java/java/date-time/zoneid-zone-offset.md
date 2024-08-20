# 时区和偏移

## 时区和偏移

### 时区和偏移
时区是地球上使用相同标准时间的区域。每个时区由一个标识符描述，通常具有格式`region/city`（如`Asia/Tokyo`）和与格林威治/UTC 时间的偏移量。例如，东京的偏移量是`+09:00`。

### `ZoneId`和`ZoneOffset`类
日期时间 API 提供了两个类来指定时区或偏移：
- `ZoneId`指定时区标识符，并提供在`Instant`和`LocalDateTime`之间进行转换的规则。
- `ZoneOffset`指定与格林威治/UTC 时间的时区偏移量。

格林威治/UTC 时间的偏移量通常以整小时定义，但也有例外。以下代码打印所有使用非整小时偏移量的时区列表。
```java
Set<String> allZones = ZoneId.getAvailableZoneIds(); 
LocalDateTime dt = LocalDateTime.now(); 

// 使用时区集合创建列表并进行排序
List<String> zoneList = new ArrayList<>(allZones).sort(); 

for (String zone : zoneList) { 
    ZoneId zone = ZoneId.of(zone); 
    ZonedDateTime zdt = dt.atZone(zone); 
    ZoneOffset offset = zdt.getOffset(); 
    int secondsOfHour = offset.getTotalSeconds() % (60 * 60); 
    String out = String.format("%35s %10s%n", zone, offset); 

    // 仅将非整小时偏移的时区写入标准输出
    if (secondsOfHour!= 0) { 
        System.out.printf(out); 
    }
} 
```
此示例将以下列表打印到标准输出：
```
      America/Caracas     -04:30
     America/St_Johns     -02:30
        Asia/Calcutta     +05:30
         Asia/Colombo     +05:30
           Asia/Kabul     +04:30
       Asia/Kathmandu     +05:45
        Asia/Katmandu     +05:45
         Asia/Kolkata     +05:30
         Asia/Rangoon     +06:30
          Asia/Tehran     +04:30
   Australia/Adelaide     +09:30
Australia/Broken_Hill     +09:30
     Australia/Darwin     +09:30
      Australia/Eucla     +08:45
        Australia/LHI     +10:30
  Australia/Lord_Howe     +10:30
      Australia/North     +09:30
      Australia/South     +09:30
 Australia/Yancowinna     +09:30
  Canada/Newfoundland     -02:30
         Indian/Cocos     +06:30
                 Iran     +04:30
              NZ-CHAT     +12:45
      Pacific/Chatham     +12:45
    Pacific/Marquesas     -09:30
      Pacific/Norfolk     +11:30
```

### 日期时间类
日期时间 API 提供了三个与时区相关的基于时间的类：
- `ZonedDateTime`处理具有相应时区和格林威治/UTC 时区偏移的日期和时间。
- `OffsetDateTime`处理具有相应格林威治/UTC 时区偏移的日期和时间，但没有时区 ID。
- `OffsetTime`处理具有相应格林威治/UTC 时区偏移的时间，但没有时区 ID。

何时使用`OffsetDateTime`而不是`ZonedDateTime`？如果您正在编写基于地理位置的日期和时间计算规则的复杂软件，或者如果您在数据库中存储仅跟踪与格林威治/UTC 时间的绝对偏移的时间戳，那么您可能想要使用`OffsetDateTime`。此外，XML 和其他网络格式将日期时间传输定义为`OffsetDateTime`或`OffsetTime`。

尽管所有三个类都维护与格林威治/UTC 时间的偏移量，但只有`ZonedDateTime`使用`ZoneRules`（`java.time.zone`包的一部分）来确定特定时区的偏移量如何变化。例如，大多数时区在将时钟向前调整为夏令时时会出现间隔（通常为 1 小时），在将时钟向后调整为标准时间时会出现时间重叠，并且过渡前的最后一小时会重复。`ZonedDateTime`类适应这种情况，而无法访问`ZoneRules`的`OffsetDateTime`和`OffsetTime`类则不适应。

### `ZonedDateTime`类
`ZonedDateTime`类实际上将`LocalDateTime`类与`ZoneId`类结合在一起。它用于表示完整的日期（年、月、日）和时间（时、分、秒、纳秒）以及时区（区域/城市，如`Europe/Paris`）。

以下代码将从旧金山到东京的航班出发时间定义为`America/Los_Angeles`时区的`ZonedDateTime`。使用`withZoneSameInstant()`和`plusMinutes()`方法创建表示航班飞行 650 分钟后预计到达东京时间的`ZonedDateTime`实例。`ZoneRules.isDaylightSavings()`方法确定航班到达东京时是否为夏令时。
```java
DateTimeFormatter format = DateTimeFormatter.ofPattern("MMM d yyyy  hh:mm a"); 

// 于 2013 年 7 月 20 日晚上 7:30 从旧金山出发
LocalDateTime leaving = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
ZoneId leavingZone = ZoneId.of("America/Los_Angeles");  
ZonedDateTime departure = ZonedDateTime.of(leaving, leavingZone); 

try { 
    String out1 = departure.format(format); 
    System.out.printf("LEAVING:  %s (%s)%n", out1, leavingZone); 
} catch (DateTimeException exc) { 
    System.out.printf("%s can't be formatted!%n", departure); 
    throw exc; 
} 

// 飞行时间为 10 小时 50 分钟，即 650 分钟
ZoneId arrivingZone = ZoneId.of("Asia/Tokyo");  
ZonedDateTime arrival = departure.withZoneSameInstant(arrivingZone) 
                                .plusMinutes(650); 

try { 
    String out2 = arrival.format(format); 
    System.out.printf("ARRIVING: %s (%s)%n", out2, arrivingZone);
} catch (DateTimeException exc) { 
    System.out.printf("%s can't be formatted!%n", arrival); 
    throw exc; 
} 

if (arrivingZone.getRules().isDaylightSavings(arrival.toInstant())) { 
    System.out.printf("  (%s daylight saving time will be in effect.)%n", 
        arrivingZone); 
} else{ 
    System.out.printf("  (%s standard time will be in effect.)%n", 
        arrivingZone); 
} 
```
此代码产生以下输出：
```
LEAVING:  Jul 20 2013  07:30 PM (America/Los_Angeles) 
ARRIVING: Jul 21 2013  10:20 PM (Asia/Tokyo) 
  (Asia/Tokyo standard time  will be in effect.) 
```

### `OffsetDateTime`类
`OffsetDateTime`类实际上将`LocalDateTime`类与`ZoneOffset`类结合在一起。它用于表示完整的日期（年、月、日）和时间（时、分、秒、纳秒）以及与格林威治/UTC 时间的偏移量（+/-小时:分钟，如+06:00 或 -08:00）。

以下示例使用`OffsetDateTime`和`TemporalAdjusters.lastInMonth()`方法查找 2013 年 7 月的最后一个星期四。
```java
// 查找 2013 年 7 月的最后一个星期四
LocalDateTime localDate = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
ZoneOffset offset = ZoneOffset.of("-08:00"); 

OffsetDateTime offsetDate = OffsetDateTime.of(localDate, offset);
OffsetDateTime lastThursday = 
    offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.THURSDAY)); 
System.out.printf("The last Thursday in July 2013 is the %sth.%n", 
                  lastThursday.getDayOfMonth()); 
```
运行此代码的输出为：
```
The last Thursday in July 2013 is the 25th.
```

### `OffsetTime`类
`OffsetTime`类实际上将`LocalTime`类与`ZoneOffset`类结合在一起。它用于表示具有与格林威治/UTC 时间偏移量（+/-小时:分钟，如+06:00 或 -08:00）的时间（时、分、秒、纳秒）。

`OffsetTime`类在与`OffsetDateTime`类相同的情况下使用，但在不需要跟踪日期时。
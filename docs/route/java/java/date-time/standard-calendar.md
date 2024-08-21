# 标准日历

## 标准日历

### 标准日历
表示时间有两种基本方式。一种方式是以人类的术语表示时间，称为人类时间，如年、月、日、时、分和秒。另一种方式，机器时间，以纳秒分辨率从一个原点（称为纪元）沿着时间线连续测量时间。日期时间包提供了丰富的类来表示日期和时间。日期时间 API 中的一些类旨在表示机器时间，而其他类更适合表示人类时间。

首先确定您需要日期和时间的哪些方面，然后选择满足这些需求的类。在选择基于时间的类时，您首先决定是需要表示人类时间还是机器时间。然后确定需要表示时间的哪些方面。您需要时区吗？日期和时间？仅日期？如果需要日期，您需要月、日和年，还是子集？

术语：在本节中，日期时间 API 中捕获和处理日期或时间值的类，如`Instant`、`LocalDateTime`和`ZonedDateTime`，被称为基于时间的类（或类型）。支持类型，如`TemporalAdjuster`接口或`DayOfWeek`枚举，不包括在此定义中。

例如，您可能使用`LocalDate`对象来表示出生日期，因为大多数人在同一天庆祝生日，无论他们是在出生城市还是在国际日期变更线的另一侧的全球各地。如果您正在跟踪占星术时间，那么您可能想要使用`LocalDateTime`对象来表示出生日期和时间，或者`ZonedDateTime`，它还包括时区。如果您正在创建时间戳，那么您很可能想要使用`Instant`，它允许您将时间线上的一个瞬时点与另一个进行比较。

以下表格总结了`java.time`包中存储日期和/或时间信息或可用于测量时间量的基于时间的类。列中的复选标记表示该类使用该特定类型的数据，`toString()`输出列显示使用`toString()`方法打印的实例。“在哪里讨论”列将您链接到教程中的相关页面。
|类或枚举|内容|`toString()`输出|在哪里讨论|
|---|---|---|---|
|`Instant`|秒（1）|`2013 - 08 - 20T15:16:26.355Z`|Instant 类|
|`LocalDate`|年、月、日|`2013 - 08 - 20`|日期类|
|`LocalDateTime`|年、月、日、时、分、秒|`2013 - 08 - 20T08:16:26.937`|日期和时间类|
|`ZonedDateTime`|年、月、日、时、分、秒、时区偏移、时区 ID|`2013 - 08 - 21T00:16:26.941 + 09:00[Asia/Tokyo]`|时区和偏移类|
|`LocalTime`|时、分、秒|`08:16:26.943`|日期和时间类|
|`MonthDay`|月、日|`-- 08 - 20`|日期类|
|`Year`|年|`2013`|日期类|
|`YearMonth`|年、月|`2013 - 08`|日期类|
|`Month`|月|`AUGUST`|DayOfWeek 和 Month 枚举|
|`OffsetDateTime`|年、月、日、时、分、秒、时区偏移|`2013 - 08 - 20T08:16:26.954 - 07:00`|时区和偏移类|
|`OffsetTime`|时、分、秒、时区偏移|`08:16:26.957 - 07:00`|时区和偏移类|
|`Duration`|天（2）、时（2）、分（2）、秒|`PT20H`（20 小时）|Period 和 Duration|
|`Period`|年、月、天（3）|`P10D`（10 天）|Period 和 Duration|
|` `| ` `| ` `| ` `|

注意：
（1）：秒以纳秒精度捕获。
（2）：此类不存储此信息，但具有以这些单位提供时间的方法。
（3）：当将 Period 添加到`ZonedDateTime`时，会观察到夏令时或其他本地时间差异。
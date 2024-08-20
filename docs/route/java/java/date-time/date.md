# Date

## Date
日期时间 API 提供了四个专门处理日期信息的类，不考虑时间或时区。这些类的用途可以从类名中看出：`LocalDate`、`YearMonth`、`MonthDay`和`Year`。

### `LocalDate`类
`LocalDate`表示 ISO 日历中的年 - 月 - 日，用于表示没有时间的日期。您可以使用`LocalDate`来跟踪重要事件，如出生日期或婚礼日期。以下示例使用`of`和`with`方法创建`LocalDate`的实例：
```java
LocalDate date = LocalDate.of(2000, Month.NOVEMBER, 20); 
LocalDate nextWed = date.with(TemporalAdjusters.next(DayOfWeek.WEDNESDAY)); 
```
有关`TemporalAdjuster`接口的更多信息，请参阅“时间调整器”部分。
除了常用方法外，`LocalDate`类还提供了获取给定日期信息的 getter 方法。`getDayOfWeek()`方法返回特定日期所在的星期几。例如，以下代码行返回“MONDAY”：
```java
DayOfWeek dotw = LocalDate.of(2012, Month.JULY, 9).getDayOfWeek();
```
以下示例使用`TemporalAdjuster`来检索特定日期后的第一个星期三。
```java
LocalDate date = LocalDate.of(2000, Month.NOVEMBER, 20); 
TemporalAdjuster adj = TemporalAdjusters.next(DayOfWeek.WEDNESDAY); 
LocalDate nextWed = date.with(adj);
System.out.printf("对于日期 %s，下一个星期三是 %s。%n", date, nextWed);
```
运行此代码将产生以下输出：
```
对于日期 2000 - 11 - 20，下一个星期三是 2000 - 11 - 22。
```
“Period 和 Duration”部分也有使用`LocalDate`类的示例。

### `YearMonth`类
`YearMonth`类表示特定年份的月份。以下示例使用`lengthOfMonth()`方法确定几个年份和月份组合的天数。
```java
YearMonth date = YearMonth.now();
System.out.printf("%s: %d%n", date, date.lengthOfMonth()); 

YearMonth date2 = YearMonth.of(2010, Month.FEBRUARY);
System.out.printf("%s: %d%n", date2, date2.lengthOfMonth()); 

YearMonth date3 = YearMonth.of(2012, Month.FEBRUARY);
System.out.printf("%s: %d%n", date3, date3.lengthOfMonth());
```
此代码的输出如下所示：
```
2013 - 06: 30
2010 - 02: 28
2012 - 02: 29
```

### `MonthDay`类
`MonthDay`类表示特定月份的某一天，例如 1 月 1 日的元旦。
以下示例使用`isValidYear()`方法确定 2010 年 2 月 29 日是否有效。该调用返回`false`，确认 2010 年不是闰年。
```java
MonthDay date = MonthDay.of(Month.FEBRUARY, 29);
boolean validLeapYear = date.isValidYear(2010); 
```

### `Year`类
`Year`类表示一年。以下示例使用`isLeap()`方法确定给定年份是否为闰年。该调用返回`true`，确认 2012 年是闰年。
```java
boolean validLeapYear = Year.of(2012).isLeap(); 
```
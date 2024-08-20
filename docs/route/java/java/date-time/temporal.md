# Temporal 包

## Temporal 包
`java.time.temporal`包提供了一组接口、类和枚举，支持日期和时间代码，特别是日期和时间计算。

### `Temporal`和`TemporalAccessor`
`Temporal`接口为访问基于时间的对象提供了一个框架，并由基于时间的类实现，如`Instant`、`LocalDateTime`和`ZonedDateTime`。这个接口提供了添加或减去时间单位的方法，使得跨各种日期和时间类的基于时间的算术变得容易和一致。`TemporalAccessor`接口提供了`Temporal`接口的只读版本。

`Temporal`和`TemporalAccessor`对象都是根据`TemporalField`接口中指定的字段来定义的。`ChronoField`枚举是`TemporalField`接口的具体实现，并提供了丰富的定义常量，如`DAY_OF_WEEK`、`MINUTE_OF_HOUR`和`MONTH_OF_YEAR`。

这些字段的单位由`TemporalUnit`接口指定。`ChronoUnit`枚举实现了`TemporalUnit`接口。字段`ChronoField.DAY_OF_WEEK`是`ChronoUnit.DAYS`和`ChronoUnit.WEEKS`的组合。`ChronoField`和`ChronoUnit`枚举将在以下部分讨论。

`Temporal`接口中基于算术的方法需要根据`TemporalAmount`值定义的参数。`Period`和`Duration`类（在“Period 和 Duration”中讨论）实现了`TemporalAmount`接口。

### `ChronoField`和`IsoFields`
实现了`TemporalField`接口的`ChronoField`枚举提供了一组丰富的常量来访问日期和时间值。一些例子是`CLOCK_HOUR_OF_DAY`、`NANO_OF_DAY`和`DAY_OF_YEAR`。这个枚举可以用来表达时间的概念方面，例如一年的第三周、一天的第 11 小时或一个月的第一个星期一。当遇到未知类型的`Temporal`时，可以使用`TemporalAccessor.isSupported(TemporalField)`方法来确定`Temporal`是否支持特定的字段。以下代码行返回`false`，表明`LocalDate`不支持`ChronoField.CLOCK_HOUR_OF_DAY`：
```java
boolean isSupported = LocalDate.now().isSupported(ChronoField.CLOCK_HOUR_OF_DAY);
```

`IsoFields`类中定义了特定于 ISO - 8601 日历系统的其他字段。以下示例展示了如何使用`ChronoField`和`IsoFields`获取字段的值：
```java
time.get(ChronoField.MILLI_OF_SECOND) 
int qoy = date.get(IsoFields.QUARTER_OF_YEAR); 
```

另外两个类`WeekFields`和`JulianFields`定义了可能有用的其他字段。

### `ChronoUnit`
`ChronoUnit`枚举实现了`TemporalUnit`接口，并提供了一组基于日期和时间的标准单位，从毫秒到千年。请注意，并非所有的`ChronoUnit`对象都被所有类支持。例如，`Instant`类不支持`ChronoUnit.MONTHS`或`ChronoUnit.YEARS`。日期时间 API 中的类包含`isSupported(TemporalUnit)`方法，可用于验证一个类是否支持特定的时间单位。以下对`isSupported()`的调用返回`false`，确认`Instant`类不支持`ChronoUnit.DAYS`：
```java
Instant instant = Instant.now(); 
boolean isSupported = instant.isSupported(ChronoUnit.DAYS);
```

### TemporalAdjuster
`java.time.temporal`包中的`TemporalAdjuster`接口提供了一些方法，这些方法接受一个`Temporal`值并返回一个调整后的值。调整器可以与任何基于时间的类型一起使用。

如果调整器与`ZonedDateTime`一起使用，则会计算一个新的日期，同时保留原始的时间和时区值。

#### 预定义调整器
`TemporalAdjusters`类（注意是复数）提供了一组预定义的调整器，用于查找一个月的第一天或最后一天、一年的第一天或最后一天、一个月的最后一个星期三或特定日期后的第一个星期二等。预定义的调整器被定义为静态方法，并设计为与静态导入语句一起使用。

以下示例使用了几个`TemporalAdjusters`方法，结合基于时间的类中定义的`with`方法，根据原始日期 2000 年 10 月 15 日计算新的日期：
```java
LocalDate date = LocalDate.of(2000, Month.OCTOBER, 15); 
DayOfWeek dotw = date.getDayOfWeek(); 
System.out.printf("%s is on a %s%n", date, dotw); 

System.out.printf("first day of Month: %s%n", 
                  date.with(TemporalAdjusters.firstDayOfMonth())); 
System.out.printf("first Monday of Month: %s%n", 
                  date.with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY))); 
System.out.printf("last day of Month: %s%n", 
                  date.with(TemporalAdjusters.lastDayOfMonth()));
System.out.printf("first day of next Month: %s%n", 
                  date.with(TemporalAdjusters.firstDayOfNextMonth()));
System.out.printf("first day of next Year: %s%n", 
                  date.with(TemporalAdjusters.firstDayOfNextYear())); 
System.out.printf("first day of Year: %s%n", 
                  date.with(TemporalAdjusters.firstDayOfYear()));
```
此代码产生以下输出：
```
2000 - 10 - 15 is on a SUNDAY
first day of Month: 2000 - 10 - 01
first Monday of Month: 2000 - 10 - 02
last day of Month: 2000 - 10 - 31
first day of next Month: 2000 - 11 - 01
first day of next Year: 2001 - 01 - 01
first day of Year: 2000 - 01 - 01
```

#### 自定义调整器
您还可以创建自己的自定义调整器。为此，您创建一个类，该类实现`TemporalAdjuster`接口，并具有`adjustInto(Temporal)`方法。下面的示例是自定义调整器`PaydayAdjuster`。它评估传入的日期并返回下一个发薪日，假设发薪日每月发生两次：在 15 日和当月的最后一天。如果计算出的日期在周末，则使用前一个星期五。假设当前为日历年度。
```java
public class PaydayAdjuster implements TemporalAdjuster { 
    /**
     * adjustInto 方法接受一个 Temporal 实例
     * 并返回一个调整后的 LocalDate。如果传入的
     * 参数不是 LocalDate，则抛出 DateTimeException。
     */ 
    public Temporal adjustInto(Temporal input) { 
        LocalDate date = LocalDate.from(input); 
        int day; 
        if (date.getDayOfMonth() < 15) { 
            day = 15; 
        } else { 
            day = date.with(TemporalAdjusters.lastDayOfMonth()).getDayOfMonth(); 
        } 
        date = date.withDayOfMonth(day); 
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || 
                date.getDayOfWeek() == DayOfWeek.SUNDAY) { 
            date = date.with(TemporalAdjusters.previous(DayOfWeek.FRIDAY)); 
        } 

        return input.with(date); 
    }
} 
```
调整器的调用方式与预定义调整器相同，使用`with()`方法。让我们考虑以下示例：
```java
LocalDate nextPayday = date.with(new PaydayAdjuster());
```
在 2013 年，6 月 15 日和 6 月 30 日都在周末。使用 2013 年 6 月 3 日和 6 月 18 日的相应日期运行前面的示例，得到以下结果：
```
Given the date:  2013 Jun 3 
the next payday: 2013 Jun 14 

Given the date:  2013 Jun 18 
the next payday: 2013 Jun 28
```

### 时间查询
`TemporalQuery`可用于从基于时间的对象中检索信息。

#### 预定义查询
`TemporalQueries`类（注意是复数）提供了几个预定义的查询，包括在应用程序无法识别基于时间的对象类型时非常有用的方法。与调整器一样，预定义的查询被定义为静态方法，并设计为与静态导入语句一起使用。

例如，精度查询返回特定基于时间的对象可以返回的最小`ChronoUnit`。以下示例在几种类型的基于时间的对象上使用精度查询：
```java
TemporalQuery<TemporalUnit> query = TemporalQueries.precision(); 
System.out.printf("LocalDate precision is %s%n", 
                  LocalDate.now().query(query));
System.out.printf("LocalDateTime precision is %s%n", 
                  LocalDateTime.now().query(query)); 
System.out.printf("Year precision is %s%n", 
                  Year.now().query(query));
System.out.printf("YearMonth precision is %s%n", 
                  YearMonth.now().query(query));
System.out.printf("Instant precision is %s%n", 
                  Instant.now().query(query));
```
输出如下所示：
```
LocalDate precision is Days
LocalDateTime precision is Nanos
Year precision is Years
YearMonth precision is Months
Instant precision is Nanos
```

#### 自定义查询
您还可以创建自己的自定义查询。一种方法是创建一个类，该类实现`TemporalQuery`接口，并具有`queryFrom(TemporalAccessor)`方法。下面是在`FamilyVacations`类中实现的第一个自定义查询，该类实现了`TemporalQuery`接口。`queryFrom()`方法将传入的日期与计划的假期日期进行比较，如果在这些日期范围内，则返回`true`。
```java
public class FamilyVacations implements TemporalQuery<Boolean> { 
    // 返回 true 如果传入的日期在家庭假期之一期间。因为查询仅比较月份和日期，
    // 即使 Temporal 类型不同，检查也会成功。
    public Boolean queryFrom(TemporalAccessor date) { 
        int month = date.get(ChronoField.MONTH_OF_YEAR); 
        int day = date.get(ChronoField.DAY_OF_MONTH); 

        // 春假期间的迪士尼乐园
        if ((month == Month.APRIL.getValue()) && ((day >= 3) && (day <= 8))) 
            return Boolean.TRUE; 

        // 在萨加塔克湖的史密斯家庭团聚
        if ((month == Month.AUGUST.getValue()) && ((day >= 8) && (day <= 14))) 
            return Boolean.TRUE; 

        return Boolean.FALSE; 
    }
} 
```
您可以使用以下模式使用此`TemporalQuery`：
```java
// 定义一个年、月和日
LocalDate = date = LocalDate.of(year, month, day);
boolean isFamilyVacation = date.query(new FamilyVacations());
```
第二个自定义查询在`FamilyBirthdays`类中实现。这个类提供了一个`isFamilyBirthday()`方法，该方法将传入的日期与几个生日进行比较，如果匹配，则返回`TRUE`。
```java
public class FamilyBirthdays { 
    // 返回 true 如果传入的日期与家庭生日之一相同。因为查询仅比较月份和日期，
    // 即使 Temporal 类型不同，检查也会成功。
    public static Boolean isFamilyBirthday(TemporalAccessor date) { 
        int month = date.get(ChronoField.MONTH_OF_YEAR); 
        int day = date.get(ChronoField.DAY_OF_MONTH); 

        // Angie 的生日是 4 月 3 日。
        if ((month == Month.APRIL.getValue()) && (day == 3)) 
            return Boolean.TRUE; 

        // Sue 的生日是 6 月 18 日。
        if ((month == Month.JUNE.getValue()) && (day == 18)) 
            return Boolean.TRUE; 

        // Joe 的生日是 5 月 29 日。
        if ((month == Month.MAY.getValue()) && (day == 29)) 
            return Boolean.TRUE; 

        return Boolean.FALSE; 
    }
} 
```
`FamilyBirthday`类没有实现`TemporalQuery`接口，可以作为 lambda 表达式的一部分使用。以下代码展示了如何调用这两个自定义查询。
```java
// 不使用 lambda 表达式调用查询。
Boolean isFamilyVacation = date.query(new FamilyVacations()); 

// 使用 lambda 表达式调用查询。
Boolean isFamilyBirthday = date.query(FamilyBirthdays::isFamilyBirthday); 

if (isFamilyVacation.booleanValue() || isFamilyBirthday.booleanValue()) 
    System.out.printf("%s is an important date!%n", date);
else 
    System.out.printf("%s is not an important date.%n", date);
```
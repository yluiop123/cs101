# 周期和持续时间

**2022 - 01 - 27 00:00:00**

## 周期和持续时间
当您编写代码指定时间量时，请使用最能满足您需求的类或方法：`Duration`类、`Period`类或`ChronoUnit.between()`方法。`Duration`测量基于时间的值（秒、纳秒）的时间量。`Period`使用基于日期的值（年、月、日）。

注意：一天的`Duration`正好是 24 小时长。添加到`ZonedDateTime`的一天的`Period`可能会根据时区而变化。例如，如果它发生在夏令时的第一天或最后一天。

### `Duration`
`Duration`最适合用于测量基于机器的时间的情况，例如使用`Instant`对象的代码。`Duration`对象以秒或纳秒为单位测量，不使用基于日期的结构，如年、月和日，尽管该类提供了转换为天、小时和分钟的方法。如果`Duration`是使用发生在起始点之前的终点创建的，则它可以具有负值。
以下代码计算两个`Instant`之间的持续时间（以纳秒为单位）：
```java
Instant t1 =...; 
Instant t2 =...; 

long ns = Duration.between(t1, t2).toNanos();
```
以下代码向`Instant`添加 10 秒：
```java
Instant start =...; 

Duration gap = Duration.ofSeconds(10);
Instant later = start.plus(gap); 
```
`Duration`与时间线无关，因为它不跟踪时区或夏令时。向`ZonedDateTime`添加相当于 1 天的`Duration`会导致正好添加 24 小时，而不管夏令时或其他可能导致的时间差异。

### `ChronoUnit`
在“`Temporal`包”中讨论的`ChronoUnit`枚举定义了用于测量时间的单位。当您只想以单个时间单位（如天或秒）测量时间量时，`ChronoUnit.between()`方法很有用。`between()`方法适用于所有基于时间的对象，但它仅以单个单位返回时间量。以下代码计算两个时间戳之间的差距（以毫秒为单位）：
```java
Instant previous =...;
Instant current =...; 

long gap = 0L; 

current = Instant.now(); 
if (previous!= null) { 
    gap = ChronoUnit.MILLIS.between(previous, current); 
} 
```

### `Period`
要使用基于日期的值（年、月、日）定义时间量，请使用`Period`类。`Period`类提供了各种`get`方法，如`getMonths()`、`getDays()`和`getYears()`，以便您可以从周期中提取时间量。
总时间周期由所有三个单位（月、日和年）共同表示。要以单个时间单位（如天）呈现测量的时间量，可以使用`ChronoUnit.between()`方法。
以下代码报告您的年龄，假设您出生于 1960 年 1 月 1 日。`Period`类用于确定年、月和日的时间。使用`ChronoUnit.between()`方法确定的总天数显示在括号中：
```java
LocalDate today = LocalDate.now(); 
LocalDate birthday = LocalDate.of(1960, Month.JANUARY, 1); 

Period p = Period.between(birthday, today);
long p2 = ChronoUnit.DAYS.between(birthday, today); 
System.out.println("您是 " + p.getYears() + " 年，" + p.getMonths() + 
                   " 个月，和 " + p.getDays() + 
                   " 天 old. (" + p2 + " 天 total)"); 
```
代码产生类似于以下的输出：
```
您是 53 年，4 个月，和 29 天 old. (19508 天 total)
```
要计算到您下一个生日还有多长时间，您可以使用以下代码。`Period`类用于确定月和日的值。`ChronoUnit.between()`方法返回总天数的值，并显示在括号中。
```java
LocalDate birthday = LocalDate.of(1960, Month.JANUARY, 1); 

LocalDate nextBDay = birthday.withYear(today.getYear()); 

// 如果您的生日今年已经过了，将年份加 1。
if (nextBDay.isBefore(today) || nextBDay.isEqual(today)) { 
    nextBDay = nextBDay.plusYears(1); 
} 

Period p = Period.between(today, nextBDay);
long p2 = ChronoUnit.DAYS.between(today, nextBDay); 
System.out.println("还有 " + p.getMonths() + " 个月，和 " 
                   + p.getDays() + " 天直到您的下一个生日。 (" + 
                   + p2 + "  total)");
```
代码产生类似于以下的输出：
```
还有 7 个月， 和 2 天直到您的下一个生日。 (216  total)
```
这些计算不考虑时区差异。例如，如果您出生在澳大利亚，但目前住在班加罗尔，这会略微影响您确切年龄的计算。在这种情况下，结合使用`Period`和`ZonedDateTime`类。当您将`Period`添加到`ZonedDateTime`时，会考虑时间差异。
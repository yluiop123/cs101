# DayOfWeek 和 Month 枚举

## DayOfWeek 和 Month 枚举
日期时间 API 提供了用于指定一周中的天和一年中的月的枚举。

### DayOfWeek
`DayOfWeek`枚举由七个常量组成，描述一周的天：`MONDAY`到`SUNDAY`。`DayOfWeek`常量的整数值范围从 1（星期一）到 7（星期日）。使用定义的常量（`DayOfWeek.FRIDAY`）可以使您的代码更具可读性。
这个枚举还提供了许多方法，类似于基于时间的类提供的方法。例如，以下代码将 3 天添加到`MONDAY`并打印结果。输出是`THURSDAY`：
```java
System.out.printf("%s%n", DayOfWeek.MONDAY.plus(3)); 
```
通过使用`getDisplayName(TextStyle, Locale)`方法，您可以检索一个字符串来识别用户区域设置中的星期几。`TextStyle`枚举使您能够指定要显示的字符串类型：`FULL`、`NARROW`（通常是单个字母）或`SHORT`（缩写）。`STANDALONE``TextStyle`常量在某些语言中使用，其中当作为日期的一部分使用时与单独使用时的输出不同。以下示例打印`MONDAY`的三种主要`TextStyle`形式：
```java
DayOfWeek dow = DayOfWeek.MONDAY;
Locale locale = Locale.getDefault(); 
System.out.println(dow.getDisplayName(TextStyle.FULL, locale)); 
System.out.println(dow.getDisplayName(TextStyle.NARROW, locale)); 
System.out.println(dow.getDisplayName(TextStyle.SHORT, locale)); 
```
对于`en`区域设置，此代码的输出如下：
```
Monday
M
Mon
```

### Month
`Month`枚举包括十二个月的常量，`JANUARY`到`DECEMBER`。与`DayOfWeek`枚举一样，`Month`枚举是强类型的，每个常量的整数值对应于 ISO 范围从 1（一月）到 12（十二月）。使用定义的常量（`Month.SEPTEMBER`）可以使您的代码更具可读性。
`Month`枚举还包括许多方法。以下代码行使用`maxLength()`方法打印二月份的最大可能天数。输出是“29”：
```java
System.out.printf("%d%n", Month.FEBRUARY.maxLength()); 
```
`Month`枚举还实现了`getDisplayName(TextStyle, Locale)`方法，以使用指定的`TextStyle`检索一个字符串来识别用户区域设置中的月份。如果未定义特定的`TextStyle`，则返回表示常量数值的字符串。以下代码使用三种主要文本样式打印八月份：
```java
Month month = Month.AUGUST; 
Locale locale = Locale.getDefault(); 
System.out.println(month.getDisplayName(TextStyle.FULL, locale)); 
System.out.println(month.getDisplayName(TextStyle.NARROW, locale)); 
System.out.println(month.getDisplayName(TextStyle.SHORT, locale)); 
```
对于`en`区域设置，此代码的输出如下：
```
August
A
Aug
```
# 解析和格式化

## 解析和格式化
日期时间 API 中基于时间的类提供了`parse()`方法来解析包含日期和时间信息的字符串。这些类还提供了`format()`方法来格式化基于时间的对象以进行显示。在这两种情况下，过程类似：您向`DateTimeFormatter`提供一个模式来创建一个`formatter`对象。然后，这个`formatter`被传递给`parse()`或`format()`方法。
`DateTimeFormatter`类提供了许多预定义的格式化程序，或者您可以定义自己的格式化程序。
`parse()`和`format()`方法在转换过程中出现问题时会抛出异常。因此，您的解析代码应该捕获`DateTimeParseException`错误，您的格式化代码应该捕获`DateTimeException`错误。有关异常处理的更多信息，请参阅“捕获和处理异常”部分。
`DateTimeFormatter`类是不可变的且线程安全的；在适当的情况下，它可以（并且应该）被分配给一个静态常量。
版本说明：`java.time`日期时间对象可以直接与`java.util.Formatter`和`String.format()`一起使用，使用与遗留的`java.util.Date`和`java.util.Calendar`类相同的基于模式的格式化。

### 解析
`LocalDate`类中的单参数`parse(CharSequence)`方法使用`ISO_LOCAL_DATE`格式化程序。要指定不同的格式化程序，您可以使用双参数`parse(CharSequence, DateTimeFormatter)`方法。以下示例使用预定义的`BASIC_ISO_DATE`格式化程序，该程序使用格式`19590709`表示 1959 年 7 月 9 日。
```java
String in =...; 
LocalDate date = LocalDate.parse(in, DateTimeFormatter.BASIC_ISO_DATE);
```
您还可以使用自己的模式定义格式化程序。以下代码创建了一个应用格式`MMM d yyyy`的格式化程序。此格式指定三个字符表示月份，一个数字表示月份中的日期，四个数字表示年份。使用此模式创建的格式化程序将识别诸如"Jan 3 2003"或"Mar 23 1994"之类的字符串。但是，要将格式指定为`MMM dd yyyy`，其中日期使用两个字符，则您必须始终使用两个字符，对于一位数的日期用零填充："Jun 03 2003"。
```java
String input =...; 
try { 
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d yyyy"); 
    LocalDate date = LocalDate.parse(input, formatter); 
    System.out.printf("%s%n", date); 
} 
catch (DateTimeParseException exc) { 
    System.out.printf("%s is not parsable!%n", input); 
    throw exc;       // 重新抛出异常。
} 
// 'date' 已成功解析
```
`DateTimeFormatter`类的文档指定了您可以用于指定格式化或解析模式的完整符号列表。
“非 ISO 日期转换”页面上的`StringConverter`示例提供了另一个日期格式化程序的示例。

### 格式化
`format(DateTimeFormatter)`方法使用指定的格式将基于时间的对象转换为字符串表示。以下代码使用格式`MMM d yyyy hh:mm a`转换`ZonedDateTime`的实例。日期的定义方式与前面的解析示例相同，但此模式还包括小时、分钟以及上午和下午的组件。
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

if (arrivingZone.getRules().isDaylightSavings(arrival.toInstant())) 
    System.out.printf("  (%s daylight saving time will be in effect.)%n", 
                      arrivingZone); 
else 
    System.out.printf("  (%s standard time will be in effect.)%n", 
                      arrivingZone); 
```
此示例的输出，打印了到达和出发时间，如下所示：
```
LEAVING:  Jul 20 2013  07:30 PM (America/Los_Angeles) 
ARRIVING: Jul 21 2013  10:20 PM (Asia/Tokyo) 
```
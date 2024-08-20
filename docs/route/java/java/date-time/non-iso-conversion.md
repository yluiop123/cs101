# 非 ISO 日期转换

## 非 ISO 日期转换
本教程不详细讨论`java.time.chrono`包。然而，了解该包提供了几个非基于 ISO 的预定义纪年法可能会很有用，例如日本纪年法、伊斯兰历、民国纪年法和泰国佛教历。您还可以使用此包创建自己的纪年法。
本节展示如何在基于 ISO 的日期和其他预定义纪年法的日期之间进行转换。

### 转换为非 ISO 日期
您可以使用`from(TemporalAccessor)`工厂方法将基于 ISO 的日期转换为其他纪年法的日期，例如`JapaneseDate.from(TemporalAccessor)`。如果该方法无法将日期转换为有效的实例，则会抛出`DateTimeException`。以下代码将`LocalDateTime`实例转换为几个预定义的非 ISO 日历日期：
```java
LocalDateTime date = LocalDateTime.of(2013, Month.JULY, 20, 19, 30); 
JapaneseDate jdate = JapaneseDate.from(date); 
HijrahDate hdate = HijrahDate.from(date); 
MinguoDate mdate = MinguoDate.from(date); 
ThaiBuddhistDate tdate = ThaiBuddhistDate.from(date);
```

以下示例将`LocalDate`转换为`ChronoLocalDate`，再转换为`String`，然后再转换回来。`toString()`方法接受一个`LocalDate`实例和一个`Chronology`，并使用提供的`Chronology`将其转换为字符串。`DateTimeFormatterBuilder`用于构建一个可用于打印日期的字符串：
```java
/**
 * 将 LocalDate（ISO）值转换为使用提供的纪年法的 ChronoLocalDate 日期，
 * 然后使用基于纪年法和当前区域设置的 SHORT 模式的 DateTimeFormatter 将
 * ChronoLocalDate 格式化为字符串。
 *
 * @param localDate - 要转换和格式化的 ISO 日期。
 * @param chrono - 可选的纪年法。如果为 null，则使用 IsoChronology。
 */
public static String toString(LocalDate localDate, Chronology chrono) { 
    if (localDate!= null) { 
        Locale locale = Locale.getDefault(Locale.Category.FORMAT); 
        ChronoLocalDate cDate; 
        if (chrono == null) { 
            chrono = IsoChronology.INSTANCE; 
        } 
        try { 
            cDate = chrono.date(localDate); 
        } catch (DateTimeException ex) { 
            System.err.println(ex); 
            chrono = IsoChronology.INSTANCE; 
            cDate = localDate; 
        } 
        DateTimeFormatter dateFormatter = 
            DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT) 
                           .withLocale(locale) 
                           .withChronology(chrono) 
                           .withDecimalStyle(DecimalStyle.of(locale)); 
        String pattern = "M/d/yyyy GGGGG"; 
        return dateFormatter.format(cDate); 
    } else { 
        return ""; 
    }
} 
```
当使用以下预定义纪年法的日期调用该方法时：
```java
LocalDate date = LocalDate.of(1996, Month.OCTOBER, 29); 
System.out.printf("%s%n", StringConverter.toString(date, JapaneseChronology.INSTANCE)); 
System.out.printf("%s%n", StringConverter.toString(date, MinguoChronology.INSTANCE)); 
System.out.printf("%s%n", StringConverter.toString(date, ThaiBuddhistChronology.INSTANCE));
System.out.printf("%s%n", StringConverter.toString(date, HijrahChronology.INSTANCE)); 
```
输出如下所示：
```
10/29/0008 H
10/29/0085 1 
10/29/2539 B.E.
6/16/1417 1 
```

### 转换为基于 ISO 的日期
您可以使用静态`LocalDate.from()`方法将非 ISO 日期转换为`LocalDate`实例，如下例所示：
```java
LocalDate date = LocalDate.from(JapaneseDate.now()); 
```
其他基于时间的类也提供此方法，如果日期无法转换，则会抛出`DateTimeException`。

以下`fromString()`方法解析包含非 ISO 日期的`String`并返回`LocalDate`实例。
```java
/**
 * 使用基于当前区域设置和提供的纪年法的短模式的 DateTimeFormatter 解析
 * 字符串为 ChronoLocalDate，然后将其转换为 LocalDate（ISO）值。
 *
 * @param text   - 预期为纪年法和当前区域设置的 SHORT 格式的输入日期文本。
 *
 * @param chrono - 可选的纪年法。如果为 null，则使用 IsoChronology。
 */
public static LocalDate fromString(String text, Chronology chrono) { 
    if (text!= null &&!text.isEmpty()) { 
        Locale locale = Locale.getDefault(Locale.Category.FORMAT); 
        if (chrono == null) { 
            chrono = IsoChronology.INSTANCE; 
        } 
        String pattern = "M/d/yyyy GGGGG"; 
        DateTimeFormatter df = new DateTimeFormatterBuilder()
                              .parseLenient() 
                              .appendPattern(pattern) 
                              .toFormatter() 
                              .withChronology(chrono) 
                              .withDecimalStyle(DecimalStyle.of(locale)); 
        TemporalAccessor temporal = df.parse(text); 
        ChronoLocalDate cDate = chrono.date(temporal); 
        return LocalDate.from(cDate); 
    } 
    return null; 
} 
```
当使用以下字符串调用该方法时：
```java
System.out.printf("%s%n", StringConverter.fromString("10/29/0008 H", JapaneseChronology.INSTANCE)); 
System.out.printf("%s%n", StringConverter.fromString("10/29/0085 1", MinguoChronology.INSTANCE)); 
System.out.printf("%s%n", StringConverter.fromString("10/29/2539 B.E.", ThaiBuddhistChronology.INSTANCE));
System.out.printf("%s%n", StringConverter.fromString("6/16/1417 1", HijrahChronology.INSTANCE)); 
```
打印的字符串都应该转换回 1996 年 10 月 29 日：
```
1996 - 10 - 29
1996 - 10 - 29
1996 - 10 - 29
1996 - 10 - 29
```
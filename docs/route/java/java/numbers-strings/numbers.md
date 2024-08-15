# 数字
这部分首先讨论了`java.lang`包中的`Number`类及其子类，以及您会使用这些类的实例化而不是原始数字类型的情况。

这部分还介绍了`PrintStream`和`DecimalFormat`类，它们提供了编写格式化数字输出的方法。

最后，讨论了`java.lang`中的`Math`类。它包含了补充语言内置运算符的数学函数。这个类有三角函数、指数函数等的方法。

当处理数字时，大多数时间您在代码中使用原始类型。例如：

```
int i = 500;
float gpa = 3.65f;
byte mask = 0x7f;
```

然而，有理由使用对象代替原始类型，Java平台为每种原始数据类型提供了包装类。这些类“包装”原始类型为对象。通常，包装是由编译器完成的——如果您在期望对象的地方使用原始类型，编译器会为您将原始类型装箱到其包装类中。类似地，如果您在期望原始类型的地方使用数字对象，编译器会为您拆箱对象。有关更多信息，请参见自动装箱和拆箱部分。

所有数字包装类都是抽象类`Number`的子类：

![Number类继承结构图](./image/01_numbers.png)

> 注意：还有四个`Number`的子类在这里没有讨论。`BigDecimal`和`BigInteger`用于高精度计算。`AtomicInteger`和`AtomicLong`用于多线程应用程序。

您可能会使用`Number`对象而不是原始类型有三个原因：

1. 作为期望对象的方法的参数（通常在操作数字集合时使用）。
2. 使用类定义的常量，例如`MIN_VALUE`和`MAX_VALUE`，它们提供数据类型的上下界。
3. 使用类方法进行值与其他原始类型之间的转换，转换为和从字符串，以及在数字系统（十进制、八进制、十六进制、二进制）之间的转换。

下表列出了所有`Number`类的子类实现的实例方法。

下述方法将此`Number`对象的值转换为返回的原始数据类型。

- `byte byteValue()`
- `short shortValue()`
- `int intValue()`
- `long longValue()`
- `float floatValue()`
- `double doubleValue()`

下述方法将此`Number`对象与参数进行比较。

- `int compareTo(Byte anotherByte)`
- `int compareTo(Double anotherDouble)`
- `int compareTo(Float anotherFloat)`
- `int compareTo(Integer anotherInteger)`
- `int compareTo(Long anotherLong)`
- `int compareTo(Short anotherShort)`
- `boolean equals(Object obj)`

方法`equals(Object obj)`确定此数字对象是否等于参数。如果参数不是`null`且是相同类型的对象，并且具有相同的数值，则这些方法返回`true`。`Double`和`Float`对象有一些额外的要求，这些要求在Java API文档中有描述。

每个`Number`类包含其他用于将数字转换为和从字符串以及在数字系统之间转换的有用方法。下表列出了`Integer`类中的这些方法。其他`Number`子类的方法类似：

| 方法 | 描述 |
| --- | --- |
| `static Integer decode(String s)` | 解码字符串为整数。可以接受十进制、八进制或十六进制数字的字符串表示形式作为输入。 |
| `static int parseInt(String s)` | 返回一个整数（仅十进制）。 |
| `static int parseInt(String s, int radix)` | 给定十进制、二进制、八进制或十六进制（基数分别为10、2、8或16）的字符串表示形式作为输入，返回一个整数。 |
| `String toString()` | 返回表示此`Integer`值的`String`对象。 |
| `static String toString(int i)` | 返回表示指定整数的`String`对象。 |
| `static Integer valueOf(int i)` | 返回一个包含指定原始值的`Integer`对象。 |
| `static Integer valueOf(String s)` | 返回一个包含指定字符串表示形式的值的`Integer`对象。 |
| `static Integer valueOf(String s, int radix)` | 返回一个包含指定字符串表示形式的整数值的`Integer`对象，使用基数的值解析。例如，如果s = "333"且基数 = 8，则该方法返回八进制数333的十进制整数等效项。 |

## 格式化数字打印输出

早些时候，您看到了使用`print`和`println`方法将字符串打印到标准输出`System.out`的用法。由于所有数字都可以转换为字符串，您可以使用这些方法打印出任意混合的字符串和数字。然而，Java编程语言还有其他方法，当数字被包含时，它们允许您对打印输出进行更多的控制。

### Printf和Format方法

`java.io`包包括一个`PrintStream`类，它有两个格式化方法，您可以使用它们来替换`print`和`println`。这些方法，`format`和`printf`，彼此等价。您一直在使用的熟悉的`System.out`恰好是一个`PrintStream`对象，所以您可以在`System.out`上调用`PrintStream`方法。因此，您可以在代码中使用`format`或`printf`的任何地方，您之前一直使用`print`或`println`。例如，

```
System.out.format(.....);
```

这两个`java.io.PrintStream`方法的语法相同：

```
public PrintStream format(String format, Object... args)
```

其中`format`是一个指定要使用的格式化的字符串，args是使用该格式化打印的变量列表。一个简单的例子是

```
System.out.format("The value of " + "the float variable is " +
     "%f, while the value of the " + "integer variable is %d, " +
     "and the string is %s", floatVar, intVar, stringVar);
```

第一个参数，`format`，是一个格式字符串，指定如何格式化第二个参数`args`中的对象。`format`字符串包含纯文本以及格式说明符，这些是特殊字符，用于格式化`Object...` args的参数。（`Object...` args的符号称为_varargs_，这意味着参数的数量可以变化。）

格式说明符以百分号（`%`）开始并以转换器结束。转换器是一个字符，表示要格式化的参数类型。在百分号（`%`）和转换器之间，您可以有可选的标志和说明符。在`java.util.Formatter`中有记录许多转换器、标志和说明符。

这里是一个基本的例子：

```
int i = 461012;
System.out.format("The value of i is: %d%n", i)
```

`%d`指定单个变量是十进制整数。`%n`是平台独立的换行符。输出是：

```
The value of i is: 461012
```

`printf`和`format`方法是重载的。每个都有以下语法的版本：

```
public PrintStream format(Locale l, String format, Object... args)
```

例如，要以法国系统打印数字（在表示浮点数时使用逗号代替英语表示中的小数点），您将使用：

```
System.out.format(Locale.FRANCE,
    "The value of the float " + "variable is %f, while the " +
    "value of the integer variable " + "is %d, and the string is %s%n",
    floatVar, intVar, stringVar);
```

### 一个例子

下表列出了一些转换器和标志，它们在随后的示例程序`TestFormat.java`中使用。

| 转换器 | 标志 | 解释 |
| --- | --- | --- |
| d | | 十进制整数。 |
| f | | 浮点数。 |
| n | | 适当的平台新行字符。您应该总是使用`%n`，而不是`\\n`。 |
| tB | | 一个日期&时间转换——地区特定的月份全名。 |
| td, te | | 一个日期&时间转换——月份的2位数字。td根据需要有前导零，te没有。 |
| ty, tY | | 一个日期&时间转换——ty = 2位年份，tY = 4位年份。 |
| tl | | 一个日期&时间转换——12小时制的小时。 |
| tM | | 一个日期&时间转换——2位分钟，必要时有前导零。 |
| tp | | 一个日期&时间转换——地区特定的上午/下午（小写）。 |
| tm | | 一个日期&时间转换——2位月份，必要时有前导零。 |
| tD | | 一个日期&时间转换——日期为%tm%td%ty |
|  | 08 | 宽度为8个字符，必要时有前导零。 |
|  | + | 包括符号，无论是正数还是负数。 |
|  | , | 包括地区特定的分组字符。 |
|  | - | 左对齐。 |
| .3 | | 小数点后三位。 |
| 10.3 | | 宽度为10个字符，右对齐，小数点后三位。 |

以下程序显示了您可以使用格式做的一些格式化。输出在嵌入的注释中用双引号显示：

```
import java.util.Calendar;
import java.util.Locale;

public class TestFormat {

    public static void main(String[] args) {
      long n = 461012;
      System.out.format("%d%n", n);      //  --\u003e  "461012"
      System.out.format("%08d%n", n);    //  --\u003e  "00461012"
      System.out.format("%+8d%n", n);    //  --\u003e  " +461012"
      System.out.format("%,8d%n", n);    // --\u003e  " 461,012"
      System.out.format("%+,8d%n%n", n); //  --\u003e  "+461,012"

      double pi = Math.PI;

      System.out.format("%f%n", pi);       // --\u003e  "3.141593"
      System.out.format("%.3f%n", pi);     // --\u003e  "3.142"
      System.out.format("%10.3f%n", pi);   // --\u003e  "     3.142"
      System.out.format("%-10.3f%n", pi);  // --\u003e  "3.142"
      System.out.format(Locale.FRANCE,
                        "%-10.4f%n%n", pi); // --\u003e  "3,1416"

      Calendar c = Calendar.getInstance();
      System.out.format("%tB %te, %tY%n", c, c, c); // --\u003e  "May 29, 2006"

      System.out.format("%tl:%tM %tp%n", c, c, c);  // --\u003e  "2:34 am"

      System.out.format("%tD%n", c);    // --\u003e  "05/29/06"
    }
}

```

> 注意：本节的讨论仅涵盖`format`和`printf`方法的基础知识。更多细节可以在本教程的“基本I/O”部分的“格式化”页面中找到。
> 使用`String.format()`创建字符串在`Strings`中介绍。

## `DecimalFormat`类

您可以使用`java.text.DecimalFormat`类来控制前导零和尾随零、前缀和后缀、分组（千位）分隔符以及小数分隔符的显示。`DecimalFormat`在数字格式化方面提供了极大的灵活性，但它可能会使您的代码更加复杂。

下面的例子通过向`DecimalFormat`构造函数传递一个模式字符串来创建一个`DecimalFormat`对象，`myFormatter`。然后由`myFormatter`调用从`NumberFormat`继承的`format`方法——它接受一个双精度值作为参数，并返回一个字符串中的格式化数字。

这里有一个示例程序，说明了`DecimalFormat`的使用：

```
import java.text.*;

public class DecimalFormatDemo {

   static public void customFormat(String pattern, double value ){
      DecimalFormat myFormatter = new DecimalFormat(pattern);
      String output = myFormatter.format(value);
      System.out.println(value + "  " + pattern + "  " + output);
   }

   static public void main(String[] args ){

      customFormat("###,###.###", 123456.789);
      customFormat("###.##", 123456.789);
      customFormat("000000.000", 123.78);
      customFormat("$###,###.###", 12345.67);
   }
}
```

输出是：

```
123456.789  ###,###.###  123,456.789
123456.789  ###.##  123456.79
123.78  000000.000  000123.780
12345.67  $###,###.###  $12,345.67
```

下表解释了每一行的输出。

| 值 | 模式 | 输出 | 解释 |
| --- | --- | --- | --- |
| 123456.789 | ###,###.### | 123,456.789 | 井号符号（`#`）表示数字，逗号是分组分隔符的占位符，点是小数分隔符的占位符。 |
| 123456.789 | ###.## | 123456.79 | `value`在小数点右侧有三位数字，但模式只有两位。格式化方法通过四舍五入来处理这个问题。 |
| 123.78 | 000000.000 | 000123.780 | `pattern`指定了前导和尾随零，因为使用了0字符而不是井号（#）。 |
| 12345.67 | $###,###.### | $12,345.67 | `pattern`的第一个字符是美元符号（`$`）。注意它紧挨着格式化的`output`中的最左边的数字。 |

## 高级运算

Java编程语言支持使用其算术运算符进行基本算术：`+`, `-`, `*`, `/`, 和 `%`。`java.lang`包中的`Math`类提供了进行更高级数学计算的方法和常量。

`Math`类中的方法都是静态的，所以您可以直接从类中调用它们，像这样：

```
Math.cos(angle);
```

> 注意：使用静态导入语言特性，您不必在每个数学函数前写`Math`：
> `import static java.lang.Math.*;`
> 这允许您通过它们的简单名称调用`Math`类方法。例如：
> `cos(angle);`

### 常量和基本方法

`Math`类包括两个常量：

- `Math.E`，自然对数的底数，以及
- `Math.PI`，圆的周长与直径的比率。

`Math`类还包括40多个静态方法。下表列出了一些基本方法。

#### 计算绝对值

- `double abs(double d)`
- `float abs(float f)`
- `int abs(int i)`
- `long abs(long lng)`

#### 四舍五入值

- `double ceil(double d)`: 返回大于或等于参数的最小整数。以`double`形式返回。
- `double floor(double d)`: 返回小于或等于参数的最大整数。以`double`形式返回。
- `double rint(double d)`: 返回最接近参数的整数。以`double`形式返回。
- `long round(double d)` 和 `int round(float f)`: 返回最接近的`long`或`int`，由方法的返回类型指示，到参数。

#### 计算最小值

- `double min(double arg1, double arg2)`
- `float min(float arg1, float arg2)`
- `int min(int arg1, int arg2)`
- `long min(long arg1, long arg2)`

#### 计算最大值

- `double max(double arg1, double arg2)`
- `float max(float arg1, float arg2)`
- `int max(int arg1, int arg2)`
- `long max(long arg1, long arg2)`

以下程序，`BasicMathDemo`，说明了如何使用这些方法中的一些：

```
public class BasicMathDemo {
    public static void main(String[] args) {
        double a = -191.635;
        double b = 43.74;
        int c = 16, d = 45;

        System.out.printf("The absolute value " + "of %.3f is %.3f%n",
                          a, Math.abs(a));

        System.out.printf("The ceiling of " + "%.2f is %.0f%n",
                          b, Math.ceil(b));

        System.out.printf("The floor of " + "%.2f is %.0f%n",
                          b, Math.floor(b));

        System.out.printf("The rint of %.2f " + "is %.0f%n",
                          b, Math.rint(b));

        System.out.printf("The max of %d and " + "%d is %d%n",
                          c, d, Math.max(c, d));

        System.out.printf("The min of of %d " + "and %d is %d%n",
                          c, d, Math.min(c, d));
    }
}
```

这个程序的输出是：

```
The absolute value of -191.635 is 191.635
The ceiling of 43.74 is 44
The floor of 43.74 is 43
The rint of 43.74 is 
44
The max of 16 and 45 is 45
The min of 16 and 45 is 16
```

### 指数和对数方法

下表列出了`Math`类的指数和对数方法。

- `double exp(double d)`: 返回自然对数的底数e，的参数次幂。
- `double log(double d)`: 返回参数的自然对数。
- `double pow(double base, double exponent)`: 返回第一个参数的第二个参数次幂的值。
- `double sqrt(double d)`: 返回参数的平方根。

以下程序，`ExponentialDemo`，显示了`e`的值，然后调用前一个表中列出的每个方法在任意选择的数字上：

```
public class ExponentialDemo {
    public static void main(String[] args) {
        double x = 11.635;
        double y = 2.76;

        System.out.printf("The value of " + "e is %.4f%n",
                          Math.E);

        System.out.printf("exp(%.3f) " + "is %.3f%n",
                          x, Math.exp(x));

        System.out.printf("log(%.3f) is " + "%.3f%n",
                          x, Math.log(x));

        System.out.printf("pow(%.3f, %.3f) " + "is %.3f%n",
                          x, y, Math.pow(x, y));

        System.out.printf("sqrt(%.3f) is " + "%.3f%n",
                          x, Math.sqrt(x));
    }
}
```

当您运行`ExponentialDemo`时，将看到以下输出：

```
The value of e is 2.7183
exp(11.635) is 112983.831
log(11.635) is 2.454
pow(11.635, 2.760) is 874.008
sqrt(11.635) is 3.411
```

### 三角函数方法

`Math`类还提供了一系列三角函数，总结在以下表中。传入这些方法的值是以弧度表示的角度。您可以使用`toRadians(double d)`方法将度转换为弧度。

- `double sin(double d)`: 返回指定双精度值的正弦。
- `double cos(double d)`: 返回指定双精度值的余弦。
- `double tan(double d)`: 返回指定双精度值的正切。
- `double asin(double d)`: 返回指定双精度值的反正弦。
- `double acos(double d)`: 返回指定双精度值的反余弦。
- `double atan(double d)`: 返回指定双精度值的反正切。
- `double atan2(double y, double x)`: 将直角坐标（x，y）转换为极坐标（r，theta），并返回theta。
- `double toDegrees(double d)` 和 `double toRadians(double d)`: 将参数转换为度或弧度。

这里有一个程序，`TrigonometricDemo`，它使用这些方法计算45度角的各种三角函数值：

```
public class TrigonometricDemo {
    public static void main(String[] args) {
        double degrees = 45.0;
        double radians = Math.toRadians(degrees);

        System.out.format("The value of pi " + "is %.4f%n",
                           Math.PI);

        System.out.format("The sine of %.1f " + "degrees is %.4f%n",
                          degrees, Math.sin(radians));

        System.out.format("The cosine of %.1f " + "degrees is %.4f%n",
                          degrees, Math.cos(radians));

        System.out.format("The tangent of %.1f " + "degrees is %.4f%n",
                          degrees, Math.tan(radians));

        System.out.format("The arcsine of %.4f " + "is %.4f degrees %n",
                          Math.sin(radians),
                          Math.toDegrees(Math.asin(Math.sin(radians))));

        System.out.format("The arccosine of %.4f " + "is %.4f degrees %n",
                          Math.cos(radians),
                          Math.toDegrees(Math.acos(Math.cos(radians))));

        System.out.format("The arctangent of %.4f " + "is %.4f degrees %n",
                          Math.tan(radians),
                          Math.toDegrees(Math.atan(Math.tan(radians))));
    }
}
```

这个程序的输出如下：

```
The value of pi is 3.1416
The sine of 45.0 degrees is 0.7071
The cosine of 45.0 degrees is 0.7071
The tangent of 45.0 degrees is 1.0000
The arcsine of 0.7071 is 45.0000 degrees
The arccosine of 0.7071 is 45.0000 degrees
The arctangent of 1.0000 is 45.0000 degrees
```

## 随机数

`random()`方法返回一个伪随机选择的数字，介于0.0到1.0之间。范围包括0.0，但不包括1.0。换句话说：`0.0 <= Math.random() < 1.0`。要获得不同范围内的数字，您可以对`random`方法返回的值执行算术运算。例如，要生成0到9之间的整数，您可以编写：

```
int number = (int)(Math.random() * 10);
```

通过乘以10，可能值的范围变为`0.0 <= number < 10.0`。

使用`Math.random`在您需要生成一个随机数时效果很好。如果您需要生成一系列随机数，您应该创建一个`java.util.Random`的实例，并调用该对象上的方法来生成数字。



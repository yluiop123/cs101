# Switch语句

## 使用Switch语句控制程序流程
`switch`语句是Java语言中可用的五种控制流语句之一。它允许有任意数量的执行路径。`switch`语句接受一个选择器变量作为参数，并使用该变量的值来选择将执行的路径。

您必须在以下类型中选择选择器变量的类型：
- `byte`、`short`、`char` 和 `int` 原始数据类型
- `Character`、`Byte`、`Short` 和 `Integer` 包装类型
- 枚举类型
- `String` 类型

值得注意的是，以下原始类型不能用作选择器变量的类型：`boolean`、`long`、`float` 和 `double`。

让我们看一个`switch`语句的第一个例子。

```java
int quarter = ...; // 任何值

String quarterLabel = null;
switch (quarter) {
    case 0: quarterLabel = "Q1 - Winter";
            break;
    case 1: quarterLabel = "Q2 - Spring";
            break;
    case 2: quarterLabel = "Q3 - Summer";
            break;
    case 3: quarterLabel = "Q3 - Summer"; // 注意：此处可能是示例错误，应为 "Q4 - Autumn"
            break;
    default: quarterLabel = "Unknown quarter";
}
```

`switch`语句的主体被称为`switch`块。`switch`块中的语句可以被一个或多个`case`或`default`标签标记。`switch`语句计算其表达式，然后执行所有跟随匹配`case`标签后的语句。

您可能已经注意到了`break`关键字的使用。每个`break`语句都会终止其包含的`switch`语句。控制流继续执行`switch`块之后的第一条语句。`break`语句是必需的，因为没有它们，`switch`块中的语句会穿透。所有跟随匹配`case`标签后的语句将顺序执行，不管后续`case`标签的表达式如何，直到遇到`break`语句。

以下代码使用穿透来填充`futureMonths`列表。

```java
int month = 8;
List<String> futureMonths = new ArrayList<>();

switch (month) {
    case 1:  futureMonths.add("January");
    case 2:  futureMonths.add("February");
    // ... 其他月份
    case 12: futureMonths.add("December");
             break;
    default: break;
}
```

技术上，最后的`break`不是必需的，因为流程会跳出`switch`语句。推荐使用`break`，这样修改代码更容易，也更不容易出错。

`default`部分处理所有没有被`case`部分显式处理的值。

以下代码示例显示了如何一个语句可以有多个`case`标签。代码示例计算特定月份的天数。

```java
int month = 2;
int year = 2021;
int numDays = 0;

switch (month) {
    // ... 其他月份
    case 2: // 二月
        if (((year % 4 == 0) && !(year % 100 == 0)) || (year % 400 == 0))
            numDays = 29;
        else
            numDays = 28;
        break;
    default:
        System.out.println("Invalid month.");
        break;
}
```

这段代码对于多个`case`有一个语句。

## 在Switch语句和If-then-else语句之间选择
决定使用`if-then-else`语句还是`switch`语句基于可读性和语句正在测试的表达式。`if-then-else`语句可以基于值的范围或条件测试表达式，而`switch`语句仅基于单个整数、枚举值或`String`对象测试表达式。

例如，以下代码可以使用`switch`语句编写。

```java
int month = ...; // 任何月份
switch (month) {
    case 1:
        System.out.println("January");
        break;
    // ... 其他月份
}
```

另一方面，以下代码不能使用`switch`语句编写，因为`switch`语句不支持`boolean`类型的标签。

```java
int temperature = ...; // 任何温度
if (temperature < 0) {
    System.out.println("Water is ice");
} else if (temperature < 100){
    System.out.println("Water is liquid, known as water");
} else {
    System.out.println("Water is vapor");
}
```

## 使用String作为Case标签的类型
在Java SE 7及更高版本中，您可以在`switch`语句的表达式中使用`String`对象。以下代码示例根据名为`month`的`String`的值显示月份编号。

```java
String month = ...; // 任何月份
int monthNumber = -1;

switch (month.toLowerCase()) {
    case "january":
        monthNumber = 1;
        break;
    // ... 其他月份
    default:
        monthNumber = 0;
        break;
}
```

`switch`表达式中的`String`与每个`case`标签关联的表达式进行比较，就好像使用了`String.equals()`方法一样。为了使这个示例接受任何情况的月份，无论大小写如何，月份被转换为小写（使用`toLowerCase()`方法），所有与`case`标签关联的字符串都是小写的。

## 空的选择器变量
`switch`语句的选择器变量可以是一个对象，所以这个对象可以是null。您应该保护您的代码不受空选择器变量的影响，因为在这种情况下，switch语句将抛出一个`NullPointerException`。


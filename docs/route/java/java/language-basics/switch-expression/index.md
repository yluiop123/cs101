# Switch表达式

## 修改Switch语法
在Java SE 14中，您可以使用另一种更便捷的语法来使用`switch`关键字：`switch`表达式。

有几点原因促使了这种新语法的产生。
1. 默认的控制流行为在switch标签之间是穿透的。这种语法容易出错，会导致应用程序中的错误。
2. `switch`块被视为一个块。这可能是一个障碍，特别是当您需要在一个特定的`case`中定义一个变量时。
3. `switch`语句是一个语句。在前几节的例子中，每个`case`中都给变量赋了一个值。将其变成表达式可以带来更好、更易读的代码。

前一节介绍的语法，称为_switch语句_，在Java SE 14中仍然可用，其语义没有改变。从Java SE 14开始，`switch`的新语法可用：_switch表达式_。

这种语法修改了switch标签的语法。假设您的应用程序中有以下_switch语句_。

```java
Day day = ...; // 任意一天
int len = 0;
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        len = 6;
        break;
    case TUESDAY:
        len = 7;
        break;
    // ... 其他情况
}
System.out.println("len = " + len);
```

使用_switch表达式_语法，您现在可以按以下方式编写它。

```java
Day day = ...; // 任意一天
int len =
    switch (day) {
        case MONDAY, FRIDAY, SUNDAY -> 6;
        case TUESDAY -> 7;
        // ... 其他情况
    };
System.out.println("len = " + len);
```

switch标签的语法现在是`case L ->`。如果标签匹配，只有标签右侧的代码被执行。这段代码可以是一个单独的表达式、一个块或一个抛出语句。因为这是一个块，您可以在其中定义局部变量。

这种语法还支持每个case有多个常量，用逗号分隔，如前一个例子所示。

## 生成值
这个switch语句可以用作表达式。例如，前一节中的例子可以改写成以下形式的switch语句。

```java
int quarter = ...; // 任意值

String quarterLabel =
    switch (quarter) {
        case 0  -> "Q1 - Winter";
        case 1  -> "Q2 - Spring";
        case 2  -> "Q3 - Summer";
        case 3  -> "Q3 - Summer"; // 注意：这里可能是一个错误，应该是 "Q4 - Autumn"
        default -> "Unknown quarter";
    };
```

如果`case`块中只有一个语句，这个语句生成的值将由switch表达式返回。

在代码块的情况下，语法略有不同。传统上，使用`return`关键字来表示代码块生成的值。遗憾的是，这种语法在switch语句中会导致歧义。让我们考虑以下示例。这段代码不能编译，只是作为一个例子。

```java
// 注意，这段代码不能编译！
public String convertToLabel(int quarter) {
    String quarterLabel =
        switch (quarter) {
            case 0  -> {
                System.out.println("Q1 - Winter");
                return "Q1 - Winter";
            }
            default -> "Unknown quarter";
        };
    return quarterLabel;
}
```

当`quarter`等于0时执行的代码块需要返回一个值。它使用`return`关键字来表示这个值。如果你仔细看看这段代码，你会发现有两个`return`语句：一个在`case`块中，另一个在方法块中。这就是歧义所在：人们可能会想第一个`return`的语义是什么。它是否意味着程序用这个值退出方法？还是它离开了`switch`语句？这种歧义导致可读性差和容易出错的代码。

为了解决这种歧义，创建了一种新的语法：`yield`语句。前一个例子的代码应该按以下方式编写。

```java
public String convertToLabel(int quarter) {
    String quarterLabel =
        switch (quarter) {
            case 0  -> {
                System.out.println("Q1 - Winter");
                yield "Q1 - Winter";
            }
            default -> "Unknown quarter";
        };
    return quarterLabel;
}
```

`yield`语句是一个可以在switch语句的任何`case`块中使用的语句。它带有一个值，这个值成为包围switch语句的值。

## 添加默认子句
默认子句允许您的代码处理选择器值不匹配任何`case`常量的情况。

Switch表达式的案例必须是穷尽的。对于所有可能的值，必须有一个匹配的switch标签。Switch语句不需要是穷尽的。如果选择器目标不匹配任何switch标签，这个switch语句将什么也不做，默默地。这可能是您的应用程序中隐藏错误的地方，这是您想要避免的。

在大多数情况下，可以使用`default`子句实现穷尽性；然而，在涵盖所有已知常量的枚举`switch`表达式的情况下，您不需要添加这个`default`子句。

仍然有一个情况需要处理。如果有人在枚举中添加了一个枚举值，但忘记更新这个枚举上的switch语句怎么办？为了处理这种情况，编译器在穷尽的switch语句中为您添加了一个`default`子句。这个`default`子句在正常情况下永远不会被执行。只有在添加了枚举值时才会抛出`IncompatibleClassChangeError`。

处理穷尽性是switch表达式的一项功能，这是传统switch语句没有提供的，并且在switch枚举值之外的其他情况下使用。

## 在Switch表达式中编写冒号Case
Switch表达式也可以使用传统的`case`块与`case L:`。在这种情况下，穿透语义适用。使用`yield`语句产生值。

```java
int quarter = ...; // 任意值

String quarterLabel =
    switch (quarter) {
        case 0 : yield "Q1 - Winter";
        case 1 : yield "Q2 - Spring";
        case 2 : yield "Q3 - Summer";
        case 3 : yield "Q3 - Summer"; // 注意：这里可能是一个错误，应该是 "Q4 - Autumn"
        default: System.out.println("Unknown quarter");
                 yield "Unknown quarter";
    };
```

## 处理空值
到目前为止，switch语句不接受空的选择器值。如果您尝试在空值上进行`switch`，您将得到一个`NullPointerException`。

Java SE 17有一个预览功能，增强了switch表达式以允许空值，所以您可以期待这种情况会改变。


# 调用方法和构造函数

## 向方法或构造函数传递信息

方法或构造函数的声明声明了该方法或构造函数的参数数量和类型。例如，下面是一个根据贷款金额、利率、贷款期限（期数）和贷款的未来价值来计算房屋贷款月付款的方法：

```java
public double computePayment(
                  double loanAmt,
                  double rate,
                  double futureValue,
                  int numPeriods) {
    double interest = rate / 100.0;
    double partial1 = Math.pow((1 + interest),
                    - numPeriods);
    double denominator = (1 - partial1) / interest;
    double answer = (-loanAmt / denominator)
                    - ((futureValue * partial1) / denominator);
    return answer;
}
```

这个方法有四个参数：贷款金额、利率、未来价值和期数。前三个是双精度浮点数，第四个是整数。参数在方法体中使用，并在运行时将采用传递进来的参数的值。

> 注意：*参数* 指的是方法声明中的变量列表。参数是调用方法时实际传递的值。当您调用方法时，所使用的参数必须在类型和顺序上与声明的参数匹配。

## 参数类型

您可以为方法或构造函数的参数使用任何数据类型。这包括您在 `computePayment()` 方法中看到的原始数据类型，如双精度、浮点数和整数，以及引用数据类型，如对象和数组。

下面是一个接受数组作为参数的方法的示例。在这个示例中，方法创建一个新的 `Polygon` 对象，并从一个 `Point` 对象数组中对其进行初始化（假设 `Point` 是一个表示 `x`，`y` 坐标的类）：

```java
public Polygon polygonFrom(Point[] corners) {
    // 方法体在这里
}
```

## 任意数量的参数

您可以使用称为 *可变参数* 的结构将任意数量的值传递给方法。当您不知道将传递给方法的特定类型参数的数量时，您会使用可变参数。这是手动创建数组的快捷方式（前一个方法本可以使用可变参数而不是数组）。

要使用可变参数，您在最后一个参数的类型后面跟一个省略号（三个点，...），然后是一个空格和参数名称。然后，您可以使用任意数量的该参数调用方法，包括没有参数。

```java
public Polygon polygonFrom(Point... corners) {
    int numberOfSides = corners.length;
    double squareOfSide1, lengthOfSide1;
    squareOfSide1 = (corners[1].x - corners[0].x)
                     * (corners[1].x - corners[0].x)
                     + (corners[1].y - corners[0].y)
                     * (corners[1].y - corners[0].y);
    lengthOfSide1 = Math.sqrt(squareOfSide1);

    // 更多的方法体代码，创建并返回连接点的多边形
}
```

您可以看到，在方法内部，`corners` 被当作一个数组对待。该方法可以带一个数组或者一系列参数调用。方法体内的代码在两种情况下都将参数当作数组对待。

您最常在打印方法中看到可变参数；例如，这个 `printf()` 方法：

```java
public PrintStream printf(String format, Object... args)
```

允许您打印任意数量的对象。它可以这样调用：

```java
System.out.printf("%s: %d, %s%n", name, idnum, address);
```

或者这样调用

```java
System.out.printf("%s: %d, %s, %s, %s%n", name, idnum, address, phone, email);
```

或者使用不同的参数数量。

## 参数名称

当您向方法或构造函数声明一个参数时，您为该参数提供了一个名称。这个名称在方法体中用来引用传入的参数。

参数的名称在其作用域内必须是唯一的。它不能与同一方法或构造函数的另一个参数的名称相同，也不能与方法或构造函数内部的局部变量的名称相同。

参数可以与类的一个字段具有相同的名称。如果出现这种情况，参数就会遮蔽该字段。遮蔽字段可能会使您的代码难以阅读，并且通常只在使用构造函数和方法设置特定字段时使用。例如，考虑下面的 `Circle` 类及其 `setOrigin()` 方法：

```java
public class Circle {
    private int x, y, radius;
    public void setOrigin(int x, int y) {
        ...
    }
}
```

`Circle` 类有三个字段：`x`、`y` 和 `radius`。`setOrigin()` 方法有两个参数，每个参数的名称都与一个字段相同。每个方法参数遮蔽与其名称共享的字段。因此，在方法体中使用简单名称 `x` 或 `y` 是指参数，而不是字段。要访问字段，必须使用限定名称。这将在本课程后面的 "使用 `this` 关键字 " 部分中讨论。

## 传递原始数据类型参数

原始参数，如 `int` 或 `double`，是通过值传递到方法中的。这意味着对参数值的任何更改只存在于方法的作用域内。当方法返回时，参数就消失了，对它们的任何更改都会丢失。下面是一个例子：

```java
public class PassPrimitiveByValue {

    public static void main(String[] args) {

        int x = 3;

        // 使用 x 作为参数调用 passMethod()
        passMethod(x);

        // 打印 x 以查看其值是否已更改
        System.out.println("After invoking passMethod, x = " + x);

    }

    // 在 passMethod() 中更改参数
    public static void passMethod(int p) {
        p = 10;
    }
}
```

当您运行这个程序时，输出是：

```
After invoking passMethod, x = 3
```

## 传递引用数据类型参数

引用数据类型参数，如对象，也是通过值传递到方法中的。这意味着当方法返回时，传入的引用仍然引用之前的对象。但是，如果它们具有适当的访问级别，可以在方法中更改对象字段的值。

例如，考虑一个任意类中移动 `Circle` 对象的方法：

```java
public void moveCircle(Circle circle, int deltaX, int deltaY) {
    // 将 circle 的原点移动到 x+deltaX, y+deltaY 的代码
    circle.setX(circle.getX() + deltaX);
    circle.setY(circle.getY() + deltaY);

    // 为 circle 分配一个新引用的代码
    circle = new Circle(0, 0);
}
```

使用以下参数调用该方法：

```java
moveCircle(myCircle, 23, 56)
```

在方法内部，`circle` 最初引用 `myCircle`。该方法通过 23 和 56 分别更改 circle 引用的对象（即 `myCircle`）的 `x` 和 `y` 坐标。这些更改将在方法返回时持续存在。然后 `circle` 被分配一个引用到一个新的 `Circle` 对象，其 `x = y = 0`。然而，这种重新分配没有持久性，因为引用是通过值传递的，不能更改。在方法内部，`circle` 指向的对象已经改变，但是，当方法返回时，`myCircle` 仍然引用调用方法之前相同的 `Circle` 对象。



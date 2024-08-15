# 在程序中创建数组

## 数组
数组是一个容器对象，它保存单一类型的固定数量值。数组的长度在创建时确定。创建后，其长度是固定的。您已经在“Hello World!”应用程序的主方法中看到过数组的例子。本节将更详细地讨论数组。

![img](./image/01_array.png)
一个包含8个元素的数组。

数组中的每个项目称为元素，每个元素通过其数字索引访问。如上图所示，编号从0开始。例如，第6个元素将在索引5处访问。

以下程序 `ArrayDemo` 创建了一个整数数组，将一些值放入数组，并打印每个值到标准输出。
```java
class ArrayDemo {
    public static void main(String[] args) {
        // 声明一个整数数组
        int[] anArray;

        // 为10个整数分配内存
        anArray = new int[10];

        // 初始化第一个元素
        anArray[0] = 100;
        // 初始化第二个元素
        anArray[1] = 200;
        // 以此类推
        anArray[2] = 300;
        anArray[3] = 400;
        anArray[4] = 500;
        anArray[5] = 600;
        anArray[6] = 700;
        anArray[7] = 800;
        anArray[8] = 900;
        anArray[9] = 1000;

        System.out.println("索引0处的元素: "
                           + anArray[0]);
        System.out.println("索引1处的元素: "
                           + anArray[1]);
        System.out.println("索引2处的元素: "
                           + anArray[2]);
        System.out.println("索引3处的元素: "
                           + anArray[3]);
        System.out.println("索引4处的元素: "
                           + anArray[4]);
        System.out.println("索引5处的元素: "
                           + anArray[5]);
        System.out.println("索引6处的元素: "
                           + anArray[6]);
        System.out.println("索引7处的元素: "
                           + anArray[7]);
        System.out.println("索引8处的元素: "
                           + anArray[8]);
        System.out.println("索引9处的元素: "
                           + anArray[9]);
    }
}
```
此程序的输出为：
```
Element at index 0: 100
Element at index 1: 200
Element at index 2: 300
Element at index 3: 400
Element at index 4: 500
Element at index 5: 600
Element at index 6: 700
Element at index 7: 800
Element at index 8: 900
Element at index 9: 1000
```
在现实世界的编程情况下，您可能会使用支持的循环结构之一来遍历数组的每个元素，而不是像前面的示例那样逐行编写。然而，该示例清楚地说明了数组语法。您将在控制流程部分了解各种循环结构（for、while和do-while）。

## 声明引用数组的变量
前面的程序声明了一个数组（名为 `anArray`），代码如下：
```java
// 定义一个int类型数组
int[] anArray;
```
像其他类型的变量声明一样，数组声明有两个组成部分：数组的类型和数组的名称。数组的类型写为 `type[]`，其中 `type` 是包含元素的数据类型；方括号是特殊符号，表示此变量保存一个数组。数组的大小不是其类型的一部分（这就是为什么方括号为空）。数组的名称可以是任何您想要的名称，只要它遵循类部分中讨论的规则和约定。与其他类型的变量一样，声明实际上并不创建数组；它只是告诉编译器此变量将保存指定类型的数组。

您也可以声明其他类型的数组：
```java
byte[] anArrayOfBytes;
short[] anArrayOfShorts;
long[] anArrayOfLongs;
float[] anArrayOfFloats;
double[] anArrayOfDoubles;
boolean[] anArrayOfBooleans;
char[] anArrayOfChars;
String[] anArrayOfStrings;
```
您也可以将方括号放在数组名称之后：
```java
// 这种形式不鼓励使用
float anArrayOfFloats[];
```
然而，一般不鼓励这种做法；方括号标识数组类型，应该与类型指定一起出现。

## 创建、初始化和访问数组
创建数组的一种方法是使用 `new` 运算符。在 `ArrayDemo` 程序中的下一条语句为10个整数元素分配了足够的内存，并将数组分配给 `anArray` 变量。
```java
// 创建一个int数组
anArray = new int[10];
```
如果缺少此语句，则编译器会打印如下错误，并编译失败：
```
ArrayDemo.java:4: Variable anArray may not have been initialized.
```
接下来的几行将值分配给数组的每个元素：
```java
anArray[0] = 100; // 定义第一个元素
anArray[1] = 200; // 定义第二个元素
anArray[2] = 300; // 以此类推
```
每个数组元素都通过其数字索引访问：
```java
System.out.println("Element 1 at index 0: " + anArray[0]);
System.out.println("Element 2 at index 1: " + anArray[1]);
System.out.println("Element 3 at index 2: " + anArray[2]);
```
或者，您可以使用快捷语法创建和初始化数组：
```java
int[] anArray = {
    100, 200, 300,
    400, 500, 600,
    700, 800, 900, 1000
};
```
在这里，数组的长度由花括号之间提供的值的数量和用逗号分隔来确定。

您也可以通过使用两组或更多方括号声明数组的数组（也称为多维数组），例如 `String[][]` 名称。因此，每个元素必须通过相应数量的索引值访问。

在Java编程语言中，多维数组是一个数组，其组件本身是数组。这与C或Fortran中的数组不同。一个结果是，行允许长度变化，如下 `MultiDimArrayDemo` 程序所示：
```java
class MultiDimArrayDemo {
    public static void main(String[] args) {
        String[][] names = {
            {"Mr. ", "Mrs. ", "Ms. "},
            {"Smith", "Jones"}
        };
        // Mr. Smith
        System.out.println(names[0][0] + names[1][0]);
        // Ms. Jones
        System.out.println(names[0][2] + names[1][1]);
    }
}
```
此程序的输出为：
```
Mr. Smith
Ms. Jones
```
最后，您可以使用内置的 `length` 属性来确定任何数组的大小。以下代码将数组的大小打印到标准输出：
```java
System.out.println(anArray.length);
```
## 复制数组
`System` 类有一个 `arraycopy()` 方法，您可以使用它从数组高效地复制数据到另一个数组：
```java
public static void arraycopy(Object src, int srcPos,
                             Object dest, int destPos, int length)
```
两个 `Object` 参数指定要复制的数组和要复制到的数组。三个 `int` 参数指定源数组中的起始位置、目标数组中的起始位置和要复制的数组元素数量。

以下程序 `ArrayCopyDemo` 声明了一个 `String` 元素数组。它使用 `System.arraycopy()` 方法将数组组件的一个子序列复制到第二个数组：
```java
class ArrayCopyDemo {
    public static void main(String[] args) {
        String[] copyFrom = {
            "Affogato", "Americano", "Cappuccino", "Corretto", "Cortado",
            "Doppio", "Espresso", "Frappucino", "Freddo", "Lungo", "Macchiato",
            "Marocchino", "Ristretto" };

        String[] copyTo = new String[7];
        System.arraycopy(copyFrom, 2, copyTo, 0, 7);
        for (String coffee : copyTo) {
            System.out.print(coffee + " ");
        }
    }
}
```
此程序的输出为：
```
Cappuccino Corretto Cortado Doppio Espresso Frappucino Freddo
```
## 数组操作
数组是编程中使用的强大且有用的概念。Java SE提供了执行与数组相关的一些最常见的操作方法。例如，`ArrayCopyDemo` 示例使用 `System` 类的 `arraycopy()` 方法，而不是手动遍历源数组的元素，并将每个元素放入目标数组。这是在幕后执行的，使开发人员可以使用一行代码调用该方法。

为了方便，Java SE在 `java.util.Arrays` 类中提供了几种执行数组操作的方法（例如，复制、排序和搜索数组）。例如，可以修改前面的示例，使用 `java.util.Arrays` 类的 `java.util.Arrays` 方法，如 `ArrayCopyOfDemo` 示例所示。不同之处在于，使用 `java.util.Arrays` 方法不需要在调用该方法之前创建目标数组，因为目标数组是由该方法返回的：
```java
class ArrayCopyOfDemo {
    public static void main(String[] args) {
        String[] copyFrom = {
            "Affogato", "Americano", "Cappuccino", "Corretto", "Cortado",
            "Doppio", "Espresso", "Frappucino", "Freddo", "Lungo", "Macchiato",
            "Marocchino", "Ristretto" };

        String[] copyTo = java.util.Arrays.copyOfRange(copyFrom, 2, 9);
        for (String coffee : copyTo) {
            System.out.print(coffee + " ");
        }
    }
}
```
如您所见，此程序的输出与之前相同，尽管它需要的代码行数更少。请注意，`java.util.Arrays` 方法的第二个参数是要复制的范围的初始索引（包括），而第三个参数是要复制的范围的最终索引（不包括）。在此示例中，要复制的范围不包括索引9处的数组元素（包含字符串 `Lungo`）。

`java.util.Arrays` 类中的方法提供的其他一些有用的操作包括：

- 搜索数组以获取特定值放置的索引（ `binarySearch()` 方法）。
- 比较两个数组以确定它们是否相等（ `equals()` 方法）。
- 填充数组以在每个索引处放置特定值（ `fill()` 方法）。
- 将数组排序为升序。这可以通过使用 `sort()` 方法顺序完成，或使用Java SE 8中引入的 `parallelSort()` 方法并发完成。在多处理器系统上并行排序大型数组比顺序排序数组更快。
- 使用数组作为其源创建流（ `stream()` 方法）。例如，以下语句以与前面示例相同的方式打印 `copyTo` 数组的内容：
```
java.util.Arrays.stream(copyTo).map(coffee -> coffee + " ").forEach(System.out::print);
```
有关流的更多信息，请参见聚合操作。

- 将数组转换为字符串。 `toString()` 方法将数组的每个元素转换为字符串，用逗号分隔，然后用方括号包围。例如，以下语句将 `copyTo` 数组转换为字符串并打印它：
```java
System.out.println(java.util.Arrays.toString(copyTo));
```
此语句打印以下内容：
```
[Cappuccino, Corretto, Cortado, Doppio, Espresso, Frappucino, Freddo]
```
## 变量和数组总结
Java编程语言在其术语中使用“字段”和“变量”。实例变量（非静态字段）对于类的每个实例都是唯一的。类变量（静态字段）是使用静态修饰符声明的字段；无论类被实例化多少次，类变量都恰好有一个副本。局部变量在方法内部存储临时状态。参数是提供额外信息给方法的变量；局部变量和参数始终被分类为“变量”（而不是“字段”）。在命名字段或变量时，您应该（或必须）遵循规则和约定。

八种原始数据类型是：`byte`、`short`、`int`、`long`、`float`、`double`、`boolean` 和 `char`。`java.lang.String` 类表示字符字符串。编译器将为上述类型的字段分配合理的默认值；对于局部变量，永远不会分配默认值。

文字是源代码中固定值的表示。数组是一个容器对象，它保存单一类型的固定数量值。数组的长度在创建时确定。创建后，其长度是固定的。

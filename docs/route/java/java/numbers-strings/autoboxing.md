# 自动装箱和拆箱

## 自动装箱和拆箱

自动装箱是Java编译器在原始类型和它们对应的对象包装类之间自动进行的转换。例如，将`int`转换为`Integer`，将`double`转换为`Double`等。如果转换方向相反，则称为拆箱。

以下是自动装箱的最简单示例：

```
Character ch = 'a';
```

本节的其余示例使用泛型。如果您还不熟悉泛型的语法，请参见泛型部分。

考虑以下代码：

```
List<Integer> ints = new ArrayList<>();
for (int i = 1; i < 50; i += 2)
    ints.add(i);
```

尽管您将`int`值作为原始类型而不是`Integer`对象添加到`ints`中，但代码可以编译。因为`ints`是`Integer`对象的列表，而不是`int`值的列表，您可能会奇怪为什么Java编译器没有发出编译时错误。编译器没有生成错误是因为它从`i`创建了一个`Integer`对象并将该对象添加到`ints`中。因此，编译器在运行时将先前的代码转换为以下形式：

```
List<Integer> ints = new ArrayList<>();
for (int i = 1; i < 50; i += 2)
    ints.add(Integer.valueOf(i));
```

将原始值（例如`int`）转换为相应包装类`Integer`的对象称为自动装箱。当原始值：

- 作为参数传递给期望相应包装类对象的方法。
- 分配给相应包装类变量。

考虑以下方法：

```
public static int sumEven(List<Integer> ints) {
    int sum = 0;
    for (Integer i: ints) {
        if (i % 2 == 0) {
            sum += i;
        }
    }
    return sum;
}
```

由于余数（`%`）和一元加（`+=`）运算符不适用于`Integer`对象，您可能会奇怪为什么Java编译器在不发出任何错误的情况下编译该方法。编译器没有生成错误是因为它在运行时调用`intValue()`方法将`Integer`转换为`int`：

```
public static int sumEven(List<Integer> ints){
    int sum=0;
    for(Integer i:ints) {
        if(i.intValue() % 2 == 0) {
            sum += i.intValue();
        }
    }
    return sum;
}
```

将包装类型`Integer`的对象转换为其对应的原始值（`int`）称为拆箱。当包装类的对象：

- 作为参数传递给期望相应原始类型值的方法。
- 分配给相应原始类型的变量。

拆箱示例展示了这是如何工作的：

```
import java.util.ArrayList;
import java.util.List;

public class Unboxing {

    public static void main(String[] args) {
        Integer i = Integer.valueOf(-8);

        // 1. 通过方法调用进行拆箱
        int absVal = absoluteValue(i);
        System.out.println("absolute value of " + i + " = " + absVal);

        List<Double> doubles = new ArrayList<>();
        doubles.add(3.1416);    // Π通过方法调用自动装箱。

        // 2. 通过赋值进行拆箱
        double pi = doubles.get(0);
        System.out.println("pi = " + pi);
    }

    public static int absoluteValue(int i) {
        return (i < 0) ? -i : i;
    }
}

```

程序打印以下内容：

```
absolute value of -8 = 8
pi = 3.1416
```

自动装箱和拆箱允许开发人员编写更简洁的代码，使其更易于阅读。以下表格列出了原始类型及其对应的包装类，这些类由Java编译器用于自动装箱和拆箱：

| 原始类型 | 包装类   |
| -------- | -------- |
| boolean  | Boolean  |
| byte     | Byte     |
| char     | Character |
| float    | Float    |
| int      | Integer  |
| long     | Long     |
| short    | Short    |
| double   | Double   |



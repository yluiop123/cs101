# 类的更多内容

本节涵盖了依赖于前几节中关于对象学到的对象引用和点操作符的类的更多方面：

- 从方法返回值。
- `this` 关键字。
- 类与实例成员。
- 访问控制。

## 从方法返回值

当方法完成所有语句、到达 `return` 语句、抛出异常（稍后介绍），或者首先发生上述任一情况时，它会返回到调用它的代码。

在方法声明中声明方法的返回类型。在方法体内部，使用 `return` 语句返回值。

任何声明为 `void` 的方法都不会返回值。它不需要包含 `return` 语句，但可以这么做。在这种情况下，`return` 语句可以用来跳出控制流块并退出方法，使用方式如下：

```java
return;
```

如果您尝试从声明为 `void` 的方法返回一个值，将会得到编译器错误。

任何未声明为 `void` 的方法都必须包含一个带有相应返回值的 `return` 语句，如下所示：

```java
return returnValue;
```

返回值的数据类型必须与方法声明的返回类型匹配；您不能从声明为返回 `boolean` 的方法返回整数值。

在前几节中讨论的 `Rectangle` 类中的 `getArea()` 方法返回一个整数：

```java
// 计算矩形面积的方法
public int getArea() {
    return width * height;
}
```

这个方法返回表达式 `width*height` 求值后得到的整数。

`getArea()` 方法返回一个原始类型。方法也可以返回引用类型。例如，在操作 `Bicycle` 对象的程序中，我们可能有如下方法：

```java
public Bicycle seeWhosFastest(Bicycle myBike, Bicycle yourBike, Environment env) {
    Bicycle fastest;
    // 计算哪辆自行车更快的代码，
    // 考虑到每辆自行车的齿轮和速度
    // 以及环境（地形和风）
    return fastest;
}
```

## 返回类或接口

如果本节内容使您感到困惑，请跳过它并在完成接口和继承部分后回来。

当一个方法使用类名作为其返回类型，如 `seeWhosFastest()`，返回对象的类必须是返回类型的子类，或者是返回类型的确切类。假设您有一个类层次结构，其中 `ImaginaryNumber` 是 `java.lang.Number` 的子类，而 `Number` 又是 `Object` 的子类，如下图所示。

![ImaginaryNumber 类层次结构](https://dev.java/assets/images/classes-objects/03_class-hierarchy-imaginary.png)

现在假设您有一个声明为返回 `Number` 的方法：

```java
public Number returnANumber() {
    ...
}
```

`returnANumber()` 方法可以返回一个 `ImaginaryNumber`，但不能返回一个 `Object`。`ImaginaryNumber` 的实例也是 `Number` 的实例，因为 `ImaginaryNumber` 是 `Number` 的子类。然而，`Object` 并不一定是 `Number` — 它可能是 `String` 或其他类型。

您可以重写一个方法，并定义它返回原始方法的子类，如下所示：

```java
public ImaginaryNumber returnANumber() {
    ...
}
```

这种技术称为 _协变返回类型_，意味着返回类型允许在与子类相同的方向上变化。

> 注意：您也可以使用接口名称作为返回类型。在这种情况下，返回的对象必须实现指定的接口。

## 使用 `this` 关键字

在实例方法或构造函数中，`this` 是对 _当前对象_ —— 调用方法或构造函数的对象的引用。您可以使用 `this` 从实例方法或构造函数中引用当前对象的任何成员。

### 使用 `this` 与字段

使用 `this` 关键字的最常见原因是字段被方法或构造函数参数遮蔽。

例如，`Point` 类是这样写的：

```java
public class Point {
    public int x = 0;
    public int y = 0;

    // 构造函数
    public Point(int a, int b) {
        x = a;
        y = b;
    }
}
```

但它也可以这样写：

```java
public class Point {
    public int x = 0;
    public int y = 0;

    // 构造函数
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```

构造函数中的每个参数遮蔽了对象的一个字段 —— 在构造函数中 `x` 是构造函数的第一个参数的局部副本。要引用 `Point` 字段 `x`，构造函数必须使用 `this.x`。

### 使用 `this` 与构造函数

在构造函数中，您也可以使用 `this` 关键字调用同一类中的另一个构造函数。这样做称为显式构造函数调用。这是另一个 `Rectangle` 类，与对象部分中的实现不同。

```java
public class Rectangle {
    private int x, y;
    private int width, height;

    public Rectangle() {
        this(0, 0, 1, 1);
    }
    public Rectangle(int width, int height) {
        this(0, 0, width, height);
    }
    public Rectangle(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    ...
}
```

此类包含一组构造函数。每个构造函数初始化矩形的一些或全部成员变量。构造函数为任何未由参数提供的初始值提供默认值。例如，无参数构造函数在坐标 0,0 处创建一个 1x1 的矩形。两参数构造函数调用四参数构造函数，传入 `width` 和 `height`，但始终使用 0,0 坐标。和以前一样，编译器根据参数的数量和类型确定要调用哪个构造函数。

如果存在，对另一个构造函数的调用必须是构造函数的第一行。

## 控制对类成员的访问

访问级别修饰符决定其他类是否可以使用特定的字段或调用特定的方法。有两种访问控制级别：

- 在最顶层 —— `public`，或包私有（无显式修饰符）。
- 在成员级别 —— `public`、`private`、`protected`，或包私有（无显式修饰符）。

一个类可以被声明为 `public`，这种情况下，该类在任何地方都可见。如果一个类没有修饰符（默认值，也称为包私有），它只在其自己的包中可见（包是相关类的命名组 —— 您将在后面的部分中了解到它们）。

在成员级别，您可以像顶级类一样使用 `public` 修饰符或无修饰符（包私有），含义相同。对于成员，还有两个额外的访问修饰符：`private` 和 `protected`。`private` 修饰符指定成员只能在其自己的类中访问。`protected` 修饰符指定成员只能在其自己的包中（和包私有一样）访问，此外，还可以在其类的子类中访问，即使在另一个包中。

下表显示了每种修饰符允许的成员访问权限。

| 修饰符 | 类 | 包 | 子类 | 世界 |
| --- | --- | --- | --- | --- |
| `public` | Y | Y | Y | Y |
| `protected` | Y | Y | Y | N |
| _无修饰符_ | Y | Y | N | N |
| `private` | Y | N | N | N |

第一列数据列指出类本身是否可以根据访问级别访问成员。如您所见，一个类总是可以访问自己的成员。

第二列指出与类在同一包中的类（无论它们的父类如何）是否可以访问成员。

第三列指出在包外声明的类的子类是否可以访问成员。

第四列指出所有类是否可以访问成员。

访问级别在两个方面影响您。首先，当您使用来自另一个来源的类时，例如 Java 平台中的类，访问级别决定您的类可以使用这些类中的哪些成员。其次，当您编写一个类时，您需要决定类中的每个成员变量和每个方法应该具有什么访问级别。

### 选择访问级别的提示：

如果其他程序员使用您的类，您希望确保不会因误用而发生错误。访问级别可以帮助您做到这一点。

对特定成员使用最严格的访问级别。除非有很好的理由，否则使用 `private`。

除非是常量，否则避免使用 `public` 字段。许多教程中的例子使用 `public` 字段。这可能有助于简洁地说明某些要点，但不建议用于生产代码。这不是一个好的做法，因为 `public` 字段倾向于将您与特定实现联系起来，限制了您更改代码的灵活性。

## 理解类成员

在本节中，我们讨论使用 `static` 关键字创建属于类的字段和方法，而不是属于类的实例。

### 类变量

当根据相同的类蓝图创建多个对象时，它们各自拥有独立的实例变量副本。在 `Bicycle` 类的情况下，实例变量是 `cadence`、`gear` 和 `speed`。每个 `Bicycle` 对象都有这些变量自己的值，存储在不同的内存位置。

有时，您希望拥有对所有对象都通用的变量。这是通过 `static` 修饰符实现的。在声明中具有 `static` 修饰符的字段称为 `static` 字段或 _类变量_。它们与类相关联，而不是与任何对象相关联。

每个类的实例共享一个类变量，该变量在内存中有一个固定位置。任何对象都可以更改类变量的值，但类变量也可以在不创建类的实例的情况下进行操作。

例如，假设您想创建多个 `Bicycle` 对象，并为每个对象分配一个从第一个对象开始的序列号 1。这个 `ID` 数是每个对象唯一的，因此是一个实例变量。同时，您需要一个字段来跟踪已创建了多少 `Bicycle` 对象，以便您知道下一个对象应该分配什么 `ID`。这样的字段与任何单独的对象无关，而是与整个类有关。为此您需要一个类变量 `numberOfBicycles`，如下所示：

```java
public class Bicycle {

    private int cadence;
    private int gear;
    private int speed;

    // 为对象 ID 添加一个实例变量
    private int id;

    // 为实例化的 Bicycle 对象数量添加一个类变量
    private static int numberOfBicycles = 0;
    ...
}
```

类变量通过类名本身引用，如下所示：

```java
Bicycle.numberOfBicycles
```

这清楚地表明它们是类变量。

> 注意：您也可以像 `myBike.numberOfBicycles` 那样使用对象引用来引用静态字段，
> 但这不推荐，因为这不清楚它们是类变量。

您可以使用 `Bicycle` 构造函数来设置 `ID` 实例变量并递增 `numberOfBicycles` 类变量：

```java
public class Bicycle {

    private int cadence;
    private int gear;
    private int speed;
    private int id;
    private static int numberOfBicycles = 0;

    public Bicycle(int startCadence, int startSpeed, int startGear){
        gear = startGear;
        cadence = startCadence;
        speed = startSpeed;

        // 增加 Bicycle 数量
        // 并分配 ID 号码
        id = ++numberOfBicycles;
    }

    // 返回 ID 实例变量的新方法
    public int getID() {
        return id;
    }
    ...
}
```

### 类方法

Java 编程语言支持静态方法以及静态变量。在声明中具有 `static` 修饰符的静态方法应该使用类名调用，无需创建类的实例，如下所示：

```java
ClassName.methodName(args)
```

> 注意：您也可以像 `instanceName.methodName(args)` 那样使用对象引用来引用静态方法，
> 但这不推荐，因为这不清楚它们是类方法。

静态方法的一个常见用途是访问静态字段。例如，我们可以向 `Bicycle` 类添加一个静态方法来访问 `numberOfBicycles` 静态字段：

```java
public static int getNumberOfBicycles() {
    return numberOfBicycles;
}
```

并非所有实例和类变量及方法的组合都是允许的：

- 实例方法可以直接访问实例变量和实例方法。
- 实例方法可以直接访问类变量和类方法。
- 类方法可以直接访问类变量和类方法。
- 类方法不能直接访问实例变量或实例方法 —— 它们必须使用对象引用。此外，类方法也不能使用 `this` 关键字，因为没有实例供 this 引用。

### 常量

`static` 修饰符与 `final` 修饰符结合使用，也用于定义常量。`final` 修饰符表示此字段的值不能更改。

例如，以下变量声明定义了一个名为 `PI` 的常量，其值是对 pi（圆周长与直径的比率）的近似值：

```java
static final double PI = 3.141592653589793;
```

以这种方式定义的常量不能被重新赋值，如果程序尝试这样做，将是一个编译时错误。按照惯例，常量值的名称用大写字母拼写。如果名称由多个单词组成，则单词之间用下划线（`_`）分隔。

> 注意：如果原始类型或字符串被定义为常量，并且值在编译时已知，
> 编译器会在代码中的所有地方用其值替换常量名称。这称为编译时常量。
> 如果常量在外界的值发生变化（例如，如果立法规定 pi 实际上应该是 3.975），
> 您将需要重新编译使用此常量的任何类以获取当前值。

### 自行车类

在本节中进行的所有修改之后，`Bicycle` 类现在是：

```java
public class Bicycle {
    private int cadence;
    private int gear;
    private int speed;

    private int id;
    private static int numberOfBicycles = 0;

    public Bicycle(int startCadence, int startSpeed, int startGear) {
        gear = startGear;
        cadence = startCadence;
        speed = startSpeed;

        id = ++numberOfBicycles;
    }

    public int getID() {
        return id;
    }

    public static int getNumberOfBicycles() {
        return numberOfBicycles;
    }

    // ... 其他方法 ...
}
```

## 初始化字段

正如您所看到的，您通常可以在字段声明中为其提供一个初始值：

```java
public class BedAndBreakfast {
    // 初始化为 10
    public static int capacity = 10;

    // 初始化为 false
    private boolean full = false;
}
```

当初始化值可用且初始化可以放在一行时，这种方法效果很好。然而，由于其简单性，这种初始化形式有限制。如果初始化需要一些逻辑（例如，错误处理或 for 循环来填充复杂数组），简单的赋值是不足够的。实例变量可以在构造函数中初始化，可以使用错误处理或其他逻辑。为了提供类变量的相同功能，Java 编程语言包括 _静态初始化块_。

> 注意：没有必要在类定义的开头声明字段，尽管这是最常见的做法。只有在使用之前声明并初始化它们。

### 静态初始化块

静态初始化块是一个正常的代码块，用大括号 `{ }` 包围，并在前面加上 `static` 关键字。这里有一个例子：

```java
static {
    // 这里放置所需的任何初始化代码
}
```

一个类可以有任意数量的静态初始化块，它们可以出现在类体的任何位置。运行时系统保证按它们在源代码中出现的顺序调用静态初始化块。

静态块的替代方法是编写一个私有静态方法：

```java
class Whatever {
    public static varType myVar = initializeClassVariable();

    private static varType initializeClassVariable() {
        // 初始化代码放在这里
    }
}
```

私有静态方法的优点是，如果需要重新初始化类变量，可以稍后重用它们。

您应该意识到，您不能重新定义静态块的内容。一旦编写，您不能阻止此块被执行。如果静态块的内容由于某种原因无法执行，那么您的应用程序将无法正常工作，因为您将无法为此类实例化任何对象。如果静态块包含访问某些外部资源的代码，如文件系统或网络，就可能发生这种情况。

### 初始化实例成员

通常，您会在构造函数中放置初始化实例变量的代码。使用构造函数初始化实例变量有两种替代方法：初始化块和最终方法。

实例变量的初始化块看起来与静态初始化块相同，但没有 static 关键字：

```java
{
    // 这里放置所需的任何初始化代码
}
```

Java 编译器将初始化块复制到每个构造函数中。因此，这种方法可以用于在多个构造函数之间共享代码块。

_final 方法_ 不能在子类中被重写。这在继承部分中讨论。以下是使用 final 方法初始化实例变量的示例：

```java
class Whatever {
    private varType myVar = initializeInstanceVariable();

    protected final varType initializeInstanceVariable() {
        // 初始化代码放在这里
    }
}
```

如果子类可能想要重用初始化方法，这特别有用。该方法是最终的，因为在实例化期间调用非最终方法是有问题的。

## 创建和使用类和对象的总结

类声明命名了类，并在大括号之间的类体中。类名前面可以有修饰符。类体包含类的字段、方法和构造函数。类使用字段来包含状态信息，并使用方法来实现行为。使用类名初始化新实例的构造函数看起来像没有返回类型的普通方法。

您以相同的方式控制对类和成员的访问：通过在它们声明中使用如 public 这样的访问修饰符。

您通过在成员的声明中使用 `static` 关键字来指定类变量或类方法。没有被声明为 `static` 的成员隐式地是实例成员。类变量由所有类的实例共享，并且可以通过类名以及实例引用来访问。类的实例为每个实例变量获得它们自己的副本，这些副本必须通过实例引用来访问。

您可以通过使用 `new` 操作符和一个构造函数从类中创建一个对象。`new` 操作符返回了创建的对象的引用。您可以将引用分配给变量或直接使用它。

实例变量和方法如果对类声明之外的代码可访问，可以通过使用限定名称来引用。实例变量的限定名称如下所示：

```java
objectReference.variableName
```

方法的限定名称如下所示：

```java
objectReference.methodName(argumentList)
```

或者：

```java
objectReference.methodName()
```

垃圾收集器自动清理未使用的对象。如果程序不再持有对它的任何引用，那么对象就是未使用的。您可以通过将持有引用的变量设置为 `null` 来显式丢弃引用。



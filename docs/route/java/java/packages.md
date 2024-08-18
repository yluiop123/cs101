# Java 包（Packages）

## 了解包
为了使类型更容易查找和使用，避免命名冲突，并控制访问权限，程序员将相关类型分组到包中。
定义：包是一组相关类型的分组，提供访问保护和命名空间管理。请注意，类型指的是类、接口、枚举和注解类型。枚举和注解类型分别是特殊类型的类和接口，因此在本节中，类型通常简称为类和接口。
Java 平台中的类型是各种包的成员，这些包按功能捆绑类：基本类在`java.lang`中，读写（输入和输出）类在`java.io`中，等等。您也可以将自己的类型放入包中。
假设您编写了一组表示图形对象的类，如圆、矩形、线和点。您还编写了一个接口`Draggable`，如果类可以用鼠标拖动，则实现该接口。
```
// 在 Draggable.java 文件中
public interface Draggable {
  ...
}

// 在 Graphic.java 文件中
public abstract class Graphic {
  ...
}

// 在 Circle.java 文件中
public class Circle extends Graphic
   implements Draggable {
  ...
}

// 在 Rectangle.java 文件中
public class Rectangle extends Graphic
   implements Draggable {
  ...
}

// 在 Point.java 文件中
public class Point extends Graphic
   implements Draggable {
  ...
}

// 在 Line.java 文件中
public class Line extends Graphic
   implements Draggable {
  ...
}
```
您应该将这些类和接口打包到一个包中，原因包括以下几点：
- 您和其他程序员可以轻松确定这些类型是相关的。
- 您和其他程序员知道在哪里可以找到提供图形相关功能的类型。
- 您的类型名称不会与其他包中的类型名称冲突，因为包创建了一个新的命名空间。
- 您可以允许包内的类型相互无限制地访问，但仍然限制包外类型的访问。

## 创建包
要创建一个包，您需要为包选择一个名称（命名约定将在下一节中讨论），并在包含要包含在包中的类型（类、接口、枚举和注解类型）的每个源文件的顶部添加一个带有该名称的`package`语句。
`package`语句（例如，`package graphics;`）必须是源文件的第一行。每个源文件只能有一个`package`语句，并且它适用于文件中的所有类型。
注意：如果您在一个源文件中放置多个类型，只有一个可以是公共的，并且它必须与源文件的名称相同。例如，您可以在文件`Circle.java`中定义`public class Circle`，在文件`Draggable.java`中定义`public interface Draggable`，在文件`Day.java`中定义`public enum Day`，等等。
您可以将非公共类型与公共类型放在同一个文件中（强烈不建议这样做，除非非公共类型很小并且与公共类型密切相关），但只有公共类型可以从包外访问。所有顶级的非公共类型将是包私有的。
如果您将前面部分中列出的图形接口和类放入一个名为`graphics`的包中，您需要六个源文件，如下所示：
```
// 在 Draggable.java 文件中
package graphics;
public interface Draggable {
  ...
}

// 在 Graphic.java 文件中
package graphics;
public abstract class Graphic {
  ...
}

// 在 Circle.java 文件中
package graphics;
public class Circle extends Graphic
   implements Draggable {
  ...
}

// 在 Rectangle.java 文件中
package graphics;
public class Rectangle extends Graphic
   implements Draggable {
  ...
}

// 在 Point.java 文件中
package graphics;
public class Point extends Graphic
   implements Draggable {
  ...
}

// 在 Line.java 文件中
package graphics;
public class Line extends Graphic
   implements Draggable {
  ...
}
```
如果您不使用`package`语句，您的类型将最终位于一个未命名的包中。一般来说，未命名的包仅用于小型或临时应用程序，或者在您刚刚开始开发过程时使用。否则，类和接口应属于命名包。

## 命名包和命名约定
由于全世界的程序员都在使用 Java 编程语言编写类和接口，很可能许多程序员会为不同的类型使用相同的名称。实际上，前面的示例就是这样：它定义了一个`Rectangle`类，而在`java.awt`包中已经有一个`Rectangle`类。但是，如果两个类位于不同的包中，编译器允许它们具有相同的名称。每个`Rectangle`类的完全限定名称包括包名称。也就是说，在`graphics`包中`Rectangle`类的完全限定名称是`graphics.Rectangle`，在`java.awt`包中`Rectangle`类的完全限定名称是`java.awt.Rectangle`。
除非两个独立的程序员为他们的包使用相同的名称，否则这种方法效果很好。为了避免这个问题，需要遵循约定。
包名称全部小写，以避免与类或接口的名称冲突。
公司使用其反向的互联网域名来开始他们的包名称 - 例如，对于由`example.com`的程序员创建的名为`mypackage`的包，使用`com.example.mypackage`。
在单个公司内发生的名称冲突需要通过该公司内的约定来处理，也许可以在公司名称后包括区域或项目名称（例如，`com.example.region.mypackage`）。
Java 语言本身的包以`java.`或`javax.`开头。
在某些情况下，互联网域名可能不是有效的包名称。如果域名包含连字符或其他特殊字符，如果包名称以数字或其他非法用作 Java 名称开头的字符开头，或者如果包名称包含保留的 Java 关键字，例如`int`，就会发生这种情况。在这种情况下，建议的约定是添加下划线。例如：
|域名|包名称前缀|
|---|---|
|`hyphenated-name.example.org`|`org.example.hyphenated_name`|
|`example.int`|`int_.example`|
|`123name.example.com`|`com.example._123name`|

## 使用包成员
构成包的类型称为包成员。
要从包外部使用`public`包成员，您必须执行以下操作之一：
- 通过其完全限定名称引用该成员
- 导入包成员
- 导入成员的整个包
每种方法适用于不同的情况，将在后续部分中解释。

### 通过限定名称引用包成员
到目前为止，本教程中的大多数示例都通过其简单名称引用类型，例如`Rectangle`和`StackOfInts`。如果您正在编写的代码与该成员在同一个包中，或者该成员已被导入，您可以使用包成员的简单名称。
但是，如果您试图使用来自不同包的成员，并且该包尚未导入，则必须使用成员的完全限定名称，其中包括包名称。这是前面示例中在图形包中声明的`Rectangle`类的完全限定名称。
`graphics.Rectangle`
您可以使用此限定名称创建`graphics.Rectangle`的实例：
```
graphics.Rectangle myRect = new graphics.Rectangle();
```
限定名称对于不频繁使用是可以的。但是，当名称重复使用时，反复键入名称会变得繁琐，并且代码变得难以阅读。作为替代方案，您可以导入成员或其包，然后使用其简单名称。

### 导入包成员
要将特定成员导入当前文件，请在文件开头的任何类型定义之前，但在`package`语句（如果有）之后，放置一个`import`语句。以下是如何从前面部分创建的图形包中导入`Rectangle`类。
```
import graphics.Rectangle;
```
现在您可以通过其简单名称引用`Rectangle`类。
```
Rectangle myRectangle = new Rectangle();
```
如果您只使用图形包中的少数成员，这种方法效果很好。但是，如果您使用包中的许多类型，则应该导入整个包。

### 导入整个包
要导入特定包中包含的所有类型，请使用带有星号（`*`）通配符的`import`语句。
```
import graphics.*;
```
现在您可以通过其简单名称引用图形包中的任何类或接口。
```
Circle myCircle = new Circle();
Rectangle myRectangle = new Rectangle();
```
`import`语句中的星号只能用于指定包中的所有类，如这里所示。它不能用于匹配包中类的子集。例如，以下语句不会匹配图形包中以`A`开头的所有类。
```
// 不起作用
import graphics.A*;
```
相反，它会生成编译器错误。使用`import`语句时，您通常只导入单个包成员或整个包。
注意：另一种不太常见的导入形式允许您导入封闭类的公共嵌套类。例如，如果`graphics.Rectangle`类包含有用的嵌套类，如`Rectangle.DoubleWide`和`Rectangle.Square`，您可以使用以下两个语句导入`Rectangle`及其嵌套类。
```
import graphics.Rectangle;
import graphics.Rectangle.*;
```
请注意，第二个`import`语句不会导入`Rectangle`。
另一种不太常见的导入形式，静态导入语句，将在本节末尾讨论。
为了方便起见，Java 编译器会自动为每个源文件导入两个完整的包：
- `java.lang`包和
- 当前包（当前文件的包）。

### 包的明显层次结构
起初，包看起来是层次结构的，但实际上它们不是。例如，Java API 包括`java.awt`包、`java.awt.color`包、`java.awt.font`包以及许多其他以`java.awt`开头的包。但是，`java.awt.color`包、`java.awt.font`包和其他`java.awt.xxxx`包不包含在`java.awt`包中。`java.awt`（Java 抽象窗口工具包）前缀用于许多相关包，以表明它们的关系，但不是表示包含关系。
导入`java.awt.*`会导入`java.awt`包中的所有类型，但不会导入`java.awt.color`、`java.awt.font`或任何其他`java.awt.xxxx`包。如果您计划使用`java.awt.color`以及`java.awt`中的类和其他类型，则必须导入这两个包及其所有文件：
```
import java.awt.*;
import java.awt.color.*;
```

### 名称歧义
如果一个包中的成员与另一个包中的成员共享其名称，并且两个包都被导入，则必须通过其限定名称引用每个成员。例如，图形包定义了一个名为`Rectangle`的类。`java.awt`包也包含一个`Rectangle`类。如果`graphics`和`java.awt`都已被导入，则以下是歧义的。
```
Rectangle rect;
```
在这种情况下，您必须使用成员的完全限定名称来确切指示您想要的是哪个`Rectangle`类。例如，
```
graphics.Rectangle rect;
```

### 静态导入语句
在某些情况下，您需要频繁访问来自一两个类的静态最终字段（常量）和静态方法。反复前缀这些类的名称可能会导致代码混乱。静态导入语句为您提供了一种导入您想要使用的常量和静态方法的方法，这样您就不需要前缀它们的类名。
`java.lang.Math`类定义了`PI`常量和许多静态方法，包括计算正弦、余弦、正切、平方根、最大值、最小值、指数等的方法。例如，
```
public static final double PI = 3.141592653589793;

public static double cos(double a) {
  ...
}
```
通常，要从另一个类使用这些对象，您需要前缀类名，如下所示。
```
double r = Math.cos(Math.PI * theta);
```
您可以使用`static import`语句导入`java.lang.Math`的静态成员，这样您就不需要前缀类名`Math`。`Math`的静态成员可以单独导入：
```
import static java.lang.Math.PI;
```
或作为一组导入：
```
import static java.lang.Math.*;
```
一旦它们被导入，静态成员就可以不加限定地使用。例如，前面的代码片段将变为：
```
double r = Math.cos(PI * theta);
```
显然，您可以编写自己的包含常量和频繁使用的静态方法的类，然后使用静态导入语句。例如，
```
import static mypackage.MyConstants.*;
```
注意：非常谨慎地使用静态导入。过度使用静态导入可能会导致代码难以阅读和维护，因为代码的读者将不知道哪个类定义了特定的静态对象。正确使用时，静态导入通过消除类名重复使代码更具可读性。

## 总结
要为类型创建一个包，将`package`语句作为包含该类型（类、接口、枚举或注解类型）的源文件的第一行。
要使用不同包中的公共类型，您有三个选择：
- 使用类型的完全限定名称，
- 导入类型，或
- 导入类型所属的整个包。
包的源文件和类文件的路径名称反映了包的名称。
您可能需要设置您的`CLASSPATH`，以便编译器和 JVM 能够找到您的类型的`.class`文件。
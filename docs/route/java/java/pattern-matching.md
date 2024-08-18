# Java 中的模式匹配（Using Pattern Matching）

## 介绍模式匹配
模式匹配是一个仍在开发中的特性。该特性的一些元素已作为 Java 语言的最终特性发布，一些已作为预览特性发布，还有一些仍在讨论中。
如果您想了解更多关于模式匹配的信息并提供反馈，那么您需要访问 Amber 项目页面。Amber 项目页面是与 Java 语言中模式匹配相关的一站式页面。
如果您是模式匹配的新手，您首先想到的可能是正则表达式中的模式匹配。如果是这样，那么您可能想知道它与“instanceof 的模式匹配”有什么关系？
正则表达式是一种模式匹配形式，用于分析字符字符串。它是一个很好且易于理解的起点。
让我们编写以下代码：
```java
String sonnet = "From fairest creatures we desire increase,\n" + 
        "That thereby beauty's rose might never die,\n" + 
        "But as the riper should by time decease\n" + 
        "His tender heir might bear his memory:\n" + 
        "But thou, contracted to thine own bright eyes,\n" + 
        "Feed'st thy light's flame with self-substantial fuel,\n" + 
        "Making a famine where abundance lies,\n" + 
        "Thyself thy foe, to thy sweet self too cruel.\n" + 
        "Thou that art now the world's fresh ornament,\n" + 
        "And only herald to the gaudy spring,\n" + 
        "Within thine own bud buriest thy content,\n" + 
        "And, tender churl, mak'st waste in niggardly.\n" + 
        "Pity the world, or else this glutton be,\n" + 
        "To eat the world's due, by the grave and thee.";

Pattern pattern = Pattern.compile("\\bflame\\b");
Matcher matcher = pattern.matcher(sonnet);
while (matcher.find()) {
    String group = matcher.group();
    int start = matcher.start();
    int end = matcher.end();
    System.out.println(group + " " + start + " " + end);
}
```
这段代码将莎士比亚的第一首十四行诗作为文本。使用正则表达式`\bflame\b`对该文本进行分析。这个正则表达式以`\b`开头和结尾。在正则表达式中，这个转义字符具有特殊含义：它表示单词的开始或结束。在这个例子中，它意味着这个模式匹配单词`flame`。
您可以使用正则表达式做更多的事情。这超出了本教程的范围。如果您想了解更多关于正则表达式的信息，您可以查看正则表达式页面。
如果您运行这段代码，它将打印以下内容：
```
flame 233 238
```
这个结果告诉您，在十四行诗中，索引 233 到索引 238 之间有一个`flame`的出现。
正则表达式的模式匹配是这样工作的：
 - 它匹配给定的模式；在这个例子中是`flame`，并将其与文本进行匹配。
 - 然后它给您提供关于模式匹配位置的信息。
在本教程的其余部分，您需要记住三个概念：
 - 您需要匹配的内容；这被称为匹配目标。在这里，它是十四行诗。
 - 您匹配的对象；这被称为模式。在这里，正则表达式是`flame`。
 - 匹配的结果；在这里是开始索引和结束索引。
这三个元素是模式匹配的基本元素。

## instanceof 的模式匹配
### 将任何对象与类型进行匹配
有几种扩展模式匹配的方法。我们涵盖的第一种方法称为 instanceof 的模式匹配；它已在 Java SE 16 中作为最终特性发布。
让我们将上一节的示例扩展到 instanceof 的用例。为此，让我们考虑以下示例：
```java
public void print(Object o) {
    if (o instanceof String s){
        System.out.println("This is a String of length " + s.length());
    } else {
        System.out.println("This is not a String");
    }
}
```
让我们描述我们在这里介绍的三个元素。
 - 匹配目标是任何类型的任何对象。它是 instanceof 运算符的左侧操作数：`o`。
 - 模式是一个类型后跟一个变量声明。它是 instanceof 的右侧。类型可以是类、抽象类或接口。在这种情况下，它只是`String s`。
 - 匹配的结果是对匹配目标的新引用。这个引用放在作为模式一部分声明的变量中，在这个例子中是`s`。如果匹配目标与模式匹配，则创建此变量。此变量具有您匹配的类型。`s`变量称为模式的模式变量。某些模式可能有多个模式变量。
在我们的示例中，变量`o`是您需要匹配的元素；它是您的匹配目标。模式是`String s`声明。匹配的结果是与类型`String`一起声明的变量`s`。只有当`o`的类型是`String`时，才会创建这个变量。
这种可以与 instanceof 一起定义变量的特殊语法是 Java SE 16 中添加的新语法。
模式`String s`称为类型模式，因为它检查匹配目标的类型。请注意，因为类型`String`扩展了类型`CharSequence`，所以以下模式也会匹配：
```java
public void print(Object o) {
    if (o instanceof CharSequence cs) {
        System.out.println("This is a CharSequence of length " + s.length());
    }
}
```

### 使用模式变量
编译器允许您在任何有意义的地方使用变量`s`。首先想到的范围是`if`分支。事实证明，您还可以在`if`语句的某些部分使用此变量。
以下代码检查`object`是否是`String`类的实例，并且是否是一个非空字符串。您可以看到它在`&&`后面的布尔表达式中使用了变量`s`。这是完全合理的，因为只有当第一部分为`true`时，才会评估布尔表达式的这部分。在这种情况下，变量`s`被创建。
```java
public void print(Object o) {
    if (o instanceof String s &&!s.isEmpty()) {
        int length = s.length();
        System.out.println("This object is a non-empty string of length " + length);
    } else {
        System.out.println("This object is not a string.");
    }
}
```
有些情况下，您的代码检查变量的实际类型，如果此类型不是您期望的类型，则跳过代码的其余部分。考虑以下示例：
```java
public void print(Object o) {
    if (!(o instanceof String)) {
        return;
    }
    String s = (String)o;
    // do something with s
}
```
从 Java SE 16 开始，您可以使用 instanceof 的模式匹配以这种方式编写此代码：
```java
public void print(Object o) {
    if (!(o instanceof String s)) {
        return;
    }

    System.out.println("This is a String of length " + s.length());
}
```
只要您的代码从`if`分支离开方法（要么使用`return`，要么抛出异常），`s`模式变量就可以在`if`语句之外使用。如果您的代码可以执行`if`分支并继续执行方法的其余部分，则不会创建模式变量。
有些情况下，编译器可以判断匹配是否失败。让我们考虑以下示例：
```java
Double pi = Math.PI;
if (pi instanceof String s) {
    // 这永远不会为真！
}
```
编译器知道`String`类是最终的。所以变量`pi`不可能是`String`类型。编译器将对此代码发出错误。

### 使用 instanceof 的模式匹配编写更简洁的代码
有很多地方使用此功能会使您的代码更具可读性。
让我们创建以下`Point`类，带有一个`equals()`方法。这里省略了`hashCode()`方法。
```java
public class Point {
    private int x;
    private int y;

    public boolean equals(Object o) {
        if (!(o instanceof Point)) {
            return false;
        }
        Point point = (Point) o;
        return x == point.x && y == point.y;
    }

    // 构造函数、hashCode 方法和访问器已省略
}
```
这是编写`equals()`方法的经典方式；它可能是由 IDE 生成的。
您可以使用 instanceof 的模式匹配功能重写此`equals()`方法，如下所示，从而使代码更具可读性。
```java
public boolean equals(Object o) {
    return o instanceof Point point &&
            x == point.x &&
            y == point.y;
}
```

## Switch 的模式匹配
### 将 Switch 表达式扩展为使用类型模式作为 Case 标签
Switch 的模式匹配是 JDK 21 的最终特性。它在 Java SE 17、18、19 和 20 中作为预览特性呈现。
Switch 的模式匹配使用 switch 语句或表达式。它允许您将匹配目标同时与多个模式进行匹配。到目前为止，这些模式是类型模式，就像 instanceof 的模式匹配一样。
在这种情况下，匹配目标是 switch 的选择器表达式。在这样的特性中有几个模式；switch 表达式的每个 case 本身都是一个类型模式，遵循上一节中描述的语法。
让我们考虑以下代码：
```java
Object o =...; // 任何对象
String formatted = null;
if (o instanceof Integer i) {
    formatted = String.format("int %d", i);
} else if (o instanceof Long l) {
    formatted = String.format("long %d", l);
} else if (o instanceof Double d) {
    formatted = String.format("double %f", d);
} else {
    formatted = String.format("Object %s", o.toString());
}
```
您可以看到它包含三个类型模式，每个 if 语句一个。Switch 的模式匹配允许以以下方式编写此代码：
```java
Object o =...; // 任何对象
String formatter = switch (o) {
    case Integer i -> String.format("int %d", i);
    case Long l -> String.format("long %d", l);
    case Double d -> String.format("double %f", d);
    default -> String.format("Object %s", o.toString());
};
```
Switch 的模式匹配不仅使您的代码更具可读性，而且使其性能更高。评估 if - else - if 语句的时间与该语句的分支数量成正比；分支数量加倍，评估时间也加倍。评估 switch 不依赖于 case 的数量。我们说 if 语句的时间复杂度为 O(n)，而 switch 语句的时间复杂度为 O(1)。
到目前为止，它不是模式匹配本身的扩展；它是 switch 的新特性，接受类型模式作为 case 标签。
在其当前版本中，switch 表达式接受以下 case 标签：
 - 以下数字类型：`byte`、`short`、`char`和`int`（`long`不被接受）
 - 相应的包装类型：`Byte`、`Short`、`Character`和`Integer`
 - 类型`String`
 - 枚举类型。
Switch 的模式匹配增加了使用类型模式作为 case 标签的可能性。

### 使用受保护的模式
在 instanceof 的模式匹配的情况下，您已经知道，如果匹配目标与模式匹配，则创建的模式变量可以在包含 instanceof 的布尔表达式中使用，如以下示例所示：
```java
Object object =...; // 任何对象
if (object instanceof String s &&!s.isEmpty()) {
    int length = s.length();
    System.out.println("This object is a non-empty string of length " + length);
}
```
这在 if 语句中工作得很好，因为语句的参数是布尔类型。在 switch 表达式中，case 标签不能是布尔类型。所以您不能编写以下代码：
```java
Object o =...; // 任何对象
String formatter = switch (o) {
    //!!! 此代码无法编译!!!
    case String s &&!s.isEmpty() -> String.format("Non-empty string %s", s);
    case Object o -> String.format("Object %s", o.toString());
};
```
事实证明，Switch 的模式匹配已扩展为允许在类型模式后添加布尔表达式。这个布尔表达式称为守卫，结果 case 标签称为受保护的 case 标签。您可以使用以下语法在`when`子句中添加此布尔表达式：
```java
Object o =...; // 任何对象
String formatter = switch (o) {
    case String s when!s.isEmpty() -> String.format("Non-empty string %s", s);
    default -> String.format("Object %s", o.toString());
};
```
这个扩展的 case 标签称为受保护的 case 标签。表达式`String s when!s.isEmpty()`就是这样一个受保护的 case 标签。它由一个类型模式和一个布尔表达式组成。

## 记录模式
记录是一种特殊类型的不可变类，如以下所示，在 Java SE 16 中引入。您可以访问我们的记录页面以了解有关此功能的更多信息。
记录模式是一种特殊类型的模式，在 Java SE 21 中作为最终特性发布。它在 Java SE 19 和 20 中作为预览特性可用。记录是基于组件构建的，这些组件作为记录声明的一部分进行声明。在下面的示例中，`Point`记录有两个组件：`x`和`y`。
```java
public record Point(int x, int y) {}
```
此信息启用了一种称为记录解构的概念，用于记录模式匹配。以下代码是使用记录模式的第一个示例：
```java
Object o =...; // 任何对象
if (o instanceof Point(int x, int y)) {
    // 对 x 和 y 进行一些操作
}
```
目标操作数仍然是`o`引用。它与记录模式进行匹配：`Point(int x, int y)`。这个模式声明了两个模式变量：`x`和`y`。如果`o`确实是`Point`类型，那么这两个绑定变量将通过调用`Point`记录的相应访问器来创建和初始化。这一点很重要，因为您可能在这些访问器中有一些防御性复制。
记录模式是由记录的名称（在这个例子中是`Point`）和该记录的每个组件的一个类型模式构建的。因此，当您编写`o instanceof Point(int x, int y)`时，`int x`和`int y`是类型模式，用于匹配`Point`记录的第一个和第二个组件。请注意，在这种情况下，您使用基本类型定义类型模式。
记录模式是基于记录的规范构造函数构建的。即使您在给定记录中创建了规范构造函数之外的其他构造函数，该记录的记录模式始终遵循规范构造函数的语法。因此，以下代码无法编译：
```java
record Point(int x, int y) {
    Point(int x) {
        this(x, 0);
    }
}

Object o =...; // 任何对象
//!!! 此代码无法编译!!!
if (o intanceof Point(int x)) {

}
```
记录模式支持类型推断。您用于编写模式的组件的类型可以使用`var`推断，也可以是记录中声明的实际类型的扩展。
因为每个组件的匹配实际上是一个类型模式，所以您可以匹配一个是组件实际类型扩展的类型。如果您在模式中使用的类型不能是记录组件实际类型的扩展，那么您将得到一个编译器错误。
以下是一个示例，您可以要求编译器推断绑定变量的实际类型：
```java
record Point(double x, double y) {}

Object o ==...; // 任何对象
if (o instanceof Point(var x, var y)) {
    // x 和 y 是 double 类型
}
```
在以下示例中，您可以根据`Box`记录的组件类型进行切换：
```java
record Box(Object o) {}

Object o =...; // 任何对象
switch (o) {
    case Box(String s) -> System.out.println("Box contains the string: " + s);
    case Box(Integer i) -> System.out.println("Box contains the integer: " + i);
    default -> System.out.println("Box contains something else");
}
```
就像 instanceof 一样，您不能检查不可能的类型。在这里，类型`Integer`不能扩展类型`CharSequence`，会生成编译器错误。
```java
record Box(CharSequence o) {}

Object o =...; // 任何对象
switch (o) {
    case Box(String s) -> System.out.println("Box contains the string: " + s);
    //!!! 以下行无法编译!!!
    case Box(Integer i) -> System.out.println("Box contains the integer: " + i);
    default -> System.out.println("Box contains something else");
}
```
记录模式不支持装箱或拆箱。因此，以下代码无效：
```java
record Point(Integer x, Integer y) {}

Object o =...; // 任何对象
//!!! 无法编译!!!
if (o instanceof Point(int x, int y)) {
}
```
最后一点：记录模式支持嵌套，因此您可以编写以下代码：
```java
record Point(double x, double y) {}
record Circle(Point center, double radius) {}

Object o =...; // 任何对象
if (o instanceof Circle(Point(var x, var y), var radius)) {
    // 对 x、y 和 radius 进行一些操作
}
```

## 更多模式
Java 语言中的三个元素现在支持模式匹配，作为最终特性或预览特性：
 - `instanceof`关键字，
 - `switch`语句和表达式，
 - `for`循环的扩展。
它们都支持两种模式：类型模式和记录模式。
在不久的将来会有更多的内容。Java 语言的更多元素可能会被修改，并且会添加更多类型的模式。此页面将更新以反映这些修改。
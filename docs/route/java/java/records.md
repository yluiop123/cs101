# 使用Record来建模不可变数据

Java语言为您提供了几种创建不可变类的方法。可能最直接的方法是创建一个带有最终字段的final类，并使用构造函数来初始化这些字段。以下是一个此类的示例。

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```

现在您已经编写了这些元素，您需要为您的字段添加访问器。您还将添加一个`toString()`方法，可能还会添加一个`equals()`以及一个`hashCode()`方法。手动编写所有这些内容相当繁琐且容易出错，幸运的是，您的IDE可以为您生成这些方法。

如果您需要将此类的实例从一个应用程序传输到另一个应用程序，无论是通过网络发送还是通过文件系统，您可能还会考虑使此类可序列化。如果这样做，您可能需要添加一些有关此类实例如何序列化的信息。JDK为您提供了几种控制序列化的方法。

最终，您的`Point`类可能长达一百行，大部分由IDE生成的代码填充，只是为了模拟您需要写入文件的两个整数的不可变聚合。

记录已经被添加到JDK中以改变这一点。记录通过一行代码为您提供所有这些。您所要做的就是声明记录的状态；其余的由编译器为您生成。

## 用Records优化
记录在这里帮助您使这段代码更简单。从Java SE 14开始，您可以编写以下代码。

```java
public record Point(int x, int y) {}
```

这一行代码为您创建了以下元素。

1. 它是一个有两个字段`x`和`y`的不可变类，类型为`int`。
2. 它有一个规范构造函数，用于初始化这两个字段。
3. `toString()`、`equals()`和`hashCode()`方法已由编译器为您创建，默认行为对应于IDE生成的内容。如果需要，您可以通过添加这些方法的自己的实现来修改这种行为。
4. 它可以实现`Serializable`接口，以便您可以通过网络或文件系统将`Point`的实例发送到其他应用程序。记录的序列化和反序列化遵循本教程末尾介绍的一些特殊规则。

记录使创建数据的不可变聚合变得更简单，无需任何IDE的帮助。它减少了错误的风险，因为每次您修改记录的组件时，编译器都会自动为您更新`equals()`和`hashCode()`方法。

## Record类
记录是使用`record`关键字而不是`class`关键字声明的类。让我们声明以下记录。

```java
public record Point(int x, int y) {}
```

编译器在您创建记录时为您创建的类是final的。

这个类扩展了`java.lang.Record`类。因此，您的记录不能扩展任何类。

记录可以实现任意数量的接口。

## 定义一个Record的组件
紧随记录名称之后的块`(int x, int y)`声明了名为`Point`的记录的组件。对于记录的每个组件，编译器都会创建一个同名的私有最终字段。您可以在记录中声明任意数量的组件。

在这个例子中，编译器创建了两个类型为`int`的私有最终字段：`x`和`y`，对应于您声明的两个组件。

除了这些字段，编译器为每个组件生成了一个访问器。这个访问器是一个方法，具有与组件相同的名称，并返回其值。在这个`Point`记录的情况下，生成的两个方法是以下内容。

```java
public int x() {
    return this.x;
}

public int y() {
    return this.y;
}
```

如果此实现适用于您的应用程序，则您不需要添加任何内容。但您可以定义自己的访问器方法。在需要返回特定字段的防御性副本的情况下，这可能很有用。

编译器为您生成的最后几个元素是`Object`类中`toString()`、`equals()`和`hashCode()`方法的覆盖。如果需要，您可以定义这些方法的自己的覆盖。

## 您不能向Record添加的内容
有三件事您不能向记录添加：

1. 您不能在记录中声明任何实例字段。您不能添加任何实例字段，这些字段不对应于组件。
2. 您不能定义任何字段初始化器。
3. 您不能添加任何实例初始化器。

您可以创建带有初始化器的静态字段和静态初始化器。

## 使用规范构造函数构建Record
编译器还为您创建了一个构造函数，称为规范构造函数。这个构造函数将记录的组件作为参数，并将其值复制到记录类的字段中。

有时您需要覆盖此默认行为。让我们检查两个用例：

1. 您需要验证记录的状态
2. 您需要对可变组件进行防御性副本

## 使用紧凑构造函数
您可以使用两种不同的语法来重新定义记录的规范构造函数。您可以使用紧凑构造函数或规范构造函数本身。

假设您有以下记录。

```java
public record Range(int start, int end) {}
```

对于这个名字的记录，人们可能会期望`end`大于`start`。您可以通过在记录中编写紧凑构造函数来添加验证规则。

```java
public record Range(int start, int end) {

    public Range {
        if (end <= start) {
            throw new IllegalArgumentException("End cannot be lesser than start");
        }
    }
}
```

紧凑规范构造函数不需要声明其参数块。

请注意，如果您选择这种语法，您不能直接分配记录字段，例如使用`this.start = start` - 这是由编译器添加的代码为您完成的。但您可以为参数分配新值，这会导致相同的结果，因为编译器生成的代码随后将这些新值分配给字段。

```java
public Range {
    // 将负的start和end设置为0
    // 通过重新分配紧凑构造函数的
    // 隐式参数
    if (start < 0)
        start = 0;
    if (end < 0)
        end = 0;
}

```

## 使用规范构造函数

如果您更喜欢非紧凑形式，例如因为您不想重新分配参数，您可以像以下示例中那样自己定义规范构造函数。

```java
public record Range(int start, int end) {

    public Range(int start, int end) {
        if (end <= start) {
            throw new IllegalArgumentException("End cannot be lesser than start");
        }
        if (start < 0) {
            this.start = 0;
        } else {
            this.start = start;
        }
        if (end > 100) {
            this.end = 10;
        } else {
            this.end = end;
        }
    }
}
```

在这种情况下，您编写的构造函数需要将值分配给记录的字段。

如果您记录的组件不是不可变的，您应该考虑在规范构造函数和访问器中对它们进行防御性副本。

## 定义任何构造函数

您也可以向记录添加任何构造函数，只要这个构造函数调用了记录的规范构造函数即可。语法与使用另一个构造函数调用构造函数的经典语法相同。对于任何类，对`this()`的调用必须是构造函数的第一个语句。

让我们检查以下`State`记录。它定义在三个组件上：

1. 这个州的名称
2. 这个州首府的名称
3. 一个城市名称列表，可以为空。

我们需要存储城市列表的防御性副本，以确保它不会从记录的外部被修改。

这可以通过使用紧凑形式重新定义规范构造函数来完成，该形式将参数重新分配为防御性副本。

在您的应用程序中，有一个不接收任何城市的构造函数是有用的。这可以是另一个只接收州名称和首府城市名称的构造函数。这第二个构造函数必须调用规范构造函数。

然后，您可以将城市作为可变参数传递。为此，您可以创建第三个构造函数，该构造函数必须使用适当的列表调用规范构造函数。

```java
public record State(String name, String capitalCity, List<String> cities) {

    public State {
        // List.copyOf返回一个不可修改的副本，
        // 因此分配给`cities`的列表不能再改变了
        cities = List.copyOf(cities);
    }

    public State(String name, String capitalCity) {
        this(name, capitalCity, List.of());
    }

    public State(String name, String capitalCity, String... cities) {
        this(name, capitalCity, List.of(cities));
    }

}
```

请注意，`List.copyOf()`方法不接受它作为参数接收的集合中的空值。

## 获取Record的状态

您不需要向记录添加任何访问器，因为编译器为您完成了这项工作。记录为每个组件都有一个访问器方法，该方法的名称与该组件相同。

本教程第一部分中的`Point`记录有两个访问器方法：`x()`和`y()`，它们返回相应组件的值。

尽管如此，有时您需要定义自己的访问器。

例如，假设上一节中的`State`记录在构建期间没有创建`cities`列表的不可修改防御性副本 - 那么它应该在访问器中这样做，以确保调用者不能更改其内部状态。

您可以在`State`记录中添加以下代码以返回此防御性副本。

```java
public List<String> cities() {
    return List.copyOf(cities);
}
```

## 序列化Record

如果您的记录类实现了`Serializable`，则可以序列化和反序列化记录。但有一些限制。

1. 您不能使用任何系统来替换记录的默认序列化过程。创建`writeObject()`和`readObject()`方法没有效果，实现`Externalizable`也没有效果。
2. 记录可以用作代理对象来序列化其他对象。`readResolve()`方法可以返回一个记录。在记录中添加`writeReplace()`也是可能的。
3. 反序列化记录总是调用规范构造函数。因此，在构造函数中添加的所有验证规则将在反序列化记录时得到强制执行。

这使得记录成为在应用程序中创建数据传输对象的非常好的选择。

## 在真实用例中使用Record

记录是一个多功能的概念，您可以在许多上下文中使用它。

第一个是在应用程序的对象模型中传输数据。您可以使用记录来执行它们被设计的目的：充当不可变数据载体。

因为您可以声明局部记录，所以您也可以使用它们来提高代码的可读性。

让我们考虑以下用例。您有两个实体被建模为记录：`City`和`State`。

```java
public record City(String name, State state) {}
```

```java
public record State(String name) {}
```

假设您有一系列城市，并且您需要计算拥有最多城市数量的州。您可以使用Stream API首先构建每个州的城市数量的直方图。这个直方图由`Map`建模。

```java
List<City> cities = List.of();

Map<State, Long> numberOfCitiesPerState =
    cities.stream()
          .collect(Collectors.groupingBy(
                   City::state, Collectors.counting()
          ));
```

获取这个直方图的最大值是以下通用代码。

```java
Map.Entry<State, Long> stateWithTheMostCities =
    numberOfCitiesPerState.entrySet().stream()
                          .max(Map.Entry.comparingByValue())
                          .orElseThrow();
```

这段最后的代码是技术性的；它不携带任何商业意义；因为它使用`Map.Entry`实例来模拟直方图的每个元素。

使用局部记录可以大大改善这种情况。以下代码创建了一个新的记录类，它聚合了一个州和该州的城市数量。它有一个构造函数，该构造函数以`Map.Entry`实例作为参数，将键值对流映射到记录流。

因为您需要按城市数量比较这些聚合，所以您可以添加一个工厂方法来提供这个比较器。代码变为以下内容。

```java
record NumberOfCitiesPerState(State state, long numberOfCities) {

    public NumberOfCitiesPerState(Map.Entry<State, Long> entry) {
        this(entry.getKey(), entry.getValue());
    }

    public static Comparator<NumberOfCitiesPerState> comparingByNumberOfCities() {
        return Comparator.comparing(NumberOfCitiesPerState::numberOfCities);
    }
}

NumberOfCitiesPerState stateWithTheMostCities =
    numberOfCitiesPerState.entrySet().stream()
                          .map(NumberOfCitiesPerState::new)
                          .max(NumberOfCitiesPerState.comparingByNumberOfCities())
                          .orElseThrow();
```

您的代码现在以一种有意义的方式提取最大值。您的代码更易于阅读，更容易理解，更不容易出错，从长远来看也更容易维护。



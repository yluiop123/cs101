# 枚举

## 枚举是什么？

枚举是编译器已知所有实例的类。
它们用于创建只能具有少数可能值的类型。

枚举可以类似于类的方式创建，但使用 `enum` 关键字而不是 `class`。
在体内部，有一个枚举实例列表，称为枚举常量，这些常量用 `,` 分隔。
不能在枚举常量外部创建枚举的实例。

```java
public enum DayOfWeek {
    // 在这里列出枚举常量：
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

```

所有枚举隐式扩展 `java.lang.Enum` 并且不能有任何子类。

## 访问、计算和比较枚举

枚举的值可以像常量一样使用。
为了检查两个枚举实例是否相同，可以使用 `==` 运算符。

```java
DayOfWeek weekStart = DayOfWeek.MONDAY;

if (weekStart == DayOfWeek.MONDAY) {
    System.out.println("The week starts on Monday.");
}

```

也可以使用 `switch` 根据枚举的值执行操作。

```java
DayOfWeek someDay = DayOfWeek.FRIDAY;

switch (someDay) {
    case MONDAY -> 
        System.out.println("The week just started.");
    case TUESDAY, WEDNESDAY, THURSDAY -> 
        System.out.println("We are somewhere in the middle of the week.");
    case FRIDAY -> 
        System.out.println("The weekend is near.");
    case SATURDAY, SUNDAY -> 
        System.out.println("Weekend");
    default -> 
        throw new AssertionError("Should not happen");
}

```

使用 Switch 表达式，
编译器可以检查是否处理了枚举的所有值。
如果 Switch 表达式中缺少任何可能的值，将会出现编译器错误。
这被称为穷尽性，也可以通过 JEP 409：封闭类在常规类中实现。

```java
DayOfWeek someDay = DayOfWeek.FRIDAY;

String text = switch (someDay) {
    case MONDAY -> "The week just started.";
    case TUESDAY, WEDNESDAY, THURSDAY -> "We are somewhere in the middle of the week.";
    case FRIDAY -> "The weekend is near.";
    case SATURDAY, SUNDAY -> "Weekend";
};

System.out.println(text);

```

## 向枚举添加成员

就像类一样，枚举可以有构造函数、方法和字段。
为了添加这些，需要在枚举常量列表后添加 `;`。

```java
public enum DayOfWeek {
    MONDAY("MON"), TUESDAY("TUE"), WEDNESDAY("WED"), THURSDAY("THU"), FRIDAY("FRI"), SATURDAY("SAT"), SUNDAY("SUN");

    private final String abbreviation;

    DayOfWeek(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getAbbreviation() {
        return abbreviation;
    }
}

```

## 特殊方法

所有枚举隐式添加了一些方法。

例如，所有枚举实例中都存在 `name()` 方法，可以用来获取枚举常量的名称。
类似地，名为 `ordinal()` 的方法返回枚举常量在声明中的位置。

```java
System.out.println(DayOfWeek.MONDAY.name());    // 打印 "MONDAY"
System.out.println(DayOfWeek.MONDAY.ordinal()); // 打印 "0" 因为 MONDAY 是 DayOfWeek 枚举中的第一个常量

```

除了实例方法，还向所有枚举添加了静态方法。
`values()` 方法返回包含枚举所有实例的数组，`valueOf(String)` 方法可以根据名称获取特定实例。

```java
DayOfWeek[] days = DayOfWeek.values(); // 一周的所有日子
DayOfWeek monday = DayOfWeek.valueOf("MONDAY");

```

此外，枚举实现了 `Comparable` 接口。
默认情况下，枚举按照它们的序数编号排序，即按照枚举常量出现的顺序排序。
这允许比较枚举实例以及排序或搜索。

```java
public void compareDayOfWeek(DayOfWeek dayOfWeek){
    int comparison = dayOfWeek.compareTo(DayOfWeek.WEDNESDAY);
    if ( comparison < 0) {
        System.out.println("It's before the middle of the work week.");
    } else if(comparison > 0){
        System.out.println("It's after the middle of the work week.");
    } else {
        System.out.println("It's the middle of the work week.");
    }
}

```

```java
List<DayOfWeek> days = new ArrayList<>(List.of(DayOfWeek.FRIDAY, DayOfWeek.TUESDAY, DayOfWeek.SATURDAY));
Collections.sort(days);

```

## 将枚举用作单例

由于枚举只能有特定数量的实例，因此可以通过创建只有一个枚举常量的枚举来创建单例。

```java
public enum SomeSingleton {
    INSTANCE;
    // 字段、方法等
}

```

## 枚举中的抽象方法

尽管枚举不能被扩展，但它们仍然可以有 `abstract` 方法。在这种情况下，每个枚举常量中都必须有实现。

```java
enum MyEnum {
    A() {
        @Override
        void doSomething() {
            System.out.println("a");
        }
    },
    B() {
        @Override
        void doSomething() {
            System.out.println("b");
        }
    };

    abstract void doSomething();
}

```

## 注意事项

在使用枚举实例数量（或名称）可能更改的地方时要小心。
每当更改枚举常量时，期望旧版本的枚举的其他代码可能无法按预期工作。
这可能表现为编译错误（例如，引用已删除的枚举常量时）、
运行时错误（例如，如果有 `default` 案例，尽管新的枚举常量应该单独处理）或其他不一致性（例如，如果枚举的值被保存到文件中，然后该文件被读取并期望该值仍然存在）。

更改枚举常量时，建议审查所有使用枚举的代码。
这在枚举也被其他人的代码使用的情况下尤为重要。

此外，如果实例数量很多，可能需要考虑使用其他选项，
因为在代码中的一个位置列出许多实例可能不够灵活。
例如，在这种情况下，可能更好地使用配置文件列出所有实例并在程序中读取这些配置文件。

## 结论

枚举提供了一种简单安全的方式来表示固定集合的常量，同时保持了类的大部分灵活性。它们是一种特殊类型的类，可以用来编写优雅、可读和可维护的代码，并能很好地与像 Switch 表达式这样的其他现代特性一起使用。另一种特殊类是在 Java 19 中引入的 Record 类。访问我们的 Records 教程了解更多。

要了解更多关于枚举的信息，请访问 `java.lang.Enum` 的 javadoc。


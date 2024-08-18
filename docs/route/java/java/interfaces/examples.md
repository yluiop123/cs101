# 接口的实现
## 定义接口 Relatable

要声明一个实现接口的类，你需要在类声明中包含一个 `implements` 子句。你的类可以实现多个接口，因此 `implements` 关键字后面跟着由逗号分隔的接口列表，这些接口由类实现。按照惯例，如果有 `extends` 子句，`implements` 子句跟在它后面。

考虑一个定义如何比较多个对象大小的接口。

```java
public interface Relatable {
    // 调用 isLargerThan() 的对象（this）
    // 和 other 必须是同一个类的实例
    // 如果 this 大于、等于或小于 other，返回 1、0、-1
    public int isLargerThan(Relatable other);
}

```

如果你想能够比较多个相似对象的大小，无论它们是什么，实例化它们的类应该实现 `Relatable`。

如果存在某种方法来比较多个由类实例化的对象的相对“大小”，那么任何类都可以实现 `Relatable`。对于字符串，可以是比较字符数量；对于书籍，可以是比较页数；对于学生，可以是体重；等等。对于平面几何对象，面积是一个很好的选择（见后面的 `RectanglePlus` 类），而对于三维几何对象，可以使用体积。所有这些类都可以实现 `isLargerThan()` 方法。

如果你知道一个类实现了 `Relatable`，那么你知道你可以比较多个由该类实例化的对象的大小。

## 实现 Relatable 接口

这里是在创建对象部分介绍的 `Rectangle` 类，重写为实现 `Relatable`。

```java
public class RectanglePlus implements Relatable {
    public int width = 0;
    public int height = 0;
    public Point origin;

    // 四个构造函数
    public RectanglePlus() {
        origin = new Point(0, 0);
    }
    public RectanglePlus(Point p) {
        origin = p;
    }
    public RectanglePlus(int w, int h) {
        origin = new Point(0, 0);
        width = w;
        height = h;
    }
    public RectanglePlus(Point p, int w, int h) {
        origin = p;
        width = w;
        height = h;
    }

    // 移动矩形的方法
    public void move(int x, int y) {
        origin.x = x;
        origin.y = y;
    }

    // 计算矩形面积的方法
    public int getArea() {
        return width * height;
    }

    // 实现 Relatable 接口所需的方法
    public int isLargerThan(Relatable other) {
        RectanglePlus otherRect = (RectanglePlus)other;
        if (this.getArea() < otherRect.getArea())
            return -1;
        else if (this.getArea() > otherRect.getArea())
            return 1;
        else
            return 0;
    }
}

```

由于 `RectanglePlus` 实现了 `Relatable`，任何两个 `RectanglePlus` 对象的大小都可以被比较。

> 注意：`isLargerThan()` 方法，在 `Relatable` 接口中定义，接受一个 `Relatable` 类型的对象。代码行将 other 强制转换为 `RectanglePlus` 实例。类型转换告诉编译器对象的实际类型。直接在 other 实例上调用 `getArea()`（`other.getArea()`）将无法编译，因为编译器不理解 other 实际上是 `RectanglePlus` 的一个实例。

## 接口的演进

考虑一个你已经开发的名为 `DoIt` 的接口：

```java
public interface DoIt {
   void doSomething(int i, double x);
   int doSomethingElse(String s);
}

```

假设在后来，你想要给 `DoIt` 添加第三个方法，使接口现在变成：

```java
public interface DoIt {
   void doSomething(int i, double x);
   int doSomethingElse(String s);
   boolean didItWork(int i, double x, String s);
}

```

如果你进行这个改变，那么所有实现了旧 `DoIt` 接口的类将会中断，因为它们不再实现旧接口。依赖这个接口的程序员将会大声抗议。

尽量预见你接口的所有用途，并从一开始就完全指定它。如果你想向接口添加额外的方法，你有几个选择。你可以创建一个 `DoItPlus` 接口，它扩展了 `DoIt`：

```java
public interface DoItPlus extends DoIt {
   boolean didItWork(int i, double x, String s);
}

```

现在使用你代码的用户可以选择继续使用旧接口或升级到新接口。

或者，你可以将新方法定义为默认方法。以下示例定义了一个名为 `didItWork()` 的默认方法：

```java
public interface DoIt {
   void doSomething(int i, double x);
   int doSomethingElse(String s);
   default boolean didItWork(int i, double x, String s) {
       // 方法体
   }
}

```

注意，你必须为默认方法提供实现。你也可以为现有接口定义新的静态方法。拥有实现了带有新默认或静态方法的接口的类的使用者不必修改或重新编译他们的代码以适应额外的方法。

## 默认方法

接口部分描述了一个涉及计算机控制汽车制造商的例子，他们发布了行业标准接口，描述了可以调用哪些方法来操作他们的汽车。如果这些计算机控制汽车制造商向他们的汽车添加新功能，比如飞行，会怎样？这些制造商将需要指定新的方法，以使其他公司（如电子导航仪器制造商）能够将他们的软件适应飞行汽车。这些汽车制造商将在哪里声明这些新的与飞行相关的方法？如果他们将它们添加到他们原始的接口中，那么实现了这些接口的程序员将不得不重写他们的实现。如果他们将它们作为静态方法添加，那么程序员将把它们视为实用方法，而不是关键的核心方法。

默认方法使你能够向您的库接口添加新功能，并确保与为旧版本接口编写的代码保持二进制兼容性。

考虑以下 `TimeClient` 接口：

```java
import java.time.*;

public interface TimeClient {
    void setTime(int hour, int minute, int second);
    void setDate(int day, int month, int year);
    void setDateAndTime(int day, int month, int year, int hour, int minute, int second);
    LocalDateTime getLocalDateTime();
}

```

以下类 `SimpleTimeClient` 实现了 `TimeClient`：

```java
public class SimpleTimeClient implements TimeClient {

    private LocalDateTime dateAndTime;

    public SimpleTimeClient() {
        dateAndTime = LocalDateTime.now();
    }

    public void setTime(int hour, int minute, int second) {
        LocalDate currentDate = LocalDate.from(dateAndTime);
        LocalTime timeToSet = LocalTime.of(hour, minute, second);
        dateAndTime = LocalDateTime.of(currentDate, timeToSet);
    }

    // ... 其他方法
}

```

假设你想要向 `TimeClient` 接口添加新功能，比如通过 `ZonedDateTime` 对象指定时区的能力（它就像 `LocalDateTime` 对象，只是它存储时区信息）：

```java
public interface TimeClient {
    // ... 其他方法
    ZonedDateTime getZonedDateTime(String zoneString);
}

```

按照对 `TimeClient` 接口的这种修改，你也将不得不修改 `SimpleTimeClient` 类并实现 `getZonedDateTime()` 方法。然而，而不是把 `getZonedDateTime()` 留为抽象的（就像前面的例子），你可以改为定义一个默认实现。（记住，抽象方法是没有实现声明的方法。）

```java
public interface TimeClient {
    // ... 其他方法

    static ZoneId getZoneId (String zoneString) {
        try {
            return ZoneId.of(zoneString);
        } catch (DateTimeException e) {
            System.err.println("Invalid time zone: " + zoneString +
                "; using default time zone instead.");
            return ZoneId.systemDefault();
        }
    }

    default ZonedDateTime getZonedDateTime(String zoneString) {
        return ZonedDateTime.of(getLocalDateTime(), getZoneId(zoneString));
    }
}

```

你通过方法签名开头的 `default` 关键字指定接口中的一个方法定义是默认方法。接口中的所有方法声明，包括默认方法，隐式地是公共的，所以你可以将公共修饰符省略。

有了这个接口，你不必修改 `SimpleTimeClient` 类，这个类（和任何实现 `TimeClient` 接口的类）将已经定义了 `getZonedDateTime()` 方法。以下示例，`TestSimpleTimeClient`，从 `SimpleTimeClient` 的一个实例调用 `getZonedDateTime()` 方法：

```java
public class TestSimpleTimeClient {
    public static void main(String... args) {
        TimeClient myTimeClient = new SimpleTimeClient();
        System.out.println("Current time: " + myTimeClient.toString());
        System.out.println("Time in California: " +
            myTimeClient.getZonedDateTime("Blah blah").toString());
    }
}

```

## 扩展包含默认方法的接口

当你扩展一个包含默认方法的接口时，你可以做以下事情：

- 完全不提及默认方法，这让你扩展的接口继承默认方法。
- 重新声明默认方法，这使它变为抽象的。
- 重新定义默认方法，这将覆盖它。

假设你以以下方式扩展 `TimeClient` 接口：

```java
public interface AnotherTimeClient extends TimeClient { }

```

任何实现接口 `AnotherTimeClient` 的类都将具有由 `TimeClient.getZonedDateTime()` 指定的实现。

假设你以以下方式扩展 `TimeClient` 接口：

```java
public interface AbstractZoneTimeClient extends TimeClient {
    public ZonedDateTime getZonedDateTime(String zoneString);
}

```

任何实现接口 `AbstractZoneTimeClient` 的类都将必须实现 `getZonedDateTime()` 方法；这个方法像接口中的所有非默认（和非静态）方法一样是抽象方法。

假设你以以下方式扩展 `TimeClient` 接口：

```java
public interface HandleInvalidTimeZoneClient extends TimeClient {
    default public ZonedDateTime getZonedDateTime(String zoneString) {
        try {
            return ZonedDateTime.of(getLocalDateTime(),ZoneId.of(zoneString));
        } catch (DateTimeException e) {
            System.err.println("Invalid zone ID: " + zoneString +
                "; using the default time zone instead.");
            return ZonedDateTime.of(getLocalDateTime(),ZoneId.systemDefault());
        }
    }
}

```

任何实现接口 `HandleInvalidTimeZoneClient` 的类将使用由这个接口指定的 `getZonedDateTime()` 实现，而不是由接口 `TimeClient` 指定的实现。

## 静态方法

除了默认方法，你还可以定义接口中的静态方法。（静态方法是与它定义的类相关联的方法，而不是与任何对象相关联。类的每个实例共享其静态方法。）这使你能够更容易地在库中组织辅助方法；你可以将特定于接口的静态方法保留在同一个接口中，而不是在单独的类中。以下示例定义了一个静态方法，它检索与时区标识符对应的 `ZoneId` 对象；如果没有对应给定标识符的 `ZoneId` 对象，则使用系统默认时区。（因此，你可以简化方法 `getZonedDateTime()`）：

```java
public interface TimeClient {
    // ...
    static public ZoneId getZoneId (String zoneString) {
        try {
            return ZoneId.of(zoneString);
        } catch (DateTimeException e) {
            System.err.println("Invalid time zone: " + zoneString +
                "; using default time zone instead.");
            return ZoneId.systemDefault();
        }
    }

    default public ZonedDateTime getZonedDateTime(String zoneString) {
        return ZonedDateTime.of(getLocalDateTime(), getZoneId(zoneString));
    }
}

```

与类中的静态方法一样，你通过方法签名开头的 `static` 关键字指定接口中的方法定义是静态方法。接口中的所有方法声明，包括静态方法，隐式地是公共的，所以你可以将公共修饰符省略。

从 Java SE 9 开始，你可以在接口中定义私有方法，以从接口的默认方法中抽象出共同的代码片段，同时定义其实现。
这些方法属于实现，它们在定义时既不能是默认的也不能是抽象的。
例如，你可以使 `getZoneId` 方法私有，因为它包含一段对接口实现内部的代码。

## 将默认方法集成到现有库中

默认方法使你能够向现有接口添加新功能，并确保与为旧版本接口编写的代码保持二进制兼容性。特别是，默认方法使你能够向现有接口添加接受 lambda 表达式作为参数的方法。本节演示了如何通过默认方法和静态方法增强 `Comparator` 接口。

考虑 `Card` 和 `Deck` 类。`Card` 接口包含两个 `enum` 类型（`Suit` 和 `Rank`）和两个抽象方法（`getSuit()` 和 `getRank()`）：

```java
public interface Card extends Comparable<Card> {

    public enum Suit {
        DIAMONDS (1, "Diamonds"),
        CLUBS    (2, "Clubs"),
        HEARTS   (3, "Hearts"),
        SPADES   (4, "Spades");

        // ... 其他方法
    }

    public enum Rank {
        DEUCE  (2 , "Two"),
        THREE  (3 , "Three"),
        // ... 其他常量和方法
    }

    public Card.Suit getSuit();
    public Card.Rank getRank();
}

```

`Deck` 接口包含多种操作方法，用于操作一副牌中的牌：

```java
public interface Deck {
    List<Card> getCards();
    Deck deckFactory();
    int size();
    void addCard(Card card);
    void addCards(List<Card> cards);
    void addDeck(Deck deck);
    void shuffle();
    void sort();
    void sort(Comparator<Card> c);
    String deckToString();

    Map<Integer, Deck> deal(int players, int numberOfCards)
        throws IllegalArgumentException;
}

```

`PlayingCard` 类实现了 `Card` 接口，而 `StandardDeck` 类实现了 `Deck` 接口。

```java
public class PlayingCard implements Card {

    private Rank rank;
    private Suit suit;

    // 构造函数
    // 实现 Card 抽象方法

    // compareTo(), toString(), equals(), hashCode() 等方法
}

```

`StandardDeck` 类实现了抽象方法 `Deck.sort()` 如下：

```java
public class StandardDeck implements Deck {

    private List<Card> entireDeck;

    // 构造函数，访问器
    // 你需要添加所有 Deck 中的方法

    public void sort() {
        Collections.sort(entireDeck);
    }

    // toString(), equals(), hashCode() 等方法
}

```

`Collections.sort()` 方法对实现了 `Comparable` 接口的 `List` 实例进行排序。成员 `entireDeck` 是 `List` 的一个实例，其元素类型为 `Card`，它扩展了 `Comparable`。`PlayingCard` 类实现了 `Comparable.compareTo()` 方法如下：

```java
public int hashCode() {
    return ((suit.value()-1)*13)+rank.value();
}

public int compareTo(Card o) {
    return this.hashCode() - o.hashCode();
}

```

`compareTo()` 方法导致 `StandardDeck.sort()` 方法首先按花色，然后按等级对牌进行排序。

如果你想按等级对牌进行排序，然后再按花色排序，你会怎么做？你需要实现 `Comparator` 接口来指定新的排序标准，并使用 `sort(List<T> list, Comparator<? super T> c)` 方法（包含 `Comparator` 参数的排序方法版本）。你可以在 `StandardDeck` 类中定义以下方法：

```java
public void sort(Comparator<Card> c) {
    Collections.sort(entireDeck, c);
}

```

有了这个方法，你可以指定 `Collections.sort()` 方法如何对 `Card` 类的实例进行排序。一种方法是实现 `Comparator` 接口来指定你希望牌如何排序。示例 `SortByRankThenSuit` 就是这样做的：

```java
public class SortByRankThenSuit implements Comparator<Card> {
    public int compare(Card firstCard, Card secondCard) {
        int compVal =
            firstCard.getRank().value() - secondCard.getRank().value();
        if (compVal != 0)
            return compVal;
        else
            return firstCard.getSuit().value() - secondCard.getSuit().value();
    }
}

```

以下调用首先按等级，然后按花色对扑克牌进行排序：

```java
StandardDeck myDeck = new StandardDeck();
myDeck.shuffle();
myDeck.sort(new SortByRankThenSuit());

```

然而，这种方法过于冗长；如果你能够只指定排序标准而避免创建多个排序实现会更好。假设你是编写 `Comparator` 接口的开发者。你可以向 `Comparator` 接口添加哪些默认或静态方法，以使其他开发者更容易指定排序标准？

首先，假设你想要按等级对扑克牌进行排序，不考虑花色。你可以按以下方式调用 `StandardDeck.sort()` 方法：

```java
StandardDeck myDeck = new StandardDeck();
myDeck.shuffle();
myDeck.sort(
    (firstCard, secondCard) ->
        firstCard.getRank().value() - secondCard.getRank().value()
);

```

因为接口 `Comparator` 是一个函数式接口，你可以使用 lambda 表达式作为 `sort()` 方法的参数。在这个例子中，lambda 表达式比较两个整数值。

如果你的开发人员能够仅通过调用方法 `Card.getRank()` 来创建 `Comparator` 实例，那将更简单。特别是，如果你的开发人员能够创建一个 `Comparator` 实例，它比较任何能够从 `getValue()` 或 `hashCode()` 等方法返回数值的对象，那将很有帮助。`Comparator` 接口已经通过静态方法 comparing 增强了这种能力：

```java
myDeck.sort(Comparator.comparing((card) -> card.getRank()));

```

在这个例子中，你可以使用方法引用代替：

```java
myDeck.sort(Comparator.comparing(Card::getRank));

```

这个调用更好地展示了如何指定不同的排序标准，并避免创建多个排序实现。

`Comparator` 接口已经通过其他版本的静态方法 comparing 增强了，如 `comparingDouble()` 和 `comparingLong()`，它们使你能够创建比较其他数据类型的 `Comparator` 实例。

假设你的开发人员想要创建一个 `Comparator` 实例，它可以根据多个标准比较对象。例如，你如何首先按等级，然后按花色对扑克牌进行排序？和以前一样，你可以使用 lambda 表达式来指定这些排序标准：

```java
StandardDeck myDeck = new StandardDeck();
myDeck.shuffle();
myDeck.sort(
    (firstCard, secondCard) -> {
        int compare =
            firstCard.getRank().value() - secondCard.getRank().value();
if (compare != 0)
            return compare;
        else
            return firstCard.getSuit().value() - secondCard.getSuit().value();
    }
);

```

如果你的开发人员能够从一系列 `Comparator` 实例构建一个 `Comparator` 实例，那将更简单。`Comparator` 接口已经通过默认方法 `thenComparing()` 增强了这种能力：

```java
myDeck.sort(
    Comparator
        .comparing(Card::getRank)
        .thenComparing(Comparator.comparing(Card::getSuit))
);

```

`Comparator` 接口已经通过其他版本的默认方法 `thenComparing()` 增强了，如 `thenComparingDouble()` 和 `thenComparingLong()`，它们使你能够构建比较其他数据类型的 `Comparator` 实例。

假设你的开发人员想要创建一个 `Comparator` 实例，使他们能够按相反的顺序对对象集合进行排序。例如，你如何首先按等级的降序，从 A 到 2（而不是从 2 到 A）对扑克牌进行排序？和以前一样，你可以指定另一个 lambda 表达式。然而，如果你的开发人员能够通过调用方法来反转现有的 `Comparator`，那将更简单。`Comparator` 接口已经通过默认方法 `reversed()` 增强了这种能力：

```java
myDeck.sort(
    Comparator.comparing(Card::getRank)
        .reversed()
        .thenComparing(Comparator.comparing(Card::getSuit))
);

```

这个例子演示了如何通过默认方法、静态方法、lambda 表达式和方法引用增强 `Comparator` 接口，以创建更具表现力的库方法，程序员可以通过查看它们的调用方式迅速推断出它们的功能。使用这些构造来增强你的库中的接口。
        


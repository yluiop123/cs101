# 多态

## 多态

多态性在字典中的定义是指生物学中一个生物体或物种可以有多种形式或阶段的原则。这个原则也可以应用于面向对象编程和像Java语言这样的语言。一个类的子类可以定义它们自己的独特行为，同时还能共享一些父类的相同功能。

多态性可以通过对`Bicycle`类进行小修改来演示。例如，可以向类中添加一个`printDescription()`方法，该方法显示在实例中当前存储的所有数据。

```java
public void printDescription(){
    System.out.println("\nBike is " + "in gear " + this.gear
        + " with a cadence of " + this.cadence +
        " and travelling at a speed of " + this.speed + ". ");
}
```

为了演示Java语言中的多态特性，用`MountainBike`和`RoadBike`类扩展`Bicycle`类。对于`MountainBike`，添加一个用于悬挂的字段，这是一个`String`值，表示自行车是否具有前减震器`Front`，或者具有前后减震器`Dual`。

这是更新后的类：

```java
public class MountainBike extends Bicycle {
    private String suspension;

    public MountainBike(
               int startCadence,
               int startSpeed,
               int startGear,
               String suspensionType){
        super(startCadence,
              startSpeed,
              startGear);
        this.setSuspension(suspensionType);
    }

    public String getSuspension(){
      return this.suspension;
    }

    public void setSuspension(String suspensionType) {
        this.suspension = suspensionType;
    }

    public void printDescription() {
        super.printDescription();
        System.out.println("The " + "MountainBike has a" +
            getSuspension() + " suspension.");
    }
}
```

注意重写的`printDescription()`方法。除了之前提供的信息外，输出中还包括了有关悬挂的额外数据。

接下来，创建`RoadBike`类。因为公路或赛车有细轮胎，添加一个属性来跟踪轮胎宽度。这是`RoadBike`类：

```java
public class RoadBike extends Bicycle{
    // 以毫米（mm）为单位
    private int tireWidth;

    public RoadBike(int startCadence,
                    int startSpeed,
                    int startGear,
                    int newTireWidth){
        super(startCadence,
              startSpeed,
              startGear);
        this.setTireWidth(newTireWidth);
    }

    public int getTireWidth(){
      return this.tireWidth;
    }

    public void setTireWidth(int newTireWidth){
        this.tireWidth = newTireWidth;
    }

    public void printDescription(){
        super.printDescription();
        System.out.println("The RoadBike" + " has " + getTireWidth() +
            " MM tires.");
    }
}
```

再次注意，`printDescription()`方法被重写了。这一次，显示了有关轮胎宽度的信息。

总结来说，有三个类：`Bicycle`、`MountainBike`和`RoadBike`。这两个子类重写了`printDescription()`方法并打印了独特的信息。

这是一个测试程序，它创建了三个`Bicycle`变量。每个变量被分配给三种自行车类之一。然后打印每个变量。

```java
public class TestBikes {
  public static void main(String[] args){
    Bicycle bike01, bike02, bike03;

    bike01 = new Bicycle(20, 10, 1);
    bike02 = new MountainBike(20, 10, 5, "Dual");
    bike03 = new RoadBike(40, 20, 8, 23);

    bike01.printDescription();
    bike02.printDescription();
    bike03.printDescription();
  }
}
```

以下是测试程序的输出：

```
Bike is in gear 1 with a cadence of 20 and travelling at a speed of 10.

Bike is in gear 5 with a cadence of 20 and travelling at a speed of 10.
The MountainBike has a Dual suspension.

Bike is in gear 8 with a cadence of 40 and travelling at a speed of 20.
The RoadBike has 23 MM tires.
```

Java虚拟机（JVM）调用每个变量引用的对象的适当方法。它不调用由变量类型定义的方法。这种行为称为虚拟方法调用，展示了Java语言中重要的多态性特性的一个方面。

## 隐藏字段
在类中，与超类中字段同名的字段会隐藏超类的字段，即使它们的类型不同。在子类中，不能通过简单名称引用超类的字段。相反，必须通过将在下一节中介绍的`super`来访问该字段。通常，我们不推荐隐藏字段，因为这会使代码难以阅读。

## 使用Super关键字
### 访问超类成员
如果您的方法重写了其超类的方法，您可以使用`super`关键字调用被重写的方法。您还可以使用`super`引用隐藏的字段（尽管隐藏字段是不被鼓励的）。考虑这个类，`Superclass`：

```java
public class Superclass {

    public void printMethod() {
        System.out.println("Printed in Superclass.");
    }
}

```

这里是一个名为`Subclass`的子类，它重写了`printMethod()`：

```java
public class Subclass extends Superclass {

    // 重写Superclass中的printMethod()
    public void printMethod() {
        super.printMethod();
        System.out.println("Printed in Subclass");
    }

    public static void main(String[] args) {
        Subclass s = new Subclass();
        s.printMethod();
    }
}

```

在`Subclass`中，简单名称`printMethod()`引用在`Subclass`中声明的，它重写了`Superclass`中的同名方法。因此，要引用从`Superclass`继承的`printMethod()`，`Subclass`必须使用`super`作为限定符，如上所示。编译和执行`Subclass`将打印以下内容：

```
Printed in Superclass.
Printed in Subclass
```

### 子类构造函数
以下示例说明了如何使用super关键字调用超类的构造函数。回想一下`Bicycle`示例中，`MountainBike`是`Bicycle`的子类。这里是调用超类构造函数并随后添加自己的初始化代码的`MountainBike`（子类）构造函数：

```java
public MountainBike(int startHeight,
                    int startCadence,
                    int startSpeed,
                    int startGear) {
    super(startCadence, startSpeed, startGear);
    seatHeight = startHeight;
}

```

调用超类构造函数必须是子类构造函数的第一行。

调用超类构造函数的语法是

```java
super();

```

或

```java
super(parameter list);

```

使用`super()`调用超类的无参数构造函数。使用`super(parameter list)`调用具有匹配参数列表的超类构造函数。

> 注意：如果构造函数没有显式调用超类构造函数，Java编译器会自动插入对超类无参数构造函数的调用。如果超类没有无参数构造函数，您将得到一个编译时错误。Object确实有这样的构造函数，所以如果`Object`是唯一的超类，就没有问题。

如果子类构造函数调用其超类的构造函数，无论是显式还是隐式，您可能认为会调用一连串的构造函数，一直回溯到`Object`的构造函数。事实上，情况确实如此。这称为_构造函数链_，当存在一长串类继承时需要注意。

## 编写最终类和方法
您可以声明一个类的所有方法或某些方法为final。您在方法声明中使用`final`关键字表示该方法不能被子类重写。`Object`类就是这样做的——它的一些方法是final的。

如果一个方法具有不应更改的实现，并且对对象的一致状态至关重要，您可能希望将其方法声明为final。例如，您可能希望使这个`ChessAlgorithm`类中的`getFirstPlayer()`方法为final：

```java
class ChessAlgorithm {
    enum ChessPlayer { WHITE, BLACK }
    ...
    final ChessPlayer getFirstPlayer() {
        return ChessPlayer.WHITE;
    }
    ...
}

```

通常应该将从构造函数调用的方法声明为final。如果构造函数调用了一个非final方法，子类可能会重新定义该方法，从而产生令人惊讶或不期望的结果。

注意，您也可以声明整个类为final。声明为final的类不能被继承。例如，当创建像`String`这样的不可变类时，这特别有用。

# 为类提供构造函数

## 定义构造函数
类包含构造函数，构造函数被调用以根据类蓝图创建对象。构造函数声明看起来像方法声明——只是它们使用类名称，并且没有返回类型。例如，`Bicycle`有一个构造函数：

```java
public Bicycle(int startCadence, int startSpeed, int startGear) {
    gear = startGear;
    cadence = startCadence;
    speed = startSpeed;
}
```

要创建一个名为`myBike`的新`Bicycle`对象，通过`new`操作符调用构造函数：

```java
Bicycle myBike = new Bicycle(30, 0, 8);
```

代码`new Bicycle(30, 0, 8)`在内存中为对象创建空间并初始化其字段。

尽管`Bicycle`只有一个构造函数，它也可以有其他的构造函数，包括无参数构造函数：

```java
public Bicycle() {
    gear = 1;
    cadence = 10;
    speed = 0;
}
```

代码`Bicycle yourBike = new Bicycle();`调用无参数构造函数来创建一个名为`yourBike`的新`Bicycle`对象。

由于它们有不同的参数列表，所以这两个构造函数都可以在`Bicycle`中声明。与方法一样，Java平台根据参数列表中的数量和类型区分构造函数。你不能为同一个类编写两个具有相同数量和类型参数的构造函数，因为编译器无法区分它们。这样做会导致编译时错误。

你不必为类提供任何构造函数，但这样做时必须小心。编译器会自动为没有任何构造函数的类提供无参数的默认构造函数。这个默认构造函数将调用超类的无参数构造函数。在这种情况下，如果超类没有无参数构造函数，编译器会报错，所以你必须确认它有。如果你的类没有显式的超类，那么它有一个隐式的超类`Object`，它确实有一个无参数构造函数。

你可以自己使用超类构造函数。本课程开头的`MountainBike`类就是这样做的。这将在后面的课程中讨论，即接口和继承的课程。

你可以在构造函数的声明中使用访问修饰符来控制哪些其他类可以调用构造函数。


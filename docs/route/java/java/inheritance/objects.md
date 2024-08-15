# 父类Object

## Object类的方法

Object类位于`java.lang`包中，位于类继承树的顶端。每个类都是Object类的直接或间接后裔。你使用或编写的每个类都继承了Object的实例方法。你不必使用这些方法，但如果选择这样做，可能需要用特定于你类的代码来覆盖它们。本节讨论从Object继承的方法包括：

- `protected Object clone() throws CloneNotSupportedException`: 创建并返回此对象的一个副本。
- `public boolean equals(Object obj)`: 指示某些其他对象是否“等于”此对象。
- `protected void finalize() throws Throwable`: 垃圾回收器在确定没有更多引用对象时调用的方法。截至Java 18，此方法已被弃用以待移除。
- `public final Class getClass()`: 返回对象的运行时类。
- `public int hashCode()`: 返回对象的哈希码值。
- `public String toString()`: 返回对象的字符串表示。

注意，截至Java SE 9，`finalize()`方法已被弃用，并在Java SE 18中弃用以待移除。强烈不鼓励覆盖此方法。在某个时候，它将不再被调用。有关更多信息，请参见本页的最后一节。

Object的`notify()`、`notifyAll()`和`wait()`方法都参与同步程序中独立运行线程的活动，这将在后面的部分讨论，这里不涉及。这些方法有五个：

- `public final void notify()`
- `public final void notifyAll()`
- `public final void wait()`
- `public final void wait(long timeout)`
- `public final void wait(long timeout, int nanos)`

> 注意：这些方法中的一些有细微的方面，特别是clone方法。

## toString()方法

你应该总是在你的类中覆盖`toString()`方法。

Object的`toString()`方法返回对象的`String`表示，这对于调试非常有用。对象的`String`表示完全取决于对象本身，这就是为什么你需要在你的类中覆盖`toString()`。

你可以使用`toString()`和`System.out.println()`来显示对象的文本表示，例如一个`Book`实例：

```java
System.out.println(firstBook.toString());
```

对于适当覆盖的`toString()`方法，将打印出类似这样有用的东西：

```
ISBN: 0201914670; The Swing Tutorial; A Guide to Constructing GUIs, 2nd Edition
```

## equals()方法

`equals()`方法比较两个对象是否相等，并在它们相等时返回true。Object类中提供的`equals()`方法使用身份运算符(`==`)来确定两个对象是否相等。对于原始数据类型，这给出了正确的结果。然而，对于对象，它不是。由Object提供`equals()`方法测试对象引用是否相等——即，比较的对象是否是完全相同的对象。

要测试两个对象在等价意义上是否相等（包含相同的信息），你必须覆盖`equals()`方法。这里是一个覆盖`equals()`的`Book`类的示例：

```java
public class Book {
    String ISBN;

    public String getISBN() {
        return ISBN;
    }

    public boolean equals(Object obj) {
        if (obj instanceof Book)
            return ISBN.equals((Book)obj.getISBN());
        else
            return false;
    }
}
```

考虑这段代码，它测试`Book`类的两个实例是否相等：

```java
// Swing Tutorial, 2nd edition
Book firstBook  = new Book("0201914670");
Book secondBook = new Book("0201914670");
if (firstBook.equals(secondBook)) {
    System.out.println("objects are equal");
} else {
    System.out.println("objects are not equal");
}
```

即使`firstBook`和`secondBook`引用两个不同的对象，这个程序也显示对象是相等的。它们被认为是相等的，因为比较的对象包含相同的ISBN号。

如果身份运算符不适用于你的类，你应该总是覆盖`equals()`方法。

> 注意：如果你覆盖了`equals()`，你也必须覆盖`hashCode()`。

## hashCode()方法

`hashCode()`返回的值是对象的哈希码，这是由哈希算法生成的整数值。

根据定义，如果两个对象相等，它们的哈希码也必须相等。如果你覆盖了`equals()`方法，你改变了两个对象的等同方式，而Object的`hashCode()`实现就不再有效。因此，如果你覆盖了`equals()`方法，你也必须覆盖`hashCode()`方法。

## getClass()方法

你不能覆盖`getClass()`。

`getClass()`方法返回一个`Class`对象，它有你可以使用的方法来获取关于类的信息，比如它的名字(`getSimpleName()`)，它的超类(`getSuperclass()`)，以及它实现的接口(`getInterfaces()`)。例如，以下方法获取并显示对象的类名：

```java
void printClassName(Object obj) {
    System.out.println("The object's" + " class is " +
        obj.getClass().getSimpleName());
}
```

`Class`类，在`java.lang`包中，有大量的方法（50多个）。例如，你可以测试类是否是注解(`isAnnotation()`)，接口(`isInterface()`)，或者枚举(`isEnum()`)。你可以看到对象的字段是什么(`getFields()`)或者它的方法是什么(`getMethods()`)，等等。

## clone()方法

如果一个类或其超类实现了`Cloneable`接口，你可以使用`clone()`方法从现有对象创建副本。要创建副本，你写：

```java
aCloneableObject.clone();
```

Object对此方法的实现检查调用`clone()`的对象是否实现了`Cloneable`接口。如果没有，该方法将抛出`CloneNotSupportedException`异常。异常处理将在异常部分介绍。目前，你需要知道的是`clone()`必须声明为

```java
protected Object clone() throws CloneNotSupportedException
```

或者

```java
public Object clone() throws CloneNotSupportedException
```

如果你想编写一个`clone()`方法来覆盖Object中的那一个。

如果调用`clone()`的对象实现了`Cloneable`接口，Object的`clone()`实现将创建一个与原始对象相同类的对象，并初始化新对象的成员变量，使其与原始对象的相应成员变量具有相同的值。

使你的类可克隆的最简单方法是在类的声明中添加`implements` `Cloneable`。然后，你的对象可以调用`clone()`方法。

对于一些类，Object的`clone()`方法的默认行为就可以了。然而，如果一个对象包含对外部对象的引用，比如说`ObjExternal`，你可能需要覆盖`clone()`以获得正确的行为。否则，一个对象对`ObjExternal`的更改也会在其副本中可见。这意味着原始对象和其副本不是独立的——要解耦它们，你必须覆盖`clone()`，以便它克隆对象和`ObjExternal`。然后原始对象引用`ObjExternal`，副本引用`ObjExternal`的副本，这样对象和其副本就真正独立了。

## finalize()方法

Object类提供了一个回调方法`finalize()`，当对象成为垃圾时可能会被调用。Object的`finalize()`实现什么都不做。覆盖`finalize()`是为了进行一些清理工作，比如释放资源。

`finalize()`方法可能会被系统自动调用，但何时调用，甚至是否调用，都是不确定的。因此，你不应该再依赖这个方法来为你进行清理。例如，如果你在执行I/O后不在代码中关闭文件描述符，并期望`finalize()`为你关闭它们，你可能会用完文件描述符。

截至Java SE 9，`finalize()`方法已被弃用，并在Java SE 18中弃用以待移除。在某个时候，它将不再被调用。现在强烈不鼓励覆盖此方法。如果你需要清理一些资源，你可以通过实现`AutoCloseable`接口来做到这一点。Java I/O部分详细涵盖了这一点。



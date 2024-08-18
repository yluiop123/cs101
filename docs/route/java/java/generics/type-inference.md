# 类型推断

## 类型推断与泛型方法

类型推断是Java编译器的能力，它查看每个方法调用及其对应的声明，以确定使调用适用的类型参数（或参数）。推断算法确定参数的类型，如果可用，还会确定结果被赋值或返回的类型。最后，推断算法尝试找到与所有参数兼容的最具体类型。

为了说明这一点，在以下示例中，推断确定传递给`pick`方法的第二个参数的类型为`Serializable`：

```java
static <T> T pick(T a1, T a2) { return a2; }
Serializable s = pick("d", new ArrayList<String>());
```

泛型方法介绍了类型推断，它使你能够像调用普通方法一样调用泛型方法，无需在尖括号中指定类型。考虑以下示例`BoxDemo`，它需要`Box`类：

```java
public class BoxDemo {

  public static <U> void addBox(U u,
      java.util.List<Box<U>> boxes) {
    Box<U> box = new Box<>();
    box.set(u);
    boxes.add(box);
  }

  public static <U> void outputBoxes(java.util.List<Box<U>> boxes) {
    int counter = 0;
    for (Box<U> box : boxes) {
      U boxContents = box.get();
      System.out.println("Box #" + counter + " contains [" +
             boxContents.toString() + "]");
      counter++;
    }
  }

  public static void main(String[] args) {
    java.util.ArrayList<Box<Integer>> listOfIntegerBoxes =
      new java.util.ArrayList<>();
    BoxDemo.<Integer>addBox(Integer.valueOf(10), listOfIntegerBoxes);
    BoxDemo.addBox(Integer.valueOf(20), listOfIntegerBoxes);
    BoxDemo.addBox(Integer.valueOf(30), listOfIntegerBoxes);
    BoxDemo.outputBoxes(listOfIntegerBoxes);
  }
}
```

此示例的输出如下：

```
Box #0 contains [10]
Box #1 contains [20]
Box #2 contains [30]
```

泛型方法`addBox()`定义了一个名为`U`的类型参数。通常，Java编译器可以推断泛型方法调用的类型参数。因此，在大多数情况下，你不必指定它们。例如，要调用泛型方法`addBox()`，你可以使用类型见证如下指定类型参数：

```java
BoxDemo.<Integer>addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

或者，如果你省略类型见证，Java编译器会自动推断（从方法的参数）类型参数是`Integer`：

```java
BoxDemo.addBox(Integer.valueOf(20), listOfIntegerBoxes);
```

## 类型推断与泛型类的实例化

只要编译器能从上下文中推断出类型参数，你可以用一对空的类型参数（`<>`）替换泛型类构造函数所需的类型参数。这对尖括号被非正式地称为钻石。

例如，考虑以下变量声明：

```java
Map<String, List<String>> myMap = new HashMap<String, List<String>>();
```

你可以用空的类型参数（`<>`）替换构造函数的参数化类型：

```java
Map<String, List<String>> myMap = new HashMap<>();
```

注意，为了在泛型类实例化期间利用类型推断，你必须使用钻石。在以下示例中，编译器生成了一个未经检查的转换警告，因为`HashMap()`构造函数引用的是`HashMap`原始类型，而不是`Map<String, List<String>>`类型：

```java
Map<String, List<String>> myMap = new HashMap(); // 未经检查的转换警告
```

## 类型推断与泛型及非泛型类的泛型构造函数

注意，构造函数可以在泛型和非泛型类中是泛型的（即声明它们自己的形式类型参数）。考虑以下示例：

```java
class MyClass<X> {
  <T> MyClass(T t) {
    // ...
  }
}
```

考虑以下`MyClass`类的实例化：

```java
new MyClass<Integer>("");
```

这个语句创建了一个参数化类型`MyClass<Integer>`的实例；该语句为泛型`class MyClass<X>`的形式类型参数`X`显式指定了类型`Integer`。注意，这个泛型类的构造函数包含一个形式类型参数`T`。编译器推断泛型类构造函数的形式类型参数`T`的类型为`String`（因为该构造函数的实际参数是一个`String`对象）。

Java SE 7之前的编译器能够像泛型方法一样推断泛型构造函数的实际类型参数。然而，Java SE 7及更高版本的编译器可以在使用钻石（`<>`）时推断实例化泛型类的实际类型参数。考虑以下示例：

```java
MyClass<Integer> myObject = new MyClass<>("");
```

在这个示例中，编译器推断泛型类`MyClass<X>`的形式类型参数`X`的类型为`Integer`。它推断泛型类构造函数的形式类型参数`T`的类型为`String`。

> 注意：重要的是要注意，推断算法仅使用调用参数、目标类型，可能还有明显的预期返回类型来推断类型。推断算法不使用程序后面的结果。

## 目标类型

Java编译器利用目标类型来推断泛型方法调用的类型参数。表达式的目标类型是Java编译器根据表达式出现的位置所期望的数据类型。考虑如下声明的`Collections.emptyList()`方法：

```java
static <T> List<T> emptyList();
```

考虑以下赋值语句：

```java
List<String> listOne = Collections.emptyList();
```

这个语句期望一个`List<String>`类型的实例，这个数据类型是目标类型。因为`emptyList()`方法返回一个`List<T>`类型的值，编译器推断类型参数`T`必须是`String`。这在Java SE 7和8中都有效。或者，你可以使用类型见证并如下指定`T`的值：

```java
List<String> listOne = Collections.<String>emptyList();
```

然而，在此上下文中这并不必要。尽管在其他上下文中是必要的。考虑以下方法：

```java
void processStringList(List<String> stringList) {
  // 处理stringList
}
```

假设你想用一个空列表调用`processStringList()`方法。在Java SE 7中，以下语句无法编译：

```java
processStringList(Collections.emptyList());
```

Java SE 7编译器生成的错误消息类似于以下内容：

```
List<Object>不能转换为List<String>
```

编译器需要类型参数`T`的值，所以它从`Object`值开始。因此，`Collections.emptyList()`的调用返回一个`List<Object>`类型的值，这与`processStringList()`方法不兼容。因此，在Java SE 7中，你必须指定类型参数的值如下：

```java
processStringList(Collections.<String>emptyList());
```

在Java SE 8中不再需要这样做。目标类型的概念已经扩展到包括方法参数，如方法`processStringList()`的参数。在这种情况下，`processStringList()`需要一个`List<String>`类型的参数。方法`Collections.emptyList()`返回一个`List<T>`类型的值，所以使用`List<String>`的目标类型，编译器推断类型参数`T`的值为`String`。因此，在Java SE 8中，以下语句可以编译：

```java
processStringList(Collections.emptyList());
```

## Lambda表达式中的目标类型

假设你有以下方法：

```java
public static void printPersons(List<Person> roster, CheckPerson tester)
```

和

```java
public void printPersonsWithPredicate(List<Person> roster, Predicate<Person> tester)
```

然后你写下以下代码来调用这些方法：

```java
printPersons(
        people,
        p -> p.getGender() == Person.Sex.MALE
        && p.getAge() >= 18
        && p.getAge() <= 25);
```

和

```java
printPersonsWithPredicate(
        people,
        p -> p.getGender() == Person.Sex.MALE
        && p.getAge() >= 18
        && p.getAge() <= 25);
```

在这些情况下，你如何确定Lambda表达式的类型？

当Java运行时调用`printPersons()`方法时，它期望的数据类型是`CheckPerson`，所以Lambda表达式就是这个类型。然而，当Java运行时调用`printPersonsWithPredicate()`方法时，它期望的数据类型是`Predicate<Person>`，所以Lambda表达式就是这个类型。这些方法所期望的数据类型称为目标类型。为了确定Lambda表达式的类型，Java编译器使用Lambda表达式所在上下文或情境的目标类型。因此，只有在Java编译器能够确定目标类型的情境中，你才能使用Lambda表达式：

- 变量声明
- 赋值语句
- 返回语句
- 数组初始化器
- 方法或构造函数参数
- Lambda表达式体
- 条件表达式，`?:`
- 强制类型转换表达式

## 方法参数中的目标类型

对于方法参数，Java编译器使用另外两个语言特性来确定目标类型：重载解析和类型参数推断。

考虑以下两个函数式接口（`java.lang.Runnable`和`java.util.concurrent.Callable<V>`）：

```java
public interface Runnable {
    void run();
}

public interface Callable<V> {
    V call();
}
```

`Runnable.run()`方法不返回值，而`Callable<V>.call()`则返回。

假设你如下重载了`invoke`方法（有关重载方法的更多信息，请参见“定义方法”部分）：

```java
void invoke(Runnable r) {
    r.run();
}

<T> T invoke(Callable<T> c) {
    return c.call();
}
```

在以下语句中将调用哪个方法？

```java
String s = invoke(() -> "done");
```

将调用`invoke(Callable<T>)`方法，因为该方法返回一个值；`invoke(Runnable)`方法不返回值。在这种情况下，Lambda表达式`() -> "done"`的类型是`Callable<T>`。


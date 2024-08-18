# 类型擦除

## 泛型类型的擦除

泛型被引入Java语言，以在编译时提供更严格的类型检查，并支持泛型编程。为了实现泛型，Java编译器应用类型擦除来：
- 将泛型类型中的所有类型参数替换为它们的界限或Object（如果类型参数未设置界限）。
  因此，生成的字节码只包含普通的类、接口和方法。
- 如有需要，插入类型转换以保持类型安全。
- 生成桥接方法以保持扩展泛型类型的多态性。

类型擦除确保不会为参数化类型创建新类；因此，泛型不会带来运行时开销。

在类型擦除过程中，Java编译器擦除所有类型参数，并用第一个界限替换它们（如果类型参数有界限），或者用`Object`替换（如果类型参数没有界限）。

考虑以下表示单链表中节点的泛型类：

```java
public class Node<T> {
    private T data;
    private Node<T> next;

    public Node(T data, Node<T> next) {
        this.data = data;
        this.next = next;
    }

    public T getData() { return data; }
    // ...
}
```

由于类型参数`T`没有界限，Java编译器将其替换为`Object`：

```java
public class Node {
    private Object data;
    private Node next;

    public Node(Object data, Node next) {
        this.data = data;
        this.next = next;
    }

    public Object getData() { return data; }
    // ...
}
```

在以下示例中，泛型`Node`类使用有界限类型参数：

```java
public class Node<T extends Comparable<T>> {
    private T data;
    private Node<T> next;

    public Node(T data, Node<T> next) {
        this.data = data;
        this.next = next;
    }

    public T getData() { return data; }
    // ...
}
```

Java编译器将有界限类型参数`T`替换为第一个界限类`Comparable`：

```java
public class Node {
    private Comparable data;
    private Node next;

    public Node(Comparable data, Node next) {
        this.data = data;
        this.next = next;
    }

    public Comparable getData() { return data; }
    // ...
}
```

## 泛型方法的擦除

Java编译器同样会擦除泛型方法参数中的类型参数。考虑以下泛型方法：

```java
// 计算elem在anArray中出现的次数。
public static <T> int count(T[] anArray, T elem) {
    int cnt = 0;
    for (T e : anArray)
        if (e.equals(elem))
            ++cnt;
    return cnt;
}
```

由于`T`没有界限，Java编译器将其替换为`Object`：

```java
public static int count(Object[] anArray, Object elem) {
    int cnt = 0;
    for (Object e : anArray)
        if (e.equals(elem))
            ++cnt;
    return cnt;
}
```

假设定义了以下类：

```java
class Shape { /* ... */ }
class Circle extends Shape { /* ... */ }
class Rectangle extends Shape { /* ... */ }
```

你可以编写一个泛型方法来绘制不同的形状：

```java
public static <T extends Shape> void draw(T shape) { /* ... */ }
```

Java编译器将`T`替换为`Shape`：

```java
public static void draw(Shape shape) { /* ... */ }
```

## 类型擦除和桥接方法的影响

有时类型擦除会导致你可能没有预料到的情况。以下示例展示了这种情况是如何发生的。以下示例还展示了编译器有时如何创建一个合成方法，称为桥接方法，作为类型擦除过程的一部分。

给定以下两个类：

```java
public class Node<T> {
    public T data;

    public Node(T data) { this.data = data; }

    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

public class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}
```

考虑以下代码：

```java
MyNode mn = new MyNode(5);
Node n = mn;            // 原始类型 - 编译器发出未经检查的警告
n.setData("Hello");     // 导致抛出ClassCastException。
Integer x = mn.data;
```

擦除类型后，这段代码变为：

```java
MyNode mn = new MyNode(5);
Node n = (MyNode)mn;    // 原始类型 - 编译器发出未经检查的警告
n.setData("Hello");     // 导致抛出ClassCastException。
Integer x = (String)mn.data;
```

下一部分解释了为什么在`n.setData("Hello");`语句处抛出了`ClassCastException`。

## 桥接方法

当编译一个扩展参数化类或实现参数化接口的类或接口时，编译器可能需要创建一个合成方法，称为桥接方法，作为类型擦除过程的一部分。你通常不需要担心桥接方法，但如果你在堆栈跟踪中遇到一个，可能会感到困惑。

擦除类型后，`Node`和`MyNode`类变为：

```java
public class Node {
    public Object data;

    public Node(Object data) { this.data = data; }

    public void setData(Object data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

public class MyNode extends Node {
    public MyNode(Integer data) { super(data); }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}
```

擦除类型后，方法签名不匹配；`Node.setData(T)`方法变为`Node.setData(Object)`。因此，`MyNode.setData(Integer)`方法没有覆盖`Node.setData(Object)`方法。

为了解决这个问题并保持泛型类型擦除后的多态性，Java编译器生成一个桥接方法，以确保子类型如预期工作。

对于`MyNode`类，编译器为`setData()`生成以下桥接方法：

```java
class MyNode extends Node {
    // 编译器生成的桥接方法
    public void setData(Object data) {
        setData((Integer) data);
    }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }

    // ...
}
```

桥接方法`MyNode.setData(Object)`委托给原始的`MyNode.setData(Integer)`方法。因此，`n.setData("Hello");`语句调用方法`MyNode.setData(Object)`，并抛出`ClassCastException`，因为`"Hello"`不能转换为`Integer`。

## 非可重写类型

我们讨论了编译器移除与类型参数和类型参数相关的信息的过程。类型擦除与具有非可重写类型的可变参数（也称为varargs）方法有关。有关varargs方法的更多信息，请参阅向方法或构造函数传递信息中的“任意数量的参数”部分。

本页涵盖以下主题：
- 非可重写类型
- 堆污染
- 具有非可重写形式参数的varargs方法的潜在漏洞
- 防止具有非可重写形式参数的varargs方法生成警告

可重写类型是指在运行时完全可用的类型信息的类型。这包括原始类型、非泛型类型、原始类型和未绑定通配符的调用。

非可重写类型是在编译时通过类型擦除移除信息的类型 - 不是定义为未绑定通配符的泛型类型的调用。非可重写类型在运行时没有全部信息可用。非可重写类型的例子是`List<String>`和`List<Number>`；JVM在运行时无法区分这些类型。如泛型限制部分所示，某些情况下无法使用非可重写类型：例如，在`instanceof`表达式中，或作为数组的元素。

## 堆污染

当参数化类型的变量引用不是该参数化类型的对象时，就会发生_堆污染_。如果程序执行了在编译时产生未经检查的警告的某些操作，就会出现这种情况。如果由于涉及参数化类型（例如，转换或方法调用）的操作的正确性无法在编译时（在编译时类型检查规则的限制内）或运行时验证，就会生成未经检查的警告。例如，当混合使用原始类型和参数化类型，或执行未经检查的转换时，就会发生堆污染。

在正常情况下，当所有代码同时编译时，编译器会发出未经检查的警告，以引起你对潜在堆污染的注意。如果你分别编译代码的各个部分，很难检测到潜在的堆污染风险。如果你确保你的代码在没有警告的情况下编译，那么就不会发生堆污染。

## 具有非可重写形式参数的varargs方法的潜在漏洞

包含可变参数输入参数的泛型方法可能会导致堆污染。

考虑以下`ArrayBuilder`类：

```java
public class ArrayBuilder {

  public static <T> void addToList (List<T> listArg, T... elements) {
    for (T x : elements) {
      listArg.add(x);
    }
  }

  public static void faultyMethod(List<String>... l) {
    Object[] objectArray = l;     // 有效
    objectArray[0] = Arrays.asList(42);
    String s = l[0].get(0);       // 在这里抛出ClassCastException
  }

}
```

以下示例`HeapPollutionExample`使用`ArrayBuiler`类：

```java
public class HeapPollutionExample {

  public static void main(String[] args) {

    List<String> stringListA = new ArrayList<String>();
    List<String> stringListB = new ArrayList<String>();

    ArrayBuilder.addToList(stringListA, "Seven", "Eight", "Nine");
    ArrayBuilder.addToList(stringListB, "Ten", "Eleven", "Twelve");
    List<List<String>> listOfStringLists =
      new ArrayList<List<String>>();
    ArrayBuilder.addToList(listOfStringLists,
      stringListA, stringListB);

    ArrayBuilder.faultyMethod(Arrays.asList("Hello!"), Arrays.asList("World!"));
  }

}
```

编译时，`ArrayBuilder.addToList()`方法的定义产生了以下警告：

```java
warning: [varargs] 来自参数化vararg类型T的可能堆污染
```

当编译器遇到一个可变参数方法时，它会将可变参数形式参数转换为数组。然而，Java编程语言不允许创建参数化类型的数组。在`ArrayBuilder.addToList()`方法中，编译器将可变参数形式参数`T...`元素转换为形式参数`T[]`元素，一个数组。但是，由于类型擦除，编译器将可变参数形式参数转换为`Object[]`元素。因此，有可能发生堆污染。

以下语句将可变参数形式参数`l`分配给`Object`数组`objectArgs`：

```java
Object[] objectArray = l;
```

这个语句可能会引入堆污染。可以分配一个与可变参数形式参数`l`的参数化类型匹配的值给变量`objectArray`，因此也可以分配给`l`。但是，编译器在这个语句上没有生成未经检查的警告。编译器在将可变参数形式参数`List<String>... l`转换为形式参数`List[] l`时已经生成了警告。这个语句是有效的；变量`l`的类型是`List[]`，这是`Object[]`的子类型。

因此，编译器不会发出警告或错误，如果你将任何类型的`List`对象分配给`objectArray`数组的任何数组组件，如下所示：

```java
objectArray[0] = Arrays.asList(42);
```

这个语句将一个包含一个`Integer`类型对象的`List`对象分配给`objectArray`数组的第一个数组组件。

假设你使用以下语句调用`ArrayBuilder.faultyMethod()`：

```java
ArrayBuilder.faultyMethod(Arrays.asList("Hello!"), Arrays.asList("World!"));
```

在运行时，JVM在以下语句处抛出`ClassCastException`：

```java
// 在这里抛出ClassCastException
String s = l[0].get(0);
```

变量`l`的第一个数组组件中存储的对象类型为`List<Integer>`，但这个语句期望一个`List<String>`类型的对象。

## 避免具有非可重写形式参数的varargs方法的警告

如果你声明一个具有参数化类型参数的可变参数方法，并确保方法主体不会由于不当处理可变参数形式参数而抛出`ClassCastException`或其他类似异常，你可以通过在静态和非构造方法声明中添加以下注解来避免编译器为这些类型的可变参数方法生成的警告：

```java
@SafeVarargs
```

`@SafeVarargs`注解是方法合同的文档化部分；此注解断言方法的实现不会不当处理可变参数形式参数。

同样，虽然不太可取，但可以通过将以下内容添加到方法声明中来抑制此类警告：

```java
@SuppressWarnings({"unchecked", "varargs"})
```

然而，这种方法不会抑制从方法的调用站点生成的警告。如果你不熟悉`@SuppressWarnings`语法，请参见注解部分。



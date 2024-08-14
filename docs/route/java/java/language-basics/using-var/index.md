# 使用 `var` 类型标识符

## `var` 关键字

从 Java SE 10 开始，您可以使用 `var` 类型标识符来声明局部变量。这样做可以让编译器决定您创建的变量的真正类型。一旦创建，这个类型就不能改变。

考虑以下示例。

```java
String message = "Hello world!";
Path path = Path.of("debug.log");
InputStream stream = Files.newInputStream(path);
```

在这种情况下，声明三个变量 `message`、`path` 和 `stream` 的显式类型是多余的。

使用 `var` 类型标识符，之前的代码可以改写为：

```java
var message = "Hello world!";
var path = Path.of("debug.log");
var stream = Files.newInputStream(path);
```

## 使用 `var` 的示例

以下示例展示了如何使用 `var` 类型标识符使您的代码更易于阅读。这里的 `strings` 变量被赋予了 `List<String>` 类型，而 `element` 变量则是 `String` 类型。

```java
var list = List.of("one", "two", "three", "four");
for (var element : list) {
    System.out.println(element);
}
```

在这个示例中，`path` 变量的类型是 `Path`，而 `stream` 变量的类型是 `InputStream`。

```java
var path = Path.of("debug.log");
try (var stream = Files.newInputStream(path)) {
    // 处理文件
}
```

请注意，在前两个示例中，您在 for 语句和 try-with-resources 语句中使用了 `var` 来声明变量。这两个语句将在本教程后面的部分进行介绍。

## 使用 `var` 的限制

对 `var` 类型标识符的使用有一些限制。

1. 您只能在方法、构造函数和初始化块中声明的局部变量中使用它。
2. `var` 不能用于字段，也不能用于方法或构造函数参数。
3. 编译器在声明变量时必须能够选择一个类型。由于 `null` 没有类型，变量必须有一个初始化器。

遵循这些限制，以下类不会编译，因为字段或方法参数中使用 `var` 作为类型标识符是不可能的。

```java
public class User {
    private var name = "Sue";

    public void setName(var name) {
        this.name = name;
    }
}
```

同样适用于以下代码。在这种情况下，编译器无法猜测 `message` 的真实类型，因为它缺少初始化器。

```java
public String greetings(int message) {
    var greetings;
    if (message == 0) {
        greetings = "morning";
    } else {
        greetings = "afternoon";
    }
    return "Good " + greetings;
}
```


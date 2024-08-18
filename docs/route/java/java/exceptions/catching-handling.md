# Java 中的异常捕获和处理（Catching and Handling Exceptions）

## Java 中的异常捕获和处理
本节介绍如何使用三个异常处理组件——`try`、`catch`和`finally`块——来编写异常处理程序。然后，解释了在 Java SE 7 中引入的`try-with-resources`语句，该语句特别适用于使用`Closeable`资源（如流）的情况。
本节的最后部分通过一个示例进行讲解，并分析在各种场景下会发生什么。

以下示例定义并实现了一个名为`ListOfNumbers`的类。当构建时，`ListOfNumbers`创建一个`ArrayList`，其中包含 10 个`Integer`元素，值从 0 到 9 顺序排列。`ListOfNumbers`类还定义了一个名为`writeList()`的方法，该方法将数字列表写入一个名为`OutFile.txt`的文本文件。这个示例使用了`java.io`中定义的输出类，这些类在“基本 I/O”部分有介绍。
```java
// 注意：这个类目前还无法编译。
import java.io.*;
import java.util.List;
import java.util.ArrayList;

public class ListOfNumbers {

    private List<Integer> list;
    private static final int SIZE = 10;

    public ListOfNumbers() {
        list = new ArrayList<>(SIZE);
        for (int i = 0; i < SIZE; i++) {
            list.add(i);
        }
    }

    public void writeList() {
        // FileWriter 构造函数可能抛出 IOException，必须捕获。
        PrintWriter out = new PrintWriter(new FileWriter("OutFile.txt"));

        for (int i = 0; i < SIZE; i++) {
            // ArrayList 的 get 方法可能抛出 IndexOutOfBoundsException，必须捕获。
            out.println("Value at: " + i + " = " + list.get(i));
        }
        out.close();
    }
}
```
第一行粗体是对构造函数的调用。该构造函数在文件上初始化一个输出流。如果文件无法打开，构造函数将抛出`IOException`。第二行粗体是对`ArrayList`类的`get`方法的调用，如果参数的值太小（小于 0）或太大（大于`ArrayList`当前包含的元素数量），该方法将抛出`IndexOutOfBoundsException`。
如果您尝试编译`ListOfNumbers`类，编译器会打印关于`FileWriter`构造函数抛出的异常的错误消息，但不会显示关于`get()`方法抛出的异常的错误消息。原因是构造函数抛出的异常`IOException`是一个检查型异常，而`get()`方法抛出的异常`IndexOutOfBoundsException`是一个未检查异常。

## `try`块
构建异常处理程序的第一步是将可能抛出异常的代码包含在`try`块中。一般来说，`try`块看起来如下：
```java
try {
    code
}
catch and finally blocks...
```
示例中标记为`code`的部分包含一条或多条可能抛出异常的合法代码行。（`catch`和`finally`块将在接下来的两个小节中解释。）
为了为`ListOfNumbers`类的`writeList()`方法构建异常处理程序，将`writeList()`方法中抛出异常的语句包含在`try`块中。有多种方法可以做到这一点。您可以将每一行可能抛出异常的代码放在自己的`try`块中，并为每个代码提供单独的异常处理程序。或者，您可以将所有的`writeList()`代码放在一个`try`块中，并为其关联多个处理程序。下面的列表使用一个`try`块来处理整个方法，因为相关代码非常短。
```java
private List<Integer> list;
private static final int SIZE = 10;

public void writeList() {
    PrintWriter out = null;
    try {
        System.out.println("Entered try statement");
        out = new PrintWriter(new FileWriter("OutFile.txt"));
        for (int i = 0; i < SIZE; i++) {
            out.println("Value at: " + i + " = " + list.get(i));
        }
    }
    catch and finally blocks...
}
```
如果在`try`块中发生异常，该异常将由与其关联的异常处理程序处理。要将异常处理程序与`try`块关联，您必须在其后放置一个`catch`块；下一节“`catch`块”将介绍如何操作。

## `catch`块
您可以通过在`try`块后面直接提供一个或多个`catch`块来关联异常处理程序。在`try`块的末尾和第一个`catch`块的开头之间不能有任何代码。
```java
try {

} catch (ExceptionType name) {

} catch (ExceptionType name) {

}
```
每个`catch`块都是一个异常处理程序，用于处理其参数指示的异常类型。参数类型`ExceptionType`声明了处理程序可以处理的异常类型，并且必须是从`Throwable`类继承的类的名称。处理程序可以使用`name`来引用异常。
`catch`块包含在异常处理程序被调用时执行的代码。当处理程序是调用堆栈中第一个其`ExceptionType`与抛出的异常类型匹配的处理程序时，运行时系统会调用该异常处理程序。如果抛出的对象可以合法地分配给异常处理程序的参数，则系统认为是匹配的。
以下是`writeList()`方法的两个异常处理程序：
```java
try {

} catch (IndexOutOfBoundsException e) {
    System.err.println("IndexOutOfBoundsException: " + e.getMessage());
} catch (IOException e) {
    System.err.println("Caught IOException: " + e.getMessage());
}
```
异常处理程序不仅可以打印错误消息或停止程序，还可以进行错误恢复、提示用户做出决策，或使用链式异常将错误传播到更高级别的处理程序，如“链式异常”部分所述。

## 多捕获异常
您可以使用多捕获模式用一个异常处理程序捕获多种类型的异常。
在 Java SE 7 及更高版本中，一个`catch`块可以处理多种类型的异常。此功能可以减少代码重复，并减少捕获过于宽泛的异常的诱惑。
在`catch`子句中，指定该块可以处理的异常类型，并使用竖线（`|`）分隔每个异常类型：
```java
catch (IOException|SQLException ex) {
    logger.log(ex);
    throw ex;
}
```
注意：如果一个`catch`块处理多种异常类型，则`catch`参数是隐式的`final`。在这个例子中，`catch`参数`ex`是`final`，因此您不能在`catch`块内为其赋值。

## `finally`块
无论`try`块如何退出，`finally`块总是会执行。这确保了即使发生意外异常，`finally`块也会被执行。但是`finally`块不仅仅用于异常处理——它允许程序员避免清理代码意外地被`return`、`continue`或`break`绕过。将清理代码放在`finally`块中始终是一个好习惯，即使不预期会发生异常。
注意：如果 JVM 在`try`或`catch`代码执行时退出，则`finally`块可能不会执行。
在这里一直处理的`writeList()`方法的`try`块打开了一个`PrintWriter`。程序应该在退出`writeList()`方法之前关闭该流。这带来了一个有点复杂的问题，因为`writeList()`的`try`块可以以三种方式之一退出。
 - 新的`FileWriter`语句失败并抛出`IOException`。
 - `list.get(i)`语句失败并抛出`IndexOutOfBoundsException`。
 - 一切都成功，`try`块正常退出。
无论`try`块内发生什么，运行时系统总是执行`finally`块内的语句。因此，它是执行清理的完美位置。
以下是`writeList()`方法的`finally`块，用于清理并关闭`PrintWriter`。
```java
finally {
    if (out!= null) {
        System.out.println("Closing PrintWriter");
        out.close();
    } else {
        System.out.println("PrintWriter not open");
    }
}
```
重要提示：`finally`块是防止资源泄漏的关键工具。当关闭文件或进行其他资源回收时，将代码放在`finally`块中以确保资源始终被回收。
考虑在这些情况下使用`try-with-resources`语句，它会在不再需要时自动释放系统资源。“`try-with-resources`语句”部分有更多信息。

## `try-with-resources`语句
`try-with-resources`语句是一种`try`语句，它声明一个或多个资源。资源是在程序使用完后必须关闭的对象。`try-with-resources`语句确保在语句结束时每个资源都被关闭。任何实现`java.lang.AutoCloseable`的对象，包括所有实现`java.io.Closeable`的对象，都可以用作资源。
以下示例从文件中读取第一行。它使用`BufferedReader`的实例从文件中读取数据。`BufferedReader`是一个资源，在程序使用完后必须关闭：
```java
static String readFirstLineFromFile(String path) throws IOException {
    try (BufferedReader br =
                 new BufferedReader(new FileReader(path))) {
        return br.readLine();
    }
}
```
在这个例子中，在`try-with-resources`语句中声明的资源是`BufferedReader`。声明语句出现在`try`关键字后面的括号内。在 Java SE 7 及更高版本中，`BufferedReader`类实现了`java.lang.AutoCloseable`接口。因为`BufferedReader`实例是在`try-with-resource`语句中声明的，所以无论`try`语句是正常完成还是突然中断（由于`BufferedReader.readLine()`方法抛出`IOException`），它都会被关闭。
在 Java SE 7 之前，您可以使用`finally`块来确保资源在`try`语句正常或突然完成时都能被关闭。以下示例使用`finally`块而不是`try-with-resources`语句：
```java
static String readFirstLineFromFileWithFinallyBlock(String path)
                                                     throws IOException {
    BufferedReader br = new BufferedReader(new FileReader(path));
    try {
        return br.readLine();
    } finally {
        br.close();
    }
}
```
然而，在这个例子中，如果`readLine()`和`close`方法都抛出异常，那么`readFirstLineFromFileWithFinallyBlock()`方法将抛出`finally`块中抛出的异常；`try`块中抛出的异常将被抑制。相比之下，在`readFirstLineFromFile()`示例中，如果`try`块和`try-with-resources`语句都抛出异常，那么`readFirstLineFromFile()`方法将抛出`try`块中抛出的异常；`try-with-resources`块中抛出的异常将被抑制。在 Java SE 7 及更高版本中，您可以检索被抑制的异常；有关更多信息，请参阅“被抑制的异常”部分。
您可以在`try-with-resources`语句中声明一个或多个资源。以下示例检索打包在`zipFileName`压缩文件中的文件的名称，并创建一个包含这些文件名称的文本文件：
```java
public static void writeToFileZipFileContents(String zipFileName,
                                           String outputFileName)
                                           throws java.io.IOException {

    java.nio.charset.Charset charset =
         java.nio.charset.StandardCharsets.US_ASCII;
    java.nio.file.Path outputFilePath =
         java.nio.file.Paths.get(outputFileName);

    // 使用 try-with-resources 语句打开压缩文件并创建输出文件
    try (
        java.util.zip.ZipFile zf =
             new java.util.zip.ZipFile(zipFileName);
        java.io.BufferedWriter writer =
            java.nio.file.Files.newBufferedWriter(outputFilePath, charset)
    ) {
        // 枚举每个条目
        for (java.util.Enumeration entries =
                                zf.entries(); entries.hasMoreElements(); ) {
            // 获取条目名称并将其写入输出文件
            String newLine = System.getProperty("line.separator");
            String zipEntryName =
                 ((java.util.zip.ZipEntry) entries.nextElement()).getName() +
                 newLine;
            writer.write(zipEntryName, 0, zipEntryName.length());
        }
    }
}
```
在这个例子中，`try-with-resources`语句包含两个用分号分隔的声明：`ZipFile`和`BufferedWriter`。当紧随其后的代码块正常终止或由于异常终止时，`BufferedWriter`和`ZipFile`对象的`close()`方法将按此顺序自动调用。请注意，资源的关闭方法以与创建顺序相反的顺序调用。
以下示例使用`try-with-resources`语句自动关闭`java.sql.Statement`对象：
```java
public static void viewTable(Connection con) throws SQLException {

    String query = "select COF_NAME, SUP_ID, PRICE, SALES, TOTAL from COFFEES";

    try (Statement stmt = con.createStatement()) {
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            String coffeeName = rs.getString("COF_NAME");
            int supplierID = rs.getInt("SUP_ID");
            float price = rs.getFloat("PRICE");
            int sales = rs.getInt("SALES");
            int total = rs.getInt("TOTAL");

            System.out.println(coffeeName + ", " + supplierID + ", " +
                               price + ", " + sales + ", " + total);
        }
    } catch (SQLException e) {
        JDBCTutorialUtilities.printSQLException(e);
    }
}
```
这个例子中使用的资源`java.sql.Statement`是 JDBC 4.1 及更高版本 API 的一部分。
注意：`try-with-resources`语句可以像普通的`try`语句一样有`catch`和`finally`块。在`try-with-resources`语句中，任何`catch`或`finally`块都是在声明的资源被关闭后运行。

## 被抑制的异常
异常可以从与`try-with-resources`语句相关联的代码块中抛出。在`writeToFileZipFileContents()`示例中，异常可以从`try`块中抛出，并且当`try-with-resources`语句尝试关闭`ZipFile`和`BufferedWriter`对象时，最多可以抛出两个异常。如果从`try`块中抛出异常，并且从`try-with-resources`语句中抛出一个或多个异常，则这些从`try-with-resources`语句中抛出的异常将被抑制，并且`writeToFileZipFileContents()`方法抛出的异常是`try`块中抛出的异常。您可以通过从`try`块中抛出的异常调用`Throwable.getSuppressed()`方法来检索这些被抑制的异常。

## 实现`AutoCloseable`或`Closeable`接口的类
请参阅`AutoCloseable`和`Closeable`接口的 Javadoc，以获取实现这些接口的类的列表。`Closeable`接口扩展了`AutoCloseable`接口。`Closeable`接口的`close()`方法抛出`IOException`类型的异常，而`AutoCloseable`接口的`close()`方法抛出`Exception`类型的异常。因此，`AutoCloseable`接口的子类可以覆盖`close()`方法的这种行为，以抛出专门的异常，如`IOException`，或根本不抛出异常。

## 综合示例
前面的部分描述了如何为`ListOfNumbers`类的`writeList()`方法构建`try`、`catch`和`finally`代码块。现在，让我们逐步查看代码并研究可能发生的情况。
当所有组件组合在一起时，`writeList()`方法看起来如下：
```java
public void writeList() {
    PrintWriter out = null;

    try {
        System.out.println("Entering try statement");

        out = new PrintWriter(new FileWriter("OutFile.txt"));
        for (int i = 0; i < SIZE; i++) {
            out.println("Value at: " + i + " = " + list.get(i));
        }
    } catch (IndexOutOfBoundsException e) {
        System.err.println("Caught IndexOutOfBoundsException: "
                           + e.getMessage());

    } catch (IOException e) {
        System.err.println("Caught IOException: " + e.getMessage());

    } finally {
        if (out!= null) {
            System.out.println("Closing PrintWriter");
            out.close();
        } else {
            System.out.println("PrintWriter not open");
        }
    }
}
```
如前所述，这个方法的`try`块有三种不同的退出可能性；这里是其中的两种。
 - `try`语句中的代码失败并抛出异常。这可能是由于新的`FileWriter`语句导致的`IOException`，或者是由于`for`循环中的错误索引值导致的`IndexOutOfBoundsException`。
 - 一切都成功，`try`语句正常退出。
让我们看看在这两种退出可能性下，`writeList()`方法中会发生什么。

### 场景 1：发生异常
创建`FileWriter`的语句可能由于多种原因失败。例如，如果程序无法创建或写入指定的文件，`FileWriter`的构造函数将抛出`IOException`。
当`FileWriter`抛出`IOException`时，运行时系统立即停止执行`try`块；正在执行的方法调用不会完成。运行时系统然后开始在方法调用堆栈的顶部搜索适当的异常处理程序。在这个例子中，当`IOException`发生时，`FileWriter`的构造函数在调用堆栈的顶部。然而，`FileWriter`的构造函数没有适当的异常处理程序，所以运行时系统检查调用堆栈中的下一个方法——`writeList()`方法。`writeList()`方法有两个异常处理程序：一个用于`IOException`，一个用于`IndexOutOfBoundsException`。
运行时系统按照它们在`try`语句后面出现的顺序检查`writeList的异常处理程序。第一个异常处理程序的参数是`IndexOutOfBoundsException`。这与抛出的异常类型不匹配，所以运行时系统检查下一个异常处理程序——`IOException`。这与抛出的异常类型匹配，所以运行时系统结束对适当异常处理程序的搜索。现在运行时系统找到了一个适当的处理程序，该`catch`块中的代码将被执行。
异常处理程序执行后，运行时系统将控制权传递给`finally`块。无论上面捕获的异常是什么，`finally`块中的代码都会执行。在这种情况下，`FileWriter`从未打开，不需要关闭。在`finally`块执行完毕后，程序继续执行`finally`块后面的第一条语句。
以下是当抛出`IOException`时，`ListOfNumbers`程序的完整输出。
```
Entering try statement
Caught IOException: OutFile.txt
PrintWriter not open
```

### 场景 2：`try`块正常退出
在这种情况下，`try`块范围内的所有语句都成功执行，没有抛出异常。执行离开`try`块的末尾，运行时系统将控制权传递给`finally`块。因为一切都成功，当控制权到达`finally`块时，`PrintWriter`是打开的，`finally`块会关闭`PrintWriter`。同样，在`finally`块执行完毕后，程序继续执行`finally`块后面的第一条语句。
以下是当没有抛出异常时，`ListOfNumbers`程序的输出。
```
Entering try statement
Closing PrintWriter
```
# 读写文本文件 - Dev.java

## 理解字符处理

Java 平台使用 Unicode 约定存储字符值。字符流 I/O 会自动将此内部格式与本地字符集进行相互转换。在西方地区，本地字符集通常是 ASCII 或 UTF - 8 的 8 位超集。

使用流类进行的输入和输出会自动与本地字符集进行相互转换。在 Java SE 17 之前，使用字符流的程序会自动适应本地字符集并为国际化做好准备——程序员无需额外努力。从 Java SE 18 开始，Java 应用程序的默认字符集是 UTF - 8。

如果国际化不是优先事项，您可以简单地使用字符流类，而无需过多关注字符集问题。以后，如果国际化成为优先事项，您的程序可以在无需大量重新编码的情况下进行调整。

## 使用缓冲流 I/O 读取文本文件

`newBufferedReader(Path, Charset)`方法打开一个文件进行读取，返回一个`BufferedReader`，可用于高效地从文件中读取文本。

`BufferedReader`类为您提供了一种逐行读取文本文件内容的方法。从 Java SE 8 开始，它还为您提供了一种在文本文件的行上创建`Stream<String>`的方法。您可以在本教程的“流部分”中了解更多关于流的信息。

以下代码逐行读取您的文件。

```java
// 读取器的关闭和异常的处理已省略
// String line = reader.readLine(); 
long count = 0L; 
while (line!= null) {
    count++;
    line = reader.readLine(); 
} 
System.out.println("此文件中的行数 = " + count); 
```

请注意，`line`字符串不包含每行的行终止字符。当到达文件末尾时，返回的行是`null`。

从 Java SE 8 开始，您可以编写以下代码。

```java
Path path = Path.of("file.txt");

try (BufferedReader reader = Files.newBufferedReader(path);
     Stream<String> lines = reader.lines();) {
    long count = lines.count();
    System.out.println("count = " + count); 
} 
```

`reader.lines()`方法在`BufferedReader`类中定义。因为`Stream`接口扩展了`AutoCloseable`接口，所以您可以在`try - with - resources`语句中打开流。在这种情况下，`reader`会被正确关闭。

## 使用缓冲流 I/O 写入文本文件

您可以使用`newBufferedWriter(Path, Charset, OpenOption...)`方法使用`BufferedWriter`写入文件。

以下代码片段展示了如何使用此方法创建一个编码为“US - ASCII”的文件：

```java
Charset charset = Charset.forName("US - ASCII"); 
String s =...; 
try (BufferedWriter writer = Files.newBufferedWriter(file, charset)) {
    writer.write(s, 0, s.length()); 
} catch (IOException x) {
    System.err.format("IOException: %s%n", x); 
} 
```

# 现代 Java 中的常见 I/O 任务

## 现代 Java 中的常见 I/O 任务

### 介绍
本文重点关注应用程序程序员可能遇到的任务，特别是在 Web 应用程序中，例如：
- 读写文本文件
- 从网络读取文本、图像、JSON
- 访问目录中的文件
- 读取 ZIP 文件
- 创建临时文件或目录

Java API 支持许多其他任务，这些任务在 Java I/O API 教程中有详细解释。

本文重点关注自 Java 8 以来的 API 改进。特别是：
- 自 Java 18 以来（自 JEP 400：默认使用 UTF - 8），UTF - 8 是 I/O 的默认编码
- `java.nio.file.Files`类，首次出现在 Java 7 中，在 Java 8、11 和 12 中添加了有用的方法
- `java.io.InputStream`在 Java 9、11 和 12 中获得了有用的方法
- `java.io.File`和`java.io.BufferedReader`类现在已经完全过时，尽管它们在网络搜索和 AI 聊天中经常出现。

### 读取文本文件
您可以将文本文件读入字符串，如下所示：
```java
String content = Files.readString(path);
```
在这里，`path`是`java.nio.Path`的实例，获取方式如下：
```java
var path = Path.of("/usr/share/dict/words"); 
```
在 Java 18 之前，强烈建议您在任何读取或写入字符串的文件操作中指定字符编码。如今，最常见的字符编码是 UTF - 8，但为了向后兼容，Java 使用了“平台编码”，在 Windows 上可能是遗留编码。为了确保可移植性，文本 I/O 操作需要参数`StandardCharsets.UTF_8`。现在不再需要这样做。

如果您想要文件作为行的序列，请调用：
```java
List<String> lines = Files.readAllLines(path); 
```

如果文件很大，请将行作为`Stream<String>`惰性处理：
```java
try (Stream<String> lines = Files.lines(path)) { 
    //...
} 
```

如果您可以自然地使用流操作（如`map`、`filter`）处理行，也请使用`Files.lines`。请注意，`Files.lines`返回的流需要关闭。为了确保这一点发生，请使用`try - with - resources`语句，如前面的代码片段所示。

不再有充分的理由使用`java.io.BufferedReader`的`readLine`方法。

要将输入拆分为行以外的其他内容，请使用`java.util.Scanner`。例如，以下是如何读取由非字母分隔的单词：
```java
Stream<String> tokens = new Scanner(path).useDelimiter("\\PL+").tokens();
```

`Scanner`类也有读取数字的方法，但通常更简单的做法是将输入读取为每行一个字符串或单个字符串，然后进行解析。

从文本文件解析数字时要小心，因为它们的格式可能与区域设置相关。例如，输入`100.000`在美国区域设置中是 100.0，而在德国区域设置中是 100000.0。使用`java.text.NumberFormat`进行特定于区域设置的解析。或者，您可以使用`Integer.parseInt`/`Double.parseDouble`。

### 写入文本文件
您可以通过一次调用将字符串写入文本文件：
```java
String content =...;
Files.writeString(path, content);
```

如果您有一个行列表而不是单个字符串，请使用：
```java
List<String> lines =...; 
Files.write(path, lines);
```

对于更一般的输出，如果您想使用`printf`方法，请使用`PrintWriter`：
```java
var writer = new PrintWriter(path.toFile()); 
writer.printf(locale, "Hello, %s, next year you'll be %d years old!\n", name, age + 1); 
```
请注意，`printf`是特定于区域设置的。在写入数字时，请确保以适当的格式写入它们。而不是使用`printf`，考虑使用`java.text.NumberFormat`或`Integer.toString`/`Double.toString`。

奇怪的是，截至 Java 21，没有带有`Path`参数的`PrintWriter`构造函数。

如果您不使用`printf`，可以使用`BufferedWriter`类并使用`write`方法写入字符串。
```java
var writer = Files.newBufferedWriter(path); 
writer.write(line); // 不写入行分隔符
writer.newLine();  
```
完成后请记住关闭`writer`。

### 从输入流读取
使用流的最常见原因可能是从网站读取某些内容。
如果您需要设置请求头或读取响应头，请使用`HttpClient`：
```java
HttpClient client = HttpClient.newBuilder().build(); 
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("https://horstmann.com/index.html"))
  .GET()
  .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
String result = response.body(); 
```
如果您只想要数据，那么这就太过分了。相反，使用：
```java
InputStream in = new URI("https://horstmann.com/index.html").toURL().openStream(); 
```
然后将数据读入字节数组，并可选地将它们转换为字符串：
```java
byte[] bytes = in.readAllBytes();
String result = new String(bytes); 
```
或者将数据传输到输出流：
```java
OutputStream out = Files.newOutputStream(path); 
in.transferTo(out); 
```
请注意，如果您只是想读取输入流的所有字节，则不需要循环。

但是您真的需要输入流吗？许多 API 为您提供了从文件或 URL 读取的选项。
您喜欢的 JSON 库可能有从文件或 URL 读取的方法。例如，使用 Jackson jr：
```java
URL url = new URI("https://dog.ceo/api/breeds/image/random").toURL(); 
Map<String, Object> result = JSON.std.mapFrom(url); 
```
以下是如何从前面的调用中读取狗图像：
```java
URL url = new URI(result.get("message").toString()).toURL(); 
BufferedImage img = javax.imageio.ImageIO.read(url); 
```
这比将输入流传递给`read`方法更好，因为库可以使用来自 URL 的其他信息来确定图像类型。

### Files API
`java.nio.file.Files`类提供了一组全面的文件操作，例如创建、复制、移动和删除文件和目录。“文件系统基础”教程提供了详细的描述。在本节中，我重点介绍一些常见任务。

#### 遍历目录和子目录中的条目
对于大多数情况，您可以使用以下两种方法之一。`Files.list`方法访问目录的所有条目（文件、子目录、符号链接）。
```java
try (Stream<Path> entries = Files.list(pathToDirectory)) { 
    //...
} 
```
使用`try - with - resources`语句确保跟踪迭代的流对象将被关闭。

如果您还想访问后代目录的条目，请改用`Files.walk`方法：
```java
Stream<Path> entries = Files.walk(pathToDirectory); 
```
然后只需使用流方法聚焦您感兴趣的条目，并收集结果：
```java
try (Stream<Path> entries = Files.walk(pathToDirectory)) { 
    List<Path> htmlFiles = entries.filter(p -> p.toString().endsWith("html")).toList(); 
    //...
} 
```
以下是遍历目录条目的其他方法：
- `Files.walk`的重载版本允许您限制遍历树的深度。
- 两个`Files.walkFileTree`方法通过在首次和最后一次访问目录时通知`FileVisitor`，提供对迭代过程的更多控制。这在某些情况下可能很有用，特别是用于清空和删除目录树。有关详细信息，请参阅“遍历文件树”教程。除非您需要此控制，否则使用更简单的`Files.walk`方法。
- `Files.find`方法与`Files.walk`类似，但您提供一个过滤器，该过滤器检查每个路径及其`BasicFileAttributes`。这比为每个文件单独读取属性稍微高效一些。
- 两个`Files.newDirectoryStream(Path)`方法生成`DirectoryStream`实例，可用于增强的`for`循环。与使用`Files.list`相比没有优势。
- 遗留的`File.list`或`File.listFiles`方法返回文件名或`File`对象。这些现在已过时。

#### 处理 ZIP 文件
自 Java 1.1 以来，`ZipInputStream`和`ZipOutputStream`类提供了处理 ZIP 文件的 API。但该 API 有点笨拙。Java 8 引入了一个更好的 ZIP 文件系统：
```java
try (FileSystem fs = FileSystems.newFileSystem(pathToZipFile)) { 
    //...
} 
```
`try - with - resources`语句确保在 ZIP 文件操作后调用`close`方法。该方法更新 ZIP 文件以反映文件系统中的任何更改。

然后，您可以使用`Files`类的方法。在这里，我们获取 ZIP 文件中所有文件的列表：
```java
try (Stream<Path> entries = Files.walk(fs.getPath("/"))) { 
    List<Path> filesInZip = entries.filter(Files::isRegularFile).toList(); 
} 
```
要读取文件内容，只需使用`Files.readString`或`Files.readAllBytes`：
```java
String contents = Files.readString(fs.getPath("/LICENSE")); 
```
您可以使用`Files.delete`删除文件。要添加或替换文件，只需使用`Files.writeString`或`Files.write`。

### 创建临时文件和目录
我经常需要收集用户输入、生成文件并运行外部进程。然后我使用临时文件，这些文件在下一次重启后会消失，或者使用我在进程完成后删除的临时目录。
我使用`Files.createTempFile`和`Files.createTempDirectory`这两个方法来实现。
```java
Path filePath = Files.createTempFile("myapp", ".txt"); 
Path dirPath = Files.createTempDirectory("myapp");
```
这将在合适的位置（在 Linux 中为`/tmp`）创建具有给定前缀的临时文件或目录，并为文件提供后缀。

### 结论
网络搜索和 AI 聊天可能会为常见的 I/O 操作建议不必要的复杂代码。通常有更好的替代方案：
- 您不需要循环来读取或写入字符串或字节数组。
- 您甚至可能不需要流、读取器或写入器。
- 熟悉`Files`类用于创建、复制、移动和删除文件和目录的方法。
- 使用`Files.list`或`Files.walk`遍历目录条目。
- 使用 ZIP 文件系统处理 ZIP 文件。
- 远离遗留的`File`类。
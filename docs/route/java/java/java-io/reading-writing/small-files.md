# 读写小文件

## 读写小文件

### 选择正确的 I/O 方法
有各种各样的文件 I/O 方法可供选择。为了帮助理解 API，下表展示了`Files`类上可用的文件 I/O 方法及其用例。
|阅读|写入|注释|
|---|---|---|
|`readAllBytes()`，`readAllLines()`|`write()`|专为简单、常见的用例设计。|
|`newBufferedReader()`|`newBufferedWriter()`|迭代流或文本行。|
|`newInputStream()`|`newOutputStream()`|这些方法与`java.io`包互操作。|
|`newByteChannel()`，`SeekableByteChannel`，`ByteBuffer`|||
|`FileChannel`||高级应用程序、文件锁定和内存映射 I/O。|

注意：创建新文件的方法使您能够为文件指定一组可选的初始属性。例如，在支持 POSIX 标准集（如 UNIX）的文件系统上，您可以在创建文件时指定文件所有者、组所有者或文件权限。“管理元数据”部分解释了文件属性，以及如何访问和设置它们。

### `OpenOptions`参数
本节中的几个方法接受一个可选的`OpenOption`参数。这个参数是可选的，API 会告诉您当没有指定时该方法的默认行为是什么。
几个`Files`方法在指定标志时接受任意数量的参数。当您看到参数类型后的省略号表示该方法接受可变数量的参数，或可变参数。当一个方法接受可变参数时，您可以传递一个逗号分隔的值列表或一个值数组。
以下`StandardOpenOption`枚举被支持：
- `WRITE` - 打开文件进行写访问。
- `APPEND` - 将新数据追加到文件末尾。此选项与`WRITE`或`CREATE`选项一起使用。
- `TRUNCATE_EXISTING` - 将文件截断为零字节。此选项与`WRITE`选项一起使用。
- `CREATE_NEW` - 创建一个新文件，如果文件已存在则抛出异常。
- `CREATE` - 如果文件存在则打开它，如果不存在则创建一个新文件。
- `DELETE_ON_CLOSE` - 在流关闭时删除文件。此选项对临时文件很有用。
- `SPARSE` - 提示新创建的文件将是稀疏的。此高级选项在一些文件系统上受支持，如 NTFS，在这些文件系统中，具有数据“间隙”的大文件可以以更有效的方式存储，其中这些空间隙不消耗磁盘空间。
- `SYNC` - 使文件（内容和元数据）与底层存储设备同步。
- `DSYNC` - 使文件内容与底层存储设备同步。

### 小文件常用方法

#### 从文件中读取所有字节或行
如果您有一个较小的文件，并且希望一次性读取其全部内容，可以使用`readAllBytes(Path)`或`readAllLines(Path, Charset)`方法。这些方法为您处理了大部分工作，如打开和关闭流，但不适用于处理大文件。以下代码展示了如何使用`readAllBytes()`方法：
```java
Path file =...; 
byte[] fileArray;
fileArray = Files.readAllBytes(file); 
```

#### 向文件写入所有字节或行
您可以使用其中一个写入方法将字节或行写入文件。
- `write(Path, byte[], OpenOption...)`
- `write(Path, Iterable<? extends CharSequence>, Charset, OpenOption...)`
以下代码片段展示了如何使用`write()`方法。
```java
Path file =...; 
byte[] buf =...; 
Files.write(file, buf);
```

### 创建常规文件和临时文件的方法

#### 创建文件
您可以使用`createFile(Path, FileAttribute<?>)`方法创建一个具有初始属性集的空文件。例如，如果在创建时您希望文件具有特定的文件权限，请使用`createFile()`方法来实现。如果您不指定任何属性，文件将以默认属性创建。如果文件已存在，`createFile()`将抛出异常。
在一个单一的原子操作中，`createFile()`方法检查文件的存在并使用指定的属性创建该文件，这使得该过程更安全地防止恶意代码。
以下代码片段创建一个具有默认属性的文件：
```java
Path file =...; 
try { 
    // 使用默认权限等创建空文件
    Files.createFile(file); 
} catch (FileAlreadyExistsException x) { 
    System.err.format("文件名为 %s 已存在%n", file);
} catch (IOException x) { 
    // 其他类型的失败，如权限问题
    System.err.format("createFile 错误: %s%n", x); 
} 
```
“POSIX 文件权限”有一个示例，使用`createFile(Path, FileAttribute<?>)`创建具有预设权限的文件。
您也可以使用“使用流 I/O 创建和写入文件”部分中描述的`newOutputStream()`方法创建一个新文件。如果您打开一个新的输出流并立即关闭它，将创建一个空文件。

#### 创建临时文件
您可以使用以下`createTempFile()`方法之一创建一个临时文件：
- `createTempFile(Path, String, String, FileAttribute<?>)`
- `createTempFile(String, String, FileAttribute<?>)`
第一个方法允许代码指定临时文件的目录，第二个方法在默认的临时文件目录中创建一个新文件。两个方法都允许您为文件名指定后缀，第一个方法还允许您指定前缀。以下代码片段给出了第二个方法的示例：
```java
try { 
    Path tempFile = Files.createTempFile(null, ".myapp"); 
    System.out.format("临时文件已创建: %s%n", tempFile); 
} catch (IOException x) { 
    System.err.format("IOException: %s%n", x); 
} 
```
运行此文件的结果可能如下所示：
```
临时文件已创建: /tmp/509668702974537184.myapp
```
临时文件名称的具体格式是特定于平台的。

### 随机访问文件
随机访问文件允许对文件内容进行非顺序或随机访问。要随机访问文件，您打开文件，寻找特定位置，并从该文件读取或写入。
通过`SeekableByteChannel`接口可以实现此功能。`SeekableByteChannel`接口通过当前位置的概念扩展了通道 I/O。方法使您能够设置或查询位置，然后您可以从该位置读取数据或向该位置写入数据。API 由几个易于使用的方法组成：
- `position()` - 返回通道的当前位置
- `position(long)` - 设置通道的位置
- `read(ByteBuffer)` - 从通道读取字节到缓冲区
- `write(ByteBuffer)` - 从缓冲区写入字节到通道
- `truncate(long)` - 截断与通道连接的文件（或其他实体）
“使用通道 I/O 读写文件”展示了`Path.newByteChannel()`方法返回一个`SeekableByteChannel`的实例。在默认文件系统上，您可以直接使用该通道，或者将其转换为`FileChannel`，从而访问更高级的功能，如将文件的区域直接映射到内存中以加快访问速度、锁定文件的区域或从绝对位置读取和写入字节而不影响通道的当前位置。
以下代码片段使用其中一个`newByteChannel()`方法打开一个文件进行读写。返回的`SeekableByteChannel`被转换为`FileChannel`。然后，从文件开头读取 12 个字节，并在该位置写入字符串“I was here!”。将文件中的当前位置移动到末尾，并将开头的 12 个字节追加到末尾。最后，再次追加字符串“I was here!”，并关闭文件上的通道。
```java
String s = "I was here!\n"; 
byte data[] = s.getBytes(); 
ByteBuffer out = ByteBuffer.wrap(data); 

ByteBuffer copy = ByteBuffer.allocate(12); 

try (FileChannel fc = (FileChannel.open(file, READ, WRITE))) { 
    // 读取文件的前 12 个字节
    int nread; 
    do { 
        nread = fc.read(copy); 
    } while (nread!= -1 && copy.hasRemaining()); 

    // 在文件开头写入 "I was here!"
    fc.position(0); 
    while (out.hasRemaining()) 
        fc.write(out); 
    out.rewind(); 

    // 移动到文件末尾。将前 12 个字节复制到文件末尾。然后再次写入 "I was here!"
    long length = fc.size(); 
    fc.position(length - 1); 
    copy.flip(); 
    while (copy.hasRemaining()) 
        fc.write(copy); 
    while (out.hasRemaining()) 
        fc.write(out); 
} catch (IOException x) { 
    System.out.println("I/O Exception: " + x); 
} 
```


# 操作文件和目录

## 检查文件或目录

您有一个代表文件或目录的 `Path` 实例，但该文件在文件系统中是否存在？它可读吗？可写吗？可执行吗？

### 验证文件或目录的存在性

`Path` 类中的方法都是语法性的，意味着它们操作的是 `Path` 实例。但最终，您必须访问文件系统来验证特定的 `Path` 是否存在，或不存在。您可以使用 `exists(Path, LinkOption...)` 和 `notExists(Path, LinkOption...)` 方法来实现。请注意，`!Files.exists(path)` 并不等同于 `Files.notExists(path)`。当您测试文件的存在性时，有三种可能的结果：

- 文件被验证为存在。
- 文件被验证为不存在。
- 文件的状态未知。当程序无法访问文件时，可能会出现这个结果。

如果 `exists()` 和 `notExists()` 都返回 `false`，则无法验证文件的存在性。

### 检查文件的可访问性

要验证程序能否按需访问文件，您可以使用 `isReadable(Path)`、`isWritable(Path)` 和 `isExecutable(Path)` 方法。

以下代码片段验证特定文件是否存在，以及程序是否具有执行文件的能力。

```java
Path file = ...;
boolean isRegularExecutableFile = Files.isRegularFile(file) &&
Files.isReadable(file) &&
Files.isExecutable(file);
```

> 注意：一旦这些方法中的任何一个完成，就不保证能够访问文件。许多应用程序中常见的安全漏洞是在执行检查后访问文件。有关更多信息，请使用您喜欢的搜索引擎查找 TOCTTOU（发音为 TOCK-too）。

### 检查两个路径是否指向同一文件

当您使用使用符号链接的文件系统时，可能有两个不同的路径指向同一个文件。`isSameFile(Path, Path)` 方法比较两个路径，以确定它们是否指向文件系统中的同一个文件。例如：

```java
Path p1 = ...;
Path p2 = ...;

if (Files.isSameFile(p1, p2)) {
    // 当路径指向同一个文件时的逻辑
}
```

## 删除文件或目录

您可以删除文件、目录或链接。对于符号链接，将删除链接而不是链接的目标。对于目录，目录必须为空，否则删除失败。

`Files` 类提供了两种删除方法。

`delete(Path)` 方法用于删除文件，如果删除失败则抛出异常。例如，如果文件不存在，则会抛出 NoSuchFileException。您可以捕获异常以确定删除失败的原因，如下所示：

```java
try {
    Files.delete(path);
} catch (NoSuchFileException x) {
    System.err.format("%s: no such" + " file or directory%n", path);
} catch (DirectoryNotEmptyException x) {
    System.err.format("%s not empty%n", path);
} catch (IOException x) {
    // 这里捕获文件权限问题。
    System.err.println(x);
}
```

`deleteIfExists(Path)` 方法也用于删除文件，但如果文件不存在，则不会抛出异常。当您有多个线程删除文件并且您不想因为一个线程首先执行了删除就抛出异常时，静默失败是有用的。

## 复制文件或目录

您可以使用 `copy(Path, Path, CopyOption...)` 方法复制文件或目录。如果目标文件存在，则复制失败，除非指定了 `REPLACE_EXISTING` 选项。

可以复制目录。然而，目录中的文件不会被复制，所以即使原始目录包含文件，新目录也是空的。

当复制符号链接时，会复制链接的目标。如果您想复制链接本身而不是链接的内容，请指定 `NOFOLLOW_LINKS` 或 `REPLACE_EXISTING` 选项中的任何一个。

此方法接受可变参数。支持以下 `StandardCopyOption` 和 `LinkOption` 枚举：

- `REPLACE_EXISTING` – 即使目标文件已存在，也执行复制。如果目标是符号链接，则复制链接本身（而不是链接的目标）。如果目标是一个非空目录，则复制将失败，并抛出 `DirectoryNotEmptyException` 异常。
- `COPY_ATTRIBUTES` – 将与文件关联的文件属性复制到目标文件。支持的确切文件属性取决于文件系统和平台，但跨平台支持 last-modified-time 并将其复制到目标文件。
- `NOFOLLOW_LINKS` – 表示不应跟随符号链接。如果待复制的文件是符号链接，则复制链接（而不是链接的目标）。

如果您不熟悉枚举，请参见 "枚举类型" 部分。

以下展示了如何使用复制方法：

```java
import static java.nio.file.StandardCopyOption.*;

Files.copy(source, target, REPLACE_EXISTING);
```

除了文件复制，`Files` 类还定义了可用于文件和流之间复制的方法。`copy(InputStream, Path, CopyOptions...)` 方法可用于将所有字节从输入流复制到文件。`copy(Path, OutputStream)` 方法可用于将所有字节从文件复制到输出流。

## 移动文件或目录

您可以使用 `move(Path, Path, CopyOption...)` 方法移动文件或目录。如果目标文件存在，则移动失败，除非指定了 `REPLACE_EXISTING` 选项。

### 使用可变参数

几个 `Files` 方法在指定标志时接受任意数量的参数。例如，在以下方法签名中，`CopyOption` 参数后的省略号表示该方法接受可变数量的参数，通常称为 _可变参数_：

```java
Path Files.move(Path, Path, CopyOption...)
```

当一个方法接受可变参数时，您可以传递给它一个逗号分隔的值列表或一个数组（`CopyOption[]`）。

在以下示例中，方法可以这样调用：

```java
Path source = ...;
Path target = ...;
Files.move(source,
           target,
           REPLACE_EXISTING,
           ATOMIC_MOVE);
```

### 移动目录

可以移动空目录。如果目录不为空，则允许在不移动该目录内容的情况下移动目录。在UNIX系统上，通常将目录移动到同一分区内只是重命名目录。在那种情况下，即使目录包含文件，此方法也可以工作。

此方法接受可变参数——支持以下 `StandardCopyOption` 枚举：

- `REPLACE_EXISTING` – 即使目标文件已存在，也执行移动。如果目标是符号链接，则替换符号链接，但它指向的内容不受影响。
- `ATOMIC_MOVE` – 将移动作为原子文件操作执行。如果文件系统不支持原子移动，则抛出异常。使用 `ATOMIC_MOVE`，您可以将文件移动到目录中，并确保任何监视目录的进程都能访问到完整的文件。

以下展示了如何使用移动方法：

```java
import static java.nio.file.StandardCopyOption.*;

Files.move(source, target, REPLACE_EXISTING);
```

尽管您可以像上面展示的那样在单个目录上实现 `move()` 方法，但该方法最常用于文件树递归机制。有关更多信息，请参见 "遍历文件树" 部分。

## 原子操作

一些 `Files` 方法，如 `move()`，可以在某些文件系统上原子性地执行某些操作。

原子文件操作是不可被中断或"部分"执行的操作。要么整个操作被执行，要么操作失败。当您有多个进程在文件系统的同一区域上操作，并且您需要确保每个进程都能访问到完整的文件时，这很重要。

## 链接意识

`Files` 类具有"链接意识"。每个 `Files` 方法要么在遇到符号链接时检测到要执行的操作，要么它提供了一个选项，使您能够在遇到符号链接时配置行为。有关如何处理文件系统上的链接的更多信息，您可以查看 "链接、符号链接及其他" 部分。



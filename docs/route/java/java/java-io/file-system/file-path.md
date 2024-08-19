# 使用Paths访问资源

## 引入旧版 File 类

在Java中，有两种方式来模拟文件系统上的文件或路径。第一种是遗留的 `File` 类。这里提到这个类，同时警告一句：除非您有非常好的理由，否则不应再在代码中使用它。您应该优先使用 `Path` 接口，本节也将介绍。结合 `Files` 的工厂方法，它比 `File` 类提供更多功能，并且性能更好，尤其是在访问较大的文件和目录时。

话虽如此，由于它在遗留代码中广泛使用，理解 `File` 可能对您仍然很重要。不过，不深入讨论，让我们介绍这个类的主要概念。

`File` 类的实例可以代表文件系统中的任何内容：文件、目录、符号链接、相对路径或绝对路径。这个实例是一个抽象概念。创建这样的实例不会在您的文件系统上创建任何内容。您可以使用这个类查询您的文件系统，但需要明确这样做。

`File` 的一个实例不允许您访问它所代表的文件的内容。有了这个实例，您可以检查这个文件是否存在或是否可读（等等）。

一个文件由几个元素组成，这些元素由取决于您的文件系统的分隔符分隔。第一个元素可能是一个前缀，例如磁盘驱动器指示符，UNIX根目录的斜杠。其他元素是名称。

### 创建 File 实例

您可以使用几种构造函数创建 `File` 类的实例：

- `File(String pathName)`：根据您提供的路径创建文件。
- `File(String parent, String child)`：在 `parent` 目录中创建给定的文件。
- `File(File parent, String child)`：在指定为 `File` 实例的 `parent` 目录中创建给定的文件。
- `File(URI uri)`：从 `URI` 创建文件。

### 获取文件的元素

以下方法提供有关此文件元素的信息：

- `getName()`：返回由此文件对象表示的文件或目录的名称。这只是序列的最后一个名称。
- `getParent()`：返回此抽象路径名的父路径的路径名字符串，或者如果此路径名没有指定父目录，则返回 null。
- `getPath()`：返回转换为此抽象路径名的路径名字符串。此方法与 `Path` 接口无关。
- `getAbsolutePath()`：返回此抽象路径名的绝对路径名字符串。如果此抽象路径名已经是绝对的，那么路径名字符串将被简单返回。否则，此路径将以系统依赖的方式解析。
- `getCanonicalPath()`：返回此抽象路径名的规范路径名字符串。规范路径名是绝对的、唯一的，并且依赖于系统。构造此规范路径名通常涉及从路径名中删除冗余名称，例如 `.` 和 `..`，并解析符号链接。

### 获取有关文件或目录的信息

这些方法中的一些可能需要对文件或目录的特殊权限。作为遗留类，`File` 没有公开您的文件系统提供的所有安全属性。

- `isFile()`, `isDirectory()`：检查此抽象路径名是否表示现有的文件或目录。
- `exists()`, `canRead()`, `canWrite()`, `canExecute()`：检查此文件是否存在，是否可读，是否可以修改它，或者是否可以执行它。
- `setReadable(boolean)`, `setWritable(boolean)`, `setExecutable(boolean)`：允许您更改文件的相应安全属性。如果操作成功，这些方法返回 `true`。
- `lastModified()` 和 `setLastModified()`：返回或设置此文件上次修改的时间。
- `length()`：返回由此抽象路径名表示的文件的长度。
- `isHidden()`：测试由此抽象路径名指定的文件是否是隐藏文件。

### 操作文件和目录

几种方法允许您在文件系统上创建文件和目录。它们大多数是文件系统依赖的。记住，这些方法是遗留方法。您可以查看重构代码以使用 Path 的部分，以使用来自 `Path` 接口和 `Files` 类的等效方法。

- `createNewFile()`：尝试根据此路径名创建一个新文件。如果此文件已存在，则此创建将失败。如果文件成功创建，则此方法返回 `true`，否则返回 `false`。
- `delete()`：删除由此抽象路径名表示的文件或目录。如果此路径名表示一个目录，则目录必须为空才能被删除。如果文件成功删除，则此方法返回 `true`，否则返回 `false`。您应该优先使用 `Files.delete()` 方法而不是这一个，因为它在删除失败时提供更多信息。
- `mkdirs()` 和 `mkdir()`：根据此抽象路径名创建一个目录。`mkdirs()` 如有需要，会创建所有中间目录。
- `renameTo(file)`：重命名由此抽象路径名表示的文件。

## 引入 Path 接口

在Java SE 7版本中引入的 `Path` 类是 `java.nio.file` 包的首要入口之一。如果您的应用程序使用文件 I/O，您将希望了解这个接口的强大功能。

> 版本说明：如果您有使用 `java.io.File` 的旧版代码，您仍然可以通过使用 `File.toPath()` 方法来利用 `Path` 接口的功能。见下一部分的更多信息。

> 顾名思义，`Path` 接口是文件系统中路径的程序表示。`Path` 对象包含用于构造路径的文件名和目录列表，并用于检查、定位和操作文件。

`Path` 实例反映底层平台。在 Solaris 操作系统中，`Path` 使用 Solaris 语法 (`/home/joe/foo`)，在 Microsoft Windows 中，`Path` 使用 Windows 语法 (`C:\home\joe\foo`)。`Path` 不是系统独立的。您不能比较来自 Solaris 文件系统的 `Path` 并期望它与来自 Windows 文件系统的 `Path` 匹配，即使目录结构相同，两个实例定位到相同的相对文件。

与 `Path` 对应的文件或目录可能不存在。您可以创建 `Path` 实例并以各种方式操作它：您可以追加到它，提取它的部分，将其与另一个路径比较。在适当的时候，您可以使用 `Files` 类中的方法来检查对应于 `Path` 的文件是否存在，创建文件，打开它，删除它，更改其权限等。

## 将代码重构为使用 Path

也许您有使用 `java.io.File` 的旧版代码，并希望以最小的代码影响优势利用 `java.nio.file.Path` 功能。

`java.io.File` 类提供了 `toPath()` 方法，它将旧风格的 `java.io.File` 实例转换为 `java.nio.file.Path` 实例，如下所示：

```java
Path input = file.toPath();

```

然后，您可以利用 `Path` 接口提供的丰富功能集。

例如，假设您有一些删除文件的代码：

```java
file.delete();

```

您可以修改此代码以使用 `Files.delete()` 工厂方法，如下所示：

```java
Path fp = file.toPath();
Files.delete(fp);

```

相反，`Path.toFile()` 方法为 `Path` 对象构建 `java.io.File` 对象。

由于 Java 实现的文件 I/O 在 Java SE 7 版本中已经完全重新架构，您不能交换一种方法为另一种方法。如果您想使用 `java.nio.file` 包提供的丰富功能，您最简单的解决方案是使用 `File.toPath()` 方法。然而，如果您不想使用这种方法或者它不满足您的需求，您必须重写您的文件 I/O 代码。

两个 API 之间没有一一对应的关系，但以下表格为您提供了一个大致的概念，`java.io.File` API 中的功能在 `java.nio.file` API 中映射到哪里，并告诉您在哪里可以获得更多信息。

| java.io.File 功能 | java.nio.file 功能 | 教程覆盖 |
| --- | --- | --- |
| java.io.File | java.nio.file.Path | 路径接口 |
| java.io.RandomAccessFile | 可搜索字节通道功能。 | 随机访问文件 |
| File.canRead(), File.canWrite(), File.canExecute() | Files.isReadable(), Files.isWritable(), 和 Files.isExecutable(). 在 UNIX 文件系统中，使用管理元数据（文件和文件存储属性）包来检查九种文件权限。 | 检查文件或目录 管理元数据 |
| File.isDirectory(), File.isFile(), 和 File.length() | Files.isDirectory(Path, LinkOption...), Files.isRegularFile(Path, LinkOption...), 和 Files.size(Path) | 管理元数据 |
| File.lastModified() 和 File.setLastModified(long) | Files.getLastModifiedTime(Path, LinkOption...) 和 Files.setLastModifiedTime(Path, FileTime) | 管理元数据 |
| 设置各种属性的 File 方法：setExecutable(), setReadable(), setReadOnly(), setWritable() | 这些方法被 Files 方法 setAttribute(Path, String, Object, LinkOption...) 替换。 | 管理元数据 |
| new File(parent, "newfile") | parent.resolve("newfile") | 路径操作 |
| File.renameTo() | Files.move() | 移动文件或目录 |
| File.delete() | Files.delete() | 删除文件或目录 |
| File.createNewFile() | Files.createFile() | 创建文件 |
| File.deleteOnExit() | 被 Files.createFile() 方法中指定的 DELETE
好的，我会继续为您提供服务。现在让我们回到您之前请求的翻译任务。以下是继续翻译的Markdown格式文本：

```markdown
_ON_CLOSE 选项取代。| 创建文件 |
| File.createTempFile() | Files.createTempFile(String, String, FileAttributes<?>), Files.createTempFile(Path, String, FileAttributes<?>) | 创建文件，使用流I/O创建和写入文件，使用通道I/O读写文件 |
| File.exists() | Files.exists() 和 Files.notExists() | 验证文件或目录的存在 |
| File.compareTo() 和 File.equals() | Path.compareTo() 和 Path.equals() | 比较两个路径 |
| File.getAbsolutePath() 和 File.getAbsoluteFile() | Path.toAbsolutePath() | 转换路径，从路径中移除冗余（normalize） |
| File.getCanonicalPath() 和 File.getCanonicalFile() | Path.toRealPath() 或 Path.normalize() | 转换路径（toRealPath） |
| File.toURI() | Path.toUri() | 转换路径 |
| File.isHidden() | Files.isHidden() | 检索有关路径的信息 |
| File.list() 和 listFiles | Files.newDirectoryStream() | 列出目录的内容 |
| File.mkdir() 和 mkdirs | Files.createDirectory(Path, FileAttribute) | 创建目录 |
| File.listRoots() | FileSystem.getRootDirectories() | 列出文件系统的根目录 |
| File.getTotalSpace(), File.getFreeSpace(), File.getUsableSpace() | FileStore.getTotalSpace(), FileStore.getUnallocatedSpace(), FileStore.getUsableSpace(), FileStore.getTotalSpace() | 文件存储属性 |


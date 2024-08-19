# 管理文件属性

## 文件和文件存储属性

文件系统的元数据通常被称为其文件属性。`Files` 类包括可以用来获取文件的单个属性或设置属性的方法。

| 方法 | 说明 |
| --- | --- |
| `size(Path)` | 以字节为单位返回指定文件的大小。 |
| `isDirectory(Path, LinkOption)` | 如果指定的 `Path` 定位到的文件是一个目录，则返回 true。 |
| `isRegularFile(Path, LinkOption...)` | 如果指定的 `Path` 定位到的文件是一个普通文件，则返回 true。 |
| `isSymbolicLink(Path)` | 如果指定的 `Path` 定位到的文件是一个符号链接，则返回 true。 |
| `isHidden(Path)` | 如果指定的 `Path` 定位到的文件被文件系统认为是隐藏的，则返回 true。 |
| `getLastModifiedTime(Path, LinkOption...)` `setLastModifiedTime(Path, FileTime)` | 返回或设置指定文件的最后修改时间。 |
| `getOwner(Path, LinkOption...)` `setOwner(Path, UserPrincipal)` | 返回或设置文件的所有者。 |
| `getPosixFilePermissions(Path, LinkOption...)` `setPosixFilePermissions(Path, Set<PosixFilePermission>)` | 返回或设置文件的 POSIX 文件权限。 |
| `getAttribute(Path, String, LinkOption...)` `setAttribute(Path, String, Object, LinkOption...)` | 返回或设置文件属性的值。 |

如果程序同时需要多个文件属性，使用只能检索单个属性的方法可能会效率低下。重复访问文件系统以检索单个属性可能会对性能产生不利影响。因此，`Files` 类提供了两个 `readAttributes()` 方法，以便在一次批量操作中获取文件的属性。

| 方法 | 说明 |
| --- | --- |
| `readAttributes(Path, String, LinkOption...)` | 作为批量操作读取文件的属性。`String` 参数标识要读取的属性。 |
| `readAttributes(Path, Class<A>, LinkOption...)` | 作为批量操作读取文件的属性。`Class<A>` 参数是请求的属性类型，方法返回该类的对象。 |

在展示 `readAttributes()` 方法的示例之前，应该提到不同的文件系统对应该跟踪哪些属性有不同的概念。因此，相关的文件属性被分组到视图中。视图映射到特定的文件系统实现，如 POSIX 或 DOS，或通用功能，如文件所有权。

支持的视图如下：

- `BasicFileAttributeView` – 提供所有文件系统实现都必须支持的基本属性视图。
- `DosFileAttributeView` – 在基本属性视图的基础上扩展了支持 DOS 属性的四个标准位。
- `PosixFileAttributeView` – 在基本属性视图的基础上扩展了支持 POSIX 系列标准的文件系统支持的属性，如 UNIX。这些属性包括文件所有者、组所有者以及相关的九种访问权限。
- `FileOwnerAttributeView` – 任何支持文件所有者概念的文件系统实现都支持。
- `AclFileAttributeView` – 支持读取或更新文件的访问控制列表（ACL）。支持 NFSv4 ACL 模型。任何 ACL 模型，如 Windows ACL 模型，如果有明确映射到 NFSv4 模型，也可能被支持。
- `UserDefinedFileAttributeView` – 支持用户定义的元数据。此视图可以映射到系统支持的任何扩展机制。例如，在 Solaris OS 中，您可以使用此视图存储文件的 MIME 类型。

特定文件系统实现可能仅支持基本文件属性视图，或者可能支持这些文件属性视图的几个。文件系统实现可能支持此 API 中未包含的其他属性视图。

在大多数情况下，您不必直接处理任何 `FileAttributeView` 接口。（如果您确实需要直接使用 `FileAttributeView`，可以通过 `getFileAttributeView(Path, Class<V>, LinkOption...)` 方法访问。）

`readAttributes()` 方法使用泛型，并且可以用来读取任何文件属性视图的属性。本页剩余示例使用 `readAttributes()` 方法。

## 基本文件属性

如前所述，要读取文件的基本属性，您可以使用 `Files.readAttributes()` 方法之一，它在一次批量操作中读取所有基本属性。这比分别访问文件系统以读取每个单独的属性要高效得多。可变参数目前支持 `LinkOption` 枚举，`NOFOLLOW_LINKS`。当您不希望符号链接被跟随时，请使用此选项。

> 关于时间戳的说明：基本属性集包括三个时间戳：`creationTime`、`lastModifiedTime` 和 `lastAccessTime`。这些时间戳在特定实现中可能不受支持，在这种情况下，相应的访问器方法返回特定于实现的值。如果支持，时间戳将作为 `FileTime` 对象返回。

以下代码片段读取并打印给定文件的基本文件属性，并使用 `BasicFileAttributes` 类中的方法。

```java
Path file = ...;
BasicFileAttributes attr = Files.readAttributes(file, BasicFileAttributes.class);

System.out.println("creationTime: " + attr.creationTime());
System.out.println("lastAccessTime: " + attr.lastAccessTime());
System.out.println("lastModifiedTime: " + attr.lastModifiedTime());

System.out.println("isDirectory: " + attr.isDirectory());
System.out.println("isOther: " + attr.isOther());
System.out.println("isRegularFile: " + attr.isRegularFile());
System.out.println("isSymbolicLink: " + attr.isSymbolicLink());
System.out.println("size: " + attr.size());
```

除了此示例中显示的访问器方法外，还有一个 `fileKey()` 方法，它返回唯一标识文件的对象或如果没有文件密钥可用，则返回 `null`。

### 设置时间戳

以下代码片段以毫秒为单位设置最后修改时间：

```java
Path file = ...;
BasicFileAttributes attr =
    Files.readAttributes(file, BasicFileAttributes.class);
long currentTime = System.currentTimeMillis();
FileTime ft = FileTime.fromMillis(currentTime);
Files.setLastModifiedTime(file, ft);
```

## DOS文件属性

除了DOS之外，其他文件系统（如 Samba）也支持DOS文件属性。以下片段使用 `DosFileAttributes` 类中的方法。

```java
Path file = ...;
try {
    DosFileAttributes attr =
        Files.readAttributes(file, DosFileAttributes.class);
    System.out.println("isReadOnly is " + attr.isReadOnly());
    System.out.println("isHidden is " + attr.isHidden());
    System.out.println("isArchive is " + attr.isArchive());
    System.out.println("isSystem is " + attr.isSystem());
} catch (UnsupportedOperationException x) {
    System.err.println("DOS file"
        + " attributes not supported:" + x);
}
```

但是，您可以使用 `setAttribute(Path, String, Object, LinkOption...)` 方法设置 DOS 属性，如下所示：

```java
Path file = ...;
Files.setAttribute(file, "dos:hidden", true);
```

## POSIX文件权限

_POSIX_ 是 Portable Operating System Interface for UNIX 的缩写，是一套旨在确保不同 UNIX 版本之间互操作性的 IEEE 和 ISO 标准。如果程序符合这些 POSIX 标准，它应该可以轻松地移植到其他符合 POSIX 的操作系统上。

除了文件所有者和组所有者，POSIX 支持九种文件权限：文件所有者的 _读_、_写_ 和 _执行_ 权限，同一组的成员以及 "其他人"。

以下代码片段读取给定文件的 POSIX 文件属性并将其打印到标准输出。代码使用了 `PosixFileAttributes` 类中的方法。

```java
Path file = ...;
PosixFileAttributes attr =
    Files.readAttributes(file, PosixFileAttributes.class);
System.out.format("%s %s %s%n",
    attr.owner().getName(),
    attr.group().getName(),
    PosixFilePermissions.toString(attr.permissions()));
```

`PosixFilePermissions` 辅助类提供了几个有用的方法，如下：

- 上一个代码片段中使用过的 `toString()` 方法，将文件权限转换为字符串（例如 `rw-r--r--`）。
- `fromString()` 方法接受表示文件权限的字符串，并构建文件权限的 `Set`。
- `asFileAttribute()` 方法接受文件权限的 `Set` 并构建可以传递给 `Files.createFile()` 或 `Files.createDirectory()` 方法的文件属性。

以下代码片段从一个文件中读取属性并创建一个新文件，将原始文件的属性分配给新文件：

```java
Path sourceFile = ...;
Path newFile = ...;
PosixFileAttributes attrs =
    Files.readAttributes(sourceFile, PosixFileAttributes.class);
FileAttribute<Set<PosixFilePermission>> attr =
    PosixFilePermissions.asFileAttribute(attrs.permissions());
Files.createFile(file, attr);
```

`asFileAttribute()` 方法将权限包装为 `FileAttribute`。然后代码尝试使用这些权限创建一个新文件。请注意，_umask_ 也适用，因此新文件可能比请求的权限更安全。

要将文件的权限设置为表示为硬编码字符串的值，您可以使用以下代码：

```java
Path file = ...;
Set<PosixFilePermission> perms =
    PosixFilePermissions.fromString("rw-------");
FileAttribute<Set<PosixFilePermission>> attr =
    PosixFilePermissions.asFileAttribute(perms);
Files.setPosixFilePermissions(file, perms);
```

## 设置文件或组所有者

要将名称转换为可以存储为文件所有者或组所有者的 `UserPrincipal` 对象，您可以使用 `UserPrincipalLookupService` 服务。此服务查找名称或组名称字符串，并返回表示该字符串的 `UserPrincipal` 对象。您可以使用 `FileSystem.getUserPrincipalLookupService()` 方法获取默认文件系统的用户主体查找服务。

以下代码片段展示了如何使用 `setOwner()` 方法设置文件所有者：

```java
Path file = ...;
UserPrincipal owner = file.getFileSystem().getUserPrincipalLookupService()
    .lookupPrincipalByName("sally");
Files.setOwner(file, owner);
```

`Files` 类中没有用于设置组所有者的专用方法。然而，可以通过 POSIX 文件属性视图直接安全地执行此操作，如下所示：

```java
Path file = ...;
GroupPrincipal group =
    file.getFileSystem().getUserPrincipalLookupService()
    .lookupPrincipalByGroupName("green");
Files.getFileAttributeView(file, PosixFileAttributeView.class)
    .setGroup(group);
```

## 用户定义的文件属性

如果文件系统实现支持的文件属性不足以满足您的需求，您可以使用 `UserDefinedAttributeView` 创建和跟踪自己的文件属性。

某些实现将此概念映射到 NTFS 替代数据流等功能以及 ext3 和 ZFS 等文件系统的扩展属性。大多数实现对值的大小有限制，例如，ext3 将大小限制为 4 千字节。

您可以使用以下代码片段将文件的 MIME 类型存储为用户定义的属性：

```java
Path file = ...;
UserDefinedFileAttributeView view =
    Files.getFileAttributeView(file, UserDefinedFileAttributeView.class);
view.write("user.mimetype",
            Charset.defaultCharset().encode("text/html");
```

要读取 MIME 类型属性，您将使用以下代码片段：

```java
Path file = ...;
UserDefinedFileAttributeView view =
    Files.getFileAttributeView(file, UserDefinedFileAttributeView.class);
String name = "user.mimetype";
ByteBuffer buf = ByteBuffer.allocate(view.size(name));
view.read(name, buf);
buf.flip();
String value = Charset.defaultCharset().decode(buf).toString();
```

注意：在 Linux 中，您可能需要启用扩展属性才能使用用户定义的属性。如果您在尝试访问用户定义的属性视图时收到 `UnsupportedOperationException`，则需要重新挂载文件系统。以下命令重新挂载根分区以使用 ext3 文件系统的扩展属性。如果此命令对您的 Linux 版本不起作用，请查阅文档。

```shell
$ sudo mount -o remount,user_xattr /
```

如果您希望更改永久生效，请向 `/etc/fstab` 添加条目。

## 文件存储属性

您可以使用 `FileStore` 类了解有关文件存储的信息，例如可用空间。`getFileStore(Path)` 方法获取指定文件的文件存储。

以下代码片段打印了特定文件所在文件存储的空间使用情况：

```java
Path file = ...;
FileStore store = Files.getFileStore(file);

long total = store.getTotalSpace() / 1024;
long used = (store.getTotalSpace() -
            store.getUnallocatedSpace()) / 1024;
long avail = store.getUsableSpace() / 1024;
```

## 确定 MIME 类型

要确定文件的 MIME 类型，您可能会发现 `probeContentType(Path)` 方法很有用。例如：

```java
try {
    String type = Files.probeContentType(filename);
    if (type == null) {
        System.err.format("'%s' has an" + " unknown filetype.%n", filename);
    } else if (!type.equals("text/plain")) {
        System.err.format("'%s' is not" + " a plain text file.%n", filename);
        continue;
    }
} catch (IOException x) {
    System.err.println(x);
}
```

注意，如果无法确定内容类型，此方法将返回 null。

此方法的实现高度依赖于平台，并且不是万无一失的。内容类型由平台的默认文件类型检测器确定。例如，如果检测器根据 `.class` 扩展名将文件的内容类型确定为 `application/x-java`，它可能会被欺骗。

如果默认的不够用，您可以提供一个自定义的 `FileTypeDetector`。

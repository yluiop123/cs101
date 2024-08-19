# 创建和读取目录

## 列出文件系统的根目录
您可以使用 `FileSystem.getRootDirectories()` 方法列出文件系统的所有根目录。这个方法返回一个 `Iterable`，它允许您使用增强型for语句遍历所有的根目录。

以下代码片段打印了默认文件系统的根目录：

```java
Iterable<Path> dirs = FileSystems.getDefault().getRootDirectories();
for (Path name : dirs) {
    System.err.println(name);
}
```

## 创建目录
您可以使用 `Files.createDirectory(Path, FileAttribute)` 方法创建一个新的目录。如果您没有指定任何 `FileAttribute`，新目录将具有默认属性。例如：

```java
Path dir = ...;
Files.createDirectory(dir);
```

以下代码片段在POSIX文件系统上创建了一个新的目录，它具有特定的权限：

```java
Set<PosixFilePermission> perms =
    PosixFilePermissions.fromString("rwxr-x---");
FileAttribute<Set<PosixFilePermission>> attr =
    PosixFilePermissions.asFileAttribute(perms);
Files.createDirectory(file, attr);
```

要创建一个多级深度的目录，当一个或多个父目录可能尚不存在时，您可以使用便捷方法 `Files.createDirectories(Path, FileAttribute)`。与 `Files.createDirectory(Path, FileAttribute)` 方法一样，您可以指定一个可选的初始文件属性集。以下代码片段使用了默认属性：

```java
Files.createDirectories(Paths.get("foo/bar/test"));
```

目录将根据需要自顶向下创建。在 `foo/bar/test` 示例中，如果 `foo` 目录不存在，则会创建它。接下来，如果需要，将创建 `bar` 目录，最后创建 `test` 目录。

此方法在创建了一些但并非全部父目录后可能会失败。

## 创建临时目录
您可以使用以下创建临时目录的方法之一：

- `createTempDirectory(Path, String, FileAttribute...)`
- `createTempDirectory(String, FileAttribute...)`

第一种方法允许代码为临时目录指定位置，第二种方法在默认临时文件目录中创建一个新目录。



# 访问文件系统

## 默认文件系统

要检索默认文件系统，请使用 `FileSystems` 工厂类的 `getDefault()` 方法。通常，这个方法（注意是复数形式）会链接到 `FileSystem` 的某个方法（注意是单数形式），如下所示：

```java
PathMatcher matcher =
    FileSystems.getDefault().getPathMatcher("glob:*.*");
```

一个 `Path` 实例始终绑定到一个文件系统。如果在创建路径时没有提供文件系统，则会使用默认的文件系统。

### 路径字符串分隔符

POSIX 文件系统的路径分隔符是正斜杠 `/`，而 Microsoft Windows 是反斜杠 `\\`。其他文件系统可能使用其他分隔符。要检索默认文件系统的 `Path` 分隔符，您可以使用以下方法之一：

```java
String separator = File.separator;
String separator = FileSystems.getDefault().getSeparator();
```

`getSeparator()` 方法也用于检索任何可用文件系统的路径分隔符。

## 文件存储

文件系统有一个或多个文件存储来保存其文件和目录。文件存储代表底层存储设备。在UNIX操作系统中，每个挂载的文件系统由一个文件存储表示。在Microsoft Windows中，每个卷由一个文件存储表示。

要检索文件系统的所有文件存储列表，您可以使用 `getFileStores()` 方法。此方法返回一个 `Iterable`，允许您使用增强型for语句遍历所有根目录。

```java
FileSystem fileSystem = FileSystems.getDefault();
for (FileStore store: fileSystem.getFileStores()) {
    System.out.println(store.name() + " - " + store.type());
}
```

在Windows机器上，您将得到这种结果。

```
Windows - NTFS
Data - NTFS
Video - NTFS
Transfer - Fat32
```

如果您需要访问驱动器字母，可以使用以下代码。请记住，有些驱动器字母可能在没有挂载驱动器的情况下被使用。以下代码检查每个驱动器字母是否可读。

```java
for (Path directory : fileSystem.getRootDirectories()) {
    boolean readable = Files.isReadable(directory);
    System.out.println("directory = " + directory + " - " + readable);
}
```

在Windows上运行前面的代码将得到类似的结果。

```
directory = C:\ - true
directory = D:\ - true
directory = E:\ - true
directory = F:\ - false
directory = G:\ - false
```



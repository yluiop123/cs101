# 链接、符号链接及其他

## 创建符号链接
如果您的文件系统支持，您可以使用 `createSymbolicLink(Path, Path, FileAttribute)` 方法创建符号链接。第二个 `Path` 参数表示目标文件或目录，可能存在也可能不存在。以下代码片段使用默认权限创建符号链接：

```java
Path newLink = ...;
Path target = ...;
try {
    Files.createSymbolicLink(newLink, target);
} catch (IOException x) {
    System.err.println(x);
} catch (UnsupportedOperationException x) {
    // 有些文件系统不支持符号链接。
    System.err.println(x);
}
```

`FileAttribute` 可变参数使您能够在创建链接时原子性地设置初始文件属性。然而，这个参数旨在用于将来的功能，目前尚未实现。

## 创建硬链接
您可以使用 `createLink(Path, Path)` 方法为现有文件创建硬链接（或常规链接）。第二个 `Path` 参数定位现有文件，它必须存在，否则会抛出 `NoSuchFileException`。以下代码片段展示了如何创建链接：

```java
Path newLink = ...;
Path existingFile = ...;
try {
    Files.createLink(newLink, existingFile);
} catch (IOException x) {
    System.err.println(x);
} catch (UnsupportedOperationException x) {
    // 有些文件系统不允许将现有文件添加到目录中。
    System.err.println(x);
}
```

## 检测符号链接
要确定 `Path` 实例是否为符号链接，您可以使用 `isSymbolicLink(Path)` 方法。以下代码片段展示了如何操作：

```java
Path file = ...;
boolean isSymbolicLink = Files.isSymbolicLink(file);
```

有关更多信息，请参见 "管理元数据" 部分。

## 查找链接的目标
您可以使用 `readSymbolicLink(Path)` 方法获取符号链接的目标，如下所示：

```java
Path link = ...;
try {
    System.out.format("Target of link '%s' is '%s'%n", link, Files.readSymbolicLink(link));
} catch (IOException x) {
    System.err.println(x);
}
```

如果 `Path` 不是符号链接，此方法将抛出 `NotLinkException`。



# 列出目录的内容

## 列出目录的内容
您可以使用 `newDirectoryStream(Path)` 方法列出目录的所有内容。此方法返回实现 `DirectoryStream` 接口的对象。实现 `DirectoryStream` 接口的类还实现了 `Iterable`，因此您可以迭代目录流，读取所有对象。这种方法适用于非常大的目录。

> 请记住：返回的 `DirectoryStream` 是一个流。如果您没有使用 try-with-resources 语句，请不要忘记在 finally 块中关闭流。try-with-resources 语句会为您处理这一点。您可以在 Stream 部分了解更多关于流的信息。

以下代码片段显示了如何打印目录的内容：

```java
Path dir = ...;
try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
    for (Path file : stream) {
        System.out.println(file.getFileName());
    }
} catch (IOException | DirectoryIteratorException x) {
    // IOException 永远不会被迭代抛出。
    // 在这段代码中，它只能被 newDirectoryStream 抛出。
    System.err.println(x);
}
```

迭代器返回的 `Path` 对象是针对目录解析的条目名称。因此，如果您正在列出 `/tmp` 目录的内容，将以 `/tmp/a`、`/tmp/b` 等格式返回条目。

此方法返回目录的全部内容：文件、链接、子目录和隐藏文件。如果您希望更有选择性地检索检索到的内容，您可以使用本页后面描述的其他 `newDirectoryStream()` 方法。

请注意，如果在目录迭代期间有异常，则会抛出带有 `IOException` 原因的 `DirectoryIteratorException`。`Iterator` 方法不能抛出异常。

## 使用 Glob 过滤目录列表
如果您只想获取名称符合特定模式的文件和子目录，您可以使用 `newDirectoryStream(Path, String)` 方法，它提供了内置的 glob 过滤器。如果您不熟悉 glob 语法，请参见本页末尾的“什么是 Glob”部分。

例如，以下代码片段列出了与 Java 相关的文件：`.class`、`.java` 和 `.jar` 文件：

```java
Path dir = ...;
try (DirectoryStream<Path> stream =
     Files.newDirectoryStream(dir, "*.{java,class,jar}")) {
    for (Path entry : stream) {
        System.out.println(entry.getFileName());
    }
} catch (IOException x) {
    // IOException 永远不会被迭代抛出。
    // 在这段代码中，它只能被 newDirectoryStream 抛出。
    System.err.println(x);
}
```

## 编写自己的目录过滤器
也许您想根据除模式匹配之外的某些条件过滤目录的内容。您可以通过实现 `DirectoryStream.Filter` 接口来创建自己的过滤器。此接口由一个方法 `accept()` 组成，该方法确定文件是否满足搜索要求。

例如，以下代码片段实现了一个仅检索目录的过滤器：

```java
DirectoryStream.Filter<Path> filter =
    new DirectoryStream.Filter<Path>() {
    public boolean accept(Path file) throws IOException {
        try {
            return (Files.isDirectory(file));
        } catch (IOException x) {
            // 未能确定它是否是目录。
            System.err.println(x);
            return false;
        }
    }
};

```

创建过滤器后，可以通过使用 `newDirectoryStream(Path, DirectoryStream.Filter)` 方法调用它。以下代码片段使用 `isDirectory()` 过滤器仅将目录的子目录打印到标准输出：

```java
Path dir = ...;
try (DirectoryStream<Path>
                stream = Files.newDirectoryStream(dir, filter)) {
    for (Path entry : stream) {
        System.out.println(entry.getFileName());
    }
} catch (IOException x) {
    System.err.println(x);
}

```

此方法用于过滤单个目录。然而，如果您想在文件树中查找所有子目录，您将使用“遍历文件树”的机制。

## 什么是 Glob
您可以使用 glob 语法指定模式匹配行为。

glob 模式被指定为字符串，并与其他字符串（如目录或文件名）匹配。glob 语法遵循几个简单规则：

- 星号 `*` 匹配任意数量的字符（包括无）。
- 双星号 `**` 像 `*` 一样工作，但跨越目录边界。这种语法通常用于匹配完整路径。
- 问号 `?` 匹配一个字符。
- 大括号指定子模式的集合。例如：
  - `{sun,moon,stars}` 匹配 "sun"、"moon" 或 "stars"。
  - `{temp*,tmp*}` 匹配所有以 "temp" 或 "tmp" 开头的字符串。
- 方括号传达一组单个字符，或者，当使用连字符（`-`）时，字符范围。例如：
  - `[aeiou]` 匹配任何小写元音字母。
  - `[0-9]` 匹配任何数字。
  - `[A-Z]` 匹配任何大写字母。
  - `[a-z,A-Z]` 匹配任何大写或小写字母。
  在方括号内，`*`、`?` 和 `\\` 匹配它们自己。
- 所有其他字符都匹配它们自己。
- 要匹配 `\\*`、`?` 或其他特殊字符，您可以使用反斜杠字符转义它们。例如：`\\` 匹配一个单独的反斜杠，`?` 匹配问号。

以下是一些 glob 语法示例：

- `*.html` – 匹配所有以 .html 结尾的字符串。
- `???` – 匹配所有具有正好三个字母或数字的字符串。
- `*[0-9]*` – 匹配所有包含数值的字符串。
- `*.{htm,html,pdf}` – 匹配任何以 .htm、.html 或 .pdf 结尾的字符串。
- `a?*.java` – 匹配任何以 a 开头，后跟至少一个字母或数字，并以 .java 结尾的字符串。
- `{foo*,*[0-9]*}` – 匹配任何以 foo 开头或包含数值的字符串。

> 注意：如果您在键盘上输入 glob 模式，并且它包含其中一个特殊字符，您必须将模式放在引号中（`"*"`），使用反斜杠（`\\*`），或使用命令行支持的任何转义机制。

glob 语法功能强大且易于使用。然而，如果它不能满足您的需求，您也可以使用正则表达式。有关更多信息，请参见正则表达式部分。

有关 glob 语法的更多信息，请参见 `FileSystem` 类中 `getPathMatcher(String)` 方法的 API 规范。


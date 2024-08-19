由于文章内容较长，我将分段进行翻译并整合成Markdown格式。以下是第一部分翻译：

# 遍历文件树

你是否需要创建一个应用程序，递归地访问文件树中的所有文件？或许你需要删除树中的每一个 `.class` 文件，或者查找所有在过去一年内未被访问的文件。你可以通过 `FileVisitor` 接口来实现这些功能。

## `FileVisitor` 接口

要遍历文件树，你首先需要实现一个 `FileVisitor`。`FileVisitor` 规定了在遍历过程中关键点所需的行为：当访问文件时、在访问目录之前、在访问目录之后，或者当发生失败时。接口有四个方法对应这些情况：

- `preVisitDirectory()` – 在访问目录的条目之前调用。
- `postVisitDirectory()` – 在访问完目录中的所有条目后调用。如果遇到任何错误，将特定异常传递给该方法。
- `visitFile()` – 在正在访问的文件上调用。文件的 `BasicFileAttributes` 作为参数传递给该方法，或者你可以使用文件属性包来读取特定集合的属性。例如，你可以选择读取文件的 `DosFileAttributeView` 来确定文件是否设置了“隐藏”位。
- `visitFileFailed()` – 当文件无法访问时调用。将特定异常传递给该方法。你可以选择抛出异常、将其打印到控制台或日志文件等。

如果你不需要实现所有四个 `FileVisitor` 方法，你可以扩展 `SimpleFileVisitor` 类，而不是直接实现 `FileVisitor` 接口。这个类是一个适配器，它实现了 `FileVisitor` 接口，遍历树中的所有文件，并在遇到错误时抛出 `IOError`。你可以扩展这个类并仅覆盖你需要的方法。

以下是一个示例，它扩展了 `SimpleFileVisitor` 来打印文件树中的所有条目。它打印了无论是常规文件、符号链接、目录还是其他“未指定”类型的文件的条目信息。它还打印了每个文件的大小（以字节为单位）。遇到的任何异常都会打印到控制台。

```java
import static java.nio.file.FileVisitResult.*;

public static class PrintFiles extends SimpleFileVisitor<Path> {
    // 打印有关每种文件类型的信息。
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attr) {
        if (attr.isSymbolicLink()) {
            System.out.format("Symbolic link: %s ", file);
        } else if (attr.isRegularFile()) {
            System.out.format("Regular file: %s ", file);
        } else {
            System.out.format("Other: %s ", file);
        }
        System.out.println("(" + attr.size() + " bytes)");
        return CONTINUE;
    }

    // 打印每个访问的目录。
    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException exc) {
        System.out.format("Directory: %s%n", dir);
        return CONTINUE;
    }

    // 如果访问文件时出现错误，让用户知道。
    // 如果你没有覆盖此方法并且出现错误，
    // 将抛出IOException。
    @Override
    public FileVisitResult visitFileFailed(Path file, IOException exc) {
        System.err.println(exc);
        return CONTINUE;
    }
}
```

## 启动过程

一旦你实现了你的 `FileVisitor`，你如何启动文件遍历？`Files` 类中有两个 `walkFileTree()` 方法。

- `walkFileTree(Path, FileVisitor)`
- `walkFileTree(Path, Set, int, FileVisitor)`

第一种方法只需要一个起始点和你的 `FileVisitor` 实例。你可以按以下方式调用 `PrintFiles` 文件访问器：

```java
Path startingDir = ...;
PrintFiles pf = new PrintFiles();
Files.walkFileTree(startingDir, pf);
```

第二种 `walkFileTree()` 方法允许你额外指定访问的级别限制和一组 `FileVisitOption` 枚举。如果你想确保这个方法遍历整个文件树，你可以为最大深度参数指定 `Integer.MAX_VALUE`。

你可以指定 `FileVisitOption` 枚举，`FOLLOW_LINKS`，这表示应该跟随符号链接。

这段代码片段展示了如何调用带有四个参数的方法：

```java
Path startingDir = ...;

EnumSet<FileVisitOption> opts = EnumSet.of(FOLLOW_LINKS);

Finder finder = new Finder(pattern);
Files.walkFileTree(startingDir, opts, Integer.MAX_VALUE, finder);
```

## 考虑创建 `FileVisitor` 时的事项

文件树是深度优先遍历的，但你不能假设子目录的访问顺序。

如果你的程序将更改文件系统，你需要仔细考虑如何实现你的 `FileVisitor`。

例如，如果你正在编写递归删除，你会先删除目录中的文件，然后删除目录本身。在这种情况下，你在 `postVisitDirectory()` 中删除目录。

如果你正在编写递归复制，你在 `preVisitDirectory()` 中先创建新目录，然后尝试将文件复制到其中（在 `visitFiles()` 中）。如果你想保留源目录的属性（类似于UNIX `cp -p` 命令），你需要在文件复制后，在 `postVisitDirectory()` 中执行该操作。`Copy` 示例展示了如何做到这一点。

如果你正在编写文件搜索，你在 `visitFile()` 方法中执行比较。这个方法找到了所有符合你标准的文件，但它不会找到目录。如果你想找到文件和目录，你也必须在 `preVisitDirectory()` 或 `postVisitDirectory()` 方法中执行比较。`Find` 示例展示了如何做到这一点。

你需要决定是否要跟随符号链接。例如，如果你正在删除文件，跟随符号链接可能不是明智的选择。如果你正在复制文件树，你可能想允许它。默认情况下，`walkFileTree()` 不跟随符号链接。

`visitFile()` 方法被调用用于文件。如果你指定了 `FOLLOW_LINKS` 选项，并且你的文件树有一个循环链接到父目录，循环目录将在 `visitFileFailed()` 方法中报告，并使用 `FileSystemLoopException`。以下代码片段展示了如何捕获循环链接，并来自 `Copy` 示例：

```java
@Override
public FileVisitResult visitFileFailed(Path file, IOException exc) {
    if (exc instanceof FileSystemLoopException) {
        System.err.println("cycle detected: " + file);
    } else {
        System.err.format("Unable to copy: %s: %s%n", file, exc);
    }
    return CONTINUE;
}
```

这种情况只能在程序跟随符号链接时发生。

## 控制流程

或许你想遍历文件树寻找特定的目录，一旦找到，你希望过程终止。或许你想跳过特定的目录。

`FileVisitor` 方法返回一个 `FileVisitResult` 值。你可以通过在 `FileVisitor` 方法中返回的值来终止文件遍历过程或控制目录是否被访问：

- `CONTINUE` – 表示文件遍历应该继续。如果 `preVisitDirectory()` 方法返回 `CONTINUE`，则访问目录。
- `TERMINATE` – 立即终止文件遍历。此值返回后，不再调用任何其他文件遍历方法。
- `SKIP_SUBTREE` – 当 `preVisitDirectory()` 返回此值时，指定的目录及其子目录被跳过。这个分支被“剪掉”了。
- `SKIP_SIBLINGS` – 当 `preVisitDirectory()` 返回此值时，指定的目录不被访问，`postVisitDirectory()` 不被调用，并且没有进一步未访问的兄弟目录被访问。如果从 `postVisitDirectory()` 方法返回，不再访问任何进一步的兄弟目录。本质上，在指定目录中不再发生任何其他事情。

在这段代码片段中，任何名为 SCCS 的目录都被跳过：

```java
public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
    if (dir.getFileName().toString().equals("SCCS")) {
        return SKIP_SUBTREE;
    }
    return CONTINUE;
}
```

在这段代码片段中，一旦找到特定文件，文件名被打印到标准输出，文件遍历终止：

```java
import static java.nio.file.FileVisitResult.*;

// 我们正在寻找的文件。
Path lookingFor = ...;

public FileVisitResult visitFile(Path file, BasicFileAttributes attr) {
    if (file.getFileName().equals(lookingFor)) {
        System.out.println("Located file: " + file);
        return TERMINATE;
    }
    return CONTINUE;
}
```

## 查找文件

如果你曾经使用过 shell 脚本，你很可能使用过模式匹配来定位文件。事实上，你很可能大量使用过它。如果你没有使用过，模式匹配使用特殊字符创建一个模式，然后文件名可以与该模式进行比较。例如，在大多数 shell 脚本中，星号 `*` 匹配任意数量的字符。例如，以下命令列出当前目录中所有以 `.html` 结尾的文件：

```shell
$ ls *.html
```

`java.nio.file` 包提供了这种有用功能的程序支持。每个文件系统实现都提供了一个 `PathMatcher`。你可以通过使用 `FileSystem` 类的 `getPathMatcher(String)` 方法来检索文件系统的 `PathMatcher`。以下代码片段获取了默认文件系统的路径匹配器：

```java
String pattern = ...;
PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:" + pattern);
```

传递给 `getPathMatcher(String)` 的字符串参数指定了要匹配的语法风格和模式。这个例子指定了 glob 语法。如果你不熟悉 glob 语法，请参见“什么是 Glob”部分。

Glob 语法易于使用和灵活，但如果你更喜欢，你也可以使用正则表达式或 regex 语法。有关 regex 的更多信息，请参见“正则表达式”部分。一些文件系统实现可能支持其他语法。

如果你想使用其他基于字符串的模式匹配形式，你可以创建自己的 `PathMatcher` 类。本页的示例使用 glob 语法。

一旦你创建了 `PathMatcher` 实例，你就可以准备将文件与它进行匹配了。`PathMatcher` 接口有一个单一的方法 `matches()`，它接受一个 `Path` 参数并返回一个 `boolean`：它要么匹配模式，要么不匹配。以下代码片段查找以 `.java` 或 `.class` 结尾的文件，并将这些文件打印到标准输出：

```java
PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:*.{java,class}");

Path filename = ...;
if (matcher.matches(filename)) {
    System.out.println(filename);
}
```

### 递归模式匹配

搜索匹配特定模式的文件与遍历文件树密切相关。你知道多少次文件在文件系统的某个地方，但是在哪里呢？或者，你可能需要找到文件树中所有具有特定文件扩展名的文件。

`Find` 示例正是这样做的。`Find` 类似于 UNIX `find` 实用程序，但功能有所缩减。你可以扩展这个示例以包括其他功能。例如，`find` 实用程序支持 `-prune` 标志，以排除搜索的整个子树。你可以通过在 `preVisitDirectory()` 方法中返回 `SKIP_SUBTREE` 来实现该功能。要实现 `-L` 选项，即跟随符号链接，你可以使用带四个参数的 `walkFileTree(Path, Set, int, FileVisitor)` 方法并传递 `FOLLOW_LINKS` 枚举（但确保你在 `visitFile()` 方法中测试循环链接）。

运行 `Find` 应用程序时，请使用以下格式：

```shell
$ java Find <path> -name "<glob_pattern>"
```

模式被放在引号内，以便任何通配符不会被 shell 解释。例如：

```shell
$ java Find . -name "*.html"
```

## `Find` 示例

以下是 `Find` 示例的源代码：

```java
/**
 * 示例代码，用于查找与指定的 glob 模式匹配的文件。
 * 有关 glob 模式的更多信息，请看
 * https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob
 *
 * 匹配模式的文件或目录将被打印到
 * 标准输出。匹配的数量也将打印。
 *
 * 执行此应用程序时，你必须将 glob 模式
 * 放在引号中，这样 shell 就不会展开任何通配符：
 *              java Find . -name "*.java"
 */

import java.io.*; 
import java.nio.file.*;
import java.nio.file.attribute.*;
import static java.nio.file.FileVisitResult.*;
import static java.nio.file.FileVisitOption.*;
import java.util.*;

public class Find {

    public static class Finder extends SimpleFileVisitor<Path> {
        private final PathMatcher matcher;
        private int numMatches = 0;

        Finder(String pattern) {
            matcher = FileSystems.getDefault()
                    .getPathMatcher("glob:" + pattern);
        }

        // 将 glob 模式与文件或目录名称比较。
        void find(Path file) {
            Path name = file.getFileName();
            if (name != null && matcher.matches(name)) {
                numMatches++;
                System.out.println(file);
            }
        }

        // 将匹配的总数打印到标准输出。
        void done() {
            System.out.println("Matched: "
                + numMatches);
        }

        // 调用每个文件的模式匹配方法。
        @Override
        public FileVisitResult visitFile(Path file,
                BasicFileAttributes attrs) {
            find(file);
            return CONTINUE;
        }

        // 调用每个目录的模式匹配方法。
        @Override
        public FileVisitResult preVisitDirectory(Path dir,
                BasicFileAttributes attrs) {
            find(dir);
            return CONTINUE;
        }

        @Override
        public FileVisitResult visitFileFailed(Path file,
                IOException exc) {
            System.err.println(exc);
            return CONTINUE;
        }
    }

    static void usage() {
    System.err.println("java Find <path> -name \"<glob_pattern>\"");
    System.exit(-1);
}

public static void main(String[] args) throws IOException {
    if (args.length < 3 || !args[1].equals("-name"))
        usage();

    Path startingDir = Paths.get(args[0]);
    String pattern = args[2];

    Finder finder = new Finder(pattern);
    Files.walkFileTree(startingDir, finder);
    finder.done();
}
```

## `Copy` 示例

以下是 `Copy` 示例的源代码，演示了如何递归地从源目录复制文件到目标文件夹：

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.util.EnumSet;
import java.util.stream.Stream;

import static java.nio.file.FileVisitResult.CONTINUE;
import static java.nio.file.FileVisitResult.SKIP_SUBTREE;
import static java.nio.file.StandardCopyOption.COPY_ATTRIBUTES;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

/** 
 * 示例代码，递归地从源目录复制文件到目标文件夹。
 * 指定复制的最大目录层数在-depth之后。
 * 复制的文件数量将打印到标准输出。
 * 你可以使用以下命令执行应用程序：
 * @code java Copy <source> <destination> -depth <max_level_dir>
 */

public class Copy {
    /** 
     * 一个 {@code FileVisitor}，用于查找所有与指定模式匹配的文件。
     */
    public static class Replicator extends SimpleFileVisitor<Path> {
        Path source;
        Path destination;

        public Replicator(Path source, Path destination) {
            this.source = source;
            this.destination = destination;
        }

        // 将复制的文件总数打印到标准输出。
        void done() throws IOException {
            try (Stream<Path> path = Files.list(Paths.get(destination.toUri()))) {
                System.out.println("Number of files copied: "
                        + path.filter(p -> p.toFile().isFile()).count());
            }
        }

        // 在目标位置复制文件。
        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
            System.out.println("Copy file: " + file);
            Path newFile = destination.resolve(source.relativize(file));
            try {
                Files.copy(file, newFile);
            } catch (IOException ioException) {
                // 日志记录并继续。
            }
            return CONTINUE;
        }

        // 调用目录的复制。
        @Override
        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
            System.out.println("Copy directory: " + dir);
            Path targetDir = destination.resolve(source.relativize(dir));
            try {
                Files.copy(dir, targetDir, REPLACE_EXISTING, COPY_ATTRIBUTES);
            } catch (IOException e) {
                System.err.println("Unable to create " + targetDir + " [" + e + "]");
                return SKIP_SUBTREE;
            }

            return CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
            if (exc == null) {
                Path destination = this.destination.resolve(source.relativize(dir));
                try {
                    FileTime time = Files.getLastModifiedTime(dir);
                    Files.setLastModifiedTime(destination, time);
                } catch (IOException e) {
                    System.err.println("Unable to copy all attributes to: " + destination + " [" + e + "]");
                }
            } else {
                throw exc;
            }

            return CONTINUE;
        }

        @Override
        public FileVisitResult visitFileFailed(Path file, IOException exc) {
            if (exc instanceof FileSystemLoopException) {
                System.err.println("cycle detected: " + file);
            } else {
                System.err.format("Unable to copy: %s: %s%n",
                        file, exc);
            }
            return CONTINUE;
        }
    }

    static void usage() {
        System.err.println("java Copy <source> <destination> -depth \"<max_level_dir>\"");
        System.exit(-1);
    }

    public static void main(String[] args) throws IOException {
        if (args.length < 4 || !args[2].equals("-depth"))
            usage();

        Path source = Paths.get(args[0]);
        Path destination = Paths.get(args[1]);
        int depth = Integer.parseInt(args[3]);

        Replicator walk = new Replicator(source, destination);
        EnumSet<FileVisitOption> opts = EnumSet.of(FileVisitOption.FOLLOW_LINKS);
        Files.walkFileTree(source, opts, depth, walk);
        walk.done();
    }
}
```

## `Chmod` 示例

以下是 `Chmod` 示例的源代码，演示了如何以类似于UNIX `chmod` 命令的方式更改文件权限：

```java
import java.nio.file.*;
import java.nio.file.attribute.*;
import static java.nio.file.attribute.PosixFilePermission.*;
import static java.nio.file.FileVisitResult.*;
import java.io.IOException;
import java.util.*;

/**
 * 示例代码，以类似于 chmod(1) 程序的方式更改文件权限。
 */

public class Chmod {
    /**
     * 编译一个或多个符号模式表达式列表，这些表达式可用于更改一组文件权限。此方法旨在使用，当需要以类似于UNIX chmod程序的方式更改文件权限时。
     *
     * <p> {@code exprs} 参数是一个由逗号分隔的表达式列表，其中每个表达式采用以下形式：
     * <blockquote>
     * <i>who operator [permissions]</i>
     * </blockquote>
     * 其中 <i>who</i> 是一个或多个字符 {@code 'u'}、{@code 'g'}、{@code 'o'} 或 {@code 'a'}，分别表示所有者（用户）、组、其他人或全部（所有者、组和其他人的）。
     *
     * <p> <i>operator</i> 是字符 {@code '+'}、{@code '-'} 或 {@code '='}，表示如何更改权限。{@code '+'} 表示添加权限，{@code '-'} 表示移除权限，{@code '='} 表示绝对分配权限。
     *
     * <p> <i>permissions</i> 是以下一个或多个序列：
     * {@code 'r'} 表示读取权限，{@code 'w'} 表示写入权限，{@code 'x'} 表示执行权限。如果绝对分配时省略了 <i>permissions</i>，则清除了由 <i>who</i> 确定的所有者、组或其他人的权限。如果在添加或移除时省略，则忽略该表达式。
     *
     * <p> 以下是 {@code exprs} 参数可能的值的示例：
     *
     * <table border="0">
     * <tr>
     *   <td> {@code u=rw} </td>
     *   <td> 设置所有者权限为读写。 </td>
     * </tr>
     * <tr>
     *   <td> {@code ug+w} </td>
     *   <td> 设置所有者写入和组写入权限。 </td>
     * </tr>
     * <tr>
     *   <td> {@code u+w,o-rwx} </td>
     *   <td> 设置所有者写入，并移除其他人的读、写和执行权限。 </td>
     * </tr>
     * <tr>
     *   <td> {@code o=} </td>
     *   <td> 将其他人的权限设置为无（如果设置了，则移除其他人的读、写和执行权限）。 </td>
     * </tr>
     * </table>
     *
     * @param   exprs 一个或多个符号模式表达式的列表
     *
     * @return  可用于更改一组文件权限的 {@code Changer}
     *
     * @throws  IllegalArgumentException 如果 {@code exprs} 参数的值无效
     */
    public static Changer compile(String exprs) {
        // 最小是who和operator（例如u=）
        if (exprs.length() < 2)
            throw new IllegalArgumentException("Invalid mode");

        // 更改器将添加或删除的权限
        final Set<PosixFilePermission> toAdd = new HashSet<>();
        final Set<PosixFilePermission> toRemove = new HashSet<>();

        // 遍历每个表达式模式
        for (String expr: exprs.split(",")) {
            // 最小的who和operator
            if (expr.length() < 2)
                throw new IllegalArgumentException("Invalid mode");

            int pos = 0;

            // who
            boolean u = false;
            boolean g = false;
            boolean o = false;
            boolean done = false;
            for (;;) {
                switch (expr.charAt(pos)) {
                    case 'u' : u = true; break;
                    case 'g' : g = true; break;
                    case 'o' : o = true; break;
                    case 'a' : u = true; g = true; o = true; break;
                    default : done = true;
                }
                if (done)
                    break;
                pos++;
            }
            if (!u && !g && !o)
                throw new IllegalArgumentException("Invalid mode");

            // get operator and permissions
            char op = expr.charAt(pos++);
            String mask = (expr.length() == pos) ? "" : expr.substring(pos);

            // operator
            boolean add = (op == '+');
            boolean remove = (op == '-');
            boolean assign = (op == '=');
            if (!add && !remove && !assign)
                throw new IllegalArgumentException("Invalid mode");

            // who= means remove all
            if (assign && mask.length() == 0) {
                assign = false;
                remove = true;
                mask = "rwx";
            }

            // permissions
            boolean r = false;
            boolean w = false;
            boolean x = false;
            for (int i=0; i<mask.length(); i++) {
                switch (mask.charAt(i)) {
                    case 'r' : r = true; break;
                    case 'w' : w = true; break;
                    case 'x' : x = true; break;
                    default:
                        throw new IllegalArgumentException("Invalid mode");
                }
            }

            // update permissions set
            if (add) {
                if (u) {
                    if (r) toAdd.add(OWNER_READ);
                    if (w) toAdd.add(OWNER_WRITE);
                    if (x) toAdd.add(OWNER_EXECUTE);
                }
                if (g) {
                    if (r) toAdd.add(GROUP_READ);
                    if (w) toAdd.add(GROUP_WRITE);
                    if (x) toAdd.add(GROUP_EXECUTE);
                }
                if (o) {
                    if (r) toAdd.add(OTHERS_READ);
                    if (w) toAdd.add(OTHERS_WRITE);
                    if (x) toAdd.add(OTHERS_EXECUTE);
                }
            }
            if (remove) {
                if (u) {
                    if (r) toRemove.add(OWNER_READ);
                    if (w) toRemove.add(OWNER_WRITE);
                    if (x) toRemove.add(OWNER_EXECUTE);
                }
                if (g) {
                    if (r) toRemove.add(GROUP_READ);
                    if (w) toRemove.add(GROUP_WRITE);
                    if (x) toRemove.add(GROUP_EXECUTE);
                }
                if (o) {
                    if (r) toRemove.add(OTHERS_READ);
                    if (w) toRemove.add(OTHERS_WRITE);
                    if (x) toRemove.add(OTHERS_EXECUTE);
                }
            }
            if (assign) {
                if (u) {
                    if (r) toAdd.add(OWNER_READ);
                      else toRemove.add(OWNER_READ);
                    if (w) toAdd.add(OWNER_WRITE);
                      else toRemove.add(OWNER_WRITE);
                    if (x) toAdd.add(OWNER_EXECUTE);
                      else toRemove.add(OWNER_EXECUTE);
                }
                if (g) {
                    if (r) toAdd.add(GROUP_READ);
                      else toRemove.add(GROUP_READ);
                    if (w) toAdd.add(GROUP_WRITE);
                      else toRemove.add(GROUP_WRITE);
                    if (x) toAdd.add(GROUP_EXECUTE);
                      else toRemove.add(GROUP_EXECUTE);
                }
                if (o) {
                    if (r) toAdd.add(OTHERS_READ);
                      else toRemove.add(OTHERS_READ);
                    if (w) toAdd.add(OTHERS_WRITE);
                      else toRemove.add(OTHERS_WRITE);
                    if (x) toAdd.add(OTHERS_EXECUTE);
                      else toRemove.add(OTHERS_EXECUTE);
                }
            }
        }

        // return changer
        return new Changer() {
            @Override
            public Set<PosixFilePermission> change(Set<PosixFilePermission> perms) {
                perms.addAll(toAdd);
                perms.removeAll(toRemove);
                return perms;
            }
        };
    }

    /**
     * A task that <i>changes</i> a set of {@link PosixFilePermission} elements.
     */
    public interface Changer {
        /**
         * Applies the changes to the given set of permissions.
         *
         * @param   perms
         *          The set of permissions to change
         *
         * @return  The {@code perms} parameter
         */
        Set<PosixFilePermission> change(Set<PosixFilePermission> perms);
    }

    /**
     * Changes the permissions of the file using the given Changer.
     */
    static void chmod(Path file, Changer changer) {
        try {
            Set<PosixFilePermission> perms = Files.getPosixFilePermissions(file);
            Files.setPosixFilePermissions(file, changer.change(perms));
        } catch (IOException x) {
            System.err.println(x);
        }
    }

    /**
     * Changes the permission of each file and directory visited
     */
    static class TreeVisitor implements FileVisitor<Path> {
        private final Changer changer;

        TreeVisitor(Changer changer) {
            this.changer = changer;
        }

        @Override
        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
            chmod(dir, changer);
            return CONTINUE;
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
            chmod(file, changer);
            return CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path dir, IOException exc) {
            if (exc != null)
                System.err.println("WARNING: " + exc);
            return CONTINUE;
        }

        @Override
        public FileVisitResult visitFileFailed(Path file, IOException exc) {
            System.err.println("WARNING: " + exc);
            return CONTINUE;
        }
    }

    static void usage() {
        System.err.println("java Chmod [-R] symbolic-mode-list file...");
        System.exit(-1);
    }

    public static void main(String[] args) throws IOException {
        if (args.length < 2)
            usage();
        int argi = 0;
        int maxDepth = 0;
        if (args[argi].equals("-R")) {
            if (args.length < 3)
                usage();
            argi++;
            maxDepth = Integer.MAX_VALUE;
        }

        // compile the symbolic mode expressions
        Changer changer = compile(args[argi++]);
        TreeVisitor visitor = new TreeVisitor(changer);

        Set<FileVisitOption> opts = Collections.emptySet();
        while (argi < args.length) {
            Path file = Paths.get(args[argi]);
            Files.walkFileTree(file, opts, maxDepth, visitor);
            argi++;
        }
    }
}
```





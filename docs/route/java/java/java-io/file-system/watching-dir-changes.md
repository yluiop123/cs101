# 监视目录更改

## 监视目录更改概述

要实现**文件更改通知**，程序必须能够检测文件系统上相关目录发生的情况。一种方法是轮询文件系统查找更改，但这种方法效率低下。它不适用于需要监视数百个打开的文件或目录的应用程序。

`java.nio.file`包提供了一个文件更改通知API，称为**监视服务API**。这个API允许你向监视服务注册一个（或多个）目录。注册时，你告诉服务你感兴趣的事件类型：文件创建、文件删除或文件修改。当服务检测到感兴趣的事件时，它会转发给注册的进程。注册的进程有一个线程（或线程池）专门用于监视它注册的任何事件。当事件发生时，根据需要进行处理。

## 监视服务概述

`WatchService` API相当底层，允许你自定义它。你可以按原样使用它，或者选择在此机制之上创建一个高级API，以便它适合你的特定需求。

实现监视服务所需的基本步骤如下：

- 为文件系统创建一个`WatchService`“监视器”。
- 对于每个要监视的目录，使用监视器进行注册。注册目录时，你指定你希望通知的事件类型。你将为每个注册的目录收到一个`WatchKey`实例。
- 实现一个无限循环以等待传入的事件。当事件发生时，密钥被信号触发并放入监视器的队列中。
- 从监视器的队列中检索密钥。你可以从密钥中获取文件名。
- 检索密钥的每个待处理事件（可能有多个事件）并根据需要进行处理。
- 重置密钥，并恢复等待事件。
- 关闭服务：监视服务在线程退出或调用其`close()`方法时退出。

`WatchKeys`是线程安全的，并且可以与`java.nio.concurrent`包一起使用。你可以为这项工作分配一个线程池。

## 尝试使用

由于这个API更高级，请在继续之前尝试使用它。保存本节末尾的`WatchDir`示例到你的计算机上，并编译它。创建一个将传递给示例的测试目录。`WatchDir`使用单个线程处理所有事件，因此在等待事件时会阻塞键盘输入。你可以按照以下方式在单独的窗口中运行程序，或将其作为后台进程运行：

```
$ java WatchDir test &
```

在测试目录中尝试创建、删除和编辑文件。当这些事件发生时，控制台会打印一条消息。完成后，删除测试目录并退出`WatchDir`。或者，如果你愿意，也可以手动杀死进程。

你还可以通过指定`-r`选项来监视整个文件树。当你指定`-r`时，`WatchDir`遍历文件树，将每个目录注册到监视服务。

## 创建监视服务和注册事件

第一步是使用`FileSystem`类的`newWatchService()`方法创建一个新的`WatchService`，如下所示：

```java
WatchService watcher = FileSystems.getDefault().newWatchService();
```

接下来，向监视服务注册一个或多个对象。任何实现`Watchable`接口的对象都可以注册。`Path`类实现了`Watchable`接口，因此每个要监视的目录都作为`Path`对象注册。

与任何`Watchable`一样，`Path`接口实现了两个注册方法。本页使用双参数版本，`register(WatchService, WatchEvent.Kind...)`。（三参数版本采用`WatchEvent.Modifier`，目前尚未实现。）

在向监视服务注册对象时，你指定你想要监视的事件类型。支持的`StandardWatchEventKinds`事件类型如下：

- `ENTRY_CREATE` – 创建了一个目录项。
- `ENTRY_DELETE` – 删除了一个目录项。
- `ENTRY_MODIFY` – 修改了一个目录项。
- `OVERFLOW` – 表示可能已丢失或丢弃事件。你不必注册`OVERFLOW`事件即可接收到它。

以下代码片段展示了如何为所有三种事件类型注册一个`Path`实例：

```java
import static java.nio.file.StandardWatchEventKinds.*;

Path dir = ...;
try {
    WatchKey key = dir.register(
        watcher,
        ENTRY_CREATE,
        ENTRY_DELETE,
        ENTRY_MODIFY
    );
} catch (IOException x) {
    System.err.println(x);
}
```

## 处理事件

事件处理循环中的事件顺序如下：

1. 获取监视密钥。`WatchService`类提供了三种方法：
   - `poll()` – 如果可用，则返回排队的密钥。如果不可用，则立即返回null值。
   - `poll(long, TimeUnit)` – 如果有一个排队的密钥可用，则返回。如果没有立即可用的排队密钥，程序会等待指定的时间。`TimeUnit`参数决定指定的时间是纳秒、毫秒还是其他时间单位。
   - `take()` – 返回一个排队的密钥。如果没有排队的密钥可用，此方法会等待。
2. 处理密钥的待处理事件。你从`pollEvents()`方法获取`WatchEvent`对象的`List`。
3. 使用你的`WatchEvent`对象的`kind()`方法检索事件类型。无论密钥注册了哪些事件，都可能接收到一个`OVERFLOW`事件。你可以选择处理溢出或忽略它，但你应该测试它。
4. 使用事件的上下文检索与事件关联的文件名，因此使用`context()`方法检索它。
5. 在处理完密钥的事件后，你需要通过调用此`WatchKey`对象的`reset()`将密钥恢复到`ready`状态。如果此方法返回`false`，则密钥不再有效，循环可以退出。这一步非常重要。如果你没有调用`reset()`，这个密钥将不会接收到任何进一步的事件。

监视密钥有一个状态。在任何给定时间，它的状态可能是以下之一：

- `Ready`表示密钥已准备好接受事件。当密钥最初创建时，它处于就绪状态。
- `Signaled`表示一个或多个事件已排队。一旦密钥被信号触发，它就不再处于就绪状态，直到调用`reset()`方法。
- `Invalid`表示密钥不再处于活动状态。当发生以下事件之一时，会发生这种状态：
  - 进程通过使用`cancel()`方法明确取消密钥。
  - 目录变得不可访问。
  - 监视服务已关闭。

以下是一个事件处理循环的示例。它监视一个目录，等待新文件的出现。当新文件可用时，它使用`probeContentType(Path)`方法检查它是否是text/plain文件。

```java
for (;;) {

    // 等待密钥被信号触发
    WatchKey key;
    try {
        key = watcher.take();
    } catch (InterruptedException x) {
        return;
    }

    for (WatchEvent<?> event: key.pollEvents()) {
        WatchEvent.Kind<?> kind = event.kind();

        // 此密钥仅注册了ENTRY_CREATE事件，
        // 但无论事件丢失或丢弃，都可能发生OVERFLOW事件。
        if (kind == OVERFLOW) {
            continue;
        }

        // 文件名是事件的上下文。
        WatchEvent<Path> ev = cast(event);
        Path filename = ev.context();

        // 验证新文件是否是文本文件。
        try {
            // 将文件名解析为目录。如果文件名是“test”且目录是“foo”，
            // 则解析后的名称是“test/foo”。
            Path child = dir.resolve(filename);
            if (!Files.probeContentType(child).equals("text/plain")) {
                System.err.format("New file '%s'" +
                    " is not a plain text file.%n", filename);
                continue;
            }
        } catch (IOException x) {
            System.err.println(x);
            continue;
        }

        // 将文件发送电子邮件到指定的电子邮件别名。
        System.out.format("Emailing file %s%n", filename);
        // 细节留给读者....
    }

    // 重置密钥——如果你想接收进一步的监视事件，这一步至关重要。
    // 如果密钥不再有效，目录不可访问，那么退出循环。
    boolean valid = key.reset();
    if (!valid) {
        break;
    }
}
```

## 检索文件名

文件名从事件上下文中检索。前一个示例使用以下代码检索文件名：

```java
WatchEvent<Path> ev = cast(event);
Path filename = ev.context();
```

当你编译这个示例时，它会产生以下错误：

```java
Note: Example.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.

```

这个错误是由于将`WatchEvent<T>`强制转换为`WatchEvent<Path>`的代码行造成的。`WatchDir`示例通过创建一个实用程序强制转换方法来避免这个错误，该方法抑制了未检查的警告，如下所示：

```java
@SuppressWarnings("unchecked")
static <T> WatchEvent<T> cast(WatchEvent<?> event) {
    return (WatchEvent<Path>)event;
}
```

如果你不熟悉`@SuppressWarnings`语法，请参见有关注释的部分。

## 何时使用和不使用此API

监视服务API旨在为需要被通知文件更改事件的应用程序设计。它非常适合任何应用程序，如编辑器或IDE，可能有许多打开的文件并需要确保文件与文件系统同步。它也非常适合应用程序服务器监视目录可能需要等待`.jsp`或`.jar`文件的添加，以便部署它们。

这个API不是为了硬盘索引设计的。大多数文件系统实现都有文件更改通知的本地支持。监视服务API在可用时利用这种支持。然而，当文件系统不支持这种机制时，监视服务将轮询文件系统，等待事件。

## 监视目录示例

```java
import java.nio.file.*;
import static java.nio.file.StandardWatchEventKinds.*;
import static java.nio.file.LinkOption.*;
import java.nio.file.attribute.*;
import java.io.*;
import java.util.*;

/**
 * 监视目录（或树）的文件更改示例。
 */

public class WatchDir {

    private final WatchService watcher;
    private final Map<WatchKey,Path> keys;
    private final boolean recursive;
    private boolean trace = false;

    @SuppressWarnings("unchecked")
    static <T> WatchEvent<T> cast(WatchEvent<?> event) {
        return (WatchEvent<T>)event;
    }

    /**
     * 使用监视服务注册给定目录
     */
    private void register(Path dir) throws IOException {
        WatchKey key = dir.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
        if (trace) {
            Path prev = keys.get(key);
            if (prev == null) {
                System.out.format("register: %s\n", dir);
            } else {
                if (!dir.equals(prev)) {
                    System.out.format("update: %s -> %s\n", prev, dir);
                }
            }
        }
        keys.put(key, dir);
    }

    /**
     * 使用监视服务注册给定目录及其所有子目录。
     */
    private void registerAll(final Path start) throws IOException {
        // 注册目录和子目录
        Files.walkFileTree(start, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                register(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    /**
     * 创建监视服务并注册给定目录
     */
    WatchDir(Path dir, boolean recursive) throws IOException {
        this.watcher = FileSystems.getDefault().newWatchService();
        this.keys = new HashMap<WatchKey,Path>();
        this.recursive = recursive;

        if (recursive) {
            System.out.format("Scanning %s ...\n", dir);
            registerAll(dir);
            System.out.println("Done.");
        } else {
            register(dir);
        }

        // 初始注册后启用跟踪
        this.trace = true;
    }

    /**
     * 处理监视器排队的所有密钥的事件
     */
    void processEvents() {
        for (;;) {

            // 等待密钥被触发
            WatchKey key;
            try {
                key = watcher.take();
            } catch (InterruptedException x) {
                return;
            }

            Path dir = keys.get(key);
            if (dir == null) {
                System.err.println("WatchKey not recognized!!");
                continue;
            }

            for (WatchEvent<?> event: key.pollEvents()) {
                WatchEvent.Kind kind = event.kind();

                // 待办 - 提供如何处理OVERFLOW事件的示例
                if (kind == OVERFLOW) {
                    continue;
                }

                // 目录项事件的上下文是条目的文件名
                WatchEvent<Path> ev = cast(event);
                Path name = ev.context();
                Path child = dir.resolve(name);

                // 打印事件
                System.out.format("%s: %s\n", event.kind().name(), child);

                // 如果创建了目录，并且正在递归监视，则
                // 注册它及其子目录
                if (recursive && (kind == ENTRY_CREATE)) {
                    try {
                        if (Files.isDirectory(child, LinkOption.NOFOLLOW_LINKS)) {
                            registerAll(child);
                        }
                    } catch (IOException x) {
                        // 忽略以保持示例可读
                    }
                }
            }

            // 重置密钥，如果目录不再可访问，则从集合中移除
            boolean valid = key.reset();
            if (!valid) {
                keys.remove(key);

                // 所有目录都不可访问
                if (keys.isEmpty()) {
                    break;
                }
            }
        }
    }

    static void usage() {
        System.err.println("usage: java WatchDir [-r] dir");
        System.exit(-1);
    }

    public static void main(String[] args) throws IOException {
        // 解析参数
        if (args.length == 0 || args.length > 2)
            usage();
        boolean recursive = false;
        int dirArg = 0;
        if (args[0].equals("-r")) {
            if (args.length < 2)
                usage();
            recursive = true;
            dirArg++;
        }

        // 注册目录并处理其事件
        Path dir = Paths.get(args[dirArg]);
        new WatchDir(dir, recursive).processEvents();
    }
}
```



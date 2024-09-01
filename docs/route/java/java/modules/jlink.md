# 使用JLink创建运行时和应用镜像 

通过命令行工具 `jlink`，你可以选择一组模块，包括平台模块以及构成你的应用程序的模块，并将它们链接到一个运行时镜像中。
这样的运行时镜像就像你可以下载的JDK，但只包含你选择的模块以及它们正常工作所需的依赖项。
如果这些模块包括你的项目，那么结果就是你应用程序的自包含交付物，意味着它不依赖于目标系统上安装的JDK。
在链接阶段，`jlink`可以进一步优化镜像大小并提高VM性能，特别是启动时间。

虽然对 `jlink` 来说这并不重要，但区分创建 _运行时镜像_（JDK的一个子集）和 _应用镜像_（还包含项目特定模块）是有帮助的，所以我们将按这个顺序进行。

**注意：** `jlink` "只是" 链接字节码 - 它不会将其编译成机器码，所以这不是提前编译。

## 创建运行时镜像

要创建一个镜像，`jlink` 需要两个信息，每个都通过命令行选项指定：

- 从哪些模块开始 / `--add-modules`
- 在哪个文件夹中创建镜像 / `--output`

给定这些命令行选项，`jlink` 解析模块，从 `--add-modules` 列出的模块开始。
但它有一些特殊之处：

- 默认情况下不绑定服务 - 我们将在下面看到如何处理这个问题
- 可选依赖项未解析 - 需要手动添加
- 不允许自动模块 - 我们将在讨论应用镜像时讨论这个问题

除非遇到缺少或重复模块等问题，解析后的模块（根模块加传递依赖项）最终会进入新的运行时镜像。

### 最小的运行时

让我们看看这个。
最简单的运行时镜像只包含基础模块：

```shell
# 创建镜像
$ jlink
    --add-modules java.base
    --output jdk-base
# 使用镜像的java启动器列出所有包含的模块
$ jdk-base/bin/java --list-modules
> java.base
```

## 创建应用镜像

如前所述，`jlink` 不区分来自JDK的模块和其他模块，所以你可以使用类似的方法创建一个包含整个应用程序的镜像，这意味着它包含应用程序模块（应用程序本身及其依赖项）以及支持它们的平台模块。
要创建这样的镜像，你需要：

- 使用 `--module-path` 让 `jlink` 知道在哪里找到应用模块
- 使用 `--add-modules` 与应用程序的主模块和其他需要的模块，例如服务（见下文）或可选依赖项

结合起来，镜像包含的平台和应用程序模块被称为 _系统模块_。
注意 `jlink` 只操作显式模块，所以依赖自动模块的应用程序不能被链接到镜像中。

### 可选的模块路径

例如，假设应用程序的模块可以在一个名为 `mods` 的文件夹中找到，它的主模块叫做 `com.example.app`。
那么以下命令在 `app-image` 文件夹中创建一个镜像：

```shell
# 创建镜像
$ jlink
    --module-path mods
    --add-modules com.example.main
    --output app-image

# 列出包含的模块
$ app-image/bin/java --list-modules
> com.example.app
# 其他应用模块
> java.base
# 其他 java/jdk 模块
```

因为镜像包含了整个应用程序，你在启动它时不需要使用模块路径：

```shell
$ app-image/bin/java --module com.example.app/com.example.app.Main
```

虽然你不必使用模块路径，但你可以使用它。
在这种情况下，系统模块将始终遮蔽模块路径上同名的模块 - 就好像模块路径上的模块不存在一样。
所以你不能使用模块路径替换系统模块，但你可以向应用程序添加额外的模块。
这很可能是服务提供商，这允许你与应用程序一起发布镜像，同时仍然允许用户轻松地本地扩展它。

### 生成本地启动器

应用程序模块可以包含一个自定义启动器，这是一个在镜像的 `bin` 文件夹中的可执行脚本（基于Unix的操作系统上的shell，Windows上的批处理），预配置为用具体的模块和主类启动JVM。
要创建一个启动器，使用 `--launcher $NAME=$MODULE/$MAIN-CLASS` 选项：

- `$NAME` 是你为可执行文件选择的文件名
- `$MODULE` 是要启动的模块的名称
- `$MAIN-CLASS` 是模块的主类的名称

后面两个是你通常会放在 `java --module` 后面的。
就像在那里一样，如果模块定义了一个主类，你可以省略 `/$MAIN-CLASS`。

以上例为基础，这是如何创建一个名为 `app` 的启动器：

```shell
# 创建镜像
$ jlink
    --module-path mods
    --add-modules com.example.main
    --launcher app=com.example.app/com.example.app.Main
    --output app-image

# 启动
$ app-image/bin/app
```

然而，使用启动器确实有一个缺点：
你尝试应用到启动JVM的所有选项都会被解释为如果你把它们放在 `--module` 选项后面，使它们成为程序参数。
这意味着，当使用启动器时，你不能临时配置 `java` 命令，例如添加我们之前讨论过的额外服务。
解决这个问题的一个方法是编辑脚本，将这些选项放入 `JLINK_VM_OPTIONS` 环境变量中。
另一个方法是退回到 `java` 命令本身，它仍然在镜像中可用。

## 包含服务

为了能够创建小型且有意识组装的运行时镜像，`jlink` 默认情况下在创建镜像时不执行服务绑定。
相反，服务提供者模块必须通过在 `--add-modules` 中列出它们来手动包含。
要找出哪些模块提供了特定服务，请使用 `--suggest-providers $SERVICE` 选项，它列出了运行时或模块路径上提供 `$SERVICE` 实现的所有模块。
作为添加单个服务的替代方案，可以使用 `--bind-services` 选项来包含所有提供被其他已解析模块使用的服务的模块。

让我们以字符集为例，如 ISO-8859-1、UTF-8 或 UTF-16。
基础模块知道你每天需要的字符集，但有一个特定的平台模块包含了一些其他的字符集：_jdk.charsets_。
基础模块和 _jdk.charsets_ 通过服务解耦 - 这里是它们模块声明的相关部分：

```java
module java.base {
    uses java.nio.charset.spi.CharsetProvider;
}

module jdk.charsets {
    provides java.nio.charset.spi.CharsetProvider
        with sun.nio.cs.ext.ExtendedCharsets
}
```

在常规启动期间，当模块系统解析模块时，服务绑定会引入 _jdk.charsets_，所以当从标准JDK启动时，它的字符集总是可用的。
但是当使用 `jlink` 创建运行时镜像时，默认情况下不会发生这种情况，所以这样的镜像不会包含字符集模块。
如果你确定需要它们，你可以简单地使用 `--add-modules` 将模块包含在镜像中：

```shell
$ jlink
    --add-modules java.base,jdk.charsets
    --output jdk-charsets
$ jdk-charsets/bin/java --list-modules
> java.base
> jdk.charsets
```

## 跨操作系统生成镜像

虽然你的应用程序和库JAR包含的字节码是独立于任何操作系统的（OS），但它需要一个特定操作系统的Java虚拟机来执行它们 - 这就是为什么你需要为Linux、macOS或Windows（例如）下载特定于操作系统的JDK。
因为 `jlink` 从这里提取平台模块，所以它创建的运行时和应用镜像总是绑定到一个具体的操作系统。
幸运的是，它不必是你运行 `jlink` 的操作系统。

如果你下载并解压了一个针对不同操作系统的JDK，你可以在运行系统JDK中的 `jlink` 版本时将其 `jmods` 文件夹放在模块路径上。
然后，链接器将确定镜像是为那个其他操作系统创建的，因此将创建一个在该操作系统上工作（但当然不是在另一个操作系统上）的镜像。
所以，如果你有支持你的应用程序的所有操作系统的JDK，你可以在同一台机器上为它们各自生成运行时或应用镜像。
为了确保没有问题，建议只引用与 `jlink` 二进制文件完全相同的JDK版本的模块，例如，如果 `jlink` 的版本是 16.0.2，确保它从 JDK 16.0.2 加载平台模块。

让我们回到我们之前创建的应用镜像，并假设它建立在Linux构建服务器上。
然后这是如何为Windows创建一个应用镜像：

```shell
# 下载Windows的JDK并解压到 `jdk-win`

# 使用系统JDK中的jlink二进制文件创建镜像
# （在这个例子中，是Linux）
$ jlink
    --module-path jdk-win/jmods:mods
    --add-modules com.example.main
    --output app-image
```

为了验证这个镜像是特定于Windows的，检查 `app-image/bin`，它包含一个 `java.exe`。

## 优化镜像

在了解了如何为你的应用程序生成镜像或使用你的应用程序生成镜像之后，你可以优化它。
大多数优化都减少了镜像大小，有些稍微提高了启动时间。
查看 `jlink` 参考文档，了解你可以玩转的完整选项列表。
无论你应用了哪些选项，都不要忘记彻底测试生成的镜像并测量实际的改进。



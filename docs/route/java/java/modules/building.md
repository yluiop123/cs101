# 在命令行上构建模块 

当使用模块系统为你的代码创建模块时，你可能会在一个使用构建工具的项目中这样做，因此它的任务是正确地完成工作。
但是，理解“正确”看起来像什么，以及如何正确配置 `javac`、`jar` 和 `java` 来编译、打包和运行你的应用程序，这将极大地帮助你更好地理解模块系统，并在构建工具没有正确完成时帮助调试问题。

**注意**：
你需要了解模块系统基础知识，以充分利用本文。
你可能还想了解核心JDK工具的描述。

## 基本构建

给定一个带有一些源文件、模块声明和一些依赖项的项目，以下是你可以以最简单的方式编译、打包和运行它的方法：

```shell
# 编译源文件，包括 module-info.java
$ javac \
    --module-path $DEPS \
    -d $CLASS_FOLDER \
    $SOURCES

# 打包类文件，包括 module-info.class
$ jar --create \
    --file $JAR \
    $CLASSES

# 通过指定模块名称来运行
$ java \
    --module-path $JAR:$DEPS \
    --module $MODULE_NAME/$MAIN_CLASS
```

这里有一堆占位符：

- `$DEPS` 是依赖项列表。这些通常是路径到JAR文件，由 `:`（Unix）或 `;`（Windows）分隔，但在模块路径上，这也可以只是文件夹名称（不需要类路径上所需的 `/*` 技巧）。
- `$CLASS_FOLDER` 是 `*.class` 文件将被写入的文件夹路径。
- `$SOURCES` 是 `*.java` 文件列表，必须包括 `module-info.java`。
- `$JAR` 是将被创建的JAR文件的路径。
- `$CLASSES` 是在编译期间创建的 `*.class` 文件列表（因此可以在 `$CLASS_FOLDER` 中找到），并且必须包括 `module-info.class`。
- `$MODULE_NAME/$MAIN_CLASS` 是初始模块（即模块解析开始的地方）的名称，后面是包含应用程序 `main` 方法的类的名称。

对于一个具有常见 `src/main/java` 结构的简单“Hello World”风格的项目，只有一个源文件，依赖项在 `deps` 文件夹中，并且使用Maven的 `target` 文件夹，它将如下所示：

```shell
$ javac \
    --module-path deps \
    -d target/classes \
    src/main/java/module-info.java \
    src/main/java/com/example/Main.java
$ jar --create \
    --file target/hello-modules.jar \
    target/classes/module-info.class \
    target/classes/com/example/Main.class
$ java \
    --module-path target/hello-modules.jar:deps \
    --module com.example/com.example.Main
```

## 定义主类

`jar` 选项 `--main-class $MAIN_CLASS` 将 `$MAIN_CLASS` 嵌入到模块描述符中，作为包含 `main` 方法的类，这允许你在不必命名主类的情况下启动模块：

```shell
$ jar --create \
    --file target/hello-modules.jar \
    --main-class com.example.Main \
    target/classes/module-info.class \
    target/classes/com/example/Main.class
$ java \
    --module-path target/hello-modules.jar:deps \
    --module com.example
```

注意，可以覆盖这个类并启动另一个类，只需像以前一样命名它：

```shell
# 创建一个包含 `Main` 和 `Side` 的JAR，
# 使 `Main` 成为主类
$ jar --create \
    --file target/hello-modules.jar \
    --main-class com.example.Main \
    target/classes/module-info.class \
    target/classes/com/example/Main.class \
    target/classes/com/example/Side.class
# 覆盖主类并启动 `Side`
$ java \
    --module-path target/hello-modules.jar:deps \
    --module com.example/com.example.Side
```

## 绕过强封装

模块系统对访问内部API非常严格：
如果包没有被导出或打开，将拒绝访问。
但是，一个包不能仅仅被模块的作者导出或打开 - 还有命令行标志 `--add-exports` 和 `--add-opens`，它们允许模块的 _用户_ 也这样做。

例如，看这段尝试创建内部类 `sun.util.BuddhistCalendar` 实例的代码：

```java
BuddhistCalendar calendar = new BuddhistCalendar();
```

为了编译和运行它，我们需要使用 `--add-exports`：

```shell
javac \
    --add-exports java.base/sun.util=com.example.internal \
    module-info.java Internal.java
# 用 `jar` 打包
java \
    --add-exports java.base/sun.util=com.example.internal \
    --module-path com.example.internal.jar \
    --module com.example.internal
```

如果访问是反射的...

```java
Class.forName("sun.util.BuddhistCalendar").getConstructor().newInstance();
```

... 编译将在没有进一步配置的情况下工作，但我们在运行代码时需要添加 `--add-opens`：

```shell
java \
    --add-opens java.base/sun.util=com.example.internal \
    --module-path com.example.internal.jar \
    --module com.example.internal
```

有关强封装及其使用 `add-exports` 和 `add-opens` 绕过的详细信息。

## 扩展模块图

从一组初始根模块开始，模块系统计算它们所有的依赖项并构建一个图，其中模块是节点，它们的可读性关系是有向边。
这个模块图可以通过命令行标志 `--add-modules` 和 `--add-reads` 扩展，分别添加模块（及其依赖项）和可读性边。

例如，假设一个项目对 _java.sql_ 有一个可选依赖项，但模块在其他情况下不需要。
这意味着如果不提供一点帮助，它不会被添加到模块图中：

```shell
# 没有 java.sql 启动
$ java \
    --module-path example.jar:deps \
    --module com.example/com.example.Main

# 带有 java.sql 启动
$ java \
    --module-path example.jar:deps \
    --add-modules java.sql \
    --module com.example/com.example.Main
```

可选依赖的另一种方法是根本不列出依赖项，只使用 `--add-modules` 和 `--add-reads` 添加它（这很少有帮助，通常不推荐 - 只是一个例子）：

```shell
$ java \
    --module-path example.jar:deps \
    --add-modules java.sql \
    --add-reads com.example=java.sql \
    --module com.example/com.example.Main
```


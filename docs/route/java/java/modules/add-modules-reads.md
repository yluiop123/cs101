# 通过 `--add-modules` 和 `--add-reads` 扩展模块图 

从一组初始的根模块开始，模块系统计算它们所有的依赖项并构建一个图，其中模块是节点，它们的可读性关系是有向边。
这个模块图可以通过命令行标志 `--add-modules` 和 `--add-reads` 进行扩展，分别添加模块（及其依赖项）和可读性边。
前者有一些用例，后者非常小众，但无论如何，了解它们是有好处的。

**注意**：
你需要了解模块系统的基础以及如何从命令行构建和启动，以充分利用这篇文章。

## 使用 `--add-modules` 添加根模块

选项 `--add-modules $MODULES` 在 `javac`、`jlink` 和 `java` 上可用，并接受一个由逗号分隔的模块列表，将它们添加到根模块集合中。
（根模块形成了模块解析开始的初始模块集合。）
这允许你向模块图中添加模块（及其依赖项），否则它们不会出现，因为初始模块不依赖它们（直接或间接）。

`--add-modules` 选项有三个特殊值：

- `ALL-DEFAULT` 是一组模块，当从类路径启动代码时被选为根模块。
  这在应用程序是一个容器，托管其他应用程序时很有用，这些应用程序又依赖于容器本身不需要的模块。
- `ALL-SYSTEM` 将所有系统模块添加到根集合，有时测试框架需要这样做。
  这个选项会导致许多模块被解析；通常应该优先选择 `ALL-DEFAULT`。
- `ALL-MODULE-PATH` 将模块路径上找到的所有模块添加到根集合。
  这是为像 Maven 这样的构建工具提供的，它们已经确保模块路径上的所有模块都是需要的。
  它也是将自动模块添加到根集合的便捷方式。

前两个只在运行时工作，用于本文不讨论的非常特定情况。
最后一个非常有用：有了它，模块路径上的所有模块都成为根模块，因此它们都进入了模块图。

`--add-modules` 后面的空格可以用等号 `=` 替换，这有助于一些工具配置：
`--add-modules=...`。

### 添加模块的用例

`--add-modules` 的一个用例是添加可选依赖项，这些依赖项在其他情况下不需要，因此不会进入模块图。
例如，假设一个项目对 _java.sql_ 有可选依赖，但模块在其他情况下不需要：

```shell
# 没有 java.sql 启动
$ java
    --module-path example.jar:deps
    --module com.example/com.example.Main

# 带有 java.sql 启动
$ java
    --module-path example.jar:deps
    --add-modules java.sql
    --module com.example/com.example.Main
```

另一个是在创建运行时镜像时定义根模块集合，使用 `jlink`。

添加模块时，可能需要让其他模块读取它们，所以我们接下来做这个。

## 使用 `--add-reads` 添加可读性边

编译器和运行时选项 `--add-reads $MODULE=$TARGETS` 从 _$MODULE_ 向逗号分隔列表 _$TARGETS_ 中的所有模块添加可读性边。
这允许 _$MODULE_ 访问那些模块导出的所有公共类型，即使 _$MODULE_ 没有 `requires` 子句提及它们。
如果 _$TARGETS_ 设置为 `ALL-UNNAMED`，_$MODULE_ 甚至可以读取未命名模块。

`--add-reads` 后面的空格可以用等号 `=` 替换，这有助于一些工具配置：
`--add-reads=.../...`。

### 添加可读性的示例

让我们回到之前的例子，其中代码使用了 _java.sql_，但不想总是依赖它。
可选依赖的另一种方法是根本不列出依赖项，而只使用 `--add-modules` 和 `--add-reads` 添加它（这很少有帮助，通常不推荐 - 只是一个例子）：

```shell
# 这只显示启动，但编译
# 也需要这两个选项
$ java
    --module-path example.jar:deps
    --add-modules java.sql
    --add-reads com.example=java.sql
    --module com.example/com.example.Main
```


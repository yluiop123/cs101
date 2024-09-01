# 使用 `--add-exports` 和 `--add-opens` 绕过强封装 

模块系统对内部API的访问非常严格：
如果包没有被导出或打开，将拒绝访问。
但是，包不能仅由模块的作者导出或打开 - 还有命令行标志 `--add-exports` 和 `--add-opens`，它们允许模块的**用户**也这样做。

这样，就可以编写和运行访问应用程序依赖项或JDK API内部的代码。
由于这涉及到更多功能或性能（假定）与较低的可维护性或破坏平台完整性之间的权衡，这个决定不应该轻率做出。
而且，因为它最终不仅关系到开发者，还关系到生成应用程序的用户，这些命令行标志必须在启动时应用，以便用户意识到正在做出权衡。

**注意**：
要完全理解这个特性，你需要对模块系统的一些不同方面有深入的理解，即它的基础，对反射的支持，限定的 `exports` 和 `opens`，如何从命令行构建和启动，以及强封装的重要性。

## 使用 `--add-exports` 导出包

选项 `--add-exports $MODULE/$PACKAGE=$READING_MODULE`，可用于 `java` 和 `javac` 命令，将 _$MODULE_ 的 `$PACKAGE` 导出到 _$READING\_MODULE_。
因此，_$READING\_MODULE_ 中的代码可以访问 `$PACKAGE` 中的所有公共类型和成员，但其他模块不能。
当将 _$READING\_MODULE_ 设置为 `ALL-UNNAMED` 时，类路径上的所有代码都可以访问该包。
在不使用模块的项目中，你将始终使用那个占位符 - 只有当你自己的代码以模块形式运行时，你才能将导出的包限制为特定模块。

`--add-exports` 后面的空格可以用等号 `=` 替换，这有助于一些工具配置（例如 Maven）：
`--add-exports=.../...=...`。

### 在编译时

例如，看到这段尝试创建内部类 `sun.util.BuddhistCalendar` 实例的代码：

```java
BuddhistCalendar calendar = new BuddhistCalendar();
```

如果我们像那样编译它，我们会在导入或该行本身（如果没有导入）得到以下错误：

```
error: package sun.util is not visible
  (package sun.util is declared in module java.base, which does not export it)
```

选项 `--add-exports` 可以解决这个问题。
如果上面的代码没有模块声明，我们需要将包 `ALL-UNNAMED` 打开：

```shell
javac
    --add-exports java.base/sun.util=ALL-UNNAMED
    Internal.java
```

如果它在名为 _com.example.internal_ 的模块中，我们可以更精确，从而最小化内部暴露：

```shell
javac
    --add-exports java.base/sun.util=com.example.internal
    module-info.java Internal.java
```

### 在运行时

当启动代码（在 JDK 17 及更高版本）时，我们会得到运行时错误：

```
java.lang.IllegalAccessError:
    class Internal (in unnamed module @0x758e9812)
    cannot access class sun.util.BuddhistCalendar (in module java.base)
    because module java.base does not export sun.util to unnamed module @0x758e9812
```

为了解决这个问题，我们需要在启动时重复 `--add-exports` 选项。
对于类路径上的代码：

```shell
java
    --add-exports java.base/sun.util=ALL-UNNAMED
    --class-path com.example.internal.jar
    com.example.internal.Internal
```

如果它在名为 _com.example.internal_ 的模块中（定义了一个主类），我们可以再次更精确：

```shell
java
    --add-exports java.base/sun.util=com.example.internal
    --module-path com.example.internal.jar
    --module com.example.internal
```

## 使用 `--add-opens` 打开包

命令行选项 `--add-opens $MODULE/$PACKAGE=$REFLECTING_MODULE` 打开 _$MODULE_ 的 `$PACKAGE` 到 _$REFLECTING\_MODULE_。
因此，_$REFLECTING\_MODULE_ 中的代码可以通过反射访问 `$PACKAGE` 中的所有类型和成员，包括公共和非公共的，但其他模块不能。
当将 _$READING\_MODULE_ 设置为 `ALL-UNNAMED` 时，类路径上的所有代码都可以反射访问该包。
在不使用模块的项目中，你将始终使用那个占位符 - 只有当你自己的代码以模块形式运行时，你才能将打开的包限制为特定模块。

`--add-opens` 后面的空格可以用等号 `=` 替换，这有助于一些工具配置：
`--add-opens=.../...=...`。

由于 `--add-opens` 绑定到反射，这是一个纯粹的运行时概念，它只对 `java` 命令有意义。
但鉴于许多命令行选项在多个工具中都有效，报告和解释一个选项 _不_ 适用是有帮助的，因此 `javac` 不会拒绝该选项，而是发出警告 "--add-opens has no effect at compile time"。

### 在运行时

例如，看到这个在 `Internal` 类中尝试使用反射创建内部类 `sun.util.BuddhistCalendar` 实例的代码：

```java
Class.forName("sun.util.BuddhistCalendar").getConstructor().newInstance();
```

由于代码没有 _编译_ 针对内部类 `BuddhistCalendar`，编译工作不需要额外的命令行标志。
但在 JDK 17 及更高版本上，执行生成的代码会导致运行时异常：

```
Exception in thread "main" java.lang.IllegalAccessException:
    class Internal cannot access class sun.util.BuddhistCalendar (in module java.base)
    because module java.base does not export sun.util to unnamed module @1f021e6c
        at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392)
        at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674)
        at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:489)
        at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
```

选项 `--add-opens` 可以解决这个问题。
如果上面的代码在类路径上的 JAR 中，我们需要将包 `sun.util` 打开到 `ALL-UNNAMED`：

```shell
java
    --add-opens java.base/sun.util=ALL-UNNAMED
    --class-path com.example.internal.jar
    com.example.internal.Internal
```

（回想一下关于强封装的文章，没有必要打开 `sun.misc` 和 `sun.reflect` 包，因为它们由 _jdk.unsupported_ 导出。）

如果它在名为 _com.example.internal_ 的模块中（定义了一个主类），我们可以更精确，从而最小化内部暴露：

```shell
java
    --add-opens java.base/sun.util=com.example.internal
    --module-path com.example.internal.jar
    --module com.example.internal
```


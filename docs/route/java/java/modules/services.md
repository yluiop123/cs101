# 用服务解耦模块 

在Java中，常见的做法是将API建模为接口（有时是抽象类），然后根据情况选择最佳的实现。
理想情况下，API的消费者与实现完全解耦，意味着它们之间没有直接依赖。
Java的服务于加载器API允许将这种方法应用于JAR（无论是否模块化），并且模块系统将其作为一等概念与模块声明中的 `uses` 和 `provides` 指令集成。

**注意**：
为了充分利用本文，你需要了解模块系统基础知识。

## Java模块系统中的服务

### 举例说明问题

让我们从一个例子开始，该例子使用三个模块中的这三种类型：

- 类 `Main` 在 `com.example.app` 中
- 接口 `Service` 在 `com.example.api` 中
- 类 `Implementation`（实现 `Service`）在 `com.example.impl` 中

`Main` 想要使用 `Service` 但需要创建 `Implementation` 来获取一个实例：

```java
public class Main {
    public static void main(String[] args) {
        Service service = new Implementation();
        use(service);
    }

    private static void use(Service service) {
        // ...
    }
}
```

这导致以下模块声明：

```java
module com.example.api {
    exports com.example.api;
}

module com.example.impl {
    requires com.example.api;
    exports com.example.impl;
}

module com.example.app {
    // 依赖API: ✅
    requires com.example.api;
    // 依赖实现: ⚠️
    requires com.example.impl;
}
```

如你所见，使用接口来解耦API的用户和提供者的挑战在于，最终必须实例化一个特定的实现。
如果像 `Main` 中那样作为常规构造函数调用发生，它将创建对实现的依赖，从而在两个模块之间创建依赖。
这就是服务解决的问题。

### 服务定位器模式作为解决方案

Java通过实现服务定位器模式来解决这个问题，类 `ServiceLoader` 充当中央注册表。
以下是它的工作原理。

服务是一个可访问的类型（不必是接口；抽象类甚至具体类也可以作为服务），一个模块想要使用它，另一个模块提供它的实例：

- **使用** 服务的模块必须在其模块描述符中用 `uses $SERVICE` 指令表达其需求，其中 `$SERVICE` 是服务类型的完全限定名。
- **提供** 服务的模块必须用 `provides $SERVICE with $PROVIDER` 指令表达其提供，其中 `$SERVICE` 与 `uses` 指令中的类型相同，`$PROVIDER` 是另一个类的完全限定名，该类是...
  - _要么是_ 一个具体类，扩展或实现 `$SERVICE` 并具有公共无参构造函数（称为 _提供者构造函数_)
  - _或_ 一个任意类型，具有公共静态无参方法 `provide`，返回扩展或实现 `$SERVICE` 的类型（称为 _提供者方法_）

在运行时，依赖模块可以使用 `ServiceLoader` 类通过调用 `ServiceLoader.load($SERVICE.class)` 获取服务的所有提供实现。
然后模块系统将返回一个 `ServiceLoader<$SERVICE>`，你可以用它以各种方式访问服务提供者。
`ServiceLoader` 的Javadoc详细说明了这一点（实际上，所有与服务相关的其他内容）。

### 举例说明解决方案

以下是我们之前检查的三个类和模块如何使用服务。
我们从模块声明开始：

```java
module com.example.api {
    exports com.example.api;
}

module com.example.impl {
    requires com.example.api;
    provides com.example.api.Service
        with com.example.impl.Implementation;
}

module com.example.app {
    requires com.example.api;
    uses com.example.api.Service;
}
```

注意 `com.example.app` 不再需要 `com.example.impl` 。
相反，它声明它使用 `Service` 并且 `com.example.impl` 声明它提供 `Implementation`。
此外，`com.example.impl` 不再导出 `com.example.impl` 包。
服务加载器不要求服务实现在模块外部可访问，如果没有其他类需要，我们可以停止导出它。
这是服务的一个额外好处，因为它可以减少模块的API表面。

以下是 `Main` 如何获取 `Service` 的实现：

```java
public class Main {
    public static void main(String[] args) {
        Service service = ServiceLoader
            .load(Service.class)
            .findFirst()
            .orElseThrow();
        use(service);
    }

    private static void use(Service service) {
        // ...
    }
}
```

### 一些JDK服务

JDK本身也使用服务。
例如，包含JDBC API的 `java.sql` 模块使用 `java.sql.Driver` 作为服务：

```java
module java.sql {
    // requires...
    // exports...
    uses java.sql.Driver;
}
```

这也展示了一个模块可以使用它自己的类型作为服务。

JDK中服务的另一个示例是 `java.lang.System.LoggerFinder`。
这是API的一部分，允许用户将JDK的日志消息（不是运行时的!）导入他们选择的日志框架（比如Log4J或Logback）。
简单地说，JDK不是写入标准输出，而是使用 `LoggerFinder` 创建 `Logger` 实例，然后使用它们记录所有消息。
由于它使用 `LoggerFinder` 作为服务，日志框架可以提供它的实现。

```java
module com.example.logger {
    // `LoggerFinder` 是服务接口
    provides java.lang.System.LoggerFinder
        with com.example.logger.ExLoggerFinder;
}

public class ExLoggerFinder implements System.LoggerFinder {
    // `ExLoggerFinder` 必须有无参构造函数

    @Override
    public Logger getLogger(String name, Module module) {
        // `ExLogger` 必须实现 `Logger`
        return new ExLogger(name, module);
    }
}
```

## 模块解析期间的服务

如果你曾经使用命令行选项 `--show-module-resolution` 启动过一个简单的模块化应用程序，并观察了模块系统确切在做什么，你可能对解析的平台模块数量感到惊讶。
对于足够简单的应用程序，应该只有 _java.base_ 和可能一两个其他平台模块，那么为什么会有那么多其他模块呢？
服务是答案。

记住从模块系统基础知识中，只有在模块解析期间进入图的模块才在运行时可用。
为确保服务的所有提供者都是这种情况，解析过程会考虑 `uses` 和 `provides` 指令。
因此，除了追踪依赖项之外，一旦它解析了一个使用服务的模块，它还会将提供该服务的所有模块添加到图中。
这个过程称为 _服务绑定_。


# Java中的模块介绍 

## 模块声明

每个模块的核心是**模块声明**，这是一个名为`module-info.java`的文件，定义了模块的所有属性。例如，这是`java.sql`平台模块的声明，它定义了JDBC API：

```java
module java.sql {
    requires transitive java.logging;
    requires transitive java.transaction.xa;
    requires transitive java.xml;

    exports java.sql;
    exports javax.sql;

    uses java.sql.Driver;
}
```

它定义了模块的名称（`java.sql`）、它对其他模块的依赖（`java.logging`、`java.transaction.xa`、`java.xml`）、构成其公共API的包（`java.sql`和`javax.sql`），以及它使用（`java.sql.Driver`）的服务。这个模块已经采用了一种更精细的形式来定义依赖关系，通过添加`transitive`关键字，但当然它并没有使用模块系统的所有功能。

一般来说，模块声明具有以下基本形式：

```java
module $NAME {
    // 对于每个依赖项：
    requires $MODULE;

    // 对于每个API包：
    exports $PACKAGE

    // 对于每个用于反射的包：
    opens $PACKAGE;

    // 对于每个使用的服务：
    uses $TYPE;

    // 对于每个提供的服务：
    provides $TYPE with $CLASS;
}
```

（整个模块可以是`open`的，`requires`、`exports`和`opens`指令可以进一步细化，但这些是以后的主题。）

你可以为你的项目创建模块声明。它们推荐的位置 - 工具最容易找到它们的地方 - 是项目的源根文件夹，即包含你的包目录的文件夹，通常是`src/main/java`。对于库，模块声明可能看起来像这样：

```java
module com.example.lib {
    requires java.sql;
    requires com.sample.other;

    exports com.example.lib;
    exports com.example.lib.db;

    uses com.example.lib.Service;
}
```

对于应用程序，它可能是这样的：

```java
module com.example.app {
    requires com.example.lib;

    opens com.example.app.entities;

    provides com.example.lib.Service
        with com.example.app.MyService;
}
```

让我们快速了解一下细节。
本节重点介绍需要放入模块声明的内容：

- 模块名称
- 依赖项
- 导出的包
- 使用和提供的服务

效果在稍后的部分讨论。

### 模块名称

模块名称具有与包名称相同的要求和指南：

- 合法字母包括`A`-`Z`、`a`-`z`、`0`-`9`、`_`和`$`，用`.`分隔
- 按惯例模块名称全部小写，`$`仅用于机械生成的代码
- 名称应该是全局唯一的

在前面的例子中，JDK模块的声明以`module java.sql`开始，它定义了一个名为`java.sql`的模块。
两个自定义模块分别命名为`com.example.lib`和`com.example.app`。

给定一个JAR，可以从项目的文档中推断出相应的模块名称，查看JAR中的`module-info.class`文件（稍后详细介绍），借助IDE，或者通过运行`jar --describe-module --file $FILE`对JAR文件进行操作。

关于模块名称唯一性的建议与包名称相同：
选择与项目相关的URL，并将其反转以形成模块名称的第一部分，然后从那里进行细化。
（这意味着两个示例模块与域example.com相关联。）
如果你将这个过程应用于模块名称和包名称，前者通常是后者的前缀，因为模块比包更通用。
这当然不是必需的，但表明名称选择得很好。

### 需要依赖项

`requires`指令列出了所有直接依赖项的模块名称。
看看上面的三个模块中的那些：

```java
// 来自java.sql，但没有`transitive`
requires java.logging;
requires java.transaction.xa;
requires java.xml;

// 来自com.example.lib
requires java.sql;
requires com.sample.other;

// 来自com.example.app
requires com.example.lib;
```

我们可以看到应用程序模块`com.example.app`依赖于库`com.example.lib`，后者又需要不相关的模块`com.sample.other`和平台模块`java.sql`。
我们没有`com.sample.other`的声明，但我们知道`java.sql`依赖于`java.logging`、`java.transaction.xa`和`java.xml`。
如果我们查找这些，我们会看到它们没有进一步的依赖项。
（或者更确切地说，没有显式依赖项 - 有关基础模块的更多详细信息，请查看有关基础模块的部分。）

还可以处理可选依赖项（使用`requires static`）和将作为模块API一部分的依赖项"转发"（使用`requires transitive`），但这在单独的文章中介绍。

外部依赖项列表很可能与你的构建配置中列出的依赖项非常相似。
这经常导致一个问题，即这是否是多余的，应该自动生成。
这不是多余的，因为模块名称不包含版本或构建工具需要获取JAR的任何其他信息（如组ID和工件ID），而构建配置列出了这些信息，但没有模块的名称。
因为给定一个JAR可以推断出模块名称，所以有可能生成`module-info.java`的这一部分。
然而，这是否值得努力还不清楚，特别是考虑到平台模块的依赖项和`static`和`transitive`修饰符的复杂性，以及IDE在需要时已经建议添加`requires`指令（就像包导入一样），这使得更新模块声明非常简单。

### 导出和打开包

默认情况下，所有类型，即使是`public`类型的，都只能在模块内部访问。
要让模块外部的代码访问类型，需要导出或打开包含该类型的包。
这是通过使用`exports`和`opens`指令实现的，它们包括模块包含的包的名称。
导出的确切效果在强封装部分讨论，打开的效果在反射文章中讨论，但要点是：

- 导出包中的公共类型和成员在编译和运行时都可用
- 打开包中的所有类型和成员都可以通过反射在运行时访问

这里是三个示例模块中的`exports`和`opens`指令：

```java
// 来自module java.sql
exports java.sql;
exports javax.sql;

// 来自com.example.lib
exports com.example.lib;
exports com.example.lib.db;

// 来自com.example.app
opens com.example.app.entities;
```

这表明`java.sql`导出了一个同名包以及`javax.sql` - 当然，模块包含更多的包，但它们不是其API的一部分，与我们无关。
库模块导出了两个包供其他模块使用 - 再次，所有其他（潜在的）包都被安全地锁定了。
应用程序模块没有导出任何包，这并不罕见，因为启动应用程序的模块很少是其他模块的依赖项，所以没有人调用它。
它确实为反射打开了`com.example.app.entities` - 根据名称判断，可能是因为它包含其他模块想要通过反射与之交云的实体（想想JPA）。

还有限定的`exports`和`opens`指令变体，允许你只向特定模块导出/打开一个包。

作为经验法则，尽量导出尽可能少的包 - 就像保持字段私有，只在需要时使方法包可见或公开，并且默认使类包可见，只有在另一个包中需要时才公开。
这减少了其他地方可见的代码量，从而降低了复杂性。

### 使用和提供服务

服务是他们自己的主题 - 现在只要说你可以使用它们来解耦API的用户和它的实现，使得在启动应用程序时（甚至更晚）替换它变得容易。
如果一个模块将一个类型（一个接口或类）用作服务，它需要在模块声明中用`uses`指令声明，包括完全限定的类型名称。
提供服务的模块在其模块声明中表达哪些自己的类型这样做（通常通过实现或扩展它）。

库和应用程序示例模块展示了两个方面：

```java
// 在com.example.lib中
uses com.example.lib.Service;

// 在module com.example.app中
provides com.example.lib.Service
    with com.example.app.MyService;
```

库模块使用`Service`，它自己的一个类型，作为服务，而依赖库模块的应用程序模块，提供了`MyService`。
在运行时，库模块将通过使用`ServiceLoader` API调用`ServiceLoader.load(Service.class)`来访问实现/扩展服务类型的所有类。
这意味着库模块执行定义在应用程序模块中的行为，尽管它不依赖于它 - 这是一个很好的解耦和保持模块关注它们的问题。

## 构建和启动模块

模块声明`module-info.java`是一个源文件，就像任何其他源文件一样，所以在它在JVM中运行之前需要几个步骤。
幸运的是，这些正是你的源代码所采取的确切步骤，大多数构建工具和IDE足够了解它，能够适应它的存在。
很可能你不需要手动做任何事情来构建和启动模块化代码库。
当然，了解细节是有价值的，所以一篇专门的文章将带你从源代码到仅使用命令行工具运行的JVM。

在这里，我们将保持在更高层次的抽象上，而不是讨论构建和运行模块化代码的几个重要概念：

- 模块化JAR
- 模块路径
- 模块解析和模块图
- 基础模块

### 模块化JAR

一个`module-info.java`文件（又名模块声明）被编译为`module-info.class`（称为模块描述符），然后可以将其放入JAR的根目录或版本特定的目录中，如果是多版本JAR。
包含模块描述符的JAR称为**模块化JAR**，准备用作模块 - 没有描述符的JAR是**普通JAR**。
如果将模块JAR放置在模块路径上（见下文），它在运行时就成为一个模块，但它也可以在类路径上使用，在那里它成为无名模块的一部分，就像类路径上的普通JAR一样。

### 模块路径

**模块路径**是一个新概念，与类路径平行：
它是包含工件（JAR或字节码文件夹）和目录的列表。
模块系统使用它来定位在运行时找不到的所需模块，因此通常是所有应用程序、库和框架模块。
它将模块路径上的所有工件转换为模块，甚至是普通JAR，这些JAR被转换为自动模块，这使得增量模块化成为可能。
`javac`和`java`以及其他与模块相关的命令都理解和处理模块路径。

**旁注：**
这一节和前一节一起揭示了模块系统的一个可能令人惊讶的行为：
一个JAR是否是模块化的，并不决定它是否被视为模块！
所有在类路径上的JAR都被当作一个几乎没有模块的模块对待，所有在模块路径上的JAR都被转换为模块。
这意味着负责项目的人员可以选择哪些依赖项最终成为单独的模块，哪些不（与依赖项的维护者相反）。

### 模块解析和模块图

要启动模块化应用程序，使用模块路径和一个所谓的**初始模块**运行`java`命令 - 包含`main`方法的模块：

```shell
# 模块在`app-jars` | 初始模块是`com.example.app`
java --module-path app-jars --module com.example.app
```

这将启动一个称为**模块解析**的过程：
从初始模块的名称开始，模块系统将在模块路径上搜索它。
如果它找到了它，它将检查它的`requires`指令，看看它需要哪些模块，然后对他们重复这个过程。
如果它没有找到一个模块，它会立即抛出一个错误，让你知道一个依赖项缺失。
你可以通过添加命令行选项`--show-module-resolution`来观察这个过程。

这个过程的结果是**模块图**。
它的节点是模块，它的边有点复杂：
每个`requires`指令都会在两个模块之间生成一个边，称为**可读性边**，其中需要模块的模块**读取**所需的模块。
还有其他创建边的方法，但这并不需要我们现在关心，因为它不会改变任何基本的东西。

如果我们想象一个普通的Java程序，例如一个Web应用程序的后端，我们可以想象它的模块图：
在顶部，我们会找到初始模块，进一步向下是其他应用程序模块以及它们使用的框架和库。
然后是它们的依赖项，最终是JDK模块，其中`java.base`在底部 - 继续阅读有关该模块的详细信息。

### 基础模块

有一个模块统治它们所有：`java.base`，所谓的**基础模块**。
它包含像`Class`和`ClassLoader`这样的类，像`java.lang`和`java.util`这样的包，以及整个模块系统。
没有它，JVM上的程序无法运行，因此它获得了特殊地位：

- 模块系统特别意识到它
- 不需要在模块声明中放入`requires java.base` - 基础模块的依赖是免费的

因此，当早期部分讨论了各种模块的依赖项时，那并不完全完整。
它们也都隐含地依赖于基础模块 - 因为它们必须这样做。
当前一节说模块系统从模块解析开始时，那也不完全正确。
首先发生的是，在深刻的鸡和鸡蛋的困惑中，模块系统解析基础模块并引导自身。

## 模块系统的好处

那么，为你的项目创建模块声明你得到了什么好处呢？
这里是三个最突出的好处：

- 强封装
- 可靠的配置
- 可扩展的平台

### 强封装

没有模块，每个公共类或成员都可以被任何其他类自由使用 - 没有办法使某物在JAR内部可见但不超出其边界。
即使是非公共可见性也不是真正的威慑，因为总有反射可以用来破坏私有API。
原因是JAR没有边界，它们只是类加载器从中加载类的容器。

模块是不同的，它们确实有一个编译器和运行时都认可的边界。
一个模块中的类型只能被使用，如果：

- 类型是公开的（像以前一样）
- 包被导出
- 使用类型的模块读取包含类型的模块

这意味着模块的创建者对哪些类型构成公共API有更多的控制权。
不再仅仅是**所有公共类型**，现在是**导出包中的所有公共类型**，这最终允许我们锁定不应该在子项目之外使用的公共类型。

这对于JDK API本身显然是至关重要的，其开发人员不再需要恳求我们不要使用像`sun.*`或`com.sun.*`这样的包（有关这些内部API发生了什么以及为什么你仍然可以使用`sun.misc.Unsafe`的更多信息，请参见有关JDK内部强封装的文章）。
JDK也不再需要依赖安全管理器的手动方法来防止访问安全敏感类型和方法，从而消除了一整类潜在的安全风险。
库和框架也可以从明确传达和强制执行哪些API是公共的（大概是稳定的）以及哪些是内部的中受益。

应用程序代码库，无论大小，都可以确保不会意外地使用其依赖项的内部API，这些API可能在任何补丁版本中更改。
较大的代码库可以进一步从创建具有强边界的多个模块中受益。
这样，实现功能的开发者可以清楚地向同事传达哪些部分的添加代码是供应用程序的其他部分使用的，哪些只是内部脚手架 - 不再意外地使用一个"从未打算用于那个用例"的API。

所有这些话都说了，如果你绝对必须使用内部API，无论是JDK还是其他模块的，你仍然可以使用这两个命令行标志，假设你控制了应用程序的启动命令。

### 可靠的配置

在模块解析期间，模块系统检查所有所需的依赖项，无论是直接的还是传递的，是否都存在，并在缺少某些东西时报告错误。
但它超出了仅仅检查存在。

必须没有歧义，即没有两个工件可以声称它们是同一个模块。
这在两个版本的同一模块存在的情况下特别有趣。
因为模块系统没有版本的概念（除了将它们记录为字符串），它将这种情况视为重复模块。
因此，如果它遇到这种情况，它会报告一个错误。

模块之间不能有静态依赖循环。
在运行时，模块之间可能并且确实需要相互访问（想想使用Spring注解的代码和Spring反射该代码），但这些不能是编译依赖项（显然，Spring没有编译对它反射的代码）。

包应该有唯一的来源，所以没有两个模块可以包含同一个包中的类型。
如果它们这样做，这被称为**拆分包**，模块系统将拒绝编译或启动这样的配置。

这种验证当然不是无懈可击的，问题可能隐藏得足够长，以至于在运行时崩溃应用程序。
例如，如果错误的模块版本最终出现在正确的地方，应用程序将启动（所有所需的模块都存在），但稍后会崩溃，例如，当缺少一个类或方法时。
它确实在早期检测到一些常见问题，减少了应用程序启动后因依赖项问题而失败的机会。

### 可扩展的平台

随着JDK被分割成模块，从XML处理到JDBC API，终于可以手工制作一个只包含你需要的JDK功能的**运行时映像**，并将其与你的应用程序一起发货。
如果你的代码库完全模块化，你可以更进一步，将你的模块包含在该映像中，使其成为一个自包含的**应用程序映像**，它包含它需要的一切，从你的代码到依赖项到JDK API和JVM。
这篇文章解释了如何做到这一点。


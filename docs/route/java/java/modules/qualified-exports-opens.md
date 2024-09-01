# 限定的 `exports` 和 `opens`

模块系统允许模块导出和打开包，使外部代码可以访问，在这种情况下，每个读取导出/打开模块的模块都可以访问这些包中的类型。
这意味着我们必须选择要么强封装一个包，要么让它始终对所有人可访问。
为了处理不容易适应这种二分法的用例，模块系统提供了限定的 `exports` 和 `opens` 指令变体，只给特定模块访问权限。

**注意**：
为了充分利用本文，你需要了解模块系统基础知识以及如何打开包。

## 包的限定导出/打开

通过在 `exports` 指令后跟 `to $MODULES` 来限定 `exports` 指令，其中 `$MODULES` 是目标模块名称的逗号分隔列表。
在 `exports to` 指令中命名的模块，包的可访问性将与常规 `exports` 指令完全一样。
对所有其他模块，包将像没有 `exports` 一样强封装。
`opens` 指令也可以使用 `to $MODULES` 限定，效果相同：
对于目标模块，包是打开的；对所有其他模块，它被强封装。

JDK 本身有很多限定导出的例子，但我们将关注 _java.xml_，它定义了 **Java API for XML Processing** (JAXP)。
它的六个内部包，以 `com.sun.org.apache.xml.internal` 和 `com.sun.org.apache.xpath.internal` 为前缀，被 _java.xml.crypto_（XML加密的API）使用，因此只导出给它：

```java
module java.xml {
    // 许多常规导出

    exports com.sun.org.apache.xml.internal.dtm to
        java.xml.crypto;
    exports com.sun.org.apache.xml.internal.utils to
        java.xml.crypto;
    exports com.sun.org.apache.xpath.internal to
        java.xml.crypto;
    exports com.sun.org.apache.xpath.internal.compiler to
        java.xml.crypto;
    exports com.sun.org.apache.xpath.internal.functions to
        java.xml.crypto;
    exports com.sun.org.apache.xpath.internal.objects to
        java.xml.crypto;
    exports com.sun.org.apache.xpath.internal.res to
        java.xml.crypto;

    // 许多服务使用
}
```

编译时的两个小说明：

- 如果声明限定导出/打开的模块被编译，目标模块找不到，编译器将发出警告。
  这不是错误，因为提到了目标模块但没有要求。
- 不允许在 `exports` 和 `exports to` 或 `opens` 和 `opens to` 指令中使用同一个包。
  如果指令对出现，限定变体将实际上无用，因此这种情况被解释为实现错误，因此会导致编译错误。

还有两个细节需要注意：

- 目标模块可以依赖于导出/打开模块（实际上 _java.xml.crypto_ 依赖于 _java.xml_），创建一个循环。
  仔细想想，除非使用隐式可读性，这实际上是必须的情况 - 否则目标模块如何读取导出/打开的模块？
- 每当需要访问限定导出包的新模块时，需要更改拥有模块，以便它给予这个新模块访问权限。
  虽然让导出模块控制谁可以访问包是限定导出的全部目的，但它仍然可能很麻烦。

## 何时使用限定导出

正如解释的，限定导出的用例是控制哪些模块可以访问相关包。
这种情况有多常见？
一般来说，每当一组模块想要在它们之间共享功能而不想公开暴露时。

这与引入模块系统之前隐藏工具类的问题是对称的。
一旦工具类需要跨包可用，它就必须是公开的，但在 Java 9 之前这意味着所有其他代码都可以访问它。
强封装通过允许我们使公开类在模块外部不可访问来解决这个问题。

现在我们处于类似的情况，我们想要隐藏一个包（以前是一个类），但一旦它需要跨模块（包）可用，它就必须被导出（公开），因此可以被所有其他模块（所有其他类）访问。
这就是限定导出的用武之地。
它们允许模块之间共享包，而不使其普遍可用。
这对于由多个模块组成并希望共享代码而不希望客户端能够使用的库和框架非常有用。
它也适用于想要限制对特定API依赖的大型应用程序。

限定导出可以被视为将强封装从保护工件中的类型提升到保护一组模块中的包。

## 何时使用限定打开

限定导出有你控制的目标模块，这使得这些指令成为防止同事和用户引入对内部API的意外依赖的重要工具。
另一方面，限定打开的目标模块通常是框架，无论你对每个模块还是只对 Hibernate 打开一个包以进行反射，Spring 都不会依赖于它。
因此，限定打开的用例比限定导出要小得多。

限定打开的一个缺点是，除非框架开始采用基于 `Lookup`/ `VarHandle` 的方法，这允许“转发”反射访问，否则包必须总是向实际进行反射的确切模块打开。
因此，在规范和实现分离的情况下（例如，JPA 和 Hibernate），你可能发现自己不得不将实体包打开给实现而不是 API（例如，Hibernate 模块而不是 JPA 模块）。
如果你的项目试图坚持标准并避免在代码中提及实现，这是不幸的。

总而言之，对于反射打开包的好默认方法是，除非你的项目在自己的代码中大量使用反射，否则不要限定访问，这种情况下的好处类似于限定导出。
仅仅对框架打开似乎不值得麻烦，如果它需要针对特定的实现模块，那么在这种情况下应该完全避免。


# 强封装（对JDK内部的封装）

几乎所有的依赖项——无论是框架、库、JDK API还是你自己的（子）项目——都有一个公共的、支持的、稳定的API以及内部代码，这些代码是为了让公共部分正常工作。

强封装是为了避免（偶然地）使用内部API，从而使项目更加健壮和可维护。

我们将探讨为什么需要这样做，哪些构成了内部API（特别是对JDK来说），以及强封装在实践中是如何工作的。

**注意**:
你需要了解模块系统基础和对反射的支持，以最大限度地利用这篇文章。

## 强封装是关于什么的？

在许多方面，OpenJDK代码库与其他任何软件项目类似，其中之一是重构。
代码被更改、移动、删除等，以保持代码库的整洁和可维护性。
当然，并不是所有的代码都会这样：
公共API，即与Java用户的合同，是非常稳定的。

正如你所见，公共API和内部代码之间的区别对于维持兼容性至关重要，对JDK开发者来说如此，对你来说也是如此。
你需要确保你的项目，意味着你的代码和你的依赖项，不会依赖于任何次要的JDK更新中可能改变的内部信息，这会导致令人惊讶和不必要的工作。
更糟糕的是，这种依赖可能会阻碍你更新JDK。
同时，你可能处于这样一种情况，即内部API提供了独特的功能，没有这些功能，你的项目将无法竞争。

总的来说，这意味着一种默认情况下锁定内部API的机制，但允许你为特定用例解锁特定的API是至关重要的。
强封装就是这种机制。

由于只有导出或打开的包中的类型可以在模块外部访问，因此所有其他内容都被视为内部的，因此无法访问。
这首先适用于JDK本身，自Java 9以来就被分割成模块。

## 什么是内部API？

那么，哪些JDK API是内部的？
为了回答这个问题，我们需要查看三个命名空间：

首先是`java.*`：
当然，这些包构成了公共API，但这只扩展到公共类中的公共成员。
不太明显的类和成员是内部的，并且被模块系统强烈封装。

然后是`sun.*`。
几乎所有这样的包都是内部的，但有两个例外：
`sun.misc`和`sun.reflect`包是由模块`jdk.unsupported`导出和打开的，因为它们提供了对许多项目至关重要的功能，并且在JDK内部或外部都没有可行的替代品（最著名的是`sun.misc.Unsafe`）。
不要因为这些非常具体的例外而混淆了更大的要点，尽管如此：
一般来说，`sun.*`包应该被视为内部的，所有除了这两个之外的实际上都是。

最后是`com.sun.*`，这更复杂。
整个命名空间是JDK特定的，意味着它不是Java标准API的一部分，一些JDK可能不包含它。
大约90%是非导出包，它们是内部的。
其余10%是由`jdk.*`模块导出的包，它们是供JDK外部使用的。
这意味着它们与标准化API的兼容性同样受到重视。
下面是一个内部与导出包的列表。

总之，使用`java.*`，避免`sun.*`，小心使用`com.sun.*`。

## 强封装的实验

为了尝试强封装，让我们创建一个使用公共API中类的基本类：

```java
public class Internal {

    public static void main(String[] args) {
        System.out.println(java.util.List.class.getSimpleName());
    }

}
```

由于它是一个单个类，你可以立即运行它，无需显式编译：

```
java Internal.java
```

这应该可以成功运行并打印出"List"。

接下来，让我们混合使用一个出于兼容性原因可以访问的例外：

```java
// add to `main` method
System.out.println(sun.misc.Unsafe.class.getSimpleName());
```

你仍然可以立即运行这个，打印出"List"和"Unsafe"。

现在让我们使用一个不可见的内部类：

```java
// add to `main` method
System.out.println(sun.util.BuddhistCalendar.class.getSimpleName());
```

如果你像以前一样尝试运行，你会得到一个编译错误（`java`命令在内存中编译）：

```
Internal.java:8: error: package sun.util is not visible
                System.out.println(sun.util.PreHashedMap.class.getSimpleName());
                                      ^
  (package sun.util is declared in module java.base, which does not export it)
1 error
error: compilation failed
```

错误信息非常清晰：
`sun.util`包属于模块java.base，因为那不导出它，所以它被视为内部的，因此无法访问。

我们在编译期间可以避免这种类型，使用反射代替：

```java
Class.forName("sun.util.BuddhistCalendar").getConstructor().newInstance();
```

执行这将导致运行时异常：

```
Exception in thread "main" java.lang.IllegalAccessException:
    class Internal cannot access class sun.util.BuddhistCalendar (in module java.base)
    because module java.base does not export sun.util to unnamed module @1f021e6c
        at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392)
        at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674)
        at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:489)
        at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
        at org.codefx.lab.internal.Internal.main(Internal.java:9)
```

## 强封装在实际中的应用

如果你绝对需要访问内部API，有两个命令行标志可以让你绕过强封装：

- `--add-exports`使导出包中的公共类型和成员在编译或运行时可访问
- `--add-opens`使打开的包中的所有类型及其成员在运行时对反射可访问

更多关于这两个选项以及如何在文章中使用它们的信息。

在编译期间应用`--add-exports`时，必须在运行应用程序时再次应用它，当然`--add-opens`只有在运行时才有意义。
这意味着需要访问JDK内部的任何代码（你的或你的依赖项），在启动应用程序时需要配置这些例外。
这使得应用程序的所有者完全了解这些问题，并允许他们评估情况，要么更改代码/依赖项，要么有意识地接受使用内部API带来的可维护性风险。

强封装在所有显式模块中都有效。
这包括整个JDK，它是完全模块化的，也可能包括你的代码和你的依赖项，如果它们以模块化的JAR形式出现，你将它们放在模块路径上。
在这种情况下，到目前为止所说的一切都适用于这些模块：

- 只有在导出包中的公共类型和成员在编译和运行时模块外部可访问
- 打开的包中的所有类型和成员在运行时模块外部可访问
- 其他类型和成员在编译期间和运行时无法访问
- 可以使用`--add-exports`（针对静态依赖项）和`--add-opens`（针对反射访问）创建例外

这意味着你可以将强封装的好处扩展到JDK API之外，包括你的代码和你的依赖项。

## 强封装的演变

强封装是模块系统的基石，该系统自Java 9引入，但由于兼容性原因，类路径上的代码仍然可以访问内部JDK API。
这通过命令行选项`--illegal-access`来管理，该选项在JDK 9到15中的默认值为`permit`。
JDK 16将该默认值更改为`deny`，17完全停用该选项。

从17开始，只有`--add-exports`和`--add-opens`允许访问内部API。



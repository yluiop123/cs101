# 介绍正则表达式

## 介绍正则表达式

### 引入正则表达式
正则表达式是一种根据集合中每个字符串共有的特征来描述一组字符串的方式。它们可用于搜索、编辑或操作文本和数据。您必须学习特定的语法来创建正则表达式——一种超越 Java 编程语言正常语法的语法。正则表达式的复杂性各不相同，但一旦您理解了它们的构建基础，您将能够解读（或创建）任何正则表达式。
在正则表达式的世界中，有许多不同的风格可供选择，例如 grep、Perl、Tcl、Python、PHP 和 awk。`java.util.regex` API 中的正则表达式语法与 Perl 中的语法最为相似。
`java.util.regex`包主要由三个类组成：`Pattern`、`Matcher`和`PatternSyntaxException`。
- `Pattern`对象是正则表达式的编译表示。`Pattern`类没有公共构造函数。要创建一个模式，您必须首先调用其公共静态`compile()`方法之一，然后它将返回一个`Pattern`对象。这些方法接受一个正则表达式作为第一个参数；以下部分将介绍所需的语法。
- `Matcher`对象是解释模式并对输入字符串执行匹配操作的引擎。与`Pattern`类一样，`Matcher`定义了没有公共构造函数。您通过在`Pattern`对象上调用`matcher()`方法来获得一个`Matcher`对象。
- `PatternSyntaxException`对象是一个未检查的异常，表示正则表达式模式中的语法错误。
在深入研究每个类之前，您必须了解正则表达式实际上是如何构建的。让我们介绍一个简单的测试工具，它将被反复用于探索其语法。

### Unicode 支持
从 JDK 7 版本开始，正则表达式模式匹配扩展了功能，以支持 Unicode 6.0。

### 匹配特定代码点
您可以使用形式为`\uFFFF`的转义序列来匹配特定的 Unicode 代码点，其中`FFFF`是您要匹配的代码点的十六进制值。例如，`\u6771`匹配汉字“东”。
或者，您可以使用 Perl 风格的十六进制表示法`\x{...}`来指定代码点。例如：
```java
String hexPattern = "\x{" + Integer.toHexString(codePoint) + "}"; 
```

### Unicode 字符属性
每个 Unicode 字符，除了其值之外，还有某些属性或特性。您可以使用表达式`\p{prop}`来匹配属于特定类别的单个字符。您可以使用表达式`\P{prop}`来匹配不属于特定类别的单个字符。
支持的三种属性类型是脚本、块和“一般”类别。

#### 脚本
要确定一个代码点是否属于特定的脚本，您可以使用`script`关键字，或`sc`简写形式，例如，`\p{script=Hiragana}`。或者，您可以在脚本名称前加上字符串`Is`，例如`\p{IsHiragana}`。
`Pattern`支持的有效脚本名称是`UnicodeScript.forName()`接受的名称。

#### 块
可以使用`block`关键字，或`blk`简写形式来指定一个块，例如，`\p{block=Mongolian}`。或者，您可以在块名称前加上字符串`In`，例如`\p{InMongolian}`。
`Pattern`支持的有效块名称是`UnicodeScript.forName()`接受的名称。

#### 一般类别
类别可以使用可选前缀`Is`指定。例如，`IsL`匹配 Unicode 字母的类别。类别也可以使用`general_category`关键字，或简写形式`gc`指定。例如，大写字母可以使用`general_category=Lu`或`gc=Lu`匹配。
支持的类别是`Character`类指定版本的《Unicode 标准》中的类别。

### 测试工具
本节定义了一个可重用的测试工具`RegexTestHarness.java`，用于探索此 API 支持的正则表达式构造。运行此代码的命令是`java RegexTestHarness`；不接受命令行参数。应用程序反复循环，提示用户输入正则表达式和输入字符串。使用此测试工具是可选的，但您可能会发现它对于探索以下页面中讨论的测试用例很方便。
```java
import java.io.Console;
import java.util.regex.Pattern; 
import java.util.regex.Matcher; 

public class RegexTestHarness { 

    public static void main(String[] args) { 
        Console console = System.console(); 
        if (console == null) { 
            System.err.println("No console."); 
            System.exit(1); 
        } 
        while (true) { 

            Pattern pattern = 
            Pattern.compile(console.readLine("%nEnter your regex: ")); 

            Matcher matcher = 
            pattern.matcher(console.readLine("Enter input string to search: ")); 

            boolean found = false; 
            while (matcher.find()) { 
                console.format("I found the text" + 
                    " \"%s\" starting at " + 
                    "index %d and ending at index %d.%n", 
                    matcher.group(), 
                    matcher.start(), 
                    matcher.end()); 
                found = true; 
            } 
            if(! found) { 
                console.format("No match found.%n"); 
            } 
        } 
    }
} 
```
在继续下一节之前，您可以保存并编译此代码，以确保您的开发环境支持所需的包。
# Java 中将数据源转换为流（Converting Data Sources to Streams）

## 以流的方式思考
在本教程系列的前几篇文章中，我们研究了将命令式风格的循环转换为函数式风格。在本文中，我们将从函数式的角度看待数据源，将其视为数据流，并将迭代转换为使用 Streams API。
我们已经看到了如何使用`filter()`和`map()`函数分别选择和转换数据。我们可以在函数式管道的中间执行这些操作。在前面的文章中，我们使用了`range()`和`rangeClosed()`等函数来创建一个数字范围内的值流。当我们想要迭代一个已知范围的值时，这很有效，但是，我们通常可能想要处理来自外部资源的数据，例如来自文件的数据。如果我们能够将外部资源作为流来处理，那么我们就可以轻松地应用函数式管道的操作。在本文中，我们将看一个示例来说明这个想法。

## 从命令式到函数式风格
假设我们想要迭代一个文件，并计算包含一个或多个特定单词的行数。以下是一个非常熟悉的命令式风格代码来完成此任务：
```java
//Sample.java
import java.nio.file.*;

public class Sample {
  public static void main(String[] args) {
    try {
      final var filePath = "./Sample.java";
      final var wordOfInterest = "public";

      try (var reader = Files.newBufferedReader(Path.of(filePath))) {
        String line = "";
        long count = 0;

        while ((line = reader.readLine())!= null) {
          if (line.contains(wordOfInterest)) {
            count++;
          }
        }

        System.out.println(String.format("Found %d lines with the word %s", count, wordOfInterest));
      }
    } catch (Exception ex) {
      System.out.println("ERROR: " + ex.getMessage());
    }
  }
}
```
为了便于使用此示例，我们在与代码相同的源文件中查找包含单词“public”的行数。如果您愿意，可以更改`filePath`的值以引用不同的文件，和/或更改`wordOfInterest`的值。
这个示例有两个主要部分。我们使用`newBufferedReader()`方法返回的`BufferedReader`来访问我们感兴趣的文件的内容。然后，在`while`循环中，我们检查每一行是否包含所需的单词，如果是，则递增`count`以表示我们找到了另一行包含该单词的行。让我们仔细研究这两个部分，首先是第二个部分。
仔细观察这个循环，根据我们在前面文章中的讨论，我们可以认识到，如果我们能够将代码编写为函数式管道，那么`if`的存在表明我们可以使用`filter()`操作。一旦我们过滤出或选择了包含所需单词的行，我们就可以使用流的`count()`方法计算行数。您可能非常好奇并急切地想问：“但是，流在哪里？”为了回答这个问题，让我们看一下代码的第一部分。
数据，即文本行，来自于路径在变量`filePath`中提供的文件。我们使用`BufferedReader`的`readLine()`方法和命令式风格迭代每一行文本。为了使用函数式管道，以及像`filter()`这样的操作，我们需要一个数据的`Stream`。因此，问题是：“是否有可能为文件的内容获取数据流？”
幸运的是，答案是肯定的。JDK 和 Java 语言的开发者不仅仅引入了进行函数式编程的能力并说“祝你好运”。他们不辞辛劳地增强了 JDK，添加了一些函数，以便我们作为程序员能够在日常任务中充分利用 Java 的函数式能力。
将文件的内容转换为数据流的一种简单方法是使用`java.nio.file`包中`Files`类的`lines()`方法。让我们借助`lines()`方法将前面的命令式风格代码重构为函数式风格，该方法为我们提供了文件内容的`Stream`，如下所示：
```java
//Sample.java
import java.nio.file.*;

public class Sample {
  public static void main(String[] args) {
    try {
      final var filePath = "./Sample.java";
      final var wordOfInterest = "public";

      try (var stream = Files.lines(Path.of(filePath))) {
        long count = stream.filter(line -> line.contains(wordOfInterest))
         .count();

        System.out.println(String.format("Found %d lines with the word %s", count, wordOfInterest));
      }
    } catch (Exception ex) {
      System.out.println("ERROR: " + ex.getMessage());
    }
  }
}
```
`lines()`方法不仅提供了文件内容的数据流，还消除了读取行时的许多繁琐代码。与我们一次获取一行的外部迭代器不同，流使我们能够使用内部迭代器，我们可以专注于在流的管道中出现的每一行文本时要做的事情。

## 映射
每当您处理来自外部资源的数据集合时，询问是否有方法获取该资源内容的数据流。您可能会在 JDK 或第三方库中找到相应的函数。一旦我们获得了流，我们就可以使用高效的函数式操作符，如`filter()`、`map()`等，流畅地迭代资源数据集合。
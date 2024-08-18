# 创建流

## 创建流
您已经在本教程中创建了许多流，全部是通过调用 `Collection` 接口的 `stream()` 方法实现的。这种方法非常方便：以这种方式创建流只需要两行简单的代码，您可以使用此流来尝试 Stream API 的几乎所有特性。

正如您将要看到的，还有许多其他方法可以在许多对象上创建流。了解这些方法可以使您能够在应用程序的许多地方利用 Stream API，并编写更易读和可维护的代码。

在我们深入研究每一个之前，让我们先快速浏览一下您将在本教程中看到的模式。

第一组模式使用 `Stream` 接口的工厂方法。通过它们，您可以从以下元素创建流：
- 一个变长参数；
- 一个供应商；
- 一个一元操作符，它从上一个元素生成下一个元素；
- 一个构建器。

您甚至可以创建一个空的流，这在某些情况下可能非常方便。

您已经看到，您可以在集合上创建一个流。如果您拥有的只是一个迭代器而不是一个完整的集合，那么有一个模式适合您：您可以在迭代器上创建一个流。如果您有一个数组，也有一个模式可以在数组元素上创建一个流。

不止如此。许多模式也已经添加到 JDK 的知名对象中。然后，您可以从以下元素创建流：
- 字符串的字符；
- 文本文件的行；
- 使用正则表达式拆分字符串得到的元素；
- 一个随机变量，可以创建一个随机数流。

您也可以使用构建器模式创建一个流。

## 从集合或迭代器创建流
您已经知道 `Collection` 接口中有 `stream()` 方法可用。这可能是创建流的最经典方式。

在某些情况下，您可能需要在映射的内容上创建一个流。`Map` 接口中没有 `stream()` 方法，因此您不能直接创建这样的流。但是，您可以通过三个集合访问映射的内容：
- 使用 `keySet()` 获取键的集合；
- 使用 `entrySet()` 获取键值对的集合；
- 使用 `values()` 获取值的集合。

要使用的适当模式是获取其中一个集合并在其上创建流。

Stream API 为您提供了一个从简单迭代器创建流的模式。迭代器是一个非常简单的对象，因此这可能是在非标准数据源上创建流的非常方便的方式。模式如下：

```java
Iterator<String> iterator = ...;

long estimateSize = 10L;
int characteristics = 0;
Spliterator<String> spliterator = Spliterators.spliterator(strings.iterator(), estimateSize, characteristics);

boolean parallel = false;
Stream<String> stream = StreamSupport.stream(spliterator, parallel);
```

这个模式包含几个稍后将在本教程中介绍的神奇元素。让我们快速浏览一下它们。

`estimateSize` 是您认为此流将消费的元素数量。在某些情况下，此信息很容易获得：例如，如果您正在数组或集合上创建流。但也有信息未知的情况。

参数 `characteristics` 稍后将在本教程中介绍。它用于优化您的数据处理。

`parallel` 参数告诉 API 您要创建的流是并行流还是非并行流。并行流稍后也将在本教程中介绍。

## 创建空流
让我们从这些模式中最简单的开始：创建空流。`Stream` 接口中有一个工厂方法用于此。您可以按以下方式使用它。

```java
Stream<String> empty = Stream.empty();
List<String> strings = empty.collect(Collectors.toList());

System.out.println("strings = " + strings);
```

运行此代码会在您的控制台上显示以下内容。

```
strings = []
```

在某些情况下，创建空流可能非常有用。实际上，您在本教程的前一部分已经看到了一个。您看到的模式使用空流和 flatmap 从流中移除无效元素。从 Java SE 16 开始，这种模式已被 `mapMulti()` 模式取代。

## 从变长参数或数组创建流
这两个模式非常相似。第一个使用 `Stream` 接口中的 `of()` 工厂方法。第二个使用 `Arrays` 工厂类的 `stream()` 工厂方法。实际上，如果您检查 `Stream.of()` 方法的源代码，您会看到它调用了 `Arrays.stream()`。

这是第一个模式的实际应用。

```java
Stream<Integer> intStream = Stream.of(1, 2, 3);
List<Integer> ints = intStream.collect(Collectors.toList());

System.out.println("ints = " + ints);
```

运行这个第一个示例将给出以下结果：

```
ints = [1, 2, 3]
```

这是第二个示例。

```java
String[] stringArray = {"one", "two", "three"};
Stream<String> stringStream = Arrays.stream(stringArray);
List<String> strings = stringStream.collect(Collectors.toList());

System.out.println("strings = " + strings);
```

运行第二个示例将给出以下结果：

```
strings = [one, two, three]
```

## 从供应商创建流
`Stream` 接口上有两个工厂方法用于此。

第一个是 `generate()`，它接受一个供应商作为参数。每当需要一个新元素时，就会调用这个供应商。

您可以使用以下代码创建这样的流，但不要这样做！

```java
Stream<String> generated = Stream.generate(() -> "+");
List<String> strings = generated.collect(Collectors.toList());
```

如果您运行此代码（再次提醒，不要这样做），您会发现它永远不会停止。如果您确实运行了，并且足够耐心，您可能会看到一个 `OutOfMemoryError`。如果没有，您可以通过 IDE 正常终止您的应用程序。这个流生成元素，永远不会停止。它确实生成了一个无限流。

我们还尚未涵盖这一点，但拥有这样的流是完全合法的！您可能想知道它们的用途是什么？实际上有很多。要使用它们，您需要在某个点截断这个流，Stream API 为您提供了几种方法来做到这一点。您已经看到了一个，后面还有更多。

您看到的一个是在该流上调用 `limit()`。让我们重写前面的例子，并修复它。

```java
Stream<String> generated = Stream.generate(() -> "+");
List<String> strings =
        generated
           .limit(10L)
           .collect(Collectors.toList());

System.out.println("strings = " + strings);
```

运行此代码将打印以下结果。

```
strings = [+, +, +, +, +, +, +, +, +, +]
```

`limit()` 方法被称为 _短路_ 方法：它可以停止流元素的消费。您可能还记得，流中的数据是逐个元素处理的：每个元素都遍历您在流中定义的所有操作，从第一个到最后一个。这就是为什么这个限制操作可以停止生成更多元素。

## 从一元操作符和种子创建流
使用供应商非常适合生成常量流。如果您需要一个具有不同值的无限流，那么您可以使用 `iterate()` 模式。

这个模式使用一个种子，这是生成的第一个元素。然后它使用 `UnaryOperator` 通过转换前一个元素来生成流的下一个元素。

```java
Stream<String> iterated = Stream.iterate("+", s -> s + "+");
iterated.limit(5L).forEach(System.out::println);
```

您应该看到以下结果。

```
+
+++
+++++
+++++++
```

使用此模式时，不要忘记限制流处理的元素数量。

从 Java SE 9 开始，这个模式有一个重载版本，它接受一个谓词作为参数。当这个谓词变为 false 时，`iterate()` 方法停止生成元素。前面的代码可以以以下方式使用这个模式。

```java
Stream<String> iterated = Stream.iterate("+", s -> s.length() <= 5, s -> s + "+");
iterated.forEach(System.out::println);
```

运行此代码将给出与之前相同的结果。

## 从数字范围创建流
使用前面模式可以轻松创建数字范围。但是使用专门的数字流及其 `range()` 工厂方法可以更轻松地完成。

`range()` 方法接受初始值和范围的上界（不包括）。您也可以使用 `rangeClosed()` 方法包含上界。调用 `LongStream.range(0L, 10L)` 将简单地生成一个包含 0 到 9 之间所有长整数的流。

这个 `range()` 方法还可以用来遍历数组的元素。以下是如何做到这一点。

```java
String[] letters = {"A", "B", "C", "D"};
List<String> listLetters =
    IntStream.range(0, 10)
             .mapToObj(index -> letters[index % letters.length])
             .collect(Collectors.toList());
System.out.println("listLetters = " + listLetters);
```

结果如下。

```
listLetters = [A, B, C, D, A, B, C, D, A, B]
```

您可以基于这个模式做很多事情。请注意，因为 `IntStream.range()` 创建了一个 `IntStream`，您需要使用 `mapToObj()` 方法将其映射到对象流。 

## 创建随机数流
`Random` 类用于创建随机数序列。从 Java SE 8 开始，这个类添加了几个方法来创建不同类型（`int`、`long` 和 `double`）的随机数流。

您可以通过提供种子来创建 `Random` 的实例。这个种子是一个 `long` 参数。随机数依赖于这个种子。对于给定的种子，您将始终获得相同的数字序列。这在许多情况下可能很有用，包括编写测试。在这种情况下，您可以依赖于预先知道的数字序列。

`Random` 类定义了三种生成此类流的方法：`ints()`、`longs()` 和 `doubles()`。

所有这些方法都有几种重载，它们接受以下参数：

- 流将生成的元素数量；
- 生成的随机数的上下界。

以下是一个生成 0 到 5 之间 10 个随机整数的代码模式。

```java
Random random = new Random(314L);
List<Integer> randomInts =
    random.ints(10, 1, 5)
          .boxed()
          .collect(Collectors.toList());
System.out.println("randomInts = " + randomInts);
```

如果您使用与本例中相同的种子，您将在控制台上看到以下内容。

```
randomInts = [4, 4, 3, 1, 1, 1, 2, 2, 4, 2]
```

请注意，我们使用了数字流专用的 `boxed()` 方法，它简单地将此流映射到等价的包装器类型流。因此，`IntStream` 通过此方法映射到 `Stream<Integer>`。

以下是生成随机布尔值流的第二个模式。该流的任何元素以 80% 的概率为 true。

```java
Random random = new Random(314L);
List<Boolean> booleans =
    random.doubles(1_000, 0d, 1d)
          .mapToObj(rand -> rand <= 0.8) // 您可以在此处调整概率
          .collect(Collectors.toList());

// 让我们计算这个列表中 true 的数量
long numberOfTrue =
    booleans.stream()
            .filter(b -> b)
            .count();
System.out.println("numberOfTrue = " + numberOfTrue);
```

如果您使用与本例中相同的种子，您将看到以下结果。

```
numberOfTrue = 773
```

您可以将这个模式调整为使用您需要的概率生成任何类型的对象。以下是另一个示例，它生成了一个包含字母 A、B、C 和 D 的流。每个字母的概率如下：

- A 的概率为 50%；
- B 的概率为 30%；
- C 的概率为 10%；
- D 的概率为 10%。

```java
Random random = new Random(314L);
List<String> letters =
    random.doubles(1_000, 0d, 1d)
          .mapToObj(rand ->
                    rand < 0.5 ? "A" : // A 的 50%
                    rand < 0.8 ? "B" : // B 的 30%
                    rand < 0.9 ? "C" : // C 的 10%
                             "D")  // D 的 10%
          .collect(Collectors.toList());

Map<String, Long> map =
    letters.stream()
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

map.forEach((letter, number) -> System.out.println(letter + " :: " + number));
```

使用相同的种子，您将获得以下结果。

```
A :: 470
B :: 303
C :: 117
D :: 110
```

使用 `groupingBy()` 构建这个映射在这一点上可能对您来说还不清楚。不要担心；这个模式将在本教程后面介绍。

## 从字符串的字符创建流
Java SE 8 中 `String` 类增加了 `chars()` 方法。此方法返回一个 `IntStream`，提供此字符串的字符。

每个字符都以代码点的形式给出，这是一个整数，可能会让您想起 ASCII 码。在某些情况下，您可能需要将此整数转换为仅包含此字符的字符串。

您有两种模式可以做到这一点，具体取决于您使用的 JDK 版本。

直到 Java SE 10，您可以使用以下代码。

```java
String sentence = "Hello Duke";
List<String> letters =
    sentence.chars()
            .mapToObj(codePoint -> (char)codePoint)
            .map(Object::toString)
            .collect(Collectors.toList());
System.out.println("letters = " + letters);
```

Java SE 11 中 `Character` 类上增加了一个 `toString()` 工厂方法，您可以使用它来简化此代码。

```java
String sentence = "Hello Duke";
List<String> letters =
    sentence.chars()
            .mapToObj(Character::toString)
            .collect(Collectors.toList());
System.out.println("letters = " + letters);
```

两种代码都会打印出以下结果。

```
letters = [H, e, l, l, o,  , D, u, k, e]
```

## 从文本文件的行创建流
能够打开文本文件的流是一个非常强大的模式。

Java I/O API 有一个模式可以从文本文件中读取一行：`BufferedReader.readLine()`。您可以在循环中调用此方法，逐行读取您的整个文本文件以进行处理。

能够使用 Stream API 处理这些行可以为您提供更易读和更易维护的代码。

有几种模式可以创建这样的流。

如果您需要基于使用缓冲读取器的现有代码进行重构，那么您可以使用此对象上定义的 `lines()` 方法。如果您正在编写新代码以处理您的文本文件的内容，那么您可以使用工厂方法 `Files.lines()`。这个方法接受一个 `Path` 作为参数，并有一个重载方法，如果您正在读取的文件不是以 UTF-8 编码的，它接受一个 `CharSet`。

您可能已经意识到，文件资源和任何 I/O 资源一样，当您不再需要它时应该关闭它。由于您是通过 Stream API 使用此文件资源，您可能想知道您将如何处理它。

好消息是 `Stream` 接口实现了 `AutoCloseable` 接口。流本身是一个资源，您在需要时可以关闭它。这在您看到的所有的内存示例中并不是真的需要，但在这种情况下绝对需要。

以下是一个计算日志文件中警告数量的示例。

```java
Path log = Path.of("/tmp/debug.log"); // 调整以适应您的安装
try (Stream<String> lines = Files.lines(log)) {

    long warnings =
        lines.filter(line -> line.contains("WARNING"))
             .count();
    System.out.println("Number of warnings = " + warnings);

} catch (IOException e) {
    // 处理异常
}
```

try-with-resources 模式将调用您的流的 `close()` 方法，这将正确关闭您已解析的文本文件。

## 从正则表达式创建流
这一系列模式的最后一个示例是添加到 `Pattern` 类中的方法，用于创建一个流，该流是通过将正则表达式应用于字符串生成的元素。

假设您需要根据给定的分隔符拆分字符串。您有两种模式可以做到这一点。

- 您可以调用 `String.split()` 方法；
- 或者，您可以使用 `Pattern.compile().split()` 模式。

两种模式都给您一个字符串数组，包含拆分结果的元素。

您看到了从数组创建流的模式。让我们编写此代码。

```java
String sentence = "For there is good news yet to hear and fine things to be seen";

String[] elements = sentence.split(" ");
Stream<String> stream = Arrays.stream(elements);
```

`Pattern` 类还有一个方法给您。您可以调用 `Pattern.compile().splitAsStream()`。以下是您可以使用此方法编写的代码。

```java
String sentence = "For there is good news yet to hear and fine things to be seen";

Pattern pattern = Pattern.compile(" ");
Stream<String> stream = pattern.splitAsStream(sentence);
List<String> words = stream.collect(Collectors.toList());

System.out.println("words = " + words);
```

运行此代码将产生以下结果。

```
words = [For, there, is, good, news, yet, to, hear, and, fine, things, to, be, seen]
```

您可能会想知道这两种模式中哪一种是最好的。要回答这个问题，您需要仔细看看第一种模式。首先，您创建一个数组来存储拆分的结果，然后在此数组上创建一个流。

第二种模式没有数组创建，因此开销较小。

您已经看到，一些流可能会使用 _短路_ 操作（本教程后面将详细介绍）。如果您有这样的流，拆分整个字符串并创建结果数组可能是一个重要但无用的开销。不能确定您的流管道是否会消费所有元素以产生结果。

即使您的流需要消费所有元素以产生其结果，将所有这些元素存储在数组中仍然是一种不必要的开销。

因此，在这两种情况下，使用 `splitAsStream()` 模式更好。它在内存方面更好，在某些情况下，在 CPU 方面也更好。

## 使用构建器模式创建流
使用此模式创建流是一个两步过程。首先，您在构建器中添加流将消费的元素。然后，您从这个构建器创建流。一旦您的构建器被用来创建流，您就不能再向其中添加更多元素，也不能再次使用它来构建另一个流。如果您这样做，您将获得一个 `IllegalStateException`。

模式如下。

```java
Stream.Builder<String> builder = Stream.<String>builder();

builder.add("one")
       .add("two")
       .add("three")
       .add("four");

Stream<String> stream = builder.build();

List<String> list = stream.collect(Collectors.toList());
System.out.println("list = " + list);
```

运行此代码将打印出以下内容。

```
list = [one, two, three, four]
```

## 在HTTP 源上创建流
本教程中我们介绍的最后一个模式是关于分析 HTTP 响应的正文。您已经看到，您可以在文本文件的行上创建流，您也可以在 HTTP 响应的正文上做同样的事情。这个模式由 JDK 11 中添加的 HTTP Client API 提供。

以下是它的工作原理。我们将在在线文本上使用它：查尔斯·狄更斯的《双城记》，由古腾堡项目在此处提供：https://www.gutenberg.org/files/98/98-0.txt

文本文件的开头为您提供了有关文本本身的信息。书从包含 "A TALE OF TWO CITIES" 的行开始。文件的结尾是此文件分发的许可证。

我们只需要书籍的文本，并希望删除此分发文件的头部和尾部。

```java
// 文件的 URI
URI uri = URI.create("https://www.gutenberg.org/files/98/98-0.txt");

// 创建 HTTP 请求的代码
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder(uri).build();

// 发送请求
HttpResponse<Stream<String>> response = client.send(request, HttpResponse.BodyHandlers.ofLines());
List<String> lines;
try (Stream<String> stream = response.body()) {
    lines = stream
        .dropWhile(line -> !line.equals("A TALE OF TWO CITIES"))
        .takeWhile(line -> !line.equals("*** END OF THE PROJECT GUTENBERG EBOOK A TALE OF TWO CITIES ***"))
        .collect(Collectors.toList());
}
System.out.println("# lines = " + lines.size());

```

运行此代码将打印出以下内容。

```
# lines = 15904
```

流是由您作为 `send()` 方法参数给出的正文处理器创建的。HTTP Client API 为您提供了几种正文处理器。您需要将正文作为流消费的处理器是由工厂方法 `HttpResponse.BodyHandlers.ofLines()` 创建的。这种消费响应正文的方式非常节省内存。如果您仔细编写流，响应的正文将永远不会存储在内存中。

我们决定将文本的所有行放在一个列表中，但是，根据您需要对此数据进行的处理，您不一定需要这样做。事实上，在大多数情况下，将此数据存储在内存中可能是一个坏主意。




# 匹配器类 (Matcher)

## 索引方法 (Index Methods)

索引方法提供了有用的索引值，精确显示匹配在输入字符串中的位置：

- `public int start()`: 返回上一次匹配的起始索引。
- `public int start(int group)`: 返回在上一次匹配操作中由给定组捕获的子序列的起始索引。
- `public int end()`: 返回最后一个匹配字符之后的偏移量。
- `public int end(int group)`: 返回在上一次匹配操作中由给定组捕获的子序列的最后一个字符之后的偏移量。

## 研究方法 (Study Methods)

研究方法回顾输入字符串并返回一个布尔值，指示是否找到模式。

- `public boolean lookingAt()`: 尝试从区域的开头开始，将输入序列与模式匹配。
- `public boolean find()`: 尝试查找输入序列中与模式匹配的下一个子序列。
- `public boolean find(int start)`: 重置此匹配器，然后尝试从指定索引开始查找输入序列中与模式匹配的下一个子序列。
- `public boolean matches()`: 尝试将整个区域与模式匹配。

## 替换方法 (Replacement Methods)

替换方法在输入字符串中替换文本的有用方法。

- `public Matcher appendReplacement(StringBuffer sb, String replacement)`: 实现非终端的追加和替换步骤。
- `public StringBuilder appendTail(StringBuilder sb)`: 实现终端的追加和替换步骤。
- `public String replaceAll(String replacement)`: 将输入序列中与模式匹配的每个子序列替换为给定的替换字符串。
- `public String replaceFirst(String replacement)`: 将输入序列中与模式匹配的第一个子序列替换为给定的替换字符串。
- `public static String quoteReplacement(String s)`: 返回指定字符串的字面替换字符串。此方法生成的字符串将作为Matcher类appendReplacement方法中的字面替换s使用。生成的字符串将与s中的字符序列作为字面序列匹配。斜杠（''）和美元符号（'$'）将没有特殊含义。

## 使用 start 和 end 方法

以下是一个示例，它计算输入字符串中单词 "dog" 出现的次数。

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class MatcherDemo {

    private static final String REGEX =
        "\\bdog\\b";
    private static final String INPUT =
        "dog dog dog doggie dogg";

    public static void main(String[] args) {
       Pattern p = Pattern.compile(REGEX);
       //  get a matcher object
       Matcher m = p.matcher(INPUT);
       int count = 0;
       while(m.find()) {
           count++;
           System.out.println("Match number "
                              + count);
           System.out.println("start(): "
                              + m.start());
           System.out.println("end(): "
                              + m.end());
       }
   } 
}
```

运行此代码将产生以下结果。

```plaintext
Match number 1
start(): 0
end(): 3
Match number 2
start(): 4
end(): 7
Match number 3
start(): 8
end(): 11
```

您可以看到，此示例使用单词边界以确保字母 "d" "o" "g" 不仅仅是一个更长单词中的子字符串。它还提供了有关匹配发生位置的有用信息。`start()` 方法返回上一次匹配操作中由给定组捕获的子序列的起始索引，而 `end()` 返回匹配的最后一个字符的索引加一。

## 使用 matches 和 lookingAt 方法

`matches()` 和 `lookingAt()` 方法都尝试将输入序列与模式匹配。然而，不同之处在于 `matches()` 需要整个输入序列被匹配，而 `lookingAt()` 则不需要。两种方法始终从输入字符串的开头开始。以下是完整代码：

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class MatchesLooking {

    private static final String REGEX = "foo";
    private static final String INPUT =
        "fooooooooooooooooo";
    private static Pattern pattern;
    private static Matcher matcher;

    public static void main(String[] args) {

        // Initialize
        pattern = Pattern.compile(REGEX);
        matcher = pattern.matcher(INPUT);

        System.out.println("Current REGEX is: "
                           + REGEX);
        System.out.println("Current INPUT is: "
                           + INPUT);

        System.out.println("lookingAt(): "
            + matcher.lookingAt());
        System.out.println("matches(): "
            + matcher.matches());
    }
}
```

运行此代码将产生以下结果。

```plaintext
Current REGEX is: foo
Current INPUT is: fooooooooooooooooo
lookingAt(): true
matches(): false
```

## 使用 replaceFirst 和 replaceAll

`replaceFirst()` 和 `replaceAll()` 方法替换与给定正则表达式匹配的文本。顾名思义，`replaceFirst()` 替换第一次出现，而 `replaceAll()` 替换所有出现。以下是代码：

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class ReplaceDemo {

    private static String REGEX = "dog";
    private static String INPUT =
        "The dog says meow. All dogs say meow.";
    private static String REPLACE = "cat";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        // get a matcher object
        Matcher m = p.matcher(INPUT);
        INPUT = m.replaceAll(REPLACE);
        System.out.println(INPUT);
    }
}
```

运行此代码将产生以下结果。

```plaintext
The cat says meow. All cats say meow.
```

在这个第一个版本中，所有 "dog" 的出现都被替换为 "cat"。但是为什么要止步于此呢？您不仅可以替换像 "dog" 这样的简单字面量，还可以替换与任何正则表达式匹配的文本。此方法的 API 指出："给定正则表达式 `a*b`，输入 `aabfooaabfooabfoob` 和替换字符串 `-`，调用此方法将产生字符串 `-foo-foo-foo-`。"

让我们编写以下示例。

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class ReplaceDemo2 {

    private static String REGEX = "a*b";
    private static String INPUT =
        "aabfooaabfooabfoob";
    private static String REPLACE = "-";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        // get a matcher object
        Matcher m = p.matcher(INPUT);
        INPUT = m.replaceAll(REPLACE);
        System.out.println(INPUT);
    }
}
```

运行此代码将产生以下结果。

```plaintext
-foo-foo-foo-
```

要仅替换模式的第一次出现，只需调用 `replaceFirst()` 而不是 `replaceAll()`。它接受相同的参数。

## 使用 appendReplacement 和 appendTail

`Matcher` 类还提供了 `appendReplacement()` 和 `appendTail()` 方法用于文本替换。以下示例使用这两种方法实现与 `replaceAll()` 相同的效果。

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexDemo {

    private static String REGEX = "a*b";
    private static String INPUT = "aabfooaabfooabfoob";
    private static String REPLACE = "-";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        Matcher m = p.matcher(INPUT); // get a matcher object
        StringBuffer sb = new StringBuffer();
        while(m.find()){
            m.appendReplacement(sb,REPLACE);
        }
        m.appendTail(sb);
        System.out.println(sb.toString());
    }
}
```

运行此代码将产生与之前相同的结果。

```plaintext
-foo-foo-foo-
```

## 字符串中的 Matcher 方法等价物

为了方便，`String` 类也模拟了几个 `Matcher` 方法：

- `public String replaceFirst(String regex, String replacement)`: 将此字符串中与给定正则表达式匹配的第一个子字符串替换为给定的替换。以 `string.replaceFirst(regex, repl)` 形式调用此方法将得到与表达式 `Pattern.compile(regex).matcher(str).replaceFirst(repl)` 完全相同的结果。
- `public String replaceAll(String regex, String replacement)`: 将此字符串中与给定正则表达式匹配的每个子字符串替换为给定的替换。以 `string.replaceAll(regex, repl)` 形式调用此方法将得到与表达式 `Pattern.compile(regex).matcher(str).replaceAll(repl)` 完全相同的结果。


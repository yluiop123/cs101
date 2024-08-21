# PatternSyntaxException 类的方法

## PatternSyntaxException 类的方法

`PatternSyntaxException` 是一个非受检异常，表示正则表达式模式中的语法错误。`PatternSyntaxException` 类提供了以下方法，帮助您确定出了什么问题：

- `public String getDescription()`: 检索错误的描述。
- `public int getIndex()`: 检索错误索引。
- `public String getPattern()`: 检索错误的正则表达式模式。
- `public String getMessage()`: 返回一个多行字符串，包含语法错误的描述及其索引、错误的正则表达式模式，以及在模式中错误索引的视觉指示。

以下是我们的测试框架源代码，用于检查格式不正确的正则表达式：

```java
import java.io.Console;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.regex.PatternSyntaxException;

public class RegexTestHarness2 {

    public static void main(String[] args){
        Pattern pattern = null;
        Matcher matcher = null;

        Console console = System.console();
        if (console == null) {
            System.err.println("No console.");
            System.exit(1);
        }
        while (true) {
            try{
                pattern =
                Pattern.compile(console.readLine("%nEnter your regex: "));

                matcher =
                pattern.matcher(console.readLine("Enter input string to search: "));
            }
            catch(PatternSyntaxException pse){
                console.format("There is a problem" +
                               " with the regular expression!%n");
                console.format("The pattern in question is: %s%n",
                               pse.getPattern());
                console.format("The description is: %s%n",
                               pse.getDescription());
                console.format("The message is: %s%n",
                               pse.getMessage());
                console.format("The index is: %s%n",
                               pse.getIndex());
                System.exit(0);
            }
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
            if(!found){
                console.format("No match found.%n");
            }
        }
    }
}
```

运行此测试时，输入 `?i)foo` 作为正则表达式。这个错误是一个常见的场景，程序员忘记了内嵌标志表达式 `(?i)` 中的左括号。这样做将产生以下结果：

```
Enter your regex: ?i)
There is a problem with the regular expression!
The pattern in question is: ?i)
The description is: Dangling meta character '?'
The message is: Dangling meta character '?' near index 0
?i)
^
The index is: 0
```

从这个输出中，我们可以看到语法错误是悬挂的元字符（问号）在索引 0 处。缺少左括号是罪魁祸首。



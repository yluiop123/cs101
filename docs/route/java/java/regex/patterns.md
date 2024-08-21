# Pattern 类

## 使用标志创建模式

`Pattern` 类定义了一个替代的编译方法，该方法接受一组影响模式匹配方式的标志。标志参数是一个位掩码，可以包括以下任何公共静态字段：

- `Pattern.CANON_EQ` 启用规范等价。当指定此标志时，只有当两个字符的完整规范分解匹配时，它们才会被认为是匹配的。例如，表达式 "a\u030A" 在指定此标志时将与字符串 "\u00E5" 匹配。默认情况下，匹配不考虑规范等价。指定此标志可能会带来性能损失。
- `Pattern.CASE_INSENSITIVE` 启用不区分大小写的匹配。默认情况下，不区分大小写的匹配假设只有 US-ASCII 字符集的字符被匹配。可以通过与此标志一起指定 UNICODE_CASE 标志来启用 Unicode 感知的大小写不敏感匹配。也可以通过内嵌标志表达式 `(?i)` 启用不区分大小写的匹配。指定此标志可能会带来轻微的性能损失。
- `Pattern.COMMENTS` 允许模式中的空白和注释。在此模式下，空白被忽略，以 # 开头的嵌入式注释直到行尾都被忽略。注释模式也可以通过内嵌标志表达式 `(?x)` 启用。
- `Pattern.DOTALL` 启用 dotall 模式。在 dotall 模式下，表达式 `.` 匹配任何字符，包括行终止符。默认情况下，此表达式不匹配行终止符。dotall 模式也可以通过内嵌标志表达式 `(?s)` 启用。(`s` 是 Perl 中称为 "single-line" 模式的助记符。)
- `Pattern.LITERAL` 启用模式的字面解析。当指定此标志时，指定模式的输入字符串被视为字面字符序列。输入序列中的元字符或转义序列将没有特殊含义。当与此标志一起使用时，`Pattern.CASE_INSENSITIVE` 和 `Pattern.UNICODE_CASE` 标志在匹配时仍然有效。其他标志变得多余。没有启用字面解析的内嵌标志字符。
- `Pattern.MULTILINE` 启用多行模式。在多行模式下，表达式 `^` 和 `$` 分别匹配输入序列的行终止符之后或之前，或输入序列的末尾。默认情况下，这些表达式仅匹配整个输入序列的开头和结尾。多行模式也可以通过内嵌标志表达式 `(?m)` 启用。
- `Pattern.UNICODE_CASE` 启用 Unicode 感知的大小写折叠。当指定此标志时，当通过 CASE_INSENSITIVE 标志启用不区分大小写的匹配时，匹配将以与 Unicode 标准一致的方式进行。默认情况下，不区分大小写的匹配假设只有 US-ASCII 字符集的字符被匹配。Unicode 感知的大小写折叠也可以通过内嵌标志表达式 `(?u)` 启用。指定此标志可能会带来性能损失。
- `Pattern.UNIX_LINES` 启用 UNIX 行模式。在此模式下，只有 `\\n` 行终止符在 `.`、`^` 和 `$` 的行为中被识别。UNIX 行模式也可以通过内嵌标志表达式 `(?d)` 启用。

接下来的步骤中，我们将修改测试框架 `RegexTestHarness.java` 以创建一个不区分大小写的匹配模式。

首先，修改代码以调用 `compile` 的替代版本：

```java
Pattern pattern =
Pattern.compile(
    console.readLine("%nEnter your regex: "),
    Pattern.CASE_INSENSITIVE);
```

然后编译并运行测试框架以获得以下结果：

```plaintext
Enter your regex: dog
Enter input string to search: DoGDOg
I found the text "DoG" starting at index 0 and ending at index 3.
I found the text "DOg" starting at index 3 and ending at index 6.
```

如您所见，字符串字面量 "dog" 匹配了所有出现，无论大小写。要使用多个标志编译模式，使用按位或运算符 `|` 分开要包括的标志。为了清晰起见，以下代码示例硬编码了正则表达式，而不是从控制台读取：

```java
pattern = Pattern.compile("[az]$", Pattern.MULTILINE | Pattern.UNIX_LINES);
```

您也可以指定一个 `int` 变量：

```java
int flags = Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE;
Pattern pattern = Pattern.compile("aa", flags);
```

## 内嵌标志表达式

也可以使用内嵌标志表达式启用各种标志。内嵌标志表达式是编译的双参数版本的替代方案，并在正则表达式本身中指定。以下示例使用原始测试框架 `RegexTestHarness.java` 与内嵌标志表达式 `(?i)` 启用不区分大小写的匹配。

```plaintext
Enter your regex: (?i)foo
Enter input string to search: FOOfooFoOfoO
I found the text "FOO" starting at index 0 and ending at index 3.
I found the text "foo" starting at index 3 and ending at index 6.
I found the text "FoO" starting at index 6 and ending at index 9.
I found the text "foO" starting at index 9 and ending at index 12.
```

再次，所有匹配项无论大小写都成功匹配。

与 Pattern 的公开可访问字段相对应的内嵌标志表达式如下表所示：

| 常量             | 等效的内嵌标志表达式 |
| ---------------- | ------------------- |
| `Pattern.CANON_EQ` | 无                   |
| `Pattern.CASE_INSENSITIVE` | `(?i)`             |
| `Pattern.COMMENTS` | `(?x)`              |
| `Pattern.MULTILINE` | `(?m)`              |
| `Pattern.DOTALL` | `(?s)`              |
| `Pattern.LITERAL` | 无                   |
| `Pattern.UNICODE_CASE` | `(?u)`             |
| `Pattern.UNIX_LINES` | `(?d)`             |

## 使用 Match 静态方法

`Pattern` 类定义了一个方便的 matches 方法，允许您快速检查给定输入字符串中是否存在模式。与所有公共静态方法一样，您应该通过其类名调用 matches，例如 `Pattern.matches("\\d", "1");`。在此示例中，方法返回 `true`，因为数字 "1" 匹配正则表达式 `\\d`。

## 使用 Split 方法

`split()` 方法是收集位于已匹配模式两侧文本的强大工具。如下所示，`split()` 方法可以从字符串 "one:two:three:four:five" 中提取单词 "one two three four five"：

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class SplitDemo {

    private static final String REGEX = ":";
    private static final String INPUT =
        "one:two:three:four:five";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        String[] items = p.split(INPUT);
        for(String s : items) {
            System.out.println(s);
        }
    }
}
```

运行此代码将产生以下结果：

```plaintext
one
two
three
four
five
```

为了简单起见，您匹配了一个字符串字面量，冒号 (`:`) 而不是复杂的正则表达式。由于我们仍然使用 `Pattern` 和 `Matcher` 对象，您可以使用 `split()` 来获取任何正则表达式的两侧的文本。以下是修改后的示例，改为按数字分割：

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class SplitDemo2 {

    private static final String REGEX = "\\d";
    private static final String INPUT =
        "one9two4three7four1five";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        String[] items = p.split(INPUT);
        for(String s : items) {
            System.out.println(s);
        }
    }
}
```

运行此代码将产生相同的结果：

```plaintext
one
two
three
four
five
```

## 其他实用方法

您可能也会发现以下方法有用：

- `public static String quote(String s)` 返回指定字符串的字面模式 `String`。此方法生成一个 `String`，可用于创建一个 `Pattern`，该 `Pattern` 将匹配 `String s`，就好像它是一个字面模式一样。输入序列中的元字符或转义序列将没有特殊含义。
- `public String toString()` 返回此模式的 `String` 表示形式。这是编译此模式的正则表达式。

## 字符串中的 Pattern 方法等价物

正则表达式支持也存在于 `java.lang.String` 中，通过几种模仿 `java.util.regex.Pattern` 行为的方法。为了方便，下面列出了它们 API 的关键摘录。

- `public boolean matches(String regex)`: 判断此字符串是否与给定的正则表达式匹配。以 `str.matches(regex)` 形式调用此方法将得到与表达式 `Pattern.matches(regex, str)` 完全相同的结果。
- `public
String[] split(String regex, int limit)`: 根据给定正则表达式的匹配项来拆分此字符串。以 `str.split(regex, n)` 形式调用此方法将得到与表达式 `Pattern.compile(regex).split(str, n)` 相同的结果。
- `public String[] split(String regex)`: 根据给定正则表达式的匹配项来拆分此字符串。此方法的工作方式与调用具有给定表达式和限制参数为零的双参数 split 方法相同。尾随空字符串不包括在结果数组中。

还有一个 `replace()` 方法，用于替换一个 `CharSequence` 为另一个：

- `public String replace(CharSequence target, CharSequence replacement)`: 使用指定的字面替换序列替换此字符串中匹配字面目标序列的每个子字符串。替换从字符串的开头到结尾进行，例如，在字符串 "aaa" 中将 "aa" 替换为 "b" 将得到 "ba" 而不是 "ab"。



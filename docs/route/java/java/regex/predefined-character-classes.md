# 预定义字符类

## 预定义字符类

### 预定义字符类
`Pattern` API 包含许多有用的预定义字符类，它们为常用的正则表达式提供了方便的简写形式：
|Construct|Description|
|---|---|
|`.`|任何字符（可能匹配也可能不匹配行终止符）|
|`\d`|一个数字：`[0 - 9]`|
|`\D`|一个非数字：`[^0 - 9]`|
|`\s`|一个空白字符：`[ \t\n\x0B\f\r]`|
|`\S`|一个非空白字符：`[^\s]`|
|`\w`|一个单词字符：`[a - ZA - Z_0 - 9]`|
|`\W`|一个非单词字符：`[^\w]`|
在上面的表格中，左手列中的每个构造都是右手列中字符类的简写形式。例如，`\d`表示数字范围（0 - 9），`\w`表示单词字符（任何小写字母、任何大写字母、下划线字符或任何数字）。尽可能使用预定义类。它们使您的代码更易于阅读，并消除了由格式错误的字符类引入的错误。
以反斜杠开头的构造称为转义构造。我们在“字符串字面量”部分预览了转义构造，在那里我们提到了使用反斜杠和`\Q`和`\E`进行引用。如果您在字符串字面量中使用转义构造，则必须在反斜杠前加上另一个反斜杠，以使字符串能够编译。例如：
```java
private final String REGEX = "\\d"; // 一个数字
```
在这个例子中，`\d`是正则表达式；为了使代码能够编译，需要额外的反斜杠。然而，测试工具直接从控制台读取表达式，因此额外的反斜杠是不必要的。

### 示例
以下示例演示了预定义字符类的使用。
```
Enter your regex:. 
Enter input string to search: @
I found the text "@" starting at index 0 and ending at index 1.

Enter your regex:. 
Enter input string to search: 1 
I found the text "1" starting at index 0 and ending at index 1.

Enter your regex:. 
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \d
Enter input string to search: 1 
I found the text "1" starting at index 0 and ending at index 1.

Enter your regex: \d
Enter input string to search: a
No match found.

Enter your regex: \D
Enter input string to search: 1 
No match found.

Enter your regex: \D
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \s
Enter input string to search:  
I found the text " " starting at index 0 and ending at index 1.

Enter your regex: \s
Enter input string to search: a
No match found.

Enter your regex: \S
Enter input string to search:  
No match found.

Enter your regex: \S
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \w
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \w
Enter input string to search:! 
No match found.

Enter your regex: \W
Enter input string to search: a
No match found.

Enter your regex: \W
Enter input string to search:! 
I found the text "!" starting at index 0 and ending at index 1.
```
在前面的三个示例中，正则表达式只是`.(`点“元字符”），表示“任何字符”。因此，在所有三个案例中（随机选择的`@`字符、数字和字母）匹配都成功。其余的示例每个都使用来自“预定义字符类”表格的单个正则表达式构造。您可以参考此表来弄清楚每个匹配背后的逻辑：
- `\d`匹配所有数字
- `\s`匹配空格
- `\w`匹配单词字符
或者，大写字母表示相反的意思：
- `\D`匹配非数字
- `\S`匹配非空格
- `\W`匹配非单词字符
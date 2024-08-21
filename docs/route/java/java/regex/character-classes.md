# 字符类

## 字符类

### 字符类
如果您浏览`Pattern`类规范，您将看到总结支持的正则表达式构造的表格。在本节中，您将找到以下内容：
- 左手列指定正则表达式构造，而右手列描述每个构造将匹配的条件。
- 表中使用“class”一词来表示字符类。例如，`[abc]`是一个简单的类。这些类与您编写代码的 Java 类无关。在正则表达式的上下文中，字符类是括在方括号内的一组字符。它指定了将成功匹配给定输入字符串中单个字符的字符。
|Construct|Description|
|---|---|
|[abc]|a、b 或 c（简单类）|
|[^abc]|除 a、b 或 c 之外的任何字符（否定）|
|[a - Z]|a 到 z，或 A 到 Z，包括（范围）|
|[a - d[m - p]]|a 到 d，或 m 到 p：[a - dm - p]（联合）|
|[a - z && [def]]|d、e 或 f（交集）|
|[a - z && [^bc]]|a 到 z，除了 b 和 c：[ad - z]（减法）|
|[a - z && [^m - p]]|a 到 z，并且不是 m 到 p：[a - lq - z]（减法）|

### 简单类
字符类的最基本形式是在方括号内简单地并排放置一组字符。例如，正则表达式`[bcr]at`将匹配单词“bat”、“cat”或“rat”，因为它定义了一个字符类（接受“b”、“c”或“r”）作为其第一个字符，后跟两个字母`a`和`t`。
您可以尝试以下示例。
```
Enter your regex: [bcr]at
Enter input string to search: bat
I found the text "bat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: cat 
I found the text "cat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: rat
I found the text "rat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: hat
No match found.
```
在上述示例中，只有当输入字符串的第一个字母与字符类定义的字符之一匹配时，整体匹配才会成功。

### 否定
要匹配除列出的字符之外的所有字符，请在字符类的开头插入“^”元字符。这种技术称为否定。
```
Enter your regex: [^bcr]at
Enter input string to search: bat
No match found.

Enter your regex: [^bcr]at
Enter input string to search: cat 
No match found.

Enter your regex: [^bcr]at
Enter input string to search: rat
No match found.

Enter your regex: [^bcr]at
Enter input string to search: hat
I found the text "hat" starting at index 0 and ending at index 3.
```
只有当输入字符串的第一个字符不包含字符类定义的任何字符时，匹配才会成功。

### 范围
有时您会想要定义一个包含一系列值的字符类，例如字母“a 到 h”或数字“1 到 5”。要指定范围，只需在要匹配的第一个和最后一个字符之间插入“ - ”元字符，例如`[1 - 5]`或`[a - h]`。您还可以在类内将不同的范围并排放置，以进一步扩展匹配可能性。例如，`[a - Z]`将匹配字母表中的任何字母：a 到 z（小写）或 A 到 Z（大写）。
以下是一些范围和否定的示例：
```
Enter your regex: [a - c] 
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: [a - c] 
Enter input string to search: b
I found the text "b" starting at index 0 and ending at index 1.

Enter your regex: [a - c] 
Enter input string to search: c
I found the text "c" starting at index 0 and ending at index 1.

Enter your regex: [a - c] 
Enter input string to search: d
No match found.

Enter your regex: foo[1 - 5] 
Enter input string to search: foo1
I found the text "foo1" starting at index 0 and ending at index 4.

Enter your regex: foo[1 - 5] 
Enter input string to search: foo5
I found the text "foo5" starting at index 0 and ending at index 4.

Enter your regex: foo[1 - 5] 
Enter input string to search: foo6
No match found.

Enter your regex: foo[^1 - 5] 
Enter input string to search: foo1
No match found.

Enter your regex: foo[^1 - 5] 
Enter input string to search: foo6
I found the text "foo6" starting at index 0 and ending at index 4.
```

### 联合
您还可以使用联合来创建一个由两个或多个单独的字符类组成的单个字符类。要创建联合，只需将一个类嵌套在另一个类中，例如`[0 - 4[6 - 8]]`。这个特定的联合创建了一个单个字符类，它匹配数字 0、1、2、3、4、6、7 和 8。
```
Enter your regex: [0 - 4[6 - 8]] 
Enter input string to search: 0 
I found the text "0" starting at index 0 and ending at index 1.

Enter your regex: [0 - 4[6 - 8]] 
Enter input string to search: 5 
No match found.

Enter your regex: [0 - 4[6 - 8]] 
Enter input string to search: 6 
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [0 - 4[6 - 8]] 
Enter input string to search: 8 
I found the text "8" starting at index 0 and ending at index 1.

Enter your regex: [0 - 4[6 - 8]] 
Enter input string to search: 9 
No match found.
```

### 交集
要创建一个仅匹配其所有嵌套类共有的字符的单个字符类，请使用`&&`，如`[0 - 5 && [3 - 9]]`。这个特定的交集创建了一个单个字符类，仅匹配两个字符类共有的数字：3、4 和 5。
```
Enter your regex: [0 - 9 && [345]] 
Enter input string to search: 3 
I found the text "3" starting at index 0 and ending at index 1.

Enter your regex: [0 - 9 && [345]] 
Enter input string to search: 4 
I found the text "4" starting at index 0 and ending at index 1.

Enter your regex: [0 - 9 && [345]] 
Enter input string to search: 5 
I found the text "5" starting at index 0 and ending at index 1.

Enter your regex: [0 - 9 && [345]] 
Enter input string to search: 2 
No match found.

Enter your regex: [0 - 9 && [345]] 
Enter input string to search: 6 
No match found.
```
这里是一个显示两个范围交集的示例：
```
Enter your regex: [2 - 8 && [4 - 6]] 
Enter input string to search: 3 
No match found.

Enter your regex: [2 - 8 && [4 - 6]] 
Enter input string to search: 4 
I found the text "4" starting at index 0 and ending at index 1.

Enter your regex: [2 - 8 && [4 - 6]] 
Enter input string to search: 5 
I found the text "5" starting at index 0 and ending at index 1.

Enter your regex: [2 - 8 && [4 - 6]] 
Enter input string to search: 6 
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [2 - 8 && [4 - 6]] 
Enter input string to search: 7 
No match found.
```

### 减法
最后，您可以使用减法来否定一个或多个嵌套字符类，例如`[0 - 9 && [^345]]`。这个示例创建了一个单个字符类，它匹配从 0 到 9 的所有内容，除了数字 3、4 和 5。
```
Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 2 
I found the text "2" starting at index 0 and ending at index 1.

Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 3 
No match found.

Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 4 
No match found.

Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 5 
No match found.

Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 6 
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [0 - 9 && [^345]] 
Enter input string to search: 9 
I found the text "9" starting at index 0 and ending at index 1.
```
现在我们已经介绍了如何创建字符类，在继续下一节之前，您可能想要回顾一下“字符类”表格。
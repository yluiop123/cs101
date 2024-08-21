# 量词

## 量词

量词允许您指定要匹配的出现次数。为了方便起见，下面列出了 `Pattern` API 规范中描述贪婪量词、勉强量词和占有量词的三个部分。
乍一看，似乎 `X?`、`X??` 和 `X?+` 这三个量词完全相同，因为它们都表示“X，一次或根本不出现”。实际上，它们在实现上有细微的差别，将在本节末尾解释。
|贪婪|勉强|占有|含义|
|---|---|---|---|
|`X?`|`X??`|`X?+`|`X`，一次或根本不出现|
|`X*`|`X*?`|`X*+`|`X`，零次或多次出现|
|`X+`|`X+?`|`X++`|`X`，一次或多次出现|
|`X{n}`|`X{n}?`|`X{n}+`|`X`，恰好出现 `n` 次|
|`X{n,}`|`X{n,}?`|`X{n,}+`|`X`，至少出现 `n` 次|
|`X{n,m}`|`X{n,m}?`|`X{n,m}+`|`X`，至少出现 `n` 次，但不超过 `m` 次|

让我们通过创建三个不同的正则表达式来开始研究贪婪量词：字母“a”后面跟着 `?`、`*` 或 `+`。让我们看看当这些表达式针对空输入字符串 `""` 进行测试时会发生什么：
```
Enter your regex: a?
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a*
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a+
Enter input string to search: 
No match found.
```
## 零长度匹配

在上面的例子中，前两个例子中的匹配成功是因为表达式 `a?` 和 `a*` 都允许字母 `a` 出现零次。您还会注意到开始和结束索引都是零，这与我们到目前为止看到的任何例子都不同。空输入字符串 `""` 没有长度，所以测试只是在索引 0 处匹配到空。这种匹配被称为零长度匹配。
零长度匹配可能在几种情况下发生：
- 在空输入字符串中，
- 在输入字符串的开头，
- 在输入字符串的最后一个字符之后，或
- 在输入字符串的任何两个字符之间。
零长度匹配很容易识别，因为它们总是在相同的索引位置开始和结束。
让我们通过更多的例子来探索零长度匹配。将输入字符串更改为单个字母“a”，您会注意到一些有趣的事情：
```
Enter your regex: a?
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.

Enter your regex: a*
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.

Enter your regex: a+
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
```
所有三个量词都找到了字母“a”，但前两个量词在索引 1 处也找到了一个零长度匹配；即在输入字符串的最后一个字符之后。请记住，匹配器将字符“a”视为位于索引 0 和索引 1 之间的单元格中，并且我们的测试工具会循环直到再也找不到匹配为止。根据使用的量词，在最后一个字符之后的索引处存在“空”可能会或可能不会触发匹配。
现在将输入字符串更改为连续五个字母“a”，您将得到以下结果：
```
Enter your regex: a?
Enter input string to search: aaaaa
I found the text "a" starting at index 0 and ending at index 1.
I found the text "a" starting at index 1 and ending at index 2.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "a" starting at index 3 and ending at index 4.
I found the text "a" starting at index 4 and ending at index 5.
I found the text "" starting at index 5 and ending at index 5.

Enter your regex: a*
Enter input string to search: aaaaa
I found the text "aaaaa" starting at index 0 and ending at index 5.
I found the text "" starting at index 5 and ending at index 5.

Enter your regex: a+
Enter input string to search: aaaaa
I found the text "aaaaa" starting at index 0 and ending at index 5.
```
表达式 `a?` 为每个字符找到单独的匹配，因为它在“a”出现零次或一次时匹配。表达式 `a*` 找到两个单独的匹配：第一个匹配中所有的字母“a”，然后是在索引 5 处最后一个字符之后的零长度匹配。最后，`a+` 匹配所有出现的字母“a”，忽略在最后一个索引处“空”的存在。
此时，您可能想知道如果前两个量词遇到除“a”以外的字母会发生什么结果。例如，如果遇到字母“b”，如“ababaaaab”，会发生什么？
让我们来看看：
```
Enter your regex: a?
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "" starting at index 3 and ending at index 3.
I found the text "a" starting at index 4 and ending at index 5.
I found the text "a" starting at index 5 and ending at index 6.
I found the text "a" starting at index 6 and ending at index 7.
I found the text "a" starting at index 7 and ending at index 8.
I found the text "" starting at index 8 and ending at index 8.
I found the text "" starting at index 9 and ending at index 9.

Enter your regex: a*
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "" starting at index 3 and ending at index 3.
I found the text "aaaa" starting at index 4 and ending at index 8.
I found the text "" starting at index 8 and ending at index 8.
I found the text "" starting at index 9 and ending at index 9.

Enter your regex: a+
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "aaaa" starting at index 4 and ending at index 8.
```
即使字母“b”出现在单元格 1、3 和 8 中，输出报告在这些位置有零长度匹配。正则表达式 `a?` 并不是专门寻找字母“b”；它只是寻找字母“a”的存在（或不存在）。如果量词允许“a”匹配零次，那么输入字符串中任何不是“a”的东西都会显示为零长度匹配。其余的“a”根据前面例子中讨论的规则进行匹配。
要精确匹配模式 `n` 次，只需在一对括号内指定数字：
```
Enter your regex: a{3} 
Enter input string to search: aa
No match found.

Enter your regex: a{3} 
Enter input string to search: aaa
I found the text "aaa" starting at index 0 and ending at index 3.

Enter your regex: a{3} 
Enter input string to search: aaaa
I found the text "aaa" starting at index 0 and ending at index 3.
```
这里，正则表达式 `a{3}` 正在寻找连续三个字母“a”的出现。第一个测试失败，因为输入字符串没有足够的“a”来匹配。第二个测试在输入字符串中恰好包含三个“a”，从而触发匹配。第三个测试也触发匹配，因为输入字符串的开头恰好有三个“a”。之后的任何内容与第一次匹配无关。如果该模式在此之后再次出现，它将触发后续匹配：
```
Enter your regex: a{3} 
Enter input string to search: aaaaaaaaa
I found the text "aaa" starting at index 0 and ending at index 3.
I found the text "aaa" starting at index 3 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```
要要求模式至少出现 `n` 次，在数字后面添加一个逗号：
```
Enter your regex: a{3,} 
Enter input string to search: aaaaaaaaa
I found the text "aaaaaaaaa" starting at index 0 and ending at index 9.
```
对于相同的输入字符串，此测试仅找到一个匹配，因为连续的 9 个“a”满足“至少”三个“a”的要求。
最后，要指定出现次数的上限，在括号内添加第二个数字：
```
Enter your regex: a{3,6}  // 查找连续至少 3 个（但不超过 6 个）“a”
Enter input string to search: aaaaaaaaa
I found the text "aaaaaa" starting at index 0 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```
这里，第一个匹配被迫在 6 个字符的上限处停止。第二个匹配包括剩下的任何内容，恰好是三个“a”——这是此匹配允许的最少字符数。如果输入字符串短一个字符，则不会有第二个匹配，因为只剩下两个“a”。

## 带量词的捕获组和字符类
到目前为止，我们只在包含一个字符的输入字符串上测试了量词。实际上，量词一次只能附加到一个字符上，因此正则表达式 `abc+` 意味着“a，后跟 b，后跟 c 一次或多次”。它并不意味着“abc”一次或多次。然而，量词也可以附加到字符类和捕获组上，例如 `[abc]+`（a 或 b 或 c，一次或多次）或 `(abc)+`（组“abc”，一次或多次）。
让我们通过指定连续三次的组 `(dog)` 来举例说明。
```
Enter your regex: (dog){3} 
Enter input string to search: dogdogdogdogdogdog
I found the text "dogdogdog" starting at index 0 and ending at index 9.
I found the text "dogdogdog" starting at index 9 and ending at index 18.

Enter your regex: dog{3} 
Enter input string to search: dogdogdogdogdogdog
No match found.
```
在这里，第一个例子找到了三个匹配，因为量词应用于整个捕获组。然而，删除括号后，匹配失败，因为量词 `{3}` 现在仅应用于字母“g”。
同样，我们可以将量词应用于整个字符类：
```
Enter your regex: [abc]{3} 
Enter input string to search: abccabaaaccbbbc
I found the text "abc" starting at index 0 and ending at index 3.
I found the text "cab" starting at index 3 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
I found the text "ccb" starting at index 9 and ending at index 12.
I found the text "bbc" starting at index 12 and ending at index 15.

Enter your regex: abc{3} 
Enter input string to search: abccabaaaccbbbc
No match found.
```
在这里，第一个例子中量词 `{3}` 应用于整个字符类，但在第二个例子中仅应用于字母“c”。

## 贪婪、勉强和占有量词之间的区别
贪婪、勉强和占有量词之间存在细微的区别。
贪婪量词被认为是“贪婪的”，因为它们迫使匹配器在尝试第一次匹配之前读取或“吃掉”整个输入字符串。如果第一次匹配尝试（整个输入字符串）失败，匹配器会从输入字符串后退一个字符并再次尝试，重复该过程，直到找到匹配或没有更多字符可后退为止。根据表达式中使用的量词，它最后尝试匹配的是 1 个或 0 个字符。
然而，勉强量词采取相反的方法：它们从输入字符串的开头开始，然后不情愿地一次吃一个字符来寻找匹配。它们最后尝试的是整个输入字符串。
最后，占有量词总是吃掉整个输入字符串，尝试一次（且仅一次）匹配。与贪婪量词不同，占有量词从不后退，即使这样做会使整体匹配成功。
为了说明这一点，考虑输入字符串 `xfooxxxxxxfoo`。
```
Enter your regex:.*foo  // 贪婪量词
Enter input string to search: xfooxxxxxxfoo
I found the text "xfooxxxxxxfoo" starting at index 0 and ending at index 13.

Enter your regex:.*?foo  // 勉强量词
Enter input string to search: xfooxxxxxxfoo
I found the text "xfoo" starting at index 0 and ending at index 4.
I found the text "xxxxxxfoo" starting at index 4 and ending at index 13.

Enter your regex:.*+foo // 占有量词
Enter input string to search: xfooxxxxxxfoo
No match found.
```
第一个例子使用贪婪量词 `.*` 来查找“任何内容”，零次或多次，后跟字母“f”“o”“o”。因为量词是贪婪的，表达式 `.*` 部分首先吃掉整个输入字符串。此时，整个表达式无法成功，因为最后三个字母（“f”“o”“o”）已经被消耗掉。因此，匹配器会慢慢后退一个字符，直到最右边出现的“foo”被吐出，此时匹配成功并结束搜索。
然而，第二个例子是勉强的，所以它首先消耗“空”。因为“foo”不在字符串的开头出现，它被迫吞下第一个字母（“x”），这触发了在 0 和 4 处的第一次匹配。我们的测试工具会继续该过程，直到输入字符串耗尽。它在 4 和 13 处找到了另一个匹配。
第三个例子未能找到匹配，因为量词是占有性的。在这种情况下，整个输入字符串被 `.*+` 消耗掉，没有留下任何内容来满足表达式末尾的“foo”。在您想要占有所有内容而从不后退的情况下使用占有量词；在无法立即找到匹配的情况下，它将比等效的贪婪量词表现更好。
# 字符

## 字符

大多数情况下，如果您使用单个字符值，您将使用原始的 `char` 类型。例如：

```
char ch = 'a';
// Unicode 用于大写希腊字母欧米茄字符
char uniChar = '\u03A9';
// 字符数组
char[] charArray = { 'a', 'b', 'c', 'd', 'e' };
```

然而，有时您需要将 `char` 用作对象 - 例如，在期望对象的方法参数中。Java 编程语言提供了一个包装类，用于此目的将 `char` "包装" 在 `Character` 对象中。`Character` 类型的对象包含一个字段，其类型为 `char`。`Character` 类还提供了许多有用的类（即静态）方法来操作字符。

您可以使用 `Character` 构造函数创建一个 `Character` 对象：

```
Character ch = new Character('a');
```

在某些情况下，Java 编译器也会为您创建一个 `Character` 对象。例如，如果您将原始的 `char` 传递给期望对象的方法，编译器会自动将 `char` 转换为 `Character`。这个特性称为自动装箱 - 或者如果转换方向相反，则称为拆箱。有关自动装箱和拆箱的更多信息，请参见自动装箱和拆箱部分。

> 注意：`Character` 类是不可变的，因此一旦创建，`Character` 对象就不能更改。

下表列出了一些 `Character` 类中最有用的方法，但不是全部。有关此类中所有方法的完整列表（有50多个），请参考 `Character` API 规范。

- `boolean isLetter(char ch)` 和 `boolean isDigit(char ch)`：分别确定指定的 `char` 值是否为字母或数字。
- `boolean isWhitespace(char ch)`：确定指定的 `char` 值是否为空格。
- `boolean isUpperCase(char ch)` 和 `boolean isLowerCase(char ch)`：分别确定指定的 `char` 值是否为大写或小写。
- `char toUpperCase(char ch)` 和 `char toLowerCase(char ch)`：返回指定 `char` 值的大写或小写形式。
- `toString(char ch)`：返回表示指定字符值的 `String` 对象 - 即，一个单字符字符串。

## 字符和代码点

从 JDK 1.0.2 开始，Java 平台就支持 Unicode 标准。Java SE 15 支持 Unicode 13.0。`char` 数据类型和 `Character` 类基于原始的 Unicode 规范，该规范将字符定义为固定宽度的 16 位实体。Unicode 标准后来已更改，允许表示需要超过 16 位的角色。合法代码点的范围现在是 U+0000 到 U+10FFFF，称为 Unicode 标量值。

`char` 值使用 16 位编码。因此，它可以表示从 `0x0000` 到 `0xFFFF` 的数字。这组字符有时被称为 _基本多语言平面 (BMP)_。代码点大于 `0xFFFF`（记为 U+FFFF）的字符称为 _辅助字符_。

因此，`char` 值表示基本多语言平面（BMP）代码点。`int` 值表示所有 Unicode 代码点，包括辅助代码点。除非另有说明，对辅助字符和代理字符值的行为如下：

- 仅接受 `char` 值的方法不能支持辅助字符。它们将代理范围内的 `char` 值视为未定义字符。
- 接受 `int` 值的方法支持所有 Unicode 字符，包括辅助字符。

您可以查阅 `Character` 类的文档以获取更多信息。

## 转义符

以反斜杠 (`\`) 开头的字符是一个转义序列，对编译器有特殊含义。下表显示了 Java 转义序列：

| 转义序列 | 描述 |
| --- | --- |
| `\t` | 在此处文本中插入一个制表符。 |
| `\b` | 在此处文本中插入一个退格符。 |
| `\n` | 在此处文本中插入一个新行。 |
| `\r` | 在此处文本中插入一个回车符。 |
| `\f` | 在此处文本中插入一个换页符。 |
| `\'` | 在此处文本中插入一个单引号字符。 |
| `\"` | 在此处文本中插入一个双引号字符。 |
| `\\` | 在此处文本中插入一个反斜杠字符。 |

当在打印语句中遇到转义序列时，编译器会相应地进行解释。例如，如果您想在引号内使用引号，您必须使用内部引号的转义序列 `"`。要打印句子

```
She said "Hello!" to me.
```

您将编写

```
System.out.println("She said \"Hello!\" to me.");
```



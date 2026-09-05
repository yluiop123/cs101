---
title: 各语言中的正则
---

# 第 5 章 · 各语言中的正则

**本章目标：**

- 掌握 JavaScript 正则的完整 API
- 了解 Python、Java 中的正则用法差异
- 建立"语法相通、API 各异"的整体认知

正则的**模式语法**基本跨语言通用（第 2、3 章所学），但**调用 API** 各家不同。本章横向对比，重点讲透 JavaScript。

## 5.1 JavaScript 正则 API 全景

### 创建

```js
const re1 = /pattern/gi            // 字面量（推荐）
const re2 = new RegExp('pattern', 'gi')  // 动态构造
```

### 测试：test

```js
/^1\d{10}$/.test('13812345678')  // true / false
```

### 检索：match / exec

```js
'ab12cd34'.match(/\d+/g)    // ['12', '34'] —— 全局返回所有

'ab12cd34'.match(/\d+/)     // ['12', index: 2, groups: ...] —— 非全局返回详情

/\d+/.exec('ab12cd34')      // 同非全局 match；可循环调用（配 lastIndex）
```

### 替换：replace / replaceAll

```js
'2024-01'.replace(/-/g, '/')        // '2024/01'
'a-b-c'.replaceAll('-', '_')        // 'a_b_c'（语义更明确）
```

### 切分：split

```js
'a,b,,c'.split(/,+/)   // ['a', 'b', 'c'] —— 按模式切分
```

### matchAll：现代首选

```js
for (const m of 'a1b2'.matchAll(/(\w)(\d)/g)) {
  console.log(m[1], m[2])  // a 1 / b 2
}
```

::: warning 陷阱：lastIndex
带 `g` 标志的正则在 `test`/`exec` 时会移动内部指针（lastIndex），**同一个正则对象反复 test 可能时对时错**。需要多次 test 时每次用字面量新建，或去掉 `g` 标志。
:::

## 5.2 Python 中的正则

```python
import re

# 测试
bool(re.match(r'^1\d{10}$', '13812345678'))   # True（match 从头匹配）
bool(re.fullmatch(r'1\d{10}', '13812345678')) # True（整串匹配）

# 检索
re.findall(r'\d+', 'ab12cd34')    # ['12', '34']
m = re.search(r'(\d{4})-(\d{2})', '2024-01')
m.group(1)                        # '2024'

# 替换
re.sub(r'-', '/', '2024-01')      # '2024/01'
```

::: tip r 前缀是习惯
Python 字符串加 `r` 前缀（raw string）可避免 `\d` 被解释成转义序列，写正则的标准姿势：`r'...'`。
:::

## 5.3 Java 中的正则

```java
import java.util.regex.*;

Pattern p = Pattern.compile("^1\\d{10}$");
Matcher m = p.matcher("13812345678");
m.matches();        // true —— 整串匹配

// 检索
Pattern p2 = Pattern.compile("\\d+");
Matcher m2 = p2.matcher("ab12cd34");
while (m2.find()) {
    System.out.println(m2.group());  // 12 / 34
}

// 替换
"2024-01".replaceAll("-", "/");     // "2024/01"
```

注意 Java 字符串本身要转义 `\`，所以模式里写 `\\d`。

## 5.4 跨语言对照速查

| 能力 | JavaScript | Python | Java |
| --- | --- | --- | --- |
| 整串校验 | `re.test(s)`（配 ^$） | `re.fullmatch(p, s)` | `m.matches()` |
| 找全部 | `s.match(re+g)` | `re.findall` | `m.find()` 循环 |
| 替换 | `s.replace` | `re.sub` | `s.replaceAll` |
| 分组引用 | `$1` | `\1` | `$1` |
| 预编译 | 字面量即编译 | `re.compile` | `Pattern.compile` |

::: info 记忆主线
**模式语法一处学习，处处可用**；API 差异记住三件事：校验函数名、全局标志的等价物、分组引用符号。
:::

## 正则教程结语

你已掌握从匹配思维、核心语法到多语言应用的完整技能。文本处理的性价比之王，值得在后续项目中持续打磨。表单校验场景将在 [HTML 教程](/tutorials/html/)第 8 章（pattern 属性）与 [JavaScript 教程](/tutorials/javascript/)中反复相遇。

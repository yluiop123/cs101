# 控制流语句

控制流语句用于控制程序的执行顺序。以下是Java中常用的控制流语句：

## if 语句
`if` 语句用于基于条件执行代码块。

```java
if (condition) {
    // 条件为真时执行的代码
} else {
    // 条件为假时执行的代码
}
```

## switch 语句
`switch` 语句允许您基于不同的情况执行不同的代码块。

```java
switch (expression) {
    case value1:
        // 当expression等于value1时执行的代码
        break;
    case value2:
        // 当expression等于value2时执行的代码
        break;
    // ...
    default:
        // 如果没有匹配的case，执行的代码
}
```

## while 循环
`while` 循环会在给定条件为真时重复执行代码块。

```java
while (condition) {
    // 只要条件为真，就重复执行的代码
}
```

## do-while 循环
`do-while` 循环至少执行一次代码块，然后重复执行，只要条件为真。

```java
do {
    // 至少执行一次的代码
} while (condition);
```

## for 循环
`for` 循环允许您初始化变量，定义循环继续的条件，以及更新循环变量。

```java
for (initialization; condition; update) {
    // 循环体
}
```

## foreach 循环
`foreach` 循环用于遍历数组或集合。

```java
for (dataType element : collection) {
    // 对集合中的每个元素执行的代码
}
```

## break 语句
`break` 语句用于立即退出循环或switch语句。

```java
while (true) {
    // 某些条件
    break; // 退出循环
}
```

## continue 语句
`continue` 语句用于跳过当前循环的迭代，开始下一次迭代。

```java
for (int i = 0; i < array.length; i++) {
    if (array[i] == valueToSkip) {
        continue; // 跳过当前迭代
    }
    // 处理数组元素的代码
}
```

## return 语句
`return` 语句用于从方法返回，并可选地返回一个值。

```java
public int computeSum(int a, int b) {
    return a + b; // 返回两个数的和
}
```
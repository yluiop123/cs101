# 将Lambda表达式写成方法引用

## 你的第一个方法引用
Lambda表达式实际上是一个方法的实现：函数式接口的唯一抽象方法。有时人们将这些Lambda表达式称为“匿名方法”，因为它就是这样：一个没有名称的方法，你可以在应用程序中移动它，存储在字段或变量中，将其作为参数传递给方法或构造函数，并从方法返回。

有时你会写只是调用其他地方定义的特定方法的Lambda表达式。实际上，当你写以下代码时，你已经那样做了：

```java
Consumer<String> printer = s -> System.out.println(s);
```

写成这样，这个Lambda表达式只是对`System.out`对象上定义的`println()`方法的一个引用。

这就是_方法引用_语法的用武之地。

## 书写静态方法引用
假设你有以下代码：

```java
DoubleUnaryOperator sqrt = a -> Math.sqrt(a);
```

这个Lambda表达式实际上是对静态方法`Math.sqrt()`的一个引用。它可以这样写：

```java
DoubleUnaryOperator sqrt = Math::sqrt;
```

这个特定方法引用是对一个静态方法的引用，因此被称为_静态方法引用_。静态方法引用的一般语法是`RefType::staticMethod`。

静态方法引用可能接受多个参数。考虑以下代码：

```java
IntBinaryOperator max = (a, b) -> Integer.max(a, b);
```

你可以用方法引用重写它：

```java
IntBinaryOperator max = Integer::max;
```

## 书写非绑定方法引用
### 不接受任何参数的方法
假设你有以下代码：

```java
Function<String, Integer> toLength = s -> s.length();
```

这个函数可以写成`ToIntFunction<T>`。它只是对`String`类`length()`方法的一个引用。所以你可以写成方法引用：

```java
Function<String, Integer> toLength = String::length;
```

这种语法一开始可能有点令人困惑，因为它看起来真的很像静态调用。但实际上不是：`length()`方法是`String`类的实例方法。

你可以用这样的方法引用调用任何简单的Java Bean中的getter。假设你有`User`类，在它上面定义了`getName()`。然后你可以写以下函数：

```java
Function<User, String> getName = user -> user.getName();
```

作为以下方法引用：

```java
Function<User, String> getName = User::getName;
```

### 接受参数的方法
这是你已经看到的另一个例子：

```java
BiFunction<String, String, Integer> indexOf = (sentence, word) -> sentence.indexOf(word);
```

这个Lambda实际上是对`String`类`indexOf()`方法的一个引用，因此可以写成以下方法引用：

```java
BiFunction<String, String, Integer> indexOf = String::indexOf;
```

这种语法可能比`String::length`或`User::getName`这样更简单的示例看起来更令人困惑。在传统方式下重构Lambda的一个好方法是检查这个方法引用的类型。这将告诉你这个Lambda正在接受的参数。

非绑定方法引用的一般语法如下：`RefType::instanceMethod`，其中`RefType`是一个类型的名称，`instanceMethod`是一个实例方法的名称。

## 书写绑定方法引用
你看到的第一个方法引用示例是：

```java
Consumer<String> printer = System.out::println;
```

这个方法引用被称为_绑定方法引用_。这个方法引用被称为_绑定_，因为调用方法的对象在方法引用本身中定义。所以这个调用被_绑定_到方法引用中给出的对象。

如果你考虑非绑定语法：`Person::getName`，你可以看到调用方法的对象不是这个语法的一部分：它作为Lambda表达式的参数提供。考虑以下代码：

```java
Function<User, String> getName = User::getName;
User anna = new User("Anna");
String name = getName.apply(anna);
```

你可以看到，这个函数被应用到一个特定的`User`实例上，这个实例传递给了函数。然后这个函数在这个实例上操作。

这与前面的消费者示例不同：`println()`方法被调用在`System.out`对象上，这是方法引用的一部分。

绑定方法引用的一般语法如下：`expr::instanceMethod`，其中`expr`是一个返回对象的表达式，`instanceMethod`是一个实例方法的名称。

## 书写构造函数方法引用
你需要知道的最后一种方法引用是_构造函数方法引用_。假设你有以下`Supplier<List<String>>`：

```java
Supplier<List<String>> newListOfStrings = () -> new ArrayList<>();
```

你可以看到，和其余部分一样：这归结为对`ArrayList`空构造函数的一个引用。嗯，方法引用可以做到这一点。但由于构造函数不是一个方法，这是另一类方法引用。语法如下：

```java
Supplier<List<String>> newListOfStrings = ArrayList::new;
```

你可以注意到这里不需要钻石运算符。如果你想使用它，那么你需要同时提供类型：

```java
Supplier<List<String>> newListOfStrings = ArrayList<String>::new;
```

你需要意识到如果你不知道方法引用的类型，那么你就不能确切地说出它的作用。这里是示例：

```java
Supplier<List<String>> newListOfStrings = () -> new ArrayList<>();
Function<Integer, List<String>> newListOfNStrings = size -> new ArrayList<>(size);
```

两个变量`newListOfStrings`和`newListOfNStrings`都可以用相同的语法`ArrayList::new`编写，但它们不引用同一个构造函数。你只需要小心这一点。

## 方法引用总结
这里是四种类型的方法引用。

| 名称 | 语法 | Lambda 等价物 |
| --- | --- | --- |
| 静态 | `RefType::staticMethod` | `(args) -> RefType.staticMethod(args)` |
| 绑定 | `expr::instanceMethod` | `(args) -> expr.instanceMethod(args)` |
| 非绑定 | `RefType::instanceMethod` | `(arg0, rest) -> arg0.instanceMethod(rest)` |
| 构造函数 | `ClassName::new` | `(args) -> new ClassName(args)` |



# 方法 Handles

## 方法 Handles

方法句柄是一种用于方法查找和调用的低级机制。它们常与反射相比较，因为反射API和方法句柄都提供了一种调用方法、构造函数和访问字段的手段。

究竟什么是方法句柄？它是一个对底层方法、构造函数或字段的直接可调用引用。方法句柄API允许在方法的简单指针之上进行操作，使我们能够插入或重新排序参数，转换返回值等。

让我们更仔细地看看方法句柄能提供什么以及如何有效使用它们。

## 访问检查

与反射API相比，方法句柄调用的访问检查方式不同。使用反射时，每个调用都会对调用者进行访问检查。对于方法句柄，仅在创建方法句柄时进行检查。

需要牢记的是，如果方法句柄是在可以访问非公共成员的上下文中创建的，当它被传递到外部时，它仍然可以访问这些非公共成员。因此，非公共成员可能被潜在地从它们本不应可访问的代码中访问。开发者有责任保持这些方法句柄在它们的上下文中是私有的。或者，可以使用适当的查找对象立即以访问限制创建方法句柄。

## 方法句柄查找

要创建一个方法句柄，我们首先需要创建一个`Lookup`对象，它作为创建方法句柄的工厂。根据查找对象本身或方法句柄的使用方式，我们可以决定是否应该限制其访问级别。

例如，如果我们创建一个指向私有方法的方法句柄，并且该方法句柄可以从外部访问，那么私有方法也是可以访问的。通常我们希望避免这种情况。一种方法是使查找对象和方法句柄也成为`private`。另一种选择是使用`MethodHandles.publicLookup`方法创建查找对象，这样它只能在无条件导出的包中的公共类里搜索公共成员：

```java
MethodHandles.Lookup publicLookup = MethodHandles.publicLookup();
```

如果我们打算保持查找对象和方法句柄私有，那么赋予它们访问任何成员（包括私有和受保护的）是安全的：

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
```

## 方法类型

要查找方法句柄，我们还需要提供方法或字段的类型信息。方法类型信息表示为`MethodType`对象。要实例化一个`MethodType`，我们需要提供返回类型作为第一个参数，然后是所有参数类型：

```java
MethodType methodType = MethodType.methodType(int.class /* 方法返回整数 */, String.class /* 并接受一个字符串参数 */);
```

有了`Lookup`和`MethodType`实例，我们可以查找方法句柄。对于实例方法，我们应该使用`Lookup.findVirtual`，对于静态方法使用`Lookup.findStatic`。这两种方法都接受以下参数：一个方法所在位置的`Class`，一个以`String`表示的方法名称，和一个`MethodType`实例。

在下面的例子中，我们使用`Lookup.findVirtual`方法查找一个实例方法`String.replace`，它接受两个`char`参数并返回一个`String`：

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType replaceMethodType = MethodType.methodType(String.class, char.class, char.class);
MethodHandle replaceMethodHandle = lookup.findVirtual(String.class, "replace", replaceMethodType);
```

在下一个例子中，我们使用`Lookup.findStatic`查找一个静态方法`String.valueOf`，它接受一个`Object`并返回一个`String`：

```java
MethodType valueOfMethodType = MethodType.methodType(String.class, Object.class);
MethodHandle valueOfMethodHandle = lookup.findStatic(String.class, "valueOf", valueOfMethodType);
```

类似地，我们可以使用`Lookup.findConstructor`方法来查找指向任何构造函数的方法句柄。

最后，当我们获得了一个方法句柄，我们可以调用底层的方法。

## 方法句柄调用

调用可以通过多种方式完成。

所有促进调用的方法最终都归结为一个最终被调用的方法：`MethodHandle.invokeExact`。正如方法名称所暗示的，提供给`invokeExact`方法的参数必须严格匹配方法句柄的类型。

例如，如果我们调用`String.replace`方法，参数必须严格对应于一个`String`返回类型和两个`char`参数：

```java
MethodType replaceMethodType = MethodType.methodType(String.class, char.class, char.class);
MethodHandle replaceMethodHandle = lookup.findVirtual(String.class, "replace", replaceMethodType);
String result = (String) replaceMethodHandle.invokeExact("dummy", 'd', 'm');
```

`MethodHandle.invoke`更为宽容。它尝试获取一个新的方法句柄，调整类型以严格匹配提供的参数类型。之后，它将能够使用`invokeExact`调用调整后的方法句柄。

```java
String result = (String) replaceMethodHandle.invoke((Object)"dummy", (Object)'d', (Object)'m'); // 将因`invokeExact`失败
```

调用方法句柄的另一种替代方法是使用`MethodHandle.invokeWithArguments`。此方法调用的结果等同于`invoke`，唯一的区别是所有参数可以作为对象数组或列表提供。

这个方法的一个有趣特性是，如果提供的参数数量超过了预期数量，所有剩余的参数将被压缩到最后一个参数中，该参数将被视为数组。

## 访问字段

可以创建具有读取或写入字段访问权的方法句柄。对于实例字段，这可以通过`findGetter`和`findSetter`方法来实现，对于静态字段，则是通过`findStaticGetter`和`findStaticSetter`方法。我们不需要提供一个`MethodType`实例；相反，我们应该提供一个单一的类型，即字段的类型。

例如，如果我们的`Example`类中有一个静态字段`magic`：

```java
private static String magic = "initial value static field";
```

假设我们已经创建了一个`Lookup`对象：

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
```

我们可以简单地分别创建setter和getter方法句柄并单独调用它们：

```java
MethodHandle setterStaticMethodHandle = lookup.findStaticSetter(Example.class, "magic", String.class);
MethodHandle getterStaticMethodHandle = lookup.findStaticGetter(Example.class, "magic", String.class);

setterStaticMethodHandle.invoke("new value static field");
String staticFieldResult = (String) getterStaticMethodHandle.invoke(); // staticFieldResult == `new value static field`
```

这里有`Example`类的一个实例字段`abc`：

```java
private String abc = "initial value";
```

我们可以类似地为读取和写入实例字段创建方法句柄：

```java
MethodHandle setterMethodHandle = lookup.findSetter(Example.class, "abc", String.class);
MethodHandle getterMethodHandle = lookup.findGetter(Example.class, "abc", String.class);
```

要使用setter和getter方法句柄与实例字段，我们首先必须获得字段所属类的实例：

```java
Example example = new Example();
```

之后，我们必须为调用我们的setter和getter提供`Example`的实例：

```java
setterMethodHandle.invoke(example, "new value");
String result = (String) getterMethodHandle.invoke(example); // result == `new value`
```

尽管使用方法句柄读写字段值是可能的，但这并不是常见的做法。对于字段，更适合使用`VarHandle`，它们可以通过`findVarHandle`和`findStaticVarHandle`方法创建。

## 使用数组

`MethodHandles`类包含提供一些预设方法句柄的方法。这些包括允许数组操作的方法句柄。创建这些方法句柄不需要访问检查，因此不需要查找对象。

让我们使用`arrayConstructor`创建一个包含5个元素的字符串数组：

```java
MethodHandle arrayConstructor = MethodHandles.arrayConstructor(String[].class);
String[] arr = (String[]) arrayConstructor.invoke(5);
```

要修改单个元素，我们可以使用`arrayElementSetter`，我们需要提供目标数组的引用、元素的索引和新值：

```java
MethodHandle elementSetter = MethodHandles.arrayElementSetter(String[].class);
elementSetter.invoke(arr, 4, "test");
```

要读取单个元素的值，我们应该使用`arrayElementGetter`方法句柄，我们需要提供数组的引用和元素索引：

```java
MethodHandle elementGetter = MethodHandles.arrayElementGetter(String[].class);
String element = (String) elementGetter.invoke(arr, 4); // element == "test"
```

我们还可以使用`arrayLength`提供的方法句柄获取数组长度作为整数：

```java
MethodHandle arrayLength = MethodHandles.arrayLength(String[].class);
int length = (int) arrayLength.invoke(arr); // length == 5
```

## 异常处理

`invokeExact`和`invoke`都抛出`Throwable`，因此底层方法可以抛出的异常没有限制。调用方法句柄的方法必须显式抛出一个`Throwable`或捕获它。

`MethodHandles` API中有一些方法可以使异常处理更容易。让我们看几个例子。

### `catch`包装器

`MethodHandles.catchException`方法可以将给定的方法句柄包装在提供的异常处理句柄内。

假设我们有一个执行某些业务逻辑的`problematicMethod`方法，以及一个处理特定`IllegalArgumentException`的`exceptionHandler`方法。异常处理方法必须返回与原始方法相同的类型。它首先接受我们感兴趣的`Throwable`，然后是原始接受的所有

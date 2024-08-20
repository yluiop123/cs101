# 释放资源和捕获异常

## 释放资源和捕获异常

### 释放系统资源
该 API 中使用的许多资源，如流或通道，都实现或扩展了`java.io.Closeable`接口。`Closeable`资源的一个要求是，当不再需要时，必须调用`close()`方法来释放资源。忽略关闭资源可能会对应用程序的性能产生负面影响。下一节中描述的`try - with - resources`语句将为您处理此步骤。

### 关闭资源
为了简单起见，前面的示例省略了两件事：异常的处理和读取器的关闭。
Java I/O API 中所有的 I/O 操作都会抛出相同的默认异常：`IOException`。根据您访问的资源类型，可能会抛出更多的异常。例如，如果您的`reader`从文件中读取字符，您可能需要处理`FileNotFoundException`。
在您的应用程序中，关闭 I/O 资源是必须的。长期不关闭资源将导致您的应用程序崩溃。
从 Java SE 7 开始，可以使用`try - with - resources`语句来关闭 I/O 资源。让我们使用这种模式重写前面的代码。
```java
Path path = Paths.get("file.txt"); 
try (BufferedReader reader = Files.newBufferedReader(path)) { 

    // 用 reader 做一些事情 

} catch (IOException e) { 
    // 处理异常
} 
```
在这个例子中，`reader`对象可以在`try`块中使用。当程序离开这个块时，无论是正常还是异常，`reader`对象的`close()`方法都会被自动调用。

### 关闭多个资源
您可能会看到使用它们的构造函数创建的文件读取器和缓冲读取器。这些是在 Java SE 7 中引入`Files`工厂类之前使用的模式。在这种情况下，您将看到创建了几个中间 I/O 资源，必须以正确的顺序关闭它们。
对于使用文件读取器创建的缓冲读取器，正确的模式如下。
```java
File file = new File("file.txt"); 

try (FileReader fileReader = new FileReader(file); 
     BufferedReader bufferedReader = new BufferedReader(fileReader);) { 

    // 用 bufferedReader 或 fileReader 做一些事情 

} catch (IOException e) { 
    // 处理异常
} 
```

### 捕获异常
在文件 I/O 中，意外情况是生活中的一个事实：文件在预期的时候存在（或不存在），程序没有访问文件系统的权限，默认的文件系统实现不支持特定的功能等等。可能会遇到许多错误。
所有访问文件系统的方法都可能抛出`IOException`。最好的做法是通过将这些方法嵌入到 Java SE 7 版本中引入的`try - with - resources`语句中来捕获这些异常。`try - with - resources`语句的优点是，编译器会自动生成在不再需要时关闭资源的代码。以下代码展示了可能的样子：
```java
Charset charset = Charset.forName("US - ASCII"); 
String s =...;
try (BufferedWriter writer = Files.newBufferedWriter(file, charset)) { 
    writer.write(s, 0, s.length());
} catch (IOException x) { 
    System.err.format("IOException: %s%n", x); 
} 
```
或者，您可以将文件 I/O 方法嵌入到`try`块中，然后在`catch`块中捕获任何异常。如果您的代码打开了任何流或通道，您应该在`finally`块中关闭它们。使用`try - catch - finally`方法，前面的示例看起来如下：
```java
Charset charset = Charset.forName("US - ASCII"); 
String s =...;
BufferedWriter writer = null; 
try { 
    writer = Files.newBufferedWriter(file, charset); 
    writer.write(s, 0, s.length());
} catch (IOException x) { 
    System.err.format("IOException: %s%n", x); 
} finally { 
    try { 
        if (writer!= null) 
            writer.close(); 
    } catch (IOException x) { 
        System.err.format("IOException: %s%n", x); 
    }
} 
```
除了`IOException`，许多特定的异常扩展了`FileSystemException`。这个类有一些有用的方法，返回涉及的文件（`getFile()`）、详细的消息字符串（`getMessage()`）、文件系统操作失败的原因（`getReason()`）和“其他”涉及的文件（如果有）（`getOtherFile()`）。
以下代码片段展示了如何使用`getFile()`方法：
```java
try (...){ 
  ... 
} catch (NoSuchFileException x) { 
    System.err.format("%s does not exist\n", x.getFile());
} 
```
为了清晰起见，本节中的文件 I/O 示例可能不会显示异常处理，但您的代码应该始终包含它。

### 使用可变参数
当指定标志时，几个`Files`方法接受任意数量的参数。例如，在以下方法签名中，`CopyOption`参数后的省略号表示该方法接受可变数量的参数，或通常称为可变参数：
```java
Path Files.move(Path, Path, CopyOption...); 
```
当一个方法接受可变参数时，您可以传递一个逗号分隔的值列表或一个值数组（`CopyOption[]`）。
在以下示例中，该方法可以如下调用：
```java
Path source =...;
Path target =...;
Files.move(source, 
           target, 
           REPLACE_EXISTING, 
           ATOMIC_MOVE); 
```

### 方法链
许多文件 I/O 方法支持方法链的概念。
您首先调用一个返回对象的方法。然后，您立即在该对象上调用一个方法，该方法返回另一个对象，依此类推。许多 I/O 示例使用以下技术：
```java
String value = Charset.defaultCharset().decode(buf).toString();
UserPrincipal group = 
    file.getFileSystem()
      .getUserPrincipalLookupService()
      .lookupPrincipalByName("me"); 
```
这种技术产生了紧凑的代码，并使您能够避免声明不需要的临时变量。
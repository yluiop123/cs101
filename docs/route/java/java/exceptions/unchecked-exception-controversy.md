# Java 中的未检查异常-讨论（Unchecked Exceptions — The Controversy）

## Java 中的未检查异常-讨论
由于 Java 编程语言不要求方法捕获或指定未检查异常（`RuntimeException`、`Error`及其子类），程序员可能会倾向于编写只抛出未检查异常的代码，或者使他们所有的异常子类都继承自`RuntimeException`。这两种捷径都允许程序员编写代码而不必担心编译器错误，也不必费心指定或捕获任何异常。尽管这对程序员来说似乎很方便，但它规避了捕获或指定要求的意图，并可能给使用您的类的其他人带来问题。

为什么设计者决定强制方法指定其范围内可能抛出的所有未捕获的检查异常？方法可能抛出的任何`Exception`都是该方法公共编程接口的一部分。调用方法的人必须知道方法可能抛出的异常，以便他们决定如何处理这些异常。这些异常与方法的参数和返回值一样，都是该方法编程接口的一部分。

接下来的问题可能是：“如果记录方法的 API，包括它可能抛出的异常，是如此有益，为什么不也指定运行时异常呢？”运行时异常表示由于编程问题导致的问题，因此，API 客户端代码不能合理地期望从这些异常中恢复或以任何方式处理它们。这些问题包括算术异常，如除以零；指针异常，如试图通过空引用访问对象；以及索引异常，如试图通过太大或太小的索引访问数组元素。

运行时异常可以在程序的任何地方发生，在一个典型的程序中，它们可能非常多。在每个方法声明中都必须添加运行时异常会降低程序的清晰度。因此，编译器不要求您捕获或指定运行时异常（尽管您可以这样做）。

一种常见的抛出`RuntimeException`的情况是当用户错误地调用方法时。例如，一个方法可以检查其某个参数是否错误地为`null`。如果参数为`null`，该方法可能会抛出`NullPointerException`，这是一个未检查异常。

一般来说，不要仅仅因为不想费心指定方法可能抛出的异常而抛出`RuntimeException`或创建`RuntimeException`的子类。

这里是底线准则：如果客户端可以合理地期望从异常中恢复，则将其设置为检查异常。如果客户端无法从异常中恢复，则将其设置为未检查异常。

## 异常的优势
现在您知道了什么是异常以及如何使用它们，是时候了解在程序中使用异常的优势了。

### 优势 1：将错误处理代码与“常规”代码分离
异常提供了一种将异常情况发生时的处理细节与程序的主要逻辑分离的方法。在传统编程中，错误检测、报告和处理往往导致混乱的意大利面条式代码。例如，考虑这里的伪代码方法，它将整个文件读入内存。
```
readFile {
    open the file;
    determine its size;
    allocate that much memory;
    read the file into memory;
    close the file;
}
```
乍一看，这个函数似乎足够简单，但它忽略了所有以下潜在的错误。
 - 如果文件无法打开会发生什么？
 - 如果无法确定文件的长度会发生什么？
 - 如果无法分配足够的内存会发生什么？
 - 如果读取失败会发生什么？
 - 如果文件无法关闭会发生什么？
为了处理这些情况，`readFile`函数必须有更多的代码来进行错误检测、报告和处理。以下是该函数可能的样子。
```
errorCodeType readFile {
    initialize errorCode = 0;

    open the file;
    if (theFileIsOpen) {
        determine the length of the file;
        if (gotTheFileLength) {
            allocate that much memory;
            if (gotEnoughMemory) {
                read the file into memory;
                if (readFailed) {
                    errorCode = -1;
                }
            } else {
                errorCode = -2;
            }
        } else {
            errorCode = -3;
        }
        close the file;
        if (theFileDidntClose && errorCode == 0) {
            errorCode = -4;
        } else {
            errorCode = errorCode and -4;
        }
    } else {
        errorCode = -5;
    }
    return errorCode;
}
```
这里有太多的错误检测、报告和返回，以至于最初的七行代码在混乱中丢失了。更糟糕的是，代码的逻辑流程也丢失了，因此很难判断代码是否在做正确的事情：如果函数无法分配足够的内存，文件是否真的会被关闭？在编写方法三个月后修改它时，确保代码继续做正确的事情更加困难。许多程序员通过简单地忽略这个问题来解决这个问题——当他们的程序崩溃时会报告错误。
异常使您能够编写代码的主要流程，并在其他地方处理异常情况。如果`readFile`函数使用异常而不是传统的错误管理技术，它看起来会更像这样。
```
readFile {
    try {
        open the file;
        determine its size;
        allocate that much memory;
        read the file into memory;
        close the file;
    } catch (fileOpenFailed) {
        doSomething;
    } catch (sizeDeterminationFailed) {
        doSomething;
    } catch (memoryAllocationFailed) {
        doSomething;
    } catch (readFailed) {
        doSomething;
    } catch (fileCloseFailed) {
        doSomething;
    }
}
```
请注意，异常并不会省去您检测、报告和处理错误的工作，但它们确实有助于您更有效地组织工作。

### 优势 2：将错误沿着调用堆栈传播
异常的第二个优势是能够将错误报告沿着方法的调用堆栈向上传播。假设`readFile`方法是主程序进行的一系列嵌套方法调用中的第四个方法：`method1`调用`method2`，`method2`调用`method3`，`method3`最终调用`readFile`。
```
method1 {
    call method2;
}

method2 {
    call method3;
}

method3 {
    call readFile;
}
```
假设`method1`是唯一对`readFile`中可能发生的错误感兴趣的方法。传统的错误通知技术迫使`method2`和`method3`将`readFile`返回的错误代码沿着调用堆栈向上传播，直到错误代码最终到达`method1`——唯一对它们感兴趣的方法。
```
method1 {
    errorCodeType error;
    error = call method2;
    if (error)
        doErrorProcessing;
    else
        proceed;
}

errorCodeType method2 {
    errorCodeType error;
    error = call method3;
    if (error)
        return error;
    else
        proceed;
}

errorCodeType method3 {
    errorCodeType error;
    error = call readFile;
    if (error)
        return error;
    else
        proceed;
}
```
回想一下，Java 运行时环境会向后搜索调用堆栈，以查找任何对处理特定异常感兴趣的方法。一个方法可以忽略它内部抛出的任何异常，从而允许调用堆栈中更高的方法捕获它。因此，只有关心错误的方法才需要担心检测错误。
```
method1 {
    try {
        call method2;
    } catch (exception e) {
        doErrorProcessing;
    }
}

method2 throws exception {
    call method3;
}

method3 throws exception {
    call readFile;
}
```
然而，正如伪代码所示，忽略异常需要中间方法付出一些努力。方法中可能抛出的任何检查异常都必须在其`throws`子句中指定。

### 优势 3：分组和区分错误类型
因为程序中抛出的所有异常都是对象，所以异常的分组或分类是类层次结构的自然结果。Java 平台中一组相关异常类的示例是在`java.io`中定义的那些——`IOException`及其后代。`IOException`是最通用的，表示在执行 I/O 时可能发生的任何类型的错误。它的后代表示更具体的错误。例如，`FileNotFoundException`意味着在磁盘上无法找到文件。
一个方法可以编写特定的处理程序来处理非常具体的异常。`FileNotFoundException`类没有后代，因此以下处理程序只能处理一种类型的异常。
```
catch (FileNotFoundException e) {
   ...
}
```
一个方法可以通过在`catch`语句中指定异常的任何超类来根据其组或一般类型捕获异常。例如，要捕获所有 I/O 异常，无论其具体类型如何，异常处理程序指定一个`IOException`参数。
```
catch (IOException e) {
   ...
}
```
这个处理程序将能够捕获所有 I/O 异常，包括`FileNotFoundException`、`EOFException`等等。您可以通过查询传递给异常处理程序的参数来获取有关发生的详细信息。例如，使用以下代码打印堆栈跟踪。
```
catch (IOException e) {
    // 输出到 System.err。
    e.printStackTrace();
    // 发送跟踪到 stdout。
    e.printStackTrace(System.out);
}
```
您甚至可以设置一个异常处理程序，该处理程序处理任何`Exception`。
```
// 一个（过于）通用的异常处理程序
catch (Exception e) {
   ...
}
```
`Exception`类接近`Throwable`类层次结构的顶部。因此，这个处理程序将捕获许多其他异常，除了它打算捕获的那些异常。如果您希望您的程序所做的一切，例如，只是为用户打印出错误消息然后退出，您可能希望以这种方式处理异常。
然而，在大多数情况下，您希望异常处理程序尽可能具体。原因是处理程序必须做的第一件事是确定发生的异常类型，然后才能决定最佳的恢复策略。实际上，通过不捕获特定的错误，处理程序必须适应任何可能性。过于通用的异常处理程序可能会使代码更容易出错，因为它会捕获和处理程序员未预料到的异常，并且处理程序不是为这些异常设计的。
如前所述，您可以创建异常组并以通用方式处理异常，或者您可以使用特定的异常类型来区分异常并以精确的方式处理异常。

## 总结
程序可以使用异常来指示发生了错误。要抛出异常，请使用`throw`语句并为其提供一个异常对象——`Throwable`的后代——以提供有关发生的具体错误的信息。抛出未捕获的检查异常的方法必须在其声明中包含`throws`子句。
程序可以通过使用`try`、`catch`和`finally`块的组合来捕获异常。
`try`块标识了一个可能发生异常的代码块。
`catch`块标识了一个代码块，称为异常处理程序，它可以处理特定类型的异常。
`finally`块标识了一个保证会执行的代码块，是关闭文件、恢复资源以及在`try`块中包含的代码执行后进行清理的正确位置。
`try`语句应该至少包含一个`catch`块或一个`finally`块，并且可以有多个`catch`块。
异常对象的类指示抛出的异常类型。异常对象可以包含有关错误的进一步信息，包括错误消息。通过异常链，一个异常可以指向导致它的异常，该异常又可以指向导致它的异常，依此类推。
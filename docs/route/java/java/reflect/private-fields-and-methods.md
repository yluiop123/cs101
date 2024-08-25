# 私有字段和方法

尽管普遍认为不可能，但实际上确实可以通过Java反射访问其他类的私有字段和方法。这甚至并不难。这在单元测试中可能非常有用。本文将向您展示如何做到这一点。

注意：这只在作为独立Java应用程序运行代码时有效，就像您进行单元测试和常规应用程序一样。如果您尝试在Java Applet中执行此操作，则需要与SecurityManager进行一些操作。但是，由于这不是您经常需要做的事情，因此本文暂时不包括此内容。

注意：有关从Java 9开始禁用通过反射访问私有字段的能力的讨论已经很多。根据我的实验，似乎在Java 9中仍然可以这样做，但请注意，这可能在未来的Java版本中会有所改变。

## 访问私有字段

要访问私有字段，您需要调用`Class.getDeclaredField(String name)`或`Class.getDeclaredFields()`方法。`Class.getField(String name)`和`Class.getFields()`方法只返回公共字段，因此它们不起作用。以下是一个带有私有字段的类的简单示例，以及使用Java反射访问该字段的代码：

```java
public class PrivateObject {

  private String privateString = null;

  public PrivateObject(String privateString) {
    this.privateString = privateString;
  }
}
```

```java
PrivateObject privateObject = new PrivateObject("The Private Value");

Field privateStringField = PrivateObject.class.
            getDeclaredField("privateString");

privateStringField.setAccessible(true);

String fieldValue = (String) privateStringField.get(privateObject);
System.out.println("fieldValue = " + fieldValue);
```

这个代码示例将打印出"fieldValue = The Private Value"，这是代码示例开头创建的`PrivateObject`实例的私有字段`privateString`的值。

注意`PrivateObject.class.getDeclaredField("privateString")`方法的使用。正是这个方法调用返回了私有字段。此方法仅返回在特定类中声明的字段，而不是在任何超类中声明的字段。

还要注意加粗的行。通过调用`Field.setAccessible(true)`，您可以为这个特定的`Field`实例关闭访问检查，仅用于反射。现在，即使它是私有的、受保护的或包级作用域的，即使调用者不是这些作用域的一部分，您也可以访问它。
您仍然无法使用普通代码访问该字段。编译器不允许。

## 访问私有方法

要访问私有方法，您需要调用`Class.getDeclaredMethod(String name, Class[] parameterTypes)`或`Class.getDeclaredMethods()`方法。`Class.getMethod(String name, Class[] parameterTypes)`和`Class.getMethods()`方法只返回公共方法，因此它们不起作用。以下是一个带有私有方法的类的简单示例，以及使用Java反射访问该方法的代码：

```java
public class PrivateObject {

  private String privateString = null;

  public PrivateObject(String privateString) {
    this.privateString = privateString;
  }

  private String getPrivateString(){
    return this.privateString;
  }
}
```

```java
PrivateObject privateObject = new PrivateObject("The Private Value");

Method privateStringMethod = PrivateObject.class.
        getDeclaredMethod("getPrivateString", null);

privateStringMethod.setAccessible(true);

String returnValue = (String)
        privateStringMethod.invoke(privateObject, null);

System.out.println("returnValue = " + returnValue);
```

这个代码示例将打印出"returnValue = The Private Value"，这是在代码示例开头创建的`PrivateObject`实例上调用`getPrivateString()`方法时返回的值。

注意`PrivateObject.class.getDeclaredMethod("privateString")`方法的使用。正是这个方法调用返回了私有方法。此方法仅返回在特定类中声明的方法，而不是在任何超类中声明的方法。

还要注意加粗的行。通过调用`Method.setAccessible(true)`，您可以为这个特定的`Method`实例关闭访问检查，仅用于反射。现在，即使它是私有的、受保护的或包级作用域的，即使调用者不是这些作用域的一部分，您也可以访问它。
您仍然无法使用普通代码访问该方法。编译器不允许。



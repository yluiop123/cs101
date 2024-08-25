# 类的动态加载和重载

你可以在Java运行时加载和重新加载类，尽管这并不像人们希望的那样直接。这是通过Java平台内置的类加载器系统完成的。本文将解释何时以及如何在Java中加载和重新加载类。

你可以争论Java的动态类加载特性是否真的是Java反射的一部分，或者是核心Java平台的一部分。无论如何，由于没有更好的地方放置，文章已被放入Java反射路径中。

## 类加载器

Java应用程序中的所有类都是使用`java.lang.ClassLoader`的某个子类加载的。因此，动态加载类也必须使用`java.lang.ClassLoader`子类来完成。

当一个类被加载时，它引用的所有类也会被加载。这种类加载模式是递归的，直到加载了所有需要的类。这可能不是应用程序中的所有类。未引用的类在被引用之前不会被加载。

## 类加载器层次结构

Java中的类加载器被组织成层次结构。当您创建一个新的标准Java `ClassLoader`时，您必须为其提供一个父 `ClassLoader`。如果 `ClassLoader` 被要求加载一个类，它会要求其父类加载器来加载它。如果父类加载器找不到该类，子类加载器随后会尝试自己加载它。

## 类加载

给定类加载器在加载类时使用的步骤是：

1. 检查类是否已经被加载。
2. 如果没有被加载，请求父类加载器加载该类。
3. 如果父类加载器无法加载类，尝试在此类加载器中加载它。

当您实现一个能够重新加载类的类加载器时，您将需要稍微偏离这个序列。要重新加载的类不应该被请求由父类加载器加载。稍后会有更多内容。

## 动态类加载

动态加载类很容易。您所要做的就是获取一个 `ClassLoader` 并调用它的 `loadClass()` 方法。以下是一个示例：

```java
public class MainClass {

  public static void main(String[] args){

    ClassLoader classLoader = MainClass.class.getClassLoader();

    try {
        Class aClass = classLoader.loadClass("com.jenkov.MyClass");
        System.out.println("aClass.getName() = " + aClass.getName());
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }

  }
}
```

## 动态类重新加载

动态类重新加载更具挑战性。Java内置的类加载器在加载类之前总是检查该类是否已经被加载。因此，使用Java内置的类加载器重新加载类是不可能的。要重新加载一个类，您必须实现自己的 `ClassLoader` 子类。

即使使用自定义的 `ClassLoader` 子类，您也面临挑战。
每个加载的类都需要链接。这是使用 `ClassLoader.resolve()` 方法完成的。这个方法是最终的，因此不能在您的 `ClassLoader` 子类中被覆盖。 `resolve()` 方法不允许任何给定的 `ClassLoader` 实例两次链接同一个类。
因此，每次您想要重新加载一个类时，您必须使用您的 `ClassLoader` 子类的一个新的实例。这并非不可能，但在设计类重新加载时必须知道。

## 为类重新加载设计代码

如前所述，您不能使用已经加载过该类的 `ClassLoader` 来重新加载一个类。因此，您将不得不使用不同的 `ClassLoader` 实例来重新加载该类。但这带来了一些新的挑战。

Java应用程序中加载的每个类都由其完全限定名称（包名称+类名称）和加载它的 `ClassLoader` 实例标识。这意味着，由类加载器A加载的 `MyObject` 类，与由类加载器B加载的 `MyObject` 类不是同一个类。
看这段代码：

```java
MyObject object = (MyObject)
    myClassReloadingFactory.newInstance("com.jenkov.MyObject");
```

注意 `MyObject` 类如何在代码中被引用，作为 `object` 变量的类型。这导致 `MyObject` 类被加载此代码所在的同一个类加载器加载。

如果 `myClassReloadingFactory` 对象工厂使用与上述代码所在的类不同的类加载器重新加载 `MyObject` 类，您就不能将重新加载的 `MyObject` 类的实例转换为 `object` 变量的 `MyObject` 类型。由于两个 `MyObject` 类是由不同的类加载器加载的，它们被视为不同的类，即使它们具有相同的完全限定类名称。尝试将一个类的对象转换为另一个类的引用将导致 `ClassCastException`。

有可能绕过这个限制，但您必须以两种方式之一更改代码：

1. 使用接口作为变量类型，只重新加载实现类。
2. 使用超类作为变量类型，只重新加载子类。

以下是两个相应的代码示例：

```java
MyObjectInterface object = (MyObjectInterface)
    myClassReloadingFactory.newInstance("com.jenkov.MyObject");

MyObjectSuperclass object = (MyObjectSuperclass)
    myClassReloadingFactory.newInstance("com.jenkov.MyObject");
```

如果变量的类型，接口或超类，在实现类或子类重新加载时没有重新加载，这两种方法都将有效。

为了使这工作，您当然需要实现您的类加载器，以便让接口或超类由其父类加载器加载。当您的类加载器被要求加载 `MyObject` 类时，它也将被要求加载 `MyObjectInterface` 类，或 `MyObjectSuperclass` 类，因为这些是在 `MyObject` 类内引用的。

您的类加载器必须将这些类的加载委托给加载接口或超类类型变量的同一个类加载器。

## 类加载器加载/重新加载示例

上述文本包含了很多讨论。让我们看一个简单的例子。
以下是一个简单的 `ClassLoader` 子类示例。注意它如何将其父类加载器委托类加载，除了它打算能够重新加载的那个类。如果这个类的加载被委托给父类加载器，它以后就不能重新加载。记住，同一个 `ClassLoader` 实例只能加载一次类。

如前所述，这只是一个示例，用于向您展示 `ClassLoader` 行为的基础知识。它不是您自己的类加载器的生产就绪模板。
您自己的类加载器可能不仅限于一个类，而是您知道需要重新加载的一类类。此外，您可能不应该硬编码类路径。

```java
public class MyClassLoader extends ClassLoader {

    public MyClassLoader(ClassLoader parent) {
        super(parent);
    }

    public Class loadClass(String name) throws ClassNotFoundException {
        if(!"reflection.MyObject".equals(name))
            return super.loadClass(name);

        try {
            String url = "file:C:/data/projects/tutorials/web/WEB-INF/" +
                         "classes/reflection/MyObject.class";
            URL myUrl = new URL(url);
            URLConnection connection = myUrl.openConnection();
            InputStream input = connection.getInputStream();
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int data = input.read();

            while(data != -1){
                buffer.write(data);
                data = input.read();
            }

            input.close();

            byte[] classData = buffer.toByteArray();

            return defineClass("reflection.MyObject",
                    classData, 0, classData.length);

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

}
```

以下是 `MyClassLoader` 的使用示例。

```java
public static void main(String[]
```


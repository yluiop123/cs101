# 模块

本Java模块反射教程将解释如何通过Java反射访问Java类所属的Java模块。

Java模块的概念是在Java 9中通过Java平台模块系统添加的。一个Java模块是一组Java包。因此，每个Java类都属于一个包，而包属于一个模块。

Java模块由Java反射类`java.lang.Module`在Java模块`java.base`中表示。通过这个类，你可以与Java平台模块系统交互，获取有关给定模块的信息或修改模块。本教程将介绍一些你可以通过Java反射使用`Module`实例完成的操作。

## 获取模块实例

你可以通过`Class`实例获取`Module`类的实例，如下所示：

```java
Module myClassModule = MyClass.class.getModule();
```

## 是否为命名模块？

你可以通过调用`Module`的`isNamed()`方法来检查`Module`实例是否表示一个命名模块。以下是一个示例：

```java
boolean isNamed = myClassModule.isNamed();
```

## 是否为开放模块？

你可以通过`Module`的`isOpen()`方法检查模块是否为命名模块。以下是一个示例：

```java
boolean isOpen = myClassModule.isOpen();
```

## 获取模块描述符

一旦你访问了`Module`实例，就可以通过`getDescriptor()`方法访问其`ModuleDescriptor`。以下是通过`getDescriptor()`访问Java `Module`的`ModuleDescriptor`的示例：

```java
ModuleDescriptor descriptor = myClassModule.getDescriptor();
```

从`ModuleDescriptor`中，你可以读取模块描述符中的信息。本Java模块反射教程将在以下部分介绍你可以从模块描述符中获取的一些信息。

### 模块名称

你可以通过`ModuleDescriptor`的`name()`方法从其模块描述符中获取命名模块的名称。以下是通过反射读取Java模块名称的示例：

```java
String moduleName = descriptor.name();
```

### 导出的包

你可以通过Java反射，通过`ModuleDescriptor`的`exports()`方法读取Java模块导出的包列表。以下是获取Java模块导出的包集合的示例：

```java
Set<ModuleDescriptor.Exports> exports = descriptor.exports();
```

### 是否为自动模块？

你可以通过`ModuleDescriptor`的`isAutomatic()`方法检查Java模块是否为自动模块。以下是检查Java模块是否为自动模块的示例：

```java
boolean isAutomatic = descriptor.isAutomatic();
```

### 是否为开放模块？

你可以通过`ModuleDescriptor`的`isOpen()`方法检查Java模块是否为开放模块。以下是检查Java模块是否为开放模块的示例：

```java
boolean isOpen = descriptor.isOpen();
```

### 模块中的包

你可以通过Java反射获取给定Java模块中包名称的列表。你可以通过`ModuleDescriptor`的`packages()`方法来实现。以下是通过反射获取模块的包名称列表的示例：

```java
Set packages = descriptor.packages();
```

### 使用的服务

你还可以借助Java反射读取给定Java模块使用的服务。模块使用的服务也被称为模块的服务依赖项。你可以通过`ModuleDescriptor`的`uses()`方法读取模块服务依赖项。以下是如何通过反射读取Java模块的服务依赖项的示例：

```java
Set<String> uses = descriptor.uses();
```


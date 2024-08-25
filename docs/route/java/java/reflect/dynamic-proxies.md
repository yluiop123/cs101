# 动态代理

使用Java反射，你可以在运行时创建接口的动态实现。你使用`java.lang.reflect.Proxy`类来实现这一点。这个类的名字也是我将这些动态接口实现称为动态代理的原因。动态代理可以用于许多不同的目的，例如数据库连接和事务管理、单元测试的动态模拟对象，以及其他类似AOP的方法拦截目的。

## 创建代理

你使用`Proxy.newProxyInstance()`方法创建动态代理。
`newProxyInstance()`方法接受3个参数：

1. 要“加载”动态代理类的`ClassLoader`。
2. 要实现的接口数组。
3. 将代理上的所有方法调用转发到的`InvocationHandler`。

以下是一个示例：

```java
InvocationHandler handler = new MyInvocationHandler();
MyInterface proxy = (MyInterface) Proxy.newProxyInstance(
                            MyInterface.class.getClassLoader(),
                            new Class[] { MyInterface.class },
                            handler);
```

运行此代码后，`proxy`变量包含`MyInterface`接口的动态实现。对代理的所有调用将被转发到通用`InvocationHandler`接口的`handler`实现。`InvocationHandler`在下一节中介绍。

## `InvocationHandler`的

如前所述，你必须向`Proxy.newProxyInstance()`方法传递一个`InvocationHandler`实现。对动态代理的所有方法调用都被转发到这个`InvocationHandler`实现。
`InvocationHandler`接口如下所示：

```java
public interface InvocationHandler {
  Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
}
```

以下是一个示例实现：

```java
public class MyInvocationHandler implements InvocationHandler {

  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    // 做一些“动态”的事情
  }
}
```

传递给`invoke()`方法的`proxy`参数是实现了接口的动态代理对象。大多数情况下你不需要这个对象。

传递到`invoke()`方法的`Method`对象表示在动态代理实现的接口上调用的方法。从`Method`对象你可以获取方法名称、参数类型、返回类型等。更多信息请查看有关方法的文本。

`Object[] args`数组包含在实现接口的方法被调用时传递给代理的参数值。注意：实现接口中的基本类型（int、long等）被包装在它们的对象对应物中（Integer、Long等）。

## 已知用例

动态代理已知至少用于以下目的：

- 数据库连接和事务管理
- 单元测试的动态模拟对象
- 适应自定义工厂接口的DI容器
- 类似AOP的方法拦截

### 数据库连接和事务管理

Spring框架有一个事务代理，可以为你启动和提交/回滚事务。这在“高级连接和事务界定与传播”的文本中有更详细的描述，所以我将只简要描述。调用序列变成这样：

```java
web controller -> proxy.execute(...);
  proxy -> connection.setAutoCommit(false);
  proxy -> realAction.execute();
    realAction 执行数据库工作
  proxy -> connection.commit();
```

### 单元测试的动态模拟对象

Butterfly测试工具利用动态代理来为单元测试实现动态存根、模拟和代理。当测试使用另一个类B（实际上是接口）的类A时，你可以传递B的模拟实现到A，而不是真正的B。现在B上的所有方法调用都被记录了，你可以设置模拟B应该返回的返回值。

此外，Butterfly测试工具允许你将真正的B包装在模拟B中，这样模拟上的所有方法调用都被记录下来，然后转发到真正的B。这使得检查B上被调用的方法成为可能，例如，如果测试DAO，你可以将数据库连接包装在模拟中。DAO将看不出区别，并且DAO可以像往常一样从数据库读取/写入数据，因为模拟将所有调用转发到数据库。但现在你可以通过模拟检查DAO是否正确使用连接，例如，是否调用了`connection.close()`（或没有调用），如果你期望的话。这通常无法从DAO的返回值中确定。

### 适应自定义工厂接口的DI容器

依赖注入容器Butterfly容器有一个强大的功能，允许你将整个容器注入到它产生的bean中。
但是，由于你不想依赖于容器接口，容器能够适应你设计的自定义工厂接口。你只需要接口。没有实现。因此，工厂接口和你的类可能看起来像这样：

```java
public interface IMyFactory {
  Bean bean1();
  Person person();
  ...
}

public class MyAction {
  protected IMyFactory myFactory = null;

  public MyAction(IMyFactory factory) {
    this.myFactory = factory;
  }

  public void execute() {
    Bean bean = this.myFactory.bean();
    Person person = this.myFactory.person();
  }
}
```

当`MyAction`类调用通过容器注入到其构造函数中的`IMyFactory`实例的方法时，方法调用被转换为对`IContainer.instance()`方法的调用，这是你用来从容器中获取实例的方法。这样，一个对象可以在运行时使用Butterfly容器作为工厂，而不仅仅是在创建时将依赖注入到自身。而且这没有任何对任何特定Butterfly容器接口的依赖。

### 类似AOP的方法拦截

Spring框架允许你拦截对给定bean的方法调用，前提是该bean实现了某个接口。Spring框架将bean包装在动态代理中。然后所有对bean的调用都被代理拦截。代理可以决定在委托方法调用给包装的bean之前、代替或之后调用其他对象的其他方法。



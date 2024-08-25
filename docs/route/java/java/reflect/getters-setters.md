# Getters 和 Setters

使用Java反射，你可以检查类的方法并在运行时调用它们。这可以用来检测给定Java类有哪些getter和setter。你不能显式地请求getter和setter，因此你需要扫描类的所有方法，并自行检查每个方法是否是getter或setter - 通过检查方法签名是否符合你对getter或setter的期望。

首先，让我们确定一些特征规则：

- **Getter**
  - Getter方法的名称以"get"开头，不接受参数，并返回一个值。

- **Setter**
  - Setter方法的名称以"set"开头，并接受1个参数。
  - Setters可能返回值，也可能不返回。一些setter返回void，一些返回设置的值，还有一些返回调用setter的对象以用于方法链式调用。因此，你不应该对setter的返回类型做出任何假设。

以下是一个查找类中的getter和setter的代码示例：

```java
public static void printGettersSetters(Class aClass){
  Method[] methods = aClass.getMethods();

  for(Method method : methods){
    if(isGetter(method)) System.out.println("getter: " + method);
    if(isSetter(method)) System.out.println("setter: " + method);
  }
}

public static boolean isGetter(Method method){
  if(!method.getName().startsWith("get"))      return false;
  if(method.getParameterTypes().length != 0)   return false;
  if(void.class.equals(method.getReturnType())) return false;
  return true;
}

public static boolean isSetter(Method method){
  if(!method.getName().startsWith("set")) return false;
  if(method.getParameterTypes().length != 1) return false;
  return true;
}
```



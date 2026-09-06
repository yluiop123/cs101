---
title: 异常处理
---

# 第 7 章 · 异常处理

**本章目标：**

- 理解异常继承体系与 checked/unchecked 的区别
- 掌握 try-catch-finally 与 try-with-resources
- 学会自定义异常与异常的最佳实践

## 7.1 异常体系全景

Java 用**异常（exception）**统一表达"运行中出了问题"，全部继承自 `Throwable`：

```text
Throwable
├── Error               严重系统错误（OOM、栈溢出）—— 程序不处理
└── Exception
    ├── RuntimeException 运行时异常（unchecked，不强制处理）
    │   ├── NullPointerException           空指针
    │   ├── ArrayIndexOutOfBoundsException 数组越界
    │   ├── ArithmeticException            除零
    │   └── IllegalArgumentException       非法参数
    └── 其他 Exception（checked，编译器强制处理）
        ├── IOException                    IO 错误
        └── SQLException                   数据库错误
```

**checked 异常**（受检异常）：编译器强制你处理（try 或 throws），代表"可预期的外部故障"（文件不存在、网络断开）。
**unchecked 异常**（非受检）：运行时异常 + Error，多为**程序 bug**（空指针、越界）——不强制处理，但应该修代码消除。

## 7.2 try-catch：捕获与处理

```java
public class DivideDemo {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;                          // 抛出 ArithmeticException
            System.out.println("不会执行到这里");
        } catch (ArithmeticException e) {
            System.out.println("捕获：" + e.getMessage());   // / by zero
        }
        System.out.println("程序继续运行");                  // 没被异常打断
    }
}
```

多类型捕获与通用捕获：

```java
try {
    // ...
} catch (NumberFormatException e) {
    // 具体异常放前面
} catch (IllegalArgumentException | IllegalStateException e) {   // 多类型合并
    // | 联合捕获
} catch (Exception e) {                          // 兜底放最后（父类在后）
    e.printStackTrace();                         // 打印完整堆栈（排错第一现场）
}
```

**catch 顺序从具体到一般**——把 `catch (Exception)` 放最前面会拦截一切，后面的分支永远走不到（编译器直接报错）。

## 7.3 finally：无论如何都执行

```java
try {
    openFile();
    readFile();
} catch (IOException e) {
    log("读取出错");
} finally {
    closeFile();        // 无论正常结束还是异常，都会执行（释放资源）
}
```

经典用途：释放连接、解锁。**finally 里不要写 return**（会吞掉异常，是隐蔽 bug 温床）。

## 7.4 try-with-resources：现代资源管理

资源类实现了 `AutoCloseable` 接口的，用 **try-with-resources** 自动关闭（Java 7+，首选）：

```java
// 传统：finally 里手动 close（啰嗦且容易漏）
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("data.txt"));
    System.out.println(reader.readLine());
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try { reader.close(); } catch (IOException e) { /* ... */ }
    }
}

// 现代：括号里声明的资源自动关闭（即使异常也关）
try (BufferedReader reader2 = new BufferedReader(new FileReader("data.txt"))) {
    System.out.println(reader2.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

## 7.5 throws 与 throw：声明与抛出

```java
// throw：方法内主动抛出
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负: " + age);
    }
    this.age = age;
}

// throws：方法签名声明"我可能抛出 checked 异常，调用方自己处理"
public String readFile(String path) throws IOException {
    return Files.readString(Path.of(path));
}

// 调用方二选一：① 自己 try-catch ② 继续向上声明
try {
    readFile("a.txt");
} catch (IOException e) {
    log("文件读取失败");
}
```

## 7.6 自定义异常

业务系统的标准做法——语义化异常层次：

```java
// 业务异常基类（继承 RuntimeException，不强制调用方捕获）
public class BizException extends RuntimeException {
    private final int code;

    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}

// 具体业务异常
public class UserNotFoundException extends BizException {
    public UserNotFoundException(long userId) {
        super(404, "用户不存在: " + userId);
    }
}

// 使用
public User findUser(long id) {
    User user = userDao.getById(id);
    if (user == null) {
        throw new UserNotFoundException(id);
    }
    return user;
}
```

第 15 章实战与 Spring Boot 教程里，这个 BizException + 全局异常处理器组合会反复出现。

## 7.7 异常最佳实践

```text
① 能用条件判断预防的，不要靠异常控制流程（判空再取，而不是 catch NPE）
② 异常信息要有上下文（带上参数值："用户不存在: 1024"）
③ 不要吞异常：空 catch 块是重大隐患；处理不了就往上抛
④ 抛异常时保留原因链：throw new BizException("...", e)（第二参数传原始异常）
⑤ 日志记一次就够，不要"打日志 + 再抛"层层重复
```

## 7.8 综合练习：栈的 pop 安全化

```java
public class SafeStack {
    private int[] data = new int[16];
    private int size = 0;

    public void push(int value) {
        if (size == data.length) {
            throw new IllegalStateException("栈已满");
        }
        data[size++] = value;
    }

    public int pop() {
        if (size == 0) {
            throw new java.util.NoSuchElementException("栈为空");
        }
        return data[--size];
    }

    public static void main(String[] args) {
        SafeStack stack = new SafeStack();
        stack.push(1);
        stack.push(2);
        System.out.println(stack.pop());   // 2
        System.out.println(stack.pop());   // 1
        stack.pop();                       // NoSuchElementException
    }
}
```

## 本章小结

- checked 强制处理（外部故障），unchecked 多为 bug（不强制）
- try-catch 从具体到一般；finally 释放资源但别写 return
- try-with-resources 自动关闭 AutoCloseable 资源（首选）
- throw 主动抛、throws 声明；业务异常继承 RuntimeException + 语义化命名

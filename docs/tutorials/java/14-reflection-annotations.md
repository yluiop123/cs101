---
title: 反射与注解
---

# 第 14 章 · 反射与注解

**本章目标：**

- 理解反射（reflection）能做什么、何时用
- 掌握注解（annotation）的定义与读取
- 揭示 Spring 框架的魔法原理

## 14.1 反射：程序审视自己

**反射（reflection）**= 在运行时检查/操作类、方法、字段的能力：

```java
import java.lang.reflect.Method;

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        // 三种获取 Class 对象的方式
        Class<String> c1 = String.class;                    // 类字面量
        Class<?> c2 = "hello".getClass();                   // 对象获取
        Class<?> c3 = Class.forName("java.util.ArrayList"); // 全限定名（可能抛异常）

        // 检查类的结构
        System.out.println(c3.getName());        // java.util.ArrayList
        for (Method m : c1.getDeclaredMethods()) {
            System.out.println(m.getName());     // 所有方法名
        }

        // 运行时创建实例与调用方法
        Object list = c3.getDeclaredConstructor().newInstance();
        Method add = c3.getMethod("add", Object.class);
        add.invoke(list, "hello");               // 等价于 ((List)list).add("hello")
        System.out.println(list);                // [hello]
    }
}
```

## 14.2 反射的典型用途

```text
框架核心：Spring 的依赖注入、MyBatis 的 ORM 映射（第 15 章/Spring Boot 教程的基础）
序列化：JSON 库按字段名读写字段（Jackson）
测试：JUnit 通过反射找到 @Test 方法并调用
配置驱动：按类名字符串动态创建对象（插件系统）
```

代价：比直接调用慢、绕过编译期类型检查——**业务代码不写反射，框架代码才写**。

## 14.3 注解：贴在代码上的标签

**注解（annotation）**本身不含逻辑，只是"标记"，由框架在运行时通过反射读取并执行相应行为：

```java
@Deprecated                        // 标记过时（编译器警告）
@SuppressWarnings("unchecked")     // 压制警告
@Override                          // 校验重写
```

**自定义注解**三要素：注解定义 + 元注解声明用途 + 运行时反射读取：

```java
import java.lang.annotation.*;

// @Retention：注解存活到什么时候（RUNTIME = 运行时可反射读取）
// @Target：能贴在哪里（METHOD = 方法上）
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Schedule {
    int intervalSeconds();                 // 注解属性（带默认值用 default 5）
    String taskName() default "未命名任务";
}

// 使用：贴注解
public class Tasks {
    @Schedule(intervalSeconds = 60, taskName = "清理过期会话")
    public void cleanSessions() { ... }

    @Schedule(intervalSeconds = 300)
    public void syncData() { ... }
}
```

## 14.4 读取注解：框架的核心循环

```java
import java.lang.reflect.Method;

public class Scheduler {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Tasks.class;

        for (Method method : clazz.getDeclaredMethods()) {
            Schedule schedule = method.getAnnotation(Schedule.class);   // 读注解
            if (schedule == null) continue;                             // 没贴注解的方法跳过

            System.out.printf("注册任务：%s，每 %d 秒执行%n",
                    schedule.taskName(), schedule.intervalSeconds());

            Object instance = clazz.getDeclaredConstructor().newInstance();
            method.invoke(instance);        // 通过反射执行
        }
    }
}
```

**这就是全部魔法**：定义注解 → 框架启动时扫描反射 → 读到注解就执行配套逻辑。Spring 的 `@Component`（自动注册 Bean）、`@Autowired`（自动注入）、JUnit 的 `@Test`（自动执行测试）都是这一个模式的变体。

## 14.5 注解在框架中的常见形态

```java
// Spring（第 15 章/Spring Boot 预告）
@Component                 // "把我注册成 Bean"
@Autowired                 // "帮我注入依赖"

// Spring Boot 的参数校验
public record CreateUser(
    @NotBlank String name,
    @Email String email,
    @Min(18) int age
) {}

// JUnit
@Test
void 计算正确() { assertEquals(4, add(2, 2)); }
```

学会"读懂注解的意图"比"手写反射"重要一百倍——业务开发中你消费注解、框架消费你的注解。

## 14.6 注解处理器小实战：模拟迷你路由

```java
import java.lang.annotation.*;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Route {
    String path();
}

public class MiniRouter {
    private final Map<String, Method> routes = new HashMap<>();
    private final Object controller;

    public MiniRouter(Object controller) throws Exception {
        this.controller = controller;
        // 启动时扫描：收集所有 @Route 方法
        for (Method m : controller.getClass().getDeclaredMethods()) {
            Route route = m.getAnnotation(Route.class);
            if (route != null) {
                routes.put(route.path(), m);
            }
        }
    }

    public void handle(String path) throws Exception {
        Method m = routes.get(path);
        if (m == null) {
            System.out.println("404 Not Found");
            return;
        }
        m.invoke(controller);
    }
}

public class HomeController {
    @Route(path = "/home")
    public void home() { System.out.println("欢迎来到首页"); }

    @Route(path = "/about")
    public void about() { System.out.println("关于我们"); }
}

// 使用
MiniRouter router = new MiniRouter(new HomeController());
router.handle("/home");    // 欢迎来到首页
router.handle("/xxx");     // 404 Not Found
```

50 行代码的 Web 路由雏形——Spring MVC 的路由分发就是它的企业级放大版。

## 本章小结

- 反射：运行时检查/创建/调用，是框架的地基，业务代码慎用
- 注解 = 标记 + 元注解声明（@Retention RUNTIME / @Target）
- 框架魔法 = 扫描反射读注解 + 按注解执行行为
- `getAnnotation`/`invoke` 两个方法读懂一半框架源码

---
title: Maven、JVM 入门与综合实战
---

# 第 15 章 · Maven、JVM 入门与综合实战

**本章目标：**

- 掌握 Maven 依赖管理与项目结构
- 建立 JVM 内存模型与 GC 的基础认知
- 综合运用全教程知识完成"待办服务"（命令行版）

## 15.1 Maven：依赖管理与构建标准

手装 jar 包的时代已经过去——**Maven** 用一个 XML 声明依赖，其余自动下载：

```xml
<!-- pom.xml：项目说明书 -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.cs101</groupId>          <!-- 组织倒写域名 -->
    <artifactId>todo-service</artifactId> <!-- 项目名 -->
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- 一个 dependency 一行，坐标唯一确定一个库 -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>
</project>
```

```bash
mvn clean package     # 编译 + 测试 + 打包（target/*.jar）
mvn test              # 只跑测试
```

**标准目录结构**（约定即配置，Maven 项目长得都一样）：

```text
todo-service/
├── pom.xml
└── src/
    ├── main/java/com/cs101/...     # 源码（包路径=目录路径）
    ├── main/resources/             # 配置文件
    └── test/java/com/cs101/...     # 测试
```

IDEA 新建项目选 Maven 即可生成骨架——从今天起告别"手动复制 jar 到 classpath"。

## 15.2 JVM 内存模型入门

```text
┌─ JVM 运行时数据区 ─────────────────────┐
│ 线程私有：                              │
│   虚拟机栈   方法调用帧（局部变量、栈深度）│
│   程序计数器 当前执行位置                 │
│ 线程共享：                              │
│   堆（Heap）    对象的家，GC 主战场       │
│   方法区        类信息、常量、静态字段     │
└────────────────────────────────────────┘
```

每个 Java 开发者都会遇到的两类错误：

```java
// ① StackOverflowError：栈溢出 = 递归没有终止条件
public static void bad() { bad(); }      // 无限递归 → 栈帧打爆

// ② OutOfMemoryError: Java heap space：堆溢出 = 对象只进不出
List<byte[]> leak = new ArrayList<>();
while (true) {
    leak.add(new byte[1024 * 1024]);      // 每秒 1MB，堆积成山
}
```

::: info GC 的基本直觉
堆里的对象没有引用指向它时，GC 在合适时机回收。**内存泄漏 = 对象已无用但仍被引用**（static 集合只加不减是最常见肇因）。GC 参数调优是进阶课题，入门阶段记住"别让长生命周期集合短命对象"即可。
:::

## 15.3 综合实战：待办服务（命令行版）

整合 15 章所学，实现一个 JSON 持久化的待办服务：

```text
功能：add / list / done / del / quit
技术点：record 数据模型（第 4 章）、集合与 Stream（第 9 章）、
        异常体系（第 7 章）、Gson JSON 持久化（第 11 章思路 + Maven 依赖）、
        注解驱动的命令路由（第 14 章模式）
```

### 项目结构

```text
todo-service/
├── pom.xml                    # Gson 依赖
└── src/main/java/com/cs101/todo/
    ├── Main.java              # 入口 + 命令循环
    ├── Task.java              # 数据模型
    ├── TaskService.java       # 业务逻辑 + 持久化
    └── CommandException.java  # 业务异常
```

### 数据模型与异常

```java
// Task.java —— record 纯数据 + 业务方法
package com.cs101.todo;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record Task(long id, String text, boolean done, LocalDateTime createdAt) {
    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("MM-dd HH:mm");

    public Task {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("任务内容不能为空");
        }
    }

    public String display() {
        return "[%s] #%d %s（%s）".formatted(
                done ? "x" : " ", id, text, createdAt.format(FMT));
    }
}
```

```java
// CommandException.java —— 语义化业务异常（第 7 章）
package com.cs101.todo;

public class CommandException extends RuntimeException {
    public CommandException(String message) {
        super(message);
    }
}
```

### 业务层

```java
// TaskService.java —— 集合 + Stream + JSON 持久化
package com.cs101.todo;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.nio.file.Files;
import java.nio.file.Path;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

public class TaskService {
    private static final Path STORE = Path.of("tasks.json");
    private static final Gson GSON = new Gson();
    private static final Type TYPE = new TypeToken<List<Task>>() {}.getType();

    private List<Task> tasks = new ArrayList<>();
    private long nextId = 1;

    public TaskService() {
        load();
    }

    // JSON 文件恢复（第 11 章 Files API）
    private void load() {
        try {
            if (Files.exists(STORE)) {
                tasks = GSON.fromJson(Files.readString(STORE), TYPE);
                nextId = tasks.stream().mapToLong(Task::id).max().orElse(0) + 1;
            }
        } catch (Exception e) {
            System.out.println("存档损坏，从空白开始");
        }
    }

    private void save() {
        try {
            Files.writeString(STORE, GSON.toJson(tasks));
        } catch (Exception e) {
            throw new CommandException("保存失败：" + e.getMessage());
        }
    }

    public Task add(String text) {
        Task task = new Task(nextId++, text, false, LocalDateTime.now());
        tasks.add(task);
        save();
        return task;
    }

    public List<Task> listAll() {
        return tasks.stream()
                .sorted(Comparator.comparing(Task::createdAt).reversed())
                .toList();
    }

    public Task markDone(long id) {
        Optional<Task> found = tasks.stream().filter(t -> t.id() == id).findFirst();
        if (found.isEmpty()) {
            throw new CommandException("任务 #" + id + " 不存在");
        }
        Task old = found.get();
        Task updated = new Task(old.id(), old.text(), true, old.createdAt());
        tasks.set(tasks.indexOf(old), updated);
        save();
        return updated;
    }

    public void remove(long id) {
        boolean removed = tasks.removeIf(t -> t.id() == id);
        if (!removed) {
            throw new CommandException("任务 #" + id + " 不存在");
        }
        save();
    }
}
```

### 入口与命令分发

```java
// Main.java —— 命令解析 + 异常兜底
package com.cs101.todo;

import java.util.Scanner;

public class Main {
    private static final TaskService service = new TaskService();

    public static void main(String[] args) {
        System.out.println("待办服务（add/list/done/del/quit）");

        try (Scanner scanner = new Scanner(System.in)) {   // try-with-resources
            while (true) {
                System.out.print("> ");
                String line = scanner.nextLine().trim();
                try {
                    if (line.isBlank()) continue;
                    if (line.equals("quit")) break;

                    dispatch(line);
                } catch (CommandException e) {
                    System.out.println("✗ " + e.getMessage());   // 业务错误友好提示
                } catch (Exception e) {
                    System.out.println("程序异常：" + e);
                }
            }
        }
        System.out.println("再见！");
    }

    private static void dispatch(String line) {
        String[] parts = line.split("\\s+", 2);
        String cmd = parts[0];
        String arg = parts.length > 1 ? parts[1] : "";

        switch (cmd) {
            case "add" -> {
                Task task = service.add(arg);
                System.out.println("✓ 已添加 #" + task.id());
            }
            case "list" -> service.listAll()
                    .forEach(t -> System.out.println(t.display()));
            case "done" -> {
                Task task = service.markDone(Long.parseLong(arg));
                System.out.println("✓ 已完成 " + task.text());
            }
            case "del" -> {
                service.remove(Long.parseLong(arg));
                System.out.println("✓ 已删除 #" + arg);
            }
            default -> throw new CommandException("未知命令：" + cmd);
        }
    }
}
```

### 运行效果

```text
> add 学完 Java 教程
✓ 已添加 #1
> add 复习集合框架
✓ 已添加 #2
> list
[ ] #2 复习集合框架（09-06 16:40）
[ ] #1 学完 Java 教程（09-06 16:40）
> done 1
✓ 已完成 学完 Java 教程
> badcmd
✗ 未知命令：badcmd
```

重启程序后任务还在（tasks.json 持久化）——这就是一个"能落地的最小服务"，第 15 章收官。

## 15.4 自查清单

- [ ] record 建模 + 紧凑构造器校验（第 4 章）
- [ ] 业务异常语义化、入口统一 catch（第 7 章）
- [ ] Stream 排序/查找、集合操作无越界（第 9 章）
- [ ] Files + Gson 持久化，启动恢复（第 11 章）
- [ ] Maven 结构：包路径 = 目录路径（本章）

## 15.5 下一步

Java 主线毕业。接着写后端批次 1 的下一门语言：

- Python 教程：脚本利器 + 数据科学入口（编写中）
- 回到 Java：Spring Boot 教程（批次 2，依赖 SQL/MySQL 先行）

## 本章小结

- Maven 管依赖定结构：pom.xml + 标准目录 + 包路径即目录
- JVM 内存：栈（调用帧）、堆（对象+GC）；两类 Error 对应两类失控
- 实战串联：record 建模、Stream 处理、异常兜底、JSON 持久化、命令分发
- 注解+反射的思想已在你亲手写的 dispatch 里萌芽

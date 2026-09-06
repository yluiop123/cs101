---
title: 初识 Java
---

# 第 1 章 · 初识 Java

**本章目标：**

- 理解 Java 的"一次编写，到处运行"靠什么实现
- 分清 JDK / JRE / JVM 三者关系
- 装好环境，跑通第一个程序

## 1.1 Java 是什么

Java 由 Sun 公司（后并入 Oracle）于 1995 年发布，至今仍是**企业级后端的第一语言**：国内大厂的服务端、Android 应用、大数据生态（Hadoop、Flink、Kafka）都以 Java 为基石。

它的核心卖点是**跨平台**：

```text
一次编写，到处运行（Write Once, Run Anywhere）
```

为什么能做到？关键在 **JVM（Java Virtual Machine，Java 虚拟机）**——每种操作系统都有自己的 JVM 实现，而你的代码只面向 JVM 编写。类比：把你的代码看成"世界语"，JVM 是各国派驻的翻译。

## 1.2 编译执行模型：先编译，再由 JVM 运行

```text
HelloWorld.java（源码，人写的）
   ↓  javac 编译器
HelloWorld.class（字节码 bytecode，JVM 的"机器码"）
   ↓  java 命令启动 JVM
操作系统上运行
```

与 JS/Python 的"解释执行"不同，Java 是**编译型语言**——但编译产物不是机器码，而是字节码，由 JVM 在运行时再翻译成对应平台的机器指令。这一层抽象带来了两个收益：跨平台 + JVM 级优化（JIT 即时编译、GC 垃圾回收，第 15 章细讲）。

::: info GC：自动内存管理
Java 有**垃圾回收（Garbage Collection，GC）**机制——不再使用的对象由 JVM 自动回收，你不需要像 C 语言那样手动 free。这是 Java 体验友好的一大原因。
:::

## 1.3 JDK / JRE / JVM 的关系

```text
JDK（Java Development Kit，开发工具包）
  └── JRE（Java Runtime Environment，运行环境）
        └── JVM（Java 虚拟机）+ 核心类库
  + 编译器 javac、调试器、jconsole 等开发工具
```

一句话：**写代码装 JDK，只跑代码装 JRE**——开发阶段一律装 JDK。本教程基于 **JDK 21（LTS 长期支持版）**，语法向下兼容 17（企业主流版本）。

安装（推荐开源发行版 Eclipse Temurin，或 Oracle 官网 JDK）：

```bash
# 安装后验证
java -version    # 输出 openjdk version "21.x"
javac -version   # javac 21.x（编译器也在，说明 JDK 装对了）
```

::: tip 编辑器选择
- **IntelliJ IDEA Community**（免费社区版）：Java 开发的事实标准，智能提示最强
- **VS Code + Extension Pack for Java 扩展**：轻量，已装 VS Code 的可以沿用
两者都能胜任本教程，选顺手的即可。
:::

## 1.4 第一个程序

```java
// HelloWorld.java —— 文件名必须与 public 类名一致！
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

编译并运行：

```bash
javac HelloWorld.java    # 生成 HelloWorld.class（字节码）
java HelloWorld          # 启动 JVM 执行（注意：不带 .class 后缀）
# Hello, Java!
```

逐个拆解这行 main 方法——它包含了好几个后面章节才展开的概念，先记住固定写法：

```text
public class HelloWorld   类（class）：Java 代码的最小组织单位，文件名=public 类名
public static void main   程序入口：JVM 从这里开始执行（static/void 含义见第 4 章）
String[] args             命令行参数（字符串数组）
System.out.println(...)   标准输出打印一行
```

::: tip JDK 11+ 单文件直跑
```bash
java HelloWorld.java   # 跳过手动编译，直接执行（内部自动编译）
```
写练习时很方便；正式项目仍走 javac/Maven 流程。
:::

## 1.5 Java 的版本策略

Java 每 6 个月发布一个新版本，但只有 **LTS（Long-Term Support，长期支持）**版本适合生产：8 → 11 → 17 → 21 → 25。企业新项目多用 17/21，老系统大量停留在 8——**看懂老代码 + 用新语法写新代码**是 Java 工程师的日常，本教程会标注"现代写法"与"传统写法"的差异。

## 1.6 动手：改出你自己的输出

```java
public class Profile {
    public static void main(String[] args) {
        System.out.println("昵称：CS101 学习者");
        System.out.println("目标：Java 后端");
        System.out.println("本周任务：学完前 3 章");
    }
}
```

用 `javac Profile.java && java Profile` 跑通它——环境搭好了，语法之旅开始。

## 本章小结

- JVM 让字节码跨平台；编译型但带 GC 自动内存管理
- JDK ⊃ JRE ⊃ JVM；开发装 JDK 21 LTS
- 文件名必须等于 public 类名；main 方法是入口
- `javac` 编译、`java` 运行；单文件可 `java Xxx.java` 直跑

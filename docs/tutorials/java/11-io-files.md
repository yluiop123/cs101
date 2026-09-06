---
title: IO 与文件
---

# 第 11 章 · IO 与文件

**本章目标：**

- 掌握 Files/Paths 现代文件操作（首选）
- 理解字节流与字符流的分工
- 会用缓冲流与序列化

## 11.1 两种姿势：旧流 vs 现代工具

Java IO 有两套 API：

```text
java.io 流（stream）：InputStream/OutputStream/Reader/Writer —— 灵活但样板多
java.nio.file.Files：现代工具类 —— 一行搞定常见操作（日常首选）
```

## 11.2 Files + Path：现代文件操作

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

Path path = Path.of("data/hello.txt");

// 写（自动创建；UTF-8 默认）
Files.writeString(path, "Hello, Java IO!\n第二行内容");

// 读
String content = Files.readString(path);
System.out.println(content);

// 按行读
List<String> lines = Files.readAllLines(path);

// 判存在、删、复制、移动
Files.exists(path);
Files.delete(path);
Files.copy(Path.of("a.txt"), Path.of("b.txt"));
Files.move(Path.of("a.txt"), Path.of("c.txt"));

// 创建目录与遍历
Files.createDirectories(Path.of("data/logs"));
try (var walk = Files.walk(Path.of("data"))) {
    walk.filter(Files::isRegularFile)
        .forEach(System.out::println);
}
```

所有这些方法都抛 **checked 异常 IOException**（第 7 章）——注意 try-catch 或继续上抛。

## 11.3 字节流与字符流

```text
字节流（8 位）：InputStream / OutputStream —— 万物皆可（图片、视频、二进制）
字符流（16 位）：Reader / Writer —— 专用于文本（自动处理字符编码）
```

字节流读二进制：

```java
byte[] bytes = Files.readAllBytes(Path.of("avatar.png"));    // 一次性读全文件

// 大文件流式处理：InputStream 一段段读
try (InputStream in = new FileInputStream("big-video.mp4")) {
    byte[] buffer = new byte[8192];               // 8KB 缓冲
    int len;
    while ((len = in.read(buffer)) != -1) {       // -1 表示读完
        // 处理 buffer[0..len)
    }
}
```

字符流读文本：

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("log.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {   // 逐行读
        System.out.println(line);
    }
}

try (BufferedWriter writer = Files.newBufferedWriter(
        Path.of("out.txt"),
        StandardCharsets.UTF_8,
        StandardOpenOption.APPEND)) {               // 追加模式
    writer.write("新的一行");
    writer.newLine();
}
```

::: info 缓冲流为什么快
每次 read 都可能触发一次磁盘/网络 IO；`BufferedReader/BufferedWriter` 内置缓冲区，攒一批再传输——**逐行读文本的标准姿势**（第 12 章的日志分析实战会用到）。
:::

## 11.4 编码：字符与字节的翻译官

```text
UTF-8：互联网标准，变长 1~4 字节，中文 3 字节（默认首选）
GBK：国内老系统遗留，中文 2 字节
```

```java
// 读老系统文件（GBK 编码）
String text = Files.readString(Path.of("old.txt"), Charset.forName("GBK"));

// 统一约定：项目内文件一律 UTF-8，仅在对接遗留系统时显式指定其他编码
```

乱码 = 编码与解码不一致。"读出来是乱码"排查三板斧：确认源文件编码 → 读时显式指定 → IDE/终端同步设置。

## 11.5 序列化：对象与字节

**序列化（serialization）**：对象 → 字节流（存盘/网络传输）；反序列化反之：

```java
public class User implements Serializable {     // 标记接口：允许被序列化
    private static final long serialVersionUID = 1L;   // 版本号（类变更时手动升级）
    private String name;
    private transient String password;          // transient：不参与序列化（敏感字段）
    // 构造器/getter 略
}

// JDK 原生序列化（了解即可）
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("user.bin"))) {
    out.writeObject(new User("Tom"));
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("user.bin"))) {
    User user = (User) in.readObject();
}
```

::: warning 实际项目用 JSON
JDK 原生序列化有安全隐患（反序列化漏洞）且不可跨语言——**工程实践一律 JSON**（Jackson 库，Spring Boot 教程的默认武器）。理解原生序列化是为了读懂老代码。
:::

## 11.6 Properties：配置文件标准

```properties
# config.properties
db.url=jdbc:mysql://localhost:3306/app
db.user=root
db.password=123456
```

```java
Properties props = new Properties();
props.load(Files.newInputStream(Path.of("config.properties")));

String url = props.getProperty("db.url");
props.getProperty("db.pool.size", "10");     // 第二参数：默认值
```

key=value 格式的配置文件 + Properties 读取——最朴素的"配置与代码分离"，第 15 章实战沿用此思路。

## 11.7 综合练习：日志文件分析器

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class LogAnalyzer {
    public static void main(String[] args) throws IOException {
        // 日志行示例：2026-09-06 14:30:01 INFO User login success
        Path logFile = Path.of("app.log");

        try (Stream<String> lines = Files.lines(logFile)) {     // 流式逐行（大文件友好）
            Map<String, Long> levelCounts = lines
                    .filter(line -> line.contains(" "))
                    .map(line -> line.split(" ")[2])            // 取级别字段
                    .collect(Collectors.groupingBy(
                        level -> level,
                        Collectors.counting()));

            System.out.println(levelCounts);   // {INFO=120, WARN=8, ERROR=2}
        }

        // 找出所有 ERROR 行
        List<String> errors = Files.readAllLines(logFile).stream()
                .filter(line -> line.contains("ERROR"))
                .toList();
        errors.forEach(System.out::println);
    }
}
```

Files.lines 流式读取（不一次载入内存）+ Stream 过滤分组——真实后端排错的日常操作。

## 本章小结

- 首选 Files/Path：writeString/readString/readAllLines 一行搞定
- 字节流管二进制、字符流管文本；大文件流式处理
- 编码统一 UTF-8，对接遗留系统显式指定
- 序列化工程实践用 JSON；Properties 读 key=value 配置

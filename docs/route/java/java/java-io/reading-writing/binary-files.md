# 读写二进制文件

## 读写二进制文件

### 使用流 I/O 读取文件
要打开一个文件进行读取，可以使用`newInputStream(Path, OpenOption...)`方法。该方法返回一个未缓冲的输入流，用于从文件中读取字节。
```java
Path file =...; 
try (InputStream in = Files.newInputStream(file); 
    BufferedReader reader = 
      new BufferedReader(new InputStreamReader(in))) { 
    String line = null; 
    while ((line = reader.readLine())!= null) { 
        System.out.println(line); 
    }
} catch (IOException x) { 
    System.err.println(x); 
} 
```

### 使用流 I/O 创建和写入文件
您可以使用`newOutputStream(Path, OpenOption...)`方法创建、追加或写入文件。该方法打开或创建一个文件用于写入字节，并返回一个未缓冲的输出流。
该方法接受一个可选的`OpenOption`参数。如果未指定任何打开选项，并且文件不存在，则创建一个新文件。如果文件存在，则将其截断。此选项等同于使用`CREATE`和`TRUNCATE_EXISTING`选项调用该方法。
以下示例打开一个日志文件。如果文件不存在，则创建它。如果文件存在，则打开以进行追加。
```java
import static java.nio.file.StandardOpenOption.*; 
import java.nio.file.*;
import java.io.*; 

public class LogFileTest { 

  public static void main(String[] args) { 

    // 将字符串转换为字节数组。
    String s = "Hello World! "; 
    byte data[] = s.getBytes(); 
    Path p = Paths.get("./logfile.txt"); 

    try (OutputStream out = new BufferedOutputStream( 
      Files.newOutputStream(p, CREATE, APPEND))) { 
      out.write(data, 0, data.length); 
    } catch (IOException x) { 
      System.err.println(x); 
    } 
  }
} 
```

### 使用通道 I/O 读写文件
虽然流 I/O 一次读取一个字符，但通道 I/O 一次读取一个缓冲区。`ByteChannel`接口提供基本的读写功能。`SeekableByteChannel`是一个`ByteChannel`，它能够在通道中维护一个位置并更改该位置。`SeekableByteChannel`还支持截断与通道关联的文件并查询文件的大小。
能够移动到文件中的不同点，然后从该位置读取或写入，使得文件的随机访问成为可能。有关更多信息，请参阅“随机访问文件”部分。
有两种用于读写通道 I/O 的方法。
- `newByteChannel(Path, OpenOption...)`
- `newByteChannel(Path, Set<? extends OpenOption>, FileAttribute<?>...)`
注意：`newByteChannel()`方法返回一个`SeekableByteChannel`的实例。在默认文件系统上，您可以将此可寻址字节通道转换为`FileChannel`，以访问更高级的功能，例如将文件的区域直接映射到内存中以加快访问速度、锁定文件的区域以防止其他进程访问它，或从绝对位置读取和写入字节而不影响通道的当前位置。
两个`newByteChannel()`方法都允许您指定一个`OpenOption`选项列表。除了一个额外的选项外，还支持`newOutputStream()`方法使用的相同打开选项：`READ`是必需的，因为`SeekableByteChannel`支持读写。
指定`READ`打开通道进行读取。指定`WRITE`或`APPEND`打开通道进行写入。如果未指定这些选项中的任何一个，则通道将打开以进行读取。
以下代码片段读取一个文件并将其打印到标准输出：
```java
public static void readFile(Path path) throws IOException { 

    // Files.newByteChannel() 默认使用 StandardOpenOption.READ 
    try (SeekableByteChannel sbc = Files.newByteChannel(path)) { 
        final int BUFFER_CAPACITY = 10; 
        ByteBuffer buf = ByteBuffer.allocate(BUFFER_CAPACITY); 

        // 使用此平台的正确编码读取字节。如果跳过此步骤，您可能会看到外来或难以辨认的字符。
        String encoding = System.getProperty("file.encoding"); 
        while (sbc.read(buf) > 0) { 
            buf.flip(); 
            System.out.print(Charset.forName(encoding).decode(buf)); 
            buf.clear(); 
        } 
    }
} 
```
以下示例为 UNIX 和其他 POSIX 文件系统编写，创建一个具有特定文件权限集的日志文件。此代码创建一个日志文件，如果该日志文件已存在，则追加到该日志文件。该日志文件创建为主人具有读写权限，组具有只读权限。
```java
import static java.nio.file.StandardOpenOption.*; 
import java.nio.*;
import java.nio.channels.*; 
import java.nio.file.*;
import java.nio.file.attribute.*;
import java.io.*; 
import java.util.*; 

public class LogFilePermissionsTest { 

  public static void main(String[] args) { 

    // 创建用于追加到文件的选项集。
    Set<OpenOption> options = new HashSet<OpenOption>(); 
    options.add(APPEND); 
    options.add(CREATE); 

    // 创建自定义权限属性。
    Set<PosixFilePermission> perms = 
      PosixFilePermissions.fromString("rw-r-----"); 
    FileAttribute<Set<PosixFilePermission>> attr = 
      PosixFilePermissions.asFileAttribute(perms); 

    // 将字符串转换为 ByteBuffer。
    String s = "Hello World! "; 
    byte data[] = s.getBytes(); 
    ByteBuffer bb = ByteBuffer.wrap(data); 

    Path file = Paths.get("./permissions.log"); 

    try (SeekableByteChannel sbc = 
      Files.newByteChannel(file, options, attr)) { 
      sbc.write(bb); 
    } catch (IOException x) { 
      System.out.println("Exception thrown: " + x); 
    } 
  }
} 
```
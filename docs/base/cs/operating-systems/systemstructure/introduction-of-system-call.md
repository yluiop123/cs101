# 系统调用简介

**系统调用** 是计算机程序请求其执行的操作系统内核提供服务的程序化方法。系统调用是程序与**操作系统**交互的一种方式。当计算机程序请求操作系统内核时，会进行系统调用。

系统调用通过应用程序编程接口（API）将操作系统的服务提供给用户程序。它提供了一个进程和操作系统之间的接口，允许用户级进程请求操作系统的服务。系统调用是进入内核系统的唯一入口点。所有需要资源的程序都必须使用系统调用。

## 什么是系统调用？

系统调用是程序用来请求操作系统（OS）服务的机制。简单来说，它是程序与底层系统交互的一种方式，例如访问硬件资源或执行特权操作。

用户程序可以通过系统调用来与操作系统交互。程序请求许多服务，操作系统通过启动许多系统调用来满足请求。系统调用可以用高级语言如 C 或 Pascal 或汇编语言编写。如果使用高级语言，操作系统可以直接调用系统调用，这些是预定义的函数。

当程序执行特定指令时，会启动系统调用，该指令触发切换到内核模式，允许程序从操作系统请求服务。然后操作系统处理请求，执行必要的操作，并将结果返回给程序。

系统调用对于操作系统的正常运行至关重要，因为它们为程序提供了访问系统资源的标准化方式。没有系统调用，每个程序都需要实现其访问硬件和系统服务的方法，导致不一致和容易出错的行为。

## 系统调用提供的服务

- 进程创建和管理
- 主存管理
- 文件访问、目录和文件系统管理
- 设备处理（I/O）
- 保护
- 网络等
  - **进程控制**：结束、中止、创建、终止、分配和释放内存。
  - **文件管理**：创建、打开、关闭、删除、读取文件等。
  - **设备管理**
  - **信息维护**
  - **通信**

## 系统调用的特性

- **接口**：系统调用提供了用户程序和操作系统之间明确定义的接口。程序通过调用特定函数提出请求，操作系统通过执行请求的服务并返回结果来响应。
- **保护**：系统调用用于访问对普通用户程序不可用的特权操作。操作系统使用此权限来保护系统免受恶意或未经授权的访问。
- **内核模式**：当进行系统调用时，程序会从用户模式暂时切换到内核模式。在内核模式下，程序可以访问所有系统资源，包括硬件、内存和其他进程。
- **上下文切换**：系统调用需要上下文切换，这涉及保存当前进程的状态并切换到内核模式以执行请求的服务。这可能会引入开销，从而影响系统性能。
- **错误处理**：系统调用可以返回错误代码以指示请求服务的问题。程序必须检查这些错误并适当处理。
- **同步**：系统调用可用于同步对共享资源的访问，例如文件或网络连接。操作系统提供同步机制，如锁或信号量，以确保多个程序可以安全地访问这些资源。

## 系统调用如何工作？

以下是系统调用工作的详细逐步解释：

- **用户需要特殊资源**：有时程序需要做一些特殊的事情，这些事情没有操作系统的许可是无法完成的，例如从文件中读取、写入文件、从硬件获取任何信息或请求内存空间。
- **程序发出系统调用请求**：有特殊的预定义指令来向操作系统发出请求。这些指令不过是“系统调用”。程序在需要时在其代码中使用这些系统调用。
- **操作系统看到系统调用**：当操作系统看到系统调用时，它认识到程序此时需要帮助，因此它暂时停止程序执行，并将所有控制权交给自身称为“内核”的特殊部分。现在“内核”解决了程序的需求。
- **操作系统执行操作**：现在操作系统执行程序请求的操作。例如：从文件中读取内容等。
- **操作系统将控制权交还给程序**：在执行特殊操作后，操作系统将控制权交还给程序以进一步执行程序。

## 系统调用在 Windows 和 Unix 中的示例

Windows 和 Unix 的系统调用有多种形式。如下表所示：

| 进程 | Windows | Unix |
| --- | --- | --- |
| 进程控制 | CreateProcess()<br>ExitProcess()<br>WaitForSingleObject() | Fork()<br>Exit()<br>Wait() |
| 文件操作 | CreateFile()<br>ReadFile()<br>WriteFile() | Open()<br>Read()<br>Write()<br>Close() |
| 设备管理 | SetConsoleMode()<br>ReadConsole()<br>WriteConsole() | Ioctl()<br>Read()<br>Write() |
| 信息维护 | GetCurrentProcessID()<br>SetTimer()<br>Sleep() | Getpid()<br>Alarm()<br>Sleep() |
| 通信 | CreatePipe()<br>CreateFileMapping()<br>MapViewOfFile() | Pipe()<br>Shmget()<br>Mmap() |
| 保护 | SetFileSecurity()<br>InitializeSecurityDescriptor()<br>SetSecurityDescriptorgroup() | Chmod() <br>Umask()<br>Chown() |

**Open()**：使用 open() 系统调用可以在文件系统中访问文件。它为文件提供了所需的资源和进程可以使用的句柄。可以由多个进程同时打开文件，或者只由一个进程打开。一切都基于结构和文件系统。

**Read()**：使用它从文件系统中的文件中检索数据。通常，它接受三个参数：

- 文件的描述。
- 用于存储读取数据的缓冲区。
- 应从文件中读取的字节数

在读取之前，可以通过其文件描述符识别要读取的文件，并使用 open() 函数打开。

**Wait()**：在某些系统中，一个进程可能需要在继续执行之前等待另一个进程完成。当父进程创建子进程时，父进程的执行会暂停，直到子进程完成。父进程使用 wait() 系统调用停止。子进程完成后，父进程重新获得控制权。

**Write()**：使用它将用户缓冲区中的数据写入设备，如文件。程序可以通过使用此系统调用以一种方式生成数据。通常，有三个参数：

- 文件的描述。
- 存储数据的缓冲区的引用。
- 将从缓冲区写入的字节数。

**Fork()**：fork() 系统调用用于进程创建副本。它是操作系统中用于创建进程的最常用的方法之一。当父进程创建子进程时，父进程的执行会暂停，直到子进程完成。子进程完成后，父进程重新获得控制权。

**Exit()**：exit() 系统调用用于终止程序。在具有多个线程的环境中，此调用表明线程执行已完成。在使用 exit() 系统函数后，操作系统会回收进程使用的资源。

## 向操作系统传递参数的方法

如果发生系统调用，我们需要向操作系统的内核部分传递参数。

例如，看看给定的 **open()** 系统调用：

```c
// 函数调用示例
#include <fcntl.h>
int open(const char *pathname, int flags, mode_t mode);
```

这里的 **pathname**、**flags** 和 **mode_t** 是参数。

因此需要注意的是：

- 我们不能像普通函数调用那样直接传递参数。
- 在内核模式中，执行函数调用有不同的方式。

所以我们不能在进程已经创建的正常地址空间中运行它，因此我们不能将参数放在栈的顶部，因为它对操作系统的内核来说在处理时不可用。所以我们必须采用其他方法将参数传递给操作系统的内核。

**我们可以通过以下方式完成它，**

- **在寄存器中传递参数**
- **将块的地址作为参数传递给寄存器。**
- **将参数推入栈中。**

让我们详细讨论每个要点：

### 1. 在寄存器中传递参数

- 这是三种方法中最简单的
- 我们直接将参数传递给寄存器。
- 但如果参数的数量大于寄存器的数量，它将受到限制。
- 这里是 C 程序代码：

```c
// 在寄存器中传递参数。
#include <fcntl.h>
#include <stdio.h>
int main()
{
    const char* pathname = "example.txt";
    int flags = O_RDONLY;
    mode_t mode = 0644;
    int fd = open(pathname, flags, mode);
    // 在函数调用 open() 中，我们将参数 pathanme,flags,mode 直接传递给内核
    if (fd == -1) {
        perror("Error opening file");
        return 1;
    }
    // 文件操作在这里...
    close(fd);
    return 0;
}
```

### 2. 将块的地址作为参数传递

- 当参数的数量大于寄存器的数量时，可以应用它。
- 参数存储在块或表中。
- 将块的地址作为参数传递给寄存器。
- 在 Linux 和 Solaris 中最常用。
- 这里是 C 程序代码：

```c
// 将块的地址作为参数传递
#include <stdio.h>
#include <fcntl.h>
int main() {
    const char *pathname = "example.txt";
    int flags = O_RDONLY;
    mode_t mode = 0644;
    int params[3];
    // 数组中的数据块（参数）
    params[0] = (int)pathname;
    params[1] = flags;
    params[2] = mode;
    int fd = syscall(SYS_open, params);
    // 系统调用
    if (fd == -1) {
        perror("Error opening file");
        return 1;
    }
    // 文件操作在这里...
    close(fd);
    return 0;
}
```

### 3. 将参数推入栈中

- 在这种方法中，参数可以使用程序推入，并使用操作系统弹出
- 因此，内核可以通过从栈顶检索信息轻松访问数据。
- 这里是 C 程序代码

```c
// 将参数推入栈中
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
int main() {
    const char *pathname = "example.txt";
    int flags = O_RDONLY;
    mode_t mode = 0644;
    int fd;
    asm volatile(
        "mov %1, %%rdi\n"
        "mov %2, %%rsi\n"
        "mov %3, %%rdx\n"
        "mov $2, %%rax\n"
        "syscall"
        : "=a" (fd)
        : "r" (pathname), "r" (flags), "r" (mode)
        : "%rdi", "%rsi", "%rdx"
    );
    if (fd == -1) {
        perror("Error opening file");
        return 1;
    }
    // 文件操作在这里...
    close(fd);
    return 0;
}
```

## 系统调用的优点

- **访问硬件资源**：系统调用允许程序访问如磁盘驱动器、打印机和网络设备等硬件资源。
- **内存管理**：系统调用为程序提供了分配和释放内存以及访问内存映射硬件设备的方法。
- **进程管理**：系统调用允许程序创建和终止进程，以及管理进程间通信。
- **安全性**：系统调用提供了一种访问特权资源的方法，例如修改系统设置或执行需要管理权限的操作。
- **标准化**：系统调用为程序与操作系统交互提供了标准化的接口，确保了不同硬件平台和操作系统版本之间的一致性和兼容性。

## 系统调用的缺点

- **性能开销**：系统调用涉及在用户模式和内核模式之间切换，这可能会减慢程序执行速度。
- **安全风险**：系统调用的不当使用或漏洞可能导致安全漏洞或未经授权访问系统资源。
- **错误处理复杂性**：处理系统调用中的错误，如资源分配失败或超时，可能很复杂，需要仔细编程。
- **兼容性挑战**：不同操作系统之间的系统调用可能有所不同，要求开发人员编写可在多个平台上工作的代码。
- **资源消耗**：系统调用可以消耗大量系统资源，特别是在许多并发进程频繁调用的环境中。

## 结论

总之，系统调用是计算机程序与操作系统交互的重要部分。它们为应用程序提供了请求操作系统服务的方式，如访问文件、管理内存或通过网络通信。系统调用充当用户级程序与操作系统内核处理的低级操作之间的桥梁。了解系统调用对于开发人员来说至关重要，以便创建能够有效利用底层操作系统全部功能的高效且功能强大的软件。




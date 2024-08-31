# 在 C 中获取/设置进程资源限制

**getrlimit()** 和 **setrlimit()** 系统调用可用于获取和设置与进程相关联的资源限制，例如文件、CPU、内存等。

> 每种资源都有相关的**软限制和硬限制**。
>
> - **软限制**：软限制是内核对相应资源实际执行的限制。
> - **硬限制**：硬限制作为软限制的最高限额。
>
> **软限制的范围在 0 到硬限制之间。**

这两个限制由以下结构定义：

```c
struct rlimit {
    rlim_t rlim_cur;  
    rlim_t rlim_max;  
};
```

系统调用的签名是：

```c
int getrlimit(int resource, struct rlimit *rlim);
int setrlimit(int resource, const struct rlimit *rlim);
```

**resource** 指的是你想要检索或修改的资源限制。

要**设置**这两个限制，将新值设置到 rlimit 结构的元素中。

要**获取**这两个限制，传递 rlim 的地址。成功的 getrlimit() 调用会将 rlimit 元素设置为限制。

成功时，两者都返回**0**。出错时，返回**-1**，并且 errno 被适当设置。

```
下面是一个程序示例，通过将最大文件描述符数加一的值更改为 3 来演示系统调用。
```

```c
#include <stdio.h>
#include <sys/resource.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() { 
    struct rlimit old_lim, lim, new_lim; 
    if ( getrlimit(RLIMIT_NOFILE, &old_lim) == 0) 
        printf("Old limits -> soft limit= %ld \t"
                " hard limit= %ld \n", old_lim.rlim_cur,  
                old_lim.rlim_max);
    else
        fprintf(stderr, "%s\n", strerror(errno));

    lim.rlim_cur = 3; 
    lim.rlim_max = 1024; 

    if (setrlimit(RLIMIT_NOFILE, &lim) == -1) 
        fprintf(stderr, "%s\n", strerror(errno));

    if ( getrlimit(RLIMIT_NOFILE, &new_lim) == 0) 
        printf("New limits -> soft limit= %ld \t"
                " hard limit= %ld \n", new_lim.rlim_cur,  
                new_lim.rlim_max);
    else
        fprintf(stderr, "%s\n", strerror(errno));

    return 0; 
}
```

输出：

```
Old limits -> soft limit= 1048576      hard limit= 1048576
New limits -> soft limit= 3              hard limit= 1024
```

旧限制的值可能会根据系统而有所不同。

```
现在，如果你尝试打开一个新文件，它将显示运行时错误，因为最多可以打开 3 个文件，而那些已经被系统打开(STDIN, STDOUT, STDERR)。
```

```c
#include <stdio.h>
#include <sys/resource.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() { 
    struct rlimit old_lim, lim, new_lim; 
    if ( getrlimit(RLIMIT_NOFILE, &old_lim) == 0) 
        printf("Old limits -> soft limit= %ld \t"
                " hard limit= %ld \n", old_lim.rlim_cur,  
                old_lim.rlim_max);
    else
        fprintf(stderr, "%s\n", strerror(errno));

    lim.rlim_cur = 3; 
    lim.rlim_max = 1024; 

    if (setrlimit(RLIMIT_NOFILE, &lim) == -1) 
        fprintf(stderr, "%s\n", strerror(errno));

    if ( getrlimit(RLIMIT_NOFILE, &new_lim) == 0) 
        printf("New limits -> soft limit= %ld \t"
                " hard limit= %ld \n", new_lim.rlim_cur,  
                new_lim.rlim_max);
    else
        fprintf(stderr, "%s\n", strerror(errno));

    if (open("foo.txt", O_WRONLY | O_CREAT, 0) == -1) 
        fprintf(stderr, "%s\n", strerror(errno));
    else
        printf("Opened successfully\n");

    return 0; 
}
```

输出：

```
Old limits -> soft limit= 1048576      hard limit= 1048576

New limits -> soft limit= 3                      hard limit= 1024

Too many open files
```

还有另一个系统调用 **prlimit()**，它结合了这两个系统调用的功能。

更多详情，通过输入以下命令查看手册：

```
man 2 prlimit
```


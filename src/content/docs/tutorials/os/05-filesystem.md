---
title: "第 5 章 · 文件系统"
description: "ext4、XFS、NFS、tmpfs、procfs 的数据结构天差地别，但 open/read/write 对它们一视同仁 —— 这层统一接口就是 VFS（虚拟文件系统）。它的四个核心对象："
series: os
sidebar:
  order: 5
  label: "文件系统"
difficulty: advanced
duration: 10
tableOfContents: true
---

**本章目标：**

- 说清 VFS 的四个核心对象，以及一次路径解析怎么走完 `/a/b/c.txt`
- 用「fd 表 → 打开文件表 → inode」三层结构解释 `fork`/`dup` 之后 offset 为什么共享
- 判断一次写入是否真的落盘：页缓存、回写、`fsync` 与日志各自保证什么

## 5.1 VFS：内核在文件系统之上再抽象一层

ext4、XFS、NFS、tmpfs、procfs 的数据结构天差地别，但 `open`/`read`/`write` 对它们一视同仁 —— 这层统一接口就是 VFS（虚拟文件系统）。它的四个核心对象：

```text
super_block   一个已挂载文件系统的实例：块大小、总容量、根 inode、挂载选项
inode         一个文件的元数据本体：权限、属主、大小、时间戳、数据块位置
dentry        目录项缓存：一条 "名字 → inode" 的映射，路径解析靠它加速
file          一次「打开」这个动作的记录：当前偏移、打开标志、指向 inode
```

关键在于**内存对象与磁盘格式是两回事**：磁盘上 ext4 的 inode 表布局由具体文件系统决定，而内核里操作的是统一的 `struct inode`。每个文件系统通过一组函数表把统一接口翻译成自己的实现：

```text
struct file_operations      read_iter / write_iter / llseek / mmap / flush
struct super_operations     write_inode / sync_fs / statfs
struct inode_operations     lookup / create / link / unlink / rename / getattr
struct address_space        页缓存：inode → 一组缓存页（第 4 章的映射页由此供页）
```

好处立刻显现：`grep` 不需要知道自己在读 ext4 还是 NFS；而代价也在这里 —— 每层抽象都有开销，网络文件系统上一次 `stat` 可能是一次 RPC（[第 6 章 · 输入输出与中断](../06-io-interrupt/) 讨论 IO 栈时还会碰到）。

## 5.2 inode、目录项，以及权限位从哪来

**目录不是文件的容器，目录本身只是一个文件**，内容是一串「名字 + inode 号」的记录。文件名与内容分居两处，这个事实能解释本章一半的现象。

```bash
ls -li /etc/hostname            # 第一列就是 inode 号
stat /etc/hostname              # inode、Links、Access/Modify/Change、属主与 mode
df -i /                          # inode 用尽也会 "No space left"，哪怕磁盘还有空
```

路径 `/etc/nginx/nginx.conf` 的解析是逐分量进行的：从当前目录（或根）的 inode 出发，在目录内容里查名字拿到下一个 inode 号，逐级重复；每步都查 **dentry 缓存**，命中就不用读盘。目录项有正/负两种（不存在的名字也会被缓存，这就是反复 `stat` 不存在文件时「第一次慢、后面快」的原因），`mount -o remount`、重命名或创建都会让相关 dentry 失效。

时间戳三个，语义经常被误读：

```text
atime  内容被读        mtime 内容被改        ctime inode 本身被改（含 chmod、改名、链接数变化）
→ ctime 不是"创建时间"：它记录的是 inode 变更。ext4 的 inode 里另有 crtime，但传统上不导出，`stat -c %W` 在很多文件系统上仍是空
→ 大量只读业务想省 IO 可挂 noatime（但依赖 atime 的程序如 mutt 会受影响）
```

权限位在 inode 的 mode 字段里：`rwxrwxrwx` 九位加上 setuid/setgid/sticky 三位。

```bash
ls -l /usr/bin/passwd            # -rwsr-xr-x：setuid 位，执行者临时获得文件属主(root)身份
ls -ld /tmp                      # drwxrwxrwt：sticky 位，目录里只有属主能删自己的文件
umask                            # 新建文件的屏蔽掩码，常见 022 → 新建文件 0644、目录 0755
namei -l /etc/nginx/nginx.conf   # 逐分量打印权限，排查"目录少 x 位"的利器
```

检查发生在 **open 那一刻**：内核拿进程的 cred（uid/gid/补充组）与 inode 的 mode 比对，通过后在 `file` 对象上记下读/写权限；之后的每次 `read`/`write` **不再重复检查权限**，只检查 fd 是否合法。这就是「拿到只读 fd 就写不了」的实现方式，也是 ACL 与 LSM（SELinux/AppArmor）在 open 时追加判定的位置。注意 `umask` 只影响**创建**时（`open(..., 0666)` 的 mode 会被 `&= ~umask`），改已有文件要用 `chmod`。

:::caution[目录的 x 位与 r 位是两件事]
`r` 允许列出目录内容（`ls dir`），`x` 允许**穿过**它去访问里面的路径（`ls dir/file`）。只给 r 不给 x 是最常见的「明明有权限却 Permission denied」根因，用上面那条 `namei -l` 一眼能定位到缺哪一级。
:::

## 5.3 打开文件表：fd 的三层结构

一个整数 fd 背后其实是三层对象，理解它才算真懂 Unix IO：

```text
第 1 层  进程 fd 表        每进程私有：数组下标 = fd，项里存指针 + FD_CLOEXEC 标志
第 2 层  打开文件表项      struct file：当前偏移 f_pos、打开标志(O_APPEND/O_NONBLOCK)、引用计数
                          ← 每次 open() 新建一项；fork/dup 只是让多个 fd 指向同一项
第 3 层  inode 表          每文件系统实例内每文件一项：元数据、页缓存、i_count
                          ← 同一文件被 open 两次 → 两个第 2 层项，但共享同一个第 3 层
```

```bash
ls -l /proc/self/fd          # 第 1 层：fd → 目标路径
cat /proc/self/fdinfo/3      # 第 2 层：pos= 与 flags= 就是这个 file 对象的内容
cat /proc/sys/fs/file-nr     # 已分配的打开文件表项数（三个数字：已用/空闲/上限）
```

于是几条行为完全可以推导：

```text
两次独立 open(同一文件)  → 各自偏移，互不干扰（两个 file 项）
fork 之后父子            → fd 表被复制，但指向同一个 file 项 → 偏移共享！
dup/dup2                 → 同进程内两个 fd 指向同一 file 项 → 偏移共享
exec 且设了 FD_CLOEXEC   → 第 1 层项被清掉，file 项引用计数减一
```

**错误写法 → 正确写法**：多线程/多进程共用一个 fd 的经典事故。

```c
/* 错误：父子（或 dup 出来的两个 fd）各自 lseek 再写，以为互不影响 */
lseek(fd, 0, SEEK_SET);
write(fd, buf, n);           /* 偏移是共享的：另一个进程的一 lseek 就把你的位置改了 */

/* 正确：用不带偏移状态的调用，位置由参数给定 */
pread(fd, buf, n, off);      /* 读 off 处，不改 f_pos，也不额外产生竞态 */
pwrite(fd, buf, n, off);
```

原因：`lseek` + `write` 是两步、作用于共享的 `f_pos`；`pread`/`pwrite` 把位置作为参数，一步完成，既省一次系统调用又消除这一类竞态（注意：它不替代文件锁，追加场景另需 `O_APPEND`，内核保证「定位到末尾 + 写」是原子的）。

## 5.4 块缓存、预读与回写

Linux 的文件缓存就是[第 4 章 · 内存管理与虚拟内存](../04-memory/)里的**页缓存**：以页为单位缓存文件内容，且与进程地址空间共用同一份物理页（`mmap` 因此能做到零拷贝）。

```text
读路径   read → VFS → 文件系统 → 查 address_space → 命中：拷给用户缓冲（不碰盘）
                                        → 未命中：分配页 → 提交 BIO → 睡眠等 IO
写路径   write → 拷进页缓存、标脏 → 立刻返回（writeback 模式，默认）
回写     脏页由内核线程定时/按水位刷盘：脏页比例超阈值时写入会被迫同步
```

```bash
free -h                                   # buff/cache 就是页缓存+块缓存，可回收，别当成"已用满"
sudo sysctl -a 2>/dev/null | grep -E '^vm\.(dirty_.*(ratio|bytes))'   # 回写水位，以实测为准
cat /proc/vmstat | grep -E 'pgpgin|pgpgout|pgmajfault|dirty|writeback'
echo 3 | sudo tee /proc/sys/vm/drop_caches   # 实验用！生产别跑
```

**预读（readahead）**：内核检测到连续访问模式后，把后面若干页一起读进来，随机单页 IO 变顺序批量 IO。这也是「读 1 字节可能引发 128 KB 磁盘 IO」的原因。反过来，随机访问时预读是浪费，可以用 `posix_fadvise` 显式提示：

```c
posix_fadvise(fd, 0, 0, POSIX_FADV_SEQUENTIAL);   /* 顺序读：放大预读窗口 */
posix_fadvise(fd, off, len, POSIX_FADV_DONTNEED); /* 读过即弃：主动丢页，保护缓存 */
posix_fadvise(fd, 0, 0, POSIX_FADV_RANDOM);       /* 关闭预读：数据库随机点查常用 */
```

:::tip[缓存让「读文件很快」，也让「删大文件很快」]
`rm` 一个正在被大量读的日志文件，页缓存里的脏页仍要刷盘，删除操作本身只改元数据；而写完立刻 `read` 同一区间几乎不花时间 —— 判断「程序 IO 慢」时，先确认它是冷读还是热读，两者根本不是同一个量级（对照 1.7 节的冷热实验）。
:::

## 5.5 日志与崩溃一致性

断电时最坏的情况不是丢数据，而是**元数据自相矛盾**（块位图说某块空闲，inode 却指向它）。老式做法是开机 `fsck` 全盘扫描，代价随容量线性增长。日志文件系统改为**先写日志再改主结构**：崩溃后只需重放/回滚日志，秒级恢复。

```text
data=journal      数据与元数据都先进日志          最安全，写两遍，性能最差
data=ordered      只记元数据，但保证"数据先落盘再提交元数据"  ← ext3/4 默认
data=writeback    只记元数据，不保证顺序            快，崩溃后可能短暂读到旧的块内容
```

日志保证的是**文件系统自身结构一致**，不是「你的数据一定保住了」。想让某个时刻之前你的写入真正安全，必须显式 `fsync`。这里藏着本章最重要的坑：

**错误写法 → 正确写法**（「原子替换配置文件」）：

```c
/* 错误：以为 rename 之后崩溃也不会丢内容 */
int fd = open("app.conf.tmp", O_WRONLY | O_CREAT | O_TRUNC, 0644);
write(fd, data, len);
close(fd);
rename("app.conf.tmp", "app.conf");      /* rename 只保证「指针切换」是原子的 */
/* 崩溃时刻落在 rename 之后、脏数据回写之前 → app.conf 存在但内容是空的/旧的 */

/* 正确：先保证内容落盘，再改名，最后让目录项落盘 */
int fd = open("app.conf.tmp", O_WRONLY | O_CREAT | O_TRUNC, 0644);
write(fd, data, len);
fsync(fd);  close(fd);                   /* 1) 数据 + 该 inode 落盘 */
rename("app.conf.tmp", "app.conf");      /* 2) 原子替换 */
int dfd = open(".", O_RDONLY | O_DIRECTORY);
fsync(dfd); close(dfd);                  /* 3) 目录项本身落盘 —— 最常被漏掉的一步 */
```

原因：`rename` 修改的是**父目录**的内容（一条目录项），这条元数据也要落盘；而 ext4 的延迟分配（delayed allocation）会让数据块在 `close` 之后仍留在内存里。只 `fsync` 文件不 `fsync` 目录，是「配置莫名变空」故障的标准成因。同理，`fdatasync` 只刷数据与必要的元数据（比 `fsync` 少刷 inode 时间戳等），适合数据库日志；`sync` 是全局的，代价大。

:::danger[关掉写屏障换不来安全]
磁盘/SSD 自带易失性写缓存时，`nobarrier`（老内核选项）允许设备乱序确认，日志也就失去了意义。别为了几毫秒的 `fsync` 去关它；要提速应该换带掉电保护电容的盘或用 RAID 卡缓存（以设备文档为准）。
:::

## 5.6 常见文件系统与选型

```text
ext4        通用默认：稳定、可缩容、日志三模式；超大目录/大量并发扩展稍弱
XFS         大文件、高并发扩展、并行元数据；不可缩容；CentOS/RHEL 系默认
Btrfs       CoW + 快照 + 校验和 + 子卷；写放大与内存占用要注意
ZFS         CoW、校验、ARC 缓存、条带化一体；许可证导致不进主线内核（OpenZFS 另装）
F2FS        为闪存写放大设计的日志结构 FS，Android /dev/block 与嵌入式常见
tmpfs       内存 + 可换出，/dev/shm 与 /run 用它；容量算在内存与 swap 头上
overlayfs   容器镜像的分层：lowerdir 只读 + upperdir 写时复制，合并视图
squashfs    只读压缩，Live CD 与 AppImage/snap 的内层
vfat/exfat  U 盘与 EFI 系统分区的互通格式；无权限语义，靠挂载时 fmask/dmask 伪造
NFS/CIFS    网络：属性缓存与语义不一致是排障重点
9p/virtiofs 虚拟机与宿主机共享目录
procfs/sysfs/cgroup 伪文件系统：内核状态的接口，不占磁盘（第 1 章已用过）
fuse        用户态文件系统：好写但慢一次上下文切换，s3fs/sshfs 都基于它
```

选型三问：**要快照/校验和吗**（要 → Btrfs/ZFS/CoW 类，但注意数据库的 CoW 写放大）；**是大文件顺序还是海量小文件**（前者 XFS，后者 ext4 与合理目录散列，或干脆别放文件系统里）；**能容忍多大的一致性代价**（强一致 → 关掉延迟相关优化、认真写 `fsync`）。

```bash
df -T -t ext4 -t xfs -t btrfs          # 看已挂载类型（-T 打印 Type 列）
mount | grep ' / '                     # 挂载选项：noatime、commit=、data=、discard
sudo tune2fs -l /dev/sda2 | head -20   # ext4 超级块：特性、日志大小（xfs_info 对应 XFS）
dumpe2fs -h /dev/sda2 2>/dev/null | grep -E 'Block count|Inode count|Mount state'
```

## 5.7 综合练习：链接、inode 与一次不安全的写入

```bash
mkdir -p /tmp/os5/dir1 && cd /tmp/os5
echo hello > file.txt
ln file.txt hard.txt                   # 硬链接：又一个目录项指向同一 inode
ln -s file.txt soft.txt                # 符号链接：自己的 inode，内容是路径字符串
ln -s /etc/passwd abs.txt && ln -s ../file.txt rel.txt
ls -li                                 # 对比四个 inode 号：file.txt 与 hard.txt 相同
stat -c '%n inode=%i links=%h type=%F' file.txt hard.txt soft.txt
readlink soft.txt                      # 只有符号链接能 readlink 出内容
cat soft.txt && cat hard.txt           # 打开软链时内核先解析路径，多一步 lookup
```

1. `rm file.txt` 之后 `hard.txt` 还在吗？`soft.txt` 呢？用 5.2「目录只是名字 → inode 号」解释，并说明链接数何时减到 0、数据块何时释放（`stat -c %h` 观察）。
2. `mkdir sub && echo outer > sub/x.txt && ln -s sub link && echo inner > x.txt`，然后 `cd link` 再 `cat x.txt` 与 `cat ../x.txt`：两个命令分别读到哪一份？为什么？（提示：`..` 与符号链接的解析发生在**内核路径解析**中，`pwd` 与 `pwd -P` 也据此区分）
3. `ln` 跨文件系统（`ln /tmp/os5/file.txt /dev/shm/x`）会失败，`ln -s` 却可以 —— 用 inode 号的作用域解释这条限制。
4. 最后写一个 20 行的 C/Python 程序：按 5.5 的错误写法生成 10 MB 文件并 `rename`，在写入过程中用 `kill -9` 杀掉自己，再重开系统或用 `dmesg` 观察结果；然后改成正确写法（内容 `fsync` → rename → 目录 `fsync`）重跑，比较是否还出现「文件存在但内容不完整」。

## 本章小结

- VFS 用 super_block / inode / dentry / file 四个内存对象把完全不同的文件系统统一成 `open`/`read`/`write`，磁盘格式与内存对象是两回事
- 目录只是「名字 → inode 号」的记录，路径解析逐分量查 dentry 缓存；权限位在 inode 里，检查发生在 open 那一刻，之后只看 fd 的已授予权限
- fd 的三层结构（进程 fd 表 / 打开文件表项 / inode）解释了 `fork`、`dup` 之后偏移为何共享 —— 因此并发读写同一 fd 要用 `pread`/`pwrite` 与 `O_APPEND`
- 页缓存 + 预读让热读快、冷读慢，`fsync` 才决定持久性；`rename` 替换文件必须连父目录一起 `fsync`，否则崩溃后只剩一个空文件

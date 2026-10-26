---
title: "第 9 章 · 虚拟化与容器的内核基础"
description: "虚拟化的目标是：一个物理机上跑多个互不知情的客户机（guest），每个都以为自己独占整台硬件。中间那层叫 hypervisor（虚拟机监视器，VMM）。"
series: os
sidebar:
  order: 9
  label: "虚拟化与容器的内核基础"
difficulty: advanced
duration: 7
---

**本章目标：**

- 分清全虚拟、半虚拟、硬件辅助虚拟化三条路线，知道各自的代价
- 说清"虚拟机"与"容器"的隔离边界差在哪一层，以及容器由哪些内核机制拼成
- 能解释为什么一个容器**不是**强安全边界，以及需要更强隔离时怎么办

## 9.1 虚拟化的两种路线：全虚拟与半虚拟

**虚拟化**的目标是：一个物理机上跑多个互不知情的客户机（guest），每个都以为自己独占整台硬件。中间那层叫 **hypervisor**（虚拟机监视器，VMM）。

```text
Type-1 裸机   hypervisor 直接跑在硬件上（KVM、Xen、VMware ESXi）  —— 生产主流
Type-2 宿主   hypervisor 是个普通进程，跑在宿主 OS 上（VirtualBox、QEMU 纯模拟）
```

要虚拟化，就得拦截 guest 对**特权指令**（改页表、操作中断描述符表、访问 IO 端口）的执行。历史上两条路：

```text
全虚拟 (full)      guest 完全不知情，VMM 靠二进制翻译/trap-and-emulate
                   拦截特权指令 → 兼容任何 OS（连 Windows 都能跑），但慢
半虚拟 (para)      guest 内核被改过，知道自己在被虚拟化，需要特权操作时
                   主动调用 VMM 提供的接口（hypercall）→ 快，但要改 guest
```

半虚拟的代表是 **virtio**：guest 不再模拟一块真网卡/真磁盘，而是和宿主约定一套高效的共享内存环形队列，把"发包/收包"变成读写这段队列——省掉了逐条拦截模拟的巨大开销。Linux 里的 `virtio_net`、`virtio_blk` 就是它的驱动。

:::tip[怎么判断自己跑在哪]

```bash
systemd-detect-virt              # kvm / qemu / docker / none
lscpu | grep -i hypervisor       # 非空说明在虚拟机里
cat /proc/cpuinfo | grep flags   # 看有没有 virt 相关标志
```
:::

## 9.2 硬件辅助虚拟化

纯软件全虚拟太累（要翻译每条特权指令），现代 CPU 干脆把虚拟化做进硬件：Intel 叫 **VT-x**，AMD 叫 **AMD-V**。它们在传统的 ring 0–3 之下增加了一个 **root mode**（戏称 ring -1）。

```text
non-root mode  guest OS 跑这里：ring 0 执行特权指令会立刻触发 VM exit
root mode      hypervisor 跑这里：接管 VM exit，模拟或处理后 VM entry 回 guest

VMCS           硬件状态区，保存 guest/宿主各自的寄存器与控制位
EPT / NPT      二级页表（Intel EPT / AMD NPT）：guest 访存由硬件直接翻译，
               不必每次都 VM exit 到软件影子页表
```

关键收益：以前 guest 一条特权指令、一次访存都可能要软件介入，现在硬件自动"掉出"到 hypervisor，处理完再"跳回"，切换开销小且可预测。**KVM** 正是把 Linux 内核改造成一个能操作这些硬件扩展的 type-1 hypervisor：应用通过 `/dev/kvm` 下发 `KVM_CREATE_VM`、`KVM_RUN` 等 ioctl，QEMU 负责设备模拟，硬件负责 CPU 虚拟化。

```bash
# 用 KVM 加速起一台虚拟机：-accel kvm 让 QEMU 走 /dev/kvm 而非纯软件模拟
qemu-system-x86_64 -enable-kvm -m 2G -smp 2 \
  -drive if=virtio,file=disk.qcow2 \
  -netdev user,id=n0 -device virtio-net-pci,netdev=n0
# 若机器上没有 /dev/kvm 或不支持 VT-x，QEMU 退回 TCG（纯软件二进制翻译），慢一个量级
```

:::caution[VM exit 风暴]
硬件辅助不等于零成本。设备模拟、某些 MSR 读写仍会触发 VM exit，陷入 hypervisor 再回来。若客户机频繁访问模拟设备（比如没上 virtio 而用模拟 IDE/网卡），exit 次数暴涨、性能急剧下降——这也是"给 VM 用半虚拟设备"至今仍是最佳实践的原因。
:::

## 9.3 虚拟机与容器的隔离边界

这是本章最重要的一张对比表。它们的"隔离"发生在完全不同的层。

```text
维度      虚拟机 (VM)                     容器 (container)
内核      各自带一份 guest 内核           共享宿主内核，没有自己的内核
边界      硬件级（VT-x/EPT，ring -1）      内核级（namespace 视图 + cgroup 配额）
启动      秒~分钟（要起内核）             毫秒（就是个进程）
镜像      含完整 OS，GB 级                只含用户态文件，MB 级
密度      一台机几个~几十个               一台机成百上千
逃逸难度  要破 hypervisor，门槛最高        要破宿主内核，共享内核是天然风险
```

一句话：**VM 隔离的是"机器"，容器隔离的是"进程能看见什么、能用多少"**。容器本质仍是宿主上的普通进程，只是给它套上了若干视野限制与资源上限——这些机制就是下面的 namespace 与 cgroup。

:::tip[别把 hypervisor、runtime、编排混为一谈]
`docker`/`podman` 是命令行前端，真正起容器的是 containerd → runc（runc 才调 namespace/cgroup/seccomp 这些系统调用）；Kubernetes 是跨机器的编排器。同理 libvirt 只是 QEMU/KVM 的管理层。理解"容器最终就是一组 clone/unshare + 写 cgroup 文件 + 装 seccomp 过滤"，就不会被工具名词绕晕。
:::

## 9.4 namespace 有哪几种

namespace 解决的是"隔离可见性"：让一个进程看到一套独立的系统资源标识。Linux 目前有这几种：

```text
mount   独立的文件系统挂载视图（自己的 /）
UTS     独立的主机名与域名（hostname）
IPC     独立的 System V IPC / POSIX 消息队列
PID     独立的进程号空间，里面的 1 号是它自己看到的 init
NET     独立的网络栈（网卡、端口、路由表、iptables）
USER    独立的_uid/gid 映射（容器里的 root 可映射到宿主的普通用户）
CGROUP  独立地看到 cgroup 层级
TIME    独立的 CLOCK_MONOTONIC/BOOTTIME 偏移
```

创建方式：`clone()` 带 `CLONE_NEW*` 标志，或对已运行进程 `unshare()`，或进入别人的 namespace 用 `setns()`。

```c
#define _GNU_SOURCE
#include <sched.h>
// 新建 PID、NET、mount、UTS、IPC 五个 namespace 的容器化子进程
int flags = CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC;
pid_t child = clone(container_main, stack_top, flags | SIGCHLD, NULL);
```

```bash
ls -l /proc/<PID>/ns        # 用 inode 号判断两个进程是否共享同一 namespace
```

:::caution[PID namespace 里的两个坑]
容器里的 PID 1 要负责收尸（回收僵尸子进程）和转发信号，否则子进程变僵尸、`Ctrl-C` 无效——这也是很多镜像要 `--init` 或用 tini/dumb-init 当 PID 1 的原因。另外宿主上 `kill` 容器内进程要用**宿主的 PID**，不是容器里看到的那个小数字。
:::

## 9.5 cgroup 限制什么

namespace 管"能看见什么"，**cgroup**（control group）管"能用多少"。它按控制器给进程组设资源上限、做层级分配与统计。

```text
cpu      限制 CPU 时间份额（cpu.max = "quota period"）
memory   限制内存用量，超限先回收、再不够就 OOM kill（memory.max）
io       限制块设备的读写带宽/IOPS
pids     限制能创建的进程/线程数，防 fork 炸弹（pids.max）
```

以 cgroup v2 统一层级为例，限"最多 1.5 核、512MB 内存、100 个进程"：

```bash
# 需以 root 或已委派权限操作；路径以实测的 /sys/fs/cgroup 布局为准
echo "150000 100000" > demo/cpu.max       # 每 100ms 周期最多用 150ms CPU = 1.5 核
echo $((512*1024*1024)) > demo/memory.max
echo 100 > demo/pids.max
echo $PROCES_PID > demo/cgroup.procs      # 把进程挂进这个组
```

:::tip[内存超限不是报错是杀进程]
`memory.max` 触顶时内核先回收该组的页缓存，仍不足就对该组触发 OOM killer 直接杀进程（`dmesg` 里能看到 `Memory cgroup out of memory`）。这与"整机没内存"是两回事——cgroup 让一个失控容器只拖垮自己。
:::

统计与"当前用量"可以直接读文件，容器监控工具本质就在读这些：

```bash
cat demo/memory.current     # 该组实时内存占用（含页缓存）
cat demo/memory.stat        # 细分：anon / file / slab / 各级回收计数
cat demo/cpu.stat           # nr_periods / nr_throttled：被限流了多少周期
# nr_throttled 持续上涨 = 容器被 cpu.max 卡住，是"CPU 不够"的硬证据
```

## 9.6 seccomp、能力裁剪与"容器不是安全边界"

光有 namespace + cgroup，容器里的"root"仍能调用所有系统调用、拥有 `CAP_SYS_ADMIN` 之类特权。再加两层收窄攻击面：

```text
capabilities  把传统的 root 全权拆成一堆细分能力位（CAP_NET_BIND_SERVICE…）
              默认 Docker 只给一小撮，多余的直接 drop
seccomp       给进程装一个系统调用过滤器（BPF 程序）：
              允许清单内的 syscall，清单外的一律拒绝或杀进程
```

Docker 默认用一份 seccomp profile 挡掉 `reboot`、加载内核模块、`ptrace` 跨容器等危险调用，并 drop 掉大部分 capability。

但必须清醒：**一个容器不是强安全边界**。因为所有容器共享同一个宿主内核，一次内核漏洞（提权 / 越界读写）就可能突破 namespace 逃逸到宿主，进而影响同宿主所有容器。多租户、跑不可信代码的场景，靠"共享内核 + 过滤器"不够，需要额外的**纵深**：

:::danger[容器逃逸是真实的]
不要用 `--privileged`（把宿主几乎所有设备与能力都给容器），别把宿主 `/`、`/var/run/docker.sock` 挂进容器，别随意 `--cap-add SYS_ADMIN`。需要"每租户一个真内核"时，选 gVisor（用户态内核拦截 syscall）、Kata Containers（每个容器套一层轻量 VM）或直接上 VM。
:::

```text
隔离强度（由弱到强）：
  runc 容器  <  加了 seccomp/caps 的 runc  <  gVisor  <  Kata/微VM  <  传统 VM
```

## 9.7 综合练习：搭一个"最小容器"并验证边界

不依赖 Docker，用命令行手工体验 namespace + cgroup：

```bash
# 1) 新 PID/UTS/mount namespace 里起一个 shell，观察它自己是 PID 1
sudo unshare --fork --pid --uts --mount-proc bash
hostname tryme; hostname            # UTS namespace 生效，宿主名没变
ps -e                               # 只看得到这个 PID namespace 内的进程
exit

# 2) 给一个进程组限 CPU，跑满核看是否被压到约 0.5 核
sudo cgcreate -g cpu:/tryme        # cgroup-tools（以发行版实测为准）
echo "50000 100000" | sudo tee /sys/fs/cgroup/cpu/tryme/cpu.max
sudo cgexec -g cpu:tryme yes > /dev/null &
top -H                             # 该进程占用的 CPU 被压在 ~50%
```

对照本章：`unshare` 演示了 9.4 的 namespace 视图隔离，`cpu.max` 演示了 9.5 的配额；如果这台机器再叠上 seccomp 与 cap drop，就是 9.6 的完整链路。理解"容器 = 进程 + 视野限制 + 配额 + 系统调用过滤"，就理解了它为什么轻、也理解了它为什么不如 VM 硬。锁与调度如何影响容器内多核表现，回到 [第 7 章 · 并发与锁](../07-concurrency-locks/) 与 [第 10 章 · 性能观测](../10-performance-observability/)。

## 本章小结

- 全虚拟靠 trap-and-emulate 兼容任意 guest 但慢，半虚拟（virtio）让 guest 主动走 hypercall 换性能，硬件辅助（VT-x/AMD-V、EPT）把拦截下沉进 CPU，KVM 即据此把 Linux 变成 type-1 hypervisor
- VM 隔离"机器"、自带内核、边界在硬件；容器隔离"进程视野与配额"、共享宿主内核、边界在 namespace+cgroup，启动毫秒、密度高但多一层内核共享风险
- namespace 提供 mount/UTS/IPC/PID/NET/USER/CGROUP/TIME 等独立视图，cgroup 限制 cpu/memory/io/pids 用量并做统计
- capabilities 拆分 root 特权、seccomp 过滤系统调用；共享内核决定了容器不是强安全边界，不可信多租户要上 gVisor/Kata/VM
